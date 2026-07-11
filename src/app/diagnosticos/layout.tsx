import { AppShell } from "@/components/app-shell";

export default function DiagnosticosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
