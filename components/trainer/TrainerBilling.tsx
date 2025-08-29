
import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { TrainerBill, BillStatus, ExpenseType, Expense } from '../../types';
import Modal from '../shared/Modal';
import InvoiceModal from '../admin/InvoiceModal';
import { XIcon } from '../icons/Icons';

const TrainerBilling: React.FC = () => {
    const { user } = useAuth();
    const { bills, addBill } = useData();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
    const [selectedBill, setSelectedBill] = useState<TrainerBill | null>(null);

    const myBills = useMemo(() => {
        if (!user) return [];
        return bills.filter(bill => bill.trainerId === user.id)
            .sort((a, b) => b.date.getTime() - a.date.getTime());
    }, [bills, user]);

    const getInitialNewBillState = () => ({
        date: new Date().toISOString().split('T')[0],
        expenses: [{ id: Date.now(), type: ExpenseType.OTHER, description: '', amount: 0 }]
    });

    const [newBill, setNewBill] = useState(getInitialNewBillState());
    
    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewBill(prev => ({ ...prev, date: e.target.value }));
    };

    const addExpenseRow = () => {
        setNewBill(prev => ({
            ...prev,
            expenses: [...prev.expenses, { id: Date.now(), type: ExpenseType.OTHER, description: '', amount: 0 }]
        }));
    };

    const removeExpenseRow = (id: number) => {
        if (newBill.expenses.length <= 1) return;
        setNewBill(prev => ({
            ...prev,
            expenses: prev.expenses.filter(exp => exp.id !== id)
        }));
    };

    const handleExpenseChange = (id: number, field: keyof Omit<Expense, 'id'>, value: string) => {
        setNewBill(prev => ({
            ...prev,
            expenses: prev.expenses.map(exp => {
                if (exp.id === id) {
                    const updatedExp = { ...exp, [field]: value };
                    if (field === 'amount') {
                        updatedExp.amount = parseFloat(value) || 0;
                    }
                    return updatedExp;
                }
                return exp;
            })
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (user && newBill.expenses.every(e => e.amount > 0 && e.description.trim())) {
            const finalExpenses: Expense[] = newBill.expenses.map(({ id, ...rest }) => rest);
            addBill({
                trainerId: user.id,
                date: new Date(newBill.date),
                expenses: finalExpenses
            });
            setIsCreateModalOpen(false);
            setNewBill(getInitialNewBillState());
        } else {
            alert('Please fill out all expense fields correctly.');
        }
    };

    const handleViewInvoice = (bill: TrainerBill) => {
        setSelectedBill(bill);
        setIsInvoiceModalOpen(true);
    };

    const formInputClasses = "block w-full rounded-md border-slate-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm dark:bg-slate-800 dark:border-slate-700 dark:text-white";
    const formLabelClasses = "block text-sm font-medium text-slate-700 dark:text-slate-200";

    const StatusBadge = ({ status }: { status: BillStatus }) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${status === BillStatus.PAID ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200'}`}>
            {status}
        </span>
    );

    return (
        <div>
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">My Billing</h1>
                    <p className="mt-2 text-slate-600 dark:text-slate-400">Submit expenses and track your payments.</p>
                </div>
                <button onClick={() => setIsCreateModalOpen(true)} className="px-4 py-2 bg-violet-600 text-white font-semibold rounded-lg hover:bg-violet-700 transition-colors shadow-sm">
                    Submit Bill
                </button>
            </div>

            <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <div className="overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5 sm:rounded-lg border dark:border-slate-700">
                            <table className="min-w-full divide-y divide-slate-300 dark:divide-slate-700">
                                <thead className="bg-slate-50 dark:bg-slate-800/50">
                                    <tr>
                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-900 dark:text-white sm:pl-6">Invoice #</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900 dark:text-white">Date</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900 dark:text-white">Amount</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900 dark:text-white">Status</th>
                                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6"><span className="sr-only">Actions</span></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900">
                                    {myBills.map((bill) => (
                                        <tr key={bill.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-slate-900 dark:text-white sm:pl-6">{bill.invoiceNumber}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500 dark:text-slate-300">{bill.date.toLocaleDateString()}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500 dark:text-slate-300">₹{bill.amount.toFixed(2)}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm"><StatusBadge status={bill.status} /></td>
                                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                <button onClick={() => handleViewInvoice(bill)} className="text-violet-600 hover:text-violet-900 dark:text-violet-400 dark:hover:text-violet-200">View Invoice</button>
                                            </td>
                                        </tr>
                                    ))}
                                    {myBills.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="text-center py-10 text-slate-500 dark:text-slate-400">
                                                You have not submitted any bills yet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Submit New Bill">
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="date" className={formLabelClasses}>Bill Date</label>
                            <input type="date" name="date" id="date" value={newBill.date} onChange={handleDateChange} required className={`${formInputClasses} mt-1`} />
                        </div>
                        <hr className="dark:border-slate-700"/>
                        <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                           {newBill.expenses.map((expense, index) => (
                               <div key={expense.id} className="p-3 border dark:border-slate-700 rounded-lg space-y-2 relative">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                        <div>
                                            <label htmlFor={`expense-type-${expense.id}`} className="text-xs font-medium text-slate-600 dark:text-slate-400">Type</label>
                                            <select 
                                                id={`expense-type-${expense.id}`}
                                                value={expense.type}
                                                onChange={(e) => handleExpenseChange(expense.id, 'type', e.target.value)}
                                                className={`${formInputClasses} text-sm`}
                                            >
                                                {Object.values(ExpenseType).map(type => <option key={type} value={type}>{type}</option>)}
                                            </select>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label htmlFor={`expense-amount-${expense.id}`} className="text-xs font-medium text-slate-600 dark:text-slate-400">Amount (₹)</label>
                                            <input 
                                                id={`expense-amount-${expense.id}`}
                                                type="number"
                                                value={expense.amount}
                                                onChange={(e) => handleExpenseChange(expense.id, 'amount', e.target.value)}
                                                required min="0.01" step="0.01" 
                                                className={`${formInputClasses} text-sm`}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor={`expense-desc-${expense.id}`} className="text-xs font-medium text-slate-600 dark:text-slate-400">Description</label>
                                        <input 
                                            id={`expense-desc-${expense.id}`}
                                            type="text"
                                            value={expense.description}
                                            onChange={(e) => handleExpenseChange(expense.id, 'description', e.target.value)}
                                            required 
                                            className={`${formInputClasses} text-sm`}
                                            placeholder="e.g., Flight ticket"
                                        />
                                    </div>
                                    {newBill.expenses.length > 1 && (
                                        <button type="button" onClick={() => removeExpenseRow(expense.id)} className="absolute -top-2 -right-2 p-1 bg-red-100 dark:bg-red-900/50 rounded-full text-red-500 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800">
                                            <XIcon className="w-4 h-4" />
                                        </button>
                                    )}
                               </div>
                           ))}
                        </div>
                        <button type="button" onClick={addExpenseRow} className="w-full text-sm font-medium text-violet-600 dark:text-violet-400 hover:text-violet-800 dark:hover:text-violet-200 text-center py-2 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg hover:border-violet-400 dark:hover:border-violet-500">
                           + Add Expense Item
                        </button>
                    </div>
                    <div className="mt-6 flex justify-end gap-4">
                        <button type="button" onClick={() => setIsCreateModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md shadow-sm hover:bg-slate-50 dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600 dark:hover:bg-slate-600">Cancel</button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-violet-600 border border-transparent rounded-md shadow-sm hover:bg-violet-700">Submit Bill</button>
                    </div>
                </form>
            </Modal>
            
            {selectedBill && (
                <InvoiceModal 
                    isOpen={isInvoiceModalOpen}
                    onClose={() => setIsInvoiceModalOpen(false)}
                    bill={selectedBill}
                />
            )}
        </div>
    );
};

export default TrainerBilling;