import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Terminal, Code2, Server, ExternalLink, ShieldCheck } from 'lucide-react';

interface FastAPICodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FastAPICodeModal: React.FC<FastAPICodeModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'endpoint' | 'system_prompt' | 'run'>('endpoint');
  const [pythonCode, setPythonCode] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      fetch('/api/fastapi-code')
        .then((res) => res.json())
        .then((data) => {
          if (data.code) setPythonCode(data.code);
        })
        .catch(() => {
          // Fallback code if not loaded
          setPythonCode(FALLBACK_CODE);
        });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(pythonCode || FALLBACK_CODE);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-slate-100 text-right">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-cairo text-white">
                كود الواجهة الخلفية: Python (FastAPI) & Gemini SDK
              </h3>
              <p className="text-xs text-slate-400">
                نقطة النهاية لنظام إعادة الصياغة الأكاديمية الصارمة (System Prompt & Pydantic)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyCode}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>تم نسخ كود بايثون</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-white" />
                  <span>نسخ الكود بالكامل</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-800 bg-slate-900/50 text-xs">
          <button
            onClick={() => setActiveTab('endpoint')}
            className={`pb-3 font-semibold border-b-2 px-3 transition-colors ${
              activeTab === 'endpoint'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            نقطة النهاية و Pydantic (FastAPI)
          </button>
          <button
            onClick={() => setActiveTab('system_prompt')}
            className={`pb-3 font-semibold border-b-2 px-3 transition-colors ${
              activeTab === 'system_prompt'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            الأمر التوجيهي الصارم (System Prompt)
          </button>
          <button
            onClick={() => setActiveTab('run')}
            className={`pb-3 font-semibold border-b-2 px-3 transition-colors ${
              activeTab === 'run'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            أوامر التثبيت والتشغيل المحلي
          </button>
        </div>

        {/* Modal Body / Code Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-950 font-mono text-xs leading-relaxed text-slate-300" dir="ltr">
          {activeTab === 'endpoint' && (
            <pre className="whitespace-pre overflow-x-auto text-emerald-300">
              <code>{pythonCode || FALLBACK_CODE}</code>
            </pre>
          )}

          {activeTab === 'system_prompt' && (
            <div className="text-right font-sans space-y-4" dir="rtl">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <div className="flex items-center gap-2 text-emerald-400 font-bold font-cairo mb-2">
                  <ShieldCheck className="w-5 h-5" />
                  <span>معايير الأمر التوجيهي (Zero Hallucination System Instruction):</span>
                </div>
                <ul className="list-disc list-inside space-y-2 text-slate-300 text-sm leading-relaxed">
                  <li>
                    <strong className="text-white">منع الهلوسة التام:</strong> النموذج ممنوع تماماً من تأليف أي أرقام أو استنتاجات أو نتائج غير موجودة في النص الأصلي.
                  </li>
                  <li>
                    <strong className="text-white">حماية الاقتباسات:</strong> عدم المساس بأسماء الباحثين أو سنوات النشر مثل (Al-Ghamdi, 2021).
                  </li>
                  <li>
                    <strong className="text-white">الرصانة الأكاديمية:</strong> استبدال الروابط الركيكة واللغة الخطابية بروابط برهانية علمية.
                  </li>
                  <li>
                    <strong className="text-white">درجة حرارة منخفضة (temperature = 0.25):</strong> لتقليل العشوائية وضمان التماسك والدقة العلمية.
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'run' && (
            <div className="text-right font-sans space-y-4" dir="rtl">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <h4 className="text-sm font-bold font-cairo text-white mb-2 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <span>طريقة تشغيل خادم FastAPI محلياً:</span>
                </h4>
                <div className="bg-black/80 p-3 rounded-lg font-mono text-xs text-emerald-400 mb-3" dir="ltr">
                  pip install fastapi uvicorn google-genai pydantic
                </div>
                <div className="bg-black/80 p-3 rounded-lg font-mono text-xs text-emerald-400 mb-3" dir="ltr">
                  export GEMINI_API_KEY="your_api_key_here"
                </div>
                <div className="bg-black/80 p-3 rounded-lg font-mono text-xs text-emerald-400" dir="ltr">
                  python backend_fastapi_example.py
                </div>
                <p className="text-xs text-slate-400 mt-3">
                  سيكون الخادم متاحاً على <code className="text-indigo-400">http://localhost:8000</code> مع توثيق Swagger التفاعلي التلقائي على <code className="text-indigo-400">/docs</code>.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>ملف backend_fastapi_example.py موجود وجاهز للتنفيذ الفوري</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};

const FALLBACK_CODE = `from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from google import genai
import os

app = FastAPI(title="Academic AI API")
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

class ParaphraseRequest(BaseModel):
    text: str = Field(..., min_length=15)
    field_of_study: str = "علوم إدارية ومحاسبية"

@app.post("/api/services/paraphrase")
async def paraphrase(payload: ParaphraseRequest):
    response = client.models.generateContent(
        model="gemini-3.8-flash",
        contents=payload.text,
        config={"system_instruction": "أنت مستشار أكاديمي خبير في إعادة الصياغة العلمية لرسائل الماجستير والدكتوراه. معيار انعدام الهلوسة التام."}
    )
    return {"paraphrased_text": response.text}
`;
