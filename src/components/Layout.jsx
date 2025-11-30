import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { FileText, Home, Plus, Settings as SettingsIcon, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, signOut } = useAuth();

    const isActive = (path) => {
        return location.pathname === path;
    };

    const handleLogout = async () => {
        await signOut();
        navigate('/login');
    };

    const navItems = [
        { path: '/', icon: Home, label: 'Dashboard' },
        { path: '/create', icon: Plus, label: 'New Invoice' },
        { path: '/settings', icon: SettingsIcon, label: 'Settings' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-lg print-hidden flex flex-col">
                <div className="p-6 border-b">
                    <div className="flex items-center gap-3">
                        <FileText className="w-8 h-8 text-blue-600" />
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">Pete's Tech</h1>
                            <p className="text-xs text-gray-500">Invoice Manager</p>
                        </div>
                    </div>
                </div>

                <nav className="p-4 flex-1">
                    <ul className="space-y-2">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.path);

                            return (
                                <li key={item.path}>
                                    <Link
                                        to={item.path}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${active
                                                ? 'bg-blue-50 text-blue-600 font-semibold'
                                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                            }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span>{item.label}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* User info and logout */}
                <div className="p-4 border-t bg-gray-50">
                    <div className="flex items-center gap-3 mb-3 px-2">
                        <User className="w-5 h-5 text-gray-600" />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <Outlet />
            </main>
        </div>
    );
}
