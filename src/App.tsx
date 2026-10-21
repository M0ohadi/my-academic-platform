/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import {
  GraduationCap,
  Sparkles,
  Search,
  BookOpen,
  Filter,
  CheckCircle2,
  Code2,
  ShieldCheck,
  Layers,
  ArrowDown,
  History,
  Copy,
  Check,
  ChevronRight,
  TrendingUp,
  FileCheck2,
  FileText,
  Printer,
} from 'lucide-react';
import { Header } from './components/Header';
import { ServiceCard } from './components/ServiceCard';
import { AcademicWorkbench } from './components/AcademicWorkbench';
import { FastAPICodeModal } from './components/FastAPICodeModal';
import { EthicsModal } from './components/EthicsModal';
import { ACADEMIC_SERVICES } from './data/servicesData';
import { exportToWord, exportToPDF } from './utils/academicExport';
import { AcademicService, ServiceCategory, ProcessingHistoryItem } from './types';

export default function App() {
  const [selectedService, setSelectedService] = useState<AcademicService>(
    ACADEMIC_SERVICES[1] // Default: Paraphrasing (إعادة الصياغة الأكاديمية) as highlighted in prompt
  );
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isFastAPIModalOpen, setIsFastAPIModalOpen] = useState<boolean>(false);
  const [isEthicsModalOpen, setIsEthicsModalOpen] = useState<boolean>(false);
  const [historyItems, setHistoryItems] = useState<ProcessingHistoryItem[]>([]);
  const [copiedHistoryId, setCopiedHistoryId] = useState<string | null>(null);

  const workbenchRef = useRef<HTMLDivElement | null>(null);
  const servicesListRef = useRef<HTMLDivElement | null>(null);

  // Filter services by category and search
  const filteredServices = ACADEMIC_SERVICES.filter((svc) => {
    const matchesCategory =
      activeCategory === 'all' || svc.category === activeCategory;
    const matchesSearch =
      svc.title.includes(searchQuery) ||
      svc.shortDescription.includes(searchQuery) ||
      svc.englishTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      svc.targetFields.some((f) => f.includes(searchQuery));
    return matchesCategory && matchesSearch;
  });

  const handleSelectService = (service: AcademicService) => {
    setSelectedService(service);
    // Smooth scroll to workbench
    if (workbenchRef.current) {
      workbenchRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleScrollToServices = () => {
    if (servicesListRef.current) {
      servicesListRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleProcessedResult = (
    serviceId: string,
    input: string,
    result: string
  ) => {
    const svc = ACADEMIC_SERVICES.find((s) => s.id === serviceId);
    const newItem: ProcessingHistoryItem = {
      id: `${Date.now()}`,
      serviceId,
      serviceTitle: svc ? svc.title : serviceId,
      timestamp: new Date().toLocaleTimeString('ar-SA', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      inputSnippet: input.slice(0, 100) + (input.length > 100 ? '...' : ''),
      result,
    };
    setHistoryItems((prev) => [newItem, ...prev.slice(0, 4)]);
  };

  const copyHistoryResult = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedHistoryId(id);
      setTimeout(() => setCopiedHistoryId(null), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-indigo-900 selection:text-white">
      {/* Top Academic Header */}
      <Header
        onOpenFastAPIModal={() => setIsFastAPIModalOpen(true)}
        onOpenEthicsModal={() => setIsEthicsModalOpen(true)}
        onScrollToServices={handleScrollToServices}
      />

      <main className="flex-1">
        {/* Academic Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white pt-14 pb-20 px-4 sm:px-6 lg:px-8 border-b border-indigo-950">
          {/* Subtle background academic grid pattern */}
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#818cf8_1px,transparent_1px)] [background-size:24px_24px]"></div>

          <div className="relative max-w-5xl mx-auto text-center">
            {/* Academic Quality Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-400/30 text-indigo-300 text-xs md:text-sm font-semibold mb-6">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>منظومة متكاملة لـ 10 خدمات بحثية دقيقة لرسائل الماجستير والدكتوراه</span>
            </div>

            {/* Main Headline in Cairo */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black font-cairo tracking-tight leading-tight sm:leading-tight md:leading-tight mb-6">
              الرصانة الأكاديمية الفائقة{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-indigo-200 via-sky-300 to-indigo-100">
                بتقنيات الذكاء الاصطناعي
              </span>
            </h1>

            {/* Subheading in Tajawal */}
            <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed mb-10">
              صُممت منصة <strong className="text-white font-bold">إسناد</strong> لتمكين الباحثين وطلبة الدراسات العليا من صياغة أطروحاتهم وفق أعلى المعايير المنهجية المحكمة، مع التزام صارم بقواعد انعدام الهلوسة (Zero Hallucination) وتوثيق APA المعتمد.
            </p>

            {/* Key Value Propositions */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto mb-10 text-right">
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-xs text-slate-400">الدقة العلمية</span>
                  <span className="text-xs sm:text-sm font-bold text-white font-cairo">صفر هلوسة</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
                  <FileCheck2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-xs text-slate-400">التوثيق المعتمد</span>
                  <span className="text-xs sm:text-sm font-bold text-white font-cairo">APA 7th & MLA</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-300 flex items-center justify-center shrink-0">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-xs text-slate-400">التحليل الإحصائي</span>
                  <span className="text-xs sm:text-sm font-bold text-white font-cairo">SPSS & R & Excel</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-xs text-slate-400">حماية الأصالة</span>
                  <span className="text-xs sm:text-sm font-bold text-white font-cairo">محاكي كشف الاقتباس</span>
                </div>
              </div>
            </div>

            {/* Call to Actions */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={handleScrollToServices}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold font-cairo bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-600/30 transition-all cursor-pointer"
              >
                <span>استكشاف الخدمات الـ 10 التفاعلية</span>
                <ArrowDown className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsFastAPIModalOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold font-cairo bg-white/10 hover:bg-white/15 text-white border border-white/20 transition-all cursor-pointer"
              >
                <Code2 className="w-4 h-4 text-emerald-400" />
                <span>عرض كود Python (FastAPI Backend)</span>
              </button>
            </div>
          </div>
        </section>

        {/* Live Active Workbench Container */}
        <section ref={workbenchRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20 mb-16">
          <AcademicWorkbench
            service={selectedService}
            onProcessed={handleProcessedResult}
          />
        </section>

        {/* The 10 Core Services Catalog Section */}
        <section ref={servicesListRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-slate-200">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 text-indigo-700 text-xs font-bold font-mono uppercase tracking-widest mb-1">
                <Layers className="w-4 h-4" />
                <span>حقيبة الخدمات الأكاديمية العشر</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-cairo text-slate-900">
                منظومة الخدمات البحثية الموجهة للدراسات العليا
              </h2>
              <p className="text-sm text-slate-500 mt-1 max-w-xl">
                اختر أي خدمة للانتقال الفوري إلى محطة المعالجة المخصصة لها أعلاه مع نماذج جاهزة
              </p>
            </div>

            {/* Search Input */}
            <div className="w-full md:w-80 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن خدمة، منهج، SPSS، توثيق..."
                className="w-full pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-600 shadow-xs"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 text-xs font-semibold">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 rounded-xl transition-all shrink-0 cursor-pointer ${
                activeCategory === 'all'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              كافة الخدمات ({ACADEMIC_SERVICES.length})
            </button>

            <button
              onClick={() => setActiveCategory('writing')}
              className={`px-4 py-2 rounded-xl transition-all shrink-0 cursor-pointer ${
                activeCategory === 'writing'
                  ? 'bg-indigo-700 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              الصياغة والترجمة (3)
            </button>

            <button
              onClick={() => setActiveCategory('methodology')}
              className={`px-4 py-2 rounded-xl transition-all shrink-0 cursor-pointer ${
                activeCategory === 'methodology'
                  ? 'bg-purple-700 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              التصميم المنهجي والهيكل (4)
            </button>

            <button
              onClick={() => setActiveCategory('analysis')}
              className={`px-4 py-2 rounded-xl transition-all shrink-0 cursor-pointer ${
                activeCategory === 'analysis'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              التحليل الإحصائي (1)
            </button>

            <button
              onClick={() => setActiveCategory('integrity')}
              className={`px-4 py-2 rounded-xl transition-all shrink-0 cursor-pointer ${
                activeCategory === 'integrity'
                  ? 'bg-amber-700 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              التوثيق والرصانة (2)
            </button>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                isSelected={selectedService.id === service.id}
                onSelect={handleSelectService}
              />
            ))}
          </div>

          {filteredServices.length === 0 && (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 mt-6">
              <Search className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-semibold font-cairo text-slate-700">
                لم يتم العثور على خدمات تطابق معايير البحث
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
                className="mt-3 text-xs text-indigo-700 font-bold hover:underline cursor-pointer"
              >
                إعادة ضبط عوامل التصفية
              </button>
            </div>
          )}
        </section>

        {/* Recent Session History Panel */}
        {historyItems.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-t border-slate-200">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-indigo-700" />
                <h3 className="text-lg font-bold font-cairo text-slate-900">
                  سجل المعالجات الأكاديمية في الجلسة الحالية
                </h3>
              </div>
              <span className="text-xs text-slate-600">
                {historyItems.length} عمليات مكتملة
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {historyItems.map((item) => (
                <div
                  key={item.id}
                  className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold font-cairo text-indigo-800">
                        {item.serviceTitle}
                      </span>
                      <span className="text-[11px] font-mono text-slate-600">
                        {item.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mb-3 bg-slate-50 p-2 rounded-lg border border-slate-100">
                      "{item.inputSnippet}"
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() =>
                          exportToWord({
                            serviceTitle: item.serviceTitle,
                            serviceNumber: 1,
                            academicField: 'دراسات عليا وبحوث أكاديمية',
                            degreeLevel: 'ماجستير / دكتوراه',
                            citationStyle: 'APA 7th',
                            inputText: item.inputSnippet,
                            resultText: item.result,
                          })
                        }
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 hover:text-blue-900 bg-blue-50 px-2 py-0.5 rounded cursor-pointer transition-colors"
                        title="تصدير هذه المعالجة إلى مستند Word"
                      >
                        <FileText className="w-3 h-3 text-blue-600" />
                        <span>Word</span>
                      </button>

                      <button
                        onClick={() =>
                          exportToPDF({
                            serviceTitle: item.serviceTitle,
                            serviceNumber: 1,
                            academicField: 'دراسات عليا وبحوث أكاديمية',
                            degreeLevel: 'ماجستير / دكتوراه',
                            citationStyle: 'APA 7th',
                            inputText: item.inputSnippet,
                            resultText: item.result,
                          })
                        }
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 hover:text-rose-900 bg-rose-50 px-2 py-0.5 rounded cursor-pointer transition-colors"
                        title="تصدير هذه المعالجة إلى PDF"
                      >
                        <Printer className="w-3 h-3 text-rose-600" />
                        <span>PDF</span>
                      </button>
                    </div>

                    <button
                      onClick={() => copyHistoryResult(item.id, item.result)}
                      className="inline-flex items-center gap-1 text-xs text-indigo-700 hover:text-indigo-900 font-semibold cursor-pointer"
                    >
                      {copiedHistoryId === item.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700">تم النسخ</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>نسخ النتيجة</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Academic Institutional Footer */}
      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-800 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10 text-right">
            {/* Col 1 */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <span className="text-lg font-bold font-cairo text-white">
                  إسناد الأكاديمي
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed max-w-md">
                منصة متقدمة لخدمات البحث العلمي لطلبة الماجستير والدكتوراه، تجمع بين الرصانة اللغوية والمنهجية والذكاء الاصطناعي الخالي من الهلوسة لمساندة الباحثين في كبرى الجامعات العربية والدولية.
              </p>
            </div>

            {/* Col 2 */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-cairo mb-3">
                المعايير المعتمدة
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-400">
                <li>• نظام توثيق الجمعية النفسية الأمريكية (APA 7th)</li>
                <li>• معايير هارفارد وشيكاغو و MLA</li>
                <li>• ضوابط لجنة أخلاقيات النشر العلمي (COPE)</li>
                <li>• اختبارات SPSS الإحصائية المعتمدة</li>
              </ul>
            </div>

            {/* Col 3 */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-cairo mb-3">
                المطور والتقنيات
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-400">
                <li>• React & Tailwind CSS (Front-end)</li>
                <li>• Python / FastAPI Backend Architecture</li>
                <li>• Google Gemini 3.8 Flash SDK</li>
                <li>• خطوط Google العربية: Cairo & Tajawal</li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
            <p>
              © {new Date().getFullYear()} منصة إسناد الأكاديمية للدراسات العليا. جميع الحقوق محفوظة لخدمة البحث العلمي الرصين.
            </p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsEthicsModalOpen(true)}
                className="hover:text-slate-300 underline cursor-pointer"
              >
                ميثاق الأمانة العلمية
              </button>
              <button
                onClick={() => setIsFastAPIModalOpen(true)}
                className="hover:text-slate-300 underline cursor-pointer"
              >
                كود FastAPI
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <FastAPICodeModal
        isOpen={isFastAPIModalOpen}
        onClose={() => setIsFastAPIModalOpen(false)}
      />
      <EthicsModal
        isOpen={isEthicsModalOpen}
        onClose={() => setIsEthicsModalOpen(false)}
      />
    </div>
  );
}
