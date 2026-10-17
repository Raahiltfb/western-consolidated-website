import { describe, it, expect } from "vitest";

// Pure calculation logic mirroring SQL RPC submit_price_support
export function determinePricingTier(quantity: number, threshold: number): 'standard' | 'bulk' {
  if (quantity <= 0 || !Number.isInteger(quantity)) {
    throw new Error('Quantity must be a positive whole number');
  }
  return quantity >= threshold ? 'bulk' : 'standard';
}

export function calculateVerdict(
  offeredPrice: number,
  quantity: number,
  standardMinPrice: number,
  bulkMinPrice: number,
  referFloor: number,
  bulkThreshold: number
): {
  verdict: 'APPROVED' | 'REFER' | 'NOT POSSIBLE';
  tier: 'standard' | 'bulk';
  effectiveMin: number;
} {
  const tier = determinePricingTier(quantity, bulkThreshold);
  const effectiveMin = tier === 'bulk' ? bulkMinPrice : standardMinPrice;

  let verdict: 'APPROVED' | 'REFER' | 'NOT POSSIBLE';
  if (offeredPrice >= effectiveMin) {
    verdict = 'APPROVED';
  } else if (offeredPrice >= referFloor) {
    verdict = 'REFER';
  } else {
    verdict = 'NOT POSSIBLE';
  }

  return { verdict, tier, effectiveMin };
}

// File validation helper mirroring OrderSupportPortal logic
export function validateAttachment(file: { name: string; size: number; type: string }): { valid: boolean; error?: string } {
  const MAX_SIZE = 10 * 1024 * 1024; // 10MB
  const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');

  if (!isPdf) {
    return { valid: false, error: 'Only PDF documents are permitted.' };
  }

  if (file.size > MAX_SIZE) {
    return { valid: false, error: 'File size exceeds the 10 MB limit.' };
  }

  return { valid: true };
}

// Route permission helper mirroring ProtectedRoute & layout logic
export function isRouteAllowed(role: 'admin' | 'order_admin' | 'dealer', path: string): boolean {
  if (role === 'admin') {
    // Admin has access to all admin routes & portal
    return ['/portal/admin', '/portal/admin/dispatched', '/portal/price-support', '/portal/order-support'].includes(path);
  }

  if (role === 'order_admin') {
    // Semi-admin Ranjan: ONLY Admin Order Booking
    return path === '/portal/admin' || path === '/portal/admin?tab=orders';
  }

  if (role === 'dealer') {
    // Dealers have access to price support and order booking
    return ['/portal/price-support', '/portal/order-support'].includes(path);
  }

  return false;
}

