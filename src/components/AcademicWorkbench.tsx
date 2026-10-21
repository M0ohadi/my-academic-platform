import React, { useState } from 'react';
import {
  Send,
  Sparkles,
  RotateCcw,
  Copy,
  Check,
  Download,
  Printer,
  FileText,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  ChevronDown,
  Layers,
  Wand2,
  FileCheck2,
  Share2,
} from 'lucide-react';
import { AcademicService } from '../types';
import { AcademicMarkdown } from './AcademicMarkdown';
import { exportToWord, exportToPDF } from '../utils/academicExport';

interface AcademicWorkbenchProps {
  service: AcademicService;
  onProcessed?: (serviceId: string, input: string, result: string) => void;
}

export const AcademicWorkbench: React.FC<AcademicWorkbenchProps> = ({
  service,
  onProcessed,
}) => {
  const [inputText, setInputText] = useState<string>(service.sampleInput);
  const [academicField, setAcademicField] = useState<string>('محاسبة وإدارة أعمال');
  const [degreeLevel, setDegreeLevel] = useState<string>('ماجستير');
  const [citationStyle, setCitationStyle] = useState<string>('APA 7th');
  const [softwareTool, setSoftwareTool] = useState<string>('SPSS');
  const [toneStyle, setToneStyle] = useState<string>('رصين ومحكم مع روابط العلية');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [resultText, setResultText] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [executionTime, setExecutionTime] = useState<string | null>(null);

  // Load preset sample for this service
  const handleLoadSample = () => {
    setInputText(service.sampleInput);
    setErrorMsg(null);
  };

  // Clear input
  const handleClear = () => {
    setInputText('');
    setResultText('');
    setErrorMsg(null);
  };

  // Trigger AI processing
  const handleProcess = async () => {
    if (!inputText.trim()) {
      setErrorMsg('يرجى كتابة أو لصق النص الأكاديمي أولاً.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    const startTime = performance.now();

    try {
      const response = await fetch('/api/academic/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceId: service.id,
          input: inputText,
          options: {
            field: academicField,
            degreeLevel,
            citationStyle,
            softwareTool,
            tone: toneStyle,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'فشلت معالجة الطلب عبر الخادم');
      }

      setResultText(data.result);
      const duration = ((performance.now() - startTime) / 1000).toFixed(1);
      setExecutionTime(`${duration} ثانية`);

      if (onProcessed) {
        onProcessed(service.id, inputText, data.result);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(
        err.message || 'حدث خطأ في الاتصال بالخادم. يرجى التأكد من تشغيل الخادم والمحاولة مجدداً.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Copy result to clipboard
  const handleCopy = async () => {
    if (!resultText) return;
    try {
      await navigator.clipboard.writeText(resultText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  // Export result to Microsoft Word (.doc/.docx)
  const handleExportWord = () => {
    if (!resultText) return;
    exportToWord({
      serviceTitle: service.title,
      serviceNumber: service.number,
      academicField,
      degreeLevel,
      citationStyle,
      softwareTool,
      inputText,
      resultText,
    });
  };

  // Export result to official Academic PDF
  const handleExportPDF = () => {
    if (!resultText) return;
    exportToPDF({
      serviceTitle: service.title,
      serviceNumber: service.number,
      academicField,
      degreeLevel,
      citationStyle,
      softwareTool,
      inputText,
      resultText,
    });
  };

  // Download result as formatted text file
  const handleDownloadTxt = () => {
    if (!resultText) return;
    const blob = new Blob([resultText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `إسناد_${service.id}_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      id="academic-workbench"
      className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden transition-all duration-300"
    >
      {/* Workbench Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600/90 border border-indigo-400/40 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
              <span className="font-mono text-lg font-bold">
                {String(service.number).padStart(2, '0')}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold font-cairo">
                  {service.title}
                </h2>
                <span className="text-xs bg-indigo-500/30 text-indigo-200 px-2.5 py-0.5 rounded-full border border-indigo-400/20">
                  {service.categoryLabel}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl font-normal leading-relaxed">
                {service.fullDescription}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-center">
            <button
              onClick={handleLoadSample}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all shadow-xs cursor-pointer"
            >
              <Wand2 className="w-4 h-4 text-amber-300" />
              <span>تحميل حالة تطبيقية جاهزة</span>
            </button>
          </div>
        </div>

        {/* Academic Controls / Context Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80 text-right">
          {/* Field of Study */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              التخصص الأكاديمي الدقيق:
            </label>
            <select
              value={academicField}
              onChange={(e) => setAcademicField(e.target.value)}
              className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            >
              <option value="محاسبة وإدارة أعمال">محاسبة وإدارة أعمال</option>
              <option value="اقتصاد وتمويل ومصارف">اقتصاد وتمويل ومصارف</option>
              <option value="علوم تربوية ونفسية">علوم تربوية ونفسية</option>
              <option value="دراسات قانونية وشريعة">دراسات قانونية وشريعة</option>
              <option value="علوم الحاسب ونظم المعلومات">علوم الحاسب ونظم المعلومات</option>
              <option value="علوم طبية وصحية">علوم طبية وصحية</option>
              <option value="علوم إنسانية واجتماعية">علوم إنسانية واجتماعية</option>
              <option value="هندسة وعلوم تطبيقية">هندسة وعلوم تطبيقية</option>
            </select>
          </div>

          {/* Academic Degree */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              المرحلة الأكاديمية:
            </label>
            <select
              value={degreeLevel}
              onChange={(e) => setDegreeLevel(e.target.value)}
              className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            >
              <option value="رسالة ماجستير (Master's Thesis)">رسالة ماجستير (Master's)</option>
              <option value="أطروحة دكتوراه (Doctoral Dissertation)">أطروحة دكتوراه (Ph.D.)</option>
              <option value="بحث ترقية / مجلة محكمة (Q1/Q2)">بحث ترقية / مجلة محكمة (Q1/Q2)</option>
              <option value="مشروع تخرج بكالوريوس متميز">مشروع تخرج بكالوريوس</option>
            </select>
          </div>

          {/* Citation System or Tool */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              نظام التوثيق الأكاديمي:
            </label>
            <select
              value={citationStyle}
              onChange={(e) => setCitationStyle(e.target.value)}
              className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            >
              <option value="APA 7th Edition (الجمعية النفسية الأمريكية)">APA 7th Edition</option>
              <option value="Harvard Style (هارفارد)">Harvard Style</option>
              <option value="Chicago / Turabian (شيكاغو)">Chicago / Turabian</option>
              <option value="MLA 9th Edition (اللغات والآداب)">MLA 9th Edition</option>
              <option value="IEEE (الهندسة والحاسب)">IEEE Standard</option>
            </select>
          </div>

          {/* Software / Engine */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              البرنامج الإحصائي المفضل:
            </label>
            <select
              value={softwareTool}
              onChange={(e) => setSoftwareTool(e.target.value)}
              className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            >
              <option value="IBM SPSS Statistics">IBM SPSS Statistics</option>
              <option value="R Language & RStudio">R Language / RStudio</option>
              <option value="SmartPLS / AMOS (معادلات بنائية SEM)">SmartPLS / AMOS (SEM)</option>
              <option value="Microsoft Excel Advanced">Microsoft Excel Data Analysis</option>
              <option value="STATA">STATA Econometrics</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Dual-Pane Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x lg:divide-x-reverse divide-slate-200">
        {/* Right Pane: Input Area (RTL) */}
        <div className="p-6 sm:p-8 flex flex-col justify-between bg-slate-50/50">
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-bold text-slate-900 font-cairo flex items-center gap-2">
                <span>المحتوى الأكاديمي المدخل:</span>
                <span className="text-xs text-slate-600 font-normal">
                  (نصوص، بيانات، دراسات، عناوين، أو فقرات)
                </span>
              </label>
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-600 font-mono">
                  {inputText.length} حرف
                </span>
                {inputText && (
                  <button
                    onClick={handleClear}
                    className="text-xs text-rose-600 hover:text-rose-700 font-semibold cursor-pointer"
                  >
                    مسح
                  </button>
                )}
              </div>
            </div>

            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="اكتب أو الصق النص الأكاديمي، أو الفرضيات، أو الدراسات السابقة هنا..."
              rows={13}
              className="w-full p-4 rounded-2xl bg-white border border-slate-200 text-slate-800 text-sm leading-relaxed focus:outline-hidden focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all shadow-inner resize-y placeholder:text-slate-400 font-normal"
            />

            {/* Hint Box for this Service */}
            <div className="mt-3 p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-3 text-xs text-amber-900 leading-relaxed">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold block font-cairo mb-0.5">
                  توجيه أكاديمي لضمان أعلى جودة:
                </strong>
                {service.samplePromptExplanation}
              </div>
            </div>

            {errorMsg && (
              <div className="mt-3 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
                <button
                  onClick={handleProcess}
                  className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-cairo font-semibold text-xs shrink-0 cursor-pointer transition-colors"
                >
                  إعادة المحاولة
                </button>
              </div>
            )}
          </div>

          {/* Submit Action Button */}
          <div className="pt-6 mt-6 border-t border-slate-200 flex items-center justify-between">
            <div className="text-xs text-slate-600 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>معالجة محكمة خاضعة لـ System Prompt علمي صارم</span>
            </div>

            <button
              onClick={handleProcess}
              disabled={isLoading || !inputText.trim()}
              className={`inline-flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-bold font-cairo text-white transition-all shadow-lg cursor-pointer ${
                isLoading || !inputText.trim()
                  ? 'bg-slate-400 cursor-not-allowed shadow-none'
                  : 'bg-indigo-700 hover:bg-indigo-800 shadow-indigo-700/25 active:scale-98'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>جاري المعالجة الأكاديمية الصارمة...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>بدء المعالجة والتحليل</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Left Pane: Academic Output Area */}
        <div className="p-6 sm:p-8 flex flex-col justify-between bg-white">
          <div>
            {/* Output Header Bar */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-700" />
                <h3 className="text-base font-bold text-slate-900 font-cairo">
                  المخرج الأكاديمي والتحليل المعتمد
                </h3>
                {executionTime && (
                  <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-mono">
                    {executionTime}
                  </span>
                )}
              </div>

              {resultText && (
                <div className="flex flex-wrap items-center gap-2">
                  {/* Export Word (.docx) */}
                  <button
                    onClick={handleExportWord}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold font-cairo bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200/90 transition-all cursor-pointer shadow-xs hover:shadow-sm active:scale-95"
                    title="تصدير كملف Word منسق ومجهز لرسالة الماجستير/الدكتوراه"
                  >
                    <FileText className="w-3.5 h-3.5 text-blue-600" />
                    <span>تصدير Word (.docx)</span>
                  </button>

                  {/* Export PDF */}
                  <button
                    onClick={handleExportPDF}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold font-cairo bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/90 transition-all cursor-pointer shadow-xs hover:shadow-sm active:scale-95"
                    title="تصدير كتقرير أكاديمي رسمي مجهز للطباعة أو الحفظ بصيغة PDF"
                  >
                    <Printer className="w-3.5 h-3.5 text-rose-600" />
                    <span>تصدير PDF</span>
                  </button>

                  {/* Copy Text */}
                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
                    title="نسخ المخرج للحافظة"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">تم النسخ</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-600" />
                        <span>نسخ</span>
                      </>
                    )}
                  </button>

                  {/* Raw Text Download */}
                  <button
                    onClick={handleDownloadTxt}
                    className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
                    title="تنزيل كملف نصي خام (.txt)"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Output Content */}
            <div className="min-h-[350px] max-h-[550px] overflow-y-auto pr-1 pl-2">
              {isLoading ? (
                <div className="h-full flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700 mb-4 animate-bounce">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900 font-cairo mb-1">
                    جاري التحليل الأكاديمي عبر Gemini 3.8 Flash
                  </h4>
                  <p className="text-xs text-slate-500 max-w-sm">
                    تطبيق قواعد انعدام الهلوسة، الرصانة العلمية، والتحقق من السياق التخصصي...
                  </p>
                </div>
              ) : resultText ? (
                <div className="space-y-3">
                  {/* Official Export Quick Bar */}
                  <div className="p-3 bg-gradient-to-r from-blue-50 via-indigo-50/80 to-slate-50 border border-blue-200/80 rounded-xl flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <FileCheck2 className="w-4 h-4 text-blue-700 shrink-0" />
                      <span className="text-slate-700 font-medium font-tajawal">
                        التقرير جاهز ومعتمد للتضمين في رسالتك:
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={handleExportWord}
                        className="px-2.5 py-1 bg-white hover:bg-blue-50 text-blue-700 border border-blue-200 rounded-lg font-cairo font-bold text-[11px] transition-colors cursor-pointer shadow-2xs"
                      >
                        تصدير Word (.docx)
                      </button>
                      <button
                        onClick={handleExportPDF}
                        className="px-2.5 py-1 bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 rounded-lg font-cairo font-bold text-[11px] transition-colors cursor-pointer shadow-2xs"
                      >
                        تصدير PDF
                      </button>
                    </div>
                  </div>

                  <div className="bg-slate-50/60 p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                    <AcademicMarkdown content={resultText} />
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center py-20 text-center text-slate-400">
                  <FileText className="w-12 h-12 stroke-[1.2] mb-3 text-slate-300" />
                  <p className="text-sm font-cairo font-semibold text-slate-600">
                    بانتظار بدء المعالجة
                  </p>
                  <p className="text-xs text-slate-400 max-w-xs mt-1">
                    اضغط على زر "بدء المعالجة والتحليل" أو استخدم زر "تحميل حالة تطبيقية جاهزة" للتجربة السريعة.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Academic Verification Quality Seal */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
              <span>معايير البحث العلمي المحكم</span>
            </div>
            <span className="font-mono text-[11px] text-slate-600">
              Zero-Hallucination Academic Pipeline
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
