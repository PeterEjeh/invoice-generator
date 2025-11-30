// Local storage keys
const INVOICES_KEY = 'petes_invoices';
const SETTINGS_KEY = 'petes_settings';

// Get all invoices from local storage
export const getInvoices = () => {
    try {
        const data = localStorage.getItem(INVOICES_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error loading invoices:', error);
        return [];
    }
};

// Save invoices to local storage
export const saveInvoices = (invoices) => {
    try {
        localStorage.setItem(INVOICES_KEY, JSON.stringify(invoices));
        return true;
    } catch (error) {
        console.error('Error saving invoices:', error);
        return false;
    }
};

// Get single invoice by ID
export const getInvoiceById = (id) => {
    const invoices = getInvoices();
    return invoices.find(inv => inv.id === id);
};

// Get company settings
export const getSettings = () => {
    try {
        const data = localStorage.getItem(SETTINGS_KEY);
        return data ? JSON.parse(data) : getDefaultSettings();
    } catch (error) {
        console.error('Error loading settings:', error);
        return getDefaultSettings();
    }
};

// Save company settings
export const saveSettings = (settings) => {
    try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
        return true;
    } catch (error) {
        console.error('Error saving settings:', error);
        return false;
    }
};

// Default company settings
const getDefaultSettings = () => ({
    companyName: "Pete's Technologies",
    address: "123 Tech Street",
    city: "Lagos",
    state: "Lagos State",
    postalCode: "100001",
    country: "Nigeria",
    email: "info@petestech.com",
    phone: "+234 800 000 0000",
    bankName: "First Bank of Nigeria",
    accountName: "Pete's Technologies Ltd",
    accountNumber: "0123456789",
    sortCode: "",
    invoicePrefix: "PT",
    logo: null
});
