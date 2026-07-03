interface ManagerTopbarProps {
  user: { name: string; email: string };
}

export default function ManagerTopbar({ user }: ManagerTopbarProps) {
  const initial = user.name.trim().charAt(0).toUpperCase();

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-100 bg-white px-6">
      <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-300">
        Manager
      </div>
      <div className="flex items-center gap-2.5">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-950 text-[10px] font-bold text-white">
          {initial}
        </div>
        <span className="text-[13px] font-medium text-slate-600">{user.name}</span>
      </div>
    </header>
  );
}
