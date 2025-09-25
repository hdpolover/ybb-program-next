import { ReactNode } from "react";
import ParticipantLayout from "../../layouts/ParticipantLayout";
import { DashboardProvider } from "../../providers/DashboardProvider";

interface ParticipantLayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: ParticipantLayoutProps) {
  return (
    <DashboardProvider>
      <ParticipantLayout>{children}</ParticipantLayout>
    </DashboardProvider>
  );
}