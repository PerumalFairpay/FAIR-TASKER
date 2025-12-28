"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Link } from "@heroui/link";
import { loginRequest } from "@/store/auth/action";
import { AppState } from "@/store/rootReducer";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loginLoading, loginError, token } = useSelector(
    (state: AppState) => state.Auth
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginRequest({ email, password }));
  };

  useEffect(() => {
    if (token) {
      // Redirect to dashboard or home on success
      // For now, maybe just stay here or go to a dashboard route if it exists?
      // The user didn't specify, but I'll add a comment/placeholder.
      console.log("Logged in!");
      // router.push("/dashboard"); 
    }
  }, [token, router]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gradient-to-tr from-blue-500 to-purple-600 p-4">
      <Card className="w-full max-w-md p-4 shadow-xl">
        <CardHeader className="flex flex-col items-center pb-0 pt-4">
          <h1 className="text-3xl font-bold text-default-900">Welcome Back</h1>
          <p className="text-small text-default-500">Sign in to your account</p>
        </CardHeader>
        <CardBody className="overflow-hidden pb-4 pt-4">
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <Input
              isRequired
              label="Email"
              placeholder="Enter your email"
              type="email"
              variant="bordered"
              value={email}
              onValueChange={setEmail}
              classNames={{
                inputWrapper: "bg-default-100",
              }}
            />
            <Input
              isRequired
              label="Password"
              placeholder="Enter your password"
              type="password"
              variant="bordered"
              value={password}
              onValueChange={setPassword}
              classNames={{
                inputWrapper: "bg-default-100",
              }}
            />

            {loginError && (
              <div className="text-center text-sm text-danger">
                {typeof loginError === 'string' ? loginError : 'Login failed'}
              </div>
            )}

            <div className="flex w-full items-center justify-between px-1 py-2">
              <Link href="#" size="sm" className="text-default-500">
                Forgot password?
              </Link>
            </div>

            <Button
              className="w-full font-semibold shadow-lg"
              color="primary"
              type="submit"
              isLoading={loginLoading}
            >
              Sign In
            </Button>
          </form>

          <div className="mt-4 text-center text-small text-default-500">
            Don&apos;t have an account?{" "}
            <Link href="/register" size="sm" className="font-bold text-primary">
              Sign up
            </Link>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
