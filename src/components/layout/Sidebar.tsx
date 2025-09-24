"use client";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Collapse } from "reactstrap";
import { MenuItem } from "@/layouts/MenuData";

interface SidebarProps {
  menuItems: MenuItem[];
  userRole?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ menuItems, userRole }) => {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<{ [key: number]: boolean }>({});

  const toggleMenu = (menuId: number) => {
    setOpenMenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
  };

  const isActiveMenu = (item: MenuItem): boolean => {
    if (item.link === pathname) return true;
    if (item.subItems) {
      return item.subItems.some((subItem: MenuItem) => subItem.link === pathname);
    }
    return false;
  };

  const renderMenuItem = (item: MenuItem) => {
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isActive = isActiveMenu(item);
    const isOpen = openMenus[item.id] || isActive;

    if (item.isHeader) {
      return (
        <li key={item.id} className="menu-title">
          <span>{item.label}</span>
        </li>
      );
    }

    if (hasSubItems) {
      return (
        <li key={item.id} className="nav-item">
          <Link
            href="#"
            className={`nav-link menu-link ${isActive ? "active" : ""}`}
            onClick={(e) => {
              e.preventDefault();
              toggleMenu(item.id);
            }}
            data-bs-toggle="collapse"
          >
            {item.icon && <i className={item.icon}></i>}
            <span>{item.label}</span>
            {item.badgeName && (
              <span className={`badge badge-pill bg-${item.badgeColor || "primary"}`}>
                {item.badgeName}
              </span>
            )}
          </Link>
          <Collapse className="menu-dropdown" isOpen={isOpen}>
            <ul className="nav nav-sm flex-column">
              {item.subItems!.map((subItem: MenuItem) => (
                <li key={subItem.id} className="nav-item">
                  <Link
                    href={subItem.link || "#"}
                    className={`nav-link ${pathname === subItem.link ? "active" : ""}`}
                  >
                    {subItem.label}
                    {subItem.badgeName && (
                      <span className={`badge badge-pill bg-${subItem.badgeColor || "primary"}`}>
                        {subItem.badgeName}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </Collapse>
        </li>
      );
    }

    return (
      <li key={item.id} className="nav-item">
        <Link
          href={item.link || "#"}
          className={`nav-link menu-link ${isActive ? "active" : ""}`}
        >
          {item.icon && <i className={item.icon}></i>}
          <span>{item.label}</span>
          {item.badgeName && (
            <span className={`badge badge-pill bg-${item.badgeColor || "primary"}`}>
              {item.badgeName}
            </span>
          )}
        </Link>
      </li>
    );
  };

  return (
    <div className="vertical-menu">
      <div data-simplebar className="h-100">
        {/* Logo */}
        <div className="navbar-brand-box">
          <Link href="/" className="logo logo-dark">
            <span className="logo-sm">
              <img src="/images/ybb-logo.png" alt="" height="22" />
            </span>
            <span className="logo-lg">
              <img src="/images/ybb-logo-dark.png" alt="" height="17" />
            </span>
          </Link>
          <Link href="/" className="logo logo-light">
            <span className="logo-sm">
              <img src="/images/ybb-logo-sm.png" alt="" height="22" />
            </span>
            <span className="logo-lg">
              <img src="/images/ybb-logo-light.png" alt="" height="17" />
            </span>
          </Link>
        </div>

        <button
          type="button"
          className="btn btn-sm p-0 fs-20 header-item float-end btn-vertical-sm-hover"
          id="vertical-hover"
        >
          <i className="ri-record-circle-line"></i>
        </button>

        <div id="sidebar-menu">
          {/* Role Badge */}
          {userRole && (
            <div className="px-3 py-2">
              <span className={`badge bg-${userRole === 'participant' ? 'primary' : 'success'} fs-12`}>
                {userRole.charAt(0).toUpperCase() + userRole.slice(1)} Dashboard
              </span>
            </div>
          )}
          
          <ul className="navbar-nav" id="navbar-nav">
            {menuItems.map(renderMenuItem)}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;