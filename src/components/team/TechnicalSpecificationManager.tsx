import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ProductSpec } from '../../types';
import { Plus, Trash2, Sliders, Sparkles, AlertCircle } from 'lucide-react';

interface TechnicalSpecificationManagerProps {
  specifications: ProductSpec[];
  onChange: (specs: ProductSpec[]) => void;
  error?: string;
}

const COMMON_SPEC_SUGGESTIONS = [
  'Operating Voltage',
  'Supply Current',
  'Microcontroller / Core',
  'Clock Frequency',
  'Package / Form Factor',
  'Flash Memory / RAM',
  'Communication Protocol',
  'Operating Temperature',
  'Pin Count',
  'Logic Level',
  'Mounting Type',
  'RoHS Compliance'
];

export const TechnicalSpecificationManager: React.FC<TechnicalSpecificationManagerProps> = ({
  specifications,
  onChange,
  error
}) => {
  const [suggestionMenuOpen, setSuggestionMenuOpen] = useState(false);

  const handleAddSpec = (name = '', value = '') => {
    onChange([...specifications, { name, value }]);
    setSuggestionMenuOpen(false);
  };

  const handleUpdateSpec = (index: number, field: 'name' | 'value', newValue: string) => {
    const updated = specifications.map((spec, i) => {
      if (i === index) {
        return { ...spec, [field]: newValue };
      }
      return spec;
    });
    onChange(updated);
  };

  const handleDeleteSpec = (index: number) => {
    const updated = specifications.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="space-y-3" id="tech-spec-manager">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-[#561269]" />
            <span>Technical Specifications</span>
            <span className="text-[11px] font-normal text-slate-500">
              ({specifications.length} defined)
            </span>
          </label>
          <p className="text-[11px] text-slate-500">
            Define hardware parameters such as operating voltage, pinouts, and clock speeds.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Preset Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setSuggestionMenuOpen(!suggestionMenuOpen)}
              className="text-[11px] font-bold text-[#561269] bg-[#561269]/5 hover:bg-[#561269]/10 border border-[#561269]/20/60 px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-[#FF6B00]" />
              <span>Add Quick Preset</span>
            </button>

            {suggestionMenuOpen && (
              <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-slate-200 rounded-xl shadow-xl z-30 p-1 max-h-48 overflow-y-auto">
                <span className="text-[10px] uppercase font-extrabold text-slate-400 px-2 py-1 block">
                  Common Parameters
                </span>
                {COMMON_SPEC_SUGGESTIONS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handleAddSpec(preset, '')}
                    className="w-full text-left px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-50 hover:text-[#561269] rounded-lg transition-colors font-medium cursor-pointer"
                  >
                    + {preset}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => handleAddSpec('', '')}
            id="add-spec-row-btn"
            className="text-[11px] font-bold text-white bg-[#561269] hover:bg-[#460e56] px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Specification</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-1.5 text-xs text-rose-600 bg-rose-50 border border-rose-200 p-2 rounded-lg">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Specifications Table / List */}
      {specifications.length === 0 ? (
        <div className="border border-dashed border-slate-200 rounded-xl p-6 text-center bg-slate-50/50">
          <Sliders className="w-6 h-6 text-slate-300 mx-auto mb-1.5" />
          <p className="text-xs font-semibold text-slate-600">No technical specifications added yet</p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Click &quot;+ Add Specification&quot; or choose a preset to add hardware attributes.
          </p>
          <button
            type="button"
            onClick={() => handleAddSpec('', '')}
            className="mt-3 text-xs font-bold text-[#561269] bg-white border border-slate-200 hover:border-[#561269]/30 px-3 py-1.5 rounded-lg shadow-xs cursor-pointer"
          >
            + Add First Specification
          </button>
        </div>
      ) : (
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white divide-y divide-slate-100 shadow-xs">
          {/* Header Row */}
          <div className="grid grid-cols-12 gap-2 bg-slate-50/80 px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            <div className="col-span-5 sm:col-span-5">Specification Name</div>
            <div className="col-span-6 sm:col-span-6">Value / Metric</div>
            <div className="col-span-1 sm:col-span-1 text-center">Action</div>
          </div>

          <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
            <AnimatePresence initial={false}>
              {specifications.map((spec, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.15 }}
                  className="grid grid-cols-12 gap-2 items-center p-2.5 bg-white hover:bg-slate-50/50 transition-colors"
                >
                  <div className="col-span-5 sm:col-span-5">
                    <input
                      type="text"
                      placeholder="e.g. Operating Voltage"
                      value={spec.name}
                      onChange={(e) => handleUpdateSpec(index, 'name', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-[#561269] focus:bg-white focus:ring-1 focus:ring-[#561269] rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-900 transition-all"
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-6">
                    <input
                      type="text"
                      placeholder="e.g. 3.3V to 5.0V DC"
                      value={spec.value}
                      onChange={(e) => handleUpdateSpec(index, 'value', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-[#561269] focus:bg-white focus:ring-1 focus:ring-[#561269] rounded-lg px-2.5 py-1.5 text-xs text-slate-800 transition-all font-mono"
                    />
                  </div>

                  <div className="col-span-1 sm:col-span-1 text-center">
                    <button
                      type="button"
                      onClick={() => handleDeleteSpec(index)}
                      title="Delete Specification"
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
};
