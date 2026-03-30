import React from 'react';
import { formatCurrency, formatDate } from '../../utils/invoiceCalculations';
import { calculateSubtotal, calculateDiscount, calculateVAT } from '../../utils/invoiceCalculations';

export default function MinimalTemplate({ invoice, settings }) {
    const subtotal = calculateSubtotal(invoice.items);
    const discountAmt = calculateDiscount(subtotal, invoice.discountType, invoice.discountValue);
    const vatAmt = calculateVAT(subtotal - discountAmt, invoice.vat);

    return (
        <div className="bg-white min-h-[1056px] p-12 flex flex-col">

            {/* ── HEADER ───────────────────────────────────────────── */}
            <div className="flex justify-between items-start mb-10 pb-6 border-b border-gray-200">
                <div>
                    <h1 className="text-2xl font-light text-gray-900 mb-1">{settings?.companyName}</h1>
                    <div className="text-xs text-gray-500 space-y-0.5">
                        <p>{settings?.address}</p>
                        <p>{settings?.city}, {settings?.state} {settings?.postalCode}</p>
                        {(settings?.email || settings?.phone) && (
                            <p>{settings?.email}{settings?.email && settings?.phone ? ' • ' : ''}{settings?.phone}</p>
                        )}
                    </div>
                </div>
                <div className="text-right">
                    <h2 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Invoice</h2>
                    <p className="text-2xl font-light text-gray-900">{invoice.invoiceNumber}</p>
                </div>
            </div>

            {/* ── BILL TO / DATES ──────────────────────────────────── */}
            <div className="grid grid-cols-2 gap-8 mb-10">
                <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Billed To</p>
                    <p className="font-medium text-gray-900">{invoice.clientName}</p>
                    {invoice.clientAddress && <p className="text-sm text-gray-600">{invoice.clientAddress}</p>}
                    {invoice.clientEmail && <p className="text-sm text-gray-600">{invoice.clientEmail}</p>}
                    {invoice.clientPhone && <p className="text-sm text-gray-600">{invoice.clientPhone}</p>}
                </div>
                <div className="text-right">
                    <div className="space-y-1 text-sm">
                        <div className="flex justify-end gap-6">
                            <span className="text-gray-500">Issue Date:</span>
                            <span className="text-gray-900">{formatDate(invoice.createdAt)}</span>
                        </div>
                        {invoice.dueDate && (
                            <div className="flex justify-end gap-6">
                                <span className="text-gray-500">Due Date:</span>
                                <span className="text-gray-900">{formatDate(invoice.dueDate)}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── LINE ITEMS ───────────────────────────────────────── */}
            <div className="flex-grow mb-8">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-200">
                            <th className="text-left py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                            <th className="text-center py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                            <th className="text-right py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
                            <th className="text-right py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoice.items?.map((item, index) => (
                            <tr key={index} className="border-b border-gray-100 print-no-break">
                                <td className="py-4 text-sm text-gray-900">{item.description}</td>
                                <td className="text-center py-4 text-sm text-gray-600">{item.quantity}</td>
                                <td className="text-right py-4 text-sm text-gray-600">{formatCurrency(item.rate)}</td>
                                <td className="text-right py-4 text-sm text-gray-900 font-medium">
                                    {formatCurrency(item.quantity * item.rate)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ── TOTALS ───────────────────────────────────────────── */}
            <div className="flex justify-end mb-8">
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

                    <div className="flex justify-between items-center py-3 border-t border-gray-900">
                        <span className="text-sm font-medium text-gray-900">Total Due:</span>
                        <span className="text-2xl font-light text-gray-900">{formatCurrency(invoice.total)}</span>
                    </div>
                </div>
            </div>

            {/* ── PAYMENT INFORMATION ──────────────────────────────── */}
            {settings?.bankName && (
                <div className="mb-6 pt-6 border-t border-gray-200">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Payment Details</p>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-500">Bank:</span>
                            <span className="text-gray-900">{settings.bankName}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Account Name:</span>
                            <span className="text-gray-900">{settings.accountName}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Account No:</span>
                            <span className="text-gray-900">{settings.accountNumber}</span>
                        </div>
                        {settings.sortCode && (
                            <div className="flex justify-between">
                                <span className="text-gray-500">Sort Code:</span>
                                <span className="text-gray-900">{settings.sortCode}</span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ── NOTES ────────────────────────────────────────────── */}
            {invoice.notes && (
                <div className="mb-6 pt-6 border-t border-gray-200">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Notes</p>
                    <p className="text-sm text-gray-600 whitespace-pre-wrap">{invoice.notes}</p>
                </div>
            )}

            {/* ── FOOTER ───────────────────────────────────────────── */}
            <div className="mt-auto pt-4 border-t border-gray-200 text-center text-xs text-gray-400">
                <p>Thank you for your business!</p>
            </div>

        </div>
    );
}
