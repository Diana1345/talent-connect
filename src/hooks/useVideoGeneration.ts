import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface VideoGenerationParams {
  cvText?: string;
  linkedinText?: string;
  targetRole: string;
  yearsExperience: string;
  keyStrengths?: string;
  whyMove?: string;
  originCountry: string;
  currentCountry: string;
}

interface VideoStatus {
  status: "pending" | "processing" | "completed" | "failed";
  videoUrl?: string;
  thumbnailUrl?: string;
  error?: string;
}

export function useVideoGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [videoStatus, setVideoStatus] = useState<VideoStatus | null>(null);

  const generateVideo = useCallback(async (params: VideoGenerationParams) => {
    setIsGenerating(true);
    setVideoStatus({ status: "pending" });

    try {
      const { data, error } = await supabase.functions.invoke("generate-video", {
        body: params,
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data.success) {
        throw new Error(data.error || "Failed to start video generation");
      }

      setVideoId(data.videoId);
      setVideoStatus({ status: "processing" });
      toast.success("Video generation started! This may take a few minutes.");

      return data.videoId;
    } catch (error) {
      console.error("Video generation error:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to generate video";
      setVideoStatus({ status: "failed", error: errorMessage });
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const checkStatus = useCallback(async (id?: string) => {
    const checkId = id || videoId;
    if (!checkId) {
      throw new Error("No video ID to check");
    }

    try {
      const { data, error } = await supabase.functions.invoke("check-video-status", {
        body: { videoId: checkId },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data.success) {
        throw new Error(data.error || "Failed to check video status");
      }

      const status: VideoStatus = {
        status: data.status === "completed" ? "completed" : 
                data.status === "failed" ? "failed" : "processing",
        videoUrl: data.videoUrl,
        thumbnailUrl: data.thumbnailUrl,
      };

      setVideoStatus(status);

      if (status.status === "completed") {
        toast.success("Your video is ready!");
      } else if (status.status === "failed") {
        toast.error("Video generation failed. Please try again.");
      }

      return status;
    } catch (error) {
      console.error("Status check error:", error);
      throw error;
    }
  }, [videoId]);

  const pollStatus = useCallback(async (id?: string, interval = 10000, maxAttempts = 30) => {
    const checkId = id || videoId;
    if (!checkId) {
      throw new Error("No video ID to poll");
    }

    let attempts = 0;

    const poll = async (): Promise<VideoStatus> => {
      attempts++;
      const status = await checkStatus(checkId);

      if (status.status === "completed" || status.status === "failed") {
        return status;
      }

      if (attempts >= maxAttempts) {
        throw new Error("Video generation timed out. Please check back later.");
      }

      await new Promise(resolve => setTimeout(resolve, interval));
      return poll();
    };

    return poll();
  }, [videoId, checkStatus]);

  return {
    generateVideo,
    checkStatus,
    pollStatus,
    isGenerating,
    videoId,
    videoStatus,
  };
}
