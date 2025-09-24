"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getPublicMenuItems, MenuItem } from "@/layouts/MenuData";
import { YBB_ROUTES } from "@/constants/ybb";

interface PublicLayoutProps {
  children: React.ReactNode;
}

const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const menuItems = getPublicMenuItems();

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  // Check if a dropdown should be expanded (only for mobile when manually controlling)
  const shouldExpandDropdown = (item: MenuItem) => {
    if (!item.subItems) return false;
    // Only show dropdown as expanded on mobile when actively opened
    return window.innerWidth <= 992 && activeDropdown === item.id;
  };

  // Check if current route matches any submenu item or is under the parent path
  const isParentActive = (item: MenuItem) => {
    // Direct match with item link
    if (pathname === item.link) return true;
    
    if (!item.subItems) return false;
    
    // Check if any submenu item matches exactly
    const exactMatch = item.subItems.some(subItem => pathname === subItem.link);
    if (exactMatch) return true;
    
    // For Programs menu, also check if current path starts with /programs
    if (item.label === 'Programs' && pathname.startsWith('/programs')) {
      return true;
    }
    
    return false;
  };

  // Check if a specific submenu item is active
  const isSubmenuActive = (submenuItem: MenuItem) => {
    return pathname === submenuItem.link;
  };

  // Handle dropdown toggle for mobile
  const handleDropdownToggle = (itemId: number, event?: React.MouseEvent) => {
    // Only handle manually for mobile or when Bootstrap isn't working
    if (window.innerWidth <= 992) {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      setActiveDropdown(prevActive => prevActive === itemId ? null : itemId);
    }
  };

  // Close mobile nav and dropdown when navigating
  const handleNavigation = () => {
    setIsNavOpen(false);
    setActiveDropdown(null);
  };

  // Close dropdown when pathname changes (navigation occurs)
  useEffect(() => {
    setActiveDropdown(null);
    setIsNavOpen(false);
  }, [pathname]);

  // Bootstrap dropdown integration and cleanup
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Close all Bootstrap dropdowns when component mounts or path changes
      const dropdowns = document.querySelectorAll('.dropdown-menu.show');
      dropdowns.forEach(dropdown => {
        dropdown.classList.remove('show');
      });
      
      // Reset dropdown toggle aria-expanded states
      const toggles = document.querySelectorAll('.dropdown-toggle[aria-expanded="true"]');
      toggles.forEach(toggle => {
        toggle.setAttribute('aria-expanded', 'false');
      });
      
      // Let Bootstrap handle dropdowns on desktop
      if (window.innerWidth > 992) {
        setActiveDropdown(null);
      }
    }
  }, [pathname]);

  // Force cleanup on component mount
  useEffect(() => {
    const cleanup = () => {
      if (typeof window !== 'undefined') {
        setActiveDropdown(null);
        setIsNavOpen(false);
        
        // Force close any Bootstrap dropdowns
        const openDropdowns = document.querySelectorAll('.dropdown-menu.show');
        openDropdowns.forEach(dropdown => {
          dropdown.classList.remove('show');
        });
        
        const openToggles = document.querySelectorAll('.dropdown-toggle[aria-expanded="true"]');
        openToggles.forEach(toggle => {
          toggle.setAttribute('aria-expanded', 'false');
        });
      }
    };

    cleanup();
    
    // Also cleanup on window focus (in case of browser back/forward)
    window.addEventListener('focus', cleanup);
    return () => window.removeEventListener('focus', cleanup);
  }, []);

  // Check if current page should show hero section
  const isMainPage = () => {
    const mainPages = [YBB_ROUTES.PROGRAMS, YBB_ROUTES.INSIGHTS, YBB_ROUTES.ANNOUNCEMENTS, YBB_ROUTES.PARTNERS, YBB_ROUTES.ABOUT];
    return mainPages.includes(pathname as any);
  };

  // Check if it's a detail page (has additional path segments)
  const isDetailPage = () => {
    const pathSegments = pathname.split('/').filter(segment => segment !== '');
    return pathSegments.length > 1;
  };

  const getPageInfo = () => {
    // First, try to find the current item in main menu items
    let currentItem = menuItems.find(item => item.link === pathname);
    
    // If not found, search in sub-items
    if (!currentItem) {
      for (const item of menuItems) {
        if (item.subItems) {
          const subItem = item.subItems.find(subItem => subItem.link === pathname);
          if (subItem) {
            currentItem = subItem;
            break;
          }
        }
      }
    }
    
    if (currentItem) {
      return {
        title: currentItem.label,
        description: getPageDescription(currentItem.label),
        icon: getPageIcon(currentItem.label)
      };
    }
    return { title: 'YBB Platform', description: 'Young Business Builder Program', icon: '🚀' };
  };

  const getPageDescription = (pageTitle: string) => {
    const descriptions: Record<string, string> = {
      'Programs': 'Discover comprehensive business training programs designed to empower young entrepreneurs with essential skills and knowledge.',
      'Program Overview': 'Discover comprehensive business training programs designed to empower young entrepreneurs with essential skills and knowledge.',
      'Insights & Analytics': 'Explore program analytics, participant statistics, and impact data from our global youth leadership initiatives.',
      'Photo Gallery': 'Browse visual highlights and memorable moments from our international youth programs and summits.',
      'Testimonials': 'Read inspiring stories and experiences from young leaders who participated in our transformative programs.',
      'Announcements': 'Stay updated with the latest news, program updates, and important information from YBB Platform.',
      'Partners & Sponsors': 'Meet our valued sponsors, strategic partners, and collaborators who make our programs possible.',
      'About': 'Learn about our mission to empower young entrepreneurs and our impact on the global business community.'
    };
    return descriptions[pageTitle] || 'Young Business Builder Program';
  };

  const getPageIcon = (pageTitle: string) => {
    const icons: Record<string, string> = {
      'Programs': '🎓',
      'Program Overview': '🎓',
      'Insights & Analytics': '📊',
      'Photo Gallery': '📸',
      'Testimonials': '�',
      'Announcements': '📢',
      'Partners & Sponsors': '🤝',
      'About': 'ℹ️'
    };
    return icons[pageTitle] || '🚀';
  };

  const currentPage = getPageInfo();

  return (
    <>
      {/* Navigation Header */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm fixed-top" style={{ zIndex: 1050 }}>
        <div className="container">
          <Link href={YBB_ROUTES.HOME} className="navbar-brand">
            <span className="fw-bold text-primary">YBB Platform</span>
          </Link>

          <button 
            className="navbar-toggler" 
            type="button" 
            onClick={toggleNav}
            aria-controls="navbarSupportedContent" 
            aria-expanded={isNavOpen} 
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className={`collapse navbar-collapse ${isNavOpen ? 'show' : ''}`} id="navbarSupportedContent">
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
              {menuItems.map((item) => (
                <li key={item.id} className={`nav-item ${item.subItems ? 'dropdown' : ''}`}>
                  {item.subItems ? (
                    <>
                      <a
                        href="#"
                        className={`nav-link dropdown-toggle ${
                          isParentActive(item) ? 'active' : ''
                        }`}
                        role="button"
                        data-bs-toggle={typeof window !== 'undefined' && window.innerWidth > 992 ? "dropdown" : undefined}
                        aria-expanded={activeDropdown === item.id}
                        onClick={(e) => handleDropdownToggle(item.id, e)}
                      >
                        {item.label}
                      </a>
                      <ul 
                        className={`dropdown-menu ${
                          activeDropdown === item.id ? 'show' : ''
                        }`}
                      >
                        {item.subItems.map((subItem) => (
                          <li key={subItem.id}>
                            <Link
                              href={subItem.link || "#"}
                              className={`dropdown-item ${isSubmenuActive(subItem) ? 'active' : ''}`}
                              onClick={handleNavigation}
                            >
                              {subItem.icon && <i className={`${subItem.icon} me-2`}></i>}
                              {subItem.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <Link
                      href={item.link || "#"}
                      className={`nav-link ${pathname === item.link ? 'active' : ''}`}
                      onClick={handleNavigation}
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>

            <div className="d-flex gap-2">
              <Link href={YBB_ROUTES.AUTH.REGISTER} className="btn btn-primary">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section for main pages */}
      {isMainPage() && !isDetailPage() && (
        <section className="hero-section" style={{ paddingTop: '100px' }}>
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-8">
                <div className="hero-content">
                  <div className="d-flex align-items-center mb-3">
                    <span className="fs-1 me-3">{currentPage.icon}</span>
                    <h1 className="hero-title mb-0">{currentPage.title}</h1>
                  </div>
                  <p className="hero-subtitle">{currentPage.description}</p>
                </div>
              </div>
              <div className="col-lg-4 text-center">
                <div className="hero-visual d-none d-lg-block">
                  <div className="position-relative">
                    <div 
                      className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center mx-auto"
                      style={{ width: '200px', height: '200px' }}
                    >
                      <span style={{ fontSize: '4rem' }}>{currentPage.icon}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <main style={{ paddingTop: pathname === YBB_ROUTES.HOME || isMainPage() ? '0' : '100px' }}>
        {children}
      </main>

      {/* Footer */}
      <footer className="custom-footer bg-dark py-5 position-relative">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 mt-4">
              <div>
                <div>
                  <span className="fw-bold text-white">YBB Platform</span>
                </div>
                <div className="mt-4 fs-13">
                  <p className="text-white-75">
                    Young Business Builder Program - Empowering the next generation 
                    of entrepreneurs and business leaders through comprehensive training 
                    and mentorship opportunities.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-lg-7 ms-lg-auto">
              <div className="row">
                <div className="col-sm-4 mt-4">
                  <h5 className="text-white mb-0">Platform</h5>
                  <div className="text-white-75 mt-3">
                    <ul className="list-unstyled ff-secondary footer-list">
                      <li><Link href={YBB_ROUTES.PROGRAMS}>Programs</Link></li>
                      <li><Link href={YBB_ROUTES.INSIGHTS}>Insights</Link></li>
                      <li><Link href={YBB_ROUTES.ANNOUNCEMENTS}>Announcements</Link></li>
                      <li><Link href={YBB_ROUTES.PARTNERS}>Partners</Link></li>
                    </ul>
                  </div>
                </div>
                <div className="col-sm-4 mt-4">
                  <h5 className="text-white mb-0">Support</h5>
                  <div className="text-white-75 mt-3">
                    <ul className="list-unstyled ff-secondary footer-list">
                      <li><Link href="/help">Help Center</Link></li>
                      <li><Link href="/contact">Contact Us</Link></li>
                      <li><Link href="/faq">FAQ</Link></li>
                      <li><Link href="/privacy">Privacy Policy</Link></li>
                    </ul>
                  </div>
                </div>
                <div className="col-sm-4 mt-4">
                  <h5 className="text-white mb-0">Connect</h5>
                  <div className="text-white-75 mt-3">
                    <ul className="list-unstyled ff-secondary footer-list">
                      <li><a href="#">Facebook</a></li>
                      <li><a href="#">Twitter</a></li>
                      <li><a href="#">LinkedIn</a></li>
                      <li><a href="#">Instagram</a></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row text-center text-sm-start align-items-center mt-5">
            <div className="col-sm-6">
              <div>
                <p className="copy-rights mb-0 text-white-75">
                  © {new Date().getFullYear()} YBB Platform. All rights reserved.
                </p>
              </div>
            </div>
            <div className="col-sm-6">
              <div className="text-sm-end mt-3 mt-sm-0">
                <ul className="list-inline mb-0 footer-social-link">
                  <li className="list-inline-item">
                    <a href="#" className="avatar-xs d-block">
                      <div className="avatar-title rounded-circle">
                        <i className="ri-facebook-fill"></i>
                      </div>
                    </a>
                  </li>
                  <li className="list-inline-item">
                    <a href="#" className="avatar-xs d-block">
                      <div className="avatar-title rounded-circle">
                        <i className="ri-github-fill"></i>
                      </div>
                    </a>
                  </li>
                  <li className="list-inline-item">
                    <a href="#" className="avatar-xs d-block">
                      <div className="avatar-title rounded-circle">
                        <i className="ri-linkedin-fill"></i>
                      </div>
                    </a>
                  </li>
                  <li className="list-inline-item">
                    <a href="#" className="avatar-xs d-block">
                      <div className="avatar-title rounded-circle">
                        <i className="ri-twitter-fill"></i>
                      </div>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default PublicLayout;