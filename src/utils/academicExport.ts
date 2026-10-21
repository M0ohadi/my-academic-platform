/**
 * Academic Document Export Utility
 * Generates formatted Microsoft Word (.doc/.docx compatible) and PDF printable documents
 * with official academic letterhead, RTL formatting, metadata tables, and typography.
 */

interface ExportAcademicOptions {
  serviceTitle: string;
  serviceNumber: number;
  academicField: string;
  degreeLevel: string;
  citationStyle: string;
  softwareTool?: string;
  inputText: string;
  resultText: string;
}

// Convert markdown text to clean HTML for document export
function markdownToHtml(md: string): string {
  if (!md) return '';

  const lines = md.split('\n');
  let html = '';
  let inTable = false;
  let tableRows: string[] = [];

  const flushTable = () => {
    if (tableRows.length === 0) return;
    const isDivider = (r: string) => r.trim().startsWith('|') && r.includes('---');
    const validRows = tableRows.filter((r) => !isDivider(r));
    if (validRows.length === 0) {
      tableRows = [];
      return;
    }

    html += '<table style="width:100%; border-collapse:collapse; margin:16px 0; font-size:11pt; direction:rtl; text-align:right;">';
    // Header
    const headerCells = validRows[0].split('|').slice(1, -1).map((c) => c.trim());
    html += '<thead style="background-color:#1e3a8a; color:#ffffff;"><tr>';
    headerCells.forEach((c) => {
      html += `<th style="border:1px solid #cbd5e1; padding:8px 12px; font-weight:bold; text-align:right;">${c}</th>`;
    });
    html += '</tr></thead><tbody>';

    // Body
    validRows.slice(1).forEach((row) => {
      const cells = row.split('|').slice(1, -1).map((c) => c.trim());
      html += '<tr style="border-bottom:1px solid #e2e8f0;">';
      cells.forEach((c) => {
        html += `<td style="border:1px solid #cbd5e1; padding:8px 12px; text-align:right;">${c}</td>`;
      });
      html += '</tr>';
    });

    html += '</tbody></table>';
    tableRows = [];
    inTable = false;
  };

  lines.forEach((line) => {
    const trimmed = line.trim();

    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      inTable = true;
      tableRows.push(trimmed);
      return;
    } else if (inTable) {
      flushTable();
    }

    if (!trimmed) {
      html += '<div style="height:8px;"></div>';
      return;
    }

    // Bold formatting
    let formatted = trimmed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    if (trimmed.startsWith('### ')) {
      html += `<h3 style="font-size:14pt; color:#1e3a8a; margin:16px 0 8px 0; border-bottom:1px solid #cbd5e1; padding-bottom:4px; font-weight:bold;">${formatted.replace('### ', '')}</h3>`;
    } else if (trimmed.startsWith('## ')) {
      html += `<h2 style="font-size:16pt; color:#0f2744; margin:20px 0 10px 0; border-bottom:2px solid #1e3a8a; padding-bottom:6px; font-weight:bold;">${formatted.replace('## ', '')}</h2>`;
    } else if (trimmed.startsWith('# ')) {
      html += `<h1 style="font-size:18pt; color:#0f172a; margin:24px 0 12px 0; font-weight:bold;">${formatted.replace('# ', '')}</h1>`;
    } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      html += `<li style="margin:4px 0; line-height:1.6; text-align:right;">${formatted.substring(2)}</li>`;
    } else if (/^\d+\.\s/.test(trimmed)) {
      html += `<div style="margin:6px 0; line-height:1.6; text-align:right;"><strong>${trimmed.match(/^\d+\./)?.[0]}</strong> ${formatted.replace(/^\d+\.\s/, '')}</div>`;
    } else if (trimmed.startsWith('> ')) {
      html += `<div style="background-color:#f8fafc; border-right:4px solid #3b82f6; padding:10px 14px; margin:12px 0; font-style:italic; line-height:1.6; text-align:right;">${formatted.replace('> ', '')}</div>`;
    } else if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      html += `<div style="background-color:#0f2744; color:#ffffff; padding:6px 12px; margin:14px 0 8px 0; font-size:11pt; font-weight:bold; display:inline-block; border-radius:4px;">${trimmed.slice(1, -1)}</div>`;
    } else {
      html += `<p style="margin:6px 0; line-height:1.7; text-align:right;">${formatted}</p>`;
    }
  });

  if (inTable) {
    flushTable();
  }

  return html;
}

/**
 * Export results to Microsoft Word (.doc)
 * Word natively opens this XML-compliant HTML format preserving RTL, Arabic fonts, and tables.
 */
