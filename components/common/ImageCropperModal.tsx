import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/modal";
import { Button } from "@heroui/button";
import { ZoomIn, ZoomOut, RotateCw, X, Check } from "lucide-react";

interface ImageCropperModalProps {
    isOpen: boolean;
    onClose: () => void;
    imageSrc: string | null;
    onCropComplete: (croppedFile: File) => void;
}

export default function ImageCropperModal({
    isOpen,
    onClose,
    imageSrc,
    onCropComplete
}: ImageCropperModalProps) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
    const [isSaving, setIsSaving] = useState(false);

    const onCropChange = (crop: { x: number; y: number }) => {
        setCrop(crop);
    };

    const onZoomChange = (zoom: number) => {
        setZoom(zoom);
    };

    const onCropCompleteCallback = useCallback((croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const rotateImage = () => {
        setRotation((prev) => (prev + 90) % 360);
    };

    // Helper to rotate and crop image using HTML5 Canvas
    const createImage = (url: string): Promise<HTMLImageElement> =>
        new Promise((resolve, reject) => {
            const image = new Image();
            image.addEventListener("load", () => resolve(image));
            image.addEventListener("error", (error) => reject(error));
            image.setAttribute("crossOrigin", "anonymous"); // avoid cors issues
            image.src = url;
        });

    const getCroppedImg = async (
        imageSrc: string,
        pixelCrop: any,
        rotation = 0
    ): Promise<File | null> => {
        try {
            const image = await createImage(imageSrc);
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            if (!ctx) {
                return null;
            }

            const rotRad = (rotation * Math.PI) / 180;

            // Calculate bounding box of the rotated image
            const { width: bWidth, height: bHeight } = rotateSize(
                image.width,
                image.height,
                rotation
            );

            // Set canvas size to match the bounding box
            canvas.width = bWidth;
            canvas.height = bHeight;

            // Translate canvas context to a central point on canvas to draw image rotated around the center.
            ctx.translate(bWidth / 2, bHeight / 2);
            ctx.rotate(rotRad);
            ctx.translate(-image.width / 2, -image.height / 2);

            // Draw image
            ctx.drawImage(image, 0, 0);

            // croppedAreaPixels values are relative to the rotated image bounding box
            const data = ctx.getImageData(
                pixelCrop.x,
                pixelCrop.y,
                pixelCrop.width,
                pixelCrop.height
            );

            // Set canvas width to final desired crop size
            canvas.width = pixelCrop.width;
            canvas.height = pixelCrop.height;

            // Paste image data in top left corner of canvas
            ctx.putImageData(data, 0, 0);

            // As a File object
            return new Promise((resolve, reject) => {
                canvas.toBlob(
                    (file) => {
                        if (file) {
                            resolve(new File([file], "profile_picture.jpg", { type: "image/jpeg" }));
                        } else {
                            reject(new Error("Canvas toBlob failed"));
                        }
                    },
                    "image/jpeg",
                    0.95
                );
            });
        } catch (e) {
            console.error(e);
            return null;
        }
    };

    function rotateSize(width: number, height: number, rotation: number) {
        const rotRad = (rotation * Math.PI) / 180;
        return {
            width:
                Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
            height:
                Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
        };
    }

    const handleSave = async () => {
        if (!imageSrc || !croppedAreaPixels) return;
        setIsSaving(true);
        try {
            const croppedFile = await getCroppedImg(imageSrc, croppedAreaPixels, rotation);
            if (croppedFile) {
                onCropComplete(croppedFile);
                onClose();
            }
        } catch (error) {
            console.error("Failed to crop image:", error);
        } finally {
            setIsSaving(false);
        }
    };

    if (!imageSrc) return null;

    return (
        <Modal 
            isOpen={isOpen} 
            onOpenChange={(open) => {
                if (!open) onClose();
            }}
            placement="center"
            size="md"
            backdrop="blur"
            classNames={{
                base: "bg-content1 dark:bg-[#0D0D0D] border border-default-200 dark:border-white/10 rounded-2xl max-w-[420px] overflow-hidden",
                header: "border-b border-default-100 dark:border-white/5 pb-3 pt-4 px-5",
                body: "p-0",
                footer: "border-t border-default-100 dark:border-white/5 pt-3 pb-4 px-5"
            }}
        >
            <ModalContent>
                {() => (
                    <>
                        <ModalHeader className="font-bold text-lg text-default-800 dark:text-white flex items-center justify-between">
                            Crop Profile Picture
                        </ModalHeader>
                        
                        <ModalBody className="p-0">
                            <div style={{ position: "relative", width: "100%", height: "320px" }} className="bg-neutral-950 dark:bg-black">
                                <Cropper
                                    image={imageSrc}
                                    crop={crop}
                                    zoom={zoom}
                                    rotation={rotation}
                                    aspect={1}
                                    cropShape="rect"
                                    showGrid={false}
                                    onCropChange={onCropChange}
                                    onCropComplete={onCropCompleteCallback}
                                    onZoomChange={onZoomChange}
                                />
                            </div>
                        </ModalBody>

                        <ModalFooter className="flex flex-col gap-4">
                            {/* Controls */}
                            <div className="w-full space-y-3">
                                {/* Zoom Slider */}
                                <div className="flex items-center gap-3">
                                    <ZoomOut size={16} className="text-default-400" />
                                    <input
                                        type="range"
                                        min={1}
                                        max={3}
                                        step={0.1}
                                        value={zoom}
                                        onChange={(e) => setZoom(Number(e.target.value))}
                                        className="w-full h-1 bg-default-200 rounded-lg appearance-none cursor-pointer accent-primary"
                                    />
                                    <ZoomIn size={16} className="text-default-400" />
                                </div>

                                {/* Rotate Button */}
                                <div className="flex justify-center">
                                    <Button
                                        size="sm"
                                        variant="flat"
                                        color="default"
                                        className="font-semibold text-xs gap-1.5 h-8 rounded-lg"
                                        onClick={rotateImage}
                                    >
                                        <RotateCw size={14} />
                                        Rotate
                                    </Button>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex w-full gap-3">
                                <Button
                                    variant="flat"
                                    color="danger"
                                    className="flex-1 font-bold h-10 rounded-xl"
                                    onClick={onClose}
                                    startContent={<X size={16} />}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    color="primary"
                                    className="flex-1 font-bold h-10 rounded-xl"
                                    onClick={handleSave}
                                    isLoading={isSaving}
                                    startContent={!isSaving && <Check size={16} />}
                                >
                                    Apply
                                </Button>
                            </div>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
