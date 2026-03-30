import React from 'react';
import { FileText, Mail, Phone, Building } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/invoiceCalculations';
import { calculateSubtotal, calculateDiscount, calculateVAT } from '../../utils/invoiceCalculations';

export default function ModernTemplate({ invoice, settings }) {
    const subtotal = calculateSubtotal(invoice.items);
    const discountAmt = calculateDiscount(subtotal, invoice.discountType, invoice.discountValue);
    const vatAmt = calculateVAT(subtotal - discountAmt, invoice.vat);

    return (
        <div className="bg-white min-h-[1056px] flex flex-col">

            {/* ── HEADER ───────────────────────────────────────────── */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">INVOICE</h1>
                        <p className="text-blue-100 text-sm">Invoice #: {invoice.invoiceNumber}</p>
                        <p className="text-blue-100 text-sm">Date: {formatDate(invoice.createdAt)}</p>
                        {invoice.dueDate && (
                            <p className="text-blue-100 text-sm">Due: {formatDate(invoice.dueDate)}</p>
                        )}
                    </div>
                    <FileText className="w-16 h-16 opacity-80" />
                </div>
            </div>

            {/* ── FROM / BILL TO ───────────────────────────────────── */}
            <div className="grid md:grid-cols-2 gap-8 p-8 border-b">
                <div>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">From</h3>
                    <div className="space-y-1">
                        <p className="font-semibold text-lg">{settings?.companyName}</p>
                        <p className="text-gray-600 text-sm">{settings?.address}</p>
                        <p className="text-gray-600 text-sm">{settings?.city}, {settings?.state} {settings?.postalCode}</p>
                        <p className="text-gray-600 text-sm">{settings?.country}</p>
                        {settings?.email && (
                            <div className="flex items-center gap-2 text-gray-600 mt-2">
                                <Mail className="w-4 h-4" />
                                <span className="text-sm">{settings.email}</span>
                            </div>
                        )}
                        {settings?.phone && (
                            <div className="flex items-center gap-2 text-gray-600">
                                <Phone className="w-4 h-4" />
                                <span className="text-sm">{settings.phone}</span>
                            </div>
                        )}
                    </div>
                </div>

                <div>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Bill To</h3>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Building className="w-5 h-5 text-blue-600" />
                            <p className="font-semibold text-lg">{invoice.clientName}</p>
                        </div>
                        {invoice.clientAddress && (
                            <p className="text-gray-600 text-sm">{invoice.clientAddress}</p>
                        )}
                        {invoice.clientEmail && (
                            <div className="flex items-center gap-2 text-gray-600">
                                <Mail className="w-4 h-4" />
                                <span className="text-sm">{invoice.clientEmail}</span>
                            </div>
                        )}
                        {invoice.clientPhone && (
                            <div className="flex items-center gap-2 text-gray-600">
                                <Phone className="w-4 h-4" />
                                <span className="text-sm">{invoice.clientPhone}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── LINE ITEMS ───────────────────────────────────────── */}
            <div className="p-8 flex-grow">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Service Details</h3>
                <table className="w-full">
                    <thead>
                        <tr className="border-b-2 border-gray-300">
                            <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">Description</th>
                            <th className="text-center py-3 px-4 text-gray-600 font-semibold text-sm">Qty</th>
                            <th className="text-right py-3 px-4 text-gray-600 font-semibold text-sm">Rate</th>
                            <th className="text-right py-3 px-4 text-gray-600 font-semibold text-sm">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoice.items?.map((item, index) => (
                            <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 print-no-break">
                                <td className="py-3 px-4 text-sm">{item.description}</td>
                                <td className="text-center py-3 px-4 text-sm">{item.quantity}</td>
                                <td className="text-right py-3 px-4 text-sm">{formatCurrency(item.rate)}</td>
                                <td className="text-right py-3 px-4 font-medium text-sm">
                                    {formatCurrency(item.quantity * item.rate)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ── TOTALS ───────────────────────────────────────────── */}
            <div className="px-8 pb-8 flex justify-end">
                <div className="w-64 space-y-2">
                    <div className="flex justify-between text-gray-700 text-sm">
                        <span>Subtotal:</span>
                        <span className="font-medium">{formatCurrency(subtotal)}</span>
                    </div>

                    {invoice.discountType && invoice.discountType !== 'none' && (
                        <div className="flex justify-between text-red-600 text-sm">
                            <span>
                                Discount {invoice.discountType === 'percentage' ? `(${invoice.discountValue}%)` : ''}:
                            </span>
                            <span className="font-medium">-{formatCurrency(discountAmt)}</span>
                        </div>
                    )}

                    {invoice.vat > 0 && (
                        <div className="flex justify-between text-gray-700 text-sm">
                            <span>VAT ({invoice.vat}%):</span>
                            <span className="font-medium">{formatCurrency(vatAmt)}</span>
                        </div>
                    )}

                    <div className="flex justify-between items-center py-2 border-t-2 border-gray-300">
                        <span className="text-gray-800 font-bold text-lg">Total Due:</span>
                        <span className="text-2xl font-bold text-blue-600">{formatCurrency(invoice.total)}</span>
                    </div>
                </div>
            </div>

            {/* ── PAYMENT INFORMATION ──────────────────────────────── */}
            {settings?.bankName && (
                <div className="bg-blue-50 px-8 py-6 border-t">
                    <h3 className="text-sm font-semibold text-gray-800 mb-4">Payment Information</h3>
                    <div className="bg-white p-5 rounded-lg shadow-sm">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Bank Name</p>
                                <p className="font-semibold text-gray-800 text-sm">{settings.bankName}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Account Name</p>
                                <p className="font-semibold text-gray-800 text-sm">{settings.accountName}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Account Number</p>
                                <p className="font-semibold text-gray-800 text-sm">{settings.accountNumber}</p>
                            </div>
                            {settings.sortCode && (
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Sort Code</p>
                                    <p className="font-semibold text-gray-800 text-sm">{settings.sortCode}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ── NOTES ────────────────────────────────────────────── */}
            {invoice.notes && (
                <div className="px-8 py-6 bg-gray-50 border-t">
                    <h3 className="text-sm font-semibold text-gray-800 mb-2">Notes</h3>
                    <p className="text-sm text-gray-600 whitespace-pre-wrap">{invoice.notes}</p>
                </div>
            )}

            {/* ── FOOTER ───────────────────────────────────────────── */}
            <div className="mt-auto text-center text-xs text-gray-500 border-t border-gray-200 py-4 px-8">
                <p>Thank you for your business!</p>
            </div>

        </div>
    );
}
