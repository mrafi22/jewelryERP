import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Head, Link, router, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Pagination from '@/Components/Pagination';
import Dropdown from '@/Components/Dropdown';
import { 
    BookMarked, Printer, CreditCard, BookOpen, Search, RotateCcw, 
    Gift, Calendar, CheckCircle2, AlertCircle, X, Sparkles, User, Gem,
    Clock, MapPin, Phone, Mail, Award, FileText, Check, Sliders, Stamp,
    Globe, Edit3, Layers, Download, ChevronRight, Eye
} from 'lucide-react';
import useFilter from '@/Hooks/useFilter';
import { useLanguage } from '@/Context/LanguageContext';
import SalesReportsNav from './Components/SalesReportsNav';

// Traditional Bengali Alpona Corner Vector Ornament
const AlponaOrnament = ({ className = "w-10 h-10 text-amber-700" }) => (
    <svg viewBox="0 0 100 100" className={className} fill="currentColor">
        <path d="M10 10 L 85 10 L 85 14 L 14 14 L 14 85 L 10 85 Z" />
        <path d="M14 14 Q 38 14 52 28 Q 28 38 28 52 Q 28 28 14 14 Z" />
        <path d="M14 14 Q 14 38 28 52 Q 38 28 52 28 Q 28 28 14 14 Z" />
        <circle cx="30" cy="30" r="5" />
        <circle cx="18" cy="18" r="3" />
        <circle cx="58" cy="24" r="2.5" />
        <circle cx="24" cy="58" r="2.5" />
        <circle cx="70" cy="12" r="2" />
        <circle cx="12" cy="70" r="2" />
    </svg>
);

// Luxury Royal Jewelry Necklace & Pendant Vector Illustration
const JewelryIllustration = ({ className = "w-16 h-16 text-amber-500" }) => (
    <svg viewBox="0 0 120 120" className={className} fill="none" stroke="currentColor" strokeWidth="2">
        {/* Outer Chain Arc */}
        <path d="M20 25 C 20 70, 100 70, 100 25" strokeLinecap="round" strokeDasharray="3 3" />
        <path d="M25 25 C 25 78, 95 78, 95 25" strokeLinecap="round" />
        {/* Central Royal Pendant */}
        <path d="M60 76 L 68 88 L 60 100 L 52 88 Z" fill="currentColor" fillOpacity="0.25" strokeWidth="2.5" />
        <circle cx="60" cy="88" r="3.5" fill="currentColor" />
        {/* Hanging Diamond Droplet */}
        <path d="M60 100 L 63 108 L 60 113 L 57 108 Z" fill="currentColor" />
        {/* Accent Gemstones */}
        <circle cx="48" cy="70" r="2.5" fill="currentColor" />
        <circle cx="72" cy="70" r="2.5" fill="currentColor" />
        <circle cx="38" cy="60" r="2.5" fill="currentColor" />
        <circle cx="82" cy="60" r="2.5" fill="currentColor" />
        {/* Sparkling stars */}
        <path d="M35 35 Q 35 42 42 42 Q 35 42 35 49 Q 35 42 28 42 Q 35 42 35 35 Z" fill="currentColor" />
        <path d="M85 35 Q 85 42 92 42 Q 85 42 85 49 Q 85 42 78 42 Q 85 42 85 35 Z" fill="currentColor" />
    </svg>
);

