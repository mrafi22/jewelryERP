import React, { useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Pagination from '@/Components/Pagination';
import Dropdown from '@/Components/Dropdown';
import { 
    AlertCircle, Printer, CreditCard, BookOpen, Eye, Search, 
    RotateCcw, Clock, AlertTriangle, CheckCircle2, User, Building2
} from 'lucide-react';
import useFilter from '@/Hooks/useFilter';
import { useLanguage } from '@/Context/LanguageContext';
import SalesReportsNav from './Components/SalesReportsNav';

export default function SalesDue({ 
    sales = { data: [] }, 
    summary = {}, 
    branches = [], 
    customers = [], 
    filters = {} 
}) {
    const { t, lang, toBn } = useLanguage();
    const isBn = lang === 'bn';

    const salesList = Array.isArray(sales) ? sales : (sales?.data || []);

    const [startDate, setStartDate] = useState(filters.start_date || '');
    const [endDate, setEndDate] = useState(filters.end_date || '');
    const [branchId, setBranchId] = useState(filters.branch_id || '');
    const [customerId, setCustomerId] = useState(filters.customer_id || '');
    const [status, setStatus] = useState(filters.status || 'all');
    const [aging, setAging] = useState(filters.aging || 'all');
    const [search, setSearch] = useState(filters.search || '');

    useFilter(route('reports.sales-due'), {
        start_date: startDate,
        end_date: endDate,
        branch_id: branchId,
        customer_id: customerId,
        status: status,
        aging: aging,
        search: search,
    });

    const resetFilters = () => {
        setStartDate('');
        setEndDate('');
        setBranchId('');
        setCustomerId('');
        setStatus('all');
        setAging('all');
        setSearch('');
    };

    const fmtMoney = (val) => {
        const formatted = Number(val || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        return isBn ? `৳ ${toBn(formatted)}` : `BDT ${formatted}`;
    };

    const getDaysAgo = (dateStr) => {
        if (!dateStr) return 0;
        const diff = Math.floor((new Date() - new Date(dateStr)) / (1000 * 60 * 60 * 24));
        return Math.max(0, diff);
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                            <AlertCircle className="w-6 h-6 text-rose-600" />
                            <span>{t('salesDueReport') || 'Sales Due Report'}</span>
                        </h2>
                        <p className="text-xs text-gray-500 mt-0.5">
                            {isBn ? 'গ্রাহকদের অপরিশোধিত ও আংশিক বকেয়া বিক্রয় চালানের বিস্তারিত বিবরণী' : 'Comprehensive register of unpaid and partially paid credit sales invoices'}
                        </p>
                    </div>

                    <div className="flex items-center gap-2 print:hidden">
                        <Link
                            href={route('sales.payments.index')}
                            className="px-3.5 py-2 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer hover:opacity-90"
                            style={{ backgroundColor: 'rgb(177, 118, 51)' }}
                        >
                            <CreditCard className="w-4 h-4" />
                            <span>{isBn ? 'বকেয়া আদায় এন্ট্রি' : 'Collect Payments'}</span>
                        </Link>
                        <button
                            type="button"
                            onClick={() => window.print()}
                            className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                        >
                            <Printer className="w-4 h-4" />
                            <span>{t('print')}</span>
                        </button>
                    </div>
                </div>
            }
        >
            <Head title={t('salesDueReport') || 'Sales Due Report'} />

            {/* Sales Reports Navigation Bar */}
            <SalesReportsNav activeTab="sales-due" />

            {/* Print Letterhead (Only visible in Print) */}
            <div className="hidden print:block mb-6 border-b border-gray-300 pb-3">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Jewelry ERP</h1>
                        <h2 className="text-sm font-semibold text-rose-700">{t('salesDueReport')}</h2>
                    </div>
                    <div className="text-right text-xs text-gray-600">
                        <p>{t('date')}: {isBn ? toBn(new Date().toLocaleDateString()) : new Date().toLocaleDateString()}</p>
                        <p className="font-bold text-rose-700">{isBn ? 'সর্বমোট বকেয়া:' : 'Total Due:'} {fmtMoney(summary.total_due_amount)}</p>
                    </div>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6 print:hidden">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 items-end">
                    <div>
                        <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">{t('startDate')}</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full text-xs rounded-xl border-gray-300 focus:ring-amber-500 focus:border-amber-500"
                        />
                    </div>

                    <div>
                        <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">{t('endDate')}</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full text-xs rounded-xl border-gray-300 focus:ring-amber-500 focus:border-amber-500"
                        />
                    </div>

                    <div>
                        <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">{t('branch')}</label>
                        <select
                            value={branchId}
                            onChange={(e) => setBranchId(e.target.value)}
                            className="w-full text-xs rounded-xl border-gray-300 focus:ring-amber-500 focus:border-amber-500"
                        >
                            <option value="">{t('allBranches')}</option>
                            {branches.map(b => (
                                <option key={b.id} value={b.id}>{b.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">{t('customers')}</label>
                        <select
                            value={customerId}
                            onChange={(e) => setCustomerId(e.target.value)}
                            className="w-full text-xs rounded-xl border-gray-300 focus:ring-amber-500 focus:border-amber-500"
                        >
                            <option value="">{t('allCustomers')}</option>
                            {customers.map(c => (
                                <option key={c.id} value={c.id}>{c.name} ({isBn ? toBn(c.phone) : c.phone})</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">{t('status')}</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full text-xs rounded-xl border-gray-300 focus:ring-amber-500 focus:border-amber-500"
                        >
                            <option value="all">{isBn ? 'সকল বকেয়া চালান' : 'All Due Invoices'}</option>
                            <option value="partial">{isBn ? 'আংশিক পরিশোধিত (Partial)' : 'Partially Paid'}</option>
                            <option value="unpaid">{isBn ? 'সম্পূর্ণ বকেয়া (Unpaid)' : 'Completely Unpaid'}</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">{isBn ? 'বকেয়ার বয়স (Aging)' : 'Aging'}</label>
                        <select
                            value={aging}
                            onChange={(e) => setAging(e.target.value)}
                            className="w-full text-xs rounded-xl border-gray-300 focus:ring-amber-500 focus:border-amber-500"
                        >
                            <option value="all">{isBn ? 'সকল সময়কাল' : 'All Durations'}</option>
                            <option value="under_30">{isBn ? '৩০ দিনের কম (Recent)' : '< 30 Days'}</option>
                            <option value="30_to_60">{isBn ? '৩০ থেকে ৬০ দিন' : '30 - 60 Days'}</option>
                            <option value="over_60">{isBn ? '৬০ দিনের অধিক (Old)' : '> 60 Days'}</option>
                            <option value="over_90">{isBn ? '৯০ দিনের অধিক (Critical)' : '> 90 Days'}</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-1.5">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder={isBn ? 'চালান বা ফোন...' : 'Search...'}
                                className="w-full text-xs rounded-xl border-gray-300 pl-8 focus:ring-amber-500 focus:border-amber-500"
                            />
                            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                        </div>
                        <button
                            type="button"
                            onClick={resetFilters}
                            title={t('reset')}
                            className="p-2 text-gray-500 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-xl transition cursor-pointer"
                        >
                            <RotateCcw className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Summary Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white border border-rose-100 p-4 rounded-2xl shadow-sm">
                    <p className="text-xs font-bold text-rose-500 uppercase">{t('totalDue') || 'Total Due Receivables'}</p>
                    <p className="text-2xl font-black text-rose-600 mt-1">{fmtMoney(summary.total_due_amount)}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{isBn ? 'চালানসমূহের বর্তমান মোট বাকি' : 'Outstanding balance on due sales'}</p>
                </div>

                <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm">
                    <p className="text-xs font-bold text-gray-500 uppercase">{isBn ? 'বকেয়া চালান সংখ্যা' : 'Due Invoices'}</p>
                    <p className="text-2xl font-black text-gray-900 mt-1">{isBn ? toBn(summary.total_due_invoices || 0) : (summary.total_due_invoices || 0)}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{isBn ? 'মোট বকেয়া ভাউচার' : 'Invoices awaiting completion'}</p>
                </div>

                <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm">
                    <p className="text-xs font-bold text-gray-500 uppercase">{isBn ? 'বকেয়া গ্রাহক সংখ্যা' : 'Due Customers'}</p>
                    <p className="text-2xl font-black text-amber-900 mt-1">{isBn ? toBn(summary.total_due_customers || 0) : (summary.total_due_customers || 0)}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{isBn ? 'অনন্য গ্রাহক অ্যাকাউন্ট' : 'Distinct customer accounts'}</p>
                </div>

                <div className="bg-white border border-rose-100 p-4 rounded-2xl shadow-sm">
                    <p className="text-xs font-bold text-rose-600 uppercase flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>{isBn ? '৩০ দিনের অধিক বাকি' : 'Overdue (>30 Days)'}</span>
                    </p>
                    <p className="text-2xl font-black text-rose-700 mt-1">{fmtMoney(summary.overdue_30_days)}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{isBn ? 'তাগাদা ও আদায় জরুরি' : 'Requires immediate follow-up'}</p>
                </div>
            </div>

            {/* Sales Due Table Card */}
            <div className="bg-white shadow-sm rounded-2xl border border-gray-100 p-4">
                <div className="flex items-center justify-between mb-3 px-1">
                    <div>
                        <h3 className="text-sm font-bold text-gray-900">{isBn ? 'বকেয়া চালানের তালিকা' : 'Credit & Overdue Invoices List'}</h3>
                        <p className="text-xs text-gray-500">{isBn ? 'চালান অনুযায়ী অপরিশোধিত অর্থ এবং সময়কাল' : 'Unsettled bills with age and customer reference'}</p>
                    </div>
                </div>

                {/* Table Container with Rule #1 overflow-x-visible pb-24 */}
                <div className="overflow-x-visible pb-24 rounded-xl border border-gray-100">
                    <table className="w-full text-left text-xs border-collapse">
                        <thead>
                            <tr style={{ backgroundColor: 'rgb(177, 118, 51)' }} className="text-white">
                                <th className="px-3.5 py-3 text-[11px] font-bold uppercase whitespace-nowrap">{t('sl') || (isBn ? 'ক্রমিক' : 'SL')}</th>
                                <th className="px-3.5 py-3 text-[11px] font-bold uppercase whitespace-nowrap">{t('invoiceNo') || 'Invoice'}</th>
                                <th className="px-3.5 py-3 text-[11px] font-bold uppercase whitespace-nowrap">{t('date')}</th>
                                <th className="px-3.5 py-3 text-[11px] font-bold uppercase whitespace-nowrap">{isBn ? 'বকেয়ার বয়স' : 'Aging (Days)'}</th>
                                <th className="px-3.5 py-3 text-[11px] font-bold uppercase whitespace-nowrap">{t('customer')}</th>
                                <th className="px-3.5 py-3 text-[11px] font-bold uppercase whitespace-nowrap">{t('branch')}</th>
                                <th className="px-3.5 py-3 text-[11px] font-bold uppercase whitespace-nowrap text-right">{t('grandTotal')}</th>
                                <th className="px-3.5 py-3 text-[11px] font-bold uppercase whitespace-nowrap text-right">{t('paidAmount')}</th>
                                <th className="px-3.5 py-3 text-[11px] font-bold uppercase whitespace-nowrap text-right text-white">{t('dueAmount')}</th>
                                <th className="px-3.5 py-3 text-[11px] font-bold uppercase whitespace-nowrap text-center">{t('status')}</th>
                                <th className="px-3.5 py-3 text-[11px] font-bold uppercase whitespace-nowrap text-right print:hidden">{t('actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {salesList.length > 0 ? (
                                salesList.map((sale, idx) => {
                                    const sl = ((sales?.current_page || 1) - 1) * (sales?.per_page || 10) + idx + 1;
                                    const daysAgo = getDaysAgo(sale.sale_date);
                                    const isCritical = daysAgo > 30;

                                    return (
                                        <tr key={sale.id} className="hover:bg-gray-50/60 transition">
                                            <td className="px-3.5 py-2.5 text-gray-500 font-mono text-[11px] whitespace-nowrap">
                                                {isBn ? toBn(sl) : sl}
                                            </td>
                                            <td className="px-3.5 py-2.5 font-bold text-amber-800 whitespace-nowrap font-mono text-[11px]">
                                                <Link href={route('sales.show', sale.id)} className="hover:underline">
                                                    {isBn ? toBn(sale.invoice_no) : sale.invoice_no}
                                                </Link>
                                            </td>
                                            <td className="px-3.5 py-2.5 text-gray-700 whitespace-nowrap">
                                                {isBn ? toBn(sale.sale_date) : sale.sale_date}
                                            </td>
                                            <td className="px-3.5 py-2.5 whitespace-nowrap">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                                                    isCritical 
                                                        ? 'bg-rose-100 text-rose-800 border border-rose-200' 
                                                        : 'bg-gray-100 text-gray-700'
                                                }`}>
                                                    <Clock className="w-3 h-3" />
                                                    {isBn ? `${toBn(daysAgo)} দিন` : `${daysAgo}d ago`}
                                                </span>
                                            </td>
                                            <td className="px-3.5 py-2.5 font-semibold text-gray-900 whitespace-nowrap">
                                                {sale.customer ? (
                                                    <div>
                                                        <Link 
                                                            href={route('reports.customer-ledger', { customer_id: sale.customer.id })}
                                                            className="hover:underline hover:text-amber-800"
                                                        >
                                                            {sale.customer.name}
                                                        </Link>
                                                        <p className="text-[10px] text-gray-400 font-normal">{isBn ? toBn(sale.customer.phone) : sale.customer.phone}</p>
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-500 italic">{isBn ? 'সাধারণ ক্রেতা' : 'Walk-in'}</span>
                                                )}
                                            </td>
                                            <td className="px-3.5 py-2.5 text-gray-600 whitespace-nowrap">{sale.branch?.name || '—'}</td>
                                            <td className="px-3.5 py-2.5 text-right font-bold text-gray-900 whitespace-nowrap">{fmtMoney(sale.grand_total)}</td>
                                            <td className="px-3.5 py-2.5 text-right font-bold text-emerald-600 whitespace-nowrap">{fmtMoney(sale.paid_amount)}</td>
                                            <td className="px-3.5 py-2.5 text-right font-black text-rose-600 whitespace-nowrap">{fmtMoney(sale.due_amount)}</td>
                                            <td className="px-3.5 py-2.5 text-center whitespace-nowrap">
                                                <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                                                    Number(sale.paid_amount) > 0 
                                                        ? 'bg-amber-100 text-amber-900 border border-amber-200' 
                                                        : 'bg-rose-100 text-rose-900 border border-rose-200'
                                                }`}>
                                                    {Number(sale.paid_amount) > 0 ? (isBn ? 'আংশিক পরিশোধ' : 'Partial') : (isBn ? 'সম্পূর্ণ বাকি' : 'Unpaid')}
                                                </span>
                                            </td>
                                            <td className="px-3.5 py-2.5 text-right whitespace-nowrap print:hidden">
                                                <Dropdown>
                                                    <Dropdown.Trigger>
                                                        <button
                                                            type="button"
                                                            className="inline-flex items-center px-3 py-1 border border-[#00b4d8] rounded-full text-[13px] font-medium text-[#00b4d8] bg-white hover:bg-[#00b4d8]/10 focus:outline-none transition ease-in-out duration-150 cursor-pointer"
                                                        >
                                                            {t('actions')}
                                                            <svg className="ml-1.5 -mr-0.5 h-3.5 w-3.5 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                            </svg>
                                                        </button>
                                                    </Dropdown.Trigger>
                                                    <Dropdown.Content align={salesList.length > 3 && idx >= salesList.length - 2 ? 'top-right' : 'right'} width="48">
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                router.visit(route('sales.payments.index'));
                                                            }}
                                                            className="block w-full px-4 py-2 text-start text-sm leading-5 text-emerald-700 hover:bg-emerald-50 focus:outline-none flex items-center cursor-pointer font-semibold"
                                                        >
                                                            <CreditCard className="w-3.5 h-3.5 mr-2 text-emerald-600" />
                                                            {isBn ? 'বকেয়া আদায় করুন' : 'Collect Payment'}
                                                        </button>
                                                        {sale.customer_id && (
                                                            <button
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    router.visit(route('reports.customer-ledger', { customer_id: sale.customer_id }));
                                                                }}
                                                                className="block w-full px-4 py-2 text-start text-sm leading-5 text-amber-800 hover:bg-amber-50 focus:outline-none flex items-center cursor-pointer font-semibold"
                                                            >
                                                                <BookOpen className="w-3.5 h-3.5 mr-2 text-amber-700" />
                                                                {isBn ? 'গ্রাহক খতিয়ান' : 'Customer Ledger'}
                                                            </button>
                                                        )}
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                router.visit(route('sales.show', sale.id));
                                                            }}
                                                            className="block w-full px-4 py-2 text-start text-sm leading-5 text-gray-700 hover:bg-gray-100 focus:outline-none flex items-center cursor-pointer"
                                                        >
                                                            <Eye className="w-3.5 h-3.5 mr-2 text-gray-400" />
                                                            {isBn ? 'চালান দেখুন' : 'View Invoice'}
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                window.open(route('sales.print', sale.id), '_blank');
                                                            }}
                                                            className="block w-full px-4 py-2 text-start text-sm leading-5 text-gray-700 hover:bg-gray-100 focus:outline-none flex items-center cursor-pointer"
                                                        >
                                                            <Printer className="w-3.5 h-3.5 mr-2 text-gray-400" />
                                                            {isBn ? 'চালান প্রিন্ট' : 'Print Invoice'}
                                                        </button>
                                                    </Dropdown.Content>
                                                </Dropdown>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="11" className="p-12 text-center text-gray-400">
                                        <div className="flex flex-col items-center justify-center">
                                            <CheckCircle2 className="w-8 h-8 text-emerald-400 mb-2" />
                                            <p className="font-semibold text-gray-600">{isBn ? 'কোনো বকেয়া বিক্রয় রেকর্ড নেই!' : 'No due sales records found!'}</p>
                                            <p className="text-xs text-gray-400 mt-0.5">{isBn ? 'সকল চালান সফলভাবে পরিশোধিত।' : 'All matching invoices have been fully settled.'}</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination (Rule #4) */}
                {sales?.links && (
                    <div className="mt-4 print:hidden">
                        <Pagination links={sales.links} />
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
