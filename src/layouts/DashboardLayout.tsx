"use client";
import React, { useState } from "react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { 
  getParticipantMenuItems, 
  getAmbassadorMenuItems,
  MenuItem 
} from "@/layouts/MenuData";
import { User } from "@/types/ybb";

interface DashboardLayoutProps {
  children: React.ReactNode;
  user?: User | null;
  userRole: 'participant' | 'ambassador';
  onLogout?: () => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  user,
  userRole,
  onLogout,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const getMenuItems = (): MenuItem[] => {
    switch (userRole) {
      case 'participant':
        return getParticipantMenuItems();
      case 'ambassador':
        return getAmbassadorMenuItems();
      default:
        return [];
    }
  };

  return (
    <div id="layout-wrapper">
      <Header 
        onMenuClick={toggleSidebar}
        user={user}
        onLogout={onLogout}
      />
      
      <Sidebar 
        menuItems={getMenuItems()}
        userRole={userRole}
      />
      
      <div className="main-content">
        <div className="page-content">
          <div className="container-fluid">
            {children}
          </div>
        </div>
        
        <footer className="footer">
          <div className="container-fluid">
            <div className="row">
              <div className="col-sm-6">
                <div className="text-sm-end d-none d-sm-block">
                  Design & Develop by YBB Team
                </div>
              </div>
              <div className="col-sm-6">
                <div className="text-sm-end d-none d-sm-block">
                  © {new Date().getFullYear()} YBB Platform.
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* Sidebar overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="vertical-overlay" 
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default DashboardLayout;