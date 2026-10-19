// ==============================================================================
// Supabase Edge Function: send-email (Security-Audited)
// Handles automated transactional notifications via Resend:
// 1. Order Booking Confirmation (Dealer + ranjan@westernconsolidated.com)
// 2. Dispatch Reminder at 4:00 PM IST (Dealer + ranjan@westernconsolidated.com)
// 3. Price Support Escalation for REFER / NOT_POSSIBLE (Dealer + jai@westernconsolidated.com)
// ==============================================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-cron-secret",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const RESEND_API_URL = "https://api.resend.com/emails";
const ORDER_ADMIN_EMAIL = "ranjan@westernconsolidated.com";
const ESCALATION_ADMIN_EMAIL = "jai@westernconsolidated.com";
const DEFAULT_FROM_EMAIL = "Western Consolidated <notifications@westernconsolidated.com>";

const formatINR = (amount: number | string): string => {
  const num = Number(amount);
  return isNaN(num) ? "" : "₹" + num.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

function isValidEmail(email: string): boolean {
  if (!email || typeof email !== "string") return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

// Authenticates caller session token and retrieves user ID and profile role
async function authenticateCaller(req: Request, supabase: any) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { user: null, role: null, error: "Missing or malformed Authorization header" };
  }

  const token = authHeader.replace("Bearer ", "").trim();
  const { data: { user }, error: authErr } = await supabase.auth.getUser(token);

  if (authErr || !user) {
    return { user: null, role: null, error: authErr?.message || "Invalid or expired session token" };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, email, firm_name")
    .eq("id", user.id)
    .single();

  return {
    user,
    role: profile?.role || "dealer",
    email: profile?.email || user.email,
    firmName: profile?.firm_name,
    error: null,
  };
}

// Base HTML layout for branded, mobile-responsive transactional emails
function renderEmailTemplate({
  headline,
  badgeText,
  badgeColor,
  introText,
  details,
  footerNote,
}: {
  headline: string;
  badgeText: string;
  badgeColor: string;
  introText: string;
  details: { label: string; value: string; isBold?: boolean; isHighlight?: boolean }[];
  footerNote?: string;
}): string {
  const rows = details
    .map(
      (d) => `
      <tr>
        <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; font-size: 13px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; width: 40%; font-weight: 600;">
          ${d.label}
        </td>
        <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; font-size: 14px; color: ${
          d.isHighlight ? "#b91c1c" : "#0f172a"
        }; font-weight: ${d.isBold || d.isHighlight ? "700" : "500"}; width: 60%;">
          ${d.value}
        </td>
      </tr>`
    )
    .join("");

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${headline}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #0f172a;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 24px 12px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
          
          <!-- Header -->
          <tr>
            <td style="background-color: #0f172a; padding: 24px; text-align: left; border-bottom: 3px solid #b91c1c;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <span style="font-size: 18px; font-weight: 800; color: #ffffff; letter-spacing: 0.5px; text-transform: uppercase;">
                      Western Consolidated
                    </span>
                    <span style="display: block; font-size: 11px; color: #94a3b8; margin-top: 2px; text-transform: uppercase; letter-spacing: 1px;">
                      Authorised GOEM for Kirloskar Green Gensets
                    </span>
                  </td>
                  <td align="right">
                    <span style="display: inline-block; padding: 4px 10px; border-radius: 9999px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; background-color: ${badgeColor}; color: #ffffff;">
                      ${badgeText}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 28px 24px;">
              <h1 style="margin: 0 0 10px 0; font-size: 18px; font-weight: 800; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px;">
                ${headline}
              </h1>
              <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 1.6; color: #475569;">
                ${introText}
              </p>

              <!-- Table -->
              <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e2e8f0; border-radius: 8px; border-collapse: separate; border-spacing: 0; margin-bottom: 24px; background-color: #f8fafc;">
                ${rows}
              </table>

              ${
                footerNote
                  ? `<div style="padding: 14px; background-color: #f1f5f9; border-left: 4px solid #b91c1c; border-radius: 4px; font-size: 12px; color: #334155; line-height: 1.5;">
                      ${footerNote}
                    </div>`
                  : ""
              }
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 20px 24px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 11px; color: #94a3b8; line-height: 1.5;">
              <p style="margin: 0 0 4px 0;">This is an automated notification from the Western Consolidated Dealer Portal.</p>
              <p style="margin: 0;">&copy; ${new Date().getFullYear()} Western Consolidated Pvt. Ltd. All rights reserved.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

// Resend Email Sender Helper with Native Provider Idempotency Key
async function sendViaResend({
  apiKey,
  from,
  to,
  subject,
  html,
  idempotencyKey,
}: {
  apiKey: string;
  from: string;
  to: string[];
  subject: string;
  html: string;
  idempotencyKey?: string;
}) {
  const headers: Record<string, string> = {
    "Authorization": `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  };

  if (idempotencyKey) {
    headers["Idempotency-Key"] = idempotencyKey;
  }

  const res = await fetch(RESEND_API_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({
      from,
      to,
      subject,
      html,
    }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(`Resend API Error (${res.status}): ${JSON.stringify(errorData)}`);
  }

  return await res.json();
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const resendApiKey = Deno.env.get("RESEND_API_KEY") || "";
    const fromEmail = Deno.env.get("FROM_EMAIL") || DEFAULT_FROM_EMAIL;
    const configuredCronSecret = Deno.env.get("CRON_SECRET") || "";

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase configuration in Edge Function environment.");
    }

    if (!resendApiKey) {
      throw new Error("Missing RESEND_API_KEY in Edge Function secrets.");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const body = await req.json().catch(() => ({}));
    const { type, orderId, submissionId, targetDate } = body;

    // -------------------------------------------------------------------------
    // 1. ORDER BOOKING CONFIRMATION
    // -------------------------------------------------------------------------
    if (type === "order_booking") {
      // 1. Authenticate caller
      const auth = await authenticateCaller(req, supabase);
      if (!auth.user) {
        return new Response(JSON.stringify({ error: `Unauthorized: ${auth.error}` }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (!orderId || typeof orderId !== "string") {
        return new Response(JSON.stringify({ error: "Missing or invalid orderId" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // 2. Fetch authoritative order data from database (never trust client payload)
      const { data: order, error: orderErr } = await supabase
        .from("orders")
        .select("*, profiles:user_id(email, firm_name)")
        .eq("id", orderId)
        .single();

      if (orderErr || !order) {
        return new Response(JSON.stringify({ error: "Order not found" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // 3. Authorization check: Caller must be the order owner OR an admin
      const isOwner = auth.user.id === order.user_id;
      const isAdmin = auth.role === "admin" || auth.role === "order_admin";
      if (!isOwner && !isAdmin) {
        return new Response(
          JSON.stringify({ error: "Forbidden: You are not authorized to trigger notifications for this order." }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // 4. Validate recipients
      const dealerEmail = order.profiles?.email;
      if (!dealerEmail || !isValidEmail(dealerEmail)) {
        throw new Error(`Dealer account associated with order ${orderId} has no valid email address configured.`);
      }

      const recipients = Array.from(new Set([dealerEmail, ORDER_ADMIN_EMAIL]));
      const formattedDispatch = new Date(order.dispatch_date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

      const subject = `Order Booking Confirmation: ${order.id} - ${order.customer_name}`;
      const idempotencyKey = `order_booking_${order.id}`;

      // 5. Atomic dispatch lock to prevent race conditions under concurrent requests
      const { data: claimResult, error: claimErr } = await supabase.rpc("claim_email_dispatch", {
        p_idempotency_key: idempotencyKey,
        p_event_type: "order_booking",
        p_reference_id: order.id,
        p_recipient_emails: recipients,
        p_subject: subject,
      });

      if (claimErr) {
        throw new Error(`Failed to claim dispatch lock: ${claimErr.message}`);
      }

      const claimStatus = typeof claimResult === "object" && claimResult !== null ? claimResult.status : claimResult;
      const claimToken = typeof claimResult === "object" && claimResult !== null ? claimResult.claim_token : null;

      if (claimStatus === "ALREADY_SENT") {
        return new Response(JSON.stringify({ status: "already_sent" }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (claimStatus === "IN_PROGRESS") {
        return new Response(JSON.stringify({ status: "in_progress", message: "Notification is currently in transit." }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // 6. Render template & send
      const emailHtml = renderEmailTemplate({
        headline: `Order Booking Confirmation`,
        badgeText: "Order Booked",
        badgeColor: "#059669",
        introText: `Your order booking has been successfully recorded in the system. Details are provided below for your reference.`,
        details: [
          { label: "Order Reference", value: order.id, isBold: true },
          { label: "Dealer Name", value: order.dealer_name || order.profiles?.firm_name || "-" },
          { label: "Customer Name", value: order.customer_name },
          { label: "Customer Phone", value: order.customer_phone || "-" },
          { label: "Genset Rating", value: `${order.kva} kVA` },
          { label: "Number of Sets", value: `${order.sets_count} Set(s)` },
          { label: "Price per Set", value: formatINR(order.price_per_set) },
          { label: "Total Order Value", value: formatINR(order.sets_count * order.price_per_set), isHighlight: true },
          { label: "Scheduled Dispatch", value: formattedDispatch, isBold: true },
          { label: "Current Status", value: order.status.toUpperCase() },
          { label: "Attachment", value: order.attachment_name || (order.attachment_path ? "Attached PDF" : "None") },
        ],
        footerNote: `Dispatch execution is scheduled for ${formattedDispatch}. For any updates, contact Western Consolidated Order Management.`,
      });

      try {
        const resendResult = await sendViaResend({
          apiKey: resendApiKey,
          from: fromEmail,
          to: recipients,
          subject,
          html: emailHtml,
          idempotencyKey,
        });

        let updateQuery = supabase
          .from("email_logs")
          .update({
            status: "sent",
            resend_id: resendResult?.id || null,
            sent_at: new Date().toISOString(),
            metadata: resendResult,
          })
          .eq("idempotency_key", idempotencyKey);

        if (claimToken) {
          updateQuery = updateQuery.eq("claim_token", claimToken);
        }

        const { error: logErr } = await updateQuery;

        if (logErr) {
          console.error(`[Edge Function] Resend accepted email (${resendResult?.id}) but updating email_logs failed: ${logErr.message}`);
        }

        return new Response(JSON.stringify({ success: true, recipients, resendId: resendResult?.id }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } catch (sendErr: any) {
        let failQuery = supabase
          .from("email_logs")
          .update({
            status: "failed",
            error_message: sendErr.message || String(sendErr),
          })
          .eq("idempotency_key", idempotencyKey);

        if (claimToken) {
          failQuery = failQuery.eq("claim_token", claimToken);
        }

        await failQuery;
        throw sendErr;
      }
    }

    // -------------------------------------------------------------------------
    // 2. PRICE SUPPORT ESCALATION (REFER or NOT_POSSIBLE only - NEVER for APPROVED)
    // -------------------------------------------------------------------------
    if (type === "price_escalation") {
      // 1. Authenticate caller
      const auth = await authenticateCaller(req, supabase);
      if (!auth.user) {
        return new Response(JSON.stringify({ error: `Unauthorized: ${auth.error}` }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (!submissionId || typeof submissionId !== "string") {
        return new Response(JSON.stringify({ error: "Missing or invalid submissionId" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // 2. Fetch authoritative submission from database
      const { data: submission, error: subErr } = await supabase
        .from("price_submissions")
        .select("*, profiles:user_id(email, firm_name)")
        .eq("id", submissionId)
        .single();

      if (subErr || !submission) {
        return new Response(JSON.stringify({ error: "Price support submission not found" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // 3. Authorization check: order_admin cannot trigger price escalation
      if (auth.role === "order_admin") {
        return new Response(
          JSON.stringify({ error: "Forbidden: Order admin is not permitted to trigger price support notifications." }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Caller must be the submitter OR a full admin
      const isOwner = auth.user.id === submission.user_id;
      const isAdmin = auth.role === "admin";
      if (!isOwner && !isAdmin) {
        return new Response(
          JSON.stringify({ error: "Forbidden: You are not authorized to trigger notifications for this submission." }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // 4. STRICT AUTHORITATIVE VERDICT CHECK: Never email for APPROVED submissions
      if (submission.verdict === "APPROVED") {
        return new Response(
          JSON.stringify({
            status: "skipped",
            reason: "Approved price support submissions do not trigger escalation.",
          }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (submission.verdict !== "REFER" && submission.verdict !== "NOT_POSSIBLE") {
        return new Response(
          JSON.stringify({ error: `Invalid verdict for escalation: ${submission.verdict}` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // 5. Validate recipients
      const dealerEmail = submission.profiles?.email;
      if (!dealerEmail || !isValidEmail(dealerEmail)) {
        throw new Error(`Dealer account associated with submission ${submissionId} has no valid email address configured.`);
      }

      const recipients = Array.from(new Set([dealerEmail, ESCALATION_ADMIN_EMAIL]));
      const isRefer = submission.verdict === "REFER";
      const verdictLabel = isRefer ? "Referred for Management Approval" : "Price Not Approved (Not Possible)";
      const badgeColor = isRefer ? "#d97706" : "#dc2626";

      const formattedDate = new Date(submission.created_at).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      const subject = `[Price Support Escalation - ${submission.verdict}] Ref: ${submission.id} (${submission.customer_name})`;
      const idempotencyKey = `price_escalation_${submission.id}`;

      // 6. Atomic dispatch lock
      const { data: claimResult, error: claimErr } = await supabase.rpc("claim_email_dispatch", {
        p_idempotency_key: idempotencyKey,
        p_event_type: "price_escalation",
        p_reference_id: submission.id,
        p_recipient_emails: recipients,
        p_subject: subject,
      });

      if (claimErr) {
        throw new Error(`Failed to claim dispatch lock: ${claimErr.message}`);
      }

      const claimStatus = typeof claimResult === "object" && claimResult !== null ? claimResult.status : claimResult;
      const claimToken = typeof claimResult === "object" && claimResult !== null ? claimResult.claim_token : null;

      if (claimStatus === "ALREADY_SENT") {
        return new Response(JSON.stringify({ status: "already_sent" }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (claimStatus === "IN_PROGRESS") {
        return new Response(JSON.stringify({ status: "in_progress", message: "Escalation notification is currently in transit." }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // 7. Render template & send
      const emailHtml = renderEmailTemplate({
        headline: `Price Support Escalation: ${submission.verdict}`,
        badgeText: submission.verdict,
        badgeColor,
        introText: isRefer
          ? `A pricing evaluation request has been referred for management review. Details are outlined below.`
          : `A pricing evaluation request did not meet the approved price thresholds and has been flagged for management attention.`,
        details: [
          { label: "Reference Number", value: submission.id, isBold: true },
          { label: "Submission Date", value: formattedDate },
          { label: "Dealer Name", value: submission.dealer_name || submission.profiles?.firm_name || "-" },
          { label: "Sales Rep", value: submission.sales_rep || "-" },
          { label: "Customer Name", value: submission.customer_name },
          { label: "Genset Rating", value: `${submission.kva} kVA` },
          { label: "Number of Sets", value: `${submission.quantity || 1} Set(s)` },
          { label: "Offered Price (per Set)", value: formatINR(submission.offered_price), isHighlight: true },
          { label: "Final Verdict", value: verdictLabel, isBold: true },
        ],
        footerNote: `This request has been escalated to Management (${ESCALATION_ADMIN_EMAIL}). You will be contacted once reviewed.`,
      });

      try {
        const resendResult = await sendViaResend({
          apiKey: resendApiKey,
          from: fromEmail,
          to: recipients,
          subject,
          html: emailHtml,
          idempotencyKey,
        });

        let updateQuery = supabase
          .from("email_logs")
          .update({
            status: "sent",
            resend_id: resendResult?.id || null,
            sent_at: new Date().toISOString(),
            metadata: resendResult,
          })
          .eq("idempotency_key", idempotencyKey);

        if (claimToken) {
          updateQuery = updateQuery.eq("claim_token", claimToken);
        }

        const { error: logErr } = await updateQuery;

        if (logErr) {
          console.error(`[Edge Function] Resend accepted escalation (${resendResult?.id}) but updating email_logs failed: ${logErr.message}`);
        }

        return new Response(JSON.stringify({ success: true, recipients, resendId: resendResult?.id }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } catch (sendErr: any) {
        let failQuery = supabase
          .from("email_logs")
          .update({
            status: "failed",
            error_message: sendErr.message || String(sendErr),
          })
          .eq("idempotency_key", idempotencyKey);

        if (claimToken) {
          failQuery = failQuery.eq("claim_token", claimToken);
        }

        await failQuery;
        throw sendErr;
      }
    }

    // -------------------------------------------------------------------------
    // 3. DISPATCH REMINDERS (Scheduled Job: 4:00 PM IST, 1 calendar day before dispatch)
    // -------------------------------------------------------------------------
    if (type === "dispatch_reminders") {
      // STRICT CRON AUTHENTICATION: Must have CRON_SECRET configured and verified
      if (!configuredCronSecret) {
        return new Response(
          JSON.stringify({ error: "Server configuration error: CRON_SECRET is not configured." }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const reqCronSecret = req.headers.get("x-cron-secret");
      let isAuthorized = false;

      // Check 1: Provided x-cron-secret matches configured secret exactly
      if (reqCronSecret && reqCronSecret === configuredCronSecret) {
        isAuthorized = true;
      } else {
        // Check 2: Alternatively, allow a verified Full Admin JWT session
        const auth = await authenticateCaller(req, supabase);
        if (auth.user && auth.role === "admin") {
          isAuthorized = true;
        }
      }

      if (!isAuthorized) {
        return new Response(
          JSON.stringify({ error: "Unauthorized: Invalid or missing cron secret." }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Target Dispatch Date: Defaults to exactly 1 calendar day ahead in Asia/Kolkata (4:00 PM IST rule),
      // or allows an explicit targetDate (YYYY-MM-DD) for safe admin recovery/retry runs.
      let targetDateStr: string;
      if (targetDate) {
        if (typeof targetDate !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(targetDate.trim())) {
          return new Response(
            JSON.stringify({ error: "Invalid targetDate format (expected YYYY-MM-DD)" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        targetDateStr = targetDate.trim();
      } else {
        const now = new Date();
        const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        targetDateStr = new Intl.DateTimeFormat("en-CA", {
          timeZone: "Asia/Kolkata",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }).format(tomorrow); // Format: YYYY-MM-DD in Asia/Kolkata
      }

      // Fetch all open orders scheduled for targetDateStr
      const { data: openOrders, error: ordersErr } = await supabase
        .from("orders")
        .select("*, profiles:user_id(email, firm_name)")
        .eq("status", "open")
        .eq("dispatch_date", targetDateStr);

      if (ordersErr) {
        throw new Error(`Failed to query orders for dispatch date ${targetDateStr}: ${ordersErr.message}`);
      }

      const results = {
        targetDispatchDate: targetDateStr,
        found: openOrders?.length || 0,
        sent: 0,
        skipped: 0,
        errors: [] as string[],
      };

      for (const order of openOrders || []) {
        const idempotencyKey = `dispatch_reminder_${order.id}_${order.dispatch_date}`;
        const dealerEmail = order.profiles?.email;

        if (!dealerEmail || !isValidEmail(dealerEmail)) {
          results.errors.push(`Order ${order.id}: missing or invalid dealer email (${dealerEmail || "empty"})`);
          continue;
        }

        const recipients = Array.from(new Set([dealerEmail, ORDER_ADMIN_EMAIL]));
        const formattedDispatch = new Date(order.dispatch_date).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });

        const subject = `Dispatch Reminder: Order ${order.id} scheduled for tomorrow (${formattedDispatch})`;

        // Atomic lock claim
        const { data: claimResult, error: claimErr } = await supabase.rpc("claim_email_dispatch", {
          p_idempotency_key: idempotencyKey,
          p_event_type: "dispatch_reminder",
          p_reference_id: order.id,
          p_recipient_emails: recipients,
          p_subject: subject,
        });

        if (claimErr) {
          results.errors.push(`Order ${order.id}: lock error (${claimErr.message})`);
          continue;
        }

        const claimStatus = typeof claimResult === "object" && claimResult !== null ? claimResult.status : claimResult;
        const claimToken = typeof claimResult === "object" && claimResult !== null ? claimResult.claim_token : null;

        if (claimStatus === "ALREADY_SENT" || claimStatus === "IN_PROGRESS") {
          results.skipped++;
          continue;
        }

        const emailHtml = renderEmailTemplate({
          headline: `Upcoming Dispatch Reminder`,
          badgeText: "Dispatch Tomorrow",
          badgeColor: "#d97706",
          introText: `This is a reminder that the following order is scheduled for dispatch tomorrow (${formattedDispatch}). Please ensure all commercial and logistical arrangements are finalized.`,
          details: [
            { label: "Order Reference", value: order.id, isBold: true },
            { label: "Dealer Name", value: order.dealer_name || order.profiles?.firm_name || "-" },
            { label: "Customer Name", value: order.customer_name },
            { label: "Customer Phone", value: order.customer_phone || "-" },
            { label: "Genset Rating", value: `${order.kva} kVA` },
            { label: "Number of Sets", value: `${order.sets_count} Set(s)` },
            { label: "Price per Set", value: formatINR(order.price_per_set) },
            { label: "Total Order Value", value: formatINR(order.sets_count * order.price_per_set), isHighlight: true },
            { label: "Dispatch Date", value: formattedDispatch, isBold: true },
            { label: "Order Status", value: order.status.toUpperCase() },
          ],
          footerNote: `If this order has already been executed or requires date rescheduling, please update the status in the Admin Order Booking panel promptly.`,
        });

        try {
          const resendResult = await sendViaResend({
            apiKey: resendApiKey,
            from: fromEmail,
            to: recipients,
            subject,
            html: emailHtml,
            idempotencyKey,
          });

          let updateQuery = supabase
            .from("email_logs")
            .update({
              status: "sent",
              resend_id: resendResult?.id || null,
              sent_at: new Date().toISOString(),
              metadata: resendResult,
            })
            .eq("idempotency_key", idempotencyKey);

          if (claimToken) {
            updateQuery = updateQuery.eq("claim_token", claimToken);
          }

          const { error: logErr } = await updateQuery;

          if (logErr) {
            console.error(`[Edge Function] Resend accepted reminder (${resendResult?.id}) for order ${order.id} but updating email_logs failed: ${logErr.message}`);
          }

          results.sent++;
        } catch (sendErr: any) {
          results.errors.push(`Order ${order.id}: ${sendErr.message}`);
          let failQuery = supabase
            .from("email_logs")
            .update({
              status: "failed",
              error_message: sendErr.message || String(sendErr),
            })
            .eq("idempotency_key", idempotencyKey);

          if (claimToken) {
            failQuery = failQuery.eq("claim_token", claimToken);
          }

          await failQuery;
        }
      }

      return new Response(JSON.stringify(results), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: `Unknown notification type: ${type}` }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("Unhandled error in send-email function:", err);
    return new Response(JSON.stringify({ error: err.message || "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
