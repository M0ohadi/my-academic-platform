import React from 'react';
import {
  Languages,
  RefreshCw,
  CheckCheck,
  Target,
  BookOpenCheck,
  Compass,
  BarChart3,
  Quote,
  ShieldAlert,
  FolderTree,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import { AcademicService } from '../types';

interface ServiceCardProps {
  service: AcademicService;
  isSelected: boolean;
  onSelect: (service: AcademicService) => void;
}

// Icon mapper
const ICON_MAP: Record<string, React.ElementType> = {
  Languages,
  RefreshCw,
  CheckCheck,
  Target,
  BookOpenCheck,
  Compass,
  BarChart3,
  Quote,
  ShieldAlert,
  FolderTree,
};

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  isSelected,
  onSelect,
}) => {
  const IconComponent = ICON_MAP[service.iconName] || Sparkles;

  return (
    <div
      onClick={() => onSelect(service)}
      className={`group relative rounded-2xl p-6 transition-all duration-300 cursor-pointer text-right flex flex-col justify-between border ${
        isSelected
          ? 'bg-white border-indigo-600 shadow-xl shadow-indigo-100 ring-2 ring-indigo-500/20 translate-y--1'
          : 'bg-white border-slate-200/90 hover:border-indigo-400 hover:shadow-lg hover:shadow-slate-200/60 hover:-translate-y-1'
      }`}
    >
      {/* Top Bar: Number & Category Badge */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-700 transition-colors">
            {String(service.number).padStart(2, '0')}
          </span>

          <span
            className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
              service.category === 'writing'
                ? 'bg-blue-50 text-blue-700 border border-blue-100'
                : service.category === 'methodology'
                ? 'bg-purple-50 text-purple-700 border border-purple-100'
                : service.category === 'analysis'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                : 'bg-amber-50 text-amber-700 border border-amber-100'
            }`}
          >
            {service.categoryLabel}
          </span>
        </div>

        {/* Icon & Titles */}
        <div className="flex items-start gap-4 mb-3">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
              isSelected
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-slate-100 text-slate-700 group-hover:bg-indigo-50 group-hover:text-indigo-700'
            }`}
          >
            <IconComponent className="w-6 h-6" />
          </div>

          <div>
            <h3 className="text-lg font-bold font-cairo text-slate-900 group-hover:text-indigo-900 transition-colors">
              {service.title}
            </h3>
            <p className="text-xs text-slate-600 font-mono tracking-tight font-medium">
              {service.englishTitle}
            </p>
          </div>
        </div>

        {/* Short Description */}
        <p className="text-sm text-slate-600 leading-relaxed mt-2 mb-4">
          {service.shortDescription}
        </p>

        {/* Target Disciplines */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {service.targetFields.slice(0, 3).map((field, idx) => (
            <span
              key={idx}
              className="text-[11px] bg-slate-50 text-slate-600 px-2 py-0.5 rounded border border-slate-200"
            >
              {field}
            </span>
          ))}
          {service.targetFields.length > 3 && (
            <span className="text-[11px] text-slate-600 px-1 py-0.5">
              +{service.targetFields.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-auto">
        <span className="text-xs font-semibold text-slate-600 group-hover:text-indigo-700 transition-colors">
          {isSelected ? 'المحطة النشطة حالياً' : 'تفعيل الخدمة'}
        </span>
        <div
          className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
            isSelected
              ? 'bg-indigo-600 text-white rotate-0'
              : 'bg-slate-100 text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-700'
          }`}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
};