export function exportToWord(options: ExportAcademicOptions): void {
  const {
    serviceTitle,
    serviceNumber,
    academicField,
    degreeLevel,
    citationStyle,
    softwareTool,
    inputText,
    resultText,
  } = options;

  const currentDate = new Date().toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const parsedResultHtml = markdownToHtml(resultText);

  const wordContent = `
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
<meta charset='utf-8'>
<title>تقرير المعالجة الأكاديمية - ${serviceTitle}</title>
<style>
@page Section1 {
    size: 21.0cm 29.7cm; /* A4 Standard */
    margin: 2.5cm 2.5cm 2.5cm 2.5cm;
    mso-header-margin: 1.25cm;
    mso-footer-margin: 1.25cm;
}
div.Section1 { page: Section1; }
body {
    direction: rtl;
    text-align: right;
    font-family: 'Traditional Arabic', 'Cairo', Arial, sans-serif;
    font-size: 13pt;
    line-height: 1.6;
    color: #1e293b;
    background-color: #ffffff;
}
.header-table {
    width: 100%;
    border-bottom: 3px double #1e3a8a;
    padding-bottom: 12px;
    margin-bottom: 20px;
}
.meta-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 24px;
    background-color: #f8fafc;
}
.meta-table td {
    padding: 8px 12px;
    border: 1px solid #cbd5e1;
    font-size: 11pt;
}
.meta-table .label {
    background-color: #f1f5f9;
    font-weight: bold;
    width: 25%;
    color: #0f2744;
}
.box-input {
    background-color: #f8fafc;
    border: 1px solid #cbd5e1;
    padding: 12px;
    margin-bottom: 24px;
    font-size: 11pt;
    color: #475569;
}
.seal-box {
    margin-top: 40px;
    padding-top: 15px;
    border-top: 1px dashed #94a3b8;
    font-size: 10pt;
    color: #64748b;
    text-align: center;
}
</style>
</head>
<body>
<div class="Section1">
    <!-- Academic Letterhead -->
    <table class="header-table" dir="rtl">
        <tr>
            <td style="text-align:right;">
                <h2 style="margin:0; color:#0f2744; font-size:18pt;">منصة إسناد الأكاديمية للدراسات العليا</h2>
                <p style="margin:4px 0 0 0; color:#64748b; font-size:11pt;">منظومة الذكاء الاصطناعي الرصين لرسائل الماجستير والدكتوراه</p>
            </td>
            <td style="text-align:left;">
                <p style="margin:0; font-size:10pt; color:#475569;"><strong>تاريخ التصدير:</strong> ${currentDate}</p>
                <p style="margin:4px 0 0 0; font-size:10pt; color:#475569;"><strong>معيار الجودة:</strong> Zero Hallucination</p>
            </td>
        </tr>
    </table>

    <h2 style="color:#1e3a8a; text-align:center; font-size:16pt; margin:15px 0;">
        تقرير رسمي: خدمة ${serviceTitle} (خدمة رقم ${String(serviceNumber).padStart(2, '0')})
    </h2>

    <!-- Metadata Grid -->
    <table class="meta-table" dir="rtl">
        <tr>
            <td class="label">التخصص العلمي:</td>
            <td>${academicField}</td>
            <td class="label">المرحلة الأكاديمية:</td>
            <td>${degreeLevel}</td>
        </tr>
        <tr>
            <td class="label">نظام التوثيق:</td>
            <td>${citationStyle}</td>
            <td class="label">البرنامج / الأداة:</td>
            <td>${softwareTool || 'معالجة لغوية ومنهجية'}</td>
        </tr>
    </table>

    <!-- Original Input Snapshot -->
    <h3 style="color:#0f2744; font-size:13pt; margin-bottom:6px;">المحتوى الأصلي المدخل من الباحث:</h3>
    <div class="box-input">
        ${inputText.replace(/\n/g, '<br/>')}
    </div>

    <!-- Official Processed Results -->
    <h3 style="color:#1e3a8a; font-size:14pt; margin:20px 0 10px 0; border-bottom:1.5px solid #1e3a8a; padding-bottom:4px;">
        مخرجات المعالجة الأكاديمية والتحليل المعتمد:
    </h3>
    <div style="font-size:12pt;">
        ${parsedResultHtml}
    </div>

    <!-- Integrity Seal and Footer -->
    <div class="seal-box">
        <p style="margin:4px 0;">صدر هذا المستند عبر منصة «إسناد الأكاديمي» لدعم طلبة الماجستير والدكتوراه.</p>
        <p style="margin:4px 0;">المحتوى مصمم ليتوافق مع اشتراطات لجان التحكيم والأمانة العلمية (COPE) ونظام توثيق ${citationStyle}.</p>
    </div>
</div>
</body>
</html>
`;

  const blob = new Blob(['\ufeff' + wordContent], {
    type: 'application/msword;charset=utf-8',
  });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `تقرير_إسناد_${serviceTitle.replace(/\s+/g, '_')}_${Date.now()}.doc`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

/**
 * Export results to official academic PDF report
 * Uses a styled printable academic view in a dedicated iframe/window
 */
export function exportToPDF(options: ExportAcademicOptions): void {
  const {
    serviceTitle,
    serviceNumber,
    academicField,
    degreeLevel,
    citationStyle,
    softwareTool,
    inputText,
    resultText,
  } = options;

  const currentDate = new Date().toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const parsedResultHtml = markdownToHtml(resultText);

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('يرجى السماح بفتح النوافذ المنبثقة لطباعة أو حفظ التقرير كـ PDF.');
    return;
  }

  const printDocument = `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8">
  <title>تقرير المعالجة الأكاديمية - ${serviceTitle}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=Tajawal:wght@400;500;700&display=swap" rel="stylesheet">
  <style>
    @page {
      size: A4;
      margin: 20mm;
    }
    body {
      direction: rtl;
      text-align: right;
      font-family: 'Tajawal', sans-serif;
      font-size: 11pt;
      line-height: 1.6;
      color: #1e293b;
      margin: 0;
      padding: 0;
      background: white;
    }
    h1, h2, h3, h4, .font-cairo {
      font-family: 'Cairo', sans-serif;
    }
    .header {
      border-bottom: 2px solid #1e3a8a;
      padding-bottom: 12px;
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .meta-box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 12px 16px;
      margin-bottom: 20px;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
      font-size: 10pt;
    }
    .meta-item {
      display: flex;
      gap: 6px;
    }
    .meta-item strong {
      color: #0f2744;
      min-width: 100px;
    }
    .input-box {
      background: #f1f5f9;
      border-right: 4px solid #94a3b8;
      padding: 10px 14px;
      margin-bottom: 24px;
      font-size: 9.5pt;
      color: #475569;
      border-radius: 0 6px 6px 0;
    }
    .result-content {
      margin-top: 15px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 14px 0;
      page-break-inside: avoid;
    }
    th, td {
      border: 1px solid #cbd5e1;
      padding: 8px 10px;
      text-align: right;
      font-size: 9.5pt;
    }
    th {
      background-color: #f1f5f9;
      color: #0f2744;
      font-weight: bold;
    }
    .footer {
      margin-top: 35px;
      padding-top: 15px;
      border-top: 1px dashed #cbd5e1;
      text-align: center;
      font-size: 9pt;
      color: #64748b;
      page-break-inside: avoid;
    }
    @media print {
      .no-print {
        display: none !important;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h2 class="font-cairo" style="margin:0; color:#0f2744; font-size:16pt;">منصة إسناد الأكاديمية للدراسات العليا</h2>
      <p style="margin:3px 0 0 0; color:#64748b; font-size:10pt;">تقرير رسمي معتمد للبحث العلمي المحكم</p>
    </div>
    <div style="text-align:left; font-size:9.5pt; color:#475569;">
      <div><strong>التاريخ:</strong> ${currentDate}</div>
      <div><strong>الخدمة:</strong> ${serviceTitle} (#${serviceNumber})</div>
    </div>
  </div>

  <div class="meta-box">
    <div class="meta-item"><strong>التخصص:</strong> <span>${academicField}</span></div>
    <div class="meta-item"><strong>المرحلة:</strong> <span>${degreeLevel}</span></div>
    <div class="meta-item"><strong>نظام التوثيق:</strong> <span>${citationStyle}</span></div>
    <div class="meta-item"><strong>أداة التحليل:</strong> <span>${softwareTool || 'SPSS / R'}</span></div>
  </div>

  <h3 class="font-cairo" style="color:#0f2744; font-size:12pt; margin:0 0 8px 0;">نص الإدخال المرجعي للباحث:</h3>
  <div class="input-box">
    ${inputText.replace(/\n/g, '<br/>')}
  </div>

  <h3 class="font-cairo" style="color:#1e3a8a; font-size:13pt; margin:18px 0 10px 0; border-bottom:1.5px solid #1e3a8a; padding-bottom:4px;">
    المخرج الأكاديمي والتحليل المعتمد:
  </h3>
  <div class="result-content">
    ${parsedResultHtml}
  </div>

  <div class="footer">
    <p style="margin:2px 0;">صدر هذا المستند عبر منصة «إسناد الأكاديمي» للذكاء الاصطناعي للدراسات العليا.</p>
    <p style="margin:2px 0;">متوافق مع معايير الأمانة العلمية الدولية (COPE) ونظام توثيق ${citationStyle}.</p>
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 500);
    };
  </script>
</body>
</html>
`;

  printWindow.document.open();
  printWindow.document.write(printDocument);
  printWindow.document.close();
}
