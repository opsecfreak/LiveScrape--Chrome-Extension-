import React from 'react';
import type { Customer } from '../../types';

interface CustomerListProps {
    customers: Customer[];
}

const CustomerListItem: React.FC<{ customer: Customer }> = ({ customer }) => (
    <li className="px-4 py-3 border-b border-slate-700 hover:bg-slate-700/50 transition-colors duration-150">
        <p className="font-semibold text-slate-200 truncate">{customer.name || 'Name not found'}</p>
        <p className="text-sm text-blue-400 truncate">{customer.email}</p>
        {customer.phone && <p className="text-xs text-slate-400 truncate">{customer.phone}</p>}
    </li>
);

const CustomerList: React.FC<CustomerListProps> = ({ customers }) => {
    if (customers.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 p-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 21h7a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v11m0 5l4.879-4.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242z" />
                </svg>
                <p className="font-semibold">No Customers Found</p>
                <p className="text-sm">Click "Start Scanning" to begin searching the current page.</p>
            </div>
        );
    }

    return (
        <ul className="divide-y divide-slate-700">
            {customers.map((customer) => (
                <CustomerListItem key={customer.id} customer={customer} />
            ))}
        </ul>
    );
};

export default CustomerList;
