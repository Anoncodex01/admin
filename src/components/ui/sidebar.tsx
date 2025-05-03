import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Users, CreditCard, Settings, DollarSign, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  const navItems = [
    {
      title: 'Dashboard',
      icon: Home,
      href: '/',
      description: 'Overview & Stats',
      bgColor: 'bg-orange-100',
      hoverColor: 'hover:bg-orange-50',
      textColor: 'text-orange-600',
      groupHoverColor: 'group-hover:text-orange-500'
    },
    {
      title: 'Creators',
      icon: Users,
      href: '/creators',
      description: 'Manage Content Creators',
      bgColor: 'bg-blue-100',
      hoverColor: 'hover:bg-blue-50',
      textColor: 'text-blue-600',
      groupHoverColor: 'group-hover:text-blue-500'
    },
    {
      title: 'Supporters',
      icon: DollarSign,
      href: '/supporters',
      description: 'View All Supporters',
      bgColor: 'bg-green-100',
      hoverColor: 'hover:bg-green-50',
      textColor: 'text-green-600',
      groupHoverColor: 'group-hover:text-green-500'
    },
    {
      title: 'Transactions',
      icon: CreditCard,
      href: '/transactions',
      description: 'Payment History',
      bgColor: 'bg-purple-100',
      hoverColor: 'hover:bg-purple-50',
      textColor: 'text-purple-600',
      groupHoverColor: 'group-hover:text-purple-500'
    },
    {
      title: 'Settings',
      icon: Settings,
      href: '/settings',
      description: 'System Preferences',
      bgColor: 'bg-gray-100',
      hoverColor: 'hover:bg-gray-50',
      textColor: 'text-gray-600',
      groupHoverColor: 'group-hover:text-gray-700'
    }
  ];

  return (
    <div className="fixed inset-y-0 left-0 w-80 bg-white border-r border-gray-100 shadow-sm">
      {/* Logo Section */}
      <div className="flex items-center gap-3 px-6 py-8 border-b border-gray-50">
        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-pink-500 rounded-xl flex items-center justify-center">
          <span className="text-xl font-bold text-white">N</span>
        </div>
        <div>
          <h1 className="text-xl font-semibold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
            Nisapoti
          </h1>
          <p className="text-xs text-gray-500">Admin Dashboard</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="p-4">
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3.5 rounded-xl text-gray-700 transition-all duration-300 group",
                item.hoverColor,
                location.pathname === item.href && "bg-orange-50 text-orange-600"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                item.bgColor
              )}>
                <item.icon className={cn("w-5 h-5", item.textColor)} />
              </div>
              <div>
                <span className="font-medium">{item.title}</span>
                <p className={cn(
                  "text-xs text-gray-500",
                  item.groupHoverColor
                )}>{item.description}</p>
              </div>
            </Link>
          ))}
        </nav>
      </div>

      {/* User Profile Section */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center">
            <span className="text-sm font-bold text-white">A</span>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-900">Admin User</h3>
            <p className="text-xs text-gray-500">admin@nisapoti.com</p>
          </div>
          <button 
            onClick={handleLogout}
            className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-gray-400 hover:text-red-600 transition-colors"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}