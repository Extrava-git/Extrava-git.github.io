"use client";

import dynamic from "next/dynamic";

const ContactBadge = dynamic(
  () => import("./ContactBadge"),
  { ssr: false }
);

export default function ContactBadgeClient() {
  return <ContactBadge />;
}
