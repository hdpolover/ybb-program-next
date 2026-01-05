"use client";

import { useParams } from "next/navigation";
import PaymentDetailSection from "@/components/dashboard/sections/PaymentDetailSection";

export default function PaymentDetailPage() {
  const params = useParams<{ id: string }>();

  return <PaymentDetailSection paymentId={params.id} />;
}
