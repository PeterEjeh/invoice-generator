import React from 'react';
import { formatCurrency, formatDate } from '../../utils/invoiceCalculations';
import { calculateSubtotal, calculateDiscount } from '../../utils/invoiceCalculations';

export default function MinimalTemplate({ invoice, settings }) {
    return (
        <div className="bg-white p-12 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-start mb-12 pb-6 border-b border-gray-200">
                <div>
                    <h1 className="text-2xl font-light text-gray-900 mb-1">{settings?.companyName}</h1>
                    <div className="text-xs text-gray-500 space-y-0.5">
                        <p>{settings?.address}</p>
                        <p>{settings?.city}, {settings?.state} {settings?.postalCode}</p>
                        <p>{settings?.email} • {settings?.phone}</p>
                    </div>
                </div>
                <div className="text-right">
                    <h2 className="text-sm font-medium text-gray-500 mb-2">INVOICE</h2>
                    <p className="text-2xl font-light text-gray-900">{invoice.invoiceNumber}</p>
                </div>
            </div>

            {/* Invoice Details */}
            <div className="grid grid-cols-2 gap-8 mb-12">
                <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-2">Billed To</p>
                    <p className="font-medium text-gray-900">{invoice.clientName}</p>
                    {invoice.clientAddress && <p className="text-sm text-gray-600">{invoice.clientAddress}</p>}
                    {invoice.clientEmail && <p className="text-sm text-gray-600">{invoice.clientEmail}</p>}
                </div>
                <div className="text-right">
                    <div className="space-y-1 text-sm">
                        <div className="flex justify-end gap-4">
                            <span className="text-gray-500">Issue Date:</span>
                            <span className="text-gray-900">{formatDate(invoice.createdAt)}</span>
                        </div>
                        {invoice.dueDate && (
                            <div className="flex justify-end gap-4">
                                <span className="text-gray-500">Due Date:</span>
                                <span className="text-gray-900">{formatDate(invoice.dueDate)}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Line Items */}
            <div className="mb-12">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-200">
                            <th className="text-left py-3 text-xs font-medium text-gray-500 uppercase">Description</th>
                            <th className="text-center py-3 text-xs font-medium text-gray-500 uppercase">Qty</th>
                            <th className="text-right py-3 text-xs font-medium text-gray-500 uppercase">Rate</th>
                            <th className="text-right py-3 text-xs font-medium text-gray-500 uppercase">Amount</th>
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

                {/* Total Section */}
                <div className="mt-6 flex justify-end">
                    <div className="w-64 space-y-2">
                        {/* Subtotal */}
                        <div className="flex justify-between text-gray-700">
                            <span className="text-sm">Subtotal:</span>
                            <span className="font-medium">{formatCurrency(calculateSubtotal(invoice.items))}</span>
                        </div>

                        {/* Discount */}
                        {invoice.discountType && invoice.discountType !== 'none' && (
                            <div className="flex justify-between text-red-600">
                                <span className="text-sm">
                                    Discount {invoice.discountType === 'percentage' ? `(${invoice.discountValue}%)` : ''}:
                                </span>
                                <span className="font-medium">
                                    -{formatCurrency(calculateDiscount(calculateSubtotal(invoice.items), invoice.discountType, invoice.discountValue))}
                                </span>
                            </div>
                        )}

                        {/* Total */}
                        <div className="flex justify-between items-center py-3 border-t border-gray-900">
                            <span className="text-sm font-medium text-gray-900">Total</span>
                            <span className="text-2xl font-light text-gray-900">{formatCurrency(invoice.total)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment Details */}
            {settings?.bankName && (
                <div className="mb-8 pt-6 border-t border-gray-200">
                    <p className="text-xs font-medium text-gray-500 uppercase mb-3">Payment Details</p>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-500">Bank:</span>
                            <span className="text-gray-900">{settings.bankName}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Account:</span>
                            <span className="text-gray-900">{settings.accountName}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Number:</span>
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

            {/* Notes */}
            {invoice.notes && (
                <div className="pt-6 border-t border-gray-200">
                    <p className="text-xs font-medium text-gray-500 uppercase mb-2">Notes</p>
                    <p className="text-sm text-gray-600 whitespace-pre-wrap">{invoice.notes}</p>
                </div>
            )}
        </div>
    );
}
