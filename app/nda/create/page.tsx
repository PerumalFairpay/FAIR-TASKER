"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@heroui/button";
import { Input, Textarea } from "@heroui/input";
import { addToast } from "@heroui/toast";
import { Snippet } from "@heroui/snippet";
import { useDispatch, useSelector } from "react-redux";
import { createNdaRequest, clearNda } from "@/store/nda/action";
import { AppState } from "@/store/rootReducer";

interface NDACreateForm {
    employee_name: string;
    employee_address: string;
}

export default function CreateNDAPage() {
    const { register, handleSubmit, formState: { errors }, reset } = useForm<NDACreateForm>();
    const dispatch = useDispatch();
    const { createNdaLoading, createNdaSuccess, createNdaError, ndaToken } = useSelector((state: AppState) => state.Nda);
    const [ndaLink, setNdaLink] = useState<string | null>(null);

    useEffect(() => {
        if (createNdaSuccess && ndaToken) {
            const link = `${window.location.origin}/nda/${ndaToken}`;
            setNdaLink(link);
            addToast({
                title: "Success",
                description: createNdaSuccess,
                color: "success"
            });
            reset();
            dispatch(clearNda());
        }
    }, [createNdaSuccess, ndaToken, reset, dispatch]);

    useEffect(() => {
        if (createNdaError) {
            addToast({
                title: "Error",
                description: createNdaError,
                color: "danger"
            });
            dispatch(clearNda());
        }
    }, [createNdaError, dispatch]);

    const onSubmit = async (data: NDACreateForm) => {
        dispatch(createNdaRequest(data));
    };

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Generate NDA Link</h1>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input
                        label="Employee Name"
                        placeholder="Enter employee's full name"
                        {...register("employee_name", { required: "Employee name is required" })}
                        isInvalid={!!errors.employee_name}
                        errorMessage={errors.employee_name?.message}
                        variant="bordered"
                    />

                    <Textarea
                        label="Employee Address"
                        placeholder="Enter employee's full address"
                        {...register("employee_address", { required: "Employee address is required" })}
                        isInvalid={!!errors.employee_address}
                        errorMessage={errors.employee_address?.message}
                        variant="bordered"
                    />

                    <Button
                        type="submit"
                        color="primary"
                        isLoading={createNdaLoading}
                        className="w-full"
                    >
                        Generate Link
                    </Button>
                </form>

                {ndaLink && (
                    <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-primary/20">
                        <p className="text-sm text-gray-600 mb-2 font-medium">Share this link with the employee:</p>
                        <Snippet symbol="" className="w-full bg-white border border-gray-200" color="primary">
                            {ndaLink}
                        </Snippet>
                        <p className="text-xs text-red-500 mt-2">
                            * This link will expire in 1 hour.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
