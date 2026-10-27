"use client";

import { Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import PaymentMakeSection from "@/components/dashboard/sections/PaymentMakeSection";

function MakePaymentContent() {
  const params = useParams<{ id: string }>();
  const checkoutStep = useSearchParams().get("checkout") === "1";

  return <PaymentMakeSection paymentId={params.id} checkoutStep={checkoutStep} />;
}

export default function MakePaymentPage() {
  return (
    <Suspense fallback={null}>
      <MakePaymentContent />
    </Suspense>
  );
}
