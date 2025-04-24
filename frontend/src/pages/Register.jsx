import { RegisterForm } from "@/components/register/register-form";
import { useAuth } from "@/contexts/Auth/useAuth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(
    () => {
      if (!isAuthenticated || user.role !== "manager") {
        navigate("/unauthorized");
      }
    },
    [isAuthenticated, user]
  );

  return (
    <div className="">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Add New User</h1>
        <p className="text-slate-500">Create a new account for staff members</p>
      </div>
      <div className="flex flex-col items-center justify-center p-0 md:p-5 rounded-lg">
        <div className="w-full max-w-sm md:max-w-3xl">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
export default RegisterPage;
