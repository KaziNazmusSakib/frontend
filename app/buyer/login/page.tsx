"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/lib/schemas";
import { api } from "@/lib/axios";
import { z } from "zod";
import { useRouter } from "next/navigation";

type LoginFormData = z.infer<typeof loginSchema>;

export default function BuyerLoginPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await api.post("/auth/login", {
        ...data,
        role: "buyer",
      });

      router.push("/buyer/dashboard");
    } catch (error) {
      alert("Invalid email or password");
    }
  };

  return (
    <div className="flex justify-center mt-10">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="card w-96 bg-base-100 shadow-xl p-6"
      >
        <h2 className="text-2xl font-bold text-center mb-4">
          Buyer Login
        </h2>

        <input
          {...register("email")}
          type="email"
          placeholder="Email"
          className="input input-bordered w-full mb-2"
        />
        {errors.email && (
          <p className="text-red-500 text-sm">
            {errors.email.message}
          </p>
        )}

        <input
          {...register("password")}
          type="password"
          placeholder="Password"
          className="input input-bordered w-full mb-2"
        />
        {errors.password && (
          <p className="text-red-500 text-sm">
            {errors.password.message}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary w-full mt-4"
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
