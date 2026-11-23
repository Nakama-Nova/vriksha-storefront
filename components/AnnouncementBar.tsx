import Link from "next/link";
import { getAnnouncement } from "@/lib/api";
import { PHONE } from "@/lib/config";

/**
 * The bar at the very top of every page. Staff can set a message (an offer, festival hours...) with an optional link and
 * dates; with none showing it keeps the usual line about how ordering works.
 */
export async function AnnouncementBar() {
  const a = await getAnnouncement();
  const link = a?.link_url ? (a.link_url.startsWith("/") ? <Link href={a.link_url}>{a.link_label || "Learn more"}</Link> : <a href={a.link_url} rel="noopener noreferrer">{a.link_label || "Learn more"}</a>) : null;
  return (
    <div className="announce">
      {a ? (
        <>
          {a.message}
          {link && <> · {link}</>}
        </>
      ) : (
        <>Made to order in our own workshop · Nothing to pay online until we call you</>
      )}
      {PHONE && (
        <>
          {" "}
          · <a href={`tel:${PHONE.replace(/\s/g, "")}`}>Call {PHONE}</a>
        </>
      )}
    </div>
  );
}
