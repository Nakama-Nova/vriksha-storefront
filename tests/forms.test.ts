import { describe, expect, it } from "vitest";
import { fieldErrorsFrom } from "@/lib/api";
import { check, firstInvalid, mobileDigits, pickFields, rules } from "@/lib/formErrors";

const form = (values: Record<string, string>) => {
  const f = new FormData();
  for (const [k, v] of Object.entries(values)) f.set(k, v);
  return f;
};

describe("mobile numbers", () => {
  it("accepts the ways people write an Indian mobile number", () => {
    expect(mobileDigits("98765 43210")).toBe("9876543210");
    expect(mobileDigits("+91 98765-43210")).toBe("9876543210");
    expect(mobileDigits("09876543210")).toBe("9876543210");
  });
  it("refuses numbers that cannot be mobiles", () => {
    expect(mobileDigits("12345")).toBeNull();
    expect(mobileDigits("5876543210")).toBeNull(); // mobiles start with 6 to 9
    expect(mobileDigits("")).toBeNull();
  });
});

describe("checking a form", () => {
  const RULES = {
    name: [rules.minLength(2, "Enter your name")],
    phone: [rules.mobile()],
    email: [rules.optionalEmail()],
    pincode: [rules.pincode()],
    consent: [rules.ticked("Tick the box")],
  };
  it("passes a good form", () => {
    expect(check(form({ name: "Meena", phone: "98765 43210", email: "", pincode: "574201", consent: "on" }), RULES)).toEqual({});
  });
  it("says what is wrong, in words, one message per field", () => {
    const e = check(form({ name: " ", phone: "123", email: "not-an-email", pincode: "57", }), RULES);
    expect(e).toEqual({
      name: "Enter your name",
      phone: "Enter a 10-digit mobile number, like 98765 43210",
      email: "Enter a valid email address, or leave it empty",
      pincode: "Enter a 6-digit pincode",
      consent: "Tick the box",
    });
  });
  it("lets an empty optional email through but not a half-typed one", () => {
    expect(check(form({ email: "" }), { email: [rules.optionalEmail()] })).toEqual({});
    expect(check(form({ email: "a@b" }), { email: [rules.optionalEmail()] })).toHaveProperty("email");
  });
  it("finds the first problem in page order", () => {
    expect(firstInvalid({ pincode: "x", name: "y" }, ["name", "phone", "pincode"])).toBe("name");
    expect(firstInvalid({}, ["name"])).toBeUndefined();
  });
});

describe("the server's field messages", () => {
  it("reads a 422 into one message per field, without the technical prefix", () => {
    const body = {
      detail: [
        { msg: "Value error, Enter a valid 10-digit mobile number", loc: ["body", "phone"] },
        { msg: "String should have at least 2 characters", loc: ["body", "display_name"] },
        { msg: "second message for phone", loc: ["body", "phone"] },
      ],
    };
    expect(fieldErrorsFrom(body)).toEqual({
      phone: "Enter a valid 10-digit mobile number",
      display_name: "String should have at least 2 characters",
    });
  });
  it("gives nothing for errors that are not about a field", () => {
    expect(fieldErrorsFrom({ detail: "Order not found" })).toEqual({});
    expect(fieldErrorsFrom(null)).toEqual({});
  });
  it("renames the server's field names to this form's", () => {
    expect(pickFields({ display_name: "too short", text: "too short" }, { display_name: "name", text: "comment" })).toEqual({
      name: "too short",
      comment: "too short",
    });
  });
});
