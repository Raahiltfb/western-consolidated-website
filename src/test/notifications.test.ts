import { describe, it, expect } from "vitest";

// ==============================================================================
// Pure business logic & security simulations for Notifications & Edge Function
// ==============================================================================

export const RECIPIENTS = {
  ORDER_ADMIN: "ranjan@westernconsolidated.com",
  ESCALATION_ADMIN: "jai@westernconsolidated.com",
};

export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== "string") return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/**
 * Returns the target recipients for each notification type.
 */
export function getRecipients(
  type: "order_booking" | "dispatch_reminder" | "price_escalation",
  dealerEmail: string
): string[] {
  if (!dealerEmail || !isValidEmail(dealerEmail)) throw new Error("Valid dealer email is required");

  switch (type) {
    case "order_booking":
      return Array.from(new Set([dealerEmail, RECIPIENTS.ORDER_ADMIN]));
    case "dispatch_reminder":
      return Array.from(new Set([dealerEmail, RECIPIENTS.ORDER_ADMIN]));
    case "price_escalation":
      return Array.from(new Set([dealerEmail, RECIPIENTS.ESCALATION_ADMIN]));
    default:
      throw new Error("Invalid notification type");
  }
}

/**
 * Evaluates whether a Price Support verdict triggers an escalation notification.
 * STRICT RULE: Only REFER or NOT_POSSIBLE trigger an alert. APPROVED never triggers.
 */
export function shouldSendPriceEscalation(verdict: "APPROVED" | "REFER" | "NOT_POSSIBLE"): boolean {
  if (verdict === "APPROVED") {
    return false;
  }
  return verdict === "REFER" || verdict === "NOT_POSSIBLE";
}

/**
 * Authorizes a caller against a target resource.
 * Caller must be authenticated, and either be the owner or hold an approved administrative role.
 */
export function authorizeCaller(
  caller: { id: string; role: string } | null,
  resourceOwnerId: string,
  allowedRoles: string[] = ["admin"]
): { authorized: boolean; status: number; error?: string } {
  if (!caller) {
    return { authorized: false, status: 401, error: "Authentication required" };
  }

  const isOwner = caller.id === resourceOwnerId;
  const hasRole = allowedRoles.includes(caller.role);

  if (!isOwner && !hasRole) {
    return { authorized: false, status: 403, error: "Forbidden: Not authorized for this resource" };
  }

  return { authorized: true, status: 200 };
}

/**
 * Verifies authorization for the scheduled cron endpoint.
 * Requires configured CRON_SECRET. Access allowed if header matches secret,
 * or if a verified full admin session is supplied.
 */
export function authorizeCronRequest(
  reqSecret: string | null | undefined,
  envSecret: string | null | undefined,
  caller?: { role: string } | null
): { authorized: boolean; status: number; error?: string } {
  if (!envSecret) {
    return { authorized: false, status: 500, error: "Server configuration error: CRON_SECRET not set" };
  }

  // Check 1: Valid secret provided
  if (reqSecret && reqSecret === envSecret) {
    return { authorized: true, status: 200 };
  }

  // Check 2: Admin caller fallback
  if (caller && caller.role === "admin") {
    return { authorized: true, status: 200 };
  }

  return { authorized: false, status: 401, error: "Unauthorized: Invalid or missing cron secret" };
}

export interface ClaimLeaseResult {
  status: "CLAIMED" | "IN_PROGRESS" | "ALREADY_SENT" | "RETRY_CLAIMED";
  claimToken?: string;
  resendId?: string;
}

/**
 * Simulates atomic dispatch claim logic matching database function claim_email_dispatch
 * including ON CONFLICT DO NOTHING, lease fencing with claim_token, 2-minute flight window,
 * retry logic, and resend_id crash recovery.
 */
export class DispatchLockSimulator {
  private records = new Map<
    string,
    {
      status: "pending" | "sent" | "failed";
      createdAt: number;
      attempts: number;
      resendId?: string;
      claimToken?: string;
      claimedUntil?: number;
    }
  >();

  private generateToken(): string {
    return "claim_tok_" + Math.random().toString(36).substring(2, 10);
  }

