import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useInvoice } from '../context/InvoiceContext';
import { Eye, Edit, Trash2, Search, DollarSign, FileText, Clock } from 'lucide-react';
import PaymentStatusBadge from '../components/PaymentStatusBadge';
import { formatCurrency, formatDate, getPaymentStatus } from '../utils/invoiceCalculations';

export default function Dashboard() {
    const { invoices, deleteInvoice } = useInvoice();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    // Calculate statistics
    const stats = {
        total: invoices.length,
        paid: invoices.filter(inv => inv.status === 'paid').length,
        pending: invoices.filter(inv => getPaymentStatus(inv) === 'pending').length,
        overdue: invoices.filter(inv => getPaymentStatus(inv) === 'overdue').length,
        totalAmount: invoices.reduce((sum, inv) => sum + (inv.total || 0), 0),
        paidAmount: invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + (inv.total || 0), 0),
    };

    // Filter invoices
    const filteredInvoices = invoices.filter(invoice => {
        const matchesSearch = invoice.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            invoice.invoice_number?.toLowerCase().includes(searchTerm.toLowerCase());
        const status = getPaymentStatus(invoice);
        const matchesFilter = filterStatus === 'all' || status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this invoice?')) {
            try {
                await deleteInvoice(id);
            } catch (error) {
                alert('Error deleting invoice: ' + error.message);
            }
        }
    };

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
                <p className="text-gray-600">Manage your invoices and track payments</p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Total Invoices</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                        </div>
                        <FileText className="w-10 h-10 text-blue-500 opacity-80" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Paid</p>
                            <p className="text-2xl font-bold text-green-600">{stats.paid}</p>
                        </div>
                        <DollarSign className="w-10 h-10 text-green-500 opacity-80" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Pending</p>
                            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                        </div>
                        <Clock className="w-10 h-10 text-yellow-500 opacity-80" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Overdue</p>
                            <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
                        </div>
                        <Clock className="w-10 h-10 text-red-500 opacity-80" />
                    </div>
                </div>
            </div>

            {/* Revenue Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 rounded-lg shadow-lg text-white">
                    <p className="text-blue-100 mb-1">Total Revenue</p>
                    <p className="text-3xl font-bold">{formatCurrency(stats.totalAmount)}</p>
                </div>
                <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 rounded-lg shadow-lg text-white">
                    <p className="text-green-100 mb-1">Collected</p>
                    <p className="text-3xl font-bold">{formatCurrency(stats.paidAmount)}</p>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by client name or invoice number..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="all">All Status</option>
                        <option value="paid">Paid</option>
                        <option value="pending">Pending</option>
                        <option value="overdue">Overdue</option>
                    </select>
                </div>
            </div>

            {/* Invoices Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Invoice #</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Client</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Due Date</th>
                                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Amount</th>
                                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredInvoices.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-12 text-gray-500">
                                        <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                        <p>No invoices found</p>
                                        <Link to="/create" className="text-blue-600 hover:underline mt-2 inline-block">
                                            Create your first invoice
                                        </Link>
                                    </td>
                                </tr>
                            ) : (
                                filteredInvoices.map((invoice) => (
                                    <tr key={invoice.id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-3 px-4 font-medium text-gray-900">{invoice.invoice_number}</td>
                                        <td className="py-3 px-4 text-gray-700">{invoice.client_name}</td>
                                        <td className="py-3 px-4 text-gray-600 text-sm">{formatDate(invoice.created_at)}</td>
                                        <td className="py-3 px-4 text-gray-600 text-sm">{formatDate(invoice.due_date)}</td>
                                        <td className="py-3 px-4 text-right font-semibold text-gray-900">
                                            {formatCurrency(invoice.total)}
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            <PaymentStatusBadge status={getPaymentStatus(invoice)} />
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <Link
                                                    to={`/invoice/${invoice.id}`}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="View"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Link>
                                                <Link
                                                    to={`/edit/${invoice.id}`}
                                                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(invoice.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
