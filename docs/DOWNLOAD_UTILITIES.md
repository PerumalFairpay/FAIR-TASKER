# Download Utilities

This directory contains reusable utilities and components for downloading files in the application.

## Files

### `utils/downloadFile.ts`

Utility functions for downloading files programmatically.

#### Functions

**`downloadFile(fileUrl: string, fileName: string): Promise<void>`**

- Downloads any file from a URL
- Creates a blob and triggers browser download
- Handles cleanup automatically

**`downloadPDF(pdfUrl: string, baseName: string, prefix?: string): Promise<void>`**

- Specialized function for downloading PDFs
- Automatically formats filename with prefix and base name
- Default prefix is "Document"

### `components/common/DownloadButton.tsx`

Reusable React components for download buttons.

#### Components

**`DownloadButton`**
A flexible download button component with loading states and toast notifications.

**Props:**

- `fileUrl` (required): URL of the file to download
- `fileName` (required): Name to save the file as
- `size`: Button size ("sm" | "md" | "lg")
- `variant`: Button variant
- `color`: Button color
- `isIconOnly`: Whether to show only icon (default: true)
- `iconSize`: Custom icon size (default: 16)
- `ariaLabel`: Accessibility label
- `successMessage`: Custom success toast message
- `errorMessage`: Custom error toast message
- `className`: Additional CSS classes
- `children`: Custom button content

**`PDFDownloadButton`**
Specialized button for downloading PDFs with automatic naming.

**Props:**

- `fileUrl` (required): URL of the PDF to download
- `baseName` (required): Base name for the file (e.g., employee name)
- `prefix`: Prefix for the filename (default: "Document")
- All other props from `DownloadButton`

## Usage Examples

### Using the utility function directly

```typescript
import { downloadPDF } from "@/utils/downloadFile";

const handleDownload = async () => {
  try {
    await downloadPDF("http://example.com/file.pdf", "John Doe", "Signed_NDA");
    // File will be downloaded as: Signed_NDA_John_Doe.pdf
  } catch (error) {
    console.error("Download failed:", error);
  }
};
```

### Using DownloadButton component

```tsx
import DownloadButton from "@/components/common/DownloadButton";

<DownloadButton
  fileUrl="http://example.com/document.pdf"
  fileName="my-document.pdf"
  successMessage="Document downloaded!"
  errorMessage="Failed to download document"
/>;
```

### Using PDFDownloadButton component

```tsx
import { PDFDownloadButton } from "@/components/common/DownloadButton";

<PDFDownloadButton
  fileUrl="http://example.com/nda.pdf"
  baseName="John Doe"
  prefix="Signed_NDA"
  ariaLabel="Download signed NDA"
/>;
// Downloads as: Signed_NDA_John_Doe.pdf
```

### Using in a table with custom styling

```tsx
import { PDFDownloadButton } from "@/components/common/DownloadButton";

<PDFDownloadButton
  fileUrl={item.signed_pdf_path}
  baseName={item.employee_name}
  prefix="Signed_NDA"
  size="sm"
  variant="light"
  ariaLabel="Download Signed PDF"
/>;
```

### Using for non-PDF files

```tsx
import DownloadButton from "@/components/common/DownloadButton";

<DownloadButton
  fileUrl={doc.url}
  fileName={`${doc.name}.${doc.type.split("/")[1]}`}
  iconSize={18}
  ariaLabel={`Download ${doc.name}`}
/>;
```

## Features

- ✅ Prevents opening files in new tabs
- ✅ Works with CORS-enabled URLs
- ✅ Shows loading state during download
- ✅ Automatic toast notifications
- ✅ Customizable messages and styling
- ✅ TypeScript support
- ✅ Accessible (ARIA labels)
- ✅ Automatic cleanup of blob URLs
- ✅ Error handling

## Browser Compatibility

Works in all modern browsers that support:

- Fetch API
- Blob API
- URL.createObjectURL
- Download attribute on anchor tags
