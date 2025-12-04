import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useInvoice } from '../context/InvoiceContext';
import { Eye, Edit, Trash2, Search, DollarSign, FileText, Clock, TrendingUp, CheckCircle } from 'lucide-react';
import PaymentStatusBadge from '../components/PaymentStatusBadge';
import RevenueChart from '../components/dashboard/RevenueChart';
import StatusDistributionChart from '../components/dashboard/StatusDistributionChart';
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
        const matchesSearch = invoice.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            invoice.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase());
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
        <div className="p-6 max-w-[1600px] mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-sm text-gray-500">Overview of your business performance</p>
                </div>
                <Link
                    to="/create"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                    + New Invoice
                </Link>
            </div>

            {/* Top Section: Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="lg:col-span-2 h-[320px]">
                    <RevenueChart invoices={invoices} />
                </div>
                <div className="lg:col-span-1 h-[320px]">
                    <StatusDistributionChart invoices={invoices} />
                </div>
            </div>

            {/* Middle Section: Compact Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                {/* Total Revenue */}
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-medium text-gray-500 uppercase">Total Revenue</p>
                        <TrendingUp className="w-4 h-4 text-blue-600" />
                    </div>
                    <p className="text-lg font-bold text-gray-900">{formatCurrency(stats.totalAmount)}</p>
                </div>

                {/* Collected */}
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-medium text-gray-500 uppercase">Collected</p>
                        <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <p className="text-lg font-bold text-gray-900">{formatCurrency(stats.paidAmount)}</p>
                </div>

                {/* Total Invoices */}
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-medium text-gray-500 uppercase">Total Invoices</p>
                        <FileText className="w-4 h-4 text-gray-400" />
                    </div>
                    <p className="text-xl font-bold text-gray-900">{stats.total}</p>
                </div>

                {/* Paid */}
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-medium text-gray-500 uppercase">Paid</p>
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    </div>
                    <p className="text-xl font-bold text-gray-900">{stats.paid}</p>
                </div>

                {/* Pending */}
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-medium text-gray-500 uppercase">Pending</p>
                        <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                    </div>
                    <p className="text-xl font-bold text-gray-900">{stats.pending}</p>
                </div>

                {/* Overdue */}
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-medium text-gray-500 uppercase">Overdue</p>
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    </div>
                    <p className="text-xl font-bold text-gray-900">{stats.overdue}</p>
                </div>
            </div>

            {/* Bottom Section: Recent Invoices Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col h-[calc(100vh-550px)] min-h-[400px]">
                {/* Table Header & Filters */}
                <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
                    <h2 className="text-lg font-semibold text-gray-900">Recent Invoices</h2>
                    <div className="flex gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="all">All Status</option>
                            <option value="paid">Paid</option>
                            <option value="pending">Pending</option>
                            <option value="overdue">Overdue</option>
                        </select>
                    </div>
                </div>

                {/* Table Content */}
                <div className="overflow-auto flex-1">
                    <table className="w-full relative">
                        <thead className="bg-gray-50 sticky top-0 z-10">
                            <tr>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Invoice #</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Client</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Due Date</th>
                                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredInvoices.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-12 text-gray-500">
                                        <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                        <p>No invoices found</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredInvoices.map((invoice) => (
                                    <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="py-3 px-4 text-sm font-medium text-gray-900">{invoice.invoiceNumber}</td>
                                        <td className="py-3 px-4 text-sm text-gray-700">{invoice.clientName}</td>
                                        <td className="py-3 px-4 text-sm text-gray-500">{formatDate(invoice.createdAt)}</td>
                                        <td className="py-3 px-4 text-sm text-gray-500">{formatDate(invoice.dueDate)}</td>
                                        <td className="py-3 px-4 text-sm text-right font-medium text-gray-900">
                                            {formatCurrency(invoice.total)}
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            <PaymentStatusBadge status={getPaymentStatus(invoice)} />
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <Link
                                                    to={`/invoice/${invoice.id}`}
                                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                    title="View"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Link>
                                                <Link
                                                    to={`/edit/${invoice.id}`}
                                                    className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(invoice.id)}
                                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
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
