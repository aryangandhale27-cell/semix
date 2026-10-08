import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { GitCompare, X, Trash2, ArrowRight, CheckCircle2, Star, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CompareDrawer: React.FC = () => {
  const { compareList, removeFromCompare, clearCompare, products, addToCart } = useApp();
  const [modalOpen, setModalOpen] = useState(false);

  const comparedProducts = products.filter((p) => compareList.includes(p.id));

  // Collect all unique specification keys
  const allSpecKeys = Array.from(
    new Set(
      comparedProducts.flatMap((p) => (p.specifications ? p.specifications.map((s) => s.name) : []))
    )
  );

  return (
    <>
      {/* Floating Bottom Bar */}
      <AnimatePresence>
        {compareList.length > 0 && (
          <motion.div
            id="compare-floating-bar"
            initial={{ opacity: 0, y: 40, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 40, x: '-50%' }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-4 left-1/2 z-40 bg-[#380847] text-white px-4 sm:px-6 py-3 rounded-2xl shadow-2xl border border-[#561269]/30/80 flex items-center gap-3 sm:gap-6"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#FF6B00] text-white flex items-center justify-center font-bold">
                <GitCompare className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold leading-tight">
                  Compare Components ({comparedProducts.length}/4)
                </p>
                <p className="text-[11px] text-slate-400">Side-by-side hardware matrix</p>
              </div>
            </div>

            {/* Thumbnails */}
            <div className="hidden sm:flex items-center gap-2">
              {comparedProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="relative w-9 h-9 rounded-lg bg-white p-1 border border-slate-300 group"
                >
                  <img src={prod.image} alt={prod.name} className="w-full h-full object-contain mix-blend-multiply" />
                  <button
                    onClick={() => removeFromCompare(prod.id)}
                    className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-2">
              <motion.button
                id="open-compare-modal-btn"
                onClick={() => setModalOpen(true)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                className="bg-[#FF6B00] hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
              >
                <span>Compare Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </motion.button>

              <button
                onClick={clearCompare}
                className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                title="Clear all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full Compare Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            id="compare-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              id="compare-modal-dialog"
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#561269] text-white flex items-center justify-center">
                    <GitCompare className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Technical Specification Matrix</h3>
                    <p className="text-xs text-slate-500">Compare pinouts, logic voltage, clock speed, and unit price</p>
                  </div>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 hover:bg-slate-300 flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body - Scrollable table */}
              <div className="p-4 sm:p-6 overflow-x-auto overflow-y-auto flex-1">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="p-3 font-bold text-slate-400 uppercase tracking-wider w-40 bg-slate-50/50">
                        Parameter
                      </th>
                      {comparedProducts.map((prod) => (
                        <th key={prod.id} className="p-3 w-64 min-w-[200px] align-top">
                          <div className="flex flex-col items-center text-center p-2 rounded-xl bg-slate-50 border border-slate-200">
                            <img
                              src={prod.image}
                              alt={prod.name}
                              className="w-20 h-20 object-contain mix-blend-multiply mb-2"
                            />
                            <span className="font-bold text-slate-900 line-clamp-2 text-xs mb-1">
                              {prod.name}
                            </span>
                            <span className="text-base font-extrabold text-[#561269] font-mono">
                              ₹{prod.price.toLocaleString('en-IN')}
                            </span>
                            <div className="flex gap-1.5 mt-2 w-full">
                              <button
                                onClick={() => addToCart(prod, 1)}
                                className="flex-1 bg-[#561269] text-white py-1.5 px-2 rounded-lg font-bold text-[11px] flex items-center justify-center gap-1 hover:bg-[#460e56] cursor-pointer"
                              >
                                <ShoppingCart className="w-3 h-3" />
                                <span>Add</span>
                              </button>
                              <button
                                onClick={() => removeFromCompare(prod.id)}
                                className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                                title="Remove"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="p-3 font-semibold text-slate-600 bg-slate-50/50">Brand</td>
                      {comparedProducts.map((p) => (
                        <td key={p.id} className="p-3 font-bold text-slate-800">
                          {p.brand}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-slate-600 bg-slate-50/50">SKU Code</td>
                      {comparedProducts.map((p) => (
                        <td key={p.id} className="p-3 font-mono text-slate-600">
                          {p.sku}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-slate-600 bg-slate-50/50">Stock Available</td>
                      {comparedProducts.map((p) => (
                        <td key={p.id} className="p-3">
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {p.stockCount} in stock
                          </span>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-slate-600 bg-slate-50/50">Operating Voltage</td>
                      {comparedProducts.map((p) => (
                        <td key={p.id} className="p-3 font-semibold text-slate-800">
                          {p.voltage || 'N/A'}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-slate-600 bg-slate-50/50">Rating</td>
                      {comparedProducts.map((p) => (
                        <td key={p.id} className="p-3">
                          <div className="flex items-center gap-1 font-bold text-amber-700">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                            <span>{p.rating} / 5</span>
                            <span className="text-slate-400 font-normal">({p.reviewCount})</span>
                          </div>
                        </td>
                      ))}
                    </tr>

                    {/* Dynamic Technical Specs */}
                    {allSpecKeys.map((key) => (
                      <tr key={key}>
                        <td className="p-3 font-semibold text-slate-600 bg-slate-50/50">{key}</td>
                        {comparedProducts.map((p) => {
                          const spec = p.specifications?.find((s) => s.name === key);
                          return (
                            <td key={p.id} className="p-3 text-slate-700">
                              {spec ? spec.value : <span className="text-slate-300">-</span>}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
