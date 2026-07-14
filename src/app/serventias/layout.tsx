import { AppShell } from "@/components/app-shell";

export default function ServentiasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
