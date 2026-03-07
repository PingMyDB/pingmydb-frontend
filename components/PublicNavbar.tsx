import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Database, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const PublicNavbar: React.FC = () => {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    } else {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-border/80 bg-background/90 backdrop-blur-xl shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <img src="/favicon-96x96.png" className="w-8 h-8 rounded-lg shadow-lg shadow-primary/20" alt="PingMyDb Logo" />
            <span className="text-xl font-bold tracking-tight">
              <span className="text-primary">Ping</span><span className="text-foreground">MyDb</span>
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <Link to="/pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
            <Link to="/docs" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Documentation</Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-border bg-card/50 hover:bg-accent text-muted-foreground transition-all flex items-center justify-center font-bold"
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? <Sun size={18} className="text-yellow-500" /> : <Moon size={18} className="text-emerald-500" />}
            </button>
            {user ? (
               <Link to="/dashboard" className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/25">
                 Dashboard
               </Link>
            ) : (
                <>
                    <button 
                    onClick={() => navigate('/login')} 
                    className="text-sm font-medium hover:text-primary transition-colors hidden sm:block px-4 py-2 border border-border rounded-lg bg-card/30"
                    >
                    Login
                    </button>
                    <button 
                    onClick={() => navigate('/register')} 
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/25"
                    >
                    Get Started
                    </button>
                </>
            )}
          </div>
        </div>
      </nav>
  );
};

export default PublicNavbar;
