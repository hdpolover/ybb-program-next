"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Alert, Spinner, Form, FormFeedback, Input, Label, Button } from "reactstrap";
import Link from "next/link";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { RegisterForm } from "@/types/ybb";
import { YBB_ROUTES } from "@/constants/ybb";

const logoLight = "/images/logo-light.png";

interface RegisterProps {
  onSubmit?: (data: RegisterForm) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
}

const Register: React.FC<RegisterProps> = ({ onSubmit, isLoading, error }) => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loader, setLoader] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    watch
  } = useForm<RegisterForm>({
    defaultValues: {
      firstName: "",
      lastName: "", // Keep for compatibility but won't be used
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
      referralCode: ""
    }
  });

  const password = watch("password");

  const handleFormSubmit = async (data: RegisterForm) => {
    try {
      setLoader(true);
      if (onSubmit) {
        await onSubmit(data);
      } else {
        // Default behavior - mock registration for development
        console.log("Registration attempt:", { 
          fullName: data.firstName,
          email: data.email,
          referralCode: data.referralCode
        });
        toast.success("Registration successful! Please check your email for verification.");
        router.push(YBB_ROUTES.AUTH.LOGIN);
      }
    } catch (error: unknown) {
      console.error("Registration error:", error);
      const errorMessage = error instanceof Error ? error.message : "An error occurred during registration";
      setError("root", { message: errorMessage });
      toast.error(errorMessage);
    } finally {
      setLoader(false);
    }
  };

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
            backgroundImage: "url('https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80')",
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
                <i className="ri-user-add-line fs-1 text-white"></i>
              </div>
            </div>
            <h2 className="fw-bold mb-3 text-shadow">Join Our Community</h2>
            <p className="mb-4 text-white-75 lh-base" style={{ fontSize: "0.95rem" }}>
              Start your journey with thousands of young leaders creating global impact.
            </p>
          </div>
          
          <div className="row g-3 text-center mb-4">
            <div className="col-4">
              <div className="bg-white bg-opacity-10 rounded-3 p-3">
                <div className="text-primary-emphasis mb-1">
                  <i className="ri-rocket-line fs-2"></i>
                </div>
                <h5 className="fw-bold mb-0 text-white">Free</h5>
                <p className="mb-0 text-white-75" style={{ fontSize: "0.75rem" }}>Registration</p>
              </div>
            </div>
            <div className="col-4">
              <div className="bg-white bg-opacity-10 rounded-3 p-3">
                <div className="text-primary-emphasis mb-1">
                  <i className="ri-global-line fs-2"></i>
                </div>
                <h5 className="fw-bold mb-0 text-white">Global</h5>
                <p className="mb-0 text-white-75" style={{ fontSize: "0.75rem" }}>Network</p>
              </div>
            </div>
            <div className="col-4">
              <div className="bg-white bg-opacity-10 rounded-3 p-3">
                <div className="text-primary-emphasis mb-1">
                  <i className="ri-award-line fs-2"></i>
                </div>
                <h5 className="fw-bold mb-0 text-white">Elite</h5>
                <p className="mb-0 text-white-75" style={{ fontSize: "0.75rem" }}>Programs</p>
              </div>
            </div>
          </div>
          
          <div className="mt-3">
            <p className="text-white-75 mb-0" style={{ fontSize: "0.8rem" }}>
              <i className="ri-shield-check-line me-1"></i>
              Your data is secure and protected
            </p>
          </div>
        </div>
      </div>

      {/* Right Column - Registration Form */}
      <div className="d-flex flex-column justify-content-center align-items-center flex-grow-1 px-4 py-5" style={{
        background: "linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)"
      }}>
        <div className="w-100" style={{ maxWidth: "420px" }}>
          {/* Mobile Logo */}
          <div className="text-center mb-4 d-lg-none">
            <Link href={YBB_ROUTES.HOME} className="d-inline-block">
              <Image src={logoLight} alt="YBB Platform" height={30} width={150} className="img-fluid" />
            </Link>
          </div>

          <div className="text-center mb-4">
            <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex p-3 mb-3">
              <i className="ri-user-add-line fs-2 text-success"></i>
            </div>
            <h3 className="fw-bold mb-2">Create Account</h3>
            <p className="text-muted mb-0">Get your free YBB account now</p>
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
            onSubmit={handleSubmit(handleFormSubmit)}
            className="needs-validation"
            noValidate
          >
            <div className="mb-3">
              <Label htmlFor="firstName" className="form-label fw-medium text-dark mb-2">
                <i className="ri-user-line me-2 text-success"></i>
                Full Name
              </Label>
              <div className="position-relative">
                <Input
                  type="text"
                  className="form-control ps-5"
                  id="firstName"
                  placeholder="Enter your full name"
                  style={{ paddingLeft: "2.5rem", height: "45px" }}
                  {...register("firstName", {
                    required: "Full name is required",
                    minLength: {
                      value: 2,
                      message: "Name must be at least 2 characters"
                    }
                  })}
                  invalid={!!errors.firstName}
                />
                <i className="ri-user-line position-absolute text-muted" style={{
                  left: "0.75rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: "1rem"
                }}></i>
              </div>
              {errors.firstName && (
                <FormFeedback type="invalid" className="d-flex align-items-center mt-2">
                  <i className="ri-error-warning-line me-1"></i>
                  {errors.firstName.message}
                </FormFeedback>
              )}
            </div>

            <div className="mb-3">
              <Label htmlFor="email" className="form-label fw-medium text-dark mb-2">
                <i className="ri-mail-line me-2 text-success"></i>
                Email Address
              </Label>
              <div className="position-relative">
                <Input
                  type="email"
                  className="form-control ps-5"
                  id="email"
                  placeholder="Enter your email address"
                  style={{ paddingLeft: "2.5rem", height: "45px" }}
                  {...register("email", {
                    required: "Email is required",
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
              <Label className="form-label fw-medium text-dark mb-2" htmlFor="password-input">
                <i className="ri-lock-line me-2 text-success"></i>
                Password
              </Label>
              <div className="position-relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  className="form-control ps-5 pe-5"
                  placeholder="Create a strong password"
                  id="password-input"
                  style={{ paddingLeft: "2.5rem", paddingRight: "2.5rem", height: "45px" }}
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters long"
                    }
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

            <div className="mb-3">
              <Label className="form-label fw-medium text-dark mb-2" htmlFor="confirmPassword-input">
                <i className="ri-lock-line me-2 text-success"></i>
                Confirm Password
              </Label>
              <div className="position-relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  className="form-control ps-5 pe-5"
                  placeholder="Confirm your password"
                  id="confirmPassword-input"
                  style={{ paddingLeft: "2.5rem", paddingRight: "2.5rem", height: "45px" }}
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) => value === password || "Passwords do not match"
                  })}
                  invalid={!!errors.confirmPassword}
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
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{ 
                    right: "0.25rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    border: "none", 
                    background: "none",
                    padding: "0.25rem"
                  }}
                >
                  <i className={`ri-eye${showConfirmPassword ? "-off" : ""}-line`}></i>
                </button>
              </div>
              {errors.confirmPassword && (
                <FormFeedback type="invalid" className="d-flex align-items-center mt-2">
                  <i className="ri-error-warning-line me-1"></i>
                  {errors.confirmPassword.message}
                </FormFeedback>
              )}
            </div>

            <div className="mb-3">
              <Label htmlFor="referralCode" className="form-label fw-medium text-dark mb-2">
                <i className="ri-gift-line me-2 text-success"></i>
                Referral Code <span className="text-muted small">(Optional)</span>
              </Label>
              <div className="position-relative">
                <Input
                  type="text"
                  className="form-control ps-5"
                  id="referralCode"
                  placeholder="Enter referral code if you have one"
                  style={{ paddingLeft: "2.5rem", height: "45px" }}
                  {...register("referralCode")}
                />
                <i className="ri-gift-line position-absolute text-muted" style={{
                  left: "0.75rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: "1rem"
                }}></i>
              </div>
            </div>

            <div className="form-check mb-3">
              <Input
                className="form-check-input"
                type="checkbox"
                id="auth-terms-check"
                {...register("acceptTerms", {
                  required: "You must accept the terms and conditions"
                })}
              />
              <Label className="form-check-label" htmlFor="auth-terms-check">
                I agree to the{" "}
                <Link href="/terms" className="text-success text-decoration-none fw-medium">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-success text-decoration-none fw-medium">
                  Privacy Policy
                </Link>
              </Label>
              {errors.acceptTerms && (
                <div className="invalid-feedback d-block mt-1">
                  <i className="ri-error-warning-line me-1"></i>
                  {errors.acceptTerms.message}
                </div>
              )}
            </div>

            <div className="mb-4">
              <Button
                color="success"
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
                Create Account
              </Button>
            </div>
          </Form>

          <div className="text-center mb-3">
            <p className="text-muted mb-0 small">
              Already have an account?{" "}
              <Link
                href={YBB_ROUTES.AUTH.LOGIN}
                className="text-success fw-semibold text-decoration-none"
              >
                Sign in here
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

export default Register;