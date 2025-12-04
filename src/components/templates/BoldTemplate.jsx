import React from 'react';
import { formatCurrency, formatDate } from '../../utils/invoiceCalculations';
import { calculateSubtotal, calculateDiscount } from '../../utils/invoiceCalculations';

export default function BoldTemplate({ invoice, settings }) {
    const primaryColor = settings?.primaryColor || '#000000';
    const fontFamily = settings?.fontFamily || 'Inter';

    return (
        <div className="bg-white min-h-[1000px]" style={{ fontFamily }}>
            {/* Header Block */}
            <div
                className="p-12 text-white"
                style={{ backgroundColor: primaryColor }}
            >
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
                        <div className="text-white/90 space-y-1 font-medium">
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

            {/* Info Bar */}
            <div className="bg-gray-900 text-white p-6 flex justify-between items-center">
                <div className="flex gap-12">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Date Issued</p>
                        <p className="text-lg font-bold">{formatDate(invoice.createdAt)}</p>
                    </div>
                    {invoice.dueDate && (
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Due Date</p>
                            <p className="text-lg font-bold">{formatDate(invoice.dueDate)}</p>
                        </div>
                    )}
                </div>
                <div className="text-right">
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Amount</p>
                    <p className="text-3xl font-black">{formatCurrency(invoice.total)}</p>
                </div>
            </div>

            <div className="p-12">
                {/* Client Info */}
                <div className="mb-16">
                    <h3
                        className="text-sm font-black uppercase tracking-widest mb-4 border-b-4 pb-2 inline-block"
                        style={{ borderColor: primaryColor, color: primaryColor }}
                    >
                        Bill To
                    </h3>
                    <div className="text-gray-800">
                        <p className="text-3xl font-bold mb-2">{invoice.clientName}</p>
                        <div className="text-lg text-gray-600 space-y-1">
                            {invoice.clientAddress && <p>{invoice.clientAddress}</p>}
                            {invoice.clientEmail && <p>{invoice.clientEmail}</p>}
                            {invoice.clientPhone && <p>{invoice.clientPhone}</p>}
                        </div>
                    </div>
                </div>

                {/* Items */}
                <div className="mb-12">
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
                                    <td className="py-6 text-lg font-medium text-gray-900">{item.description}</td>
                                    <td className="text-center py-6 text-lg text-gray-600">{item.quantity}</td>
                                    <td className="text-right py-6 text-lg text-gray-600">{formatCurrency(item.rate)}</td>
                                    <td className="text-right py-6 text-lg font-bold text-gray-900">
                                        {formatCurrency(item.quantity * item.rate)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer Section */}
                <div className="grid grid-cols-2 gap-12 pt-8 border-t-4 border-gray-900">
                    <div>
                        {settings?.bankName && (
                            <div className="mb-8">
                                <h4 className="font-bold text-gray-900 mb-4 uppercase tracking-wider">Payment Details</h4>
                                <div className="bg-gray-100 p-6 rounded-lg space-y-2 text-sm">
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

                        {invoice.notes && (
                            <div>
                                <h4 className="font-bold text-gray-900 mb-4 uppercase tracking-wider text-lg">Terms & Conditions</h4>
                                <div className="text-gray-600 space-y-2 whitespace-pre-wrap">{invoice.notes}</div>
                            </div>
                        )}
                    </div>

                    <div className="text-right">
                        {/* Subtotal and Discount */}
                        <div className="mb-6 space-y-2 text-lg">
                            <div className="flex justify-between text-gray-700">
                                <span>Subtotal:</span>
                                <span className="font-bold">{formatCurrency(calculateSubtotal(invoice.items))}</span>
                            </div>

                            {invoice.discountType && invoice.discountType !== 'none' && (
                                <div className="flex justify-between text-red-600">
                                    <span>
                                        Discount {invoice.discountType === 'percentage' ? `(${invoice.discountValue}%)` : ''}:
                                    </span>
                                    <span className="font-bold">
                                        -{formatCurrency(calculateDiscount(calculateSubtotal(invoice.items), invoice.discountType, invoice.discountValue))}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="inline-block bg-gray-900 text-white p-8 rounded-xl shadow-2xl transform rotate-[-2deg]">
                            <p className="text-sm font-bold uppercase tracking-wider opacity-80 mb-2">Total Due</p>
                            <p className="text-5xl font-black">{formatCurrency(invoice.total)}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