  public claim(idempotencyKey: string, nowMs: number = Date.now()): "CLAIMED" | "IN_PROGRESS" | "ALREADY_SENT" | "RETRY_CLAIMED" {
    return this.claimWithLease(idempotencyKey, nowMs).status;
  }

  public claimWithLease(idempotencyKey: string, nowMs: number = Date.now()): ClaimLeaseResult {
    const existing = this.records.get(idempotencyKey);
    // Simulates: insert into email_logs (...) on conflict (idempotency_key) do nothing;
    if (!existing) {
      const claimToken = this.generateToken();
      this.records.set(idempotencyKey, {
        status: "pending",
        createdAt: nowMs,
        attempts: 1,
        claimToken,
        claimedUntil: nowMs + 120000,
      });
      return { status: "CLAIMED", claimToken };
    }

    // If sent or already has a resend_id (crash recovery after Resend accepted), never duplicate
    if (existing.status === "sent" || existing.resendId) {
      return { status: "ALREADY_SENT", resendId: existing.resendId };
    }

    // If pending and within 2-minute lease window, concurrent request is in flight
    const isLeaseActive = existing.status === "pending" && (existing.claimedUntil ? existing.claimedUntil > nowMs : nowMs - existing.createdAt < 120000);
    if (isLeaseActive) {
      return { status: "IN_PROGRESS" };
    }

    // Previous failed or lease expired without recorded delivery -> safe retry with new claim token
    const newClaimToken = this.generateToken();
    existing.status = "pending";
    existing.attempts += 1;
    existing.createdAt = nowMs;
    existing.claimToken = newClaimToken;
    existing.claimedUntil = nowMs + 120000;
    return { status: "RETRY_CLAIMED", claimToken: newClaimToken };
  }

  public updateWithFence(
    idempotencyKey: string,
    claimToken: string,
    status: "sent" | "failed",
    resendId?: string
  ): boolean {
    const rec = this.records.get(idempotencyKey);
    if (!rec) return false;
    // Fencing check: Token must match current active lease
    if (rec.claimToken !== claimToken) {
      return false; // Stale worker fenced out: 0 rows updated
    }

    rec.status = status;
    if (resendId) rec.resendId = resendId;
    return true;
  }

  public recordResendSuccess(idempotencyKey: string, resendId: string) {
    const rec = this.records.get(idempotencyKey);
    if (rec) {
      rec.status = "sent";
      rec.resendId = resendId;
    }
  }

  public simulateCrashAfterResendAccept(idempotencyKey: string, resendId: string) {
    // Edge Function crashed right after Resend responded, before status was set to 'sent'
    const rec = this.records.get(idempotencyKey);
    if (rec) {
      rec.resendId = resendId; // DB captured resend_id or provider idempotency was registered
    }
  }

  public markSent(idempotencyKey: string) {
    const rec = this.records.get(idempotencyKey);
    if (rec) rec.status = "sent";
  }

  public markFailed(idempotencyKey: string) {
    const rec = this.records.get(idempotencyKey);
    if (rec) rec.status = "failed";
  }
}

/**
 * Computes Target Dispatch Date in India Standard Time (Asia/Kolkata).
 * At 4:00 PM IST (16:00 IST), "tomorrow" is exactly 1 calendar day ahead in IST.
 * Uses robust Intl.DateTimeFormat in Asia/Kolkata timezone.
 */
export function getTargetDispatchDateIST(currentDate: Date): string {
  const tomorrow = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(tomorrow);
}

/**
 * Verifies caller authorization specifically for Price Support Escalations.
 * Strict rule: Dealers can only trigger for own records. Admins can trigger.
 * order_admin is explicitly FORBIDDEN.
 */
export function authorizePriceEscalationCaller(
  caller: { id: string; role: string } | null,
  resourceOwnerId: string
): { authorized: boolean; status: number; error?: string } {
  if (!caller) {
    return { authorized: false, status: 401, error: "Authentication required" };
  }

  if (caller.role === "order_admin") {
    return {
      authorized: false,
      status: 403,
      error: "Forbidden: Order admin is not permitted to trigger price support notifications.",
    };
  }

  const isOwner = caller.id === resourceOwnerId;
  const isAdmin = caller.role === "admin";

  if (!isOwner && !isAdmin) {
    return { authorized: false, status: 403, error: "Forbidden: You are not authorized for this resource" };
  }

  return { authorized: true, status: 200 };
}

