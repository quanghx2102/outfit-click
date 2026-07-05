interface ManagerTopbarProps {
  user: { name: string; email: string };
}

export default function ManagerTopbar({ user }: ManagerTopbarProps) {
  const initials = user.name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <header
      className="flex h-16 shrink-0 items-center justify-between px-8"
      style={{ background: '#FFFFFF', borderBottom: '1px solid #E5E7EB' }}
    >
      <div />
      <div className="flex items-center gap-3">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-bold text-white"
          style={{ background: '#111827' }}
        >
          {initials}
        </div>
        <span className="text-[13px] font-medium" style={{ color: '#374151' }}>{user.name}</span>
      </div>
    </header>
  );
}