describe("Configurable Bulk Pricing Engine", () => {
  const standardMin = 500000;
  const bulkMin = 475000;
  const referFloor = 450000;

  describe("Threshold = 3 sets (Default)", () => {
    const threshold = 3;

    it("evaluates quantity 1 as standard tier", () => {
      const res = calculateVerdict(500000, 1, standardMin, bulkMin, referFloor, threshold);
      expect(res.tier).toBe('standard');
      expect(res.effectiveMin).toBe(standardMin);
      expect(res.verdict).toBe('APPROVED');
    });

    it("evaluates quantity 2 as standard tier", () => {
      // At standard tier (min 500,000), offering 480,000 is below standard min but above refer floor -> REFER
      const res = calculateVerdict(480000, 2, standardMin, bulkMin, referFloor, threshold);
      expect(res.tier).toBe('standard');
      expect(res.effectiveMin).toBe(standardMin);
      expect(res.verdict).toBe('REFER');
    });

    it("evaluates quantity 3 as bulk tier", () => {
      // At bulk tier (min 475,000), offering 480,000 is above bulk min -> APPROVED!
      const res = calculateVerdict(480000, 3, standardMin, bulkMin, referFloor, threshold);
      expect(res.tier).toBe('bulk');
      expect(res.effectiveMin).toBe(bulkMin);
      expect(res.verdict).toBe('APPROVED');
    });

    it("evaluates quantity 4 as bulk tier", () => {
      const res = calculateVerdict(475000, 4, standardMin, bulkMin, referFloor, threshold);
      expect(res.tier).toBe('bulk');
      expect(res.effectiveMin).toBe(bulkMin);
      expect(res.verdict).toBe('APPROVED');
    });
  });

  describe("Threshold updated to 5 sets", () => {
    const threshold = 5;

    it("evaluates quantity 3 as standard tier when threshold is 5", () => {
      const res = calculateVerdict(480000, 3, standardMin, bulkMin, referFloor, threshold);
      expect(res.tier).toBe('standard');
      expect(res.effectiveMin).toBe(standardMin);
      // Because min is 500k, 480k is REFER
      expect(res.verdict).toBe('REFER');
    });

    it("evaluates quantity 4 as standard tier when threshold is 5", () => {
      const res = calculateVerdict(490000, 4, standardMin, bulkMin, referFloor, threshold);
      expect(res.tier).toBe('standard');
      expect(res.effectiveMin).toBe(standardMin);
      expect(res.verdict).toBe('REFER');
    });

    it("evaluates quantity 5 as bulk tier when threshold is 5", () => {
      const res = calculateVerdict(480000, 5, standardMin, bulkMin, referFloor, threshold);
      expect(res.tier).toBe('bulk');
      expect(res.effectiveMin).toBe(bulkMin);
      // Because bulk min is 475k, 480k is APPROVED
      expect(res.verdict).toBe('APPROVED');
    });
  });

  describe("Shared Refer Floor behavior", () => {
    it("applies the same refer floor to both standard and bulk orders", () => {
      // Standard order below refer floor (440,000 < 450,000) -> NOT POSSIBLE
      const stdNotPossible = calculateVerdict(440000, 1, standardMin, bulkMin, referFloor, 3);
      expect(stdNotPossible.verdict).toBe('NOT POSSIBLE');

      // Bulk order below refer floor (440,000 < 450,000) -> NOT POSSIBLE
      const bulkNotPossible = calculateVerdict(440000, 5, standardMin, bulkMin, referFloor, 3);
      expect(bulkNotPossible.verdict).toBe('NOT POSSIBLE');

      // Standard order at exactly refer floor -> REFER
      const stdRefer = calculateVerdict(450000, 1, standardMin, bulkMin, referFloor, 3);
      expect(stdRefer.verdict).toBe('REFER');

      // Bulk order at exactly refer floor -> REFER
      const bulkRefer = calculateVerdict(450000, 5, standardMin, bulkMin, referFloor, 3);
      expect(bulkRefer.verdict).toBe('REFER');
    });

    it("rejects invalid quantity values", () => {
      expect(() => determinePricingTier(0, 3)).toThrow();
      expect(() => determinePricingTier(-2, 3)).toThrow();
      expect(() => determinePricingTier(1.5, 3)).toThrow();
    });
  });
});

describe("Semi-Admin Ranjan & Role Permissions", () => {
  it("allows full admin access to all routes", () => {
    expect(isRouteAllowed('admin', '/portal/admin')).toBe(true);
    expect(isRouteAllowed('admin', '/portal/admin/dispatched')).toBe(true);
    expect(isRouteAllowed('admin', '/portal/price-support')).toBe(true);
  });

  it("strictly limits order_admin (Ranjan) to order booking administration", () => {
    // Permitted:
    expect(isRouteAllowed('order_admin', '/portal/admin')).toBe(true);
    expect(isRouteAllowed('order_admin', '/portal/admin?tab=orders')).toBe(true);

    // Forbidden:
    expect(isRouteAllowed('order_admin', '/portal/admin/dispatched')).toBe(false);
    expect(isRouteAllowed('order_admin', '/portal/price-support')).toBe(false);
    expect(isRouteAllowed('order_admin', '/portal/order-support')).toBe(false);
  });

  it("strictly limits dealer to dealer portals", () => {
    expect(isRouteAllowed('dealer', '/portal/price-support')).toBe(true);
    expect(isRouteAllowed('dealer', '/portal/order-support')).toBe(true);
    expect(isRouteAllowed('dealer', '/portal/admin')).toBe(false);
    expect(isRouteAllowed('dealer', '/portal/admin/dispatched')).toBe(false);
  });
});

describe("PDF Attachment Validation", () => {
  it("accepts valid PDF files under 10MB", () => {
    const validPdf = { name: "quotation_po.pdf", size: 2 * 1024 * 1024, type: "application/pdf" };
    expect(validateAttachment(validPdf)).toEqual({ valid: true });
  });

  it("rejects non-PDF files", () => {
    const pngFile = { name: "screenshot.png", size: 500 * 1024, type: "image/png" };
    const zipFile = { name: "archive.zip", size: 1024 * 1024, type: "application/zip" };
    const exeFile = { name: "contract.pdf.exe", size: 1024 * 1024, type: "application/x-msdownload" };

    expect(validateAttachment(pngFile).valid).toBe(false);
    expect(validateAttachment(zipFile).valid).toBe(false);
    expect(validateAttachment(exeFile).valid).toBe(false);
  });

  it("rejects PDF files exceeding 10MB", () => {
    const hugePdf = { name: "giant_manual.pdf", size: 11 * 1024 * 1024, type: "application/pdf" };
    const result = validateAttachment(hugePdf);
    expect(result.valid).toBe(false);
    expect(result.error).toContain("10 MB limit");
  });
});
