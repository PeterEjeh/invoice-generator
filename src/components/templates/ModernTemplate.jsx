import React from 'react';
import { FileText, Mail, Phone, Building, Calendar } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/invoiceCalculations';
import { calculateSubtotal, calculateDiscount, calculateVAT } from '../../utils/invoiceCalculations';

export default function ModernTemplate({ invoice, settings }) {
    return (
        <div className="bg-white">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">INVOICE</h1>
                        <p className="text-blue-100">Invoice #: {invoice.invoiceNumber}</p>
                        <p className="text-blue-100">Date: {formatDate(invoice.createdAt)}</p>
                        {invoice.dueDate && (
                            <p className="text-blue-100">Due: {formatDate(invoice.dueDate)}</p>
                        )}
                    </div>
                    <FileText className="w-16 h-16 opacity-80" />
                </div>
            </div>

            {/* From/To Section */}
            <div className="grid md:grid-cols-2 gap-8 p-8 border-b">
                <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">From</h3>
                    <div className="space-y-2">
                        <p className="font-semibold text-lg">{settings?.companyName}</p>
                        <p className="text-gray-600">{settings?.address}</p>
                        <p className="text-gray-600">{settings?.city}, {settings?.state} {settings?.postalCode}</p>
                        <p className="text-gray-600">{settings?.country}</p>
                        <div className="flex items-center gap-2 text-gray-600 mt-3">
                            <Mail className="w-4 h-4" />
                            <span>{settings?.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                            <Phone className="w-4 h-4" />
                            <span>{settings?.phone}</span>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Bill To</h3>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Building className="w-5 h-5 text-blue-600" />
                            <p className="font-semibold text-lg">{invoice.clientName}</p>
                        </div>
                        {invoice.clientAddress && <p className="text-gray-600">{invoice.clientAddress}</p>}
                        {invoice.clientEmail && (
                            <div className="flex items-center gap-2 text-gray-600">
                                <Mail className="w-4 h-4" />
                                <span>{invoice.clientEmail}</span>
                            </div>
                        )}
                        {invoice.clientPhone && (
                            <div className="flex items-center gap-2 text-gray-600">
                                <Phone className="w-4 h-4" />
                                <span>{invoice.clientPhone}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Line Items */}
            <div className="p-8">
                <h3 className="text-lg font-semibold mb-4">Service Details</h3>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b-2 border-gray-300">
                                <th className="text-left py-3 px-4 text-gray-600 font-semibold">Description</th>
                                <th className="text-center py-3 px-4 text-gray-600 font-semibold">Qty</th>
                                <th className="text-right py-3 px-4 text-gray-600 font-semibold">Rate</th>
                                <th className="text-right py-3 px-4 text-gray-600 font-semibold">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoice.items?.map((item, index) => (
                                <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 print-no-break">
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
                </div>

                {/* Total Section */}
                <div className="mt-6 flex justify-end">
                    <div className="w-64 space-y-2">
                        {/* Subtotal */}
                        <div className="flex justify-between text-gray-700">
                            <span>Subtotal:</span>
                            <span className="font-medium">{formatCurrency(calculateSubtotal(invoice.items))}</span>
                        </div>

                        {/* Discount */}
                        {invoice.discountType && invoice.discountType !== 'none' && (
                            <div className="flex justify-between text-red-600">
                                <span>
                                    Discount {invoice.discountType === 'percentage' ? `(${invoice.discountValue}%)` : ''}:
                                </span>
                                <span className="font-medium">
                                    -{formatCurrency(calculateDiscount(calculateSubtotal(invoice.items), invoice.discountType, invoice.discountValue))}
                                </span>
                            </div>
                        )}

                        {/* VAT */}
                        {invoice.vat && invoice.vat > 0 && (
                            <div className="flex justify-between text-gray-700">
                                <span>VAT ({invoice.vat}%):</span>
                                <span className="font-medium">
                                    {formatCurrency(calculateVAT(
                                        calculateSubtotal(invoice.items) - calculateDiscount(calculateSubtotal(invoice.items), invoice.discountType, invoice.discountValue),
                                        invoice.vat
                                    ))}
                                </span>
                            </div>
                        )}

                        {/* Total */}
                        <div className="flex justify-between items-center py-2 border-t-2 border-gray-300">
                            <span className="text-gray-800 font-bold text-lg">Total:</span>
                            <span className="text-2xl font-bold text-blue-600">{formatCurrency(invoice.total)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment Details */}
            {settings?.bankName && (
                <div className="bg-blue-50 p-8 border-t">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Payment Information</h3>
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Bank Name</p>
                                <p className="font-semibold text-gray-800">{settings.bankName}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Account Name</p>
                                <p className="font-semibold text-gray-800">{settings.accountName}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Account Number</p>
                                <p className="font-semibold text-gray-800">{settings.accountNumber}</p>
                            </div>
                            {settings.sortCode && (
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Sort Code</p>
                                    <p className="font-semibold text-gray-800">{settings.sortCode}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Footer Notes */}
            {invoice.notes && (
                <div className="p-8 bg-gray-50 border-t">
                    <h3 className="font-semibold mb-2 text-gray-800">Notes</h3>
                    <p className="text-sm text-gray-600 whitespace-pre-wrap">{invoice.notes}</p>
                </div>
            )}
        </div>
    );
}
