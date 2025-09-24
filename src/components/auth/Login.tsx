"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Card, CardBody, Col, Container, Row, Alert, Spinner, Form, FormFeedback, Input, Label, Button } from "reactstrap";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { LoginForm } from "@/types/ybb";
import { YBB_ROUTES } from "@/constants/ybb";

interface LoginProps {
  onSubmit?: (data: LoginForm) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
}

const Login: React.FC<LoginProps> = ({ onSubmit, isLoading, error }) => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError
  } = useForm<LoginForm>({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false
    }
  });

  const handleFormSubmit = async (data: LoginForm) => {
    try {
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
                    <h5 className="text-primary">Welcome Back!</h5>
                    <p className="text-muted">Sign in to continue to YBB Platform.</p>
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
                        <div className="float-end">
                          <Link href={YBB_ROUTES.AUTH.FORGOT_PASSWORD} className="text-muted">
                            Forgot password?
                          </Link>
                        </div>
                        <Label className="form-label" htmlFor="password-input">
                          Password <span className="text-danger">*</span>
                        </Label>
                        <div className="position-relative auth-pass-inputgroup mb-3">
                          <Input
                            type={showPassword ? "text" : "password"}
                            className="form-control pe-5 password-input"
                            placeholder="Enter password"
                            id="password-input"
                            {...register("password", {
                              required: "Password is required",
                              minLength: {
                                value: 6,
                                message: "Password must be at least 6 characters long"
                              }
                            })}
                            invalid={!!errors.password}
                          />
                          <button
                            className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted password-addon"
                            type="button"
                            id="password-addon"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            <i className={`ri-eye${showPassword ? "-off" : ""}-fill align-middle`}></i>
                          </button>
                          {errors.password && (
                            <FormFeedback>{errors.password.message}</FormFeedback>
                          )}
                        </div>
                      </div>

                      <div className="form-check">
                        <Input
                          className="form-check-input"
                          type="checkbox"
                          id="auth-remember-check"
                          {...register("rememberMe")}
                        />
                        <Label className="form-check-label" htmlFor="auth-remember-check">
                          Remember me
                        </Label>
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
                          Sign In
                        </Button>
                      </div>

                      <div className="mt-4 text-center">
                        <div className="signin-other-title">
                          <h5 className="fs-13 mb-4 title">Sign In with</h5>
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
                  Don&apos;t have an account?{" "}
                  <Link
                    href={YBB_ROUTES.AUTH.REGISTER}
                    className="fw-semibold text-primary text-decoration-underline"
                  >
                    Sign up
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

export default Login;