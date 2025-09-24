import { ReactNode } from "react";
import ParticipantLayout from "../../layouts/ParticipantLayout";

interface ParticipantLayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: ParticipantLayoutProps) {
  return <ParticipantLayout>{children}</ParticipantLayout>;
}