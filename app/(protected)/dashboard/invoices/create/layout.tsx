interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default async function Layout({ children }: ProtectedLayoutProps) {
  return <div> {children}</div>;
}
