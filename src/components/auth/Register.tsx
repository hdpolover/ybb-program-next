"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Card, CardBody, Col, Container, Row, Alert, Spinner, Form, FormFeedback, Input, Label, Button } from "reactstrap";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { RegisterForm } from "@/types/ybb";
import { YBB_ROUTES } from "@/constants/ybb";

interface RegisterProps {
  onSubmit?: (data: RegisterForm) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
}

const Register: React.FC<RegisterProps> = ({ onSubmit, isLoading, error }) => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    watch
  } = useForm<RegisterForm>({
    defaultValues: {
      firstName: "",
      lastName: "",
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
      if (onSubmit) {
        await onSubmit(data);
      } else {
        // Default behavior - mock registration for development
        console.log("Registration attempt:", { 
          firstName: data.firstName,
          lastName: data.lastName,
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
    }
  };

  return (
    <div className="auth-page-wrapper pt-5">
      <div className="auth-one-bg-position auth-one-bg" id="auth-particles">
        <div className="bg-overlay"></div>
        <div className="shape">
          <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1440 120">
            <path d="M 0,36 C 144,53.6 432,123.2 720,124 C 1008,124.8 1296,56.8 1440,40L1440 140L0 140z"></path>
          </svg>
        </div>
      </div>
      
      <div className="auth-page-content">
        <Container>
          <Row>
            <Col lg={12}>
              <div className="text-center mt-sm-5 mb-4 text-white-50">
                <div>
                  <Link href="/" className="d-inline-block auth-logo">
                    <img src="/images/ybb-logo-light.png" alt="YBB" height="20" />
                  </Link>
                </div>
                <p className="mt-3 fs-15 fw-medium">
                  Young Business Builder Program
                </p>
              </div>
            </Col>
          </Row>

          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Card className="mt-4">
                <CardBody className="p-4">
                  <div className="text-center mt-2">
                    <h5 className="text-primary">Create New Account</h5>
                    <p className="text-muted">Get your free YBB account now</p>
                  </div>
                  
                  <div className="p-2 mt-4">
                    {error && (
                      <Alert color="danger" className="mb-3">
                        <div className="alert-body">
                          {error}
                        </div>
                      </Alert>
                    )}
                    
                    {errors.root && (
                      <Alert color="danger" className="mb-3">
                        <div className="alert-body">
                          {errors.root.message}
                        </div>
                      </Alert>
                    )}

                    <Form 
                      onSubmit={handleSubmit(handleFormSubmit)}
                      className="needs-validation"
                      noValidate
                    >
                      <Row>
                        <Col md={6}>
                          <div className="mb-3">
                            <Label htmlFor="firstName" className="form-label">
                              First Name <span className="text-danger">*</span>
                            </Label>
                            <Input
                              type="text"
                              className="form-control"
                              id="firstName"
                              placeholder="Enter first name"
                              {...register("firstName", {
                                required: "First name is required",
                                minLength: {
                                  value: 2,
                                  message: "First name must be at least 2 characters"
                                }
                              })}
                              invalid={!!errors.firstName}
                            />
                            {errors.firstName && (
                              <FormFeedback>{errors.firstName.message}</FormFeedback>
                            )}
                          </div>
                        </Col>
                        <Col md={6}>
                          <div className="mb-3">
                            <Label htmlFor="lastName" className="form-label">
                              Last Name <span className="text-danger">*</span>
                            </Label>
                            <Input
                              type="text"
                              className="form-control"
                              id="lastName"
                              placeholder="Enter last name"
                              {...register("lastName", {
                                required: "Last name is required",
                                minLength: {
                                  value: 2,
                                  message: "Last name must be at least 2 characters"
                                }
                              })}
                              invalid={!!errors.lastName}
                            />
                            {errors.lastName && (
                              <FormFeedback>{errors.lastName.message}</FormFeedback>
                            )}
                          </div>
                        </Col>
                      </Row>

                      <div className="mb-3">
                        <Label htmlFor="email" className="form-label">
                          Email <span className="text-danger">*</span>
                        </Label>
                        <Input
                          type="email"
                          className="form-control"
                          id="email"
                          placeholder="Enter email address"
                          {...register("email", {
                            required: "Email is required",
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: "Please enter a valid email address"
                            }
                          })}
                          invalid={!!errors.email}
                        />
                        {errors.email && (
                          <FormFeedback>{errors.email.message}</FormFeedback>
                        )}
                      </div>

                      <div className="mb-3">
                        <Label className="form-label" htmlFor="password-input">
                          Password <span className="text-danger">*</span>
                        </Label>
                        <div className="position-relative auth-pass-inputgroup">
                          <Input
                            type={showPassword ? "text" : "password"}
                            className="form-control pe-5 password-input"
                            placeholder="Enter password"
                            id="password-input"
                            {...register("password", {
                              required: "Password is required",
                              minLength: {
                                value: 8,
                                message: "Password must be at least 8 characters long"
                              },
                              pattern: {
                                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                                message: "Password must contain at least one uppercase letter, one lowercase letter, and one number"
                              }
                            })}
                            invalid={!!errors.password}
                          />
                          <button
                            className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted password-addon"
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            <i className={`ri-eye${showPassword ? "-off" : ""}-fill align-middle`}></i>
                          </button>
                          {errors.password && (
                            <FormFeedback>{errors.password.message}</FormFeedback>
                          )}
                        </div>
                      </div>

                      <div className="mb-3">
                        <Label className="form-label" htmlFor="confirmPassword-input">
                          Confirm Password <span className="text-danger">*</span>
                        </Label>
                        <div className="position-relative auth-pass-inputgroup">
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            className="form-control pe-5 password-input"
                            placeholder="Confirm password"
                            id="confirmPassword-input"
                            {...register("confirmPassword", {
                              required: "Please confirm your password",
                              validate: (value) => value === password || "Passwords do not match"
                            })}
                            invalid={!!errors.confirmPassword}
                          />
                          <button
                            className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted password-addon"
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            <i className={`ri-eye${showConfirmPassword ? "-off" : ""}-fill align-middle`}></i>
                          </button>
                          {errors.confirmPassword && (
                            <FormFeedback>{errors.confirmPassword.message}</FormFeedback>
                          )}
                        </div>
                      </div>

                      <div className="mb-3">
                        <Label htmlFor="referralCode" className="form-label">
                          Referral Code <span className="text-muted">(Optional)</span>
                        </Label>
                        <Input
                          type="text"
                          className="form-control"
                          id="referralCode"
                          placeholder="Enter referral code if you have one"
                          {...register("referralCode")}
                        />
                      </div>

                      <div className="mb-4">
                        <p className="mb-0 fs-12 text-muted fst-italic">
                          By registering you agree to the YBB{" "}
                          <Link href="/terms" className="text-primary text-decoration-underline fst-normal fw-medium">
                            Terms of Use
                          </Link>{" "}
                          and{" "}
                          <Link href="/privacy" className="text-primary text-decoration-underline fst-normal fw-medium">
                            Privacy Policy
                          </Link>
                        </p>
                      </div>

                      <div className="form-check mb-3">
                        <Input
                          className="form-check-input"
                          type="checkbox"
                          id="auth-remember-check"
                          {...register("acceptTerms", {
                            required: "You must accept the terms and conditions"
                          })}
                        />
                        <Label className="form-check-label" htmlFor="auth-remember-check">
                          I accept the Terms and Conditions <span className="text-danger">*</span>
                        </Label>
                        {errors.acceptTerms && (
                          <div className="invalid-feedback d-block">
                            {errors.acceptTerms.message}
                          </div>
                        )}
                      </div>

                      <div className="mt-4">
                        <Button
                          color="success"
                          disabled={isSubmitting || isLoading}
                          className="btn btn-success w-100"
                          type="submit"
                        >
                          {(isSubmitting || isLoading) && (
                            <Spinner size="sm" className="me-2">
                              Loading...
                            </Spinner>
                          )}
                          Sign Up
                        </Button>
                      </div>

                      <div className="mt-4 text-center">
                        <div className="signin-other-title">
                          <h5 className="fs-13 mb-4 title">Create account with</h5>
                        </div>
                        <div>
                          <Button
                            color=""
                            className="btn btn-primary btn-icon me-1"
                            type="button"
                          >
                            <i className="ri-facebook-fill fs-16"></i>
                          </Button>
                          <Button
                            color=""
                            className="btn btn-danger btn-icon me-1"
                            type="button"
                          >
                            <i className="ri-google-fill fs-16"></i>
                          </Button>
                          <Button
                            color=""
                            className="btn btn-dark btn-icon me-1"
                            type="button"
                          >
                            <i className="ri-github-fill fs-16"></i>
                          </Button>
                          <Button
                            color=""
                            className="btn btn-info btn-icon"
                            type="button"
                          >
                            <i className="ri-twitter-fill fs-16"></i>
                          </Button>
                        </div>
                      </div>
                    </Form>
                  </div>
                </CardBody>
              </Card>

              <div className="mt-4 text-center">
                <p className="mb-0">
                  Already have an account?{" "}
                  <Link
                    href={YBB_ROUTES.AUTH.LOGIN}
                    className="fw-semibold text-primary text-decoration-underline"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default Register;