/**
 * Utility for exporting data to Excel (XLSX) format
 */

/**
 * Exports data to an Excel file and triggers download in the browser
 * 
 * @param headers - Array of column headers
 * @param data - 2D array of data (rows and columns)
 * @param filename - Name for the exported file (without extension)
 */
export const exportToExcel = (
  headers: string[],
  data: (string | number)[][],
  filename: string
): void => {
  // Create CSV content
  const csvContent = [
    headers.join(','), // Header row
    ...data.map(row => 
      row.map(cell => 
        // Escape quotes and wrap in quotes if needed
        typeof cell === 'string' && (cell.includes(',') || cell.includes('"') || cell.includes('\n'))
          ? `"${cell.replace(/"/g, '""')}"`
          : String(cell)
      ).join(',')
    )
  ].join('\n');
  
  // Create a Blob with the CSV data
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
  // Create download link
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  
  // Append to document, click to download, then remove
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Format date for export (YYYY-MM-DD)
 */
export const formatDateForExport = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

/**
 * Generate Excel-friendly timestamp for filenames
 */
export const getExportTimestamp = (): string => {
  const now = new Date();
  return now.toISOString()
    .replace(/[-:]/g, '')
    .replace('T', '_')
    .split('.')[0];
}; 