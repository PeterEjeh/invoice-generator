import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { generateInvoiceNumber, calculateDueDate } from '../utils/invoiceCalculations';

const InvoiceContext = createContext();

export const useInvoice = () => {
    const context = useContext(InvoiceContext);
    if (!context) {
        throw new Error('useInvoice must be used within InvoiceProvider');
    }
    return context;
};

// Helper function to convert snake_case to camelCase
const toCamelCase = (obj) => {
    if (!obj) return obj;
    if (Array.isArray(obj)) return obj.map(toCamelCase);
    if (typeof obj !== 'object') return obj;

    const camelObj = {};
    for (const key in obj) {
        const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
        camelObj[camelKey] = typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])
            ? toCamelCase(obj[key])
            : obj[key];
    }
    return camelObj;
};

export const InvoiceProvider = ({ children }) => {
    const { user, loading: authLoading } = useAuth();
    const [invoices, setInvoices] = useState([]);
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load data when user is authenticated
    useEffect(() => {
        if (!authLoading) {
            if (user) {
                loadInvoices();
                loadSettings();
            } else {
                setInvoices([]);
                setSettings(null);
                setLoading(false);
            }
        }
    }, [user, authLoading]);

    // Load invoices from Supabase
    const loadInvoices = async () => {
        try {
            const { data, error } = await supabase
                .from('invoices')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            // Convert snake_case to camelCase for application use
            const camelCaseInvoices = data ? data.map(toCamelCase) : [];
            setInvoices(camelCaseInvoices);
        } catch (error) {
            console.error('Error loading invoices:', error);
        } finally {
            setLoading(false);
        }
    };

    // Load settings from Supabase
    const loadSettings = async () => {
        try {
            const { data, error } = await supabase
                .from('settings')
                .select('*')
                .single();

            if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
                throw error;
            }

            if (data) {
                setSettings(toCamelCase(data));
            } else {
                // Create default settings if none exist
                const defaultSettings = {
                    user_id: user.id,
                    company_name: "Pete's Technologies",
                    address: "123 Tech Street",
                    city: "Lagos",
                    state: "Lagos State",
                    postal_code: "100001",
                    country: "Nigeria",
                    email: "info@petestech.com",
                    phone: "+234 800 000 0000",
                    bank_name: "First Bank of Nigeria",
                    account_name: "Pete's Technologies Ltd",
                    account_number: "0123456789",
                    sort_code: "",
                    invoice_prefix: "PT"
                };

                const { data: newSettings, error: insertError } = await supabase
                    .from('settings')
                    .insert([defaultSettings])
                    .select()
                    .single();

                if (insertError) throw insertError;
                setSettings(toCamelCase(newSettings));
            }
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    };

    // Create new invoice
    const createInvoice = async (invoiceData) => {
        try {
            const newInvoice = {
                user_id: user.id,
                invoice_number: generateInvoiceNumber(settings?.invoicePrefix || 'PT'),
                client_name: invoiceData.clientName,
                client_email: invoiceData.clientEmail,
                client_phone: invoiceData.clientPhone,
                client_address: invoiceData.clientAddress,
                items: invoiceData.items,
                total: invoiceData.total,
                discount_type: invoiceData.discountType || 'none',
                discount_value: invoiceData.discountValue || 0,
                vat: invoiceData.vat || 0,
                payment_terms: invoiceData.paymentTerms,
                notes: invoiceData.notes,
                template: invoiceData.template,
                created_at: new Date().toISOString(),
                due_date: calculateDueDate(new Date().toISOString(), invoiceData.paymentTerms || 14),
                status: 'pending'
            };

            const { data, error } = await supabase
                .from('invoices')
                .insert([newInvoice])
                .select()
                .single();

            if (error) throw error;

            const camelCaseInvoice = toCamelCase(data);
            setInvoices(prev => [camelCaseInvoice, ...prev]);
            return camelCaseInvoice;
        } catch (error) {
            console.error('Error creating invoice:', error);
            throw error;
        }
    };

    // Update invoice
    const updateInvoice = async (id, updates) => {
        try {
            const dbUpdates = {
                client_name: updates.clientName,
                client_email: updates.clientEmail,
                client_phone: updates.clientPhone,
                client_address: updates.clientAddress,
                items: updates.items,
                total: updates.total,
                discount_type: updates.discountType,
                discount_value: updates.discountValue,
                vat: updates.vat,
                payment_terms: updates.paymentTerms,
                notes: updates.notes,
                template: updates.template,
                status: updates.status,
                updated_at: new Date().toISOString()
            };

            // Recalculate due date if payment terms changed
            if (updates.paymentTerms !== undefined) {
                const invoice = invoices.find(inv => inv.id === id);
                if (invoice) {
                    dbUpdates.due_date = calculateDueDate(
                        invoice.createdAt,
                        updates.paymentTerms
                    );
                }
            }

            const { data, error } = await supabase
                .from('invoices')
                .update(dbUpdates)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;

            const camelCaseInvoice = toCamelCase(data);
            setInvoices(prev =>
                prev.map(inv => (inv.id === id ? camelCaseInvoice : inv))
            );
        } catch (error) {
            console.error('Error updating invoice:', error);
            throw error;
        }
    };

    // Delete invoice
    const deleteInvoice = async (id) => {
        try {
            const { error } = await supabase
                .from('invoices')
                .delete()
                .eq('id', id);

            if (error) throw error;

            setInvoices(prev => prev.filter(inv => inv.id !== id));
        } catch (error) {
            console.error('Error deleting invoice:', error);
            throw error;
        }
    };

    // Get invoice by ID
    const getInvoice = (id) => {
        return invoices.find(inv => inv.id === id);
    };

    // Update settings
    const updateSettings = async (newSettings) => {
        try {
            const dbSettings = {
                company_name: newSettings.companyName || newSettings.company_name,
                address: newSettings.address,
                city: newSettings.city,
                state: newSettings.state,
                postal_code: newSettings.postalCode || newSettings.postal_code,
                country: newSettings.country,
                email: newSettings.email,
                phone: newSettings.phone,
                bank_name: newSettings.bankName || newSettings.bank_name,
                account_name: newSettings.accountName || newSettings.account_name,
                account_number: newSettings.accountNumber || newSettings.account_number,
                sort_code: newSettings.sortCode || newSettings.sort_code,
                invoice_prefix: newSettings.invoicePrefix || newSettings.invoice_prefix,
                updated_at: new Date().toISOString()
            };

            const { data, error } = await supabase
                .from('settings')
                .update(dbSettings)
                .eq('user_id', user.id)
                .select()
                .single();

            if (error) throw error;

            setSettings(toCamelCase(data));
        } catch (error) {
            console.error('Error updating settings:', error);
            throw error;
        }
    };

    const value = {
        invoices,
        settings,
        loading,
        createInvoice,
        updateInvoice,
        deleteInvoice,
        getInvoice,
        updateSettings
    };

    return (
        <InvoiceContext.Provider value={value}>
            {children}
        </InvoiceContext.Provider>
    );
};
