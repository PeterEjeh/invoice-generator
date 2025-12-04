import React from 'react';
import { formatCurrency, formatDate } from '../../utils/invoiceCalculations';
import { calculateSubtotal, calculateDiscount } from '../../utils/invoiceCalculations';

export default function ClassicTemplate({ invoice, settings }) {
    return (
        <div className="bg-white p-8">
            {/* Header */}
            <div className="border-b-4 border-gray-800 pb-6 mb-6">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-800 mb-2">{settings?.companyName}</h1>
                        <div className="text-sm text-gray-600 space-y-1">
                            <p>{settings?.address}</p>
                            <p>{settings?.city}, {settings?.state} {settings?.postalCode}</p>
                            <p>{settings?.country}</p>
                            <p>Email: {settings?.email}</p>
                            <p>Phone: {settings?.phone}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">INVOICE</h2>
                        <div className="text-sm text-gray-600 space-y-1">
                            <p><span className="font-semibold">Invoice #:</span> {invoice.invoiceNumber}</p>
                            <p><span className="font-semibold">Date:</span> {formatDate(invoice.createdAt)}</p>
                            {invoice.dueDate && (
                                <p><span className="font-semibold">Due Date:</span> {formatDate(invoice.dueDate)}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bill To */}
            <div className="mb-8">
                <h3 className="text-sm font-bold text-gray-700 uppercase mb-2">Bill To:</h3>
                <div className="text-gray-700">
                    <p className="font-semibold text-lg">{invoice.clientName}</p>
                    {invoice.clientAddress && <p>{invoice.clientAddress}</p>}
                    {invoice.clientEmail && <p>Email: {invoice.clientEmail}</p>}
                    {invoice.clientPhone && <p>Phone: {invoice.clientPhone}</p>}
                </div>
            </div>

            {/* Line Items */}
            <div className="mb-8">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-800 text-white">
                            <th className="text-left py-3 px-4 font-semibold">Description</th>
                            <th className="text-center py-3 px-4 font-semibold">Quantity</th>
                            <th className="text-right py-3 px-4 font-semibold">Rate</th>
                            <th className="text-right py-3 px-4 font-semibold">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoice.items?.map((item, index) => (
                            <tr key={index} className="border-b border-gray-300 print-no-break">
                                <td className="py-3 px-4">{item.description}</td>
                                <td className="text-center py-3 px-4">{item.quantity}</td>
                                <td className="text-right py-3 px-4">{formatCurrency(item.rate)}</td>
                                <td className="text-right py-3 px-4 font-medium">
                                    {formatCurrency(item.quantity * item.rate)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Total Section */}
                <div className="mt-4 flex justify-end">
                    <div className="w-64 space-y-2">
                        {/* Subtotal */}
                        <div className="flex justify-between text-gray-700 text-sm">
                            <span>Subtotal:</span>
                            <span className="font-medium">{formatCurrency(calculateSubtotal(invoice.items))}</span>
                        </div>

                        {/* Discount */}
                        {invoice.discountType && invoice.discountType !== 'none' && (
                            <div className="flex justify-between text-red-600 text-sm">
                                <span>
                                    Discount {invoice.discountType === 'percentage' ? `(${invoice.discountValue}%)` : ''}:
                                </span>
                                <span className="font-medium">
                                    -{formatCurrency(calculateDiscount(calculateSubtotal(invoice.items), invoice.discountType, invoice.discountValue))}
                                </span>
                            </div>
                        )}

                        {/* Total */}
                        <div className="bg-gray-800 text-white p-4">
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-lg">TOTAL DUE:</span>
                                <span className="text-2xl font-bold">{formatCurrency(invoice.total)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment Information */}
            {settings?.bankName && (
                <div className="mb-8 border-t border-gray-300 pt-6">
                    <h3 className="text-sm font-bold text-gray-700 uppercase mb-3">Payment Information:</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                        <div>
                            <p className="font-semibold">Bank Name:</p>
                            <p>{settings.bankName}</p>
                        </div>
                        <div>
                            <p className="font-semibold">Account Name:</p>
                            <p>{settings.accountName}</p>
                        </div>
                        <div>
                            <p className="font-semibold">Account Number:</p>
                            <p>{settings.accountNumber}</p>
                        </div>
                        {settings.sortCode && (
                            <div>
                                <p className="font-semibold">Sort Code:</p>
                                <p>{settings.sortCode}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Notes */}
            {invoice.notes && (
                <div className="border-t border-gray-300 pt-6">
                    <h3 className="text-sm font-bold text-gray-700 uppercase mb-2">Notes:</h3>
                    <p className="text-sm text-gray-600 whitespace-pre-wrap">{invoice.notes}</p>
                </div>
            )}

            {/* Footer */}
            <div className="mt-12 text-center text-xs text-gray-500 border-t border-gray-300 pt-4">
                <p>Thank you for your business!</p>
            </div>
        </div>
    );
}
