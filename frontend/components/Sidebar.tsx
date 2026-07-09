"use client";
import React from 'react';
import { Users, Megaphone } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className="w-64 min-h-screen bg-[#F8F9FA] border-r border-gray-200 flex flex-col p-4">
      <div className="flex items-center gap-2 mb-8 px-2">
        <div className="w-8 h-8 bg-black rounded flex items-center justify-center">
           <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
             <path d="M12 2L2 22h20L12 2z" fill="white"/>
           </svg>
        </div>
        <span className="font-bold text-xl">GrowEasy</span>
      </div>

      <div className="mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-3 flex items-center justify-between cursor-pointer hover:shadow-sm transition-all">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-blue-100 rounded-md"></div>
             <div>
               <p className="text-sm font-semibold">VK Test</p>
               <p className="text-xs text-gray-500 uppercase">Owner</p>
             </div>
          </div>
          <span className="text-gray-400">›</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="mb-6">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-2">Main</p>
          <nav className="space-y-1">
            <NavItem href="/manage-leads" icon={<Users size={18} />} label="Manage Leads" active={pathname === '/manage-leads'} />
          </nav>
        </div>

        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-2">Control Center</p>
          <nav className="space-y-1">
            <NavItem href="/" icon={<Megaphone size={18} />} label="Lead Sources" active={pathname === '/' || pathname === '/lead-sources'} />
          </nav>
        </div>
      </div>
    </div>
  );
};

const NavItem = ({ href, icon, label, active = false }: { href: string, icon: React.ReactNode, label: string, active?: boolean }) => {
  return (
    <Link href={href} className={`flex items-center gap-3 px-4 py-2.5 rounded-full text-sm font-bold transition-colors ${active ? 'bg-[#e6f4f1] text-[#1c7865]' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'}`}>
      <span className={active ? 'text-[#1c7865]' : 'text-gray-400'}>{icon}</span>
      {label}
    </Link>
  );
};

export default Sidebar;
