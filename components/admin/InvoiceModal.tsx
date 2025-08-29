
import React from 'react';
import type { TrainerBill } from '../../types';
import { useData } from '../../context/DataContext';
import Modal from '../shared/Modal';
import { ParcLogo } from '../icons/Icons';

interface InvoiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    bill: TrainerBill;
}

const InvoiceModal: React.FC<InvoiceModalProps> = ({ isOpen, onClose, bill }) => {
    const { trainers } = useData();
    const trainer = trainers.find(t => t.id === bill.trainerId);

    const handlePrint = () => {
        const printableContent = document.getElementById('invoice-printable-area');
        if (printableContent) {
            const printWindow = window.open('', '', 'height=600,width=800');
            printWindow?.document.write('<html><head><title>Print Invoice</title>');
            printWindow?.document.write('<script src="https://cdn.tailwindcss.com"></script>');
            printWindow?.document.write('<style>body { -webkit-print-color-adjust: exact; } .dark { background-color: white !important; color: black !important; } .dark body, .dark div, .dark p, .dark table, .dark thead, .dark tbody, .dark tfoot, .dark th, .dark td, .dark h2, .dark h3 { background-color: white !important; color: black !important; border-color: #e2e8f0 !important; } .dark .text-violet-500 { color: #8b5cf6 !important; } .dark .text-slate-500 { color: #64748b !important; } .dark .text-slate-400 { color: #94a3b8 !important; } .dark .bg-slate-50 { background-color: #f8fafc !important; } .dark .bg-slate-800\\/50 { background-color: #f8fafc !important; } .dark .bg-slate-900 { background-color: white !important; } </style>');
            printWindow?.document.write('</head><body class="dark">');
            printWindow?.document.write(printableContent.innerHTML);
            printWindow?.document.write('</body></html>');
            printWindow?.document.close();
            printWindow?.focus();
            setTimeout(() => {
                printWindow?.print();
                printWindow?.close();
            }, 250);
        }
    };

    if (!trainer) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Invoice ${bill.invoiceNumber}`} size="lg">
            <div>
                <div id="invoice-printable-area" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <ParcLogo className="h-10 w-auto text-violet-500" />
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Parc Platform Inc.<br/>123 Innovation Drive<br/>Tech City, 12345</p>
                        </div>
                        <div className="text-right">
                            <h2 className="text-3xl font-bold uppercase text-slate-400 dark:text-slate-500">Invoice</h2>
                            <p className="text-sm mt-1">{bill.invoiceNumber}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Date: {bill.date.toLocaleDateString()}</p>
                        </div>
                    </div>

                    <div className="mt-10">
                        <p className="text-sm uppercase font-semibold text-slate-500 dark:text-slate-400">Bill To</p>
                        <p className="font-bold">{trainer.name}</p>
                        <p className="text-sm">{trainer.email}</p>
                    </div>

                    <div className="mt-8 flow-root">
                        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                                <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                                    <thead className="bg-slate-50 dark:bg-slate-800/50">
                                        <tr>
                                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-900 dark:text-white sm:pl-0">Expense Type</th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900 dark:text-white w-2/4">Description</th>
                                            <th scope="col" className="py-3.5 pl-3 pr-4 text-right text-sm font-semibold text-slate-900 dark:text-white sm:pr-0">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                        {bill.expenses.map((expense, index) => (
                                            <tr key={index}>
                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-slate-500 dark:text-slate-300 sm:pl-0">{expense.type}</td>
                                                <td className="px-3 py-4 text-sm text-slate-500 dark:text-slate-300">{expense.description}</td>
                                                <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm text-slate-500 dark:text-slate-300 sm:pr-0">₹{expense.amount.toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <th scope="row" colSpan={2} className="hidden pt-5 pl-4 pr-3 text-right text-sm font-semibold text-slate-900 dark:text-white sm:table-cell sm:pl-0">Total</th>
                                            <th scope="row" className="pt-5 pl-4 pr-3 text-left text-sm font-semibold text-slate-900 dark:text-white sm:hidden">Total</th>
                                            <td className="pt-5 pl-3 pr-4 text-right text-sm font-semibold text-slate-900 dark:text-white sm:pr-0">₹{bill.amount.toFixed(2)}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                    </div>
                    
                    <div className="mt-12 border-t dark:border-slate-700 pt-6">
                        <h3 className="font-semibold">Thank you for your services!</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Payment is due within 30 days. Please contact us for any questions.</p>
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-4">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md shadow-sm hover:bg-slate-50 dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600 dark:hover:bg-slate-600">Close</button>
                    <button type="button" onClick={handlePrint} className="px-4 py-2 text-sm font-medium text-white bg-violet-600 border border-transparent rounded-md shadow-sm hover:bg-violet-700">Print</button>
                </div>
            </div>
        </Modal>
    );
};

export default InvoiceModal;