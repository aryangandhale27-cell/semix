import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';
import { 
  FileSpreadsheet, 
  Sparkles, 
  Check, 
  AlertTriangle, 
  ShoppingCart, 
  Upload, 
  Play, 
  RotateCcw, 
  Layers, 
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface MatchedBomItem {
  rawText: string;
  qty: number;
  product: Product | null;
  matchScore: number;
}

export const BomToolPage: React.FC = () => {
  const { products, addToCart, showToast, calculateAppliedPrice } = useApp();
  const navigate = useNavigate();

  const [rawInput, setRawInput] = useState(`Raspberry Pi 5 x 2
ESP32-S3 AI x 5
Arduino Uno R4 WiFi x 3
MPU-6050 6-DOF x 10
MG996R Metal Gear Servo x 8
Samsung 25R 18650 x 6
0.96 inch I2C OLED Display x 4`);

  const [matchedItems, setMatchedItems] = useState<MatchedBomItem[]>([]);
  const [hasProcessed, setHasProcessed] = useState(false);

  // Sample templates
  const loadTemplate = (type: 'drone' | 'iot' | 'robot') => {
    if (type === 'drone') {
      setRawInput(`T-Motor F40 Pro IV 1950KV x 4
SpeedyBee F405 V4 Flight Controller x 1
Orange 2200mAh 3S 30C LiPo Battery x 2
HQProp 5x4.3x3 V2S Propellers x 8
Foxeer Predator 5 Micro FPV Camera x 1`);
    } else if (type === 'iot') {
      setRawInput(`ESP32-S3 AI & IoT Dual Core x 4
BME280 Temperature Humidity Sensor x 4
0.96 inch I2C OLED Display x 4
Samsung 25R 18650 2500mAh x 8
Micro USB Breakout Board x 4`);
    } else {
      setRawInput(`Arduino Uno R4 WiFi x 2
MG996R High Torque Metal Gear Servo x 6
L298N Dual H-Bridge Motor Driver x 2
MPU-6050 6-DOF Gyroscope x 2
Ultrasonic HC-SR04 Sensor x 4`);
    }
  };

  const processBOM = () => {
    const lines = rawInput.split('\n').filter((l) => l.trim().length > 0);
    const results: MatchedBomItem[] = [];

    lines.forEach((line) => {
      let qty = 1;
      let cleanText = line.trim();

      // Check for x N or , N or qty patterns
      const qtyMatch = cleanText.match(/(?:x|\*|,|\s+qty:?)\s*(\d+)/i) || cleanText.match(/^(\d+)\s*(?:x|\*|,)?\s*(.+)$/i);
      if (qtyMatch) {
        if (cleanText.match(/^(\d+)\s*(?:x|\*|,)?\s*(.+)$/i)) {
          qty = parseInt(qtyMatch[1]);
          cleanText = qtyMatch[2].trim();
        } else {
          qty = parseInt(qtyMatch[1]);
          cleanText = cleanText.replace(/(?:x|\*|,|\s+qty:?)\s*(\d+)/i, '').trim();
        }
      }

      // Search for best matching product in catalog
      const lower = cleanText.toLowerCase();
      let bestProduct: Product | null = null;
      let highestScore = 0;

      products.forEach((prod) => {
        let score = 0;
        const prodName = prod.name.toLowerCase();
        const prodSku = prod.sku.toLowerCase();
        const prodBrand = prod.brand.toLowerCase();

        // Exact sku or name keyword match
        if (prodSku.includes(lower) || lower.includes(prodSku)) score += 50;
        if (prodName.includes(lower)) score += 40;

        // Split keywords
        const tokens = lower.split(/[\s-]+/).filter((t) => t.length > 2);
        tokens.forEach((tok) => {
          if (prodName.includes(tok)) score += 10;
          if (prod.tags.some((t) => t.toLowerCase().includes(tok))) score += 8;
          if (prodBrand.includes(tok)) score += 5;
        });

        if (score > highestScore && score >= 10) {
          highestScore = score;
          bestProduct = prod;
        }
      });

      results.push({
        rawText: line,
        qty: Math.max(1, qty),
        product: bestProduct,
        matchScore: highestScore
      });
    });

    setMatchedItems(results);
    setHasProcessed(true);
    showToast('BOM Processed', `Matched ${results.filter((r) => r.product).length} of ${results.length} components`, 'info');
  };

  const handleAddAllToCart = () => {
    let addedCount = 0;
    matchedItems.forEach((item) => {
      if (item.product) {
        addToCart(item.product, item.qty);
        addedCount += item.qty;
      }
    });

    showToast('BOM Items Added', `Added ${addedCount} parts with applied bulk pricing!`, 'success');
    navigate('/cart');
  };

  // Calculate totals
  const totalBOMValue = matchedItems.reduce((sum, item) => {
    if (!item.product) return sum;
    const unitPrice = calculateAppliedPrice(item.product, item.qty);
    return sum + unitPrice * item.qty;
  }, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-orange-100 text-[#FF6B00] text-xs font-bold px-2.5 py-0.5 rounded-full mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Engineer & Prototyping Utility</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#561269]">
            Bill of Materials (BOM) Auto-Matcher
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Paste your project parts list or Bill of Materials. Our algorithmic engine maps hardware to real-time warehouse inventory and calculates bulk tiered volume pricing.
          </p>
        </div>

        {/* Templates */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-400">Load sample:</span>
          <button
            onClick={() => loadTemplate('drone')}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1.5 rounded-lg text-xs font-bold"
          >
            Drone BOM
          </button>
          <button
            onClick={() => loadTemplate('iot')}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1.5 rounded-lg text-xs font-bold"
          >
            IoT Sensor Kit
          </button>
          <button
            onClick={() => loadTemplate('robot')}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1.5 rounded-lg text-xs font-bold"
          >
            Robotics Arm
          </button>
        </div>
      </div>

      {/* Input Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <FileSpreadsheet className="w-4 h-4 text-[#561269]" />
            <span>Paste Component List (One item per line, with quantity: e.g. "ESP32-S3 x 5")</span>
          </label>

          <button
            onClick={() => setRawInput('')}
            className="text-xs text-slate-400 hover:text-rose-600 font-semibold"
          >
            Clear Text
          </button>
        </div>

        <textarea
          rows={7}
          value={rawInput}
          onChange={(e) => setRawInput(e.target.value)}
          placeholder="Paste component list here...&#10;Raspberry Pi 5 x 2&#10;ESP32-S3 x 5&#10;Arduino Uno R4 WiFi x 1"
          className="w-full bg-slate-50 border border-slate-300 rounded-xl p-4 font-mono text-xs text-slate-800 focus:outline-hidden focus:border-[#561269] leading-relaxed"
        />

        <div className="flex items-center justify-between pt-2">
          <p className="text-[11px] text-slate-400">
            Supports syntax: <code>[Part Name] x [Qty]</code>, <code>[Qty] * [Part Name]</code>, or <code>[Part Name], [Qty]</code>
          </p>

          <button
            id="match-bom-btn"
            onClick={processBOM}
            className="bg-[#561269] hover:bg-[#460e56] text-white font-extrabold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer hover:scale-105"
          >
            <Play className="w-4 h-4 text-[#FF6B00]" />
            <span>Match Components & Check Inventory</span>
          </button>
        </div>
      </div>

      {/* Results Section */}
      {hasProcessed && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <h3 className="font-extrabold text-base text-[#561269]">
                Matched BOM Inventory & Tier Breakdown
              </h3>
              <p className="text-xs text-slate-500">
                {matchedItems.filter((i) => i.product).length} of {matchedItems.length} lines verified against warehouse catalog
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="text-[11px] text-slate-400 block uppercase font-bold">Estimated BOM Total</span>
                <span className="text-xl font-extrabold text-slate-900 font-mono">
                  ₹{totalBOMValue.toLocaleString('en-IN')}
                </span>
              </div>

              <button
                id="add-all-bom-btn"
                onClick={handleAddAllToCart}
                className="bg-[#FF6B00] hover:bg-orange-600 text-white font-extrabold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-lg shadow-orange-950/20 flex items-center gap-2 transition-all cursor-pointer hover:scale-105"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Add Entire BOM to Cart</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] border-b border-slate-200">
                  <th className="p-3">Raw Part Input</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Matched Catalog Item</th>
                  <th className="p-3 text-center">Required Qty</th>
                  <th className="p-3 text-right">Applied Unit Price</th>
                  <th className="p-3 text-right">Line Total</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {matchedItems.map((item, idx) => {
                  const product = item.product;
                  const unitPrice = product ? calculateAppliedPrice(product, item.qty) : 0;
                  const lineTotal = unitPrice * item.qty;

                  return (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3 font-mono text-slate-800 font-medium">
                        {item.rawText}
                      </td>

                      <td className="p-3">
                        {product ? (
                          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full text-[10px] font-bold border border-emerald-200">
                            <Check className="w-3 h-3" /> Matched
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full text-[10px] font-bold border border-amber-200">
                            <AlertTriangle className="w-3 h-3" /> Unmatched
                          </span>
                        )}
                      </td>

                      <td className="p-3">
                        {product ? (
                          <div className="flex items-center gap-2">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-8 h-8 object-contain mix-blend-multiply bg-slate-50 rounded p-1"
                            />
                            <div>
                              <Link
                                to={`/product/${product.id}`}
                                className="font-bold text-slate-900 hover:text-[#561269] line-clamp-1"
                              >
                                {product.name}
                              </Link>
                              <span className="text-[10px] text-slate-400 font-mono">
                                SKU: {product.sku} • Stock: {product.stockCount}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">No exact catalog match found</span>
                        )}
                      </td>

                      <td className="p-3 text-center font-bold font-mono text-slate-800">
                        {item.qty}
                      </td>

                      <td className="p-3 text-right font-mono">
                        {product ? (
                          <div>
                            <span className="font-bold text-slate-900">₹{unitPrice.toLocaleString('en-IN')}</span>
                            {unitPrice < product.price && (
                              <span className="text-[10px] text-emerald-600 block">
                                (Bulk Discount)
                              </span>
                            )}
                          </div>
                        ) : (
                          '-'
                        )}
                      </td>

                      <td className="p-3 text-right font-mono font-extrabold text-[#561269]">
                        {product ? `₹${lineTotal.toLocaleString('en-IN')}` : '-'}
                      </td>

                      <td className="p-3 text-center">
                        {product && (
                          <button
                            onClick={() => addToCart(product, item.qty)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-[#561269] hover:text-white text-slate-600 transition-colors"
                            title="Add item to Cart"
                          >
                            <ShoppingCart className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
