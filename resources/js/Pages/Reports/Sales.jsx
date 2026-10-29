import React, { useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Pagination from '@/Components/Pagination';
import Dropdown from '@/Components/Dropdown';
import { 
    LineChart, Printer, Eye, CreditCard, BookOpen, Search, Filter, RotateCcw
} from 'lucide-react';
import useFilter from '@/Hooks/useFilter';
import { useLanguage } from '@/Context/LanguageContext';
import SalesReportsNav from './Components/SalesReportsNav';

export default function Sales({ 
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
    const [status, setStatus] = useState(filters.status || '');
    const [saleType, setSaleType] = useState(filters.sale_type || 'all');
    const [search, setSearch] = useState(filters.search || '');

    useFilter(route('reports.sales'), {
        start_date: startDate,
        end_date: endDate,
        branch_id: branchId,
        customer_id: customerId,
        status: status,
        sale_type: saleType,
        search: search,
    });

    const resetFilters = () => {
        setStartDate('');
        setEndDate('');
        setBranchId('');
        setCustomerId('');
        setStatus('');
        setSaleType('all');
        setSearch('');
    };

    const fmtMoney = (val) => {
        const formatted = Number(val || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        return isBn ? `৳ ${toBn(formatted)}` : `BDT ${formatted}`;
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                            <LineChart className="w-6 h-6" style={{ color: 'rgb(177, 118, 51)' }} />
                            <span>{t('allSalesReport') || 'All Sales Report'}</span>
                        </h2>
                        <p className="text-xs text-gray-500 mt-0.5">
                            {isBn ? 'সকল রিটেইল ও পাইকারি বিক্রয়ের নিরীক্ষিত প্রতিবেদন' : 'Comprehensive retail & wholesale sales register and audit report'}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => window.print()}
                        className="px-4 py-2 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer print:hidden"
                        style={{ backgroundColor: 'rgb(177, 118, 51)' }}
                    >
                        <Printer className="w-4 h-4" />
                        <span>{t('print')}</span>
                    </button>
                </div>
            }
        >
            <Head title={t('allSalesReport') || 'All Sales Report'} />

            {/* Sales Reports Navigation Bar */}
            <SalesReportsNav activeTab="sales" />

            {/* Print Letterhead (Only visible in Print) */}
            <div className="hidden print:block mb-6 border-b border-gray-300 pb-3">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Jewelry ERP</h1>
                        <h2 className="text-sm font-semibold text-gray-700">{t('allSalesReport')}</h2>
                    </div>
                    <div className="text-right text-xs text-gray-600">
                        {startDate && endDate && (
                            <p>{t('startDate')}: {isBn ? toBn(startDate) : startDate} - {t('endDate')}: {isBn ? toBn(endDate) : endDate}</p>
                        )}
                        <p>{t('Printed') || 'Printed'}: {isBn ? toBn(new Date().toLocaleDateString()) : new Date().toLocaleDateString()}</p>
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
                            <option value="">{isBn ? 'সকল অবস্থা' : 'All Status'}</option>
                            <option value="completed">{isBn ? 'পরিশোধিত (Completed)' : 'Completed'}</option>
                            <option value="pending">{isBn ? 'বকেয়া (Pending)' : 'Pending'}</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">{isBn ? 'বিক্রয়ের ধরন' : 'Sale Type'}</label>
                        <select
                            value={saleType}
                            onChange={(e) => setSaleType(e.target.value)}
                            className="w-full text-xs rounded-xl border-gray-300 focus:ring-amber-500 focus:border-amber-500"
                        >
                            <option value="all">{isBn ? 'সকল (খুচরা ও পাইকারি)' : 'All Types'}</option>
                            <option value="retail">{isBn ? 'খুচরা বিক্রয়' : 'Retail'}</option>
                            <option value="wholesale">{isBn ? 'পাইকারি বিক্রয়' : 'Wholesale'}</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-1.5">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder={isBn ? 'ইনভয়েস বা ফোন...' : 'Invoice / phone...'}
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
                <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm">
                    <p className="text-xs font-bold text-gray-500 uppercase">{t('totalSales') || 'Total Invoices'}</p>
                    <p className="text-2xl font-black text-gray-900 mt-1">{isBn ? toBn(summary.total_sales || 0) : (summary.total_sales || 0)}</p>
                </div>

                <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm">
                    <p className="text-xs font-bold text-gray-500 uppercase">{t('grandTotal')}</p>
                    <p className="text-2xl font-black text-amber-900 mt-1">{fmtMoney(summary.total_grand)}</p>
                </div>

                <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm">
                    <p className="text-xs font-bold text-gray-500 uppercase">{t('paidAmount')}</p>
                    <p className="text-2xl font-black text-emerald-600 mt-1">{fmtMoney(summary.total_paid)}</p>
                </div>

                <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm">
                    <p className="text-xs font-bold text-gray-500 uppercase">{t('dueAmount')}</p>
                    <p className="text-2xl font-black text-rose-600 mt-1">{fmtMoney(summary.total_due)}</p>
                </div>
            </div>

            {/* Sales Table Card */}
            <div className="bg-white shadow-sm rounded-2xl border border-gray-100 p-4">
                {/* Table Container with Rule #1 overflow-x-visible pb-24 */}
                <div className="overflow-x-visible pb-24 rounded-xl border border-gray-100">
                    <table className="w-full text-left text-xs border-collapse">
                        <thead>
                            <tr style={{ backgroundColor: 'rgb(177, 118, 51)' }} className="text-white">
                                <th className="px-3.5 py-3 text-[11px] font-bold uppercase whitespace-nowrap">{t('sl') || (isBn ? 'ক্রমিক' : 'SL')}</th>
                                <th className="px-3.5 py-3 text-[11px] font-bold uppercase whitespace-nowrap">{t('invoiceNo') || 'Invoice'}</th>
                                <th className="px-3.5 py-3 text-[11px] font-bold uppercase whitespace-nowrap">{t('date')}</th>
                                <th className="px-3.5 py-3 text-[11px] font-bold uppercase whitespace-nowrap">{t('customer')}</th>
                                <th className="px-3.5 py-3 text-[11px] font-bold uppercase whitespace-nowrap">{t('branch')}</th>
                                <th className="px-3.5 py-3 text-[11px] font-bold uppercase whitespace-nowrap text-right">{t('grandTotal')}</th>
                                <th className="px-3.5 py-3 text-[11px] font-bold uppercase whitespace-nowrap text-right">{t('paidAmount')}</th>
                                <th className="px-3.5 py-3 text-[11px] font-bold uppercase whitespace-nowrap text-right">{t('dueAmount')}</th>
                                <th className="px-3.5 py-3 text-[11px] font-bold uppercase whitespace-nowrap text-center">{t('status')}</th>
                                <th className="px-3.5 py-3 text-[11px] font-bold uppercase whitespace-nowrap text-right print:hidden">{t('actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {salesList.length > 0 ? (
                                salesList.map((sale, idx) => {
                                    const sl = ((sales?.current_page || 1) - 1) * (sales?.per_page || 10) + idx + 1;
                                    return (
                                    <tr key={sale.id} className="hover:bg-gray-50/60 transition">
                                        <td className="px-3.5 py-2.5 text-gray-500 font-mono text-[11px] whitespace-nowrap">
                                            {isBn ? toBn(sl) : sl}
                                        </td>
                                        <td className="px-3.5 py-2.5 font-bold text-amber-800 whitespace-nowrap">
                                            <Link href={route('sales.show', sale.id)} className="hover:underline">
                                                {isBn ? toBn(sale.invoice_no) : sale.invoice_no}
                                            </Link>
                                        </td>
                                        <td className="px-3.5 py-2.5 text-gray-700 whitespace-nowrap">{isBn ? toBn(sale.sale_date) : sale.sale_date}</td>
                                        <td className="px-3.5 py-2.5 font-semibold text-gray-900">
                                            {sale.customer ? (
                                                <div>
                                                    <p>{sale.customer.name}</p>
                                                    <p className="text-[10px] text-gray-400 font-normal">{isBn ? toBn(sale.customer.phone) : sale.customer.phone}</p>
                                                </div>
                                            ) : (
                                                <span className="text-gray-500 italic">{isBn ? 'সাধারণ ক্রেতা' : 'Walk-in'}</span>
                                            )}
                                        </td>
                                        <td className="px-3.5 py-2.5 text-gray-600 whitespace-nowrap">{sale.branch?.name || '—'}</td>
                                        <td className="px-3.5 py-2.5 text-right font-bold text-gray-900 whitespace-nowrap">{fmtMoney(sale.grand_total)}</td>
                                        <td className="px-3.5 py-2.5 text-right font-bold text-emerald-600 whitespace-nowrap">{fmtMoney(sale.paid_amount)}</td>
                                        <td className="px-3.5 py-2.5 text-right font-bold text-rose-600 whitespace-nowrap">{fmtMoney(sale.due_amount)}</td>
                                        <td className="px-3.5 py-2.5 text-center whitespace-nowrap">
                                            <span className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] uppercase ${
                                                sale.status === 'completed' 
                                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                                                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                                            }`}>
                                                {sale.status === 'completed' ? (isBn ? 'পরিশোধিত' : 'Completed') : (isBn ? 'বকেয়া' : 'Pending')}
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
                                                    {Number(sale.due_amount) > 0 && (
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
                                                    )}
                                                    {sale.customer_id && (
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                router.visit(route('reports.customer-ledger', { customer_id: sale.customer_id }));
                                                            }}
                                                            className="block w-full px-4 py-2 text-start text-sm leading-5 text-amber-800 hover:bg-amber-50 focus:outline-none flex items-center cursor-pointer"
                                                        >
                                                            <BookOpen className="w-3.5 h-3.5 mr-2 text-amber-700" />
                                                            {isBn ? 'গ্রাহক খতিয়ান' : 'Customer Ledger'}
                                                        </button>
                                                    )}
                                                </Dropdown.Content>
                                            </Dropdown>
                                        </td>
                                    </tr>
                                );
                            })
                            ) : (
                                <tr>
                                    <td colSpan="10" className="p-12 text-center text-gray-400">
                                        {t('noSalesRecords') || (isBn ? 'কোন বিক্রয় রেকর্ড পাওয়া যায়নি।' : 'No sales records found.')}
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
