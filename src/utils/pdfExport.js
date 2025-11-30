import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Export invoice as PDF
 * @param {string} elementId - ID of the HTML element to convert to PDF
 * @param {string} filename - Name of the PDF file
 */
export const exportToPDF = async (elementId, filename = 'invoice.pdf') => {
    try {
        const element = document.getElementById(elementId);
        if (!element) {
            throw new Error('Element not found');
        }

        // Hide print buttons before capturing
        const printButtons = element.querySelectorAll('.print-hidden');
        printButtons.forEach(btn => btn.style.display = 'none');

        // Capture the element as canvas
        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff'
        });

        // Show buttons again
        printButtons.forEach(btn => btn.style.display = '');

        // Calculate PDF dimensions
        const imgWidth = 210; // A4 width in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        // Create PDF
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgData = canvas.toDataURL('image/png');

        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save(filename);

        return true;
    } catch (error) {
        console.error('Error generating PDF:', error);
        return false;
    }
};

/**
 * Print invoice
 */
export const printInvoice = () => {
    window.print();
};
