import { useAuthStore } from '../store/authStore';
import { useQueryClient } from '@tanstack/react-query';

export default function Topnav({ title }) {
  const logout = useAuthStore(state => state.logout);
  const user = useAuthStore(state => state.user);
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    queryClient.clear(); // Clear all cached data to prevent cross-account leakage
    await logout();
  };

  return (
    <header className="w-full sticky top-0 z-40 frost-panel flex items-center justify-between px-5 md:px-10 py-4 border-b border-white/50">
      <div className="flex items-center gap-3 md:gap-4">
        <div className="w-11 h-11 rounded-2xl editorial-gradient flex items-center justify-center text-white shadow-lg shadow-primary/20">
          <span className="material-symbols-outlined font-light text-[22px]">menu_book</span>
        </div>
        <div>
          <h1 className="text-2xl md:text-[1.75rem] font-headline font-extrabold tracking-tight text-on-surface">
            Hisab<span className="text-primary">Kitab</span>
          </h1>
          <p className="hidden sm:block text-[10px] md:text-[11px] text-on-surface-variant font-bold tracking-[0.18em] uppercase -mt-0.5">
            {title || 'Fee Operations Console'}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={handleLogout}
          className="group flex items-center gap-2 p-1.5 pr-3 md:pr-4 rounded-full bg-white/90 hover:bg-white transition-all active:scale-95 text-on-surface-variant border border-outline-variant/25 shadow-sm"
        >
          <div className="w-9 h-9 rounded-full editorial-gradient flex items-center justify-center text-white font-headline font-extrabold text-sm shadow-inner overflow-hidden">
            {user?.email?.charAt(0).toUpperCase() || 'A'}
          </div>
          <span className="text-[11px] tracking-[0.18em] font-extrabold uppercase hidden sm:block group-hover:text-primary transition-colors">
            Sign Out
          </span>
        </button>
      </div>
    </header>
  );
}
