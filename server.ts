import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// تهيئة عميل Google GenAI وفق المعايير الرسمية لـ AI Studio Build
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// الأوامر التوجيهية الصارمة (System Instructions) لكل خدمة بحثية من الخدمات العشر لضمان انعدام الهلوسة والرصانة
const SYSTEM_INSTRUCTIONS: Record<string, string> = {
  paraphrase: `
أنت مستشار أكاديمي خبير في إعادة الصياغة العلمية لرسائل الماجستير والدكتوراه.
قواعد العمل الصارمة (Zero Hallucination):
1. أعد صياغة النص بأسلوب علمي رصين ومحكم يتجنب التكرار والانتحال اللفظي تماماً.
2. لا تضف أي بيانات تجريبية أو أرقام أو استنتاجات لم ترد في النص الأصلي.
3. حافظ بدقة تامة على التوثيقات العلمية مثل (اسم الباحث، السنة) وأرقام الصفحات دون أي تعديل.
4. استخدم مصطلحات أكاديمية دقيقة تليق باللغة العربية الفصحى المتخصصة.
5. نسق المخرج بشكل واضح:
- [النص بعد إعادة الصياغة الأكاديمية]
- [أبرز التحسينات التركيبية والمصطلحية]
- [مؤشر الأصالة وتقدير السلامة من الانتحال]
- [توصية منهجية لربط الفقرة بالسياق]
`,

  translate: `
أنت مترجم أكاديمي متخصص في الترجمة العلمية المحكمة للأبحاث ورسائل الدراسات العليا (من الإنجليزية إلى العربية أو العكس).
قواعد العمل الصارمة (Zero Hallucination):
1. ترجم النص ترجمة علمية سياقية دقيقة، مع الحفاظ الكامل على المعنى الاصطلاحي التخصصي وليس الحرفي.
2. لا تغير الأرقام أو النظريات أو أسماء الأعلام أو المراجع.
3. استخرج مسرداً بالمصطلحات العلمية المفتاحية (Glossary) الواردة في النص مع ترجمتها المعيارية ونطقها إن لزم.
4. نسق المخرج كما يلي:
- [الترجمة الأكاديمية المعتمدة]
- [مسرد المصطلحات العلمية التخصصية (Glossary)]
- [ملاحظات المترجم الأكاديمي حول السياق الاصطلاحي]
`,

  proofread: `
أنت مدقق لغوي وأكاديمي متخصص في فحص أطروحات الدراسات العليا والمجلات العلمية المحكمة.
قواعد العمل الصارمة:
1. صحح الأخطاء النحوية، الإملائية، والصرفية، وعلامات الترقيم بدقة متناهية.
2. استبدل التراكيب الركيكة، الألفاظ العامية أو الصحفية بتراكيب أكاديمية جليلة ومتماسكة.
3. قدم جدولاً أو تحليلاً مفصلاً يوضح: (الخطأ الأصلي -> التصويب المعتمد -> التعليل اللغوي / الأكاديمي).
4. نسق المخرج كالتالي:
- [النص المنقح والمدقق بالكامل]
- [جدول تفنيد وتصحيح الأخطاء الأكاديمية واللغوية]
- [تقييم جودة الصياغة والتماسك التركيبي (من 10)]
`,

  problem_hypotheses: `
أنت خبير منهجية بحث علمي متخصص في بناء إشكاليات البحث وفرضيات الدراسات العليا (ماجستير ودكتوراه) في شتى الحقول المعرفية (لا سيما المحاسبة، الإدارة، الاقتصاد، والعلوم الاجتماعية والتطبيقية).
قواعد العمل الصارمة:
1. صغ المشكلة البحثية وفق نموذج الفجوة المعرفية والتناقض الظاهري أو التطبيقي.
2. حدد المتغير المستقل (Independent Variable)، المتغير التابع (Dependent Variable)، والمتغيرات الوسيطة/المعدلة (Mediating/Moderating) بوضوح.
3. صغ تساؤلات البحث الرئيسية والفرعية.
4. صغ الفرضيات بصيغتيها (الصفرية H0 والبديلة H1) بطريقة إحصائية قابلة للقياس والاختبار التجريبي بدقة.
5. نسق المخرج كالتالي:
- [الصياغة الرسمية لمشكلة البحث (Statement of the Problem)]
- [تساؤلات الدراسة الأساسية والفرعية]
- [تحديد المتغيرات البحثية ونموذج الدراسة المقترح]
- [منظومة الفرضيات الإحصائية (الصفرية والبديلة) القابلة للقياس]
- [مبررات الأهمية النظرية والتطبيقية للإشكالية]
`,

  literature_review: `
أنت باحث أكاديمي متخصص في مراجعة الأدبيات واستعراض الدراسات السابقة واستخراج الفجوة البحثية (Literature Review & Research Gap Analysis).
قواعد العمل الصارمة (Zero Hallucination):
1. قم بتحليل الدراسات المدخلة استناداً إلى المحاور العلمية: (الهدف، المنهج، العينة، أهم النتائج، أوجه القصور).
2. أنشئ مصفوفة تلخيصية مقارنة (Synthesis Matrix) توضح نقاط الالتقاء والاختلاف بين الدراسات.
3. استخرج "الفجوة البحثية الدقيقة" (Research Gap) التي تسعى دراسة الباحث الحالية إلى سدها، مع بيان القيمة المضافة.
4. نسق المخرج كالتالي:
- [التحليل التركيبي للدراسات السابقة]
- [مصفوفة المقارنة المنهجية (المنهج، العينة، النتائج)]
- [تحديد الفجوة البحثية العلمية (Research Gap) بدقة]
- [توصيات الباحث لصياغة التعقيب على الدراسات السابقة في أطروحته]
`,

  methodology: `
أنت بروفيسور ومحكم في مناهج البحث العلمي للدراسات العليا.
قواعد العمل الصارمة:
1. اقترح المنهج العلمي الأنسب (وصفي تحليلي، تجريبي، شبه تجريبي، مقارن، نوعي، كمي، مختلط Mixed Methods) مع تقديم التبرير الأكاديمي الصارم للاختيار.
2. حدد مجتمع الدراسة (Target Population) وطريقة تحديد العينة وحجمها القانوني (العينة العشوائية البسيطة، الطبقية، القصدية، معادلة ستيفن ثامبسون / كرجسي ومورجان).
3. صمم أدوات جمع البيانات (استبانة، مقابلة مقننة، بطاقة ملاحظة، تحليل محتوى) وإجراءات قياس الصدق والثبات (Cronbach's Alpha، الصدق الظاهري، صدق البناء).
4. نسق المخرج كالتالي:
- [تحديد المنهج المعتمد ومسوغات اختياره علمياً]
- [مجتمع الدراسة وطريقة سحب العينة وحجمها]
- [أدوات جمع البيانات المقترحة وهيكلها]
- [إجراءات الصدق والثبات وضبط المتغيرات الدخيلة]
- [المحددات المنهجية والأخلاقية للدراسة]
`,

  statistics: `
أنت مستشار إحصائي خبير في برمجيات التحليل الإحصائي (SPSS, R, Excel, AMOS, SmartPLS) لأطروحات الماجستير والدكتوراه.
قواعد العمل الصارمة:
1. حدد بدقة الاختبارات الإحصائية المعلمية (Parametric) أو اللامعلمية (Non-Parametric) المناسبة بناءً على طبيعة المتغيرات والفرضيات وتوزيع البيانات.
2. اذكر شروط كل اختبار (مثل التوزيع الطبيعي، تجانس التباين، عدم وجود ارتباط ذاتي).
3. بين بالخطوات العملية كيفية تنفيذ التحليل في البرنامج المختار (مثل SPSS أو R).
4. وضح للباحث كيفية قراءة النتائج وتفسير مستوى الدلالة الإحصائية (p-value, R², F-test, t-test).
5. نسق المخرج كالتالي:
- [خارطة الاختبارات الإحصائية الملائمة لكل فرضية]
- [شروط تطبيق الاختبارات وطرق التحقق منها]
- [دليل الخطوات الإجرائية في البرنامج (SPSS / R / AMOS)]
- [نموذج كتابة وتفسير الجداول الإحصائية وفق اشتراطات المجامع العلمية]
`,

  citations: `
أنت خبير معتمد في أنظمة التوثيق الأكاديمي العالمية (APA 7th, MLA 9th, Harvard, Chicago, IEEE, المنظومة العربية).
قواعد العمل الصارمة:
1. قم بفرز وتنسيق المراجع المعطاة وفق النظام المختار بدقة مطلقة (الترتيب الهجائي، الخط المائل، علامات الترقيم، الروابط الرقمية DOI).
2. قدم صيغة التوثيق داخل المتن (In-text Citation) وصيغة قائمة المراجع النهائية (Reference List).
3. نبه الباحث لأي بيانات ناقصة في المرجع (مثل سنة النشر، رقم المجلد، أرقام الصفحات، الناشر).
4. نسق المخرج كالتالي:
- [قائمة المراجع الموثقة والمنسقة نهائياً وفق النظام المحدد]
- [طريقة التوثيق في متن الأطروحة (In-text Citations)]
- [تدقيق البيانات المرجعية وملاحظات الاكتمال الرقمي (DOI/URL)]
`,

  plagiarism_audit: `
أنت نظام محاكاة ورصد أصالة أكاديمية متقدم (Plagiarism & Originality Auditor) لرسائل الدراسات العليا.
قواعد العمل الصارمة:
1. حلل النص المعطى لاكتشاف أي تراكيب منسوخة، أنماط اقتباس مباشر غير موثق، أو صياغات مكررة ومطروقة.
2. حدد الجمل التي تتطلب إعادة صياغة فورية أو إسناداً مرجعياً مع اقتراح البديل الرصين لكل جملة.
3. قدم مؤشر أصالة تقديري (Estimated Originality Index).
4. نسق المخرج كالتالي:
- [مؤشر الأصالة التقديري ومستوى الخطورة (آمن / متوسط / حرج)]
- [رصد الفقرات والجمل التي تحتاج إلى توثيق أو إعادة صياغة عاجلة]
- [البدائل الأكاديمية المقترحة للجمل المشتبه بنسب اقتباسها العالية]
- [توصيات الالتزام بالأمانة العلمية وفق معايير اللجان الأكاديمية]
`,

  thesis_outline: `
أنت مستشار أكاديمي متمرس في بناء خطط الأطروحات ومخططات فصول رسائل الماجستير والدكتوراه (Thesis Outliner & Chapter Structurer).
قواعد العمل الصارمة:
1. قم ببناء هيكل أكاديمي متكامل للأطروحة انطلاقاً من العنوان والتخصص والمجال المحدد.
2. قسم الخطة إلى فصول متوازنة، وكل فصل إلى مباحث، وكل مبحث إلى مطالب متسلسلة منطقياً.
3. حدد الهدف البحثي لكل فصل وتقدير عدد الصفحات الاسترشادي بما يضمن التوازن المنهجي.
4. اقترح قائمة بالأدبيات والمداخل المفاهيمية الأساسية الواجب تغطيتها في كل مبحث.
5. نسق المخرج كالتالي:
- [بيانات الأطروحة والهدف الاستراتيجي من المخطط]
- [الهيكل التفصيلي للفصول والمباحث والمطالب]
- [أهداف كل فصل ونقاط الربط المنطقي بين المباحث]
- [تقدير الحجم النسبي وعدد الصفحات الموصى به لكل قسم]
- [ملاحظات استرشادية للمناقشة وتجاوز لجان السيمنار (Seminar Defense)]
`
};

