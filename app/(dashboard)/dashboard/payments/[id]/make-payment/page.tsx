"use client";

import { useParams } from "next/navigation";
import PaymentMakeSection from "@/components/dashboard/sections/PaymentMakeSection";

export default function MakePaymentPage() {
  const params = useParams<{ id: string }>();

  return <PaymentMakeSection paymentId={params.id} />;
}
