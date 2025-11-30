import { format } from 'date-fns';

// Format currency in Nigerian Naira
export const formatCurrency = (amount) => {
    return `₦${Number(amount).toLocaleString('en-NG', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
};

// Calculate subtotal from line items
export const calculateSubtotal = (items) => {
    return items.reduce((sum, item) => {
        const quantity = Number(item.quantity) || 0;
        const rate = Number(item.rate) || 0;
        return sum + (quantity * rate);
    }, 0);
};

// Calculate total (currently same as subtotal since no tax)
export const calculateTotal = (items) => {
    return calculateSubtotal(items);
};

// Generate invoice number
export const generateInvoiceNumber = (prefix = 'PT') => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
    return `${prefix}-${timestamp}${random}`;
};

// Format date
export const formatDate = (date) => {
    return format(new Date(date), 'dd/MM/yyyy');
};

// Calculate due date
export const calculateDueDate = (invoiceDate, paymentTerms = 14) => {
    const date = new Date(invoiceDate);
    date.setDate(date.getDate() + paymentTerms);
    return date.toISOString();
};

// Check if invoice is overdue
export const isOverdue = (dueDate, status) => {
    if (status === 'paid') return false;
    return new Date(dueDate) < new Date();
};

// Get payment status with overdue check
export const getPaymentStatus = (invoice) => {
    if (invoice.status === 'paid') return 'paid';
    if (isOverdue(invoice.dueDate, invoice.status)) return 'overdue';
    return 'pending';
};
