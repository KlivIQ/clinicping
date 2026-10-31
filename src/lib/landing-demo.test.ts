/*
 * ClinicPing — © 2026 KlivIQ Technologies. All rights reserved.
 * Built by KlivIQ Technologies.
 */
import { describe, expect, it } from "vitest";
import { previewTime } from "./landing-demo";

describe("landing delay preview", () => {
  it("moves every appointment exactly 15 minutes when the doctor is late", () => {
    expect(previewTime("9:30", true)).toBe("9:45");
    expect(previewTime("9:45", true)).toBe("10:00");
    expect(previewTime("10:00", true)).toBe("10:15");
  });
  it("restores the scheduled time when the delay is switched off", () => {
    expect(previewTime("9:30", false)).toBe("9:30");
  });
});