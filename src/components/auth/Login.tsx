"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Card, CardBody, Col, Container, Row, Alert, Spinner, Form, FormFeedback, Input, Label, Button } from "reactstrap";
import Link from "next/link";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { LoginForm } from "@/types/ybb";
import { YBB_ROUTES } from "@/constants/ybb";
import ParticlesAuth from "./ParticlesAuth";

const logoLight = "/images/logo-light.png";

interface LoginProps {
  onSubmit?: (data: LoginForm) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
}

const Login: React.FC<LoginProps> = ({ onSubmit, isLoading, error }) => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loader, setLoader] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError
  } = useForm<LoginForm>({
    defaultValues: {
      email: "demo@ybb.com",
      password: "123456",
      rememberMe: false
    }
  });

  const handleFormSubmit = async (data: LoginForm) => {
    try {
      setLoader(true);
      if (onSubmit) {
        await onSubmit(data);
      } else {
        // Default behavior - mock login for development
        console.log("Login attempt:", { email: data.email });
        toast.success("Login successful!");
        router.push(YBB_ROUTES.PARTICIPANT.DASHBOARD);
      }
    } catch (error: unknown) {
      console.error("Login error:", error);
      const errorMessage = error instanceof Error ? error.message : "An error occurred during login";
      setError("root", { message: errorMessage });
      toast.error(errorMessage);
    } finally {
      setLoader(false);
    }
  };

  const socialLogin = (provider: string) => {
    console.log(`Social login with ${provider}`);
    toast(`${provider} login coming soon!`);
  };

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setLoader(false);
      }, 3000);
    }
  }, [error]);

  return (
    <div className="min-h-screen d-flex">
      {/* Left Column - Branding */}
      <div className="d-none d-lg-flex flex-column justify-content-center align-items-center position-relative overflow-hidden" style={{ 
        width: "50%", 
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      }}>
        {/* Background Image */}
        <div 
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.3
          }}
        ></div>
        
        {/* Dark Overlay for Text Readability */}
        <div className="position-absolute top-0 start-0 w-100 h-100" style={{
          background: "rgba(0, 0, 0, 0.5)"
        }}></div>
        
        <div className="position-relative text-center px-5 text-white" style={{ zIndex: 2 }}>
          <div className="mb-4">
            <div className="mb-3">
              <div className="bg-white bg-opacity-20 rounded-circle d-inline-flex p-2 mb-3">
                <i className="ri-graduation-cap-line fs-1 text-white"></i>
              </div>
            </div>
            <h2 className="fw-bold mb-3 text-shadow">Young Business Builder</h2>
            <p className="mb-4 text-white-75 lh-base" style={{ fontSize: "0.95rem" }}>
              Join thousands of young leaders creating lasting global impact through innovation and collaboration.
            </p>
          </div>
          
          <div className="row g-3 text-center mb-4">
            <div className="col-4">
              <div className="bg-white bg-opacity-10 rounded-3 p-3">
                <div className="text-primary-emphasis mb-1">
                  <i className="ri-group-line fs-2"></i>
                </div>
                <h5 className="fw-bold mb-0 text-white">4000+</h5>
                <p className="mb-0 text-white-75" style={{ fontSize: "0.75rem" }}>Leaders</p>
              </div>
            </div>
            <div className="col-4">
              <div className="bg-white bg-opacity-10 rounded-3 p-3">
                <div className="text-primary-emphasis mb-1">
                  <i className="ri-earth-line fs-2"></i>
                </div>
                <h5 className="fw-bold mb-0 text-white">120+</h5>
                <p className="mb-0 text-white-75" style={{ fontSize: "0.75rem" }}>Countries</p>
              </div>
            </div>
            <div className="col-4">
              <div className="bg-white bg-opacity-10 rounded-3 p-3">
                <div className="text-primary-emphasis mb-1">
                  <i className="ri-trophy-line fs-2"></i>
                </div>
                <h5 className="fw-bold mb-0 text-white">15+</h5>
                <p className="mb-0 text-white-75" style={{ fontSize: "0.75rem" }}>Programs</p>
              </div>
            </div>
          </div>
          
          <div className="mt-3">
            <p className="text-white-75 mb-0" style={{ fontSize: "0.8rem" }}>
              <i className="ri-shield-check-line me-1"></i>
              Trusted by universities and organizations worldwide
            </p>
          </div>
        </div>
      </div>

      {/* Right Column - Login Form */}
      <div className="d-flex flex-column justify-content-center align-items-center flex-grow-1 px-4 py-5" style={{
        background: "linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)"
      }}>
        <div className="w-100" style={{ maxWidth: "380px" }}>
          {/* Mobile Logo */}
          <div className="text-center mb-5 d-lg-none">
            <Link href={YBB_ROUTES.HOME} className="d-inline-block">
              <Image src={logoLight} alt="YBB Platform" height={30} width={150} className="img-fluid" />
            </Link>
          </div>

          <div className="text-center mb-4">
            <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex p-3 mb-3">
              <i className="ri-user-line fs-2 text-primary"></i>
            </div>
            <h3 className="fw-bold mb-2">Welcome Back!</h3>
            <p className="text-muted mb-0">Please sign in to your account to continue</p>
          </div>
          
          {error && <Alert color="danger" className="mb-4 d-flex align-items-center border-0">
            <i className="ri-error-warning-line me-2"></i>
            {error}
          </Alert>}
          {errors.root && <Alert color="danger" className="mb-4 d-flex align-items-center border-0">
            <i className="ri-error-warning-line me-2"></i>
            {errors.root.message}
          </Alert>}

          <Form
            onSubmit={e => {
              e.preventDefault();
              handleSubmit(handleFormSubmit)();
              return false;
            }}
          >
            <div className="mb-3">
              <Label htmlFor="email" className="form-label fw-medium text-dark mb-2">
                <i className="ri-mail-line me-2 text-primary"></i>
                Email Address
              </Label>
              <div className="position-relative">
                <Input
                  type="email"
                  className="form-control ps-5"
                  placeholder="Enter your email address"
                  style={{ paddingLeft: "2.5rem", height: "45px" }}
                  {...register("email", {
                    required: "Please Enter Your Email",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Please enter a valid email address"
                    }
                  })}
                  invalid={!!errors.email}
                />
                <i className="ri-mail-line position-absolute text-muted" style={{
                  left: "0.75rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: "1rem"
                }}></i>
              </div>
              {errors.email && (
                <FormFeedback type="invalid" className="d-flex align-items-center mt-2">
                  <i className="ri-error-warning-line me-1"></i>
                  {errors.email.message}
                </FormFeedback>
              )}
            </div>

            <div className="mb-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <Label className="form-label fw-medium text-dark" htmlFor="password-input">
                  <i className="ri-lock-line me-2 text-primary"></i>
                  Password
                </Label>
                <Link
                  href={YBB_ROUTES.AUTH.FORGOT_PASSWORD}
                  className="text-primary text-decoration-none small fw-medium"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="position-relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  className="form-control ps-5 pe-5"
                  placeholder="Enter your password"
                  style={{ paddingLeft: "2.5rem", paddingRight: "2.5rem", height: "45px" }}
                  {...register("password", {
                    required: "Please Enter Your Password"
                  })}
                  invalid={!!errors.password}
                />
                <i className="ri-lock-line position-absolute text-muted" style={{
                  left: "0.75rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: "1rem"
                }}></i>
                <button
                  className="btn btn-link position-absolute text-muted" 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ 
                    right: "0.25rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    border: "none", 
                    background: "none",
                    padding: "0.25rem"
                  }}
                >
                  <i className={`ri-eye${showPassword ? "-off" : ""}-line`}></i>
                </button>
              </div>
              {errors.password && (
                <FormFeedback type="invalid" className="d-flex align-items-center mt-2">
                  <i className="ri-error-warning-line me-1"></i>
                  {errors.password.message}
                </FormFeedback>
              )}
            </div>

            <div className="form-check mb-3">
              <Input
                className="form-check-input"
                type="checkbox"
                id="auth-remember-check"
                {...register("rememberMe")}
              />
              <Label className="form-check-label" htmlFor="auth-remember-check">
                Keep me signed in
              </Label>
            </div>

            <div className="mb-4">
              <Button
                color="primary"
                disabled={loader || isLoading}
                className="w-100 fw-semibold"
                type="submit"
                style={{ height: "45px" }}
              >
                {(loader || isLoading) && (
                  <Spinner size="sm" className="me-2">
                    Loading...
                  </Spinner>
                )}
                Sign In
              </Button>
            </div>


          </Form>

          <div className="text-center mb-3">
            <div className="bg-light rounded-3 p-3 mb-3">
              <p className="text-primary fw-semibold mb-1" style={{ fontSize: "0.9rem" }}>
                <i className="ri-vip-crown-line me-2"></i>
                Part of our program ambassadors?
              </p>
              <Link
                href="#"
                className="text-primary fw-semibold text-decoration-none small"
                onClick={(e) => {
                  e.preventDefault();
                  toast("Ambassador portal coming soon!");
                }}
              >
                Sign in here →
              </Link>
            </div>
            
            <p className="text-muted mb-0 small">
              Don't have an account?{" "}
              <Link
                href={YBB_ROUTES.AUTH.REGISTER}
                className="text-primary fw-semibold text-decoration-none"
              >
                Sign up for free
              </Link>
            </p>
          </div>

          {/* Back to home link */}
          <div className="text-center">
            <Link href={YBB_ROUTES.HOME} className="text-muted text-decoration-none small">
              <i className="ri-arrow-left-line me-1"></i>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;