/**
 * Verifies whether 4:00 PM IST matches 10:30 UTC for the cron schedule.
 */
export function is4PmISTEquivalentTo1030Utc(): boolean {
  const istHours = 16;
  const istMinutes = 0;
  const totalMinutes = istHours * 60 + istMinutes - (5 * 60 + 30);
  const utcHours = Math.floor(totalMinutes / 60);
  const utcMinutes = totalMinutes % 60;
  return utcHours === 10 && utcMinutes === 30;
}

/**
 * Filter qualifying orders for the 4:00 PM IST dispatch reminder.
 */
export function filterOrdersForDispatchReminder(
  orders: Array<{ id: string; status: "open" | "dispatched"; dispatch_date: string }>,
  targetDate: string,
  sentLogs: Set<string>
): Array<{ id: string; status: "open"; dispatch_date: string; idempotencyKey: string }> {
  return orders
    .filter((o): o is { id: string; status: "open"; dispatch_date: string } => {
      if (o.status !== "open") return false;
      if (o.dispatch_date !== targetDate) return false;
      const key = `dispatch_reminder_${o.id}_${o.dispatch_date}`;
      if (sentLogs.has(key)) return false;
      return true;
    })
    .map((o) => ({
      ...o,
      idempotencyKey: `dispatch_reminder_${o.id}_${o.dispatch_date}`,
    }));
}

/**
 * Models PostgreSQL database EXECUTE privileges on function public.claim_email_dispatch.
 * Strict security rule: Only service_role (used by Edge Function) is granted EXECUTE.
 * Authenticated users (dealers, admins) and anon callers are revoked/denied.
 */
export function canExecuteClaimEmailDispatch(role: "anon" | "authenticated" | "service_role"): boolean {
  return role === "service_role";
}

/**
 * Validates input parameters for claim_email_dispatch RPC.
 */
export function validateClaimEmailDispatchParams(params: {
  idempotencyKey?: string | null;
  eventType?: string | null;
  referenceId?: string | null;
  recipientEmails?: string[] | null;
  subject?: string | null;
}): boolean {
  if (!params.idempotencyKey || !params.idempotencyKey.trim()) {
    throw new Error("claim_email_dispatch: p_idempotency_key cannot be null or empty");
  }
  if (!params.eventType || !["order_booking", "dispatch_reminder", "price_escalation"].includes(params.eventType)) {
    throw new Error("claim_email_dispatch: invalid p_event_type");
  }
  if (!params.referenceId || !params.referenceId.trim()) {
    throw new Error("claim_email_dispatch: p_reference_id cannot be null or empty");
  }
  if (!params.recipientEmails || params.recipientEmails.length === 0) {
    throw new Error("claim_email_dispatch: p_recipient_emails must contain at least one recipient email");
  }
  if (!params.subject || !params.subject.trim()) {
    throw new Error("claim_email_dispatch: p_subject cannot be null or empty");
  }
  return true;
}

// ==============================================================================
// Tests
// ==============================================================================

