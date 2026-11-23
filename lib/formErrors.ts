// Checking a form before it is sent, and saying what is wrong next to the field that is wrong.
// The server checks everything again; this only saves a round trip and gives clear words.

export type FieldErrors = Record<string, string>;
export type Rule = (value: string, all: FormData) => string | null;

/** 10-digit Indian mobile from "+91 98765 43210", "09876543210" or "9876543210" (the same rule as the server). */
export function mobileDigits(raw: string): string | null {
  let d = raw.replace(/\D/g, "");
  if (d.length === 12 && d.startsWith("91")) d = d.slice(2);
  else if (d.length === 11 && d.startsWith("0")) d = d.slice(1);
  return /^[6-9]\d{9}$/.test(d) ? d : null;
}

export const rules = {
  required: (message: string): Rule => (v) => (v.trim() ? null : message),
  minLength: (n: number, message: string): Rule => (v) => (v.trim().length >= n ? null : message),
  mobile: (message = "Enter a 10-digit mobile number, like 98765 43210"): Rule => (v) => (mobileDigits(v) ? null : message),
  pincode: (message = "Enter a 6-digit pincode"): Rule => (v) => (/^\d{6}$/.test(v.trim()) ? null : message),
  /** Empty is fine; if something is typed it must look like an email address. */
  optionalEmail: (message = "Enter a valid email address, or leave it empty"): Rule => (v) => (!v.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? null : message),
  /** A checkbox is "on" in the form data when ticked. */
  ticked: (message: string): Rule => (v) => (v === "on" ? null : message),
};

/** Runs each field's rules in order and keeps the first problem per field. */
export function check(data: FormData, fieldRules: Record<string, Rule[]>): FieldErrors {
  const errors: FieldErrors = {};
  for (const [name, list] of Object.entries(fieldRules)) {
    const value = String(data.get(name) ?? "");
    for (const rule of list) {
      const problem = rule(value, data);
      if (problem) {
        errors[name] = problem;
        break;
      }
    }
  }
  return errors;
}

/** The server names fields its own way (display_name, text...); pick out the ones this form has, under this form's names. */
export function pickFields(fromServer: Record<string, string>, names: Record<string, string>): FieldErrors {
  const out: FieldErrors = {};
  for (const [serverName, message] of Object.entries(fromServer)) {
    const mine = names[serverName] ?? serverName;
    if (Object.values(names).includes(mine) || serverName === mine) out[mine] = message;
  }
  return out;
}

/** The first field with a problem, in the order the fields appear on the page. */
export const firstInvalid = (errors: FieldErrors, order: string[]) => order.find((name) => errors[name]);
