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
import { Banknote, CalendarCheck, Eye, EyeOff, ShieldCheck, Users, BarChart3, User as UserIcon, Clock, KanbanSquare, Package, Briefcase, Newspaper } from "lucide-react";
import Image from "next/image";
import FairPayLogo from "@/app/assets/FairPay.png";

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
    { icon: <Users className="text-blue-400" />, text: "Employee Lifecycle Management" },
    { icon: <Clock className="text-green-400" />, text: "Smart Attendance & Leave" },
    { icon: <KanbanSquare className="text-purple-400" />, text: "Advanced Task & Project Board" },
    { icon: <Package className="text-yellow-400" />, text: "Asset & Resource Tracking" },
    { icon: <Briefcase className="text-cyan-400" />, text: "Client & Vendor Management" },
    { icon: <BarChart3 className="text-orange-400" />, text: "Insightful HR Analytics" },
    { icon: <Newspaper className="text-rose-400" />, text: "Internal Blog & News Feeds" },
    { icon: <ShieldCheck className="text-emerald-400" />, text: "Granular Access Control" },
  ];

  return (
    <div className="flex min-h-screen w-full overflow-hidden bg-background">
      {/* Left Side - Hero Section */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-indigo-950 via-blue-950 to-black p-12 lg:flex"
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 z-0">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute -left-20 -top-20 h-[500px] w-[500px] rounded-full bg-blue-600/20 blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
            className="absolute bottom-0 right-0 h-[600px] w-[600px] rounded-full bg-purple-600/20 blur-3xl"
          />
        </div>

        {/* Content */}
        <div className="relative z-10 flex h-full flex-col justify-between">
          <div />

          <motion.div
            className="space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1
              variants={itemVariants}
              className="text-4xl font-bold leading-tight text-white tracking-tight sm:text-5xl"
            >
              Empower your <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Human Capital
              </span>
            </motion.h1>
            <motion.p variants={itemVariants} className="max-w-md text-base text-blue-100/70 leading-relaxed">
              The all-in-one HRM solution to manage your workforce, automate payroll, and cultivate a high-performance culture with ease and precision.
            </motion.p>

            <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3 pt-2">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/5 p-3 backdrop-blur-sm transition-colors hover:bg-white/10 text-white/90">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-500/20 text-blue-300">
                    {React.cloneElement(feature.icon as React.ReactElement, { size: 16 })}
                  </div>
                  <span className="text-xs font-medium">{feature.text}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-xs text-white/40"
          >
            © 2025 FairTasker. All rights reserved.
          </motion.div>
        </div>
      </motion.div>

      {/* Right Side - Login Form */}
      <div className="flex w-full flex-col justify-center bg-background p-8 lg:w-1/2 lg:p-24">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mx-auto w-full max-w-[400px]"
        >
          <div className="mb-10 text-center flex flex-col items-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <Image
                src={FairPayLogo}
                alt="FairPay Logo"
                width={200}
                height={70}
                className="object-contain"
                priority
              />
            </motion.div>
            <p className="mt-2 text-default-500">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Input
                suppressHydrationWarning
                isRequired
                label="Email"
                labelPlacement="outside"
                placeholder="john@example.com"
                type="email"
                variant="bordered"
                value={email}
                onValueChange={setEmail}
                className="max-w-full"
                classNames={{
                  label: "text-foreground font-medium",
                  inputWrapper: "h-12 border-default-200 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all",
                }}
              />
            </motion.div>

            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Input
                suppressHydrationWarning
                isRequired
                label="Password"
                labelPlacement="outside"
                placeholder="••••••••"
                type={isVisible ? "text" : "password"}
                variant="bordered"
                value={password}
                onValueChange={setPassword}
                endContent={
                  <button className="focus:outline-none opacity-70 hover:opacity-100 transition-opacity" type="button" onClick={toggleVisibility}>
                    {isVisible ? (
                      <EyeOff className="text-xl text-default-400" />
                    ) : (
                      <Eye className="text-xl text-default-400" />
                    )}
                  </button>
                }
                classNames={{
                  label: "text-foreground font-medium",
                  inputWrapper: "h-12 border-default-200 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all",
                }}
              />
            </motion.div>


            <AnimatePresence mode="wait">
              {loginError && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="rounded-lg bg-danger-50/50 border border-danger-100 p-3 text-center text-sm font-medium text-danger"
                >
                  {typeof loginError === 'string' ? loginError : 'Invalid credentials. Please try again.'}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="pt-2"
            >
              <Button
                className="h-12 w-full bg-gradient-to-r from-blue-600 to-purple-600 font-bold text-white shadow-lg shadow-blue-500/30 transition-shadow hover:shadow-blue-500/40"
                type="submit"
                isLoading={loginLoading}
                size="lg"
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
