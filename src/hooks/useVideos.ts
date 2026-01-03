import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Video {
  id: string;
  user_id: string;
  heygen_video_id: string | null;
  video_url: string | null;
  thumbnail_url: string | null;
  target_role: string | null;
  target_countries: string[] | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  user_id: string;
  payment_type: string;
  paypal_transaction_id: string | null;
  amount: number;
  status: string;
  video_id: string | null;
  created_at: string;
}

export const useVideos = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserVideos = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("videos")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching videos:", error);
    } else {
      setVideos(data || []);
    }
    setIsLoading(false);
  };

  const fetchAllVideos = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("videos")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching all videos:", error);
    } else {
      setVideos(data || []);
    }
    setIsLoading(false);
  };

  const createVideo = async (videoData: {
    heygen_video_id?: string;
    target_role: string;
    target_countries: string[];
  }) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("videos")
      .insert({
        user_id: user.id,
        heygen_video_id: videoData.heygen_video_id,
        target_role: videoData.target_role,
        target_countries: videoData.target_countries,
        status: "pending",
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const updateVideo = async (videoId: string, updates: Partial<Video>) => {
    const { data, error } = await supabase
      .from("videos")
      .update(updates)
      .eq("id", videoId)
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  useEffect(() => {
    fetchUserVideos();
  }, []);

  return {
    videos,
    isLoading,
    fetchUserVideos,
    fetchAllVideos,
    createVideo,
    updateVideo,
  };
};

export const usePayments = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserPayments = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("payments")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching payments:", error);
    } else {
      setPayments(data || []);
    }
    setIsLoading(false);
  };

  const createPayment = async (paymentData: {
    payment_type: "video" | "subscription";
    amount: number;
    video_id?: string;
  }) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("payments")
      .insert({
        user_id: user.id,
        payment_type: paymentData.payment_type,
        amount: paymentData.amount,
        video_id: paymentData.video_id,
        status: "pending",
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const hasActiveSubscription = async (): Promise<boolean> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data, error } = await supabase
      .from("payments")
      .select("*")
      .eq("user_id", user.id)
      .eq("payment_type", "subscription")
      .eq("status", "completed")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !data) return false;

    // Check if subscription is within the last 30 days
    const createdAt = new Date(data.created_at);
    const now = new Date();
    const daysDiff = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
    return daysDiff <= 30;
  };

  useEffect(() => {
    fetchUserPayments();
  }, []);

  return {
    payments,
    isLoading,
    fetchUserPayments,
    createPayment,
    hasActiveSubscription,
  };
};
