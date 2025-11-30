import React from 'react';

const statusConfig = {
    paid: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        label: 'Paid'
    },
    pending: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        label: 'Pending'
    },
    overdue: {
        bg: 'bg-red-100',
        text: 'text-red-800',
        label: 'Overdue'
    }
};

export default function PaymentStatusBadge({ status }) {
    const config = statusConfig[status] || statusConfig.pending;

    return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
            {config.label}
        </span>
    );
}
