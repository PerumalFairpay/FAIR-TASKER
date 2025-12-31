"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { loginRequest } from "@/store/auth/action";
import { AppState } from "@/store/rootReducer";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Banknote, CalendarCheck, Eye, EyeOff, ShieldCheck, Users, BarChart3 } from "lucide-react";
import { Logo } from "@/components/icons";

export default function LoginPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loginLoading, loginError, token } = useSelector(
    (state: AppState) => state.Auth
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginRequest({ email, password }));
  };

  useEffect(() => {
    if (token) {
      console.log("Logged in!");
      router.push("/dashboard");
    }
  }, [token, router]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  const features = [
    { icon: <Users className="text-blue-400" size={20} />, text: "Employee Lifecycle Management" },
    { icon: <Banknote className="text-green-400" size={20} />, text: "Automated Payroll Processing" },
    { icon: <BarChart3 className="text-purple-400" size={20} />, text: "Performance & Growth Tracking" },
    { icon: <CalendarCheck className="text-yellow-400" size={20} />, text: "Seamless Leave & Attendance" },
  ];

  return (
    <div className="flex min-h-screen w-full overflow-hidden bg-background">
      {/* Left Side - Hero Section */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative hidden w-1/2 flex-col justify-between p-12 lg:flex"
      >
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/login-bg.png')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-purple-900/70 to-blue-900/80 backdrop-blur-[2px]" />
        </div>

        {/* Content */}
        <div className="relative z-10">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-2 text-white"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md">
              <Logo className="text-white" size={24} />
            </div>
            <span className="text-2xl font-bold tracking-tight">FairTasker HRM</span>
          </motion.div>

          <motion.div
            className="mt-24 space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1
              variants={itemVariants}
              className="text-5xl font-extrabold leading-tight text-white"
            >
              Empower your <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Human Capital
              </span>
            </motion.h1>
            <motion.p variants={itemVariants} className="max-w-md text-lg text-blue-100/80">
              The all-in-one HRM solution to manage your workforce, automate payroll, and cultivate a high-performance culture.
            </motion.p>

            <motion.div variants={itemVariants} className="space-y-4 pt-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3 text-white/90">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
                    {feature.icon}
                  </div>
                  <span className="font-medium">{feature.text}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="relative z-10 text-sm text-white/50"
        >
          © 2025 FairTasker. All rights reserved.
        </motion.div>
      </motion.div>

      {/* Right Side - Login Form */}
      <div className="flex w-full flex-col justify-center bg-background p-8 lg:w-1/2 lg:p-24">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mx-auto w-full max-w-[420px]"
        >
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-foreground">Welcome back</h2>
            <p className="mt-2 text-default-500">Please enter your details to sign in.</p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-6">
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Input
                isRequired
                label="Email"
                labelPlacement="outside"
                placeholder="name@company.com"
                type="email"
                variant="bordered"
                value={email}
                onValueChange={setEmail}
                className="max-w-full"
                classNames={{
                  label: "text-foreground font-medium",
                  inputWrapper: "h-12 border-default-200 focus-within:border-primary transition-colors",
                }}
              />
            </motion.div>

            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Input
                isRequired
                label="Password"
                labelPlacement="outside"
                placeholder="••••••••"
                type={isVisible ? "text" : "password"}
                variant="bordered"
                value={password}
                onValueChange={setPassword}
                endContent={
                  <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                    {isVisible ? (
                      <EyeOff className="text-2xl text-default-400 pointer-events-none" />
                    ) : (
                      <Eye className="text-2xl text-default-400 pointer-events-none" />
                    )}
                  </button>
                }
                classNames={{
                  label: "text-foreground font-medium",
                  inputWrapper: "h-12 border-default-200 focus-within:border-primary transition-colors",
                }}
              />
            </motion.div>

            <AnimatePresence mode="wait">
              {loginError && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="rounded-lg bg-danger-50 p-3 text-center text-sm font-medium text-danger"
                >
                  {typeof loginError === 'string' ? loginError : 'Login failed. Please check your credentials.'}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <Button
                className="h-12 w-full bg-primary font-semibold text-white shadow-lg shadow-primary/20"
                type="submit"
                isLoading={loginLoading}
              >
                Sign In
              </Button>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