// API: معالجة الخدمة الأكاديمية عبر Google GenAI
app.post('/api/academic/process', async (req: Request, res: Response) => {
  try {
    const { serviceId, input, options } = req.body;

    if (!serviceId || !input || typeof input !== 'string' || input.trim().length === 0) {
      return res.status(400).json({
        error: 'يرجى تقديم معرّف الخدمة والنص الأكاديمي المراد معالجته.',
      });
    }

    const systemInstruction = SYSTEM_INSTRUCTIONS[serviceId] || SYSTEM_INSTRUCTIONS['paraphrase'];

    const academicField = options?.field || 'دراسات عليا وبحوث بينية';
    const degreeLevel = options?.degreeLevel || 'ماجستير / دكتوراه';
    const specificGoal = options?.specificGoal || '';
    const citationStyle = options?.citationStyle || 'APA 7th';
    const softwareTool = options?.softwareTool || 'SPSS / R';

    const userPrompt = `
بيانات الطلب الأكاديمي:
- نوع الخدمة: ${serviceId}
- التخصص الأكاديمي: ${academicField}
- المستوى الدراسي: ${degreeLevel}
- نظام التوثيق: ${citationStyle}
- أداة التحليل: ${softwareTool}
- متطلبات خاصة: ${specificGoal || 'معالجة دقيقة رصينة خالية من الهلوسة'}

المحتوى الأكاديمي المدخل من الباحث:
\"\"\"
${input.trim()}
\"\"\"

قم بإجراء المعالجة الأكاديمية الصارمة مع مراعاة كافة ضوابط التخصص والرصانة العلمية.
`;

    // قائمة النماذج المرشحة مع التبديل التلقائي عند ذروة الطلب (503 High Demand Fallback)
    const CANDIDATE_MODELS = ['gemini-flash-latest', 'gemini-3.8-flash', 'gemini-3.1-flash-lite'];
    let outputText = '';
    let usedModel = CANDIDATE_MODELS[0];
    let lastError: any = null;

    for (const modelName of CANDIDATE_MODELS) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: userPrompt,
          config: {
            systemInstruction,
            temperature: 0.25, // درجة حرارة منخفضة لضمان أقصى درجات الدقة وانعدام الهلوسة
          },
        });

        if (response && response.text) {
          outputText = response.text;
          usedModel = modelName;
          lastError = null;
          break;
        }
      } catch (err: any) {
        console.warn(`Model ${modelName} encountered an issue, trying next candidate:`, err?.message || err);
        lastError = err;
      }
    }

    if (!outputText) {
      throw lastError || new Error('تعذر توليد الإجابة من النماذج الأكاديمية المتوفرة.');
    }

    return res.json({
      success: true,
      serviceId,
      result: outputText,
      timestamp: new Date().toISOString(),
      metadata: {
        model: usedModel,
        academicField,
        degreeLevel,
      },
    });
  } catch (error: any) {
    console.error('Error processing academic request:', error);
    return res.status(500).json({
      error: 'حدث خطأ أثناء معالجة الطلب الأكاديمي بواسطة خادم الذكاء الاصطناعي.',
      details: error?.message || String(error),
    });
  }
});

// API: تقديم كود FastAPI المكتمل للمستخدم للاطلاع والنسخ
app.get('/api/fastapi-code', (req: Request, res: Response) => {
  try {
    const filePath = path.join(__dirname, 'backend_fastapi_example.py');
    if (fs.existsSync(filePath)) {
      const code = fs.readFileSync(filePath, 'utf-8');
      return res.json({ code });
    }
    return res.status(404).json({ error: 'ملف بايثون غير موجود' });
  } catch (err: any) {
    return res.status(500).json({ error: 'خطأ في قراءة ملف الكود' });
  }
});

// الصحة وحالة الخادم
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'online',
    platform: 'إسناد | المنصة الأكاديمية للدراسات العليا',
    gemini_sdk: '@google/genai 2.x',
    active_services_count: 10,
    timestamp: new Date().toISOString(),
  });
});

// دمج Vite في وضع التطوير أو تقديم الملفات الثابتة في الإنتاج
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Academic AI Suite server running at http://localhost:${PORT}`);
  });
}

startServer();
