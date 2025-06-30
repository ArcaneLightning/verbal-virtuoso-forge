import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { 
  Home, 
  Mic, 
  MessageSquare, 
  Users, 
  Settings, 
  LogOut,
  Trophy,
  BarChart3
} from 'lucide-react';
import { supabase } from '../integrations/supabase/client';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Practice', href: '/practice', icon: Mic },
    { name: 'Debate', href: '/debate', icon: MessageSquare },
    { name: 'Teams', href: '/teams', icon: Users },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Achievements', href: '/achievements', icon: Trophy },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg border-r border-gray-200">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-center border-b border-gray-200 bg-gradient-to-r from-blue-600 to-cyan-600">
            <h1 className="text-xl font-bold text-white">ForensIQ</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-4 py-4">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Sign out */}
          <div className="border-t border-gray-200 p-4">
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="pl-64">
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;

 