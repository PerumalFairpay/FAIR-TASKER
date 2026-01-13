"use client";

import React from 'react';
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';

// Register the plugins
if (typeof window !== 'undefined') {
    registerPlugin(
        FilePondPluginImagePreview,
        FilePondPluginFileValidateType,
        FilePondPluginFileValidateSize
    );
}

interface FileUploadProps {
    files: any[];
    setFiles: (files: any[]) => void;
    labelIdle?: string;
    acceptedFileTypes?: string[];
    allowMultiple?: boolean;
    maxFiles?: number;
    name?: string;
    [key: string]: any;
}

const FileUpload: React.FC<FileUploadProps> = ({
    files,
    setFiles,
    labelIdle = 'Drag & Drop your files or <span class="filepond--label-action">Browse</span>',
    acceptedFileTypes,
    allowMultiple = false,
    maxFiles = 1,
    name = 'file',
    ...props
}) => {
    return (
        <FilePond
            files={files}
            onupdatefiles={setFiles}
            allowMultiple={allowMultiple}
            maxFiles={maxFiles}
            name={name}
            labelIdle={labelIdle}
            acceptedFileTypes={acceptedFileTypes}
            credits={false}
            {...props}
        />
    );
};

export default FileUpload;
