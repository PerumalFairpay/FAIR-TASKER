/**
 * Downloads a file from a URL by fetching it and creating a blob download
 * @param fileUrl - The URL of the file to download
 * @param fileName - The name to save the file as
 * @returns Promise that resolves when download is complete
 */
export async function downloadFile(
  fileUrl: string,
  fileName: string,
): Promise<void> {
  try {
    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error(`Failed to download file: ${response.statusText}`);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Download error:", error);
    throw error;
  }
}

/**
 * Downloads a PDF file with proper naming
 * @param pdfUrl - The URL of the PDF to download
 * @param baseName - The base name for the file (e.g., employee name)
 * @param prefix - Optional prefix for the filename (default: 'Document')
 * @returns Promise that resolves when download is complete
 */
export async function downloadPDF(
  pdfUrl: string,
  baseName: string,
  prefix: string = "Document",
): Promise<void> {
  const fileName = `${prefix}_${baseName.replace(/\s+/g, "_")}.pdf`;
  return downloadFile(pdfUrl, fileName);
}
