export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main
      id="main-content"
      className="flex min-h-svh items-center justify-center bg-warm-surface px-4 py-12"
    >
      {children}
    </main>
  );
}