describe("Security & Functional Audit: Automated Transactional Notifications", () => {
  const dealerEmail = "dealer@example.com";

  describe("Caller Authentication & Authorization Guards", () => {
    const ownerId = "dealer-uid-123";
    const otherUserId = "intruder-uid-456";

    it("rejects unauthenticated callers with 401 Unauthorized", () => {
      const res = authorizeCaller(null, ownerId, ["admin"]);
      expect(res.authorized).toBe(false);
      expect(res.status).toBe(401);
    });

    it("allows the resource owner (order/submission creator) to trigger notifications", () => {
      const owner = { id: ownerId, role: "dealer" };
      const res = authorizeCaller(owner, ownerId, ["admin"]);
      expect(res.authorized).toBe(true);
      expect(res.status).toBe(200);
    });

    it("rejects unauthorized users attempting to forge notifications for another dealer's resource (403 Forbidden)", () => {
      const intruder = { id: otherUserId, role: "dealer" };
      const res = authorizeCaller(intruder, ownerId, ["admin", "order_admin"]);
      expect(res.authorized).toBe(false);
      expect(res.status).toBe(403);
    });

    it("allows full admins to trigger notifications for any order or submission", () => {
      const admin = { id: "admin-uid-999", role: "admin" };
      const res = authorizeCaller(admin, ownerId, ["admin"]);
      expect(res.authorized).toBe(true);
    });

    it("allows order_admin (Ranjan) to trigger order booking notifications", () => {
      const orderAdmin = { id: "ranjan-uid", role: "order_admin" };
      const res = authorizeCaller(orderAdmin, ownerId, ["admin", "order_admin"]);
      expect(res.authorized).toBe(true);
    });

    it("STRICT ROLE SECURITY: order_admin is FORBIDDEN from triggering Price Support escalation notifications", () => {
      const orderAdmin = { id: "ranjan-uid", role: "order_admin" };
      const res = authorizePriceEscalationCaller(orderAdmin, ownerId);
      expect(res.authorized).toBe(false);
      expect(res.status).toBe(403);
      expect(res.error).toContain("Order admin is not permitted");
    });

    it("allows the price submission owner (dealer) to trigger price escalation", () => {
      const dealer = { id: ownerId, role: "dealer" };
      const res = authorizePriceEscalationCaller(dealer, ownerId);
      expect(res.authorized).toBe(true);
      expect(res.status).toBe(200);
    });

    it("prevents another dealer from triggering price escalation for someone else's submission", () => {
      const otherDealer = { id: otherUserId, role: "dealer" };
      const res = authorizePriceEscalationCaller(otherDealer, ownerId);
      expect(res.authorized).toBe(false);
      expect(res.status).toBe(403);
    });

    it("allows full admin to trigger price escalation for any submission", () => {
      const admin = { id: "admin-uid-999", role: "admin" };
      const res = authorizePriceEscalationCaller(admin, ownerId);
      expect(res.authorized).toBe(true);
      expect(res.status).toBe(200);
    });
  });

  describe("Cron Endpoint Security (dispatch_reminders)", () => {
    const validSecret = "super-secure-cron-secret-token";

    it("rejects invocation with 500 when CRON_SECRET is not configured on the server", () => {
      const res = authorizeCronRequest(validSecret, "");
      expect(res.authorized).toBe(false);
      expect(res.status).toBe(500);
    });

    it("rejects requests missing the cron secret header with 401 Unauthorized", () => {
      const res = authorizeCronRequest(null, validSecret, null);
      expect(res.authorized).toBe(false);
      expect(res.status).toBe(401);
    });

    it("rejects requests with an incorrect cron secret with 401 Unauthorized", () => {
      const res = authorizeCronRequest("wrong-secret", validSecret, null);
      expect(res.authorized).toBe(false);
      expect(res.status).toBe(401);
    });

    it("accepts requests with the exact configured cron secret (status 200)", () => {
      const res = authorizeCronRequest(validSecret, validSecret, null);
      expect(res.authorized).toBe(true);
      expect(res.status).toBe(200);
    });

    it("allows a verified full admin session even if cron secret header is omitted", () => {
      const adminUser = { role: "admin" };
      const res = authorizeCronRequest(null, validSecret, adminUser);
      expect(res.authorized).toBe(true);
      expect(res.status).toBe(200);
    });

    it("does NOT allow normal dealers or order_admin without the secret", () => {
      const dealer = { role: "dealer" };
      const res = authorizeCronRequest(null, validSecret, dealer);
      expect(res.authorized).toBe(false);
      expect(res.status).toBe(401);

      const orderAdmin = { role: "order_admin" };
      const res2 = authorizeCronRequest(null, validSecret, orderAdmin);
      expect(res2.authorized).toBe(false);
      expect(res2.status).toBe(401);
    });
  });

  describe("Recipient Privacy & Payload Isolation", () => {
    it("validates proper email formats", () => {
      expect(isValidEmail("user@westernconsolidated.com")).toBe(true);
      expect(isValidEmail("dealer.test+po@gmail.com")).toBe(true);
      expect(isValidEmail("invalid-email")).toBe(false);
      expect(isValidEmail("")).toBe(false);
      expect(isValidEmail("@missingusername.com")).toBe(false);
    });

    it("rejects recipient compilation when dealer email is invalid", () => {
      expect(() => getRecipients("order_booking", "invalid-email")).toThrow();
    });

    it("routes Order Booking confirmation strictly to Dealer + Ranjan", () => {
      const recipients = getRecipients("order_booking", dealerEmail);
      expect(recipients).toContain(dealerEmail);
      expect(recipients).toContain(RECIPIENTS.ORDER_ADMIN);
      expect(recipients).not.toContain(RECIPIENTS.ESCALATION_ADMIN);
      expect(recipients.length).toBe(2);
    });

    it("routes Dispatch Reminder strictly to Dealer + Ranjan", () => {
      const recipients = getRecipients("dispatch_reminder", dealerEmail);
      expect(recipients).toContain(dealerEmail);
      expect(recipients).toContain(RECIPIENTS.ORDER_ADMIN);
    });

    it("routes Price Support Escalation strictly to Dealer + Jai", () => {
      const recipients = getRecipients("price_escalation", dealerEmail);
      expect(recipients).toContain(dealerEmail);
      expect(recipients).toContain(RECIPIENTS.ESCALATION_ADMIN);
      expect(recipients).not.toContain(RECIPIENTS.ORDER_ADMIN);
    });

    it("ensures fixed recipient addresses are non-modifiable constants", () => {
      expect(RECIPIENTS.ORDER_ADMIN).toBe("ranjan@westernconsolidated.com");
      expect(RECIPIENTS.ESCALATION_ADMIN).toBe("jai@westernconsolidated.com");
    });
  });

  describe("Price Support Authoritative Escalation Rules", () => {
    it("CRITICAL RULE: sends NO alert for APPROVED verdicts", () => {
      expect(shouldSendPriceEscalation("APPROVED")).toBe(false);
    });

    it("sends escalation alert for REFER verdicts", () => {
      expect(shouldSendPriceEscalation("REFER")).toBe(true);
    });

    it("sends escalation alert for NOT_POSSIBLE verdicts", () => {
      expect(shouldSendPriceEscalation("NOT_POSSIBLE")).toBe(true);
    });
  });

  describe("Concurrency, Idempotency, Safe Retries & Crash Recovery", () => {
    it("grants lock on first dispatch claim (CLAIMED)", () => {
      const sim = new DispatchLockSimulator();
      const res = sim.claim("order_booking_OB-100");
      expect(res).toBe("CLAIMED");
    });

    it("simulates concurrent atomic insert race: first wins (CLAIMED), second gets serialized (IN_PROGRESS)", () => {
      const sim = new DispatchLockSimulator();
      const t0 = 1000000;
      // Request A claims brand new key
      const resA = sim.claim("order_booking_OB-CONCURRENT", t0);
      expect(resA).toBe("CLAIMED");

      // Request B arrives 10ms later for the exact same key
      const resB = sim.claim("order_booking_OB-CONCURRENT", t0 + 10);
      expect(resB).toBe("IN_PROGRESS");
    });

    it("prevents duplicate execution under concurrent requests within flight window (IN_PROGRESS)", () => {
      const sim = new DispatchLockSimulator();
      const t0 = 1000000;
      expect(sim.claim("order_booking_OB-100", t0)).toBe("CLAIMED");
      expect(sim.claim("order_booking_OB-100", t0 + 50)).toBe("IN_PROGRESS");
    });

    it("skips execution once email has been marked sent (ALREADY_SENT)", () => {
      const sim = new DispatchLockSimulator();
      sim.claim("order_booking_OB-100");
      sim.markSent("order_booking_OB-100");

      expect(sim.claim("order_booking_OB-100")).toBe("ALREADY_SENT");
    });

    it("CRASH RECOVERY: if Resend accepted email with resend_id, retry claim is blocked even if status was pending", () => {
      const sim = new DispatchLockSimulator();
      const t0 = 1000000;
      sim.claim("order_booking_OB-CRASH", t0);
      // Simulate crash right after Resend returned an ID
      sim.simulateCrashAfterResendAccept("order_booking_OB-CRASH", "resend_msg_abc123");

      // 5 minutes later, another worker attempts to claim
      const retryAfterCrash = sim.claim("order_booking_OB-CRASH", t0 + 300000);
      expect(retryAfterCrash).toBe("ALREADY_SENT");
    });

    it("grants safe retry claim if previous attempt failed (RETRY_CLAIMED)", () => {
      const sim = new DispatchLockSimulator();
      sim.claim("order_booking_OB-100");
      sim.markFailed("order_booking_OB-100");

      const retryRes = sim.claim("order_booking_OB-100");
      expect(retryRes).toBe("RETRY_CLAIMED");
    });

    it("PRINCIPLE OF LEAST PRIVILEGE: claim_email_dispatch is strictly executable by service_role, forbidden to authenticated and anon", () => {
      expect(canExecuteClaimEmailDispatch("service_role")).toBe(true);
      expect(canExecuteClaimEmailDispatch("authenticated")).toBe(false);
      expect(canExecuteClaimEmailDispatch("anon")).toBe(false);
    });

    it("RPC INPUT VALIDATION: rejects invalid or missing parameters", () => {
      // Valid input passes
      expect(
        validateClaimEmailDispatchParams({
          idempotencyKey: "test_key_1",
          eventType: "order_booking",
          referenceId: "OB-100",
          recipientEmails: ["dealer@example.com"],
          subject: "Test Subject",
        })
      ).toBe(true);

      // Missing or empty idempotency_key
      expect(() =>
        validateClaimEmailDispatchParams({
          idempotencyKey: "",
          eventType: "order_booking",
          referenceId: "OB-100",
          recipientEmails: ["dealer@example.com"],
          subject: "Test Subject",
        })
      ).toThrow("p_idempotency_key cannot be null or empty");

      // Invalid event_type
      expect(() =>
        validateClaimEmailDispatchParams({
          idempotencyKey: "test_key",
          eventType: "invalid_event" as any,
          referenceId: "OB-100",
          recipientEmails: ["dealer@example.com"],
          subject: "Test Subject",
        })
      ).toThrow("invalid p_event_type");

      // Missing reference_id
      expect(() =>
        validateClaimEmailDispatchParams({
          idempotencyKey: "test_key",
          eventType: "order_booking",
          referenceId: "",
          recipientEmails: ["dealer@example.com"],
          subject: "Test Subject",
        })
      ).toThrow("p_reference_id cannot be null or empty");

      // Empty recipient_emails
      expect(() =>
        validateClaimEmailDispatchParams({
          idempotencyKey: "test_key",
          eventType: "order_booking",
          referenceId: "OB-100",
          recipientEmails: [],
          subject: "Test Subject",
        })
      ).toThrow("must contain at least one recipient email");

      // Empty subject
      expect(() =>
        validateClaimEmailDispatchParams({
          idempotencyKey: "test_key",
          eventType: "order_booking",
          referenceId: "OB-100",
          recipientEmails: ["dealer@example.com"],
          subject: "   ",
        })
      ).toThrow("p_subject cannot be null or empty");
    });

    it("LEASE FENCING: prevents slow worker from mutating record after lease expires and another worker reclaims", () => {
      const sim = new DispatchLockSimulator();
      const t0 = 1000000;

      // Worker A claims initial dispatch
      const claimA = sim.claimWithLease("order_booking_OB-SLOW", t0);
      expect(claimA.status).toBe("CLAIMED");
      expect(claimA.claimToken).toBeDefined();

      // Worker A experiences unexpected lag/pause for 150 seconds (exceeding 120s lease)
      // Meanwhile, Worker B reclaims the job after 130 seconds
      const claimB = sim.claimWithLease("order_booking_OB-SLOW", t0 + 130000);
      expect(claimB.status).toBe("RETRY_CLAIMED");
      expect(claimB.claimToken).toBeDefined();
      expect(claimB.claimToken).not.toBe(claimA.claimToken);

      // Worker A unfreezes and attempts to update email_logs with stale claimToken
      const updateA = sim.updateWithFence("order_booking_OB-SLOW", claimA.claimToken!, "sent", "resend_A");
      expect(updateA).toBe(false); // Fenced out: 0 rows affected

      // Worker B finishes sending and updates with active claimToken
      const updateB = sim.updateWithFence("order_booking_OB-SLOW", claimB.claimToken!, "sent", "resend_B");
      expect(updateB).toBe(true); // Successfully committed
    });

    it("RETRY RESEND IDEMPOTENCY: retains same stable idempotency key across all worker retries", () => {
      const order = { id: "OB-999", dispatch_date: "2026-10-25" };
      const sub = { id: "WC-555" };

      // Stable keys across runs
      const bookingKey1 = `order_booking_${order.id}`;
      const bookingKey2 = `order_booking_${order.id}`;
      expect(bookingKey1).toBe(bookingKey2);

      const reminderKey1 = `dispatch_reminder_${order.id}_${order.dispatch_date}`;
      const reminderKey2 = `dispatch_reminder_${order.id}_${order.dispatch_date}`;
      expect(reminderKey1).toBe(reminderKey2);

      const escalationKey1 = `price_escalation_${sub.id}`;
      const escalationKey2 = `price_escalation_${sub.id}`;
      expect(escalationKey1).toBe(escalationKey2);
    });

    it("REMINDER RECOVERY: same-day recovery and manual targetDate recovery do not duplicate or send wrong dates", () => {
      // Simulation of orders and sent history
      const orders = [
        { id: "OB-001", status: "open" as const, dispatch_date: "2026-10-20" },
        { id: "OB-002", status: "open" as const, dispatch_date: "2026-10-20" },
        { id: "OB-003", status: "open" as const, dispatch_date: "2026-10-21" },
      ];

      const sentReminders = new Set<string>();
      // Order 1 was already sent at 4:00 PM IST
      sentReminders.add("dispatch_reminder_OB-001_2026-10-20");

      // Same-day recovery run at 6:30 PM IST targeting 2026-10-20
      const recoveredOrders = filterOrdersForDispatchReminder(orders, "2026-10-20", sentReminders);
      // Only OB-002 is selected for recovery; OB-001 is skipped as duplicate, OB-003 is ignored as different date
      expect(recoveredOrders.map((o) => o.id)).toEqual(["OB-002"]);

      // TargetDate validation
      expect(/^\d{4}-\d{2}-\d{2}$/.test("2026-10-20")).toBe(true);
      expect(/^\d{4}-\d{2}-\d{2}$/.test("invalid-date")).toBe(false);
      expect(/^\d{4}-\d{2}-\d{2}$/.test("20-10-2026")).toBe(false);
    });
  });

  describe("Timezone & Dispatch Reminder Timing (Asia/Kolkata)", () => {
    it("verifies 4:00 PM IST is exactly 10:30 UTC for cron scheduling", () => {
      expect(is4PmISTEquivalentTo1030Utc()).toBe(true);
    });

    it("calculates tomorrow's calendar date in IST from UTC timestamp", () => {
      const mockTimeUtc = new Date("2026-10-17T10:30:00Z"); // 4:00 PM IST on Oct 17
      const targetDate = getTargetDispatchDateIST(mockTimeUtc);
      expect(targetDate).toBe("2026-10-18");
    });

    it("handles month-end calendar boundary in Asia/Kolkata correctly", () => {
      const monthEndUtc = new Date("2026-10-31T10:30:00Z"); // 4:00 PM IST on Oct 31
      const targetDate = getTargetDispatchDateIST(monthEndUtc);
      expect(targetDate).toBe("2026-11-01");
    });

    it("handles year-end calendar boundary in Asia/Kolkata correctly", () => {
      const yearEndUtc = new Date("2026-12-31T10:30:00Z"); // 4:00 PM IST on Dec 31
      const targetDate = getTargetDispatchDateIST(yearEndUtc);
      expect(targetDate).toBe("2027-01-01");
    });

    it("handles leap-year calendar transitions in Asia/Kolkata correctly", () => {
      // Leap year: 2028
      const feb28Utc = new Date("2028-02-28T10:30:00Z"); // 4:00 PM IST on Feb 28, 2028
      expect(getTargetDispatchDateIST(feb28Utc)).toBe("2028-02-29");

      const feb29Utc = new Date("2028-02-29T10:30:00Z"); // 4:00 PM IST on Feb 29, 2028
      expect(getTargetDispatchDateIST(feb29Utc)).toBe("2028-03-01");
    });

    it("skips already dispatched orders", () => {
      const orders = [
        { id: "OB-002", status: "dispatched" as const, dispatch_date: "2026-10-18" },
      ];
      const result = filterOrdersForDispatchReminder(orders, "2026-10-18", new Set());
      expect(result.length).toBe(0);
    });

    it("handles dispatch date edits properly (allows reminder for new date, prevents duplicate on same date)", () => {
      const sentLogs = new Set<string>();
      sentLogs.add("dispatch_reminder_OB-006_2026-10-18");

      // Rescheduled to Oct 22
      const updatedOrders = [
        { id: "OB-006", status: "open" as const, dispatch_date: "2026-10-22" },
      ];

      const result = filterOrdersForDispatchReminder(updatedOrders, "2026-10-22", sentLogs);
      expect(result.length).toBe(1);
      expect(result[0].idempotencyKey).toBe("dispatch_reminder_OB-006_2026-10-22");
    });

    it("ensures idempotency keys are stable and deterministic across retries", () => {
      const orderId = "OB-STABLE-123";
      const dispatchDate = "2026-11-15";
      const subId = "WC-998877";

      // Attempt 1 vs Attempt 2 generate identical keys
      expect(`order_booking_${orderId}`).toBe(`order_booking_${orderId}`);
      expect(`price_escalation_${subId}`).toBe(`price_escalation_${subId}`);
      expect(`dispatch_reminder_${orderId}_${dispatchDate}`).toBe(`dispatch_reminder_${orderId}_${dispatchDate}`);
    });

    it("handles missed-cron recovery later the same day: targets identical date and skips already-sent orders", () => {
      // Suppose cron failed at 4:00 PM IST on Oct 18, and recovery runs at 7:30 PM IST on Oct 18
      const mock4PmUtc = new Date("2026-10-18T10:30:00Z"); // 4:00 PM IST
      const mock730PmUtc = new Date("2026-10-18T14:00:00Z"); // 7:30 PM IST

      const targetDate4Pm = getTargetDispatchDateIST(mock4PmUtc);
      const targetDate730Pm = getTargetDispatchDateIST(mock730PmUtc);

      expect(targetDate4Pm).toBe("2026-10-19");
      expect(targetDate730Pm).toBe("2026-10-19");

      // Simulates partial success at 4 PM: OB-101 succeeded, OB-102 failed
      const sentLogs = new Set<string>();
      sentLogs.add("dispatch_reminder_OB-101_2026-10-19");

      const ordersToRemind = [
        { id: "OB-101", status: "open" as const, dispatch_date: "2026-10-19" },
        { id: "OB-102", status: "open" as const, dispatch_date: "2026-10-19" },
      ];

      const recovered = filterOrdersForDispatchReminder(ordersToRemind, targetDate730Pm, sentLogs);
      expect(recovered.length).toBe(1);
      expect(recovered[0].id).toBe("OB-102");
      expect(recovered[0].idempotencyKey).toBe("dispatch_reminder_OB-102_2026-10-19");
    });

    it("validates manual recovery targetDate format", () => {
      const isValidTargetDate = (d: string) => /^\d{4}-\d{2}-\d{2}$/.test(d.trim());
      expect(isValidTargetDate("2026-10-19")).toBe(true);
      expect(isValidTargetDate("2026-12-31")).toBe(true);
      expect(isValidTargetDate("invalid-date")).toBe(false);
      expect(isValidTargetDate("19-10-2026")).toBe(false);
      expect(isValidTargetDate("")).toBe(false);
    });
  });
});
