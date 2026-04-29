export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#030712] relative">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 via-transparent to-amber-950/20" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
