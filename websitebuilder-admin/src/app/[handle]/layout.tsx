export default function PreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Preview pages have their own layout without dashboard sidebar
  return <>{children}</>;
}