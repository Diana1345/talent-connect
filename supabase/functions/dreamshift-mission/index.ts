import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type" };

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  const { profession, level, previousPerformance } = await req.json();
  const prompt = `Generate one realistic educational DreamShift career simulation mission. Profession: ${profession}. Level: ${level}. Previous performance: ${JSON.stringify(previousPerformance || [])}. Keep the first mission under 10 minutes when no prior performance exists. Avoid repetitive tasks. Return strict JSON with title, scenario, objective, deliverables array, difficulty, estimated_time, evaluation_criteria array.`;
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${Deno.env.get("OPENAI_API_KEY")}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: "gpt-4o-mini", messages: [{ role: "system", content: "You are a realistic career simulation manager and mentor." }, { role: "user", content: prompt }], response_format: { type: "json_object" } }),
  });
  const data = await response.json();
  return new Response(data.choices?.[0]?.message?.content || "{}", { headers: { ...corsHeaders, "Content-Type": "application/json" } });
});
