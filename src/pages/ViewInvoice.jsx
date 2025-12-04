import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useInvoice } from '../context/InvoiceContext';
import { Download, Printer, Edit, ArrowLeft } from 'lucide-react';
import ModernTemplate from '../components/templates/ModernTemplate';
import ClassicTemplate from '../components/templates/ClassicTemplate';
import MinimalTemplate from '../components/templates/MinimalTemplate';
import BoldTemplate from '../components/templates/BoldTemplate';
import ElegantTemplate from '../components/templates/ElegantTemplate';
import PaymentStatusBadge from '../components/PaymentStatusBadge';
import { exportToPDF, printInvoice } from '../utils/pdfExport';
import { getPaymentStatus } from '../utils/invoiceCalculations';

export default function ViewInvoice() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getInvoice, settings } = useInvoice();
    const invoice = getInvoice(id);

    // Set document title for printing
    React.useEffect(() => {
        if (invoice) {
            document.title = `Invoice ${invoice.invoiceNumber}`;
        }
        return () => {
            document.title = "Pete's Technologies - Invoice Manager";
        };
    }, [invoice]);

    if (!invoice) {
        return (
            <div className="p-8 text-center">
                <p className="text-gray-600 mb-4">Invoice not found</p>
                <button
                    onClick={() => navigate('/')}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    Back to Dashboard
                </button>
            </div>
        );
    }

    const handleExportPDF = async () => {
        const success = await exportToPDF(
            'invoice-content',
            `${invoice.invoiceNumber}.pdf`
        );
        if (!success) {
            alert('Failed to generate PDF. Please try again.');
        }
    };

    const handlePrint = () => {
        printInvoice();
    };

    // Select template component
    const TemplateComponent = {
        modern: ModernTemplate,
        classic: ClassicTemplate,
        minimal: MinimalTemplate,
        bold: BoldTemplate,
        elegant: ElegantTemplate
    }[invoice.template] || ModernTemplate;

    const status = getPaymentStatus(invoice);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Action Bar */}
            <div className="bg-white border-b border-gray-200 print-hidden sticky top-0 z-10 shadow-sm">
                <div className="max-w-7xl mx-auto px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link
                                to="/"
                                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                <span>Back to Dashboard</span>
                            </Link>
                            <div className="h-6 w-px bg-gray-300"></div>
                            <PaymentStatusBadge status={status} />
                        </div>

                        <div className="flex items-center gap-3">
                            <Link
                                to={`/edit/${id}`}
                                className="flex items-center gap-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <Edit className="w-4 h-4" />
                                Edit
                            </Link>
                            <button
                                onClick={handlePrint}
                                className="flex items-center gap-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <Printer className="w-4 h-4" />
                                Print
                            </button>
                            <button
                                onClick={handleExportPDF}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <Download className="w-4 h-4" />
                                Download PDF
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Invoice Content */}
            <div className="max-w-5xl mx-auto p-8">
                <div id="invoice-content" className="shadow-lg">
                    <TemplateComponent invoice={invoice} settings={settings} />
                </div>
            </div>
        </div>
    );
}
