import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, Label } from 'recharts';
import { getPaymentStatus } from '../../utils/invoiceCalculations';

export default function StatusDistributionChart({ invoices }) {
    const data = useMemo(() => {
        const stats = {
            paid: 0,
            pending: 0,
            overdue: 0
        };

        invoices.forEach(invoice => {
            const status = getPaymentStatus(invoice);
            if (stats[status] !== undefined) {
                stats[status]++;
            }
        });

        return [
            { name: 'Paid', value: stats.paid, color: '#16A34A' },   // green-600
            { name: 'Pending', value: stats.pending, color: '#CA8A04' }, // yellow-600
            { name: 'Overdue', value: stats.overdue, color: '#DC2626' }  // red-600
        ].filter(item => item.value > 0);
    }, [invoices]);

    const totalInvoices = invoices.length;

    if (data.length === 0) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-full min-h-[300px] flex items-center justify-center text-gray-500">
                No data available
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Invoice Status</h3>
            <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && viewBox.cx && viewBox.cy) {
                                        return (
                                            <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                                                <tspan x={viewBox.cx} y={viewBox.cy - 10} className="text-3xl font-bold fill-gray-900">{totalInvoices}</tspan>
                                                <tspan x={viewBox.cx} y={viewBox.cy + 15} className="text-sm fill-gray-500">Total Invoices</tspan>
                                            </text>
                                        );
                                    }
                                    return null;
                                }}
                                position="center"
                            />
                        </Pie>
                        <Tooltip
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Legend
                            verticalAlign="bottom"
                            height={36}
                            iconType="circle"
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
