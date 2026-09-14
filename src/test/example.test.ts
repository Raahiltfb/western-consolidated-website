import { describe, it, expect } from "vitest";
import { cleanSalesRepName } from "@/lib/utils";

describe("dealer account and sales rep helpers", () => {
  it("correctly cleans sales rep name for Deepika", () => {
    expect(cleanSalesRepName("deepika@westernconsolidated.com")).toBe("Deepika");
    expect(cleanSalesRepName("Deepika")).toBe("Deepika");
    expect(cleanSalesRepName("deepika Power")).toBe("Deepika");
  });

  it("correctly cleans sales rep name for existing dealers", () => {
    expect(cleanSalesRepName("shyamal@westernconsolidated.com")).toBe("Shyamal");
    expect(cleanSalesRepName("sunil@westernconsolidated.com")).toBe("Sunil");
  });
});
