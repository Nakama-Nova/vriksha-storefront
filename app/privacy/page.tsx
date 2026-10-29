import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/LegalPage";
import { POLICY, SHOP } from "@/lib/legal";

export const metadata: Metadata = { title: "Privacy policy" };

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy policy"
      intro={`${SHOP.name} (“we”, “us”) takes only the details we need to make and deliver your order, and uses them for nothing else. This page says what we collect, why, who else sees it, how long we keep it, and what you can ask us to do. It follows India’s Digital Personal Data Protection Act, 2023.`}
    >
      <h2>What we collect, and when</h2>
      <ul>
        <li>
          <strong>When you place an order:</strong> your name, phone number, email (optional), delivery address, town and pincode, any note you add, and how you chose to pay.
        </li>
        <li>
          <strong>When you send a custom-order enquiry:</strong> your name and phone number, and what you describe: the piece, wood, size, budget and any details you write.
        </li>
        <li>
          <strong>When you track an order:</strong> the order number and the phone number you used. We use them only to find your order.
        </li>
        <li>
          <strong>When you message us on WhatsApp or by phone or email:</strong> whatever you send us, including photos or sketches.
        </li>
        <li>
          <strong>Automatically:</strong> like any website, our servers record the technical details of a visit (your IP address, the time and the pages asked for). We use this to keep the site working and safe.
        </li>
      </ul>
      <p>
        We do <strong>not</strong> collect card or bank details. You pay by UPI to our UPI ID, or in cash on delivery where we offer it; the payment itself happens in your own UPI app and bank. There are no customer accounts or passwords. We do not use advertising or tracking tools (see the <Link href="/cookies">cookie policy</Link>).
      </p>

      <h2>Why we use it</h2>
      <ul>
        <li>To confirm your order, price and delivery date, to make your piece and to deliver it.</li>
        <li>To reply to your enquiry or message and to look after you after delivery (for example a defect).</li>
        <li>To keep our accounts and records as the law requires.</li>
        <li>To keep the website secure and to stop misuse, such as repeated automated orders.</li>
      </ul>
      <p>We do not sell your details, and we do not use them for marketing unless you ask us to keep you informed.</p>

      <h2>Who else handles it</h2>
      <p>We use a few providers to run the shop. They handle your details only to provide their service to us:</p>
      <ul>
        <li>
          <strong>Our hosting provider</strong> (Vercel), which serves this website and our order system, and keeps the technical logs mentioned above.
        </li>
        <li>
          <strong>Our database provider</strong> (Supabase), which stores orders and enquiries on servers in India (Mumbai).
        </li>
        <li>
          <strong>WhatsApp</strong>, if you choose to message us there, under WhatsApp&rsquo;s own privacy policy.
        </li>
        <li>
          <strong>Our delivery team</strong> sees your name, phone number and address so that a delivery can reach you.
        </li>
      </ul>
      <p>We share your details with anyone else only if the law or a court requires it.</p>

      <h2>How long we keep it</h2>
      <p>
        We keep order records for as long as we need them for your piece (for example a repair or a defect claim) and for our accounts and legal duties. Enquiries that do not become orders are kept only as long as they are useful for the conversation. When we no longer need a detail, we delete it or make it anonymous.
      </p>

      <h2>Keeping it safe</h2>
      <p>
        The website and our order system use encrypted connections (HTTPS). Only our own staff can open orders, and each person has their own sign-in. No system is perfectly secure, but if something happened to your details that could harm you, we would tell you and the authorities as the law requires.
      </p>

      <h2>Your choices and rights</h2>
      <p>You can ask us to:</p>
      <ul>
        <li>tell you what details of yours we hold and what we do with them;</li>
        <li>correct anything that is wrong or out of date;</li>
        <li>delete your details, unless we must keep them (for example for our accounts);</li>
        <li>stop contacting you, if you asked us to keep you informed.</li>
      </ul>
      <p>
        Write to <a href={`mailto:${SHOP.email}`}>{SHOP.email}</a> from the email address, or say the phone number, you used with us. We reply within {POLICY.privacyReplyDays} days. You can also name someone to act for you. If you are not happy with our answer, you can complain to the Data Protection Board of India.
      </p>

      <h2>Children</h2>
      <p>This shop is for adults. If you are under 18, please ask a parent or guardian to place an order or send an enquiry for you.</p>

      <h2>Changes to this page</h2>
      <p>If we change how we use your details, we will update this page and its date. For a change that matters to you, we will also tell you where we can.</p>
    </LegalPage>
  );
}
