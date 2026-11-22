import { whatsappUrl } from "@/lib/config";

/** A round "chat with us" button on every page. Shows nothing until the shop's WhatsApp number is set (NEXT_PUBLIC_WHATSAPP). */
export function WhatsAppButton() {
  const href = whatsappUrl("Hello Vriksha Studio, I have a question.");
  if (!href) return null;
  return (
    <a className="wa-float" href={href} target="_blank" rel="noopener noreferrer" aria-label="Chat with us on WhatsApp">
      <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 21l1.6-4.8A8.5 8.5 0 1 1 8 19.5L3 21z" />
        <path d="M9 9.5c0 3 2.500 5.500 5.500 5.500l1.200-1.300-1.800-.9-.8.700a4 4 0 0 1-1.700-1.700l.7-.8-.9-1.800L9 9.500z" />
      </svg>
      <span className="wa-label">Chat with us</span>
    </a>
  );
}
