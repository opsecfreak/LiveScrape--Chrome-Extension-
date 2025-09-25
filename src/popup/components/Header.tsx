import React from 'react';

interface HeaderProps {
    customerCount: number;
    isScanning: boolean;
}

const Header: React.FC<HeaderProps> = ({ customerCount, isScanning }) => {
    return (
        <header className="p-4 bg-slate-900 shadow-md flex justify-between items-center border-b border-slate-700">
            <div>
                <h1 className="text-xl font-bold text-slate-100">Customer Extractor</h1>
                <p className="text-sm text-slate-400">{customerCount} contacts found</p>
            </div>
            <div className="flex items-center space-x-2">
                <span className={`text-xs font-semibold ${isScanning ? 'text-green-400' : 'text-slate-500'}`}>
                    {isScanning ? 'SCANNING' : 'IDLE'}
                </span>
                <div className={`w-3 h-3 rounded-full ${isScanning ? 'bg-green-500 animate-pulse' : 'bg-slate-600'}`}></div>
            </div>
        </header>
    );
};

export default Header;
