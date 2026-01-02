"use client";

import React from "react";
import { motion } from "framer-motion";

interface PageHeaderProps {
    title: string;
    description?: string;
}

export const PageHeader = ({ title, description }: PageHeaderProps) => {
    // Animation for the container of letters
    const container = {
        hidden: { opacity: 0 },
        visible: (i = 1) => ({
            opacity: 1,
            transition: { staggerChildren: 0.03, delayChildren: 0.04 * i },
        }),
    };

    // Animation for each letter falling in
    const child = {
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 200,
            },
        },
        hidden: {
            opacity: 0,
            y: -20,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 200,
            },
        },
    };

    return (
        <div className="flex flex-col gap-1 select-none">
            <motion.div
                className="flex flex-wrap overflow-hidden"
                variants={container}
                initial="hidden"
                animate="visible"
            >
                {title.split("").map((letter, index) => (
                    <motion.h1
                        key={index}
                        variants={child}
                        className="text-2xl font-bold cursor-default"
                        whileHover={{
                            y: -3,
                            color: "hsl(var(--heroui-primary))",
                            transition: { duration: 0.2 }
                        }}
                    >
                        {letter === " " ? "\u00A0" : letter}
                    </motion.h1>
                ))}
            </motion.div>

            {description && (
                <motion.p
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="text-default-500 text-sm"
                >
                    {description}
                </motion.p>
            )}
        </div>
    );
};
