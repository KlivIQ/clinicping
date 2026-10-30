/* ClinicPing — © 2026 KlivIQ Technologies. Built by KlivIQ Technologies. */
import { describe, expect, it } from "vitest";
import { isValidPhone, verifyOtp } from "./session";

describe("mock login", () => {
  it("accepts the demo OTP 123456", () => expect(verifyOtp("9840012345", "123456")).toBe(true));
  it("rejects other OTPs", () => expect(verifyOtp("9840012345", "000000")).toBe(false));
  it("requires a 10-digit Indian mobile", () => {
    expect(isValidPhone("98400 12345")).toBe(true);
    expect(isValidPhone("12345")).toBe(false);
  });
});
