import React, { useMemo, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  ChevronLeft, 
  HelpCircle,
  Database,
  Lock,
  Menu,
  X,
  Sun,
  Moon,
  Info,
  AlertCircle,
  Shield,
  Search,
  Github
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { DOCUMENTATION_MARKDOWN } from '../src/constants/docs';

const DocsPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const isLoggedIn = !!localStorage.getItem('pmdb_token');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemDark)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  // Helper to generate consistent IDs
  const getSectionId = (text: string) => {
    return text.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
  };

  // Extract sections for TOC
  const sections = useMemo(() => {
    const lines = DOCUMENTATION_MARKDOWN.split('\n');
    return lines
      .filter(line => line.startsWith('## '))
      .map(line => {
        const text = line.replace('## ', '');
        return {
          text,
          id: getSectionId(text)
        };
      });
  }, []);

  // Scroll Spy Logic
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200; // Increased offset for better trigger
      
      // Check if we're at the bottom of the page
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) {
        if (sections.length > 0) {
          setActiveSection(sections[sections.length - 1].id);
          return;
        }
      }

      let current = '';
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
           // If the top of the section is above our scroll position, it's a candidate
           if (element.offsetTop <= scrollPosition) {
             current = section.id;
           }
        }
      }
      
      if (current) {
        setActiveSection(current);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 100,
        behavior: 'smooth'
      });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#050505] text-foreground transition-colors duration-300">
      {/* Subtle Background Mesh */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="p-1.5 rounded-lg hover:bg-accent transition-colors text-muted-foreground"
            >
              <ChevronLeft size={18} />
            </button>
            {!isLoggedIn && (
              <Link to="/" className="flex items-center gap-2.5 group">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground shadow-sm group-hover:scale-105 transition-transform">
                  <Database size={16} />
                </div>
                <span className="font-bold text-base tracking-tight hidden sm:block">PingMyDb <span className="text-primary">Docs</span></span>
              </Link>
            )}
          </div>

          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <>
                <button 
                  onClick={toggleTheme}
                  className="p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground"
                  aria-label="Toggle theme"
                >
                  {isDark ? <Sun size={18} /> : <Moon size={18} />}
                </button>
                <Link to="/dashboard" className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                  Dashboard
                </Link>
              </>
            ) : (
              <>
                <div className="hidden lg:flex items-center gap-8">
                  <Link to="/pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
                  <button 
                    onClick={toggleTheme}
                    className="p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground"
                    aria-label="Toggle theme"
                  >
                    {isDark ? <Sun size={18} /> : <Moon size={18} />}
                  </button>
                  <button 
                    onClick={() => navigate('/register')}
                    className="bg-foreground text-background px-4 py-1.5 rounded-full text-sm font-bold hover:opacity-90 transition-opacity"
                  >
                    Get Started
                  </button>
                </div>
                <button 
                  className="lg:hidden p-2 text-muted-foreground"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-background lg:hidden pt-20 px-6"
          >
            <nav className="space-y-4">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className="block w-full text-left text-xl font-medium py-2 text-muted-foreground hover:text-primary transition-colors"
                >
                  {section.text}
                </button>
              ))}
            </nav>
            <div className="mt-8 pt-8 border-t border-border/50 space-y-4">
              <Link to="/pricing" className="block text-lg font-medium">Pricing</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24 flex flex-col lg:flex-row gap-16 relative">
        {/* Navigation Sidebar */}
        <aside className="lg:w-64 shrink-0 hidden lg:block sticky top-32 h-[calc(100vh-160px)] pr-4">
          <div className="flex flex-col h-full">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50 mb-6">Introduction</p>
            <nav className="space-y-1 flex-1 overflow-y-auto custom-scrollbar">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`block w-full text-left px-3 py-2 text-[13px] rounded-lg transition-all duration-200
                    ${activeSection === section.id 
                      ? 'text-primary font-bold bg-primary/10' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent/40'}`}
                >
                  {section.text}
                </button>
              ))}
            </nav>

            <div className="mt-8 p-6 rounded-2xl bg-accent/30 border border-border/40 backdrop-blur-sm">
              <h4 className="text-xs font-bold mb-2 flex items-center gap-2">
                <HelpCircle size={14} className="text-primary" /> Support
              </h4>
              <p className="text-[11px] text-muted-foreground leading-relaxed mb-3">
                Can't find an answer? Chat with our infra team.
              </p>
              <a href="mailto:support@pingmydb.com" className="text-[11px] font-bold text-primary hover:underline transition-all">
                Email Engineering →
              </a>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 min-w-0">
          <motion.article
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="prose dark:prose-invert prose-slate max-w-none 
              prose-h1:text-4xl lg:prose-h1:text-7xl prose-h1:font-black prose-h1:mb-20 prose-h1:tracking-tighter
              prose-h2:text-2xl lg:prose-h2:text-4xl prose-h2:mt-32 prose-h2:mb-12 prose-h2:font-bold prose-h2:tracking-tight prose-h2:text-foreground
              prose-h3:text-xl lg:prose-h3:text-2xl prose-h3:mt-16 prose-h3:mb-8 prose-h3:font-bold prose-h3:text-foreground
              prose-strong:text-foreground prose-strong:font-bold
              prose-a:text-primary prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
              prose-li:text-muted-foreground prose-li:text-[17px] prose-li:leading-relaxed prose-li:my-4
              prose-hr:my-24 prose-hr:border-border/40
              prose-table:text-sm prose-table:my-16 prose-table:border prose-table:border-border/40 prose-table:rounded-2xl prose-table:overflow-hidden"
          >
            <div className="mb-10 mt-10">
               <div className="flex items-center gap-2 mb-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Technical Reference</span>
               </div>
            </div>

            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({node, ...props}) => (
                  <p className="mb-6 text-[17px] leading-[1.8] text-muted-foreground" {...props} />
                ),
                h1: ({node, ...props}) => (
                  <h1 className="mb-20" {...props} />
                ),
                h2: ({node, ...props}) => {
                    const text = String(props.children);
                    const id = getSectionId(text);
                    return <h2 id={id} className="scroll-mt-32 mt-20 lg:mt-32" {...props} />;
                },
                blockquote: ({node, ...props}) => {
                  const content = String(props.children);
                  const isNote = content.includes('[!NOTE]');
                  const isImportant = content.includes('[!IMPORTANT]');
                  
                  if (isNote) {
                    return (
                      <div className="my-10 p-6 lg:p-8 rounded-2xl bg-primary/5 border border-primary/10 flex gap-5 items-start">
                        <div className="bg-primary/10 p-2.5 rounded-xl text-primary shrink-0 shadow-inner">
                          <Info size={18} />
                        </div>
                        <div className="flex-1">
                          <p className="text-[11px] font-bold uppercase tracking-widest mb-2 text-primary">Developer Note</p>
                          <div className="text-[15px] leading-relaxed text-muted-foreground italic font-medium">
                            {content.replace('[!NOTE]', '').replace(/>/g, '').trim()}
                          </div>
                        </div>
                      </div>
                    );
                  }
                  if (isImportant) {
                    return (
                      <div className="my-10 p-6 lg:p-8 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex gap-5 items-start">
                        <div className="bg-amber-500/10 p-2.5 rounded-xl text-amber-600 dark:text-amber-500 shrink-0 shadow-inner">
                          <AlertCircle size={18} />
                        </div>
                        <div className="flex-1">
                          <p className="text-[11px] font-bold uppercase tracking-widest mb-2 text-amber-600 dark:text-amber-500">Critical Requirement</p>
                          <div className="text-[15px] leading-relaxed text-muted-foreground font-semibold italic">
                            {content.replace('[!IMPORTANT]', '').replace(/>/g, '').trim()}
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return <blockquote className="border-l-2 border-primary/20 pl-8 py-2 italic text-muted-foreground/80 my-10 font-serif text-lg" {...props} />;
                },
                pre: ({node, ...props}) => (
                  <div className="my-10">
                    <pre className="bg-[#0d1117] text-[#c9d1d9] p-6 lg:p-8 rounded-2xl border border-white/5 font-mono text-sm leading-relaxed overflow-x-auto shadow-xl" {...props} />
                  </div>
                ),
                code: ({node, className, children, ...props}: any) => {
                  const match = /language-(\w+)/.exec(className || '');
                  const isBlock = !!match;
                  
                  if (isBlock) {
                    return <code className={className} {...props}>{children}</code>;
                  }
                  return (
                    <code className="bg-accent/50 dark:bg-white/5 px-1.5 py-0.5 rounded text-primary font-mono text-[0.85em] border border-border/50" {...props}>
                      {children}
                    </code>
                  );
                }
              }}
            >
              {DOCUMENTATION_MARKDOWN}
            </ReactMarkdown>

            {/* Final Footer Section */}
            <div className="mt-32 pt-16 border-t border-border/40 pb-16">
               <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                  <div className="space-y-4 text-center md:text-left">
                    <h4 className="text-xl font-bold tracking-tight">Still have questions?</h4>
                    <p className="text-muted-foreground max-w-sm">
                      Our engineers are online Monday to Friday to help with custom database configurations and VPC setups.
                    </p>
                    <div className="flex flex-wrap justify-center md:justify-start gap-4">
                       <button className="bg-foreground text-background px-6 py-2 rounded-full text-sm font-bold hover:opacity-90 transition-opacity">
                          Contact Support
                       </button>
                       <button className="px-6 py-2 rounded-full border border-border hover:bg-accent transition-colors text-sm font-bold">
                          Join Discord
                       </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-12 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                     <div className="flex flex-col items-center gap-1">
                        <Lock size={20} />
                        <span className="text-[10px] uppercase font-bold tracking-wider">Secure</span>
                     </div>
                     <div className="flex flex-col items-center gap-1">
                        <Shield size={20} />
                        <span className="text-[10px] uppercase font-bold tracking-wider">Private</span>
                     </div>
                     <div className="flex flex-col items-center gap-1">
                        <Search size={20} />
                        <span className="text-[10px] uppercase font-bold tracking-wider">Transparent</span>
                     </div>
                  </div>
               </div>
            </div>
          </motion.article>
        </main>
      </div>

      {/* Copyright Footer */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="py-12 flex flex-col sm:flex-row items-center justify-between gap-6 opacity-40 text-[11px] font-bold uppercase tracking-widest border-t border-border/20">
           <div className="flex items-center gap-3">
              <Database size={14} className="text-primary" />
              <span>© 2026 PingMyDb Systems Inc.</span>
           </div>
           <div className="flex items-center gap-6">
              <Link to="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
              <Link to="/terms" className="hover:text-primary transition-colors">Terms & Conditions</Link>
              <a href="https://github.com/orgs/PingMyDB/repositories" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                 <Github size={14} />
              </a>
              <a href="#" className="hover:text-primary transition-colors flex items-center gap-1.5">
                 Status <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
              </a>
           </div>
        </div>
      </div>
    </div>
  );
};

export default DocsPage;
