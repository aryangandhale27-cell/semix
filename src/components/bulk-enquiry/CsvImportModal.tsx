import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Upload, FileText, CheckCircle2, AlertCircle, Copy, Sparkles, FileSpreadsheet } from 'lucide-react';
import { BulkEnquiryComponentItem } from '../../types';

interface CsvImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (items: Omit<BulkEnquiryComponentItem, 'id'>[]) => void;
}

const SAMPLE_CSV = `Part Number, Category, Quantity, Target Price
ESP32-WROOM-32D, Microcontroller, 500, ₹240
AMS1117-3.3V SOT-223, Power IC, 1000, ₹4.50
10k Ohm 0805 Resistor, SMD Passives, 5000, ₹0.45
0.1uF 50V Ceramic Cap 0805, SMD Passives, 5000, ₹0.60
MPU-6050 Accelerometer, Sensors, 300, ₹180`;

export const CsvImportModal: React.FC<CsvImportModalProps> = ({ isOpen, onClose, onImport }) => {
  const [pastedText, setPastedText] = useState('');
  const [parsedPreview, setParsedPreview] = useState<Omit<BulkEnquiryComponentItem, 'id'>[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const parseRawText = (text: string) => {
    setErrorMsg(null);
    const lines = text.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
    if (lines.length === 0) {
      setParsedPreview([]);
      return;
    }

    const items: Omit<BulkEnquiryComponentItem, 'id'>[] = [];
    
    // Check if first line is header
    const firstLineLower = lines[0].toLowerCase();
    const startIndex = (firstLineLower.includes('part') || firstLineLower.includes('item') || firstLineLower.includes('component') || firstLineLower.includes('name')) ? 1 : 0;

    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i];
      // Split by tab, comma, or semicolon
      let parts: string[] = [];
      if (line.includes('\t')) {
        parts = line.split('\t');
      } else if (line.includes(';')) {
        parts = line.split(';');
      } else {
        parts = line.split(',');
      }

      parts = parts.map(p => p.trim().replace(/^["']|["']$/g, ''));
      if (parts.length > 0 && parts[0]) {
        const partNumber = parts[0];
        const category = parts[1] || 'Electronic Component';
        // Parse quantity
        let qty = 1;
        if (parts[2]) {
          const parsedQty = parseInt(parts[2].replace(/[^\d]/g, ''), 10);
          if (!isNaN(parsedQty) && parsedQty > 0) {
            qty = parsedQty;
          }
        }
        const targetPrice = parts[3] ? parts[3] : '';

        items.push({
          partNumber,
          category,
          quantity: qty,
          targetPrice,
          notes: ''
        });
      }
    }

    if (items.length === 0) {
      setErrorMsg('Could not parse valid component rows. Please ensure at least part number and quantity are present.');
    }
    setParsedPreview(items);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setPastedText(val);
    parseRawText(val);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setPastedText(content);
      parseRawText(content);
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setPastedText(content);
      parseRawText(content);
    };
    reader.readAsText(file);
  };

  const handleLoadSample = () => {
    setPastedText(SAMPLE_CSV);
    parseRawText(SAMPLE_CSV);
  };

  const handleApplyImport = () => {
    if (parsedPreview.length === 0) {
      setErrorMsg('Please paste or upload at least one component before importing.');
      return;
    }
    onImport(parsedPreview);
    onClose();
    setPastedText('');
    setParsedPreview([]);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#561269] to-[#561269] text-white px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#FF6B00] border border-white/10">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Import BOM / Component List</h3>
                <p className="text-xs text-purple-200">Paste tabular data from Excel/Google Sheets or upload CSV/TXT</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-purple-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-4 overflow-y-auto flex-1">
            {/* Quick Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-700">Supported format:</span>
                <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-mono">
                  Part Number, Category, Quantity, Target Price
                </span>
              </div>
              <button
                type="button"
                onClick={handleLoadSample}
                className="text-xs font-bold text-[#561269] hover:text-[#FF6B00] flex items-center gap-1.5 px-3 py-1 bg-[#561269]/5 hover:bg-orange-50 rounded-lg transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Load Sample IoT Part List</span>
              </button>
            </div>

            {/* Drag & Drop File Box */}
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-4 text-center transition-all ${
                isDragOver ? 'border-[#FF6B00] bg-orange-50/50' : 'border-slate-300 hover:border-slate-400 bg-slate-50/50'
              }`}
            >
              <div className="flex flex-col items-center justify-center gap-1.5">
                <Upload className="w-6 h-6 text-slate-400" />
                <p className="text-xs font-medium text-slate-700">
                  Drag and drop your <span className="font-semibold text-[#561269]">.CSV</span> or <span className="font-semibold text-[#561269]">.TXT</span> file here, or{' '}
                  <label className="text-[#FF6B00] hover:underline font-bold cursor-pointer inline-block">
                    browse from device
                    <input
                      type="file"
                      accept=".csv,.txt,.tsv"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </p>
              </div>
            </div>

            {/* Direct Paste Text Area */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Or Paste Raw CSV / Excel Tab-Delimited Data
              </label>
              <textarea
                value={pastedText}
                onChange={handleTextChange}
                rows={5}
                placeholder={`ESP32-WROOM-32D, Microcontroller, 500, ₹240\nAMS1117-3.3V, Power IC, 1000, ₹4.50\n10k Resistor 0805, Passives, 5000, ₹0.40`}
                className="w-full text-xs font-mono p-3 rounded-xl border border-slate-300 focus:border-[#561269] focus:ring-2 focus:ring-[#561269]/20 outline-hidden resize-y bg-white"
              />
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Parsed Rows Preview */}
            {parsedPreview.length > 0 && (
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-slate-800">
                      Successfully Parsed {parsedPreview.length} Line Items
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500">
                    Total Quantity: {parsedPreview.reduce((acc, i) => acc + i.quantity, 0).toLocaleString()} units
                  </span>
                </div>
                <div className="max-h-48 overflow-y-auto divide-y divide-slate-100 text-xs">
                  {parsedPreview.map((item, idx) => (
                    <div key={idx} className="px-4 py-2 flex items-center justify-between hover:bg-slate-50">
                      <div className="flex items-center gap-3">
                        <span className="text-slate-400 font-mono text-[10px] w-5">{idx + 1}.</span>
                        <div>
                          <p className="font-bold text-slate-900">{item.partNumber}</p>
                          <p className="text-[11px] text-slate-500">{item.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-[#561269]">{item.quantity.toLocaleString()} pcs</span>
                        {item.targetPrice && (
                          <p className="text-[11px] text-slate-500">{item.targetPrice}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApplyImport}
              disabled={parsedPreview.length === 0}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold shadow-md flex items-center gap-2 transition-all cursor-pointer ${
                parsedPreview.length > 0
                  ? 'bg-[#FF6B00] hover:bg-[#e05e00] text-white shadow-orange-500/20'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Import {parsedPreview.length} Components to Table</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
