import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface VideoRequest {
  cvText?: string;
  linkedinText?: string;
  targetRole: string;
  yearsExperience: string;
  keyStrengths?: string;
  whyMove?: string;
  originCountry: string;
  currentCountry: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const HEYGEN_API_KEY = Deno.env.get("HEYGEN_API_KEY");
    if (!HEYGEN_API_KEY) {
      throw new Error("HEYGEN_API_KEY is not configured");
    }

    const body: VideoRequest = await req.json();
    console.log("Received video generation request:", JSON.stringify(body, null, 2));

    // Build the script from CV/LinkedIn text and user data
    const profileText = body.cvText || body.linkedinText || "";
    
    const script = buildVideoScript({
      profileText,
      targetRole: body.targetRole,
      yearsExperience: body.yearsExperience,
      keyStrengths: body.keyStrengths,
      whyMove: body.whyMove,
      originCountry: body.originCountry,
      currentCountry: body.currentCountry,
    });

    console.log("Generated script:", script);

    // Create video using HeyGen API
    const heygenResponse = await fetch("https://api.heygen.com/v2/video/generate", {
      method: "POST",
      headers: {
        "X-Api-Key": HEYGEN_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        video_inputs: [
          {
            character: {
              type: "avatar",
              avatar_id: "Angela-inTshirt-20220820", // Default avatar
              avatar_style: "normal",
            },
            voice: {
              type: "text",
              input_text: script,
              voice_id: "1bd001e7e50f421d891986aad5158bc8", // Default English voice
            },
            background: {
              type: "color",
              value: "#1a1a2e", // Dark background matching our theme
            },
          },
        ],
        dimension: {
          width: 1280,
          height: 720,
        },
        aspect_ratio: "16:9",
      }),
    });

    if (!heygenResponse.ok) {
      const errorText = await heygenResponse.text();
      console.error("HeyGen API error:", heygenResponse.status, errorText);
      throw new Error(`HeyGen API error: ${heygenResponse.status} - ${errorText}`);
    }

    const heygenData = await heygenResponse.json();
    console.log("HeyGen response:", JSON.stringify(heygenData, null, 2));

    return new Response(
      JSON.stringify({
        success: true,
        videoId: heygenData.data?.video_id,
        message: "Video generation started",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in generate-video function:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

function buildVideoScript(data: {
  profileText: string;
  targetRole: string;
  yearsExperience: string;
  keyStrengths?: string;
  whyMove?: string;
  originCountry: string;
  currentCountry: string;
}): string {
  const experienceLabel = {
    "0-1": "entry-level",
    "2-3": "a few years of",
    "4-5": "several years of",
    "6-10": "extensive",
    "10+": "over a decade of",
  }[data.yearsExperience] || data.yearsExperience;

  let script = `Hello! I'm a ${data.targetRole} professional with ${experienceLabel} experience. `;
  
  if (data.originCountry && data.currentCountry) {
    script += `Originally from ${data.originCountry}, I am now based in ${data.currentCountry}. `;
  }

  if (data.keyStrengths) {
    script += `My key strengths include ${data.keyStrengths}. `;
  }

  if (data.whyMove) {
    script += `${data.whyMove} `;
  }

  // Extract key points from CV/LinkedIn if available
  if (data.profileText && data.profileText.length > 50) {
    const keyPoints = extractKeyPoints(data.profileText);
    if (keyPoints) {
      script += keyPoints;
    }
  }

  script += `I am excited about new opportunities and look forward to connecting with you. Thank you for watching!`;

  return script.substring(0, 1500); // HeyGen has character limits
}

function extractKeyPoints(text: string): string {
  // Extract relevant keywords and skills from the profile text
  const keywords: string[] = [];
  
  // Common skill patterns
  const skillPatterns = [
    /(?:proficient|experienced|skilled) in ([^.]+)/gi,
    /(?:expertise|specializ(?:e|ing)) in ([^.]+)/gi,
    /skills?:?\s*([^.]+)/gi,
  ];

  for (const pattern of skillPatterns) {
    const matches = text.matchAll(pattern);
    for (const match of matches) {
      if (match[1] && match[1].length < 100) {
        keywords.push(match[1].trim());
      }
    }
  }

  if (keywords.length > 0) {
    return `I bring expertise in ${keywords.slice(0, 3).join(", ")}. `;
  }

  return "";
}
