"use client";

import React, { useEffect, useCallback, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Collapse } from "reactstrap";
import { YBB_ROUTES } from "../constants/ybb";

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  link?: string;
  subItems?: MenuItem[];
  stateVariable?: boolean;
}

const ParticipantLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();

  // State for menu items
  const [isDashboard, setIsDashboard] = useState<boolean>(false);
  const [isSubmissions, setIsSubmissions] = useState<boolean>(false);
  const [isProfile, setIsProfile] = useState<boolean>(false);

  // Menu data for participant dashboard
  const menuItems: MenuItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "ri-dashboard-2-line",
      link: YBB_ROUTES.PARTICIPANT.DASHBOARD,
    },
    {
      id: "submissions", 
      label: "Submissions",
      icon: "ri-file-text-line",
      link: YBB_ROUTES.PARTICIPANT.SUBMISSIONS,
    },
    {
      id: "documents",
      label: "Documents", 
      icon: "ri-folder-line",
      link: YBB_ROUTES.PARTICIPANT.DOCUMENTS,
    },
    {
      id: "payments",
      label: "Payments",
      icon: "ri-bank-card-line", 
      link: YBB_ROUTES.PARTICIPANT.PAYMENTS,
    },
    {
      id: "profile",
      label: "Profile",
      icon: "ri-user-line",
      link: YBB_ROUTES.PARTICIPANT.PROFILE,
    },
  ];

  // Responsive sidebar handling
  const resizeSidebarMenu = useCallback(() => {
    const windowSize = document.documentElement.clientWidth;
    const hamburgerIcon = document.querySelector(".hamburger-icon") as HTMLElement;
    
    if (windowSize >= 1025) {
      document.documentElement.setAttribute("data-sidebar-size", "lg");
      if (hamburgerIcon) {
        hamburgerIcon.classList.remove("open");
      }
    } else if (windowSize < 1025 && windowSize > 767) {
      document.documentElement.setAttribute("data-sidebar-size", "sm");
      if (hamburgerIcon) {
        hamburgerIcon.classList.add("open");
      }
    } else if (windowSize <= 767) {
      document.body.classList.remove("vertical-sidebar-enable");
      document.documentElement.setAttribute("data-sidebar-size", "lg");
      if (hamburgerIcon) {
        hamburgerIcon.classList.add("open");
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener("resize", resizeSidebarMenu, true);
    return () => {
      window.removeEventListener("resize", resizeSidebarMenu, true);
    };
  }, [resizeSidebarMenu]);

  // Initialize menu and set active states
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    
    const initMenu = () => {
      const ul = document.getElementById("navbar-nav") as HTMLElement;
      if (!ul) return;
      
      const items: any = ul.getElementsByTagName("a");
      let itemsArray = [...items];
      removeActivation(itemsArray);
      
      let matchingMenuItem = itemsArray.find(x => {
        return x.pathname === pathname;
      });
      
      if (matchingMenuItem) {
        activateParentDropdown(matchingMenuItem);
      }
    };
    
    initMenu();
  }, [pathname]);

  function activateParentDropdown(item: any) {
    item.classList.add("active");
    let parentCollapseDiv = item.closest(".collapse.menu-dropdown");

    if (parentCollapseDiv) {
      parentCollapseDiv.classList.add("show");
      parentCollapseDiv.parentElement.children[0].classList.add("active");
      parentCollapseDiv.parentElement.children[0].setAttribute("aria-expanded", "true");
    }
    return false;
  }

  const removeActivation = (items: any) => {
    let actiItems = items.filter((x: any) => x.classList.contains("active"));

    actiItems.forEach((item: any) => {
      if (item.classList.contains("menu-link")) {
        if (!item.classList.contains("active")) {
          item.setAttribute("aria-expanded", false);
        }
        if (item.nextElementSibling) {
          item.nextElementSibling.classList.remove("show");
        }
      }
      if (item.classList.contains("nav-link")) {
        if (item.nextElementSibling) {
          item.nextElementSibling.classList.remove("show");
        }
        item.setAttribute("aria-expanded", false);
      }
      item.classList.remove("active");
    });
  };

  const handleLogout = () => {
    // TODO: Implement logout logic
    router.push(YBB_ROUTES.HOME);
  };

  return (
    <div className="layout-wrapper">
      {/* Header */}
      <header id="page-topbar">
        <div className="layout-width">
          <div className="navbar-header">
            <div className="d-flex">
              {/* LOGO */}
              <div className="navbar-brand-box horizontal-logo">
                <Link href={YBB_ROUTES.HOME} className="logo logo-dark">
                  <span className="logo-sm">
                    <img src="/images/logo-sm.png" alt="" height="22" />
                  </span>
                  <span className="logo-lg">
                    <img src="/images/logo-dark.png" alt="" height="17" />
                  </span>
                </Link>
                <Link href={YBB_ROUTES.HOME} className="logo logo-light">
                  <span className="logo-sm">
                    <img src="/images/logo-sm.png" alt="" height="22" />
                  </span>
                  <span className="logo-lg">
                    <img src="/images/logo-light.png" alt="" height="17" />
                  </span>
                </Link>
              </div>

              <button
                type="button"
                className="btn btn-sm px-3 fs-16 header-item vertical-menu-btn topnav-hamburger"
                id="topnav-hamburger-icon"
                onClick={() => {
                  const hamburgerIcon = document.querySelector(".hamburger-icon");
                  if (hamburgerIcon) {
                    hamburgerIcon.classList.toggle("open");
                  }
                  document.body.classList.toggle("vertical-sidebar-enable");
                }}
              >
                <span className="hamburger-icon">
                  <span></span>
                  <span></span>
                  <span></span>
                </span>
              </button>
            </div>

            <div className="d-flex align-items-center">
              {/* User Dropdown */}
              <div className="dropdown ms-sm-3 header-item topbar-user">
                <button
                  type="button"
                  className="btn"
                  id="page-header-user-dropdown"
                  data-bs-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <span className="d-flex align-items-center">
                    <img
                      className="rounded-circle header-profile-user"
                      src="/images/users/avatar-1.jpg"
                      alt="Header Avatar"
                    />
                    <span className="text-start ms-xl-2">
                      <span className="d-none d-xl-inline-block ms-1 fw-medium user-name-text">
                        Participant
                      </span>
                      <span className="d-none d-xl-block ms-1 fs-12 user-name-sub-text text-muted">
                        Dashboard
                      </span>
                    </span>
                  </span>
                </button>
                <div className="dropdown-menu dropdown-menu-end">
                  <h6 className="dropdown-header">Welcome Participant!</h6>
                  <Link className="dropdown-item" href={YBB_ROUTES.PARTICIPANT.PROFILE}>
                    <i className="mdi mdi-account-circle text-muted fs-16 align-middle me-1"></i>
                    <span className="align-middle">Profile</span>
                  </Link>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item" onClick={handleLogout}>
                    <i className="mdi mdi-logout text-muted fs-16 align-middle me-1"></i>
                    <span className="align-middle" data-key="t-logout">
                      Logout
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Vertical Sidebar */}
      <div className="app-menu navbar-menu">
        <div className="navbar-brand-box">
          <Link href={YBB_ROUTES.HOME} className="logo logo-dark">
            <span className="logo-sm">
              <img src="/images/logo-sm.png" alt="" height="22" />
            </span>
            <span className="logo-lg">
              <img src="/images/logo-dark.png" alt="" height="17" />
            </span>
          </Link>
          <Link href={YBB_ROUTES.HOME} className="logo logo-light">
            <span className="logo-sm">
              <img src="/images/logo-sm.png" alt="" height="22" />
            </span>
            <span className="logo-lg">
              <img src="/images/logo-light.png" alt="" height="17" />
            </span>
          </Link>
          <button
            type="button"
            className="btn btn-sm p-0 fs-20 header-item float-end btn-vertical-sm-hover"
            id="vertical-hover"
          >
            <i className="ri-record-circle-line"></i>
          </button>
        </div>

        <div id="scrollbar">
          <div className="container-fluid">
            <div id="two-column-menu"></div>
            <ul className="navbar-nav" id="navbar-nav">
              <li className="menu-title">
                <span>Participant Portal</span>
              </li>
              {menuItems.map((item, key) => (
                <li className="nav-item" key={key}>
                  <Link
                    className="nav-link menu-link"
                    href={item.link || "#"}
                  >
                    <i className={item.icon}></i>
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
              
              {/* Divider */}
              <li className="menu-title">
                <span>Quick Actions</span>
              </li>
              
              <li className="nav-item">
                <Link className="nav-link menu-link" href={YBB_ROUTES.HOME}>
                  <i className="ri-home-line"></i>
                  <span>Back to Main Site</span>
                </Link>
              </li>
              
              <li className="nav-item">
                <button className="nav-link menu-link" onClick={handleLogout}>
                  <i className="ri-logout-box-line"></i>
                  <span>Logout</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="sidebar-background"></div>
      </div>

      {/* Left Sidebar End */}
      <div className="vertical-overlay"></div>

      {/* Main Content */}
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
                {new Date().getFullYear()} © YBB Platform
              </div>
              <div className="col-sm-6">
                <div className="text-sm-end d-none d-sm-block">
                  Participant Dashboard
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ParticipantLayout;