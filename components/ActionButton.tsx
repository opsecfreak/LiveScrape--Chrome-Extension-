
import React from 'react';

interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
}

const ActionButton: React.FC<ActionButtonProps> = ({ children, className, ...props }) => {
    return (
        <button
            className={`px-4 py-2.5 w-full text-sm font-semibold text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-blue-500 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default ActionButton;