export default function Halkhata({ 
    customers = { data: [] }, 
    summary = {}, 
    branches = [], 
    availableYears = [], 
    currentYear = new Date().getFullYear(),
    company = {},
    filters = {} 
}) {
    const { t, lang, toBn } = useLanguage();
    const isBn = lang === 'bn';

    const customerList = Array.isArray(customers) ? customers : (customers?.data || []);

    const [year, setYear] = useState(filters.year || String(currentYear));
    const [branchId, setBranchId] = useState(filters.branch_id || '');
    const [status, setStatus] = useState(filters.status || 'all');
    const [search, setSearch] = useState(filters.search || '');

    // Modal state for single customer card
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [slipModalOpen, setSlipModalOpen] = useState(false);

    // Batch print modal for multiple customer cards
    const [batchModalOpen, setBatchModalOpen] = useState(false);

    // Card View Mode: 'landscape_folded' (Default as requested) | 'portrait' | 'compact_slip'
    const [cardLayout, setCardLayout] = useState('landscape_folded');

    // Toggle customizer panel in modal
    const [showCustomizer, setShowCustomizer] = useState(false);

    // Auspicious Inscription selector
    const [auspiciousHeader, setAuspiciousHeader] = useState('elahi');

    // Digit converter helper for Bengali numerals
    const toBnDigits = (val) => {
        if (val === null || val === undefined) return '';
        return String(val).replace(/[0-9]/g, d => ['爰ｦ','爰ｧ','爰ｨ','爰ｩ','爰ｪ','爰ｫ','爰ｬ','爰ｭ','爰ｮ','爰ｯ'][d]);
    };

    // Helper to produce a 100% pure Bengali account/customer code with zero English characters
    const toBnCustomerCode = (cust) => {
        if (!cust) return '爰ｦ爰ｦ爰ｦ爰ｧ';
        if (cust.id !== undefined && cust.id !== null) {
            return toBnDigits(String(cust.id).padStart(4, '0'));
        }
        const digits = String(cust.code || '').replace(/[^0-9]/g, '');
        if (digits) {
            return toBnDigits(digits.padStart(4, '0'));
        }
        return toBnDigits('爰ｧ');
    };

    const formatAddressBn = (addr) => {
        if (!addr || addr === 'null' || addr === 'undefined' || addr === '123 Main Street' || addr === 'Main Street' || addr === '123 Main St') {
            return '爬ｬ爬ｾ爬ｯ爬ｼ爬､爰≒ｦｲ 爬ｮ爰金ｦ歩ｦｾ爬ｰ爬ｰ爬ｮ 爬ｮ爬ｾ爬ｰ爰財ｦ歩ｧ�ｦ�, 爬｢爬ｾ爬歩ｦｾ';
        }
        return addr;
    };

    const formatCustomerAddressBn = (addr) => {
        if (!addr || addr === 'null' || addr === 'undefined' || addr === '窶�') {
            return '爬ｸ爰財ｦ･爬ｾ爬ｨ爰爬ｯ爬ｼ 爬伶ｧ財ｦｰ爬ｾ爬ｹ爬�';
        }
        return addr;
    };

    // Format money in Bangladeshi Taka with Bengali digits
    const fmtTaka = (val) => {
        const n = Number(val || 0);
        const hasDec = Math.abs(n % 1) > 0.001;
        const formatted = n.toLocaleString('en-US', {
            minimumFractionDigits: hasDec ? 2 : 0,
            maximumFractionDigits: 2
        });
        return `爰ｳ ${toBnDigits(formatted)}`;
    };

    // Standard Currency Formatter for Register View (Rule #2)
    const fmtMoney = (val) => {
        const formatted = Number(val || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        return isBn ? `爰ｳ ${toBnDigits(formatted)}` : `BDT ${formatted}`;
    };

    // Bengali Date Formatter
    const getBengaliFormattedDate = (dateStr) => {
        const d = dateStr ? new Date(dateStr) : new Date();
        const monthsBn = [
            '爬憫ｦｾ爬ｨ爰≒ｦｯ爬ｼ爬ｾ爬ｰ爬ｿ', '爬ｫ爰�ｦｬ爰財ｦｰ爰≒ｦｯ爬ｼ爬ｾ爬ｰ爬ｿ', '爬ｮ爬ｾ爬ｰ爰財ｦ�', '爬鐘ｦｪ爰財ｦｰ爬ｿ爬ｲ', '爬ｮ爰�', '爬憫ｧ≒ｦｨ',
            '爬憫ｧ≒ｦｲ爬ｾ爬�', '爬�ｦ伶ｦｸ爰財ｦ�', '爬ｸ爰�ｦｪ爰財ｦ游ｧ�ｦｮ爰財ｦｬ爬ｰ', '爬�ｦ歩ｧ財ｦ游ｧ金ｦｬ爬ｰ', '爬ｨ爬ｭ爰�ｦｮ爰財ｦｬ爬ｰ', '爬｡爬ｿ爬ｸ爰�ｦｮ爰財ｦｬ爬ｰ'
        ];
        const day = toBnDigits(d.getDate());
        const month = monthsBn[d.getMonth()];
        const yr = toBnDigits(d.getFullYear());
        return `${day}爬� ${month}, ${yr}`;
    };

    const formatBranchBn = (name) => {
        if (!name || name === 'Main Branch' || name === 'Main') return '爬ｪ爰財ｦｰ爬ｧ爬ｾ爬ｨ 爬ｶ爬ｾ爬籾ｦｾ';
        return name;
    };

    // Dynamic Card Fields State (Editable with real-time recalculation)
    const [cardData, setCardData] = useState({
        shop_name: company?.name || '爬ｸ爰財ｦｬ爬ｰ爰財ｦ｣爬ｾ爬ｲ爬もｦ歩ｦｾ爬ｰ 爬憫ｧ≒ｦｯ爬ｼ爰�ｦｲ爬ｾ爬ｰ爰財ｦｸ',
        shop_tagline: company?.tagline || '爬ｸ爰財ｦｬ爬ｰ爰財ｦ｣, 爬ｰ爰呉ｦｪ爰財ｦｯ 爬� 爬｡爬ｾ爬ｯ爬ｼ爬ｮ爬ｨ爰財ｦ｡ 爬�ｦｲ爬もｦ歩ｦｾ爬ｰ爰�ｦｰ 爬説ｦ､爬ｿ爬ｹ爰財ｦｯ爬ｬ爬ｾ爬ｹ爰 爬ｨ爬ｿ爬ｰ爰財ｦｭ爬ｰ爬ｯ爰金ｦ伶ｧ財ｦｯ 爬ｪ爰財ｦｰ爬､爬ｿ爬ｷ爰財ｦ�爬ｾ爬ｨ',
        shop_address: company?.address || '爬ｬ爬ｾ爬ｯ爬ｼ爬､爰≒ｦｲ 爬ｮ爰金ｦ歩ｦｾ爬ｰ爬ｰ爬ｮ 爬ｮ爬ｾ爬ｰ爰財ｦ歩ｧ�ｦ�, 爬｢爬ｾ爬歩ｦｾ',
        shop_phone: company?.phone || '+爰ｮ爰ｮ爰ｦ 爰ｧ爰ｭ爰ｦ爰ｦ-爰ｦ爰ｦ爰ｦ爰ｦ爰ｦ爰ｦ',
        shop_facebook: company?.facebook || '',
        customer_name: '',
        customer_phone: '',
        customer_address: '',
        account_date: getBengaliFormattedDate(),
        previous_due: 0,
        new_purchase: 0,
        other_charges: 0,
        current_deposit: 0,
        other_payment: 0,
        greeting: '爬ｨ爬､爰≒ｦｨ 爬ｬ爬巵ｦｰ爰�ｦｰ 爬ｶ爰≒ｦｭ爰�ｦ壟ｧ財ｦ巵ｦｾ 爬� 爬�ｦｭ爬ｿ爬ｨ爬ｨ爰財ｦｦ爬ｨ爭､ 爬�ｦｪ爬ｨ爬ｾ爬ｰ 爬ｬ爬ｿ爬ｶ爰財ｦｬ爬ｾ爬ｸ 爬� 爬ｭ爬ｾ爬ｲ爰金ｦｬ爬ｾ爬ｸ爬ｾ爬� 爬�ｦｮ爬ｾ爬ｦ爰�ｦｰ 爬ｪ爬･爬壟ｦｲ爬ｾ爬ｰ 爬ｪ爰財ｦｰ爰�ｦｰ爬｣爬ｾ爭､',
        event_date: `爰ｧ爬ｲ爬ｾ 爬ｬ爰謂ｦｶ爬ｾ爬�, ${toBnDigits(Number(year) - 593)} 爬ｬ爬吭ｧ財ｦ伶ｦｾ爬ｬ爰財ｦｦ (爰ｧ爰ｫ爬� 爬鐘ｦｪ爰財ｦｰ爬ｿ爬ｲ, ${toBnDigits(year)})`,
        event_time: '爬ｸ爬歩ｦｾ爬ｲ 爰ｯ:爰ｦ爰ｦ 爬倨ｦ游ｦｿ爬歩ｦｾ 爬ｹ爬�ｦ､爰� 爬ｰ爬ｾ爬､ 爰ｯ:爰ｦ爰ｦ 爬倨ｦ游ｦｿ爬歩ｦｾ 爬ｪ爬ｰ爰財ｦｯ爬ｨ爰財ｦ､',
    });

    useFilter(route('reports.halkhata'), {
        year: year,
        branch_id: branchId,
        status: status,
        search: search,
    });

    const resetFilters = () => {
        setYear(String(currentYear));
        setBranchId('');
        setStatus('all');
        setSearch('');
    };

    const openSlipModal = (cust) => {
        setSelectedCustomer(cust);
        setCardData({
            shop_name: company?.name || '爬ｸ爰財ｦｬ爬ｰ爰財ｦ｣爬ｾ爬ｲ爬もｦ歩ｦｾ爬ｰ 爬憫ｧ≒ｦｯ爬ｼ爰�ｦｲ爬ｾ爬ｰ爰財ｦｸ',
            shop_tagline: company?.tagline || '爬ｸ爰財ｦｬ爬ｰ爰財ｦ｣, 爬ｰ爰呉ｦｪ爰財ｦｯ 爬� 爬｡爬ｾ爬ｯ爬ｼ爬ｮ爬ｨ爰財ｦ｡ 爬�ｦｲ爬もｦ歩ｦｾ爬ｰ爰�ｦｰ 爬説ｦ､爬ｿ爬ｹ爰財ｦｯ爬ｬ爬ｾ爬ｹ爰 爬ｨ爬ｿ爬ｰ爰財ｦｭ爬ｰ爬ｯ爰金ｦ伶ｧ財ｦｯ 爬ｪ爰財ｦｰ爬､爬ｿ爬ｷ爰財ｦ�爬ｾ爬ｨ',
            shop_address: formatAddressBn(cust?.branch_address || company?.address),
            shop_phone: cust?.branch_phone || company?.phone || '+爰ｮ爰ｮ爰ｦ 爰ｧ爰ｭ爰ｦ爰ｦ-爰ｦ爰ｦ爰ｦ爰ｦ爰ｦ爰ｦ',
            shop_facebook: company?.facebook || '',
            customer_name: cust?.name || '爬ｸ爬ｮ爰財ｦｮ爬ｾ爬ｨ爬ｿ爬､ 爬伶ｧ財ｦｰ爬ｾ爬ｹ爬�',
            customer_phone: cust?.phone || '',
            customer_address: formatCustomerAddressBn(cust?.address),
            account_date: getBengaliFormattedDate(),
            previous_due: Number(cust?.opening_due || 0),
            new_purchase: Number(cust?.period_sales || 0),
            other_charges: 0,
            current_deposit: Number(cust?.period_payments || 0),
            other_payment: 0,
            greeting: '爬ｨ爬､爰≒ｦｨ 爬ｬ爬巵ｦｰ爰�ｦｰ 爬ｶ爰≒ｦｭ爰�ｦ壟ｧ財ｦ巵ｦｾ 爬� 爬�ｦｭ爬ｿ爬ｨ爬ｨ爰財ｦｦ爬ｨ爭､ 爬�ｦｪ爬ｨ爬ｾ爬ｰ 爬ｬ爬ｿ爬ｶ爰財ｦｬ爬ｾ爬ｸ 爬� 爬ｭ爬ｾ爬ｲ爰金ｦｬ爬ｾ爬ｸ爬ｾ爬� 爬�ｦｮ爬ｾ爬ｦ爰�ｦｰ 爬ｪ爬･爬壟ｦｲ爬ｾ爬ｰ 爬ｪ爰財ｦｰ爰�ｦｰ爬｣爬ｾ爭､',
            event_date: `爰ｧ爬ｲ爬ｾ 爬ｬ爰謂ｦｶ爬ｾ爬�, ${toBnDigits(Number(year) - 593)} 爬ｬ爬吭ｧ財ｦ伶ｦｾ爬ｬ爰財ｦｦ (爰ｧ爰ｫ爬� 爬鐘ｦｪ爰財ｦｰ爬ｿ爬ｲ, ${toBnDigits(year)})`,
            event_time: '爬ｸ爬歩ｦｾ爬ｲ 爰ｯ:爰ｦ爰ｦ 爬倨ｦ游ｦｿ爬歩ｦｾ 爬ｹ爬�ｦ､爰� 爬ｰ爬ｾ爬､ 爰ｯ:爰ｦ爰ｦ 爬倨ｦ游ｦｿ爬歩ｦｾ 爬ｪ爬ｰ爰財ｦｯ爬ｨ爰財ｦ､',
        });
        setSlipModalOpen(true);
    };

    const closeSlipModal = () => {
        setSlipModalOpen(false);
        setSelectedCustomer(null);
    };

    // Automatic Real-Time Calculations (Rule #4 of user request)
    const totalDue = Number(cardData.previous_due || 0) + Number(cardData.new_purchase || 0) + Number(cardData.other_charges || 0);
    const totalPaid = Number(cardData.current_deposit || 0) + Number(cardData.other_payment || 0);
    const balanceDue = totalDue - totalPaid;

    const printSingleCard = () => {
        document.body.classList.add('halkhata-card-printing');
        window.print();
        setTimeout(() => {
            document.body.classList.remove('halkhata-card-printing');
        }, 1000);
    };

    const printBatchCards = () => {
        document.body.classList.add('halkhata-batch-printing');
        window.print();
        setTimeout(() => {
            document.body.classList.remove('halkhata-batch-printing');
        }, 1000);
    };

    const printFullRegister = () => {
        document.body.classList.remove('halkhata-card-printing');
        document.body.classList.remove('halkhata-batch-printing');
        window.print();
    };

    // Auspicious Inscriptions
    const auspiciousMap = {
        elahi: '爭､爭､ 爬鐘ｦｲ爬ｾ爬ｹ爰 爬ｭ爬ｰ爬ｸ爬ｾ 爭､爭､',
        bismillah: '爭､爭､ 爬ｬ爬ｿ爬ｸ爬ｮ爬ｿ爬ｲ爰財ｦｲ爬ｾ爬ｹ爬ｿ爬ｰ 爬ｰ爬ｾ爬ｹ爬ｮ爬ｾ爬ｨ爬ｿ爬ｰ 爬ｰ爬ｾ爬ｹ爰爬ｮ 爭､爭､',
        ganesh: '爭､爭､ 爬ｶ爰財ｦｰ爰 爬ｶ爰財ｦｰ爰 爬伶ｦ｣爰�ｦｶ爬ｾ爬ｯ爬ｼ 爬ｨ爬ｮ爬� 爭､爭､',
        shubho: '爭､爭､ 爬ｶ爰≒ｦｭ 爬ｨ爬ｬ爬ｬ爬ｰ爰財ｦｷ 爬� 爬ｶ爰≒ｦｭ 爬ｹ爬ｾ爬ｲ爬籾ｦｾ爬､爬ｾ 爭､爭､'
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                            <BookMarked className="w-6 h-6" style={{ color: 'rgb(177, 118, 51)' }} />
                            <span>{t('halkhata') || 'Halkhata'}</span>
                            <span className="text-xs bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-0.5 rounded-full font-bold ml-1">
                                {isBn ? `${toBnDigits(year)} 爬ｸ爬ｾ爬ｲ` : `Year ${year}`}
                            </span>
                        </h2>
                        <p className="text-xs text-gray-500 mt-0.5">
                            {isBn 
                                ? '爬ｬ爬ｾ爬ｰ爰財ｦｷ爬ｿ爬� 爬ｶ爰≒ｦｭ 爬ｹ爬ｾ爬ｲ爬籾ｦｾ爬､爬ｾ 爬籾ｦ､爬ｿ爬ｯ爬ｼ爬ｾ爬ｨ, 爬ｦ爰�ｦｨ爬ｾ-爬ｪ爬ｾ爬内ｦｨ爬ｾ 爬ｨ爬ｿ爬ｷ爰財ｦｪ爬､爰財ｦ､爬ｿ 爬� 爬説ｦ､爬ｿ爬ｹ爰財ｦｯ爬ｬ爬ｾ爬ｹ爰 爬�ｦｮ爬ｨ爰財ｦ､爰財ｦｰ爬｣ 爬ｰ爰�ｦ憫ｦｿ爬ｸ爰財ｦ游ｦｾ爬ｰ' 
                                : 'Annual Halkhata financial ledger, customer balance settlement & invitation register'}
                        </p>
                    </div>

                    <div className="flex items-center gap-2 print:hidden">
                        <button
                            type="button"
                            onClick={() => setBatchModalOpen(true)}
                            className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                        >
                            <Layers className="w-4 h-4 text-amber-700" />
                            <span>{isBn ? '爬鐘ｦ歩ｦｸ爬ｾ爬･爰� 爬歩ｦｾ爬ｰ爰財ｦ｡ 爬ｪ爰財ｦｰ爬ｿ爬ｨ爰財ｦ�' : 'Batch Print Cards'}</span>
                        </button>
                        <button
                            type="button"
                            onClick={printFullRegister}
                            className="px-4 py-2 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer hover:opacity-90"
                            style={{ backgroundColor: 'rgb(177, 118, 51)' }}
                        >
                            <Printer className="w-4 h-4" />
                            <span>{t('printRegister') || (isBn ? '爬ｰ爰�ｦ憫ｦｿ爬ｸ爰財ｦ游ｦｾ爬ｰ 爬ｪ爰財ｦｰ爬ｿ爬ｨ爰財ｦ�' : 'Print Register')}</span>
                        </button>
                    </div>
                </div>
            }
        >
            <Head title={`${t('halkhata') || 'Halkhata'} - ${year}`} />

            {/* High-Resolution Landscape & Portrait Print Stylesheet */}
            <style>{`
                @media print {
                    @page {
                        size: A4 landscape;
                        margin: 5mm;
                    }
                    body {
                        background: #ffffff !important;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    /* Single Card Print Mode */
                    body.halkhata-card-printing * {
                        visibility: hidden !important;
                    }
                    body.halkhata-card-printing #halkhata-card-portal,
                    body.halkhata-card-printing #halkhata-card-portal #halkhata-printable-card,
                    body.halkhata-card-printing #halkhata-card-portal #halkhata-printable-card * {
                        visibility: visible !important;
                    }
                    body.halkhata-card-printing #halkhata-card-portal {
                        position: absolute !important;
                        left: 0 !important;
                        top: 0 !important;
                        width: 100% !important;
                        height: auto !important;
                        background: #ffffff !important;
                        padding: 0 !important;
                        margin: 0 !important;
                    }
                    body.halkhata-card-printing #halkhata-printable-card {
                        box-shadow: none !important;
                        border-width: 4px !important;
                        width: 100% !important;
                        max-width: 100% !important;
                        margin: 0 auto !important;
                        page-break-inside: avoid !important;
                    }
                    /* Batch Printing Mode */
                    body.halkhata-batch-printing * {
                        visibility: hidden !important;
                    }
                    body.halkhata-batch-printing #halkhata-batch-portal,
                    body.halkhata-batch-printing #halkhata-batch-portal * {
                        visibility: visible !important;
                    }
                    body.halkhata-batch-printing #halkhata-batch-portal {
                        position: absolute !important;
                        left: 0 !important;
                        top: 0 !important;
                        width: 100% !important;
                        background: #ffffff !important;
                        padding: 0 !important;
                        margin: 0 !important;
                    }
                    .halkhata-batch-page {
                        page-break-after: always !important;
                        break-after: page !important;
                        height: 100vh !important;
                        display: flex !important;
                        align-items: center !important;
                        justify-content: center !important;
                    }
                }
            `}</style>

            {/* Sales Reports Navigation Bar */}
            <SalesReportsNav activeTab="halkhata" />

            {/* Letterhead for Full Register Printing */}
            <div className="hidden print:block mb-6 border-b-2 border-amber-800 pb-3">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-black text-gray-900">{cardData.shop_name || company?.name || '爬ｸ爰財ｦｬ爬ｰ爰財ｦ｣爬ｾ爬ｲ爬もｦ歩ｦｾ爬ｰ 爬憫ｧ≒ｦｯ爬ｼ爰�ｦｲ爬ｾ爬ｰ爰財ｦｸ'}</h1>
                        <p className="text-xs text-gray-600">{company?.tagline || '爬ｸ爰財ｦｬ爬ｰ爰財ｦ｣, 爬ｰ爰呉ｦｪ爰財ｦｯ 爬� 爬｡爬ｾ爬ｯ爬ｼ爬ｮ爬ｨ爰財ｦ｡ 爬�ｦｲ爬もｦ歩ｦｾ爬ｰ爰�ｦｰ 爬ｬ爬ｿ爬ｶ爰財ｦｬ爬ｸ爰財ｦ､ 爬ｪ爰財ｦｰ爬､爬ｿ爬ｷ爰財ｦ�爬ｾ爬ｨ'}</p>
                        <p className="text-xs text-gray-500">{company?.address || '爬｢爬ｾ爬歩ｦｾ, 爬ｬ爬ｾ爬もｦｲ爬ｾ爬ｦ爰�ｦｶ'} | 爬ｫ爰金ｦｨ: {toBnDigits(company?.phone || '')}</p>
                        <h2 className="text-sm font-bold text-amber-900 mt-2 uppercase tracking-wide">
                            {isBn ? `爬ｬ爬ｾ爬ｰ爰財ｦｷ爬ｿ爬� 爬ｶ爰≒ｦｭ 爬ｹ爬ｾ爬ｲ爬籾ｦｾ爬､爬ｾ 爬ｹ爬ｿ爬ｸ爬ｾ爬ｬ 爬ｰ爰�ｦ憫ｦｿ爬ｸ爰財ｦ游ｦｾ爬ｰ (${toBnDigits(year)} 爬ｸ爬ｾ爬ｲ)` : `Annual Halkhata Financial Register (${year})`}
                        </h2>
                    </div>
                    <div className="text-right text-xs text-gray-700">
                        <p className="font-semibold">{t('date')}: {getBengaliFormattedDate()}</p>
                        <p className="mt-1 font-bold text-rose-700">{isBn ? '爬ｮ爰金ｦ� 爬ｸ爬ｮ爬ｾ爬ｪ爬ｨ爰 爬ｦ爰�ｦｨ爬ｾ:' : 'Total Closing Due:'} {fmtMoney(summary.total_closing_due)}</p>
                    </div>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6 print:hidden">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 items-end">
                    <div>
                        <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                            {isBn ? '爬ｹ爬ｾ爬ｲ爬籾ｦｾ爬､爬ｾ爬ｰ 爬ｬ爬巵ｦｰ' : 'Halkhata Year'}
                        </label>
                        <select
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                            className="w-full text-xs rounded-xl border-gray-300 focus:ring-amber-500 focus:border-amber-500 font-bold text-amber-900 bg-amber-50/30"
                        >
                            {availableYears.map(y => (
                                <option key={y} value={y}>
                                    {isBn ? `${toBnDigits(y)} 爬ｸ爬ｾ爬ｲ` : `Year ${y}`}
                                </option>
                            ))}
                        </select>
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
                        <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                            {isBn ? '爬ｹ爬ｾ爬ｲ爬籾ｦｾ爬､爬ｾ 爬�ｦｬ爬ｸ爰財ｦ･爬ｾ' : 'Halkhata Status'}
                        </label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full text-xs rounded-xl border-gray-300 focus:ring-amber-500 focus:border-amber-500"
                        >
                            <option value="all">{isBn ? '爬ｸ爬歩ｦｲ 爬伶ｧ財ｦｰ爬ｾ爬ｹ爬� 爬ｹ爬ｿ爬ｸ爬ｾ爬ｬ' : 'All Accounts'}</option>
                            <option value="with_due">{isBn ? '爬ｬ爬歩ｧ�ｦｯ爬ｼ爬ｾ 爬ｦ爰�ｦｨ爬ｾ爬ｦ爬ｾ爬ｰ (爬ｦ爰�ｦｨ爬ｾ 爬�ｦ巵ｧ�)' : 'With Outstanding Due'}</option>
                            <option value="cleared">{isBn ? '爬ｪ爬ｰ爬ｿ爬ｶ爰金ｦｧ爬ｿ爬､ / 爬ｶ爰もｦｨ爰財ｦｯ 爬ｦ爰�ｦｨ爬ｾ' : 'Settled / Cleared'}</option>
                            <option value="high_due">{isBn ? '爬霞ｦ壟ｧ財ｦ� 爬ｬ爬歩ｧ�ｦｯ爬ｼ爬ｾ (> 爰ｧ爰ｦ,爰ｦ爰ｦ爰ｦ 爬游ｦｾ爬歩ｦｾ)' : 'High Due (> BDT 10k)'}</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">{t('search')}</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder={isBn ? '爬ｨ爬ｾ爬ｮ, 爬歩ｧ金ｦ｡ 爬ｬ爬ｾ 爬ｮ爰金ｦｬ爬ｾ爬�ｦｲ...' : 'Name, code, phone...'}
                                className="w-full text-xs rounded-xl border-gray-300 pl-8 focus:ring-amber-500 focus:border-amber-500"
                            />
                            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={resetFilters}
                            title={t('reset')}
                            className="p-2.5 text-gray-500 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 w-full text-xs font-semibold"
                        >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>{t('reset') || (isBn ? '爬ｰ爬ｿ爬ｸ爰�ｦ�' : 'Reset')}</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Halkhata Summary KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm">
                    <p className="text-xs font-bold text-gray-500 uppercase">{isBn ? '爬ｮ爰金ｦ� 爬伶ｧ財ｦｰ爬ｾ爬ｹ爬�' : 'Total Accounts'}</p>
                    <p className="text-2xl font-black text-gray-900 mt-1">{toBnDigits(summary.total_customers || 0)}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{isBn ? '爬､爬ｾ爬ｲ爬ｿ爬歩ｦｾ爬ｯ爬ｼ 爬�ｦｨ爰財ｦ､爬ｰ爰財ｦｭ爰≒ｦ歩ｧ財ｦ､ 爬伶ｧ財ｦｰ爬ｾ爬ｹ爬�' : 'Total registered accounts'}</p>
                </div>

                <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm">
                    <p className="text-xs font-bold text-amber-700 uppercase">{isBn ? '爬ｪ爰もｦｰ爰財ｦｬ爰�ｦｰ 爬ｬ爬ｾ爬歩ｦｿ (爬憫ｧ�ｦｰ)' : 'Opening Due'}</p>
                    <p className="text-2xl font-black text-amber-900 mt-1">{fmtMoney(summary.total_opening_due)}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{isBn ? '爬ｬ爬ｿ爬伶ｦ､ 爬ｬ爬巵ｦｰ爰�ｦｰ 爬憫ｧ�ｦｰ' : 'Carried over balance'}</p>
                </div>

                <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm">
                    <p className="text-xs font-bold text-gray-600 uppercase">{isBn ? '爬ｨ爬､爰≒ｦｨ 爬�ｦｲ爬もｦ歩ｦｾ爬ｰ 爬ｬ爬ｿ爬歩ｧ財ｦｰ爬ｯ爬ｼ' : 'Period Sales'}</p>
                    <p className="text-2xl font-black text-gray-900 mt-1">{fmtMoney(summary.total_period_sales)}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{isBn ? '爬ｹ爬ｾ爬ｲ爬籾ｦｾ爬､爬ｾ 爬ｬ爬巵ｦｰ爰� 爬ｪ爬｣爰財ｦｯ 爬ｬ爬ｿ爬歩ｧ財ｦｰ爬ｯ爬ｼ' : 'Purchases during year'}</p>
                </div>

                <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm">
                    <p className="text-xs font-bold text-emerald-600 uppercase">{isBn ? '爬ｮ爰金ｦ� 爬憫ｦｮ爬ｾ / 爬�ｦｦ爬ｾ爬ｯ爬ｼ' : 'Total Collected'}</p>
                    <p className="text-2xl font-black text-emerald-600 mt-1">{fmtMoney(summary.total_period_collections)}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{isBn ? '爬ｪ爬ｰ爬ｿ爬ｶ爰金ｦｧ 爬� 爬憫ｦｮ爬ｾ 爬ｸ爬ｮ爰財ｦｪ爬ｨ爰財ｦｨ' : 'Payments received'}</p>
                </div>

                <div className="bg-white border border-rose-100 p-4 rounded-2xl shadow-sm">
                    <p className="text-xs font-bold text-rose-500 uppercase">{isBn ? '爬ｸ爬ｮ爬ｾ爬ｪ爬ｨ爰 爬ｦ爰�ｦｨ爬ｾ' : 'Net Closing Due'}</p>
                    <p className="text-2xl font-black text-rose-600 mt-1">{fmtMoney(summary.total_closing_due)}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{isBn ? '爬ｬ爬ｰ爰財ｦ､爬ｮ爬ｾ爬ｨ 爬ｬ爬歩ｧ�ｦｯ爬ｼ爬ｾ 爬ｬ爬ｾ爬歩ｦｿ 爬憫ｧ�ｦｰ' : 'Net outstanding balance'}</p>
                </div>
            </div>

            {/* Halkhata Register Table Card */}
            <div className="bg-white shadow-sm rounded-2xl border border-gray-100 p-4">
                <div className="flex items-center justify-between mb-3 px-1">
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                            <span>{isBn ? '爬ｹ爬ｾ爬ｲ爬籾ｦｾ爬､爬ｾ 爬籾ｦ､爬ｿ爬ｯ爬ｼ爬ｾ爬ｨ 爬籾ｦｾ爬､爬ｾ' : 'Halkhata Ledger Book'}</span>
                            <span className="text-[11px] bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full font-medium">
                                {isBn 
                                    ? `爬ｬ爬歩ｧ�ｦｯ爬ｼ爬ｾ 爬ｦ爰�ｦｨ爬ｾ爬ｦ爬ｾ爬ｰ: ${toBnDigits(summary.customers_with_due || 0)} 爬憫ｦｨ | 爬ｪ爬ｰ爬ｿ爬ｶ爰金ｦｧ爬ｿ爬､: ${toBnDigits(summary.customers_cleared || 0)} 爬憫ｦｨ` 
                                    : `With Due: ${summary.customers_with_due || 0} | Cleared: ${summary.customers_cleared || 0}`}
                            </span>
                        </h3>
                    </div>
                </div>

                {/* Table Container with Rule #1 overflow-x-visible pb-24 */}
                <div className="overflow-x-visible pb-24 rounded-xl border border-gray-100">
                    <table className="w-full text-left text-xs border-collapse">
                        <thead>
                            <tr style={{ backgroundColor: 'rgb(177, 118, 51)' }} className="text-white">
                                <th className="px-3.5 py-3 text-[11px] font-bold uppercase whitespace-nowrap">{t('sl') || (isBn ? '爬歩ｧ財ｦｰ爬ｮ爬ｿ爬�' : 'SL')}</th>
                                <th className="px-3.5 py-3 text-[11px] font-bold uppercase whitespace-nowrap">{isBn ? '爬ｹ爬ｿ爬ｸ爬ｾ爬ｬ 爬歩ｧ金ｦ｡' : 'Code'}</th>
                                <th className="px-3.5 py-3 text-[11px] font-bold uppercase whitespace-nowrap">{t('customer')}</th>
                                <th className="px-3.5 py-3 text-[11px] font-bold uppercase whitespace-nowrap">{t('branch')}</th>
                                <th className="px-3.5 py-3 text-[11px] font-bold uppercase whitespace-nowrap text-right">{isBn ? '爬ｪ爰もｦｰ爰財ｦｬ爰�ｦｰ 爬憫ｧ�ｦｰ' : 'Opening Due'}</th>
                                <th className="px-3.5 py-3 text-[11px] font-bold uppercase whitespace-nowrap text-right">{isBn ? '爬ｨ爬､爰≒ｦｨ 爬ｬ爬ｿ爬歩ｧ財ｦｰ爬ｯ爬ｼ (+)' : 'New Sales (+)'}</th>
                                <th className="px-3.5 py-3 text-[11px] font-bold uppercase whitespace-nowrap text-right">{isBn ? '爬ｮ爰金ｦ� 爬憫ｦｮ爬ｾ (-)' : 'Payments (-)'}</th>
                                <th className="px-3.5 py-3 text-[11px] font-bold uppercase whitespace-nowrap text-right text-white">{isBn ? '爬ｹ爬ｾ爬ｲ爬籾ｦｾ爬､爬ｾ 爬ｦ爰�ｦｨ爬ｾ' : 'Closing Due'}</th>
                                <th className="px-3.5 py-3 text-[11px] font-bold uppercase whitespace-nowrap text-center">{t('status')}</th>
                                <th className="px-3.5 py-3 text-[11px] font-bold uppercase whitespace-nowrap text-right print:hidden">{t('actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {customerList.length > 0 ? (
                                customerList.map((c, idx) => {
                                    const sl = ((customers?.current_page || 1) - 1) * (customers?.per_page || 10) + idx + 1;
                                    return (
                                    <tr key={c.id} className="hover:bg-gray-50/60 transition">
                                        <td className="px-3.5 py-2.5 text-gray-500 font-mono text-[11px] whitespace-nowrap">
                                            {toBnDigits(sl)}
                                        </td>
                                        <td className="px-3.5 py-2.5 font-mono text-amber-800 font-bold whitespace-nowrap text-[11px]">
                                            {toBnDigits(c.code)}
                                        </td>
                                        <td className="px-3.5 py-2.5 font-bold text-gray-900 whitespace-nowrap">
                                            <button
                                                type="button"
                                                onClick={() => openSlipModal(c)}
                                                className="hover:underline text-start cursor-pointer text-gray-900 hover:text-amber-800 flex flex-col"
                                            >
                                                <span>{c.name}</span>
                                                <span className="text-[10px] text-gray-400 font-normal">{toBnDigits(c.phone)}</span>
                                            </button>
                                        </td>
                                        <td className="px-3.5 py-2.5 text-gray-600 whitespace-nowrap">{formatBranchBn(c.branch_name)}</td>
                                        <td className="px-3.5 py-2.5 text-right font-bold text-gray-700 whitespace-nowrap">{fmtMoney(c.opening_due)}</td>
                                        <td className="px-3.5 py-2.5 text-right font-bold text-amber-900 whitespace-nowrap">{fmtMoney(c.period_sales)}</td>
                                        <td className="px-3.5 py-2.5 text-right font-bold text-emerald-600 whitespace-nowrap">{fmtMoney(c.period_payments)}</td>
                                        <td className={`px-3.5 py-2.5 text-right font-black whitespace-nowrap ${c.has_due ? 'text-rose-600' : 'text-emerald-700'}`}>
                                            {fmtMoney(c.closing_due)}
                                        </td>
                                        <td className="px-3.5 py-2.5 text-center whitespace-nowrap">
                                            <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                                                c.has_due 
                                                    ? 'bg-rose-100 text-rose-800 border border-rose-200' 
                                                    : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                            }`}>
                                                {c.has_due ? (isBn ? '爬ｬ爬歩ｧ�ｦｯ爬ｼ爬ｾ 爬�ｦ巵ｧ�' : 'Has Due') : (isBn ? '爬ｪ爬ｰ爬ｿ爬ｶ爰金ｦｧ爬ｿ爬､' : 'Cleared')}
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
                                                <Dropdown.Content align={customerList.length > 3 && idx >= customerList.length - 2 ? 'top-right' : 'right'} width="48">
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            openSlipModal(c);
                                                        }}
                                                        className="block w-full px-4 py-2 text-start text-sm leading-5 text-amber-900 hover:bg-amber-50 focus:outline-none flex items-center cursor-pointer font-semibold"
                                                    >
                                                        <Gift className="w-3.5 h-3.5 mr-2 text-amber-700" />
                                                        {isBn ? '爬ｹ爬ｾ爬ｲ爬籾ｦｾ爬､爬ｾ 爬歩ｦｾ爬ｰ爰財ｦ｡' : 'Halkhata Card'}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            router.visit(route('reports.customer-ledger', { customer_id: c.id }));
                                                        }}
                                                        className="block w-full px-4 py-2 text-start text-sm leading-5 text-gray-700 hover:bg-gray-100 focus:outline-none flex items-center cursor-pointer"
                                                    >
                                                        <BookOpen className="w-3.5 h-3.5 mr-2 text-gray-400" />
                                                        {isBn ? '爬伶ｧ財ｦｰ爬ｾ爬ｹ爬� 爬籾ｦ､爬ｿ爬ｯ爬ｼ爬ｾ爬ｨ' : 'Customer Ledger'}
                                                    </button>
                                                    {c.has_due && (
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                router.visit(route('sales.payments.index'));
                                                            }}
                                                            className="block w-full px-4 py-2 text-start text-sm leading-5 text-emerald-700 hover:bg-emerald-50 focus:outline-none flex items-center cursor-pointer font-semibold"
                                                        >
                                                            <CreditCard className="w-3.5 h-3.5 mr-2 text-emerald-600" />
                                                            {isBn ? '爬ｬ爬歩ｧ�ｦｯ爬ｼ爬ｾ 爬憫ｦｮ爬ｾ 爬ｨ爬ｿ爬ｨ' : 'Collect Due'}
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
                                        {isBn ? '爬歩ｧ金ｦｨ爰� 爬伶ｧ財ｦｰ爬ｾ爬ｹ爬歩ｧ�ｦｰ 爬ｹ爬ｾ爬ｲ爬籾ｦｾ爬､爬ｾ 爬､爬･爰財ｦｯ 爬ｪ爬ｾ爬内ｦｯ爬ｼ爬ｾ 爬ｯ爬ｾ爬ｯ爬ｼ爬ｨ爬ｿ爭､' : 'No customer records found.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination (Rule #4) */}
                {customers?.links && (
                    <div className="mt-4 print:hidden">
                        <Pagination links={customers.links} />
                    </div>
                )}
            </div>

            {/* Rule #6: PREMIUM PRINT-READY BENGALI JEWELRY SHOP HALKHATA CARD MODAL (React Portal) */}
            {slipModalOpen && selectedCustomer && createPortal(
                <div 
                    id="halkhata-card-portal"
                    className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 print:p-0"
                    style={{ background: 'rgba(15,23,42,0.85)' }}
                >
                    <div 
                        className="bg-white rounded-3xl w-full shadow-2xl flex flex-col border-2 border-amber-400 overflow-hidden print:border-none print:shadow-none print:w-full print:max-w-none"
                        style={{ maxWidth: '1020px', maxHeight: '94vh' }}
                    >
                        {/* Header & Controls */}
                        <div className="flex-shrink-0 px-5 py-3.5 border-b border-amber-200 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 print:hidden space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-xl bg-amber-800 text-white flex items-center justify-center font-serif font-black shadow-xs">
                                        হ
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                                            <span>{isBn ? 'হালখাতা কার্ড প্রিভিউ ও কাস্টমাইজার' : 'Halkhata Card Preview & Customizer'}</span>
                                            <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold border border-amber-300">
                                                {cardData.customer_name}
                                            </span>
                                        </h3>
                                        <p className="text-[10px] text-gray-500">{isBn ? 'স্বর্ণালঙ্কার ব্যবসায়ী হালখাতা আমন্ত্রণী হিসাব কার্ড' : 'Jewelry Merchant Halkhata Invitation & Account Card'}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowCustomizer(!showCustomizer)}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border ${
                                            showCustomizer 
                                                ? 'bg-amber-100 text-amber-900 border-amber-300' 
                                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                        }`}
                                    >
                                        <Sliders className="w-3.5 h-3.5" />
                                        <span>{showCustomizer ? (isBn ? 'কাস্টমাইজার লুকান' : 'Hide Customizer') : (isBn ? 'কার্ড এডিট/কাস্টমাইজ' : 'Edit Card Data')}</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={closeSlipModal}
                                        className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg transition cursor-pointer"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Collapsible Live Customizer Panel (Instant Recalculation) */}
                            {showCustomizer && (
                                <div className="p-3 bg-white rounded-2xl border border-amber-300 shadow-inner grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 text-xs">
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-600 mb-0.5">爬ｪ爰財ｦｰ爬､爬ｿ爬ｷ爰財ｦ�爬ｾ爬ｨ爰�ｦｰ 爬ｨ爬ｾ爬ｮ:</label>
                                        <input 
                                            type="text" 
                                            value={cardData.shop_name}
                                            onChange={(e) => setCardData({ ...cardData, shop_name: e.target.value })}
                                            className="w-full text-xs py-1 px-2 rounded-lg border-amber-200 font-bold text-amber-900"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-600 mb-0.5">爬伶ｧ財ｦｰ爬ｾ爬ｹ爬歩ｧ�ｦｰ 爬ｨ爬ｾ爬ｮ:</label>
                                        <input 
                                            type="text" 
                                            value={cardData.customer_name}
                                            onChange={(e) => setCardData({ ...cardData, customer_name: e.target.value })}
                                            className="w-full text-xs py-1 px-2 rounded-lg border-amber-200 font-bold"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-600 mb-0.5">爬ｮ爰金ｦｬ爬ｾ爬�ｦｲ 爬ｨ爬ｮ爰財ｦｬ爬ｰ:</label>
                                        <input 
                                            type="text" 
                                            value={cardData.customer_phone}
                                            onChange={(e) => setCardData({ ...cardData, customer_phone: e.target.value })}
                                            className="w-full text-xs py-1 px-2 rounded-lg border-amber-200"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-600 mb-0.5">爬伶ｧ財ｦｰ爬ｾ爬ｹ爬歩ｧ�ｦｰ 爬�爬ｿ爬歩ｦｾ爬ｨ爬ｾ:</label>
                                        <input 
                                            type="text" 
                                            value={cardData.customer_address}
                                            onChange={(e) => setCardData({ ...cardData, customer_address: e.target.value })}
                                            className="w-full text-xs py-1 px-2 rounded-lg border-amber-200"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-amber-900 mb-0.5">爬ｪ爰もｦｰ爰財ｦｬ爰�ｦｰ 爬ｬ爬歩ｧ�ｦｯ爬ｼ爬ｾ (爰ｳ):</label>
                                        <input 
                                            type="number" 
                                            value={cardData.previous_due}
                                            onChange={(e) => setCardData({ ...cardData, previous_due: e.target.value })}
                                            className="w-full text-xs py-1 px-2 rounded-lg border-amber-300 font-bold text-amber-900 bg-amber-50/50"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-amber-900 mb-0.5">爬ｨ爬､爰≒ｦｨ 爬歩ｧ�ｦｨ爬ｾ爬歩ｦｾ爬游ｦｾ (爰ｳ):</label>
                                        <input 
                                            type="number" 
                                            value={cardData.new_purchase}
                                            onChange={(e) => setCardData({ ...cardData, new_purchase: e.target.value })}
                                            className="w-full text-xs py-1 px-2 rounded-lg border-amber-300 font-bold text-amber-900 bg-amber-50/50"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-emerald-800 mb-0.5">爬壟ｦｲ爬､爬ｿ 爬ｬ爬巵ｦｰ爰�ｦｰ 爬憫ｦｮ爬ｾ (爰ｳ):</label>
                                        <input 
                                            type="number" 
                                            value={cardData.current_deposit}
                                            onChange={(e) => setCardData({ ...cardData, current_deposit: e.target.value })}
                                            className="w-full text-xs py-1 px-2 rounded-lg border-emerald-300 font-bold text-emerald-800 bg-emerald-50/50"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-emerald-800 mb-0.5">爬�ｦｨ爰財ｦｯ爬ｾ爬ｨ爰財ｦｯ 爬憫ｦｮ爬ｾ (爰ｳ):</label>
                                        <input 
                                            type="number" 
                                            value={cardData.other_payment}
                                            onChange={(e) => setCardData({ ...cardData, other_payment: e.target.value })}
                                            className="w-full text-xs py-1 px-2 rounded-lg border-emerald-300 font-bold text-emerald-800 bg-emerald-50/50"
                                        />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="block text-[10px] font-bold text-gray-600 mb-0.5">爬�ｦｨ爬ｲ爬ｾ爬�ｦｨ / 爬ｫ爰�ｦｸ爬ｬ爰≒ｦ�:</label>
                                        <input 
                                            type="text" 
                                            value={cardData.shop_facebook}
                                            onChange={(e) => setCardData({ ...cardData, shop_facebook: e.target.value })}
                                            className="w-full text-xs py-1 px-2 rounded-lg border-amber-200"
                                        />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="block text-[10px] font-bold text-gray-600 mb-0.5">爬伶ｧ財ｦｰ爬ｾ爬ｹ爬� 爬ｶ爰≒ｦｭ爰�ｦ壟ｧ財ｦ巵ｦｾ 爬ｬ爬ｾ爬ｰ爰財ｦ､爬ｾ:</label>
                                        <input 
                                            type="text" 
                                            value={cardData.greeting}
                                            onChange={(e) => setCardData({ ...cardData, greeting: e.target.value })}
                                            className="w-full text-xs py-1 px-2 rounded-lg border-amber-200"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Toolbar Layout Switcher */}
                            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-amber-950 text-[11px]">爬歩ｦｾ爬ｰ爰財ｦ｡爰�ｦｰ 爬ｲ爰�ｦ�ｦ霞ｦ�:</span>
                                    <div className="flex rounded-lg border border-amber-300 p-0.5 bg-white shadow-2xs">
                                        <button
                                            type="button"
                                            onClick={() => setCardLayout('landscape_folded')}
                                            className={`py-1 px-3 text-[11px] font-bold rounded-md transition cursor-pointer ${
                                                cardLayout === 'landscape_folded'
                                                    ? 'bg-[#8B0000] text-amber-100 shadow-xs'
                                                    : 'text-gray-700 hover:text-gray-950'
                                            }`}
                                        >
                                            爬ｲ爰財ｦｯ爬ｾ爬ｨ爰財ｦ｡爬ｸ爰財ｦ歩ｧ�ｦｪ 爬ｫ爰金ｦｲ爰財ｦ｡爰�ｦ｡ 爬歩ｦｾ爬ｰ爰財ｦ｡
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setCardLayout('portrait')}
                                            className={`py-1 px-3 text-[11px] font-bold rounded-md transition cursor-pointer ${
                                                cardLayout === 'portrait'
                                                    ? 'bg-amber-800 text-white shadow-xs'
                                                    : 'text-gray-700 hover:text-gray-950'
                                            }`}
                                        >
                                            爬鐘ｦ歩ｦ� 爬ｪ爰金ｦｰ爰財ｦ游ｧ財ｦｰ爰�ｦ� 爬歩ｦｾ爬ｰ爰財ｦ｡
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-amber-950 text-[11px]">爬ｮ爬ｾ爬吭ｧ財ｦ伶ｦｲ爬ｿ爬� 爬ｬ爬ｾ爬｣爰:</span>
                                    <select
                                        value={auspiciousHeader}
                                        onChange={(e) => setAuspiciousHeader(e.target.value)}
                                        className="text-[11px] py-1 px-2 rounded-lg border-amber-300 bg-white font-bold text-amber-900"
                                    >
                                        <option value="elahi">爭､爭､ 爬鐘ｦｲ爬ｾ爬ｹ爰 爬ｭ爬ｰ爬ｸ爬ｾ 爭､爭､</option>
                                        <option value="bismillah">爭､爭､ 爬ｬ爬ｿ爬ｸ爬ｮ爬ｿ爬ｲ爰財ｦｲ爬ｾ爬ｹ爬ｿ爬ｰ 爬ｰ爬ｾ爬ｹ爬ｮ爬ｾ爬ｨ爬ｿ爬ｰ 爬ｰ爬ｾ爬ｹ爰爬ｮ 爭､爭､</option>
                                        <option value="ganesh">爭､爭､ 爬ｶ爰財ｦｰ爰 爬ｶ爰財ｦｰ爰 爬伶ｦ｣爰�ｦｶ爬ｾ爬ｯ爬ｼ 爬ｨ爬ｮ爬� 爭､爭､</option>
                                        <option value="shubho">爭､爭､ 爬ｶ爰≒ｦｭ 爬ｨ爬ｬ爬ｬ爬ｰ爰財ｦｷ 爬� 爬ｶ爰≒ｦｭ 爬ｹ爬ｾ爬ｲ爬籾ｦｾ爬､爬ｾ 爭､爭､</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Scrollable Printable Card Viewport */}
                        <div className="flex-1 overflow-y-auto p-3 sm:p-5 bg-[#f4ede2] print:p-0 print:overflow-visible flex justify-center items-start">

                            {/* =========================================================================
                                1. LANDSCAPE FOLDED CARD LAYOUT (HIGH RESOLUTION PRINT READY)
                                ========================================================================= */}
                            {cardLayout === 'landscape_folded' && (
                                <div 
                                    id="halkhata-printable-card"
                                    className="bg-[#fffef9] rounded-2xl shadow-2xl relative border-4 border-[#8B0000] text-gray-900 print:shadow-none print:rounded-none w-full max-w-[1020px] p-5 sm:p-6"
                                    style={{
                                        outline: '3px double #d4af37',
                                        outlineOffset: '-8px'
                                    }}
                                >
                                    {/* Traditional Alpona Corner Ornaments on the Outer Frame */}
                                    <div className="absolute top-2.5 left-2.5 pointer-events-none select-none">
                                        <AlponaOrnament className="w-10 h-10 text-[#8B0000]" />
                                    </div>
                                    <div className="absolute top-2.5 right-2.5 scale-x-[-1] pointer-events-none select-none">
                                        <AlponaOrnament className="w-10 h-10 text-[#8B0000]" />
                                    </div>
                                    <div className="absolute bottom-2.5 left-2.5 scale-y-[-1] pointer-events-none select-none">
                                        <AlponaOrnament className="w-10 h-10 text-[#8B0000]" />
                                    </div>
                                    <div className="absolute bottom-2.5 right-2.5 scale-[-1] pointer-events-none select-none">
                                        <AlponaOrnament className="w-10 h-10 text-[#8B0000]" />
                                    </div>

                                    {/* Two-Panel Landscape Folded Grid */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative">
                                        {/* Center Fold Divider Line (visible in print & screen) */}
                                        <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px border-r-2 border-dashed border-amber-300/80 -translate-x-1/2"></div>

                                        {/* =====================================================================
                                            LEFT PANEL: Luxury Cover & Greeting Section
                                           ===================================================================== */}
                                        <div className="flex flex-col justify-between p-3 sm:p-4 bg-gradient-to-b from-amber-50/50 via-white to-amber-50/30 rounded-xl border border-amber-200/80">
                                            <div>
                                                {/* Auspicious Top Heading */}
                                                <div className="text-center pb-2">
                                                    <p className="text-xs font-bold text-[#8B0000] tracking-widest uppercase font-serif">
                                                        {auspiciousMap[auspiciousHeader]}
                                                    </p>
                                                    <div className="flex items-center justify-center gap-2 text-amber-700 my-1 select-none">
                                                        <span className="h-px w-10 bg-gradient-to-r from-transparent to-amber-600"></span>
                                                        <span className="text-[10px]">笨ｦ 笶� 笨ｦ</span>
                                                        <span className="h-px w-10 bg-gradient-to-l from-transparent to-amber-600"></span>
                                                    </div>
                                                </div>

                                                {/* Jewelry Illustration & Shop Name Branding */}
                                                <div className="text-center py-2">
                                                    <div className="flex justify-center mb-1">
                                                        {company?.logo ? (
                                                            <img src={`/storage/${company.logo}`} alt="Logo" className="h-14 object-contain" />
                                                        ) : (
                                                            <JewelryIllustration className="w-14 h-14 text-amber-600" />
                                                        )}
                                                    </div>

                                                    {/* DYNAMIC SHOP NAME */}
                                                    <h1 className="text-2xl sm:text-3xl font-black text-[#8B0000] font-serif tracking-wide leading-tight">
                                                        {cardData.shop_name}
                                                    </h1>

                                                    <p className="text-xs text-amber-950 font-bold mt-1">
                                                        {cardData.shop_tagline}
                                                    </p>

                                                    {/* Bengali New Year Banner Ribbon */}
                                                    <div className="inline-flex items-center gap-2 mt-2 bg-gradient-to-r from-[#8B0000] via-[#a81616] to-[#8B0000] text-amber-100 font-bold text-xs px-5 py-1 rounded-full shadow-sm border border-amber-300">
                                                        <span>笶�</span>
                                                        <span>爬ｶ爰≒ｦｭ 爬ｨ爬ｬ爬ｬ爬ｰ爰財ｦｷ 爬� 爬ｬ爬ｾ爬ｰ爰財ｦｷ爬ｿ爬� 爬ｹ爬ｾ爬ｲ爬籾ｦｾ爬､爬ｾ 爬霞ｧ錫ｦｸ爬ｬ 窶� {toBnDigits(year)}</span>
                                                        <span>笶�</span>
                                                    </div>
                                                </div>

                                                {/* Elegant Bengali Customer Greeting */}
                                                <div className="my-3 p-3 bg-white rounded-xl border-2 border-dashed border-amber-300 text-center shadow-2xs">
                                                    <p className="text-xs text-amber-950 font-semibold leading-relaxed font-serif">
                                                        窶悳cardData.greeting}窶�
                                                    </p>
                                                    <p className="text-[11px] text-gray-600 mt-1.5 leading-normal">
                                                        爬ｨ爬､爰≒ｦｨ 爬ｬ爬巵ｦｰ爰�ｦｰ 爬ｶ爰≒ｦｭ爬ｲ爬伶ｧ財ｦｨ爰� 爬�ｦｮ爬ｾ爬ｦ爰�ｦｰ 爬ｦ爰金ｦ歩ｦｾ爬ｨ爰� 爬ｮ爬ｿ爬ｷ爰財ｦ游ｦｿ爬ｮ爰≒ｦ� 爬� 爬ｪ爰≒ｦｰ爬ｾ爬､爬ｨ 爬ｹ爬ｿ爬ｸ爬ｾ爬ｬ 爬ｨ爬ｿ爬ｷ爰財ｦｪ爬､爰財ｦ､爬ｿ 爬歩ｦｰ爰� 爬ｨ爬､爰≒ｦｨ 爬ｬ爬巵ｦｰ爰�ｦｰ 爬ｨ爬､爰≒ｦｨ 爬籾ｦ､爬ｿ爬ｯ爬ｼ爬ｾ爬ｨ 爬霞ｦｨ爰財ｦｮ爰金ｦ壟ｦｨ爰� 爬�ｦｪ爬ｨ爬ｾ爬歩ｧ� 爬ｸ爬ｾ爬ｦ爬ｰ 爬ｨ爬ｿ爬ｮ爬ｨ爰財ｦ､爰財ｦｰ爬｣ 爬憫ｦｾ爬ｨ爬ｾ爬壟ｧ財ｦ巵ｦｿ爭､
                                                    </p>
                                                </div>

                                                {/* Event Ceremony & Reception Box */}
                                                <div className="bg-amber-100/50 rounded-xl p-2.5 border border-amber-300 text-[11px] text-gray-900 space-y-1">
                                                    <div className="flex items-center gap-1.5">
                                                        <Calendar className="w-3.5 h-3.5 text-[#8B0000] flex-shrink-0" />
                                                        <span><strong>爬霞ｧ錫ｦｸ爬ｬ爰�ｦｰ 爬､爬ｾ爬ｰ爬ｿ爬�:</strong> {cardData.event_date}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <Clock className="w-3.5 h-3.5 text-[#8B0000] flex-shrink-0" />
                                                        <span><strong>爬ｸ爬ｮ爬ｯ爬ｼ:</strong> {cardData.event_time}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <Gift className="w-3.5 h-3.5 text-amber-700 flex-shrink-0" />
                                                        <span><strong>爬ｬ爬ｿ爬ｶ爰�ｦｷ 爬�ｦｪ爰財ｦｯ爬ｾ爬ｯ爬ｼ爬ｨ:</strong> 爬説ｦ､爬ｿ爬ｹ爰財ｦｯ爬ｬ爬ｾ爬ｹ爰 爬ｮ爬ｿ爬ｷ爰財ｦ游ｦｿ爬ｮ爰≒ｦ� 爬� 爬ｬ爬ｿ爬ｶ爰�ｦｷ 爬霞ｦｪ爬ｹ爬ｾ爬ｰ</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Left Panel Footer: Dynamic Shop Contact Details */}
                                            <div className="pt-3 border-t border-amber-200 text-[10.5px] text-gray-700 space-y-0.5 mt-3">
                                                <div className="flex items-center gap-1.5">
                                                    <MapPin className="w-3.5 h-3.5 text-[#8B0000] flex-shrink-0" />
                                                    <span><strong>爬�爬ｿ爬歩ｦｾ爬ｨ爬ｾ:</strong> {cardData.shop_address}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <Phone className="w-3.5 h-3.5 text-[#8B0000] flex-shrink-0" />
                                                    <span><strong>爬ｮ爰金ｦｬ爬ｾ爬�ｦｲ:</strong> {toBnDigits(cardData.shop_phone)}</span>
                                                </div>
                                                {cardData.shop_facebook && (
                                                    <div className="flex items-center gap-1.5">
                                                        <Globe className="w-3.5 h-3.5 text-amber-800 flex-shrink-0" />
                                                        <span><strong>爬�ｦｨ爬ｲ爬ｾ爬�ｦｨ:</strong> {cardData.shop_facebook}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* =====================================================================
                                            RIGHT PANEL: Dedicated Customer Financial Account & Ledger Section
                                           ===================================================================== */}
                                        <div className="flex flex-col justify-between p-3 sm:p-4 bg-white rounded-xl border border-amber-200/80">
                                            <div>
                                                {/* Right Panel Header */}
                                                <div className="flex justify-between items-center pb-2 border-b-2 border-[#8B0000]">
                                                    <div>
                                                        <h2 className="text-base font-black text-[#8B0000] font-serif uppercase tracking-wide">
                                                            爬ｹ爬ｾ爬ｲ爬籾ｦｾ爬､爬ｾ 爬ｹ爬ｿ爬ｸ爬ｾ爬ｬ 爬ｬ爬ｿ爬ｬ爬ｰ爬｣爰 爬� 爬籾ｦ､爬ｿ爬ｯ爬ｼ爬ｾ爬ｨ
                                                        </h2>
                                                        <p className="text-[10px] text-gray-600 font-bold">
                                                            爬歩ｦｾ爬ｰ爰財ｦ｡ 爬ｨ爬�: 爬ｹ爬ｾ爬ｲ爬籾ｦｾ爬､爬ｾ-{toBnDigits(year)}-{toBnCustomerCode(selectedCustomer)}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="text-[10px] text-gray-500 font-bold block">爬ｹ爬ｿ爬ｸ爬ｾ爬ｬ爰�ｦｰ 爬､爬ｾ爬ｰ爬ｿ爬�:</span>
                                                        <span className="text-xs font-bold text-gray-900">{cardData.account_date}</span>
                                                    </div>
                                                </div>

                                                {/* Customer Information Section (100% Pure Bangla) */}
                                                <div className="bg-amber-50/40 rounded-xl p-2.5 border border-amber-300 text-xs my-2.5">
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <div>
                                                            <span className="text-[10px] text-amber-900 font-bold uppercase block">爬伶ｧ財ｦｰ爬ｾ爬ｹ爬歩ｧ�ｦｰ 爬ｨ爬ｾ爬ｮ:</span>
                                                            <span className="font-black text-gray-900 text-sm">{cardData.customer_name || '爬ｸ爬ｮ爰財ｦｮ爬ｾ爬ｨ爬ｿ爬､ 爬伶ｧ財ｦｰ爬ｾ爬ｹ爬�'}</span>
                                                        </div>
                                                        <div className="text-right">
                                                            <span className="text-[10px] text-amber-900 font-bold uppercase block">爬ｮ爰金ｦｬ爬ｾ爬�ｦｲ 爬ｨ爬ｮ爰財ｦｬ爬ｰ:</span>
                                                            <span className="font-bold text-gray-800">{toBnDigits(cardData.customer_phone) || '窶�'}</span>
                                                        </div>
                                                        <div className="col-span-2 pt-1 border-t border-amber-200/60 flex justify-between">
                                                            <div>
                                                                <span className="text-[10px] text-amber-900 font-bold uppercase">爬�爬ｿ爬歩ｦｾ爬ｨ爬ｾ: </span>
                                                                <span className="text-gray-800 font-medium">{cardData.customer_address || '爬ｸ爰財ｦ･爬ｾ爬ｨ爰爬ｯ爬ｼ 爬伶ｧ財ｦｰ爬ｾ爬ｹ爬�'}</span>
                                                            </div>
                                                            <div>
                                                                <span className="text-[10px] text-amber-900 font-bold uppercase">爬ｹ爬ｿ爬ｸ爬ｾ爬ｬ 爬ｨ爬�: </span>
                                                                <span className="font-bold text-[#8B0000]">{toBnCustomerCode(selectedCustomer)}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Structured Bengali Financial Account Grid */}
                                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mb-2.5 text-[11px]">
                                                    <div className="bg-amber-50/70 p-2 rounded-lg border border-amber-200 text-center shadow-2xs">
                                                        <span className="text-[10px] text-gray-600 block">爰ｧ. 爬ｪ爰もｦｰ爰財ｦｬ爰�ｦｰ 爬ｬ爬歩ｧ�ｦｯ爬ｼ爬ｾ</span>
                                                        <span className="font-bold text-amber-950 text-xs mt-0.5 block">{fmtTaka(cardData.previous_due)}</span>
                                                    </div>
                                                    <div className="bg-amber-50/70 p-2 rounded-lg border border-amber-200 text-center shadow-2xs">
                                                        <span className="text-[10px] text-gray-600 block">爰ｨ. 爬ｨ爬､爰≒ｦｨ 爬歩ｧ�ｦｨ爬ｾ爬歩ｦｾ爬游ｦｾ</span>
                                                        <span className="font-bold text-amber-900 text-xs mt-0.5 block">{fmtTaka(cardData.new_purchase)}</span>
                                                    </div>
                                                    <div className="bg-emerald-50/70 p-2 rounded-lg border border-emerald-200 text-center shadow-2xs">
                                                        <span className="text-[10px] text-emerald-800 block">爰ｩ. 爬壟ｦｲ爬､爬ｿ 爬ｬ爬巵ｦｰ爰�ｦｰ 爬憫ｦｮ爬ｾ</span>
                                                        <span className="font-bold text-emerald-700 text-xs mt-0.5 block">{fmtTaka(cardData.current_deposit)}</span>
                                                    </div>
                                                    <div className="bg-emerald-50/70 p-2 rounded-lg border border-emerald-200 text-center shadow-2xs">
                                                        <span className="text-[10px] text-emerald-800 block">爰ｪ. 爬�ｦｨ爰財ｦｯ爬ｾ爬ｨ爰財ｦｯ 爬憫ｦｮ爬ｾ</span>
                                                        <span className="font-bold text-emerald-700 text-xs mt-0.5 block">{fmtTaka(cardData.other_payment)}</span>
                                                    </div>
                                                </div>

                                                {/* Summary Totals & Net Balance Card */}
                                                <div className="bg-gradient-to-r from-amber-50 via-white to-amber-50 rounded-xl p-2 border-2 border-amber-300 mb-2.5 shadow-2xs">
                                                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                                                        <div className="border-r border-amber-200 pr-1">
                                                            <span className="text-[10px] font-bold text-gray-600 block">爬ｮ爰金ｦ� 爬ｪ爬ｾ爬内ｦｨ爬ｾ:</span>
                                                            <span className="font-black text-amber-900 text-sm">{fmtTaka(totalDue)}</span>
                                                        </div>
                                                        <div className="border-r border-amber-200 pr-1">
                                                            <span className="text-[10px] font-bold text-emerald-800 block">爬ｮ爰金ｦ� 爬憫ｦｮ爬ｾ:</span>
                                                            <span className="font-black text-emerald-700 text-sm">{fmtTaka(totalPaid)}</span>
                                                        </div>
                                                        <div>
                                                            <span className="text-[10px] font-bold text-rose-700 block">爬ｬ爬ｰ爰財ｦ､爬ｮ爬ｾ爬ｨ 爬ｬ爬歩ｧ�ｦｯ爬ｼ爬ｾ:</span>
                                                            <span className={`font-black text-sm ${balanceDue > 0 ? 'text-rose-700' : 'text-emerald-700'}`}>
                                                                {fmtTaka(balanceDue)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Transaction Table with Clean Writable Lines */}
                                                <div>
                                                    <p className="text-[10.5px] font-bold text-[#8B0000] mb-1 flex items-center gap-1 font-serif">
                                                        <span>爬ｲ爰�ｦｨ爬ｦ爰�ｦｨ 爬� 爬籾ｦ､爬ｿ爬ｯ爬ｼ爬ｾ爬ｨ 爬ｹ爬ｿ爬ｸ爬ｾ爬ｬ 爬巵ｦ�:</span>
                                                    </p>
                                                    <table className="w-full text-left text-[10.5px] border-collapse border border-gray-300">
                                                        <thead>
                                                            <tr className="bg-[#8B0000] text-amber-100 font-bold text-center">
                                                                <th className="py-1 px-1.5 border border-amber-800 w-20">爬､爬ｾ爬ｰ爬ｿ爬�</th>
                                                                <th className="py-1 px-1.5 border border-amber-800">爬ｬ爬ｿ爬ｬ爬ｰ爬｣</th>
                                                                <th className="py-1 px-1.5 border border-amber-800 text-right w-20">爬憫ｦｮ爬ｾ (爰ｳ)</th>
                                                                <th className="py-1 px-1.5 border border-amber-800 text-right w-24">爬籾ｦｰ爬�/爬歩ｧ�ｦｨ爬ｾ爬歩ｦｾ爬游ｦｾ (爰ｳ)</th>
                                                                <th className="py-1 px-1.5 border border-amber-800 text-right w-24">爬�ｦｬ爬ｶ爬ｿ爬ｷ爰財ｦ� 爬ｬ爬歩ｧ�ｦｯ爬ｼ爬ｾ (爰ｳ)</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-gray-200 text-gray-800 bg-white">
                                                            {/* Row 1: Carried Forward Previous Due */}
                                                            <tr className="bg-amber-50/40 font-medium">
                                                                <td className="py-1 px-1.5 border border-gray-200 text-center text-gray-600 font-serif">爰ｧ爬ｲ爬ｾ 爬ｬ爰謂ｦｶ爬ｾ爬�</td>
                                                                <td className="py-1 px-1.5 border border-gray-200 font-bold">爬ｪ爰財ｦｰ爬ｾ爬ｰ爬ｮ爰財ｦｭ爬ｿ爬� 爬ｬ爬歩ｧ�ｦｯ爬ｼ爬ｾ 爬憫ｧ�ｦｰ</td>
                                                                <td className="py-1 px-1.5 border border-gray-200 text-right">窶�</td>
                                                                <td className="py-1 px-1.5 border border-gray-200 text-right font-bold text-amber-900">{fmtTaka(cardData.previous_due)}</td>
                                                                <td className="py-1 px-1.5 border border-gray-200 text-right font-bold">{fmtTaka(cardData.previous_due)}</td>
                                                            </tr>
                                                            {/* Row 2: Purchases */}
                                                            {Number(cardData.new_purchase) > 0 && (
                                                                <tr>
                                                                    <td className="py-1 px-1.5 border border-gray-200 text-center text-gray-600">{toBnDigits(year)}</td>
                                                                    <td className="py-1 px-1.5 border border-gray-200">爬ｨ爬､爰≒ｦｨ 爬�ｦｲ爬もｦ歩ｦｾ爬ｰ 爬歩ｧ財ｦｰ爬ｯ爬ｼ</td>
                                                                    <td className="py-1 px-1.5 border border-gray-200 text-right">窶�</td>
                                                                    <td className="py-1 px-1.5 border border-gray-200 text-right font-bold text-amber-900">{fmtTaka(cardData.new_purchase)}</td>
                                                                    <td className="py-1 px-1.5 border border-gray-200 text-right font-bold">{fmtTaka(Number(cardData.previous_due) + Number(cardData.new_purchase))}</td>
                                                                </tr>
                                                            )}
                                                            {/* Row 3: Payments */}
                                                            {Number(cardData.current_deposit) > 0 && (
                                                                <tr>
                                                                    <td className="py-1 px-1.5 border border-gray-200 text-center text-gray-600">{toBnDigits(year)}</td>
                                                                    <td className="py-1 px-1.5 border border-gray-200">爬ｹ爬ｾ爬ｲ爬籾ｦｾ爬､爬ｾ 爬ｪ爬ｰ爬ｿ爬ｶ爰金ｦｧ 爬憫ｦｮ爬ｾ</td>
                                                                    <td className="py-1 px-1.5 border border-gray-200 text-right font-bold text-emerald-700">{fmtTaka(cardData.current_deposit)}</td>
                                                                    <td className="py-1 px-1.5 border border-gray-200 text-right">窶�</td>
                                                                    <td className="py-1 px-1.5 border border-gray-200 text-right font-bold">{fmtTaka(balanceDue)}</td>
                                                                </tr>
                                                            )}
                                                            {/* Clean Blank Writable Rows for Manual Handwriting */}
                                                            {[1, 2, 3].map((r) => (
                                                                <tr key={r} className="h-7 hover:bg-amber-50/20">
                                                                    <td className="border border-gray-200 border-dashed text-center"></td>
                                                                    <td className="border border-gray-200 border-dashed"></td>
                                                                    <td className="border border-gray-200 border-dashed text-right"></td>
                                                                    <td className="border border-gray-200 border-dashed text-right"></td>
                                                                    <td className="border border-gray-200 border-dashed text-right"></td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>

                                            {/* Right Panel Footer: Signatures & Traditional Circular Seal */}
                                            <div className="pt-3 mt-3 border-t border-dashed border-gray-400 flex justify-between items-end">
                                                {/* Customer Signature */}
                                                <div className="text-center">
                                                    <div className="border-t-2 border-gray-700 w-32 pt-1 text-[10.5px] text-gray-800 font-bold">
                                                        爬伶ｧ財ｦｰ爬ｾ爬ｹ爬歩ｧ�ｦｰ 爬ｸ爰財ｦｬ爬ｾ爬歩ｧ財ｦｷ爬ｰ
                                                    </div>
                                                </div>

                                                {/* Auspicious Stamped Seal */}
                                                <div className="w-20 h-20 rounded-full border-2 border-dashed border-[#8B0000] p-0.5 flex items-center justify-center text-center text-[#8B0000] select-none rotate-[-6deg] bg-amber-50/50 shadow-2xs">
                                                    <div className="w-full h-full rounded-full border border-[#8B0000] flex flex-col items-center justify-center p-0.5">
                                                        <span className="text-[6.5px] font-bold tracking-widest uppercase">笘� 爬ｶ爰≒ｦｭ 爬ｹ爬ｾ爬ｲ爬籾ｦｾ爬､爬ｾ 笘�</span>
                                                        <span className="text-[11px] font-black font-serif my-0.5">{toBnDigits(year)}</span>
                                                        <span className="text-[6.5px] font-bold">爬�ｦｨ爰≒ｦｮ爰金ｦｦ爬ｿ爬､ 爬ｹ爬ｿ爬ｸ爬ｾ爬ｬ</span>
                                                    </div>
                                                </div>

                                                {/* Authorized Signatory */}
                                                <div className="text-center">
                                                    <div className="border-t-2 border-gray-700 w-44 pt-1 text-[10.5px] text-gray-800 font-bold">
                                                        爬ｬ爬ｿ爬ｨ爰爬､ 窶� 爬ｸ爰財ｦｬ爬､爰財ｦｬ爬ｾ爬ｧ爬ｿ爬歩ｦｾ爬ｰ爰 / 爬ｹ爬ｿ爬ｸ爬ｾ爬ｬ爬ｰ爬歩ｧ財ｦｷ爬�
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* =========================================================================
                                2. PORTRAIT CARD LAYOUT (ALTERNATIVE FORMAT)
                               ========================================================================= */}
                            {cardLayout === 'portrait' && (
                                <div 
                                    id="halkhata-printable-card"
                                    className="bg-[#fffef9] rounded-2xl p-6 sm:p-8 shadow-xl relative border-4 border-[#8B0000] text-gray-900 print:shadow-none print:rounded-none w-full max-w-[680px]"
                                    style={{
                                        outline: '3px double #d4af37',
                                        outlineOffset: '-8px'
                                    }}
                                >
                                    {/* Traditional Header */}
                                    <div className="text-center pb-3 border-b-2 border-dashed border-amber-300">
                                        <p className="text-xs font-bold text-[#8B0000] tracking-widest uppercase font-serif">
                                            {auspiciousMap[auspiciousHeader]}
                                        </p>
                                        <h2 className="text-2xl sm:text-3xl font-black text-[#8B0000] font-serif mt-1">
                                            {cardData.shop_name}
                                        </h2>
                                        <p className="text-xs text-amber-950 font-bold">{cardData.shop_tagline}</p>
                                        <p className="text-[11px] text-gray-600">爬�爬ｿ爬歩ｦｾ爬ｨ爬ｾ: {cardData.shop_address} | 爬ｮ爰金ｦｬ爬ｾ爬�ｦｲ: {toBnDigits(cardData.shop_phone)}</p>
                                        
                                        <div className="inline-block mt-2 bg-gradient-to-r from-[#8B0000] to-[#a81616] text-amber-100 font-bold text-xs px-5 py-1 rounded-full border border-amber-300">
                                            爬ｬ爬ｾ爬ｰ爰財ｦｷ爬ｿ爬� 爬ｶ爰≒ｦｭ 爬ｹ爬ｾ爬ｲ爬籾ｦｾ爬､爬ｾ 爬霞ｧ錫ｦｸ爬ｬ 窶� {toBnDigits(year)} 爬ｸ爬ｾ爬ｲ
                                        </div>
                                    </div>

                                    {/* Customer Greeting */}
                                    <div className="my-3 p-2.5 bg-amber-50/60 rounded-xl border border-amber-300 text-center">
                                        <p className="text-xs text-amber-950 font-serif italic">窶悳cardData.greeting}窶�</p>
                                    </div>

                                    {/* Customer Details */}
                                    <div className="bg-amber-50/30 rounded-xl p-2.5 border border-amber-200 text-xs mb-3">
                                        <div className="grid grid-cols-2 gap-1.5">
                                            <div><strong>爬伶ｧ財ｦｰ爬ｾ爬ｹ爬歩ｧ�ｦｰ 爬ｨ爬ｾ爬ｮ:</strong> {cardData.customer_name}</div>
                                            <div className="text-right"><strong>爬ｮ爰金ｦｬ爬ｾ爬�ｦｲ:</strong> {toBnDigits(cardData.customer_phone)}</div>
                                            <div><strong>爬�爬ｿ爬歩ｦｾ爬ｨ爬ｾ:</strong> {cardData.customer_address}</div>
                                            <div className="text-right"><strong>爬､爬ｾ爬ｰ爬ｿ爬�:</strong> {cardData.account_date}</div>
                                        </div>
                                    </div>

                                    {/* Financial Summary */}
                                    <div className="rounded-xl border-2 border-[#8B0000] overflow-hidden text-xs mb-3">
                                        <div className="bg-[#8B0000] text-amber-100 px-3 py-1.5 font-bold flex justify-between">
                                            <span>爬ｹ爬ｾ爬ｲ爬籾ｦｾ爬､爬ｾ 爬ｦ爰�ｦｨ爬ｾ-爬ｪ爬ｾ爬内ｦｨ爬ｾ 爬ｬ爬ｿ爬ｬ爬ｰ爬｣爰</span>
                                            <span>爬游ｦｾ爬歩ｦｾ爬ｰ 爬ｪ爬ｰ爬ｿ爬ｮ爬ｾ爬｣</span>
                                        </div>
                                        <div className="divide-y divide-gray-100 bg-white">
                                            <div className="px-3 py-1.5 flex justify-between">
                                                <span>爰ｧ. 爬ｪ爰もｦｰ爰財ｦｬ爰�ｦｰ 爬ｬ爬歩ｧ�ｦｯ爬ｼ爬ｾ:</span>
                                                <span className="font-bold">{fmtTaka(cardData.previous_due)}</span>
                                            </div>
                                            <div className="px-3 py-1.5 flex justify-between">
                                                <span>爰ｨ. 爬ｨ爬､爰≒ｦｨ 爬歩ｧ�ｦｨ爬ｾ爬歩ｦｾ爬游ｦｾ (+):</span>
                                                <span className="font-bold text-amber-900">{fmtTaka(cardData.new_purchase)}</span>
                                            </div>
                                            <div className="px-3 py-1.5 flex justify-between">
                                                <span>爰ｩ. 爬壟ｦｲ爬､爬ｿ 爬ｬ爬巵ｦｰ爰�ｦｰ 爬憫ｦｮ爬ｾ (-):</span>
                                                <span className="font-bold text-emerald-700">{fmtTaka(cardData.current_deposit)}</span>
                                            </div>
                                            <div className="px-3 py-2 bg-amber-50 flex justify-between font-bold border-t border-amber-200">
                                                <span className="text-[#8B0000] font-black">爬ｬ爬ｰ爰財ｦ､爬ｮ爬ｾ爬ｨ 爬ｬ爬歩ｧ�ｦｯ爬ｼ爬ｾ 爬憫ｧ�ｦｰ:</span>
                                                <span className="text-sm font-black text-rose-700">{fmtTaka(balanceDue)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Signatures */}
                                    <div className="pt-3 border-t border-dashed border-gray-300 flex justify-between text-[11px]">
                                        <div className="border-t border-gray-500 w-32 text-center pt-1">爬伶ｧ財ｦｰ爬ｾ爬ｹ爬歩ｧ�ｦｰ 爬ｸ爰財ｦｬ爬ｾ爬歩ｧ財ｦｷ爬ｰ</div>
                                        <div className="border-t border-gray-500 w-36 text-center pt-1">爬歩ｦｰ爰財ｦ､爰�ｦｪ爬歩ｧ財ｦｷ爰�ｦｰ 爬ｸ爰財ｦｬ爬ｾ爬歩ｧ財ｦｷ爬ｰ</div>
                                    </div>
                                </div>
                            )}

                        </div>

                        {/* Sticky Footer Action Toolbar */}
                        <div className="flex-shrink-0 px-5 py-3 border-t-2 border-amber-300 flex items-center justify-between bg-gray-50 print:hidden">
                            <div className="text-xs text-gray-600 font-medium flex items-center gap-2">
                                <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                                <span>A4 爬ｲ爰財ｦｯ爬ｾ爬ｨ爰財ｦ｡爬ｸ爰財ｦ歩ｧ�ｦｪ 爬ｮ爰金ｦ｡爰� 爬ｪ爰財ｦｰ爬ｿ爬ｨ爰財ｦ� 爬ｬ爬ｾ PDF 爬ｹ爬ｿ爬ｸ爰�ｦｬ爰� 爬ｸ爬もｦｰ爬歩ｧ財ｦｷ爬｣ 爬歩ｦｰ爰≒ｦｨ爭､</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={closeSlipModal}
                                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl text-xs font-bold transition cursor-pointer"
                                >
                                    爬ｬ爬ｨ爰財ｦｧ 爬歩ｦｰ爰≒ｦｨ
                                </button>
                                <button
                                    type="button"
                                    onClick={printSingleCard}
                                    className="px-5 py-2 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer hover:opacity-90"
                                    style={{ backgroundColor: 'rgb(177, 118, 51)' }}
                                >
                                    <Printer className="w-4 h-4" />
                                    <span>爬歩ｦｾ爬ｰ爰財ｦ｡ 爬ｪ爰財ｦｰ爬ｿ爬ｨ爰財ｦ� / PDF</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* BATCH PRINT ALL CUSTOMER CARDS MODAL (Rule #6 React Portal) */}
            {batchModalOpen && createPortal(
                <div 
                    id="halkhata-batch-portal"
                    className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 print:p-0"
                    style={{ background: 'rgba(15,23,42,0.85)' }}
                >
                    <div 
                        className="bg-white rounded-3xl w-full shadow-2xl flex flex-col border-2 border-amber-400 overflow-hidden print:border-none print:shadow-none print:w-full print:max-w-none"
                        style={{ maxWidth: '960px', maxHeight: '92vh' }}
                    >
                        {/* Header */}
                        <div className="flex-shrink-0 px-6 py-4 border-b border-amber-200 bg-amber-50 flex items-center justify-between print:hidden">
                            <div className="flex items-center gap-2">
                                <Layers className="w-5 h-5 text-amber-800" />
                                <h3 className="font-bold text-gray-900 text-sm">
                                    爬鐘ｦ歩ｦｸ爬ｾ爬･爰� 爬ｸ爬歩ｦｲ 爬伶ｧ財ｦｰ爬ｾ爬ｹ爬歩ｧ�ｦｰ 爬ｹ爬ｾ爬ｲ爬籾ｦｾ爬､爬ｾ 爬歩ｦｾ爬ｰ爰財ｦ｡ 爬ｪ爰財ｦｰ爬ｿ爬ｨ爰財ｦ� ({toBnDigits(customerList.length)} 爬游ｦｿ 爬歩ｦｾ爬ｰ爰財ｦ｡)
                                </h3>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setBatchModalOpen(false)}
                                    className="px-3.5 py-1.5 bg-gray-200 text-gray-800 rounded-xl text-xs font-bold transition cursor-pointer"
                                >
                                    爬ｬ爬ｨ爰財ｦｧ 爬歩ｦｰ爰≒ｦｨ
                                </button>
                                <button
                                    type="button"
                                    onClick={printBatchCards}
                                    className="px-4 py-1.5 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm hover:opacity-90"
                                    style={{ backgroundColor: 'rgb(177, 118, 51)' }}
                                >
                                    <Printer className="w-4 h-4" />
                                    <span>爬ｸ爬歩ｦｲ 爬歩ｦｾ爬ｰ爰財ｦ｡ 爬ｪ爰財ｦｰ爬ｿ爬ｨ爰財ｦ� 爬歩ｦｰ爰≒ｦｨ</span>
                                </button>
                            </div>
                        </div>

                        {/* Batch Preview List */}
                        <div className="flex-1 overflow-y-auto p-4 bg-gray-100 space-y-6 print:p-0 print:bg-white">
                            {customerList.map((c, index) => {
                                const prevDue = Number(c.opening_due || 0);
                                const newPurch = Number(c.period_sales || 0);
                                const curDeposit = Number(c.period_payments || 0);
                                const tDue = prevDue + newPurch;
                                const tPaid = curDeposit;
                                const bDue = tDue - tPaid;

                                return (
                                    <div key={c.id} className="halkhata-batch-page">
                                        <div 
                                            className="bg-[#fffef9] rounded-2xl shadow-md border-4 border-[#8B0000] text-gray-900 p-6 w-full max-w-[960px] mx-auto print:shadow-none"
                                            style={{ outline: '3px double #d4af37', outlineOffset: '-8px' }}
                                        >
                                            <div className="grid grid-cols-2 gap-6 relative">
                                                {/* Left Panel */}
                                                <div className="flex flex-col justify-between p-4 bg-amber-50/40 rounded-xl border border-amber-200">
                                                    <div className="text-center">
                                                        <p className="text-xs font-bold text-[#8B0000] font-serif">爭､爭､ 爬鐘ｦｲ爬ｾ爬ｹ爰 爬ｭ爬ｰ爬ｸ爬ｾ 爭､爭､</p>
                                                        <h2 className="text-2xl font-black text-[#8B0000] font-serif mt-1">{company?.name || cardData.shop_name || '爬ｸ爰財ｦｬ爬ｰ爰財ｦ｣爬ｾ爬ｲ爬もｦ歩ｦｾ爬ｰ 爬憫ｧ≒ｦｯ爬ｼ爰�ｦｲ爬ｾ爬ｰ爰財ｦｸ'}</h2>
                                                        <p className="text-xs text-amber-950 font-bold">{company?.tagline || '爬ｸ爰財ｦｬ爬ｰ爰財ｦ｣, 爬ｰ爰呉ｦｪ爰財ｦｯ 爬� 爬｡爬ｾ爬ｯ爬ｼ爬ｮ爬ｨ爰財ｦ｡ 爬�ｦｲ爬もｦ歩ｦｾ爬ｰ爰�ｦｰ 爬ｨ爬ｿ爬ｰ爰財ｦｭ爬ｰ爬ｯ爰金ｦ伶ｧ財ｦｯ 爬ｪ爰財ｦｰ爬､爬ｿ爬ｷ爰財ｦ�爬ｾ爬ｨ'}</p>
                                                        <p className="text-[10px] text-gray-600 mt-1">爬�爬ｿ爬歩ｦｾ爬ｨ爬ｾ: {c.branch_address || company?.address || '爬｢爬ｾ爬歩ｦｾ'} | 爬ｫ爰金ｦｨ: {toBnDigits(c.branch_phone || company?.phone || '')}</p>
                                                        
                                                        <div className="inline-block mt-3 bg-[#8B0000] text-amber-100 font-bold text-xs px-4 py-0.5 rounded-full">
                                                            爬ｬ爬ｾ爬ｰ爰財ｦｷ爬ｿ爬� 爬ｶ爰≒ｦｭ 爬ｹ爬ｾ爬ｲ爬籾ｦｾ爬､爬ｾ 爬霞ｧ錫ｦｸ爬ｬ 窶� {toBnDigits(year)}
                                                        </div>

                                                        <div className="my-4 p-3 bg-white rounded-xl border border-dashed border-amber-300 text-xs text-amber-950 font-serif">
                                                            窶憫ｦｨ爬､爰≒ｦｨ 爬ｬ爬巵ｦｰ爰�ｦｰ 爬ｶ爰≒ｦｭ爰�ｦ壟ｧ財ｦ巵ｦｾ 爬� 爬�ｦｭ爬ｿ爬ｨ爬ｨ爰財ｦｦ爬ｨ爭､ 爬�ｦｪ爬ｨ爬ｾ爬ｰ 爬ｬ爬ｿ爬ｶ爰財ｦｬ爬ｾ爬ｸ 爬� 爬ｭ爬ｾ爬ｲ爰金ｦｬ爬ｾ爬ｸ爬ｾ爬� 爬�ｦｮ爬ｾ爬ｦ爰�ｦｰ 爬ｪ爬･爬壟ｦｲ爬ｾ爬ｰ 爬ｪ爰財ｦｰ爰�ｦｰ爬｣爬ｾ爭､窶�
                                                        </div>
                                                    </div>

                                                    <div className="text-[10px] text-gray-600 border-t border-amber-200 pt-2">
                                                        <span>爬ｸ爰財ｦ･爬ｾ爬ｨ: {c.branch_address || company?.address} | 爬ｮ爬ｿ爬ｷ爰財ｦ游ｦｿ爬ｮ爰≒ｦ� 爬� 爬霞ｦｪ爬ｹ爬ｾ爬ｰ爰�ｦｰ 爬ｸ爬ｾ爬ｦ爬ｰ 爬ｨ爬ｿ爬ｮ爬ｨ爰財ｦ､爰財ｦｰ爬｣爭､</span>
                                                    </div>
                                                </div>

                                                {/* Right Panel */}
                                                <div className="flex flex-col justify-between p-4 bg-white rounded-xl border border-amber-200">
                                                    <div>
                                                        <div className="flex justify-between items-center pb-2 border-b-2 border-[#8B0000]">
                                                            <div>
                                                                <h3 className="text-sm font-black text-[#8B0000] font-serif">爬ｹ爬ｾ爬ｲ爬籾ｦｾ爬､爬ｾ 爬ｹ爬ｿ爬ｸ爬ｾ爬ｬ 爬ｬ爬ｿ爬ｬ爬ｰ爬｣爰</h3>
                                                                <p className="text-[10px] text-gray-500 font-mono">爬歩ｧ金ｦ｡: {toBnDigits(c.code)}</p>
                                                            </div>
                                                            <div className="text-right text-[10px] text-gray-600 font-bold">
                                                                爬､爬ｾ爬ｰ爬ｿ爬�: {getBengaliFormattedDate()}
                                                            </div>
                                                        </div>

                                                        <div className="bg-amber-50/50 p-2 rounded-lg border border-amber-200 text-xs my-2">
                                                            <p><strong>爬伶ｧ財ｦｰ爬ｾ爬ｹ爬歩ｧ�ｦｰ 爬ｨ爬ｾ爬ｮ:</strong> {c.name}</p>
                                                            <p><strong>爬ｮ爰金ｦｬ爬ｾ爬�ｦｲ:</strong> {toBnDigits(c.phone)}</p>
                                                        </div>

                                                        <div className="grid grid-cols-3 gap-1.5 text-center text-[10.5px] mb-2">
                                                            <div className="bg-amber-50 p-1.5 rounded border border-amber-200">
                                                                <span className="block text-gray-500 text-[9px]">爬ｮ爰金ｦ� 爬ｪ爬ｾ爬内ｦｨ爬ｾ</span>
                                                                <span className="font-bold text-amber-900">{fmtTaka(tDue)}</span>
                                                            </div>
                                                            <div className="bg-emerald-50 p-1.5 rounded border border-emerald-200">
                                                                <span className="block text-emerald-800 text-[9px]">爬ｮ爰金ｦ� 爬憫ｦｮ爬ｾ</span>
                                                                <span className="font-bold text-emerald-700">{fmtTaka(tPaid)}</span>
                                                            </div>
                                                            <div className="bg-rose-50 p-1.5 rounded border border-rose-200">
                                                                <span className="block text-rose-700 text-[9px]">爬ｬ爬ｰ爰財ｦ､爬ｮ爬ｾ爬ｨ 爬ｬ爬歩ｧ�ｦｯ爬ｼ爬ｾ</span>
                                                                <span className="font-black text-rose-700">{fmtTaka(bDue)}</span>
                                                            </div>
                                                        </div>

                                                        <table className="w-full text-[10px] border border-gray-300">
                                                            <thead>
                                                                <tr className="bg-[#8B0000] text-amber-100 text-center font-bold">
                                                                    <th className="p-1 border border-amber-800">爬､爬ｾ爬ｰ爬ｿ爬�</th>
                                                                    <th className="p-1 border border-amber-800">爬ｬ爬ｿ爬ｬ爬ｰ爬｣</th>
                                                                    <th className="p-1 border border-amber-800 text-right">爬憫ｦｮ爬ｾ (爰ｳ)</th>
                                                                    <th className="p-1 border border-amber-800 text-right">爬籾ｦｰ爬� (爰ｳ)</th>
                                                                    <th className="p-1 border border-amber-800 text-right">爬�ｦｬ爬ｶ爬ｿ爬ｷ爰財ｦ� (爰ｳ)</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="divide-y divide-gray-200">
                                                                <tr>
                                                                    <td className="p-1 text-center font-mono text-gray-500">爬ｪ爰財ｦｰ爬ｾ爬ｰ爬ｮ爰財ｦｭ爬ｿ爬�</td>
                                                                    <td className="p-1">爬ｪ爰もｦｰ爰財ｦｬ爰�ｦｰ 爬ｬ爬歩ｧ�ｦｯ爬ｼ爬ｾ 爬憫ｧ�ｦｰ</td>
                                                                    <td className="p-1 text-right">窶�</td>
                                                                    <td className="p-1 text-right font-bold">{fmtTaka(prevDue)}</td>
                                                                    <td className="p-1 text-right font-bold">{fmtTaka(prevDue)}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="p-1 text-center font-mono text-gray-500">{toBnDigits(year)}</td>
                                                                    <td className="p-1">爬壟ｦｲ爬､爬ｿ 爬ｬ爬巵ｦｰ爰�ｦｰ 爬�ｦｲ爬もｦ歩ｦｾ爬ｰ 爬歩ｧ財ｦｰ爬ｯ爬ｼ</td>
                                                                    <td className="p-1 text-right">窶�</td>
                                                                    <td className="p-1 text-right font-bold">{fmtTaka(newPurch)}</td>
                                                                    <td className="p-1 text-right font-bold">{fmtTaka(tDue)}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="p-1 text-center font-mono text-gray-500">{toBnDigits(year)}</td>
                                                                    <td className="p-1">爬ｪ爬ｰ爬ｿ爬ｶ爰金ｦｧ 爬憫ｦｮ爬ｾ</td>
                                                                    <td className="p-1 text-right font-bold text-emerald-700">{fmtTaka(curDeposit)}</td>
                                                                    <td className="p-1 text-right">窶�</td>
                                                                    <td className="p-1 text-right font-bold">{fmtTaka(bDue)}</td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>

                                                    <div className="pt-3 border-t border-dashed border-gray-400 flex justify-between items-end text-[10px]">
                                                        <div className="border-t border-gray-500 w-28 text-center pt-1">爬伶ｧ財ｦｰ爬ｾ爬ｹ爬歩ｧ�ｦｰ 爬ｸ爰財ｦｬ爬ｾ爬歩ｧ財ｦｷ爬ｰ</div>
                                                        <div className="text-[#8B0000] font-bold">笘� 爬�ｦｨ爰≒ｦｮ爰金ｦｦ爬ｿ爬､ 爬ｸ爬ｿ爬ｲ 笘�</div>
                                                        <div className="border-t border-gray-500 w-32 text-center pt-1">爬歩ｦｰ爰財ｦ､爰�ｦｪ爬歩ｧ財ｦｷ爰�ｦｰ 爬ｸ爰財ｦｬ爬ｾ爬歩ｧ財ｦｷ爬ｰ</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </AuthenticatedLayout>
    );
}
