"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
    getAssetsRequest,
    createAssetRequest,
    updateAssetRequest,
    deleteAssetRequest,
    clearAssetDetails,
} from "@/store/asset/action";
import { getAssetCategoriesRequest } from "@/store/assetCategory/action";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
} from "@heroui/table";
import { Button } from "@heroui/button";
import { useDisclosure } from "@heroui/modal";
import { PlusIcon, PencilIcon, TrashIcon, Eye } from "lucide-react";
import { Chip } from "@heroui/chip";
import AddEditAssetDrawer from "./AddEditAssetDrawer";
import DeleteAssetModal from "./DeleteAssetModal";
// import AddEditAssetDrawer from "./AddEditAssetDrawer";
// import DeleteAssetModal from "./DeleteAssetModal";

export default function AssetListPage() {
    const dispatch = useDispatch();
    const { assets, loading, success } = useSelector((state: RootState) => state.Asset);
    const { assetCategories } = useSelector((state: RootState) => state.AssetCategory);

    const { isOpen: isAddEditOpen, onOpen: onAddEditOpen, onOpenChange: onAddEditOpenChange, onClose: onAddEditClose } = useDisclosure();
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onOpenChange: onDeleteOpenChange, onClose: onDeleteClose } = useDisclosure();

    const [mode, setMode] = useState<"create" | "edit">("create");
    const [selectedAsset, setSelectedAsset] = useState<any>(null);

    useEffect(() => {
        dispatch(getAssetsRequest());
        dispatch(getAssetCategoriesRequest());
    }, [dispatch]);

    useEffect(() => {
        if (success) {
            onAddEditClose();
            onDeleteClose();
            dispatch(clearAssetDetails());
        }
    }, [success, onAddEditClose, onDeleteClose, dispatch]);

    const handleCreate = () => {
        setMode("create");
        setSelectedAsset(null);
        onAddEditOpen();
    };

    const handleEdit = (asset: any) => {
        setMode("edit");
        setSelectedAsset(asset);
        onAddEditOpen();
    };

    const handleDeleteClick = (asset: any) => {
        setSelectedAsset(asset);
        onDeleteOpen();
    };

    const handleAddEditSubmit = (formData: FormData) => {
        if (mode === "create") {
            dispatch(createAssetRequest(formData));
        } else {
            dispatch(updateAssetRequest(selectedAsset.id, formData));
        }
    };

    const handleDeleteConfirm = () => {
        if (selectedAsset) {
            dispatch(deleteAssetRequest(selectedAsset.id));
        }
    };

    const getCategoryName = (id: string) => {
        const cat = assetCategories.find((c: any) => c.id === id);
        return cat ? cat.name : "Unknown";
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <PageHeader
                    title="Assets"
                    description="Manage company assets and inventory"
                />
                <Button
                    color="primary"
                    endContent={<PlusIcon size={16} />}
                    onPress={handleCreate}
                >
                    Add New Asset
                </Button>
            </div>

            <Table aria-label="Asset table" removeWrapper isHeaderSticky>
                <TableHeader>
                    <TableColumn>ASSET NAME</TableColumn>
                    <TableColumn>CATEGORY</TableColumn>
                    <TableColumn>MODEL/SERIAL</TableColumn>
                    <TableColumn>PURCHASE DATE</TableColumn>
                    <TableColumn>COST</TableColumn>
                    <TableColumn>STATUS</TableColumn>
                    <TableColumn align="center">ACTIONS</TableColumn>
                </TableHeader>
                <TableBody items={assets || []} emptyContent={"No assets found"} isLoading={loading}>
                    {(item: any) => (
                        <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.asset_name}</TableCell>
                            <TableCell>{getCategoryName(item.asset_category_id)}</TableCell>
                            <TableCell>
                                <div className="flex flex-col">
                                    <span className="text-sm">{item.model_no || "N/A"}</span>
                                    <span className="text-tiny text-default-400">{item.serial_no || "No Serial"}</span>
                                </div>
                            </TableCell>
                            <TableCell>{item.purchase_date || "N/A"}</TableCell>
                            <TableCell className="font-bold">
                                ₹{item.purchase_cost ? parseFloat(item.purchase_cost).toLocaleString() : "0"}
                            </TableCell>
                            <TableCell>
                                <Chip
                                    className="capitalize"
                                    color={item.status === "Available" ? "success" : item.status === "Assigned" ? "primary" : "warning"}
                                    size="sm"
                                    variant="flat"
                                >
                                    {item.status}
                                </Chip>
                            </TableCell>
                            <TableCell>
                                <div className="relative flex items-center justify-center gap-2">
                                    {item.images && item.images.length > 0 && (
                                        <a href={item.images[0]} target="_blank" rel="noreferrer" className="text-lg text-primary cursor-pointer active:opacity-50">
                                            <Eye size={18} />
                                        </a>
                                    )}
                                    <span className="text-lg text-default-400 cursor-pointer active:opacity-50" onClick={() => handleEdit(item)}>
                                        <PencilIcon size={18} />
                                    </span>
                                    <span className="text-lg text-danger cursor-pointer active:opacity-50" onClick={() => handleDeleteClick(item)}>
                                        <TrashIcon size={18} />
                                    </span>
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            <AddEditAssetDrawer
                isOpen={isAddEditOpen}
                onOpenChange={onAddEditOpenChange}
                mode={mode}
                selectedAsset={selectedAsset}
                loading={loading}
                assetCategories={assetCategories}
                onSubmit={handleAddEditSubmit}
            />

            <DeleteAssetModal
                isOpen={isDeleteOpen}
                onOpenChange={onDeleteOpenChange}
                onConfirm={handleDeleteConfirm}
                loading={loading}
            />
        </div>
    );
}
