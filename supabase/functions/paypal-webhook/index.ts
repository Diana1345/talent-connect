import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body = await req.json();
    console.log("PayPal webhook received:", JSON.stringify(body, null, 2));

    const eventType = body.event_type;
    const resource = body.resource;

    // Handle payment completed events
    if (eventType === "PAYMENT.CAPTURE.COMPLETED" || eventType === "CHECKOUT.ORDER.APPROVED") {
      const transactionId = resource?.id || resource?.purchase_units?.[0]?.payments?.captures?.[0]?.id;
      const amount = parseFloat(resource?.amount?.value || resource?.purchase_units?.[0]?.amount?.value || "0");
      const payerEmail = resource?.payer?.email_address;
      
      console.log("Payment completed:", { transactionId, amount, payerEmail });

      if (payerEmail && transactionId) {
        // Find user by email
        const { data: profiles, error: profileError } = await supabase
          .from("profiles")
          .select("id")
          .eq("email", payerEmail)
          .maybeSingle();

        if (profileError) {
          console.error("Error finding profile:", profileError);
        }

        if (profiles) {
          // Determine payment type based on amount
          const paymentType = amount >= 49 ? "subscription" : "video";

          // Check if payment already exists
          const { data: existingPayment } = await supabase
            .from("payments")
            .select("id")
            .eq("paypal_transaction_id", transactionId)
            .maybeSingle();

          if (!existingPayment) {
            // Create new payment record
            const { error: insertError } = await supabase
              .from("payments")
              .insert({
                user_id: profiles.id,
                payment_type: paymentType,
                paypal_transaction_id: transactionId,
                amount: amount,
                status: "completed",
              });

            if (insertError) {
              console.error("Error inserting payment:", insertError);
            } else {
              console.log("Payment recorded successfully:", { paymentType, transactionId });
            }
          } else {
            // Update existing pending payment
            const { error: updateError } = await supabase
              .from("payments")
              .update({
                paypal_transaction_id: transactionId,
                status: "completed",
              })
              .eq("user_id", profiles.id)
              .eq("status", "pending")
              .eq("payment_type", paymentType);

            if (updateError) {
              console.error("Error updating payment:", updateError);
            } else {
              console.log("Payment updated successfully");
            }
          }
        }
      }
    }

    return new Response(
      JSON.stringify({ received: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Webhook error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
