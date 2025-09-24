"use client";
import React from "react";
import Link from "next/link";
import { YBB_ROUTES } from "@/constants/ybb";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-light d-flex">
      {/* Left side - Branding */}
      <div className="d-none d-lg-flex flex-column justify-content-center align-items-center bg-primary text-white" style={{ width: "40%" }}>
        <div className="text-center px-4">
          <h1 className="display-4 fw-bold mb-4">YBB Platform</h1>
          <h2 className="h3 mb-4">Young Business Builder</h2>
          <p className="lead mb-4">
            Empowering young leaders to create lasting global impact through innovation and collaboration.
          </p>
          <div className="d-flex justify-content-center gap-4 mt-5">
            <div className="text-center">
              <h4 className="h2 fw-bold">4000+</h4>
              <small>Participants</small>
            </div>
            <div className="text-center">
              <h4 className="h2 fw-bold">120+</h4>
              <small>Countries</small>
            </div>
            <div className="text-center">
              <h4 className="h2 fw-bold">10+</h4>
              <small>Programs</small>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Auth Form */}
      <div className="d-flex flex-column justify-content-center align-items-center flex-grow-1 px-4">
        <div className="w-100" style={{ maxWidth: "400px" }}>
          {/* Logo for mobile */}
          <div className="text-center mb-4 d-lg-none">
            <Link href={YBB_ROUTES.HOME} className="text-decoration-none">
              <h3 className="text-primary fw-bold">YBB Platform</h3>
            </Link>
          </div>

          {/* Auth Form Content */}
          {children}

          {/* Back to home link */}
          <div className="text-center mt-4">
            <Link href={YBB_ROUTES.HOME} className="text-muted text-decoration-none">
              <i className="ri-arrow-left-line me-1"></i>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
