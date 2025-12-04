import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * Export an element to PDF
 * @param {string} elementId - The ID of the element to export
 * @param {string} filename - The name of the PDF file
 * @returns {Promise<boolean>} - Success status
 */
export async function exportToPDF(elementId, filename) {
    try {
        const element = document.getElementById(elementId);
        if (!element) {
            console.error(`Element with ID "${elementId}" not found`);
            return false;
        }

        // Use html2canvas to capture the element
        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff'
        });

        // Calculate dimensions for A4 page
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 297; // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        const pdf = new jsPDF('p', 'mm', 'a4');
        let heightLeft = imgHeight;
        let position = 0;

        // Add first page
        pdf.addImage(
            canvas.toDataURL('image/png'),
            'PNG',
            0,
            position,
            imgWidth,
            imgHeight
        );
        heightLeft -= pageHeight;

        // Add additional pages if content is longer than one page
        while (heightLeft > 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(
                canvas.toDataURL('image/png'),
                'PNG',
                0,
                position,
                imgWidth,
                imgHeight
            );
            heightLeft -= pageHeight;
        }

        // Save the PDF
        pdf.save(filename);
        return true;
    } catch (error) {
        console.error('Error generating PDF:', error);
        return false;
    }
}

/**
 * Print the invoice using the browser's print dialog
 */
export function printInvoice() {
    window.print();
}
