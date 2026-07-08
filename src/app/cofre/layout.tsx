import { AppShell } from "@/components/app-shell";

export default function CofreLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <AppShell>{children}</AppShell>;
}
