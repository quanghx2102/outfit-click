interface ManagerTopbarProps {
  user: { name: string; email: string };
}

export default function ManagerTopbar({ user }: ManagerTopbarProps) {
  const initial = user.name.trim().charAt(0).toUpperCase();

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6">
      <div className="text-sm font-medium text-slate-400">Manager</div>
      <div className="flex items-center gap-2.5">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
          {initial}
        </div>
        <span className="text-sm font-medium text-slate-700">{user.name}</span>
      </div>
    </header>
  );
}
