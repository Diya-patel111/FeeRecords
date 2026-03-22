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
    <header className="w-full sticky top-0 z-40 bg-surface-container-lowest/80 backdrop-blur-xl flex items-center justify-between px-6 md:px-10 py-5 border-b border-outline-variant/20 shadow-sm shadow-on-surface/5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl editorial-gradient flex items-center justify-center shadow-md shadow-primary/20 text-white">
          <span className="material-symbols-outlined font-light text-[22px]">menu_book</span>
        </div>
        <h1 className="text-2xl font-headline font-extrabold tracking-tight text-on-surface">
          Hisab<span className="text-primary">Kitab</span>
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 p-1.5 pr-4 rounded-full bg-surface-container-low hover:bg-surface-container-high transition-all active:scale-95 text-on-surface-variant hover:text-primary border border-outline-variant/10 shadow-sm"
        >
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-headline font-extrabold text-sm shadow-inner overflow-hidden">
            {user?.email?.charAt(0).toUpperCase() || 'A'}
          </div>
          <span className="text-xs tracking-widest font-bold uppercase hidden sm:block">Sign Out</span>
        </button>
      </div>
    </header>
  );
}