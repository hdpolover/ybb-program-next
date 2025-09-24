"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getPublicMenuItems } from "@/layouts/MenuData";
import { YBB_ROUTES } from "@/constants/ybb";

interface PublicLayoutProps {
  children: React.ReactNode;
}

const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const menuItems = getPublicMenuItems();

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

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
    const currentItem = menuItems.find(item => item.link === pathname);
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
      'Insights': 'Explore valuable business tips, industry trends, and entrepreneurial wisdom from successful business leaders.',
      'Announcements': 'Stay updated with the latest news, program updates, and important information from YBB Platform.',
      'Partners': 'Meet our valued sponsors, strategic partners, and collaborators who make our programs possible.',
      'About': 'Learn about our mission to empower young entrepreneurs and our impact on the global business community.'
    };
    return descriptions[pageTitle] || 'Young Business Builder Program';
  };

  const getPageIcon = (pageTitle: string) => {
    const icons: Record<string, string> = {
      'Programs': '🎓',
      'Insights': '💡',
      'Announcements': '📢',
      'Partners': '🤝',
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
                <li key={item.id} className="nav-item">
                  <Link
                    href={item.link || "#"}
                    className={`nav-link ${pathname === item.link ? 'active' : ''}`}
                    onClick={() => setIsNavOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="d-flex gap-2">
              <Link href={YBB_ROUTES.AUTH.LOGIN} className="btn btn-outline-primary">
                Sign In
              </Link>
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