"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Form,
  Input,
  Button,
} from "reactstrap";
import { User } from "@/types/ybb";
import { YBB_ROUTES } from "@/constants/ybb";

interface HeaderProps {
  onMenuClick?: () => void;
  user?: User | null;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, user, onLogout }) => {
  const router = useRouter();
  const [isProfileDropOpen, setIsProfileDropOpen] = useState(false);
  const [isNotificationDropOpen, setIsNotificationDropOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleProfileDropdown = () => {
    setIsProfileDropOpen(!isProfileDropOpen);
  };

  const toggleNotificationDropdown = () => {
    setIsNotificationDropOpen(!isNotificationDropOpen);
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      // Default logout behavior
      router.push(YBB_ROUTES.AUTH.LOGIN);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Implement search functionality
      console.log("Search query:", searchQuery);
    }
  };

  const getProfileRoute = () => {
    if (user?.role === 'participant') {
      return YBB_ROUTES.PARTICIPANT.PROFILE;
    } else if (user?.role === 'ambassador') {
      return YBB_ROUTES.AMBASSADOR.PROFILE;
    }
    return '#';
  };

  return (
    <header id="page-topbar">
      <div className="layout-width">
        <div className="navbar-header">
          <div className="d-flex">
            {/* Hamburger Menu */}
            <div className="navbar-brand-box horizontal-logo">
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

            <Button
              type="button"
              className="btn btn-sm px-3 fs-16 header-item vertical-menu-btn topnav-hamburger material-shadow-none"
              id="topnav-hamburger-icon"
              onClick={onMenuClick}
            >
              <span className="hamburger-icon">
                <span></span>
                <span></span>
                <span></span>
              </span>
            </Button>

            {/* Search Form */}
            <Form className="app-search d-none d-md-block" onSubmit={handleSearch}>
              <div className="position-relative">
                <Input
                  type="text"
                  className="form-control search-widget"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <span className="mdi mdi-magnify search-widget-icon"></span>
              </div>
            </Form>
          </div>

          <div className="d-flex align-items-center">
            {/* Search Icon for Mobile */}
            <div className="dropdown d-md-none topbar-head-dropdown header-item">
              <Button
                type="button"
                className="btn btn-icon btn-topbar material-shadow-none btn-ghost-secondary rounded-circle"
                id="page-header-search-dropdown"
              >
                <i className="bx bx-search fs-22"></i>
              </Button>
            </div>

            {/* Notifications */}
            <Dropdown
              isOpen={isNotificationDropOpen}
              toggle={toggleNotificationDropdown}
              className="ms-1 topbar-head-dropdown header-item"
            >
              <DropdownToggle
                type="button"
                tag="button"
                className="btn btn-icon btn-topbar material-shadow-none btn-ghost-secondary rounded-circle"
              >
                <i className="bx bx-bell fs-22"></i>
                <span className="position-absolute topbar-badge fs-10 translate-middle badge rounded-pill bg-danger">
                  3<span className="visually-hidden">unread messages</span>
                </span>
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-lg p-0" end>
                <div className="dropdown-head bg-primary bg-pattern rounded-top">
                  <div className="p-3">
                    <div className="row align-items-center">
                      <div className="col">
                        <h6 className="m-0 fs-16 fw-semibold text-white">
                          Notifications
                        </h6>
                      </div>
                      <div className="col-auto dropdown-tabs">
                        <span className="badge bg-light-subtle text-body fs-13">
                          4 New
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="tab-content position-relative" id="notificationItemsTabContent">
                  <div className="tab-pane fade show active py-2 ps-2" id="all-noti-tab">
                    <div data-simplebar style={{ maxHeight: "300px" }} className="pe-2">
                      <div className="text-reset notification-item d-block dropdown-item position-relative">
                        <div className="d-flex">
                          <div className="avatar-xs me-3 flex-shrink-0">
                            <span className="avatar-title bg-info-subtle text-info rounded-circle fs-16">
                              <i className="bx bx-badge-check"></i>
                            </span>
                          </div>
                          <div className="flex-grow-1">
                            <Link href="#!" className="stretched-link">
                              <h6 className="mt-0 mb-2 lh-base">
                                Application Status Update
                              </h6>
                            </Link>
                            <p className="mb-0 fs-11 fw-medium text-uppercase text-muted">
                              <span>
                                <i className="mdi mdi-clock-outline"></i> Just 30 sec ago
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </DropdownMenu>
            </Dropdown>

            {/* User Profile Dropdown */}
            <Dropdown isOpen={isProfileDropOpen} toggle={toggleProfileDropdown}>
              <DropdownToggle
                className="btn header-item"
                id="page-header-user-dropdown"
                tag="button"
              >
                <span className="d-flex align-items-center">
                  <img
                    className="rounded-circle header-profile-user"
                    src={user?.avatar || "/images/users/avatar-1.jpg"}
                    alt="Header Avatar"
                  />
                  <span className="text-start ms-xl-2">
                    <span className="d-none d-xl-inline-block ms-1 fw-semibold user-name-text">
                      {user?.name || "User"}
                    </span>
                    <span className="d-none d-xl-block ms-1 fs-12 user-name-sub-text text-muted">
                      {user?.role || "User"}
                    </span>
                  </span>
                </span>
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-end">
                <h6 className="dropdown-header">Welcome {user?.name}!</h6>
                <DropdownItem tag={Link} href={getProfileRoute()}>
                  <i className="mdi mdi-account-circle text-muted fs-16 align-middle me-1"></i>
                  <span className="align-middle">Profile</span>
                </DropdownItem>
                <DropdownItem tag={Link} href="#!">
                  <i className="mdi mdi-message-text-outline text-muted fs-16 align-middle me-1"></i>
                  <span className="align-middle">Messages</span>
                </DropdownItem>
                <DropdownItem tag={Link} href="#!">
                  <i className="mdi mdi-calendar-check-outline text-muted fs-16 align-middle me-1"></i>
                  <span className="align-middle">Taskboard</span>
                </DropdownItem>
                <DropdownItem tag={Link} href="#!">
                  <i className="mdi mdi-lifebuoy text-muted fs-16 align-middle me-1"></i>
                  <span className="align-middle">Help</span>
                </DropdownItem>
                <div className="dropdown-divider"></div>
                <DropdownItem tag={Link} href="#!">
                  <i className="mdi mdi-wallet text-muted fs-16 align-middle me-1"></i>
                  <span className="align-middle">
                    Balance : <b>$5971.67</b>
                  </span>
                </DropdownItem>
                <DropdownItem tag={Link} href="#!">
                  <span className="badge bg-success-subtle text-success mt-1 float-end">
                    New
                  </span>
                  <i className="mdi mdi-cog-outline text-muted fs-16 align-middle me-1"></i>
                  <span className="align-middle">Settings</span>
                </DropdownItem>
                <DropdownItem onClick={handleLogout}>
                  <i className="mdi mdi-logout text-muted fs-16 align-middle me-1"></i>
                  <span className="align-middle" data-key="t-logout">
                    Logout
                  </span>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;