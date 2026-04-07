"use client";

import React, { useCallback } from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { MapPin, Loader2, ExternalLink } from "lucide-react";

interface LocationMapModalProps {
    isOpen: boolean;
    onClose: () => void;
    latitude: number;
    longitude: number;
    address?: string;
    employeeName?: string;
    clockType?: "Clock In" | "Clock Out";
}

const mapContainerStyle = {
    width: "100%",
    height: "380px",
    borderRadius: "12px",
};

const mapOptions: google.maps.MapOptions = {
    disableDefaultUI: false,
    zoomControl: true,
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: true,
    styles: [
        {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
        },
    ],
};

export default function LocationMapModal({
    isOpen,
    onClose,
    latitude,
    longitude,
    address,
    employeeName,
    clockType = "Clock In",
}: LocationMapModalProps) {
    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
        id: "google-map-script",
    });

    const center = { lat: latitude, lng: longitude };

    const onMapLoad = useCallback((map: google.maps.Map) => {
        // Map loaded
    }, []);

    const openInGoogleMaps = () => {
        window.open(
            `https://www.google.com/maps?q=${latitude},${longitude}`,
            "_blank",
        );
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="2xl"
            scrollBehavior="inside"
            classNames={{
                base: "max-w-2xl",
                body: "p-4",
                header: "border-b border-divider pb-3",
            }}
        >
            <ModalContent>
                {(onModalClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <div className={`p-1.5 rounded-lg ${clockType === "Clock In" ? "bg-primary-50 text-primary" : "bg-warning-50 text-warning"}`}>
                                    <MapPin size={18} />
                                </div>
                                <div>
                                    <span className="text-sm font-bold text-default-800">
                                        {clockType} Location
                                    </span>
                                    {employeeName && (
                                        <p className="text-xs text-default-500 font-normal mt-0.5">
                                            {employeeName}
                                        </p>
                                    )}
                                </div>
                            </div>
                            {address && (
                                <p className="text-xs text-default-500 mt-1 font-normal leading-snug">
                                    📍 {address}
                                </p>
                            )}
                        </ModalHeader>

                        <ModalBody>
                            {loadError ? (
                                <div className="flex flex-col items-center justify-center h-48 gap-3 text-danger">
                                    <MapPin size={40} className="opacity-40" />
                                    <p className="text-sm font-medium">Failed to load map. Check your API key.</p>
                                </div>
                            ) : !isLoaded ? (
                                <div className="flex flex-col items-center justify-center h-48 gap-3 text-default-400">
                                    <Loader2 size={36} className="animate-spin" />
                                    <p className="text-sm font-medium">Loading map...</p>
                                </div>
                            ) : (
                                <GoogleMap
                                    mapContainerStyle={mapContainerStyle}
                                    center={center}
                                    zoom={16}
                                    options={mapOptions}
                                    onLoad={onMapLoad}
                                >
                                    <Marker
                                        position={center}
                                        title={address || `${latitude}, ${longitude}`}
                                    />
                                </GoogleMap>
                            )}
                        </ModalBody>

                        <ModalFooter className="flex justify-between">
                            <Button
                                variant="flat"
                                color="default"
                                size="sm"
                                startContent={<ExternalLink size={14} />}
                                onPress={openInGoogleMaps}
                            >
                                Open in Google Maps
                            </Button>
                            <Button
                                color="primary"
                                variant="light"
                                size="sm"
                                onPress={onModalClose}
                            >
                                Close
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
