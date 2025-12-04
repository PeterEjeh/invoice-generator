import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInvoice } from '../context/InvoiceContext';
import { useClient } from '../context/ClientContext';
import { useProduct } from '../context/ProductContext';
import { Plus, Trash2, Save, User, Package, CheckSquare, Square } from 'lucide-react';
import { calculateSubtotal, calculateDueDate, formatDate, calculateTotal, calculateDiscount, formatCurrency } from '../utils/invoiceCalculations';

export default function CreateInvoice() {
    const navigate = useNavigate();
    const { createInvoice } = useInvoice();
    const { clients, createClient } = useClient();
    const { products } = useProduct();

    const [formData, setFormData] = useState({
        clientName: '',
        clientAddress: '',
        clientEmail: '',
        clientPhone: '',
        paymentTerms: 14,
        notes: '',
        template: 'modern',
        discountType: 'none',
        discountValue: 0,
        items: [
            { description: '', quantity: 1, rate: 0 }
        ]
    });

    const [isNewClient, setIsNewClient] = useState(false);
    const [saveNewClient, setSaveNewClient] = useState(false);

    // Check if client is new whenever name changes
    useEffect(() => {
        if (!formData.clientName) {
            setIsNewClient(false);
            return;
        }
        const exists = clients.some(c => c.name.toLowerCase() === formData.clientName.toLowerCase());
        setIsNewClient(!exists);
    }, [formData.clientName, clients]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleClientSelect = (e) => {
        const clientId = e.target.value;
        if (!clientId) return;

        const client = clients.find(c => c.id === clientId);
        if (client) {
            setFormData(prev => ({
                ...prev,
                clientName: client.name,
                clientEmail: client.email || '',
                clientPhone: client.phone || '',
                clientAddress: client.address || ''
            }));
            setSaveNewClient(false);
        }
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...formData.items];
        newItems[index][field] = value;
        setFormData(prev => ({ ...prev, items: newItems }));
    };

    const handleProductSelect = (index, productId) => {
        if (!productId) return;
        const product = products.find(p => p.id === productId);
        if (product) {
            const newItems = [...formData.items];
            newItems[index] = {
                ...newItems[index],
                description: product.name + (product.description ? ` - ${product.description}` : ''),
                rate: product.rate
            };
            setFormData(prev => ({ ...prev, items: newItems }));
        }
    };

    const addItem = () => {
        setFormData(prev => ({
            ...prev,
            items: [...prev.items, { description: '', quantity: 1, rate: 0 }]
        }));
    };

    const removeItem = (index) => {
        if (formData.items.length > 1) {
            setFormData(prev => ({
                ...prev,
                items: prev.items.filter((_, i) => i !== index)
            }));
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate
        if (!formData.clientName.trim()) {
            alert('Please enter client name');
            return;
        }

        if (formData.items.some(item => !item.description.trim())) {
            alert('Please fill in all item descriptions');
            return;
        }

        try {
            // Save new client if requested
            if (isNewClient && saveNewClient) {
                await createClient({
                    name: formData.clientName,
                    email: formData.clientEmail,
                    phone: formData.clientPhone,
                    address: formData.clientAddress
                });
            }

            // Calculate total with discount
            const total = calculateTotal(formData.items, formData.discountType, formData.discountValue);

            // Create invoice
            const invoice = await createInvoice({
                ...formData,
                total
            });

            // Navigate to view page
            navigate(`/invoice/${invoice.id}`);
        } catch (error) {
            alert('Error creating invoice: ' + error.message);
        }
    };

    const subtotal = calculateSubtotal(formData.items);
    const discount = calculateDiscount(subtotal, formData.discountType, formData.discountValue);
    const total = calculateTotal(formData.items, formData.discountType, formData.discountValue);

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Invoice</h1>
                <p className="text-gray-600">Fill in the details below to generate an invoice</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Client Information */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-900">Client Information</h2>

                        {/* Client Selector */}
                        <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-500" />
                            <select
                                onChange={handleClientSelect}
                                className="text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                defaultValue=""
                            >
                                <option value="" disabled>Auto-fill from Clients...</option>
                                {clients.map(client => (
                                    <option key={client.id} value={client.id}>{client.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Client Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="clientName"
                                value={formData.clientName}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter client name"
                            />
                            {isNewClient && formData.clientName && (
                                <div className="mt-2 flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setSaveNewClient(!saveNewClient)}
                                        className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
                                    >
                                        {saveNewClient ? (
                                            <CheckSquare className="w-4 h-4" />
                                        ) : (
                                            <Square className="w-4 h-4" />
                                        )}
                                        Save this client for future use
                                    </button>
                                </div>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Client Email
                            </label>
                            <input
                                type="email"
                                name="clientEmail"
                                value={formData.clientEmail}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="client@example.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Client Phone
                            </label>
                            <input
                                type="tel"
                                name="clientPhone"
                                value={formData.clientPhone}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="+234 800 000 0000"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Payment Terms (days)
                            </label>
                            <input
                                type="number"
                                name="paymentTerms"
                                value={formData.paymentTerms}
                                onChange={handleInputChange}
                                min="1"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Due date: {formatDate(calculateDueDate(new Date().toISOString(), formData.paymentTerms))}
                            </p>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Client Address
                            </label>
                            <input
                                type="text"
                                name="clientAddress"
                                value={formData.clientAddress}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter client address"
                            />
                        </div>
                    </div>
                </div>

                {/* Line Items */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-900">Line Items</h2>
                        <button
                            type="button"
                            onClick={addItem}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            Add Item
                        </button>
                    </div>

                    <div className="space-y-4">
                        {formData.items.map((item, index) => (
                            <div key={index} className="grid grid-cols-12 gap-4 items-start p-4 bg-gray-50 rounded-lg relative group">
                                <div className="col-span-12 md:col-span-5">
                                    <div className="flex justify-between mb-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Description
                                        </label>
                                        <select
                                            onChange={(e) => handleProductSelect(index, e.target.value)}
                                            className="text-xs border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 py-0 px-2"
                                            defaultValue=""
                                        >
                                            <option value="" disabled>Select Product...</option>
                                            {products.map(p => (
                                                <option key={p.id} value={p.id}>{p.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <input
                                        type="text"
                                        value={item.description}
                                        onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Service or product description"
                                    />
                                </div>
                                <div className="col-span-5 md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Quantity
                                    </label>
                                    <input
                                        type="number"
                                        value={item.quantity}
                                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                                        min="1"
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div className="col-span-5 md:col-span-3">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Rate (₦)
                                    </label>
                                    <input
                                        type="number"
                                        value={item.rate}
                                        onChange={(e) => handleItemChange(index, 'rate', e.target.value)}
                                        min="0"
                                        step="0.01"
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div className="col-span-2 md:col-span-2 flex items-end">
                                    <button
                                        type="button"
                                        onClick={() => removeItem(index)}
                                        disabled={formData.items.length === 1}
                                        className="w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        title="Remove item"
                                    >
                                        <Trash2 className="w-4 h-4 mx-auto" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Subtotal and Discount */}
                    <div className="mt-6 flex justify-end">
                        <div className="w-80 space-y-3">
                            {/* Subtotal */}
                            <div className="flex justify-between text-gray-700">
                                <span>Subtotal:</span>
                                <span className="font-medium">{formatCurrency(subtotal)}</span>
                            </div>

                            {/* Discount Section */}
                            <div className="border-t pt-3">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Discount Type
                                </label>
                                <select
                                    name="discountType"
                                    value={formData.discountType}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
                                >
                                    <option value="none">No Discount</option>
                                    <option value="percentage">Percentage (%)</option>
                                    <option value="fixed">Fixed Amount (₦)</option>
                                </select>

                                {formData.discountType !== 'none' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            {formData.discountType === 'percentage' ? 'Discount Percentage' : 'Discount Amount'}
                                        </label>
                                        <input
                                            type="number"
                                            name="discountValue"
                                            value={formData.discountValue}
                                            onChange={handleInputChange}
                                            min="0"
                                            max={formData.discountType === 'percentage' ? '100' : subtotal}
                                            step={formData.discountType === 'percentage' ? '0.1' : '0.01'}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder={formData.discountType === 'percentage' ? 'e.g., 10' : 'e.g., 5000'}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Discount Amount Display */}
                            {formData.discountType !== 'none' && discount > 0 && (
                                <div className="flex justify-between text-red-600">
                                    <span>
                                        Discount {formData.discountType === 'percentage' ? `(${formData.discountValue}%)` : ''}:
                                    </span>
                                    <span className="font-medium">-{formatCurrency(discount)}</span>
                                </div>
                            )}

                            {/* Total */}
                            <div className="flex justify-between items-center pt-3 border-t-2 border-gray-300">
                                <span className="text-lg font-semibold text-gray-900">Total:</span>
                                <span className="text-2xl font-bold text-blue-600">
                                    {formatCurrency(total)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Template Selection */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Invoice Template</h2>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        {['modern', 'classic', 'minimal', 'bold', 'elegant'].map((template) => (
                            <label
                                key={template}
                                className={`relative flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all ${formData.template === template
                                    ? 'border-blue-600 bg-blue-50'
                                    : 'border-gray-300 hover:border-gray-400'
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name="template"
                                    value={template}
                                    checked={formData.template === template}
                                    onChange={handleInputChange}
                                    className="sr-only"
                                />
                                <span className="text-sm font-medium capitalize text-gray-900">
                                    {template}
                                </span>
                                {formData.template === template && (
                                    <span className="absolute top-2 right-2 w-3 h-3 bg-blue-600 rounded-full"></span>
                                )}
                            </label>
                        ))}
                    </div>
                </div>

                {/* Notes */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Additional Notes</h2>
                    <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        rows="4"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Payment terms, thank you message, or any other notes..."
                    ></textarea>
                </div>

                {/* Actions */}
                <div className="flex gap-4 justify-end">
                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Save className="w-5 h-5" />
                        Create Invoice
                    </button>
                </div>
            </form>
        </div>
    );
}
