"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Monitor, X, Download } from "lucide-react";

export const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Update UI notify the user they can add to home screen
      setIsVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Check if app is already installed
    window.addEventListener("appinstalled", () => {
      setIsVisible(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === "accepted") {
      console.log("User accepted the install prompt");
    } else {
      console.log("User dismissed the install prompt");
    }

    // We've used the prompt, and can't use it again
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-4 left-4 right-4 z-[9999] md:left-auto md:right-8 md:max-w-md"
        >
          <Card className="border-none bg-background/80 backdrop-blur-lg shadow-2xl overflow-hidden">
            <CardBody className="p-0">
              <div className="flex items-center gap-4 p-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <Monitor size={24} />
                </div>
                <div className="flex-grow">
                  <h3 className="text-sm font-semibold text-foreground">
                    Create Shortcut?
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Install FairPay HRM on your home screen for quick access.
                  </p>
                </div>
                <button
                  onClick={() => setIsVisible(false)}
                  className="p-1 hover:bg-default-100 rounded-full transition-colors"
                >
                  <X size={18} className="text-muted-foreground" />
                </button>
              </div>
              <div className="flex gap-2 p-3 bg-default-50/50">
                <Button
                  fullWidth
                  variant="flat"
                  size="sm"
                  onPress={() => setIsVisible(false)}
                  className="font-medium"
                >
                  Maybe later
                </Button>
                <Button
                  fullWidth
                  color="primary"
                  size="sm"
                  onPress={handleInstallClick}
                  startContent={<Download size={16} />}
                  className="font-medium shadow-lg shadow-primary/20"
                >
                  Install Now
                </Button>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
