"use client";

import React, { useEffect, useCallback, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";
import { YBB_ROUTES } from "../constants/ybb";
// Ensure custom dashboard styles are loaded
import "@/assets/scss/custom-dashboard.scss";
import "@/styles/participant-dashboard.css";
import {
  LAYOUT_TYPES,
  LAYOUT_MODE_TYPES,
  LAYOUT_WIDTH_TYPES,
  LAYOUT_POSITION_TYPES,
} from "../constants/layout";

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  link?: string;
}

const ParticipantLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  // Layout state selector following Velzon pattern
  const selectLayoutState = (state: any) => state.Layout;
  const selectLayoutProperties = createSelector(
    selectLayoutState,
    (layout) => ({
      layoutType: layout.layoutType,
      leftSidebarType: layout.leftSidebarType,
      layoutModeType: layout.layoutModeType,
      layoutWidthType: layout.layoutWidthType,
      layoutPositionType: layout.layoutPositionType,
      topbarThemeType: layout.topbarThemeType,
      leftsidbarSizeType: layout.leftsidbarSizeType,
      leftSidebarViewType: layout.leftSidebarViewType,
      leftSidebarImageType: layout.leftSidebarImageType,
      preloader: layout.preloader,
      sidebarVisibilitytype: layout.sidebarVisibilitytype,
    })
  );

  const {
    layoutType,
    leftSidebarType,
    layoutModeType,
    layoutWidthType,
    layoutPositionType,
    topbarThemeType,
    leftsidbarSizeType,
    leftSidebarViewType,
    leftSidebarImageType,
    sidebarVisibilitytype,
  } = useSelector(selectLayoutProperties);

  // Menu data for participant dashboard
  const menuItems: MenuItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "ri-dashboard-2-line",
      link: "/dashboard",
    },
    {
      id: "submissions", 
      label: "Submissions",
      icon: "ri-file-text-line",
      link: "/submissions",
    },
    {
      id: "documents",
      label: "Documents", 
      icon: "ri-folder-line",
      link: "/documents",
    },
    {
      id: "payments",
      label: "Payments",
      icon: "ri-bank-card-line", 
      link: "/payments",
    },
    {
      id: "profile",
      label: "Profile",
      icon: "ri-user-line",
      link: "/profile",
    },
  ];

  // Initialize layout attributes based on Redux state following Velzon documentation
  useEffect(() => {
    // Set layout attributes from Redux state
    document.documentElement.setAttribute("data-layout", layoutType || LAYOUT_TYPES.VERTICAL);
    document.documentElement.setAttribute("data-topbar", topbarThemeType || "light");
    document.documentElement.setAttribute("data-sidebar", leftSidebarType || "light");
    document.documentElement.setAttribute("data-sidebar-size", leftsidbarSizeType || "lg");
    document.documentElement.setAttribute("data-sidebar-view", leftSidebarViewType || "default");
    document.documentElement.setAttribute("data-sidebar-image", leftSidebarImageType || "none");
    document.documentElement.setAttribute("data-preloader", "disable");
    document.documentElement.setAttribute("data-theme", "default");
    document.documentElement.setAttribute("data-theme-colors", "default");
    document.documentElement.setAttribute("data-bs-theme", layoutModeType || "light");
    document.documentElement.setAttribute("data-layout-width", layoutWidthType || "fluid");
    document.documentElement.setAttribute("data-layout-position", layoutPositionType || "fixed");
    
    // Set body attributes
    document.body.setAttribute("data-layout", layoutType || LAYOUT_TYPES.VERTICAL);
    document.body.setAttribute("data-sidebar", leftSidebarType || "light");
    
    // Add CSS variables for Velzon following documentation
    const prefix = "vz";
    document.documentElement.style.setProperty(`--${prefix}-vertical-menu-width`, "250px");
    document.documentElement.style.setProperty(`--${prefix}-header-height`, "70px");
    document.documentElement.style.setProperty(`--${prefix}-horizontal-menu-height`, "70px");
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [
    layoutType,
    leftSidebarType,
    layoutModeType,
    layoutWidthType,
    layoutPositionType,
    topbarThemeType,
    leftsidbarSizeType,
    leftSidebarViewType,
    leftSidebarImageType,
  ]);

  // Initialize menu and set active states
  useEffect(() => {
    const initMenu = () => {
      const ul = document.getElementById("navbar-nav");
      if (!ul) return;
      
      const items = ul.getElementsByTagName("a");
      const itemsArray = Array.from(items);
      
      // Remove previous active states
      itemsArray.forEach(item => {
        item.classList.remove("active");
      });
      
      // Find and activate current page based on pathname
      const matchingMenuItem = itemsArray.find(item => {
        const href = item.getAttribute("href");
        // Match relative paths with current pathname
        if (href) {
          // Remove /participant prefix from pathname for comparison
          const currentPage = pathname.replace("/participant", "");
          return href === currentPage || (href === "/dashboard" && currentPage === "/dashboard");
        }
        return false;
      });
      
      if (matchingMenuItem) {
        matchingMenuItem.classList.add("active");
      }
    };
    
    initMenu();
  }, [pathname]);

  // Responsive sidebar handling following Velzon documentation
  const resizeSidebarMenu = useCallback(() => {
    const windowSize = document.documentElement.clientWidth;
    const hamburgerIcon = document.querySelector(".hamburger-icon") as HTMLElement;
    
    if (windowSize >= 1025) {
      if (document.documentElement.getAttribute("data-layout") === "vertical") {
        document.documentElement.setAttribute("data-sidebar-size", leftsidbarSizeType || "lg");
      }
      if (hamburgerIcon) {
        hamburgerIcon.classList.remove("open");
      }
    } else if (windowSize < 1025 && windowSize > 767) {
      if (document.documentElement.getAttribute("data-layout") === "vertical") {
        document.documentElement.setAttribute("data-sidebar-size", "sm");
      }
      if (hamburgerIcon) {
        hamburgerIcon.classList.add("open");
      }
    } else if (windowSize <= 767) {
      document.body.classList.remove("vertical-sidebar-enable");
      if (document.documentElement.getAttribute("data-layout") !== "horizontal") {
        document.documentElement.setAttribute("data-sidebar-size", "lg");
      }
      if (hamburgerIcon) {
        hamburgerIcon.classList.add("open");
      }
    }
  }, [leftsidbarSizeType]);

  const toggleSidebar = useCallback(() => {
    const body = document.body;
    const hamburgerIcon = document.querySelector(".hamburger-icon");
    const hamburgerButton = document.querySelector("#topnav-hamburger-icon");
    
    // Toggle sidebar visibility
    body.classList.toggle("vertical-sidebar-enable");
    
    // Toggle hamburger icon animation
    if (hamburgerIcon) {
      hamburgerIcon.classList.toggle("open");
    }
    
    // Update aria attributes for accessibility
    if (hamburgerButton) {
      const isExpanded = body.classList.contains("vertical-sidebar-enable");
      hamburgerButton.setAttribute("aria-expanded", isExpanded.toString());
    }
  }, []);

  useEffect(() => {
    window.addEventListener("resize", resizeSidebarMenu, true);
    return () => {
      window.removeEventListener("resize", resizeSidebarMenu, true);
    };
  }, [resizeSidebarMenu]);

  // Initialize participant-specific layout settings
  useEffect(() => {
    // Initialize sidebar menu on route change
    const initMenu = () => {
      resizeSidebarMenu();
    };
    
    initMenu();
  }, [pathname, resizeSidebarMenu]);

  // Mock data for participant's program participations - in real app this would come from API
  const participantPrograms = [
    {
      id: "iys-2025-part1",
      title: "IYS 2025 - Part 1",
      year: "2025",
      status: "completed",
      role: "Participant",
      dateParticipated: "Feb 2025"
    },
    {
      id: "iys-2025-part2", 
      title: "IYS 2025 - Part 2",
      year: "2025",
      status: "active",
      role: "Participant",
      dateParticipated: "Aug 2025"
    },
    {
      id: "iys-2024-part1",
      title: "IYS 2024 - Part 1", 
      year: "2024",
      status: "completed",
      role: "Participant",
      dateParticipated: "Mar 2024"
    }
  ];

  // Get currently selected program (default to most recent active or completed)
  const [currentProgram, setCurrentProgram] = useState(
    participantPrograms.find(p => p.status === 'active') || participantPrograms[0]
  );

  const handleProgramSwitch = (programId: string) => {
    const selectedProgram = participantPrograms.find(p => p.id === programId);
    if (selectedProgram) {
      setCurrentProgram(selectedProgram);
      // TODO: Update the context/state to switch dashboard data to selected program
      // This would typically update a global state or context that other components use
    }
  };

  const handleLogout = () => {
    // TODO: Implement logout logic  
    router.push(YBB_ROUTES.HOME);
  };

  return (
    <div id="layout-wrapper">
      {/* Header */}
      <header id="page-topbar">
        <div className="layout-width">
          <div className="navbar-header">
            <div className="d-flex">
              {/* LOGO */}
              <div className="navbar-brand-box horizontal-logo">
                <Link href={YBB_ROUTES.HOME} className="logo logo-dark">
                  <span className="logo-sm">
                    <span className="fw-bold text-primary">YBB</span>
                  </span>
                  <span className="logo-lg">
                    <span className="fw-bold text-primary">YBB Platform</span>
                  </span>
                </Link>
                <Link href={YBB_ROUTES.HOME} className="logo logo-light">
                  <span className="logo-sm">
                    <span className="fw-bold text-white">YBB</span>
                  </span>
                  <span className="logo-lg">
                    <span className="fw-bold text-white">YBB Platform</span>
                  </span>
                </Link>
              </div>

              <button
                type="button"
                className="btn btn-sm px-3 fs-16 header-item vertical-menu-btn topnav-hamburger material-shadow-none"
                id="topnav-hamburger-icon"
                onClick={toggleSidebar}
                aria-label="Toggle navigation"
                aria-expanded="false"
                aria-controls="navbar-nav"
              >
                <span className="hamburger-icon">
                  <span></span>
                  <span></span>
                  <span></span>
                </span>
              </button>
            </div>

            <div className="d-flex align-items-center">
              {/* Program Selector Dropdown */}
              <div className="dropdown ms-sm-3 header-item">
                <button
                  type="button"
                  className="btn btn-ghost-primary material-shadow-none d-flex align-items-center"
                  id="program-selector-dropdown"
                  data-bs-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <div className="me-2">
                    <i className="ri-calendar-event-line fs-16"></i>
                  </div>
                  <div className="text-start d-none d-lg-block">
                    <div className="fs-14 fw-medium">{currentProgram.title}</div>
                    <div className="fs-12 text-muted">{currentProgram.dateParticipated}</div>
                  </div>
                  <div className="ms-2">
                    <i className="ri-arrow-down-s-line fs-16"></i>
                  </div>
                </button>
                <div className="dropdown-menu dropdown-menu-end" style={{ minWidth: "280px" }}>
                  <div className="dropdown-header">
                    <h6 className="mb-0">My Programs</h6>
                    <small className="text-muted">Switch between your program participations</small>
                  </div>
                  <div className="dropdown-divider"></div>
                  {participantPrograms.map((program) => (
                    <button
                      key={program.id}
                      className={`dropdown-item d-flex align-items-center p-3 ${
                        currentProgram.id === program.id ? 'active' : ''
                      }`}
                      onClick={() => handleProgramSwitch(program.id)}
                    >
                      <div className="flex-shrink-0 me-3">
                        <div className={`avatar-xs ${
                          program.status === 'active' 
                            ? 'bg-success-subtle text-success' 
                            : 'bg-secondary-subtle text-secondary'
                        } rounded-circle d-flex align-items-center justify-content-center`}>
                          <i className={
                            program.status === 'active' 
                              ? 'ri-play-circle-line' 
                              : 'ri-checkbox-circle-line'
                          }></i>
                        </div>
                      </div>
                      <div className="flex-grow-1">
                        <div className="fw-medium">{program.title}</div>
                        <div className="fs-13 text-muted d-flex align-items-center">
                          <span className="me-2">{program.dateParticipated}</span>
                          <span className={`badge ${
                            program.status === 'active' 
                              ? 'bg-success-subtle text-success' 
                              : 'bg-secondary-subtle text-secondary'
                          } fs-11`}>
                            {program.status === 'active' ? 'Active' : 'Completed'}
                          </span>
                        </div>
                      </div>
                      {currentProgram.id === program.id && (
                        <div className="flex-shrink-0">
                          <i className="ri-check-line text-success"></i>
                        </div>
                      )}
                    </button>
                  ))}
                  <div className="dropdown-divider"></div>
                  <div className="dropdown-item-text p-3 text-center">
                    <Link href="/apply" className="btn btn-soft-primary btn-sm">
                      <i className="ri-add-line me-1"></i>
                      Join New Program
                    </Link>
                  </div>
                </div>
              </div>

              {/* User Dropdown */}
              <div className="dropdown ms-sm-3 header-item topbar-user">
                <button
                  type="button"
                  className="btn material-shadow-none"
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
                      width="32"
                      height="32"
                    />
                    <span className="text-start ms-xl-2">
                      <span className="d-none d-xl-inline-block ms-1 fw-medium user-name-text">
                        John Doe
                      </span>
                      <span className="d-none d-xl-block ms-1 fs-12 user-name-sub-text text-muted">
                        Participant
                      </span>
                    </span>
                  </span>
                </button>
                <div className="dropdown-menu dropdown-menu-end">
                  <h6 className="dropdown-header">Welcome John!</h6>
                  <Link className="dropdown-item" href={YBB_ROUTES.PARTICIPANT.PROFILE}>
                    <i className="mdi mdi-account-circle text-muted fs-16 align-middle me-1"></i>
                    <span className="align-middle">Profile</span>
                  </Link>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item" onClick={handleLogout}>
                    <i className="mdi mdi-logout text-muted fs-16 align-middle me-1"></i>
                    <span className="align-middle">Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Vertical Sidebar - Following Velzon Documentation Structure */}
      <div className="app-menu navbar-menu">
        <div className="navbar-brand-box">
          <Link href={YBB_ROUTES.HOME} className="logo logo-dark">
            <span className="logo-sm">
              <span className="fw-bold text-primary">YBB</span>
            </span>
            <span className="logo-lg">
              <span className="fw-bold text-primary">YBB Platform</span>
            </span>
          </Link>
          <Link href={YBB_ROUTES.HOME} className="logo logo-light">
            <span className="logo-sm">
              <span className="fw-bold text-white">YBB</span>
            </span>
            <span className="logo-lg">
              <span className="fw-bold text-white">YBB Platform</span>
            </span>
          </Link>
          <button
            type="button"
            className="btn btn-sm p-0 fs-20 header-item float-end btn-vertical-sm-hover material-shadow-none"
            id="vertical-hover"
          >
            <i className="ri-record-circle-line"></i>
          </button>
        </div>

        <div id="scrollbar">
          <div className="container-fluid">
            <div id="two-column-menu"></div>
            <ul className="navbar-nav" id="navbar-nav">
              {menuItems.map((item) => {
                const isActive = pathname === item.link;
                return (
                  <li className="nav-item" key={item.id}>
                    <Link
                      className={`nav-link menu-link ${isActive ? 'active' : ''}`}
                      href={item.link || "#"}
                    >
                      <i className={item.icon}></i>
                      <span data-key={`t-${item.id}`}>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
              
              {/* Divider */}
              <li className="menu-title">
                <span data-key="t-actions">Quick Actions</span>
              </li>
              
              <li className="nav-item">
                <Link className="nav-link menu-link" href={YBB_ROUTES.HOME}>
                  <i className="ri-home-line"></i>
                  <span data-key="t-home">Back to Main Site</span>
                </Link>
              </li>
              
              <li className="nav-item">
                <button 
                  className="nav-link menu-link text-start border-0 bg-transparent w-100" 
                  onClick={handleLogout}
                  type="button"
                >
                  <i className="ri-logout-box-line"></i>
                  <span data-key="t-logout">Logout</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="sidebar-background"></div>
      </div>

      {/* Left Sidebar End */}
      <div className="vertical-overlay" onClick={toggleSidebar}></div>

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
                <div className="text-sm-start d-none d-sm-block">
                  {new Date().getFullYear()} © YBB Platform.
                </div>
              </div>
              <div className="col-sm-6">
                <div className="text-sm-end d-none d-sm-block">
                  Design & Develop by Velzon
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