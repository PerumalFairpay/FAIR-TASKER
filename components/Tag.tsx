import React from "react";
import { Info, BarChart2, CheckCircle2, ShieldCheck, Zap, XCircle, LayoutGrid, Smartphone, Box, Activity, DollarSign } from "lucide-react";

type IconName =
    | "Chart"
    | "TaskSquare"
    | "Building4"
    | "CloseCircle"
    | "TickCircle"
    | "Headphone"
    | "Cpu"
    | "DollarCircle"
    | "VoiceSquare"
    | "FlashCircle"
    | "FlashSlash"
    | "Flash"
    | "Diagram"
    | "ShieldTick"
    | "Nexo"
    | "Mobile"
    | "Radar"
    | "InfoCircle"
    | string;

interface TagProps {
    label: string;
    iconName?: IconName;
    iconVariant?: "Bold" | "Linear" | "Outline" | "Broken" | "Bulk" | "TwoTone"; // Kept for prop compatibility but unused with Lucide
    iconSize?: number;
    className?: string;
    dataFramerName?: string;
}

export default function Tag({
    label,
    iconName = "Chart",
    iconSize = 16,
    className = "",
    dataFramerName = "Tag"
}: TagProps) {

    // Map icon names to Lucide components
    const getIconComponent = () => {
        const iconProps = {
            size: iconSize,
            className: "text-[#969696] dark:text-[#A0A0A0]",
        };

        switch (iconName) {
            case "Chart": return <BarChart2 {...iconProps} />;
            case "TaskSquare": return <CheckCircle2 {...iconProps} />;
            case "Building4": return <LayoutGrid {...iconProps} />;
            case "CloseCircle": return <XCircle {...iconProps} />;
            case "TickCircle": return <CheckCircle2 {...iconProps} />;
            case "DollarCircle": return <DollarSign {...iconProps} />;
            case "Flash": return <Zap {...iconProps} />;
            case "ShieldTick": return <ShieldCheck {...iconProps} />;
            case "Mobile": return <Smartphone {...iconProps} />;
            case "InfoCircle": return <Info {...iconProps} />;
            default: return <Activity {...iconProps} />;
        }
    };

    return (
        <div className={`mb-6 ${className}`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 border border-solid border-white dark:border-[#333] bg-[#F6F6F6] dark:bg-[#1f1f1f] rounded-[27px] shadow-[0px_0.6px_0.6px_0px_rgba(28,28,28,0),0px_2.3px_2.3px_0px_rgba(28,28,28,0.02),0px_10px_10px_0px_rgba(28,28,28,0.08),0px_-6px_6px_-5px_rgb(255,255,255)] dark:shadow-none transition-colors duration-200">
                {getIconComponent()}
                <div className="flex flex-col justify-center shrink-0">
                    <p className="text-[#1C1C1C] dark:text-[#E3E3E3] text-[14px] font-medium m-0">
                        {label}
                    </p>
                </div>
            </div>
        </div>
    );
}
