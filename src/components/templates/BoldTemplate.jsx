import React from 'react';
import { formatCurrency, formatDate } from '../../utils/invoiceCalculations';
import { calculateSubtotal, calculateDiscount, calculateVAT } from '../../utils/invoiceCalculations';

export default function BoldTemplate({ invoice, settings }) {
    const primaryColor = settings?.primaryColor || '#000000';
    const fontFamily = settings?.fontFamily || 'Inter';

    const subtotal = calculateSubtotal(invoice.items);
    const discountAmt = calculateDiscount(subtotal, invoice.discountType, invoice.discountValue);
    const vatAmt = calculateVAT(subtotal - discountAmt, invoice.vat);

    return (
        <div className="bg-white min-h-[1056px] flex flex-col" style={{ fontFamily }}>

            {/* ── HEADER BLOCK ─────────────────────────────────────── */}
            <div className="p-12 text-white" style={{ backgroundColor: primaryColor }}>
                <div className="flex justify-between items-start">
                    <div>
                        {settings?.logoUrl ? (
                            <img
                                src={settings.logoUrl}
                                alt="Company Logo"
                                className="h-24 w-auto object-contain mb-6 bg-white p-2 rounded-lg"
                            />
                        ) : (
                            <h1 className="text-5xl font-black mb-6 tracking-tight">{settings?.companyName}</h1>
                        )}
                        <div className="text-white/90 space-y-1 font-medium text-sm">
                            <p>{settings?.address}</p>
                            <p>{settings?.city}, {settings?.state} {settings?.postalCode}</p>
                            <p>{settings?.country}</p>
                            <p>{settings?.email}</p>
                            <p>{settings?.phone}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <h2 className="text-[6rem] leading-none font-black opacity-20">INV</h2>
                        <div className="mt-[-2rem] relative z-10">
                            <p className="text-xl font-bold opacity-80">INVOICE NUMBER</p>
                            <p className="text-4xl font-bold">{invoice.invoiceNumber}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── INFO BAR ─────────────────────────────────────────── */}
            <div className="bg-gray-900 text-white px-12 py-5 flex justify-between items-center">
                <div className="flex gap-12">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Date Issued</p>
                        <p className="text-base font-bold">{formatDate(invoice.createdAt)}</p>
                    </div>
                    {invoice.dueDate && (
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Due Date</p>
                            <p className="text-base font-bold">{formatDate(invoice.dueDate)}</p>
                        </div>
                    )}
                </div>
                <div className="text-right">
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Amount</p>
                    <p className="text-2xl font-black">{formatCurrency(invoice.total)}</p>
                </div>
            </div>

            {/* ── BODY ─────────────────────────────────────────────── */}
            <div className="p-12 flex-grow flex flex-col">

                {/* ── BILL TO ──────────────────────────────────────── */}
                <div className="mb-12">
                    <h3
                        className="text-sm font-black uppercase tracking-widest mb-4 border-b-4 pb-2 inline-block"
                        style={{ borderColor: primaryColor, color: primaryColor }}
                    >
                        Bill To
                    </h3>
                    <div className="text-gray-800">
                        <p className="text-3xl font-bold mb-2">{invoice.clientName}</p>
                        <div className="text-base text-gray-600 space-y-1">
                            {invoice.clientAddress && <p>{invoice.clientAddress}</p>}
                            {invoice.clientEmail && <p>{invoice.clientEmail}</p>}
                            {invoice.clientPhone && <p>{invoice.clientPhone}</p>}
                        </div>
                    </div>
                </div>

                {/* ── LINE ITEMS ───────────────────────────────────── */}
                <div className="flex-grow mb-12">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b-4 border-gray-900">
                                <th className="text-left py-4 text-sm font-black uppercase tracking-wider">Description</th>
                                <th className="text-center py-4 text-sm font-black uppercase tracking-wider">Qty</th>
                                <th className="text-right py-4 text-sm font-black uppercase tracking-wider">Rate</th>
                                <th className="text-right py-4 text-sm font-black uppercase tracking-wider">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoice.items?.map((item, index) => (
                                <tr key={index} className="border-b border-gray-200 print-no-break">
                                    <td className="py-5 text-base font-medium text-gray-900">{item.description}</td>
                                    <td className="text-center py-5 text-base text-gray-600">{item.quantity}</td>
                                    <td className="text-right py-5 text-base text-gray-600">{formatCurrency(item.rate)}</td>
                                    <td className="text-right py-5 text-base font-bold text-gray-900">
                                        {formatCurrency(item.quantity * item.rate)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* ── TOTALS ───────────────────────────────────────── */}
                <div className="flex justify-end mb-12">
                    <div className="w-80 space-y-3 text-base">
                        <div className="flex justify-between text-gray-700">
                            <span>Subtotal:</span>
                            <span className="font-bold">{formatCurrency(subtotal)}</span>
                        </div>

                        {invoice.discountType && invoice.discountType !== 'none' && (
                            <div className="flex justify-between text-red-600">
                                <span>
                                    Discount {invoice.discountType === 'percentage' ? `(${invoice.discountValue}%)` : ''}:
                                </span>
                                <span className="font-bold">-{formatCurrency(discountAmt)}</span>
                            </div>
                        )}

                        {invoice.vat > 0 && (
                            <div className="flex justify-between text-gray-700">
                                <span>VAT ({invoice.vat}%):</span>
                                <span className="font-bold">{formatCurrency(vatAmt)}</span>
                            </div>
                        )}

                        <div className="pt-4 border-t-4 border-gray-900">
                            <div className="inline-block bg-gray-900 text-white p-6 rounded-xl shadow-2xl w-full">
                                <p className="text-xs font-bold uppercase tracking-wider opacity-70 mb-1">Total Due</p>
                                <p className="text-4xl font-black">{formatCurrency(invoice.total)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── PAYMENT INFORMATION ──────────────────────────── */}
                {settings?.bankName && (
                    <div className="mb-8 pt-8 border-t-4 border-gray-900">
                        <h4 className="font-bold text-gray-900 mb-4 uppercase tracking-wider">Payment Details</h4>
                        <div className="bg-gray-100 p-6 rounded-lg grid grid-cols-2 gap-4 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Bank Name</span>
                                <span className="font-bold">{settings.bankName}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Account Name</span>
                                <span className="font-bold">{settings.accountName}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Account Number</span>
                                <span className="font-bold">{settings.accountNumber}</span>
                            </div>
                            {settings.sortCode && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Sort Code</span>
                                    <span className="font-bold">{settings.sortCode}</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ── NOTES ────────────────────────────────────────── */}
                {invoice.notes && (
                    <div className="mb-8 pt-8 border-t border-gray-200">
                        <h4 className="font-bold text-gray-900 mb-3 uppercase tracking-wider">Notes</h4>
                        <div className="text-gray-600 text-sm whitespace-pre-wrap">{invoice.notes}</div>
                    </div>
                )}

            </div>

            {/* ── FOOTER ───────────────────────────────────────────── */}
            <div
                className="px-12 py-4 text-center text-xs font-medium tracking-wider text-white/80"
                style={{ backgroundColor: primaryColor }}
            >
                <p>Thank you for your business!</p>
            </div>

        </div>
    );
}
