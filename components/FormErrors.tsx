"use client";

import { useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import { firstInvalid, type FieldErrors } from "@/lib/formErrors";

const noSubscribe = () => () => {};
/**
 * False until the page's scripts have started. A form's button stays switched off until then: pressed too early, the
 * browser would send the form the old way and put what was typed (a phone number, an email) into the web address.
 */
export const useHydrated = () => useSyncExternalStore(noSubscribe, () => true, () => false);

/** Errors by field name, a way to clear one when its field is edited, and one to move to the first problem. */
export function useFieldErrors(order: string[]) {
  const [errors, setErrors] = useState<FieldErrors>({});
  const summary = useRef<HTMLDivElement>(null);

  /** Put this on the form's onInput: editing a field removes its message. */
  function onInput(e: FormEvent<HTMLFormElement>) {
    const name = (e.target as HTMLInputElement).name;
    if (name && errors[name]) {
      setErrors((current) => {
        const next = { ...current };
        delete next[name];
        return next;
      });
    }
  }

  /** Show the problems, say so for screen readers, and put the cursor in the first field to fix. */
  function show(found: FieldErrors) {
    setErrors(found);
    const first = firstInvalid(found, order);
    requestAnimationFrame(() => {
      if (first) document.getElementById(first)?.focus();
    });
  }

  return { errors, setErrors, onInput, show, summary };
}

/** The attributes that tie a field to its message, for screen readers and for the red outline. */
export function fieldA11y(name: string, errors: FieldErrors, describedBy?: string) {
  const ids = [describedBy, errors[name] ? `${name}-error` : undefined].filter(Boolean).join(" ");
  return { "aria-invalid": errors[name] ? (true as const) : undefined, "aria-describedby": ids || undefined };
}

/** The message under a field. */
export function FieldError({ name, errors }: { name: string; errors: FieldErrors }) {
  return errors[name] ? (
    <p id={`${name}-error`} className="field-error">
      {errors[name]}
    </p>
  ) : null;
}

/** "Please fix 2 things" with a link to each. Announced when it appears. */
export function ErrorSummary({ errors, labels, order }: { errors: FieldErrors; labels: Record<string, string>; order: string[] }) {
  const names = order.filter((n) => errors[n]);
  if (!names.length) return null;
  return (
    <div className="alert error error-summary" role="alert">
      <strong>{names.length === 1 ? "Please fix 1 thing:" : `Please fix ${names.length} things:`}</strong>
      <ul>
        {names.map((n) => (
          <li key={n}>
            <a
              href={`#${n}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(n)?.focus();
              }}
            >
              {labels[n] ?? n}: {errors[n]}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
