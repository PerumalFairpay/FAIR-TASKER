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
import { Eye, EyeOff } from "lucide-react";
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


  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-background transition-colors duration-500">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Stylistic SVGs */}
        <div className="absolute inset-0 opacity-20 dark:opacity-30">
          <motion.svg
            animate={{
              rotate: 360,
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute -top-[10%] -left-[5%] h-[60%] w-[60%] text-blue-600/30"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="currentColor"
              d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.5,90,-16.3,88.5,-0.9C87,14.6,81.4,29.1,73.1,41.4C64.8,53.7,53.8,63.7,40.9,71.1C28,78.5,14,83.2,-0.2,83.5C-14.4,83.8,-28.8,79.7,-42,72.6C-55.2,65.5,-67.2,55.3,-75.4,42.4C-83.6,29.5,-88,14.8,-88.4,-0.2C-88.8,-15.3,-85.1,-30.5,-76.8,-43.3C-68.5,-56.1,-55.6,-66.4,-41.7,-73.8C-27.8,-81.2,-13.9,-85.7,0.4,-86.3C14.7,-87,29.4,-83.7,44.7,-76.4Z"
              transform="translate(100 100)"
            />
          </motion.svg>

          <motion.svg
            animate={{
              rotate: -360,
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 35,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute -bottom-[20%] -right-[10%] h-[70%] w-[70%] text-purple-600/30"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="currentColor"
              d="M39.6,-67.3C50.2,-58.5,57.1,-46.1,64.2,-33.6C71.3,-21.1,78.7,-8.5,80.1,5.3C81.5,19.1,76.8,34.1,68.1,46C59.4,57.9,46.7,66.6,33.1,71.5C19.5,76.4,5,77.5,-10.1,75.4C-25.2,73.3,-40.8,68,-52.7,58.3C-64.6,48.6,-72.7,34.4,-77.1,19.3C-81.5,4.2,-82.1,-11.8,-76.9,-25.9C-71.7,-40,-60.7,-52.1,-47.8,-59.8C-34.9,-67.5,-20.1,-70.7,-4.8,-62.4C10.5,-54.1,28.9,-76.1,39.6,-67.3Z"
              transform="translate(100 100)"
            />
          </motion.svg>
        </div>

        {/* Animated Orbs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, -30, 0],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -left-20 -top-20 h-[600px] w-[600px] rounded-full bg-blue-600/15 blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -40, 0],
            y: [0, 60, 0],
            opacity: [0.15, 0.35, 0.15],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute -bottom-40 -right-20 h-[700px] w-[700px] rounded-full bg-purple-600/15 blur-[130px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.25, 0.1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[800px] w-[800px] rounded-full bg-indigo-500/10 blur-[150px]"
        />

        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </div>

      <div className="relative z-10 w-full px-6 py-12 lg:px-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mx-auto w-full max-w-[420px] p-4 md:p-8"
        >
          <div className="mb-10 text-center flex flex-col items-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              <Image
                src={FairPayLogo}
                alt="FairPay Logo"
                width={220}
                height={80}
                className="object-contain drop-shadow-sm"
                priority
              />
            </motion.div>
            <motion.h2
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold tracking-tight text-foreground"
            >
              Welcome Back
            </motion.h2>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-6">
            <motion.div
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Input
                suppressHydrationWarning
                isRequired
                label="Email Address"
                labelPlacement="outside"
                placeholder="name@company.com"
                type="email"
                variant="bordered"
                value={email}
                onValueChange={setEmail}
                className="max-w-full"
                classNames={{
                  label: "text-foreground font-semibold text-xs uppercase tracking-wider",
                  inputWrapper: "h-12 border-default-200 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10 transition-all duration-300",
                }}
              />
            </motion.div>

            <motion.div
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
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
                  <button className="focus:outline-none opacity-60 hover:opacity-100 transition-opacity" type="button" onClick={toggleVisibility}>
                    {isVisible ? (
                      <EyeOff size={18} className="text-default-400" />
                    ) : (
                      <Eye size={18} className="text-default-400" />
                    )}
                  </button>
                }
                classNames={{
                  label: "text-foreground font-semibold text-xs uppercase tracking-wider",
                  inputWrapper: "h-12 border-default-200 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10 transition-all duration-300",
                }}
              />
            </motion.div>

            <AnimatePresence mode="wait">
              {loginError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="rounded-xl bg-danger-50/10 border border-danger-200/20 p-3 text-center text-xs font-medium text-danger backdrop-blur-sm"
                >
                  {typeof loginError === 'string' ? loginError : 'Unrecognized login error. Please check your network.'}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="pt-2"
            >
              <Button
                className="h-12 w-full bg-gradient-to-r from-blue-600 to-indigo-600 font-bold text-white shadow-xl shadow-blue-500/20 transition-all hover:shadow-blue-500/40 hover:brightness-110"
                type="submit"
                isLoading={loginLoading}
                size="lg"
              >
                Sign In
              </Button>
            </motion.div>
          </form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-12 text-center text-[10px] uppercase tracking-widest text-default-400"
          >
            © 2025 FairPay Technologies
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
