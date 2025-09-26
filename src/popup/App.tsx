// FIX: Declare chrome as any to resolve "Cannot find name 'chrome'" errors
// in environments where @types/chrome is not installed.
declare const chrome: any;

import React, { useState, useEffect, useCallback } from 'react';
import type { Customer } from '../types';
import Header from './components/Header';
import CustomerList from './components/CustomerList';
import ActionButton from './components/ActionButton';

const App: React.FC = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [isScanning, setIsScanning] = useState<boolean>(false);
    const [activeTabId, setActiveTabId] = useState<number | null>(null);
    const [notification, setNotification] = useState<string>('');

    const showNotification = (message: string) => {
        setNotification(message);
        setTimeout(() => setNotification(''), 2000);
    };

    useEffect(() => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]?.id) {
                const currentTabId = tabs[0].id;
                setActiveTabId(currentTabId);
                // Load initial data from storage
                chrome.storage.local.get(['customers', `isScanning_${currentTabId}`], (result) => {
                    setCustomers(result.customers || []);
                    setIsScanning(result[`isScanning_${currentTabId}`] || false);
                });
            }
        });

        // FIX: Use `any` for StorageChange type to fix "Cannot find namespace 'chrome'" error.
        const storageListener = (changes: { [key: string]: any }, areaName: string) => {
            if (areaName === 'local' && changes.customers) {
                setCustomers(changes.customers.newValue || []);
            }
            if (activeTabId && areaName === 'local' && changes[`isScanning_${activeTabId}`]) {
                setIsScanning(changes[`isScanning_${activeTabId}`].newValue || false);
            }
        };

        chrome.storage.onChanged.addListener(storageListener);

        return () => {
            chrome.storage.onChanged.removeListener(storageListener);
        };
    }, [activeTabId]);

    const handleToggleScan = useCallback(() => {
        if (!activeTabId) return;

        const newIsScanning = !isScanning;
        setIsScanning(newIsScanning);
        
        chrome.storage.local.set({ [`isScanning_${activeTabId}`]: newIsScanning });

        chrome.tabs.sendMessage(activeTabId, {
            type: newIsScanning ? 'START_SCAN' : 'STOP_SCAN'
        });
    }, [isScanning, activeTabId]);
    
    const handleClearData = useCallback(() => {
        chrome.storage.local.set({ customers: [] }, () => {
            setCustomers([]);
            showNotification('Data Cleared!');
        });
        if (isScanning && activeTabId) {
            handleToggleScan(); // Also stop scanning
        }
    }, [isScanning, activeTabId, handleToggleScan]);

    const handleCopyEmails = useCallback(() => {
        const emails = customers.map(c => c.email).join(', ');
        navigator.clipboard.writeText(emails).then(() => {
            showNotification('Emails Copied!');
        });
    }, [customers]);

    const handleExportCSV = useCallback(() => {
        if (customers.length === 0) return;
        const headers = ["Name", "Email", "Phone"];
        const csvRows = [
            headers.join(','),
            ...customers.map(c => {
                const name = `"${(c.name || '').replace(/"/g, '""')}"`;
                const email = `"${c.email || ''}"`;
                const phone = `"${c.phone || ''}"`;
                return [name, email, phone].join(',');
            })
        ];
        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'customers.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showNotification('Exported to CSV!');
    }, [customers]);

    const handleExportHTML = useCallback(() => {
        if (customers.length === 0) return;
        const styles = `body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 2em; background-color: #f8f9fa; color: #212529; } table { width: 100%; border-collapse: collapse; box-shadow: 0 2px 8px rgba(0,0,0,0.1); } th, td { padding: 12px 15px; border: 1px solid #dee2e6; text-align: left; } thead { background-color: #343a40; color: white; } tbody tr:nth-child(even) { background-color: #f2f2f2; } tbody tr:hover { background-color: #e9ecef; } h1 { color: #343a40; border-bottom: 2px solid #343a40; padding-bottom: 0.5em; }`;
        const rows = customers.map(c => `<tr><td>${c.name || ''}</td><td>${c.email || ''}</td><td>${c.phone || ''}</td></tr>`).join('');
        const htmlString = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Customer Data Export</title><style>${styles}</style></head><body><h1>Customer Data (${customers.length})</h1><table><thead><tr><th>Name</th><th>Email</th><th>Phone</th></tr></thead><tbody>${rows}</tbody></table></body></html>`;

        const blob = new Blob([htmlString], { type: 'text/html;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'customers.html');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showNotification('Exported to HTML!');
    }, [customers]);

    return (
        <div className="flex flex-col h-full bg-slate-800 text-white font-sans">
            <Header customerCount={customers.length} isScanning={isScanning} />
            <div className="flex-grow overflow-y-auto">
                <CustomerList customers={customers} />
            </div>
            <div className="p-4 bg-slate-900/50 border-t border-slate-700">
                <div className="grid grid-cols-2 gap-3">
                    <ActionButton
                        onClick={handleToggleScan}
                        className={isScanning 
                            ? "bg-red-600 hover:bg-red-700" 
                            : "bg-green-600 hover:bg-green-700"}
                    >
                        {isScanning ? 'Stop Scanning' : 'Start Scanning'}
                    </ActionButton>
                    <ActionButton
                        onClick={handleClearData}
                        className="bg-slate-600 hover:bg-slate-700"
                        disabled={customers.length === 0}
                    >
                        Clear Data
                    </ActionButton>
                </div>
                {customers.length > 0 && (
                    <div className="mt-3 space-y-3">
                        <ActionButton
                            onClick={handleCopyEmails}
                            className="w-full bg-blue-600 hover:bg-blue-700"
                        >
                            Copy All Emails
                        </ActionButton>
                        <div className="grid grid-cols-2 gap-3">
                            <ActionButton onClick={handleExportCSV} className="bg-sky-600 hover:bg-sky-700">
                                Export CSV
                            </ActionButton>
                            <ActionButton onClick={handleExportHTML} className="bg-sky-600 hover:bg-sky-700">
                                Export HTML
                            </ActionButton>
                        </div>
                    </div>
                )}
            </div>
            {notification && (
                <div className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg text-sm transition-opacity duration-300">
                    {notification}
                </div>
            )}
        </div>
    );
};

export default App;
