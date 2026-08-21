import { Suspense } from "react";
import ConversationsClient from "@/components/dashboard/ConversationsClient";

export default function ConversationsPage() {
  return (
    <Suspense fallback={null}>
      <ConversationsClient />
    </Suspense>
  );
}
