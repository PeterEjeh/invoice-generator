import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns';

export default function RevenueChart({ invoices }) {
    const data = useMemo(() => {
        const last6Months = Array.from({ length: 6 }, (_, i) => {
            const date = subMonths(new Date(), i);
            return {
                month: format(date, 'MMM'),
                fullDate: date,
                amount: 0
            };
        }).reverse();

        invoices.forEach(invoice => {
            if (!invoice.createdAt) return;
            const date = parseISO(invoice.createdAt);

            // Find which month bucket this invoice belongs to
            const monthBucket = last6Months.find(m =>
                format(m.fullDate, 'MMM yyyy') === format(date, 'MMM yyyy')
            );

            if (monthBucket) {
                monthBucket.amount += (invoice.total || 0);
            }
        });

        return last6Months;
    }, [invoices]);

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Overview</h3>
            <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis
                            dataKey="month"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6B7280', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6B7280', fontSize: 12 }}
                            tickFormatter={(value) => `₦${(value / 1000).toFixed(0)}k`}
                        />
                        <Tooltip
                            cursor={{ fill: '#F3F4F6' }}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            formatter={(value) => [`₦${value.toLocaleString()}`, 'Revenue']}
                        />
                        <Bar
                            dataKey="amount"
                            fill="#3B82F6"
                            radius={[4, 4, 0, 0]}
                            barSize={40}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
