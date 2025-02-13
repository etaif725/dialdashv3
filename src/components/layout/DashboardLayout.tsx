import { type ReactNode, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import Footer from './Footer';

export const DashboardLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="flex h-screen bg-[hsl(var(--background))]">
        {/* Geometric pattern background with floating shapes */}
        <div className="fixed inset-0 overflow-hidden -z-10 min-h-screen">
          {/* Background grid pattern */}
          <div className="fixed inset-0 bg-[hsl(var(--background))] min-h-screen">
            <div className="fixed inset-0 min-h-screen" style={{
              backgroundImage: `
                radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0),
                repeating-linear-gradient(0deg, transparent, transparent 40px, hsl(var(--foreground)/.03) 40px, hsl(var(--foreground)/.03) 80px)
              `,
              backgroundSize: '40px 40px, 100% 80px',
              backgroundRepeat: 'repeat'
            }}></div>
          </div>
        </div>
      {/* Mobile sidebar backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-[hsl(var(--background)/.8)] z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 transform lg:relative lg:translate-x-0 
          transition-transform duration-300 ease-in-out bg-[hsl(var(--background))] border-r border-[hsl(var(--border))]
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:flex`}
      >
        <Sidebar onClose={() => setIsMobileMenuOpen(false)} />
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header onMenuClick={toggleMobileMenu} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-[hsl(var(--background))] relative">
          <div className="mx-auto space-y-6">
            <div className="rounded-lg">
              <div className="rounded-lg bg-[hsl(var(--card))]">
                <Outlet />
              </div>
            </div>
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
}; 