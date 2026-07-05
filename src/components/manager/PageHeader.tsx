interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export default function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1
          className="text-2xl font-bold tracking-tight"
          style={{ color: '#111827' }}
        >
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-sm" style={{ color: '#6B7280' }}>{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex shrink-0 items-center gap-2 sm:mt-0 mt-4">{actions}</div>
      )}
    </div>
  );
}
