import React, { useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Pagination from '@/Components/Pagination';
import Dropdown from '@/Components/Dropdown';
import { 
    BookOpen, Printer, ArrowLeft, Search, Filter, RotateCcw, 
    User, Phone, MapPin, CreditCard, Eye, TrendingUp, TrendingDown,
    FileSpreadsheet, CheckCircle2, Clock
} from 'lucide-react';
import useFilter from '@/Hooks/useFilter';
import { useLanguage } from '@/Context/LanguageContext';
import SalesReportsNav from './Components/SalesReportsNav';

export default function CustomerLedger({ 
    customer = null, 
    ledgerEntries = null, 
    allEntries = [],
    customersList = null, 
    summary = {}, 
    branches = [], 
    allCustomersDropdown = [], 
    filters = {} 
}) {
    const { t, lang, toBn } = useLanguage();
    const isBn = lang === 'bn';

    const [customerId, setCustomerId] = useState(filters.customer_id || '');
    const [startDate, setStartDate] = useState(filters.start_date || '');
    const [endDate, setEndDate] = useState(filters.end_date || '');
    const [branchId, setBranchId] = useState(filters.branch_id || '');
    const [search, setSearch] = useState(filters.search || '');

    useFilter(route('reports.customer-ledger'), {
        customer_id: customerId,
        start_date: startDate,
        end_date: endDate,
        branch_id: branchId,
        search: search,
    });

    const resetFilters = () => {
        setStartDate('');
        setEndDate('');
        setBranchId('');
        setSearch('');
    };

    const clearCustomer = () => {
        setCustomerId('');
    };

    const fmtMoney = (val) => {
        const formatted = Number(val || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        return isBn ? `৳ ${toBn(formatted)}` : `BDT ${formatted}`;
    };

    const ledgerList = Array.isArray(ledgerEntries) ? ledgerEntries : (ledgerEntries?.data || []);
    const printItems = allEntries && allEntries.length > 0 ? allEntries : ledgerList;
    const customerDirectory = Array.isArray(customersList) ? customersList : (customersList?.data || []);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                            <BookOpen className="w-6 h-6" style={{ color: 'rgb(177, 118, 51)' }} />
                            <span>{t('customerLedger') || 'Customer Ledger'}</span>
                        </h2>
                        <p className="text-xs text-gray-500 mt-0.5">
                            {customer 
                                ? (isBn ? `গ্রাহক ${customer.name}-এর আর্থিক লেনদেন ও ব্যালেন্স খতিয়ান` : `Financial transaction register & balance statement for ${customer.name}`)
                                : (isBn ? 'সকল গ্রাহকের জের ও লেনদেন খতিয়ান তালিকা' : 'Comprehensive customer accounts ledger directory & receivables')}
                        </p>
                    </div>

                    <div className="flex items-center gap-2 print:hidden">
                        {customer && (
                            <button
                                type="button"
                                onClick={clearCustomer}
                                className="px-3.5 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                            >
                                <ArrowLeft className="w-3.5 h-3.5" />
                                <span>{isBn ? 'সকল গ্রাহকের তালিকা' : 'All Customers'}</span>
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={() => window.print()}
                            className="px-4 py-2 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
                            style={{ backgroundColor: 'rgb(177, 118, 51)' }}
                        >
                            <Printer className="w-4 h-4" />
                            <span>{t('print')}</span>
                        </button>
                    </div>
                </div>
            }
        >
            <Head title={`${t('customerLedger') || 'Customer Ledger'}${customer ? ` - ${customer.name}` : ''}`} />

            {/* Sales Reports Navigation Bar */}
            <SalesReportsNav activeTab="customer-ledger" />

            {/* Printable Customer Account Statement Header */}
            <div className="hidden print:block mb-6 border-b border-gray-300 pb-4">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-black text-gray-900">Jewelry ERP</h1>
                        <p className="text-xs text-gray-600">{isBn ? 'স্বর্ণালংকার ও রত্ন ব্যবসায়ী' : 'Jewelry Manufacturing & Retail'}</p>
                        <h2 className="text-sm font-bold text-gray-800 mt-2">{t('customerStatement') || 'Customer Account Statement'}</h2>
                    </div>
                    <div className="text-right text-xs text-gray-700 space-y-0.5">
                        <p className="font-semibold">{t('date')}: {isBn ? toBn(new Date().toLocaleDateString()) : new Date().toLocaleDateString()}</p>
                        {startDate && endDate && (
                            <p className="text-gray-600">{isBn ? 'বিবরণীর সময়কাল:' : 'Period:'} {isBn ? toBn(startDate) : startDate} - {isBn ? toBn(endDate) : endDate}</p>
                        )}
                    </div>
                </div>

                {customer && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200 grid grid-cols-2 gap-2 text-xs">
                        <div>
                            <p className="font-bold text-gray-900">{customer.name}</p>
                            <p className="text-gray-600">{isBn ? 'মোবাইল:' : 'Phone:'} {isBn ? toBn(customer.phone) : customer.phone}</p>
                            <p className="text-gray-600">{isBn ? 'ঠিকানা:' : 'Address:'} {customer.address || '—'}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-gray-600">{isBn ? 'গ্রাহক কোড:' : 'Customer Code:'} <span className="font-mono font-bold">{isBn ? toBn(customer.code) : customer.code}</span></p>
                            <p className="text-gray-600">{isBn ? 'বর্তমান বকেয়া জের:' : 'Net Balance Due:'} <span className="font-bold text-rose-700">{fmtMoney(summary.closing_balance)}</span></p>
                        </div>
                    </div>
                )}
            </div>

            {/* Filter Bar */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6 print:hidden">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 items-end">
                    <div className="lg:col-span-2">
                        <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">{t('selectCustomer') || 'Customer'}</label>
                        <select
                            value={customerId}
                            onChange={(e) => setCustomerId(e.target.value)}
                            className="w-full text-xs rounded-xl border-gray-300 focus:ring-amber-500 focus:border-amber-500 font-medium"
                        >
                            <option value="">{isBn ? '-- সকল গ্রাহকের ওভারভিউ তালিকা --' : '-- All Customers (Overview List) --'}</option>
                            {allCustomersDropdown.map(c => (
                                <option key={c.id} value={c.id}>
                                    {c.name} ({isBn ? toBn(c.phone) : c.phone}) {c.code ? `[${isBn ? toBn(c.code) : c.code}]` : ''}
                                </option>
                            ))}
                        </select>
                    </div>

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

                    <div className="flex items-center gap-1.5">
                        {!customer && (
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder={isBn ? 'নাম বা ফোন...' : 'Search...'}
                                    className="w-full text-xs rounded-xl border-gray-300 pl-8 focus:ring-amber-500 focus:border-amber-500"
                                />
                                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                            </div>
                        )}
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

            {/* MODE 1: SINGLE CUSTOMER DETAILED LEDGER */}
            {customer ? (
                <div className="space-y-6">
                    {/* Customer Profile Banner */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 print:hidden">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white shadow-sm" style={{ backgroundColor: 'rgb(177, 118, 51)' }}>
                                    <User className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-base font-bold text-gray-900">{customer.name}</h3>
                                        <span className="text-[10px] bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-full font-mono font-bold">
                                            {isBn ? toBn(customer.code) : customer.code}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mt-1">
                                        <span className="flex items-center gap-1">
                                            <Phone className="w-3.5 h-3.5 text-gray-400" />
                                            {isBn ? toBn(customer.phone) : customer.phone}
                                        </span>
                                        {customer.address && (
                                            <span className="flex items-center gap-1">
                                                <MapPin className="w-3.5 h-3.5 text-gray-400" />
                                                {customer.address}
                                            </span>
                                        )}
                                        {customer.branch && (
                                            <span className="text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md font-medium">
                                                {customer.branch.name}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 border-t md:border-t-0 pt-3 md:pt-0">
                                <Link
                                    href={route('sales.payments.index')}
                                    className="px-3.5 py-2 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer hover:opacity-90"
                                    style={{ backgroundColor: 'rgb(177, 118, 51)' }}
                                >
                                    <CreditCard className="w-3.5 h-3.5" />
                                    <span>{isBn ? 'বকেয়া আদায়' : 'Collect Due'}</span>
                                </Link>
                                <Link
                                    href={route('customers.show', customer.id)}
                                    className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                                >
                                    <Eye className="w-3.5 h-3.5" />
                                    <span>{isBn ? 'প্রোফাইল' : 'Profile'}</span>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Summary KPI Cards for Single Customer */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm">
                            <p className="text-xs font-bold text-gray-500 uppercase">{t('openingDue') || 'Opening Balance'}</p>
                            <p className={`text-2xl font-black mt-1 ${summary.opening_balance > 0 ? 'text-amber-900' : 'text-gray-900'}`}>
                                {fmtMoney(summary.opening_balance)}
                            </p>
                            <p className="text-[11px] text-gray-400 mt-0.5">{isBn ? 'শুরুর তারিখের পূর্বের জের' : 'Balance prior to selected period'}</p>
                        </div>

                        <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm">
                            <p className="text-xs font-bold text-gray-500 uppercase">{t('periodSales') || 'New Invoices (Debit +)'}</p>
                            <p className="text-2xl font-black text-amber-800 mt-1">{fmtMoney(summary.total_debit)}</p>
                            <p className="text-[11px] text-gray-400 mt-0.5">{isBn ? 'সময়কালের মোট পণ্য বিক্রয়' : 'Sales invoices in this period'}</p>
                        </div>

                        <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm">
                            <p className="text-xs font-bold text-gray-500 uppercase">{t('periodPayments') || 'Paid & Returns (Credit -)'}</p>
                            <p className="text-2xl font-black text-emerald-600 mt-1">{fmtMoney(summary.total_credit)}</p>
                            <p className="text-[11px] text-gray-400 mt-0.5">{isBn ? 'সময়কালের মোট জমা ও ফেরত' : 'Total payments & returns credited'}</p>
                        </div>

                        <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm">
                            <p className="text-xs font-bold text-gray-500 uppercase">{t('closingDue') || 'Net Closing Due'}</p>
                            <p className={`text-2xl font-black mt-1 ${summary.closing_balance > 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
                                {fmtMoney(summary.closing_balance)}
                            </p>
                            <p className="text-[11px] text-gray-400 mt-0.5">
                                {summary.closing_balance > 0 
                                    ? (isBn ? 'গ্রাহকের নিকট মোট প্রাপ্য বকেয়া' : 'Receivable outstanding balance') 
                                    : (isBn ? 'হিসাব পরিশোধিত / কোনো বকেয়া নেই' : 'Fully settled / Nil balance')}
                            </p>
                        </div>
                    </div>

                    {/* Detailed Chronological Ledger Table */}
                    <div className="bg-white shadow-sm rounded-2xl border border-gray-100 p-4">
                        <div className="flex items-center justify-between mb-3 px-1">
                            <div>
                                <h4 className="text-sm font-bold text-gray-900">{isBn ? 'ধারাবাহিক খতিয়ান বিবরণী' : 'Chronological Account Ledger'}</h4>
                                <p className="text-xs text-gray-500">{isBn ? 'বিক্রয় (+), পেমেন্ট জমা (-) এবং রানিং জের' : 'Sales (+), Payments credited (-), and Running Balance'}</p>
                            </div>
                            <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                {isBn ? `মোট লেনদেন: ${toBn(summary.total_transactions || 0)} টি` : `Total Entries: ${summary.total_transactions || 0}`}
                            </span>
                        </div>

                        {/* Table Container with Rule #1 overflow-x-visible pb-24 */}
                        <div className="overflow-x-visible pb-24 rounded-xl border border-gray-100">
                            <table className="w-full text-left text-xs border-collapse">
                                <thead>
                                    <tr style={{ backgroundColor: 'rgb(177, 118, 51)' }} className="text-white">
                                        <th className="px-3.5 py-3 text-[11px] font-bold uppercase whitespace-nowrap">{t('sl') || (isBn ? 'ক্রমিক' : 'SL')}</th>
                                        <th className="px-3.5 py-3 text-[11px] font-bold uppercase whitespace-nowrap">{t('date')}</th>
                                        <th className="px-3.5 py-3 text-[11px] font-bold uppercase whitespace-nowrap">{isBn ? 'লেনদেনের ধরন' : 'Transaction Type'}</th>
                                        <th className="px-3.5 py-3 text-[11px] font-bold uppercase whitespace-nowrap">{isBn ? 'ভাউচার / চালান নং' : 'Voucher / Ref'}</th>
                                        <th className="px-3.5 py-3 text-[11px] font-bold uppercase">{isBn ? 'বিবরণ ও নোট' : 'Particulars & Note'}</th>
                                        <th className="px-3.5 py-3 text-[11px] font-bold uppercase text-right whitespace-nowrap">{t('debitSale') || 'Debit (+)'}</th>
                                        <th className="px-3.5 py-3 text-[11px] font-bold uppercase text-right whitespace-nowrap">{t('creditPayment') || 'Credit (-)'}</th>
                                        <th className="px-3.5 py-3 text-[11px] font-bold uppercase text-right whitespace-nowrap">{t('runningBalance') || 'Running Due'}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {/* Opening Balance Row */}
                                    <tr className="bg-amber-50/40 font-semibold text-gray-700">
                                        <td className="px-3.5 py-2.5 text-gray-400 font-mono text-[11px] whitespace-nowrap">—</td>
                                        <td className="px-3.5 py-2.5 whitespace-nowrap">{isBn ? toBn(startDate || '—') : (startDate || '—')}</td>
                                        <td className="px-3.5 py-2.5 whitespace-nowrap">
                                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-900 border border-amber-200">
                                                {isBn ? 'প্রারম্ভিক জের' : 'Opening'}
                                            </span>
                                        </td>
                                        <td className="px-3.5 py-2.5 text-gray-500 font-mono text-[11px]">—</td>
                                        <td className="px-3.5 py-2.5 text-gray-600">{isBn ? 'বিবরণী শুরুর আগের উদ্বৃত্ত জের' : 'Balance brought forward from previous records'}</td>
                                        <td className="px-3.5 py-2.5 text-right font-bold text-gray-700">—</td>
                                        <td className="px-3.5 py-2.5 text-right font-bold text-gray-700">—</td>
                                        <td className="px-3.5 py-2.5 text-right font-black text-amber-900">{fmtMoney(summary.opening_balance)}</td>
                                    </tr>

                                    {/* Interactive / Chronological Rows */}
                                    {ledgerList.length > 0 ? (
                                        ledgerList.map((entry, idx) => {
                                            const sl = ((ledgerEntries?.current_page || 1) - 1) * (ledgerEntries?.per_page || 10) + idx + 1;
                                            return (
                                            <tr key={entry.id} className="hover:bg-gray-50/60 transition">
                                                <td className="px-3.5 py-2.5 text-gray-500 font-mono text-[11px] whitespace-nowrap">
                                                    {isBn ? toBn(sl) : sl}
                                                </td>
                                                <td className="px-3.5 py-2.5 text-gray-700 whitespace-nowrap font-medium">
                                                    {isBn ? toBn(entry.date) : entry.date}
                                                </td>
                                                <td className="px-3.5 py-2.5 whitespace-nowrap">
                                                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                                        entry.type === 'sale' 
                                                            ? 'bg-amber-100 text-amber-900 border border-amber-200' 
                                                            : entry.type === 'payment'
                                                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                                                            : 'bg-blue-100 text-blue-900 border border-blue-200'
                                                    }`}>
                                                        {entry.type === 'sale' ? (isBn ? 'বিক্রয় চালান' : 'Sale Invoice') : entry.type === 'payment' ? (isBn ? 'পেমেন্ট জমা' : 'Payment') : (isBn ? 'বিক্রয় ফেরত' : 'Return')}
                                                    </span>
                                                </td>
                                                <td className="px-3.5 py-2.5 font-bold text-amber-800 whitespace-nowrap font-mono text-[11px]">
                                                    {isBn ? toBn(entry.ref_no) : entry.ref_no}
                                                </td>
                                                <td className="px-3.5 py-2.5 text-gray-700">
                                                    <p className="font-semibold">{entry.particulars}</p>
                                                    {entry.note && (
                                                        <p className="text-[10px] text-gray-400 mt-0.5">{entry.note}</p>
                                                    )}
                                                </td>
                                                <td className="px-3.5 py-2.5 text-right font-bold text-amber-900 whitespace-nowrap">
                                                    {entry.debit > 0 ? fmtMoney(entry.debit) : '—'}
                                                </td>
                                                <td className="px-3.5 py-2.5 text-right font-bold text-emerald-600 whitespace-nowrap">
                                                    {entry.credit > 0 ? fmtMoney(entry.credit) : '—'}
                                                </td>
                                                <td className={`px-3.5 py-2.5 text-right font-black whitespace-nowrap ${entry.running_balance > 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
                                                    {fmtMoney(entry.running_balance)}
                                                </td>
                                            </tr>
                                        );
                                    })
                                    ) : (
                                        <tr>
                                            <td colSpan="8" className="p-8 text-center text-gray-400">
                                                {isBn ? 'নির্বাচিত সময়কালে কোনো লেনদেন পাওয়া যায়নি।' : 'No transactions recorded in this period.'}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                                <tfoot>
                                    <tr className="bg-gray-100/80 font-bold border-t border-gray-200">
                                        <td colSpan="5" className="px-3.5 py-3 text-right uppercase text-gray-700">
                                            {isBn ? 'মোট সময়কালীন লেনদেন ও সমাপনী জের:' : 'Period Total & Net Closing Due:'}
                                        </td>
                                        <td className="px-3.5 py-3 text-right text-amber-900 font-black">{fmtMoney(summary.total_debit)}</td>
                                        <td className="px-3.5 py-3 text-right text-emerald-700 font-black">{fmtMoney(summary.total_credit)}</td>
                                        <td className={`px-3.5 py-3 text-right font-black ${summary.closing_balance > 0 ? 'text-rose-700' : 'text-emerald-700'}`}>
                                            {fmtMoney(summary.closing_balance)}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>

                        {/* Pagination (Rule #4) */}
                        {ledgerEntries?.links && (
                            <div className="mt-4 print:hidden">
                                <Pagination links={ledgerEntries.links} />
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                /* MODE 2: ALL CUSTOMERS DIRECTORY OVERVIEW */
                <div className="space-y-6">
                    {/* Overall Summary KPI Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm">
                            <p className="text-xs font-bold text-gray-500 uppercase">{t('totalCustomers') || 'Total Customers'}</p>
                            <p className="text-2xl font-black text-gray-900 mt-1">{isBn ? toBn(summary.total_customers || 0) : (summary.total_customers || 0)}</p>
                            <p className="text-[11px] text-gray-400 mt-0.5">{isBn ? 'তালিকাভুক্ত নিবন্ধিত গ্রাহক' : 'Registered customer accounts'}</p>
                        </div>

                        <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm">
                            <p className="text-xs font-bold text-gray-500 uppercase">{t('customerDues') || 'Total Receivables (Dues)'}</p>
                            <p className="text-2xl font-black text-rose-600 mt-1">{fmtMoney(summary.total_due_balance)}</p>
                            <p className="text-[11px] text-gray-400 mt-0.5">{isBn ? 'গ্রাহকদের নিকট সর্বমোট বকেয়া' : 'Total current customer balances'}</p>
                        </div>

                        <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm">
                            <p className="text-xs font-bold text-gray-500 uppercase">{t('periodSales') || 'Invoiced in Period'}</p>
                            <p className="text-2xl font-black text-amber-900 mt-1">{fmtMoney(summary.total_invoiced_period)}</p>
                            <p className="text-[11px] text-gray-400 mt-0.5">{isBn ? 'সময়কালের মোট পণ্য বিক্রয়' : 'Total sales in period'}</p>
                        </div>

                        <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm">
                            <p className="text-xs font-bold text-gray-500 uppercase">{t('periodPayments') || 'Collected in Period'}</p>
                            <p className="text-2xl font-black text-emerald-600 mt-1">{fmtMoney(summary.total_collected_period)}</p>
                            <p className="text-[11px] text-gray-400 mt-0.5">{isBn ? 'সময়কালের মোট আদায়কৃত টাকা' : 'Collections in period'}</p>
                        </div>
                    </div>

                    {/* Customer Directory Table Card */}
                    <div className="bg-white shadow-sm rounded-2xl border border-gray-100 p-4">
                        <div className="flex items-center justify-between mb-3 px-1">
                            <div>
                                <h3 className="text-sm font-bold text-gray-900">{isBn ? 'গ্রাহকদের খতিয়ান ও হিসাব তালিকা' : 'Customer Account Ledgers Directory'}</h3>
                                <p className="text-xs text-gray-500">{isBn ? 'বিস্তারিত লেজার দেখতে যেকোনো গ্রাহক নির্বাচন করুন' : 'Click on any customer to view their complete statement'}</p>
                            </div>
                        </div>

                        {/* Table Container with Rule #1 overflow-x-visible pb-24 */}
                        <div className="overflow-x-visible pb-24 rounded-xl border border-gray-100">
                            <table className="w-full text-left text-xs border-collapse">
                                <thead>
                                    <tr style={{ backgroundColor: 'rgb(177, 118, 51)' }} className="text-white">
                                        <th className="px-3.5 py-3 text-[11px] font-bold uppercase whitespace-nowrap">{t('sl') || (isBn ? 'ক্রমিক' : 'SL')}</th>
                                        <th className="px-3.5 py-3 text-[11px] font-bold uppercase whitespace-nowrap">{isBn ? 'কোড' : 'Code'}</th>
                                        <th className="px-3.5 py-3 text-[11px] font-bold uppercase whitespace-nowrap">{t('customer')}</th>
                                        <th className="px-3.5 py-3 text-[11px] font-bold uppercase whitespace-nowrap">{t('branch')}</th>
                                        <th className="px-3.5 py-3 text-[11px] font-bold uppercase whitespace-nowrap text-right">{t('openingBalance') || 'Opening'}</th>
                                        <th className="px-3.5 py-3 text-[11px] font-bold uppercase whitespace-nowrap text-right">{isBn ? 'সময়কালীন বিক্রয়' : 'Period Sales'}</th>
                                        <th className="px-3.5 py-3 text-[11px] font-bold uppercase whitespace-nowrap text-right">{isBn ? 'সময়কালীন জমা' : 'Period Payments'}</th>
                                        <th className="px-3.5 py-3 text-[11px] font-bold uppercase whitespace-nowrap text-right">{t('dueAmount')}</th>
                                        <th className="px-3.5 py-3 text-[11px] font-bold uppercase whitespace-nowrap text-right print:hidden">{t('actions')}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {customerDirectory.length > 0 ? (
                                        customerDirectory.map((c, idx) => {
                                            const sl = ((customersList?.current_page || 1) - 1) * (customersList?.per_page || 10) + idx + 1;
                                            return (
                                            <tr key={c.id} className="hover:bg-gray-50/60 transition">
                                                <td className="px-3.5 py-2.5 text-gray-500 font-mono text-[11px] whitespace-nowrap">
                                                    {isBn ? toBn(sl) : sl}
                                                </td>
                                                <td className="px-3.5 py-2.5 font-mono text-amber-800 font-bold whitespace-nowrap">
                                                    {isBn ? toBn(c.code) : c.code}
                                                </td>
                                                <td className="px-3.5 py-2.5 font-bold text-gray-900 whitespace-nowrap">
                                                    <button
                                                        type="button"
                                                        onClick={() => setCustomerId(c.id)}
                                                        className="hover:underline text-start cursor-pointer text-gray-900 hover:text-amber-800"
                                                    >
                                                        {c.name}
                                                    </button>
                                                    <p className="text-[10px] text-gray-400 font-normal">{isBn ? toBn(c.phone) : c.phone}</p>
                                                </td>
                                                <td className="px-3.5 py-2.5 text-gray-600 whitespace-nowrap">{c.branch?.name || '—'}</td>
                                                <td className="px-3.5 py-2.5 text-right font-bold text-gray-700 whitespace-nowrap">{fmtMoney(c.opening_balance)}</td>
                                                <td className="px-3.5 py-2.5 text-right font-bold text-amber-900 whitespace-nowrap">{fmtMoney(c.period_sales)}</td>
                                                <td className="px-3.5 py-2.5 text-right font-bold text-emerald-600 whitespace-nowrap">{fmtMoney(c.period_payments)}</td>
                                                <td className={`px-3.5 py-2.5 text-right font-black whitespace-nowrap ${Number(c.due_balance) > 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
                                                    {fmtMoney(c.due_balance)}
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
                                                        <Dropdown.Content align={customerDirectory.length > 3 && idx >= customerDirectory.length - 2 ? 'top-right' : 'right'} width="48">
                                                            <button
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setCustomerId(c.id);
                                                                }}
                                                                className="block w-full px-4 py-2 text-start text-sm leading-5 text-amber-800 hover:bg-amber-50 focus:outline-none flex items-center cursor-pointer font-semibold"
                                                            >
                                                                <BookOpen className="w-3.5 h-3.5 mr-2 text-amber-700" />
                                                                {isBn ? 'খতিয়ান দেখুন' : 'View Ledger'}
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    router.visit(route('customers.show', c.id));
                                                                }}
                                                                className="block w-full px-4 py-2 text-start text-sm leading-5 text-gray-700 hover:bg-gray-100 focus:outline-none flex items-center cursor-pointer"
                                                            >
                                                                <Eye className="w-3.5 h-3.5 mr-2 text-gray-400" />
                                                                {isBn ? 'গ্রাহক তথ্য' : 'Customer Profile'}
                                                            </button>
                                                            {Number(c.due_balance) > 0 && (
                                                                <button
                                                                    type="button"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        router.visit(route('sales.payments.index'));
                                                                    }}
                                                                    className="block w-full px-4 py-2 text-start text-sm leading-5 text-emerald-700 hover:bg-emerald-50 focus:outline-none flex items-center cursor-pointer font-semibold"
                                                                >
                                                                    <CreditCard className="w-3.5 h-3.5 mr-2 text-emerald-600" />
                                                                    {isBn ? 'বকেয়া আদায়' : 'Collect Due'}
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
                                            <td colSpan="9" className="p-12 text-center text-gray-400">
                                                {isBn ? 'কোন গ্রাহকের হিসাব পাওয়া যায়নি।' : 'No customers found.'}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination (Rule #4) */}
                        {customersList?.links && (
                            <div className="mt-4 print:hidden">
                                <Pagination links={customersList.links} />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
