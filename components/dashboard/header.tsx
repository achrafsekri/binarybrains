interface DashboardHeaderProps {
  heading: string;
  text?: string;
  phone?: string;
  children?: React.ReactNode;
}

export function DashboardHeader({
  heading,
  text,
  phone,
  children,
}: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="grid gap-1">
        <h1 className="font-heading text-2xl font-semibold capitalize">
          {heading}
        </h1>
        {text && <p className="text-base text-muted-foreground">{text}</p>}
        {phone && (
          <a
            href={`tel:${phone}`}
            className="text-base underline"
          >
            +216 {phone}
          </a>
        )}
      </div>
      {children}
    </div>
  );
}
