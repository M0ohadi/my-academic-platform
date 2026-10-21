import React from 'react';

interface AcademicMarkdownProps {
  content: string;
}

export const AcademicMarkdown: React.FC<AcademicMarkdownProps> = ({ content }) => {
  if (!content) return null;

  // Split lines and parse basic academic markdown structure
  const lines = content.split('\n');

  // Check if line is a table row
  const isTableRow = (line: string) => line.trim().startsWith('|') && line.trim().endsWith('|');
  const isDividerRow = (line: string) => line.trim().startsWith('|') && line.includes('---');

  const renderedElements: React.ReactNode[] = [];
  let tableBuffer: string[] = [];

  const flushTable = (keyPrefix: number) => {
    if (tableBuffer.length === 0) return;

    const rows = tableBuffer.filter((r) => !isDividerRow(r));
    if (rows.length === 0) {
      tableBuffer = [];
      return;
    }

    const headerCells = rows[0]
      .split('|')
      .slice(1, -1)
      .map((c) => c.trim());
    const bodyRows = rows.slice(1);

    renderedElements.push(
      <div key={`table-${keyPrefix}`} className="my-5 overflow-x-auto rounded-xl border border-slate-200 shadow-xs">
        <table className="w-full text-right text-sm">
          <thead className="bg-slate-100 text-slate-900 border-b border-slate-200 font-cairo">
            <tr>
              {headerCells.map((cell, idx) => (
                <th key={idx} className="py-3 px-4 font-semibold text-slate-800">
                  {cell}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-150 bg-white">
            {bodyRows.map((row, rIdx) => {
              const cells = row
                .split('|')
                .slice(1, -1)
                .map((c) => c.trim());
              return (
                <tr key={rIdx} className="hover:bg-slate-50 transition-colors">
                  {cells.map((cell, cIdx) => (
                    <td key={cIdx} className="py-3 px-4 text-slate-700 leading-relaxed">
                      {cell}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
    tableBuffer = [];
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    if (isTableRow(trimmed)) {
      tableBuffer.push(trimmed);
      return;
    } else if (tableBuffer.length > 0) {
      flushTable(index);
    }

    if (!trimmed) {
      renderedElements.push(<div key={`spacer-${index}`} className="h-3" />);
      return;
    }

    // Main Headings ###, ##, #
    if (trimmed.startsWith('### ')) {
      renderedElements.push(
        <h4 key={index} className="text-lg font-bold text-slate-900 font-cairo mt-5 mb-2 pb-1 border-b border-slate-100 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-600 inline-block"></span>
          {trimmed.replace('### ', '')}
        </h4>
      );
    } else if (trimmed.startsWith('## ')) {
      renderedElements.push(
        <h3 key={index} className="text-xl font-bold text-indigo-950 font-cairo mt-6 mb-3 pb-1 border-b border-indigo-100 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-700 inline-block"></span>
          {trimmed.replace('## ', '')}
        </h3>
      );
    } else if (trimmed.startsWith('# ')) {
      renderedElements.push(
        <h2 key={index} className="text-2xl font-bold text-indigo-950 font-cairo mt-8 mb-4 border-b-2 border-indigo-200 pb-2">
          {trimmed.replace('# ', '')}
        </h2>
      );
    } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      // Bullet list items
      const itemText = trimmed.substring(2);
      renderedElements.push(
        <div key={index} className="flex items-start gap-3 my-1.5 pr-2">
          <span className="text-indigo-600 font-bold mt-1 text-xs">•</span>
          <p className="text-slate-700 text-sm md:text-base leading-relaxed flex-1">
            {formatBold(itemText)}
          </p>
        </div>
      );
    } else if (/^\d+\.\s/.test(trimmed)) {
      // Numbered list
      const num = trimmed.match(/^(\d+)\.\s/)?.[1] || '•';
      const text = trimmed.replace(/^\d+\.\s/, '');
      renderedElements.push(
        <div key={index} className="flex items-start gap-3 my-2 pr-2">
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-200 text-slate-800 text-xs font-bold shrink-0 mt-0.5">
            {num}
          </span>
          <p className="text-slate-700 text-sm md:text-base leading-relaxed flex-1">
            {formatBold(text)}
          </p>
        </div>
      );
    } else if (trimmed.startsWith('> ')) {
      // Callout quote
      renderedElements.push(
        <div key={index} className="my-3 p-4 bg-indigo-50/70 border-r-4 border-indigo-600 rounded-l-xl text-indigo-950 text-sm md:text-base italic leading-relaxed">
          {formatBold(trimmed.replace('> ', ''))}
        </div>
      );
    } else if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      // Academic section bracket tag, e.g. [الترجمة الأكاديمية المعتمدة]
      renderedElements.push(
        <div key={index} className="mt-5 mb-2 inline-flex items-center gap-2 px-3 py-1 bg-slate-800 text-white text-xs md:text-sm font-semibold rounded-lg font-cairo shadow-xs">
          <span>❖</span>
          <span>{trimmed.slice(1, -1)}</span>
        </div>
      );
    } else {
      // Standard paragraph
      renderedElements.push(
        <p key={index} className="text-slate-700 text-sm md:text-base leading-relaxed my-1.5 font-normal">
          {formatBold(trimmed)}
        </p>
      );
    }
  });

  if (tableBuffer.length > 0) {
    flushTable(lines.length);
  }

  return <div className="space-y-1 text-right">{renderedElements}</div>;
};

// Helper to render **bold** segments
function formatBold(text: string): React.ReactNode {
  if (!text.includes('**')) return text;

  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold text-slate-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}
