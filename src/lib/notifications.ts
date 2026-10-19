import { supabase } from '@/lib/supabaseClient';

/**
 * Triggers an automated Order Booking confirmation email.
 * Non-blocking: failures are logged to console without disrupting order workflow.
 */
export async function triggerOrderBookingNotification(orderId: string): Promise<{ success: boolean; error?: string }> {
  if (!orderId) return { success: false, error: 'Missing orderId' };

  try {
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: {
        type: 'order_booking',
        orderId,
      },
    });

    if (error) {
      console.warn(`[Notification] Order booking email warning for ${orderId}:`, error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.warn(`[Notification] Non-blocking order booking notification error for ${orderId}:`, err);
    return { success: false, error: err.message || String(err) };
  }
}

/**
 * Triggers an automated Price Support escalation email for REFER or NOT_POSSIBLE.
 * STRICT RULE: APPROVED verdicts never trigger an email.
 * Non-blocking: failures are logged without disrupting pricing workflow.
 */
export async function triggerPriceEscalationNotification(
  submissionId: string,
  verdict: string
): Promise<{ success: boolean; skipped?: boolean; error?: string }> {
  if (!submissionId) return { success: false, error: 'Missing submissionId' };

  // Strict client-side check: Never trigger email for APPROVED
  if (verdict === 'APPROVED') {
    return { success: true, skipped: true };
  }

  try {
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: {
        type: 'price_escalation',
        submissionId,
      },
    });

    if (error) {
      console.warn(`[Notification] Price escalation email warning for ${submissionId}:`, error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.warn(`[Notification] Non-blocking price escalation notification error for ${submissionId}:`, err);
    return { success: false, error: err.message || String(err) };
  }
}
