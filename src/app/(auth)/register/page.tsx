"use client";
import Register from "@/components/auth/Register";
import AuthLayout from "@/layouts/AuthLayout";
import { RegisterForm } from "@/types/ybb";

export default function RegisterPage() {
  const handleRegister = async (userData: RegisterForm) => {
    // This will be connected to the template auth system later
    console.log("Register data:", userData);
  };

  return (
    <AuthLayout>
      <Register 
        onSubmit={handleRegister}
        isLoading={false}
        error={null}
      />
    </AuthLayout>
  );
}