import React from 'react';
import { X, ShieldCheck, BookOpen, AlertTriangle, CheckCircle2, Award } from 'lucide-react';

interface EthicsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EthicsModal: React.FC<EthicsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col text-right border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-cairo">
                ميثاق الأمانة العلمية وضوابط الذكاء الاصطناعي
              </h3>
              <p className="text-xs text-slate-300">
                إرشادات لجان الدراسات العليا والمجلات العلمية المحكمة
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[75vh] space-y-6 text-sm text-slate-700 leading-relaxed">
          {/* Section 1 */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-amber-900 font-cairo text-sm mb-1">
                المسؤولية الفكرية الأولى والأخيرة تقع على عاتق الباحث
              </h4>
              <p className="text-xs text-amber-800 leading-relaxed">
                تعتبر أدوات الذكاء الاصطناعي في منصة "إسناد" مساعداً بحثياً استشارياً لصقل الصياغة وتنسيق المنهجية، ولا تُعد بديلاً عن الفكر النقدي المستقل للباحث أو قراءته المباشرة للمصادر الأصلية.
              </p>
            </div>
          </div>

          {/* Section 2 */}
          <div>
            <h4 className="text-base font-bold text-slate-900 font-cairo mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>الممارسات الأكاديمية المصرح بها والموصى بها:</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <strong className="block text-slate-900 font-cairo mb-1">
                  1. التدقيق اللغوي وإعادة الصياغة
                </strong>
                <p className="text-xs text-slate-600">
                  استخدام الذكاء الاصطناعي لتحسين وضوح التراكيب اللغوية وتفادي العبارات الركيكة مع الحفاظ التام على أفكار الباحث.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <strong className="block text-slate-900 font-cairo mb-1">
                  2. توجيه التحليل الإحصائي
                </strong>
                <p className="text-xs text-slate-600">
                  الاسترشاد بالاختبارات المناسبة لفرضيات الدراسة وشروط تطبيقها في برمجيات مثل SPSS و R.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <strong className="block text-slate-900 font-cairo mb-1">
                  3. تنسيق المراجع وفق APA / Harvard
                </strong>
                <p className="text-xs text-slate-600">
                  توحيد أسلوب التوثيق وضمان اكتمال بيانات المراجع وأرقام المعرفات الرقمية (DOI).
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <strong className="block text-slate-900 font-cairo mb-1">
                  4. استخراج الفجوات البحثية
                </strong>
                <p className="text-xs text-slate-600">
                  مقارنة الدراسات السابقة واستخلاص الفروق المنهجية لبناء تبرير قوي لإشكالية الأطروحة.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Disclosure recommendation */}
          <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100">
            <h4 className="font-bold text-indigo-950 font-cairo text-sm mb-2 flex items-center gap-2">
              <Award className="w-4 h-4 text-indigo-700" />
              <span>صيغة الإفصاح الموصى بها في مقدمة الأطروحة أو المنهجية:</span>
            </h4>
            <div className="p-3 bg-white rounded-xl border border-indigo-200 text-xs font-mono text-slate-700 leading-relaxed">
              "تمت الاستعانة بمنظومة الذكاء الاصطناعي الأكاديمي (إسناد) لغايات التدقيق اللغوي والمساعدة في ضبط تنسيق المراجع بنظام APA 7th، دون أي تدخل آلي في صياغة النتائج أو تأليف البيانات التجريبية."
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            متوافق مع إرشادات لجنة أخلاقيات النشر العلمي (COPE)
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold font-cairo transition-colors cursor-pointer"
          >
            فهمت والتزم بالضوابط
          </button>
        </div>
      </div>
    </div>
  );
};
