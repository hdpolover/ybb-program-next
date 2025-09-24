"use client";
import Login from "@/components/auth/Login";
import AuthLayout from "@/layouts/AuthLayout";
import { LoginForm } from "@/types/ybb";

export default function LoginPage() {
  const handleLogin = async (credentials: LoginForm) => {
    // This will be connected to the template auth system later
    console.log("Login credentials:", credentials);
  };

  return (
    <AuthLayout>
      <Login 
        onSubmit={handleLogin}
        isLoading={false}
        error={null}
      />
    </AuthLayout>
  );
}