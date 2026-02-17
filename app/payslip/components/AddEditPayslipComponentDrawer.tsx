
import React, { useEffect, useState } from "react";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
    DrawerFooter,
} from "@heroui/drawer";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Switch } from "@heroui/switch";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "@/store/rootReducer";
import {
    createPayslipComponentRequest,
    updatePayslipComponentRequest,
    clearPayslipComponentStates,
} from "@/store/payslipComponent/action";

interface AddEditPayslipComponentDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    selectedComponent: any;
}

export default function AddEditPayslipComponentDrawer({
    isOpen,
    onClose,
    selectedComponent,
}: AddEditPayslipComponentDrawerProps) {
    const dispatch = useDispatch();
    const {
        createPayslipComponentLoading,
        createPayslipComponentSuccess,
        updatePayslipComponentLoading,
        updatePayslipComponentSuccess,
    } = useSelector((state: AppState) => state.PayslipComponent);

    const [formData, setFormData] = useState({
        name: "",
        type: "Earnings",
        is_active: true,
    });

    const [errors, setErrors] = useState<any>({});

    useEffect(() => {
        if (selectedComponent) {
            setFormData({
                name: selectedComponent.name,
                type: selectedComponent.type,
                is_active: selectedComponent.is_active,
            });
        } else {
            setFormData({
                name: "",
                type: "Earnings",
                is_active: true,
            });
        }
        setErrors({});
    }, [selectedComponent, isOpen]);

    useEffect(() => {
        if (createPayslipComponentSuccess || updatePayslipComponentSuccess) {
            dispatch(clearPayslipComponentStates());
            onClose();
        }
    }, [createPayslipComponentSuccess, updatePayslipComponentSuccess, dispatch, onClose]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev: any) => ({ ...prev, [name]: "" }));
    };

    const handleSelectionChange = (key: string, value: any) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = () => {
        const newErrors: any = {};
        if (!formData.name) newErrors.name = "Name is required";
        if (!formData.type) newErrors.type = "Type is required";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        if (selectedComponent) {
            dispatch(updatePayslipComponentRequest(selectedComponent.id, formData));
        } else {
            dispatch(createPayslipComponentRequest(formData));
        }
    };

    return (
        <Drawer isOpen={isOpen} onClose={onClose} size="md">
            <DrawerContent>
                <DrawerHeader className="flex flex-col gap-1">
                    {selectedComponent ? "Edit Component" : "Add Component"}
                </DrawerHeader>
                <DrawerBody>
                    <div className="flex flex-col gap-4">
                        <Input
                            label="Name"
                            placeholder="Enter component name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            isInvalid={!!errors.name}
                            errorMessage={errors.name}
                            variant="bordered"
                        />
                        <Select
                            label="Type"
                            placeholder="Select Type"
                            selectedKeys={[formData.type]}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleSelectionChange("type", e.target.value)}
                            variant="bordered"
                            isInvalid={!!errors.type}
                            errorMessage={errors.type}
                        >
                            <SelectItem key="Earnings">
                                Earnings
                            </SelectItem>
                            <SelectItem key="Deductions">
                                Deductions
                            </SelectItem>
                        </Select>
                        <div className="flex items-center justify-between">
                            <span>Status</span>
                            <Switch
                                isSelected={formData.is_active}
                                onValueChange={(value: boolean) => handleSelectionChange("is_active", value)}
                            >
                                {formData.is_active ? "Active" : "Inactive"}
                            </Switch>
                        </div>
                    </div>
                </DrawerBody>
                <DrawerFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                        Cancel
                    </Button>
                    <Button
                        color="primary"
                        onPress={handleSubmit}
                        isLoading={createPayslipComponentLoading || updatePayslipComponentLoading}
                    >
                        {selectedComponent ? "Update" : "Create"}
                    </Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}
