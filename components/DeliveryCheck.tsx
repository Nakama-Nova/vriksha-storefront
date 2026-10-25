"use client";

import { useState } from "react";
import { ApiError, checkDelivery } from "@/lib/api";

/** "Do you deliver to my pincode?" box. onResult reports true/false/null (not checked). */
export function DeliveryCheck({ onResult }: { onResult?: (ok: boolean | null) => void }) {
  const [pin, setPin] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "yes" | "no" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function check() {
    if (!/^\d{6}$/.test(pin)) {
      setState("error");
      setMsg("Enter a 6-digit pincode");
      onResult?.(null);
      return;
    }
    setState("busy");
    try {
      const r = await checkDelivery(pin);
      setState(r.serviceable ? "yes" : "no");
      onResult?.(r.serviceable);
    } catch (e) {
      setState("error");
      setMsg(e instanceof ApiError ? e.message : "Could not check right now");
      onResult?.(null);
    }
  }

  return (
    <div className="field">
      <label htmlFor="pin">Check delivery to your pincode</label>
      <div className="row" style={{ flexWrap: "nowrap" }}>
        <input
          id="pin"
          className="input"
          inputMode="numeric"
          maxLength={6}
          placeholder="6-digit pincode"
          value={pin}
          onChange={(e) => {
            setPin(e.target.value.replace(/\D/g, ""));
            setState("idle");
            onResult?.(null);
          }}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), check())}
        />
        <button type="button" className="btn outline" onClick={check} disabled={state === "busy"}>
          {state === "busy" ? "Checking…" : "Check"}
        </button>
      </div>
      <div aria-live="polite" className="small">
        {state === "yes" && <span className="chip ok">✓ We deliver to your area</span>}
        {state === "no" && <div className="alert error">Sorry, we do not deliver there yet. Call us and we will see what we can do.</div>}
        {state === "error" && <div className="muted">{msg}</div>}
      </div>
    </div>
  );
}
