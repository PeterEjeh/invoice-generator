import React from 'react';
import { formatCurrency, formatDate } from '../../utils/invoiceCalculations';
import { calculateSubtotal, calculateDiscount, calculateVAT } from '../../utils/invoiceCalculations';

export default function ElegantTemplate({ invoice, settings }) {
    const primaryColor = settings?.primaryColor || '#000000';
    const fontFamily = settings?.fontFamily || 'Georgia';

    const subtotal = calculateSubtotal(invoice.items);
    const discountAmt = calculateDiscount(subtotal, invoice.discountType, invoice.discountValue);
    const vatAmt = calculateVAT(subtotal - discountAmt, invoice.vat);

    return (
        <div className="bg-white min-h-[1056px] p-16 flex flex-col" style={{ fontFamily }}>

            {/* ── HEADER (centered branding) ───────────────────────── */}
            <div className="text-center mb-12">
                {settings?.logoUrl && (
                    <img
                        src={settings.logoUrl}
                        alt="Company Logo"
                        className="h-24 w-auto object-contain mx-auto mb-6"
                    />
                )}
                <h1 className="text-3xl font-serif tracking-widest uppercase text-gray-900 mb-3">
                    {settings?.companyName}
                </h1>
                <div className="flex justify-center gap-3 text-xs text-gray-500 uppercase tracking-wider">
                    <span>{settings?.city}</span>
                    <span>•</span>
                    <span>{settings?.country}</span>
                    <span>•</span>
                    <span>{settings?.email}</span>
                </div>
            </div>

            {/* ── DIVIDER ──────────────────────────────────────────── */}
            <div className="flex items-center justify-center mb-12">
                <div className="h-px w-16 bg-gray-300"></div>
                <span className="mx-4 text-gray-400 italic font-serif">Invoice</span>
                <div className="h-px w-16 bg-gray-300"></div>
            </div>

            {/* ── BILL TO / META ───────────────────────────────────── */}
            <div className="flex justify-between items-end mb-12">
                <div className="text-left">
                    <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">Billed To</p>
                    <h2 className="text-2xl font-serif text-gray-900 mb-2">{invoice.clientName}</h2>
                    <div className="text-gray-600 text-sm leading-relaxed">
                        {invoice.clientAddress && <p>{invoice.clientAddress}</p>}
                        {invoice.clientEmail && <p>{invoice.clientEmail}</p>}
                        {invoice.clientPhone && <p>{invoice.clientPhone}</p>}
                    </div>
                </div>
                <div className="text-right space-y-1">
                    <p className="text-sm">
                        <span className="text-gray-400 uppercase tracking-widest w-24 inline-block">No.</span>
                        <span className="font-medium text-gray-900">{invoice.invoiceNumber}</span>
                    </p>
                    <p className="text-sm">
                        <span className="text-gray-400 uppercase tracking-widest w-24 inline-block">Date</span>
                        <span className="font-medium text-gray-900">{formatDate(invoice.createdAt)}</span>
                    </p>
                    {invoice.dueDate && (
                        <p className="text-sm">
                            <span className="text-gray-400 uppercase tracking-widest w-24 inline-block">Due</span>
                            <span className="font-medium text-gray-900">{formatDate(invoice.dueDate)}</span>
                        </p>
                    )}
                </div>
            </div>

            {/* ── LINE ITEMS ───────────────────────────────────────── */}
            <div className="flex-grow mb-12">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-200">
                            <th className="text-left py-4 text-xs font-medium text-gray-400 uppercase tracking-widest">Description</th>
                            <th className="text-center py-4 text-xs font-medium text-gray-400 uppercase tracking-widest">Qty</th>
                            <th className="text-right py-4 text-xs font-medium text-gray-400 uppercase tracking-widest">Rate</th>
                            <th className="text-right py-4 text-xs font-medium text-gray-400 uppercase tracking-widest">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoice.items?.map((item, index) => (
                            <tr key={index} className="border-b border-gray-100 print-no-break">
                                <td className="py-6 text-gray-800 font-serif">{item.description}</td>
                                <td className="text-center py-6 text-gray-500 text-sm">{item.quantity}</td>
                                <td className="text-right py-6 text-gray-500 text-sm">{formatCurrency(item.rate)}</td>
                                <td className="text-right py-6 text-gray-800 font-medium">
                                    {formatCurrency(item.quantity * item.rate)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ── TOTALS ───────────────────────────────────────────── */}
            <div className="flex justify-end mb-12">
                <div className="w-80 space-y-2">
                    <div className="flex justify-between text-gray-600">
                        <span className="text-sm uppercase tracking-widest">Subtotal</span>
                        <span className="font-medium">{formatCurrency(subtotal)}</span>
                    </div>

                    {invoice.discountType && invoice.discountType !== 'none' && (
                        <div className="flex justify-between text-red-600">
                            <span className="text-sm uppercase tracking-widest">
                                Discount {invoice.discountType === 'percentage' ? `(${invoice.discountValue}%)` : ''}
                            </span>
                            <span className="font-medium">-{formatCurrency(discountAmt)}</span>
                        </div>
                    )}

                    {invoice.vat > 0 && (
                        <div className="flex justify-between text-gray-600">
                            <span className="text-sm uppercase tracking-widest">VAT ({invoice.vat}%)</span>
                            <span className="font-medium">{formatCurrency(vatAmt)}</span>
                        </div>
                    )}

                    <div className="flex justify-between items-center py-4 border-t border-gray-200">
                        <span className="text-sm text-gray-500 uppercase tracking-widest">Total Due</span>
                        <span className="text-3xl font-serif" style={{ color: primaryColor }}>
                            {formatCurrency(invoice.total)}
                        </span>
                    </div>
                </div>
            </div>

            {/* ── PAYMENT INFORMATION ──────────────────────────────── */}
            {settings?.bankName && (
                <div className="mb-8 pt-8 border-t border-gray-100">
                    <p className="text-xs text-gray-400 uppercase tracking-widest mb-4">Payment Information</p>
                    <div className="grid grid-cols-2 gap-x-12 gap-y-2 text-sm text-gray-600">
                        <p><span className="w-24 inline-block text-gray-400">Bank</span> {settings.bankName}</p>
                        <p><span className="w-24 inline-block text-gray-400">Account</span> {settings.accountName}</p>
                        <p><span className="w-24 inline-block text-gray-400">Number</span> {settings.accountNumber}</p>
                        {settings.sortCode && (
                            <p><span className="w-24 inline-block text-gray-400">Sort Code</span> {settings.sortCode}</p>
                        )}
                    </div>
                </div>
            )}

            {/* ── NOTES ────────────────────────────────────────────── */}
            {invoice.notes && (
                <div className="mb-8 pt-8 border-t border-gray-100">
                    <p className="text-xs text-gray-400 uppercase tracking-widest mb-4">Notes</p>
                    <p className="text-sm text-gray-600 italic font-serif whitespace-pre-wrap">{invoice.notes}</p>
                </div>
            )}

            {/* ── FOOTER ───────────────────────────────────────────── */}
            <div className="mt-auto text-center pt-8 border-t border-gray-100">
                <p className="text-2xl font-serif italic text-gray-300">Thank You</p>
            </div>

        </div>
    );
}
