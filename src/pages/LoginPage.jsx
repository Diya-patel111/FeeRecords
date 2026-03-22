import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Logged in successfully!');
      navigate('/dashboard');
    }

    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      if (error) {
        console.error('Google login error:', error);
        toast.error(error.message);
      }
    } catch (err) {
      console.error('Unexpected error during Google login:', err);
      toast.error('Failed to initialize Google login');
    }
  };

  return (
    <div className="bg-surface font-body text-on-surface antialiased min-h-screen flex flex-col">
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[1100px] grid md:grid-cols-2 bg-surface-container-lowest overflow-hidden rounded-xl shadow-2xl shadow-on-surface/5">
          <div className="hidden md:flex flex-col justify-between p-12 editorial-gradient text-white relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-10 mt-2">
                <div className="w-11 h-11 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-xl">
                  <span className="material-symbols-outlined text-white text-[24px]">menu_book</span>
                </div>
                <div className="text-3xl font-extrabold tracking-tight">HisabKitab</div>
              </div>
              <h2 className="text-4xl font-headline font-bold leading-tight mb-6 tracking-tight">The Academic Curator for Global Institutions.</h2>
              <p className="text-on-primary-container text-lg max-w-sm opacity-90 leading-relaxed">Access your financial dashboard and manage institutional financial data with architectural precision.</p>
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center space-x-4">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full border-2 border-primary bg-surface-container-high" title="University researcher profile portrait small circle"></div>
                  <div className="w-8 h-8 rounded-full border-2 border-primary bg-surface-container-low" title="Academic advisor profile portrait small circle"></div>
                </div>
                <span className="text-sm font-medium tracking-wide">Joined by 2,000+ Institutions</span>
              </div>
            </div>

            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-container/20 rounded-full -ml-48 -mb-48 blur-3xl"></div>
          </div>
          
          <div className="p-8 md:p-16 flex flex-col justify-center bg-surface-container-lowest">
            <div className="max-w-md mx-auto w-full">
              <div className="mb-10">
                <h1 className="text-3xl font-headline font-extrabold text-on-surface tracking-tight mb-2">Sign In</h1>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant font-label" htmlFor="email">Email Address</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-xl">mail</span>
                      <input
                        className="w-full pl-12 pr-4 py-4 bg-surface-container-low border-none focus:ring-2 focus:ring-primary/40 rounded-lg text-on-surface placeholder:text-outline/60 transition-all outline-none"
                        id="email"
                        name="email"
                        placeholder="name@example.com"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant font-label" htmlFor="password">Security Key</label>
                    <a className="text-xs font-bold text-primary hover:text-surface-tint transition-colors uppercase tracking-wider" href="#">Forgot Password?</a>
                  </div>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-xl">lock</span>
                    <input 
                      className="w-full pl-12 pr-12 py-4 bg-surface-container-low border-none focus:ring-2 focus:ring-primary/40 rounded-lg text-on-surface placeholder:text-outline/60 transition-all outline-none" 
                      id="password" 
                      name="password" 
                      placeholder="••••••••" 
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button 
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface-variant transition-colors" 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <span className="material-symbols-outlined text-xl">{showPassword ? 'visibility_off' : 'visibility'}</span>
                    </button>
                  </div>
                </div>

                <button 
                  className="w-full editorial-gradient text-white py-4 px-6 rounded-lg font-bold text-sm tracking-widest uppercase shadow-md hover:shadow-lg hover:opacity-90 active:scale-95 transition-all disabled:opacity-75" 
                  type="submit"
                  disabled={loading}
                >
                    {loading ? 'Authenticating...' : 'Sign In'}
                </button>
              </form>

              <div className="relative my-10 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-outline-variant/30"></div>
                </div>
                <span className="relative bg-surface-container-lowest px-4 text-xs font-bold text-outline uppercase tracking-widest">or continue with</span>
              </div>

              <button 
                onClick={handleGoogleLogin} 
                className="w-full flex items-center justify-center space-x-3 py-4 px-6 bg-surface-container-low hover:bg-surface-container-high text-on-surface font-bold text-xs tracking-widest uppercase rounded-lg border border-outline-variant/10 transition-all" 
                type="button"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                </svg>
                <span>Continue with Google</span>
              </button>

              <p className="mt-10 text-center text-on-surface-variant text-sm font-medium">
                  Don't have an account? 
                  <Link className="text-primary font-bold hover:underline underline-offset-4 ml-1" to="/signup">Create one</Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full border-t border-slate-200/20 dark:border-slate-800/20 bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col md:flex-row justify-between items-center px-8 py-12 space-y-4 md:space-y-0 max-w-7xl mx-auto">
          <p className="text-xs font-medium uppercase tracking-widest text-slate-400 dark:text-slate-600">© 2024 HisabKitab. The Academic Curator.</p>
          <div className="flex space-x-8">
            <a className="text-xs font-medium uppercase tracking-widest text-slate-400 dark:text-slate-600 hover:text-blue-600 dark:hover:text-blue-400 underline-offset-4 hover:underline transition-opacity opacity-80 hover:opacity-100" href="#">Privacy Policy</a>
            <a className="text-xs font-medium uppercase tracking-widest text-slate-400 dark:text-slate-600 hover:text-blue-600 dark:hover:text-blue-400 underline-offset-4 hover:underline transition-opacity opacity-80 hover:opacity-100" href="#">Terms of Service</a>
            <a className="text-xs font-medium uppercase tracking-widest text-slate-400 dark:text-slate-600 hover:text-blue-600 dark:hover:text-blue-400 underline-offset-4 hover:underline transition-opacity opacity-80 hover:opacity-100" href="#">Institutional Support</a>
            <a className="text-xs font-medium uppercase tracking-widest text-slate-400 dark:text-slate-600 hover:text-blue-600 dark:hover:text-blue-400 underline-offset-4 hover:underline transition-opacity opacity-80 hover:opacity-100" href="#">Contact Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
