import React from 'react';
import { formatCurrency, formatDate } from '../../utils/invoiceCalculations';
import { calculateSubtotal, calculateDiscount } from '../../utils/invoiceCalculations';

export default function ElegantTemplate({ invoice, settings }) {
    const primaryColor = settings?.primaryColor || '#000000';
    const fontFamily = settings?.fontFamily || 'Georgia';

    return (
        <div className="bg-white min-h-[1000px] p-16" style={{ fontFamily }}>
            {/* Centered Header */}
            <div className="text-center mb-16">
                {settings?.logoUrl && (
                    <img
                        src={settings.logoUrl}
                        alt="Company Logo"
                        className="h-24 w-auto object-contain mx-auto mb-6"
                    />
                )}
                <h1 className="text-3xl font-serif tracking-widest uppercase text-gray-900 mb-4">{settings?.companyName}</h1>
                <div className="flex justify-center gap-4 text-sm text-gray-500 uppercase tracking-wider">
                    <span>{settings?.city}</span>
                    <span>•</span>
                    <span>{settings?.country}</span>
                    <span>•</span>
                    <span>{settings?.email}</span>
                </div>
            </div>

            {/* Divider */}
            <div className="flex items-center justify-center mb-16">
                <div className="h-px w-16 bg-gray-300"></div>
                <span className="mx-4 text-gray-400 italic font-serif">Invoice</span>
                <div className="h-px w-16 bg-gray-300"></div>
            </div>

            {/* Invoice Meta */}
            <div className="flex justify-between items-end mb-16">
                <div className="text-left">
                    <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">Billed To</p>
                    <h2 className="text-2xl font-serif text-gray-900 mb-2">{invoice.clientName}</h2>
                    <div className="text-gray-600 text-sm leading-relaxed">
                        {invoice.clientAddress && <p>{invoice.clientAddress}</p>}
                        {invoice.clientEmail && <p>{invoice.clientEmail}</p>}
                    </div>
                </div>
                <div className="text-right">
                    <div className="space-y-1">
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
            </div>

            {/* Table */}
            <div className="mb-16">
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
                            <tr key={index} className="border-b border-gray-50 print-no-break">
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

            {/* Summary */}
            <div className="flex justify-end mb-20">
                <div className="w-80 space-y-2">
                    {/* Subtotal */}
                    <div className="flex justify-between text-gray-600">
                        <span className="text-sm uppercase tracking-widest">Subtotal</span>
                        <span className="font-medium">{formatCurrency(calculateSubtotal(invoice.items))}</span>
                    </div>

                    {/* Discount */}
                    {invoice.discountType && invoice.discountType !== 'none' && (
                        <div className="flex justify-between text-red-600">
                            <span className="text-sm uppercase tracking-widest">
                                Discount {invoice.discountType === 'percentage' ? `(${invoice.discountValue}%)` : ''}
                            </span>
                            <span className="font-medium">
                                -{formatCurrency(calculateDiscount(calculateSubtotal(invoice.items), invoice.discountType, invoice.discountValue))}
                            </span>
                        </div>
                    )}

                    {/* Total */}
                    <div className="flex justify-between items-center py-4 border-b border-gray-200">
                        <span className="text-sm text-gray-500 uppercase tracking-widest">Total Due</span>
                        <span
                            className="text-3xl font-serif"
                            style={{ color: primaryColor }}
                        >
                            {formatCurrency(invoice.total)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="grid grid-cols-2 gap-12 border-t border-gray-100 pt-12">
                <div>
                    {settings?.bankName && (
                        <div>
                            <p className="text-xs text-gray-400 uppercase tracking-widest mb-4">Payment Information</p>
                            <div className="text-sm text-gray-600 space-y-1">
                                <p><span className="w-24 inline-block text-gray-400">Bank</span> {settings.bankName}</p>
                                <p><span className="w-24 inline-block text-gray-400">Account</span> {settings.accountName}</p>
                                <p><span className="w-24 inline-block text-gray-400">Number</span> {settings.accountNumber}</p>
                            </div>
                        </div>
                    )}
                </div>
                <div className="text-right">
                    {invoice.notes && (
                        <div>
                            <p className="text-xs text-gray-400 uppercase tracking-widest mb-4">Notes</p>
                            <p className="text-sm text-gray-600 italic font-serif">{invoice.notes}</p>
                        </div>
                    )}
                    <div className="mt-12 text-center">
                        <p className="text-2xl font-serif italic text-gray-300">Thank You</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
