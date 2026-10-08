import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  Layers, 
  Box, 
  Zap, 
  BatteryCharging, 
  Upload, 
  Check, 
  ArrowRight, 
  Clock, 
  FileCode, 
  ShieldCheck, 
  Sparkles,
  Cpu
} from 'lucide-react';

export const ServicesPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { showToast, addToCart, products } = useApp();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'pcb' | '3d-print' | 'laser-cutting' | 'battery-pack'>('pcb');

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'pcb' || tab === '3d-print' || tab === 'laser-cutting' || tab === 'battery-pack') {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // 1. PCB State
  const [pcbLayers, setPcbLayers] = useState<number>(2);
  const [pcbWidth, setPcbWidth] = useState<number>(100);
  const [pcbHeight, setPcbHeight] = useState<number>(100);
  const [pcbQty, setPcbQty] = useState<number>(10);
  const [pcbColor, setPcbColor] = useState<string>('Matte Black');
  const [pcbFinish, setPcbFinish] = useState<string>('HASL Lead Free');
  const [pcbFileName, setPcbFileName] = useState<string | null>(null);

  // 2. 3D Print State
  const [printMaterial, setPrintMaterial] = useState<string>('PLA+ Engineering');
  const [printInfill, setPrintInfill] = useState<number>(30);
  const [printLayerHeight, setPrintLayerHeight] = useState<string>('0.16mm (Fine)');
  const [printColor, setPrintColor] = useState<string>('Space Gray');
  const [printWeightGrams, setPrintWeightGrams] = useState<number>(85);
  const [stlFileName, setStlFileName] = useState<string | null>(null);

  // 3. Laser Cutting State
  const [laserMaterial, setLaserMaterial] = useState<string>('Cast Acrylic (Translucent)');
  const [laserThickness, setLaserThickness] = useState<string>('3.0mm');
  const [laserDimensions, setLaserDimensions] = useState<{ w: number; h: number }>({ w: 200, h: 150 });
  const [dxfFileName, setDxfFileName] = useState<string | null>(null);

  // 4. Custom Battery Pack State
  const [cellType, setCellType] = useState<string>('Samsung 25R 18650 (High Drain)');
  const [packConfig, setPackConfig] = useState<string>('3S 2P (11.1V, 5000mAh)');
  const [bmsChoice, setBmsChoice] = useState<string>('40A Continuous Balance BMS');
  const [plugType, setPlugType] = useState<string>('XT60 Female (14AWG)');

  // Quote calculations
  const calculatePcbQuote = () => {
    let base = pcbLayers === 1 ? 350 : pcbLayers === 2 ? 450 : pcbLayers === 4 ? 1200 : 2500;
    const areaFactor = (pcbWidth * pcbHeight) / 10000;
    const finishCost = pcbFinish.includes('ENIG') ? 600 : 0;
    const colorCost = pcbColor === 'Matte Black' || pcbColor === 'Purple' ? 100 : 0;
    const total = (base * Math.max(1, areaFactor) + finishCost + colorCost) * (pcbQty / 5);
    return Math.round(total);
  };

  const calculate3DQuote = () => {
    const gramRate = printMaterial.includes('Resin') ? 12 : printMaterial.includes('PETG') ? 6 : 4.5;
    const infillFactor = 1 + (printInfill / 100) * 0.4;
    return Math.round(printWeightGrams * gramRate * infillFactor + 150);
  };

  const calculateLaserQuote = () => {
    const area = (laserDimensions.w * laserDimensions.h) / 100;
    const thicknessRate = laserThickness === '5.0mm' ? 1.8 : 1.2;
    return Math.round(area * 1.5 * thicknessRate + 200);
  };

  const calculateBatteryQuote = () => {
    let base = packConfig.startsWith('3S') ? 1850 : packConfig.startsWith('4S') ? 2450 : 3800;
    return base + 350; // assembly & spot welding fee
  };

  const handleOrderService = (serviceName: string, quoteAmount: number) => {
    // Find a proxy service item or mock product to add to cart
    const dummyProduct = products[0];
    addToCart(
      {
        ...dummyProduct,
        id: `custom-svc-${Date.now()}`,
        name: `Custom Service: ${serviceName}`,
        price: quoteAmount,
        sku: `SVC-${Date.now().toString().slice(-4)}`
      },
      1
    );

    showToast('Custom Service Added', `Added ${serviceName} (₹${quoteAmount}) to your prototyping cart!`, 'success');
    navigate('/cart');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-cyan-50 text-cyan-800 text-xs font-bold px-2.5 py-0.5 rounded-full mb-1">
            <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
            <span>Industrial Rapid Prototyping</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#561269]">
            Custom Hardware & Fabrication Services
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Turn your CAD schematics, STL 3D models, and custom battery designs into physical prototypes with instant online quoting and fast dispatch.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-slate-50 p-1.5 rounded-2xl gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('pcb')}
          className={`flex-1 min-w-[160px] py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'pcb'
              ? 'bg-[#561269] text-white shadow-md'
              : 'text-slate-600 hover:bg-white/80'
          }`}
        >
          <Layers className="w-4 h-4 text-cyan-400" />
          <span>PCB Fabrication</span>
        </button>

        <button
          onClick={() => setActiveTab('3d-print')}
          className={`flex-1 min-w-[160px] py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === '3d-print'
              ? 'bg-[#561269] text-white shadow-md'
              : 'text-slate-600 hover:bg-white/80'
          }`}
        >
          <Box className="w-4 h-4 text-purple-400" />
          <span>3D Rapid Printing</span>
        </button>

        <button
          onClick={() => setActiveTab('laser-cutting')}
          className={`flex-1 min-w-[160px] py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'laser-cutting'
              ? 'bg-[#561269] text-white shadow-md'
              : 'text-slate-600 hover:bg-white/80'
          }`}
        >
          <Zap className="w-4 h-4 text-emerald-400" />
          <span>Laser Cutting & Acrylic</span>
        </button>

        <button
          onClick={() => setActiveTab('battery-pack')}
          className={`flex-1 min-w-[160px] py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'battery-pack'
              ? 'bg-[#561269] text-white shadow-md'
              : 'text-slate-600 hover:bg-white/80'
          }`}
        >
          <BatteryCharging className="w-4 h-4 text-amber-400" />
          <span>Custom Battery Packs</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Config Panel */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          {/* PCB FABRICATION */}
          {activeTab === 'pcb' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#561269]" />
                  <span>PCB Parameters & Layer Stackup</span>
                </h3>
                <span className="text-xs text-slate-500 font-mono">FR4 Standard 1.6mm</span>
              </div>

              {/* Gerber upload */}
              <div className="border-2 border-dashed border-slate-300 hover:border-[#561269] rounded-2xl p-6 text-center bg-slate-50/50 transition-colors">
                <input
                  type="file"
                  id="gerber-upload"
                  accept=".zip,.rar,.tar"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setPcbFileName(e.target.files[0].name);
                      showToast('Gerber Uploaded', `Parsed schematic package: ${e.target.files[0].name}`, 'success');
                    }
                  }}
                  className="hidden"
                />
                <label htmlFor="gerber-upload" className="cursor-pointer flex flex-col items-center">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-100 text-cyan-800 flex items-center justify-center mb-2">
                    <Upload className="w-6 h-6" />
                  </div>
                  <span className="font-bold text-xs text-slate-800">
                    {pcbFileName ? pcbFileName : 'Click to Upload Gerber Zip (KiCad, Altium, Eagle, EasyEDA)'}
                  </span>
                  <span className="text-[11px] text-slate-400 mt-1">
                    Auto-DRC design rule check & solder pad verification
                  </span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Layers */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Layer Count</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 2, 4, 6].map((l) => (
                      <button
                        key={l}
                        type="button"
                        onClick={() => setPcbLayers(l)}
                        className={`py-2 rounded-xl border font-bold ${
                          pcbLayers === l ? 'bg-[#561269] text-white border-[#561269]' : 'bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        {l} Layer{l > 1 ? 's' : ''}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dimensions */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Board Dimensions (mm)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={pcbWidth}
                      onChange={(e) => setPcbWidth(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono"
                      placeholder="Width"
                    />
                    <span className="text-slate-400 font-bold">×</span>
                    <input
                      type="number"
                      value={pcbHeight}
                      onChange={(e) => setPcbHeight(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono"
                      placeholder="Height"
                    />
                  </div>
                </div>

                {/* Solder Mask Color */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Solder Mask Color</label>
                  <select
                    value={pcbColor}
                    onChange={(e) => setPcbColor(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold"
                  >
                    <option value="Matte Black">Matte Black (Stealth Pro)</option>
                    <option value="Classic Green">Classic Green</option>
                    <option value="Navy Blue">Navy Blue</option>
                    <option value="Signal Red">Signal Red</option>
                    <option value="Pure White">Pure White</option>
                    <option value="Purple">OshPark Purple</option>
                  </select>
                </div>

                {/* Surface Finish */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Surface Finish</label>
                  <select
                    value={pcbFinish}
                    onChange={(e) => setPcbFinish(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold"
                  >
                    <option value="HASL Lead Free">HASL (Lead-Free RoHS)</option>
                    <option value="ENIG Immersion Gold">ENIG (Electroless Nickel Immersion Gold)</option>
                    <option value="Immersion Silver">Immersion Silver</option>
                  </select>
                </div>

                {/* Qty */}
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1.5">Batch Quantity</label>
                  <div className="grid grid-cols-5 gap-2">
                    {[5, 10, 30, 50, 100].map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => setPcbQty(q)}
                        className={`py-2 rounded-xl border font-bold ${
                          pcbQty === q ? 'bg-[#FF6B00] text-white border-[#FF6B00]' : 'bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        {q} pcs
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3D PRINTING */}
          {activeTab === '3d-print' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                  <Box className="w-4 h-4 text-[#561269]" />
                  <span>3D Print Material & Resolution Config</span>
                </h3>
                <span className="text-xs text-slate-500 font-mono">Bambu X1-Carbon Fleet</span>
              </div>

              {/* STL upload */}
              <div className="border-2 border-dashed border-slate-300 hover:border-[#561269] rounded-2xl p-6 text-center bg-slate-50/50 transition-colors">
                <input
                  type="file"
                  id="stl-upload"
                  accept=".stl,.step,.obj,.3mf"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setStlFileName(e.target.files[0].name);
                      showToast('Model Uploaded', `Calculated sliced mesh for: ${e.target.files[0].name}`, 'success');
                    }
                  }}
                  className="hidden"
                />
                <label htmlFor="stl-upload" className="cursor-pointer flex flex-col items-center">
                  <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center mb-2">
                    <Upload className="w-6 h-6" />
                  </div>
                  <span className="font-bold text-xs text-slate-800">
                    {stlFileName ? stlFileName : 'Click to Upload 3D File (.STL, .STEP, .3MF, .OBJ)'}
                  </span>
                  <span className="text-[11px] text-slate-400 mt-1">
                    Auto-slicing volume, wall thickness, and weight calculation
                  </span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Engineering Material</label>
                  <select
                    value={printMaterial}
                    onChange={(e) => setPrintMaterial(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold"
                  >
                    <option value="PLA+ Engineering">PLA+ Tough (High Rigidity)</option>
                    <option value="PETG High Temp">PETG (Weatherproof & 80°C Temp)</option>
                    <option value="ABS Mechanical">ABS (Impact & UV Resistant)</option>
                    <option value="SLA Precision Resin">SLA 8K Precision Photopolymer Resin</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Color Filament</label>
                  <select
                    value={printColor}
                    onChange={(e) => setPrintColor(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold"
                  >
                    <option value="Space Gray">Space Gray</option>
                    <option value="Matte Black">Matte Black</option>
                    <option value="Pure White">Pure White</option>
                    <option value="Industrial Orange">Industrial Orange</option>
                    <option value="Electric Blue">Electric Blue</option>
                  </select>
                </div>

                <div>
                  <div className="flex justify-between font-bold text-slate-700 mb-1.5">
                    <span>Infill Density</span>
                    <span className="font-mono text-[#561269]">{printInfill}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={printInfill}
                    onChange={(e) => setPrintInfill(Number(e.target.value))}
                    className="w-full accent-[#561269]"
                  />
                </div>

                <div>
                  <div className="flex justify-between font-bold text-slate-700 mb-1.5">
                    <span>Estimated Part Weight</span>
                    <span className="font-mono text-[#561269]">{printWeightGrams} grams</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="500"
                    step="5"
                    value={printWeightGrams}
                    onChange={(e) => setPrintWeightGrams(Number(e.target.value))}
                    className="w-full accent-[#FF6B00]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* LASER CUTTING */}
          {activeTab === 'laser-cutting' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#561269]" />
                  <span>CNC Laser Cutting & Acrylic Panels</span>
                </h3>
                <span className="text-xs text-slate-500 font-mono">130W CO2 Precision Laser</span>
              </div>

              <div className="border-2 border-dashed border-slate-300 hover:border-[#561269] rounded-2xl p-6 text-center bg-slate-50/50 transition-colors">
                <input
                  type="file"
                  id="dxf-upload"
                  accept=".dxf,.dwg,.svg"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setDxfFileName(e.target.files[0].name);
                      showToast('CAD Uploaded', `Parsed 2D vector path for: ${e.target.files[0].name}`, 'success');
                    }
                  }}
                  className="hidden"
                />
                <label htmlFor="dxf-upload" className="cursor-pointer flex flex-col items-center">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-2">
                    <Upload className="w-6 h-6" />
                  </div>
                  <span className="font-bold text-xs text-slate-800">
                    {dxfFileName ? dxfFileName : 'Click to Upload 2D Vector (.DXF, .DWG, .SVG)'}
                  </span>
                  <span className="text-[11px] text-slate-400 mt-1">
                    Auto-kerf compensation for project enclosures & front plates
                  </span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Raw Material Sheet</label>
                  <select
                    value={laserMaterial}
                    onChange={(e) => setLaserMaterial(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold"
                  >
                    <option value="Cast Acrylic (Translucent)">Cast Acrylic (Translucent / Clear)</option>
                    <option value="Cast Acrylic (Glossy Black)">Cast Acrylic (Glossy Jet Black)</option>
                    <option value="MDF Wood Sheet">MDF Engineered Wood</option>
                    <option value="POM / Delrin Engineering Sheet">Delrin / POM Low-Friction</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Sheet Thickness</label>
                  <select
                    value={laserThickness}
                    onChange={(e) => setLaserThickness(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold"
                  >
                    <option value="2.0mm">2.0 mm Standard</option>
                    <option value="3.0mm">3.0 mm Robust</option>
                    <option value="5.0mm">5.0 mm Heavy Duty</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* CUSTOM BATTERY PACKS */}
          {activeTab === 'battery-pack' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                  <BatteryCharging className="w-4 h-4 text-[#561269]" />
                  <span>Custom Li-ion Battery Pack Configuration</span>
                </h3>
                <span className="text-xs text-slate-500 font-mono">Spot Welded Pure Nickel Strip</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Battery Cells Used</label>
                  <select
                    value={cellType}
                    onChange={(e) => setCellType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold"
                  >
                    <option value="Samsung 25R 18650 (High Drain)">Samsung 25R 18650 (2500mAh 20A)</option>
                    <option value="Molicel P42A 21700">Molicel P42A 21700 (4200mAh 45A)</option>
                    <option value="Panasonic NCR18650B">Panasonic NCR18650B (3400mAh High Capacity)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Series / Parallel Configuration</label>
                  <select
                    value={packConfig}
                    onChange={(e) => setPackConfig(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold"
                  >
                    <option value="3S 2P (11.1V, 5000mAh)">3S 2P (11.1V / 12.6V Max, 5000mAh)</option>
                    <option value="4S 2P (14.8V, 5000mAh)">4S 2P (14.8V / 16.8V Max, 5000mAh)</option>
                    <option value="6S 2P (22.2V, 5000mAh)">6S 2P (22.2V / 25.2V Max, 5000mAh)</option>
                    <option value="4S 4P (14.8V, 10000mAh)">4S 4P (14.8V, 10000mAh Heavy)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Integrated Protection BMS</label>
                  <select
                    value={bmsChoice}
                    onChange={(e) => setBmsChoice(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold"
                  >
                    <option value="40A Continuous Balance BMS">40A Continuous Balance BMS (Over-charge / short protect)</option>
                    <option value="60A High Current BMS">60A Peak High Current BMS</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Power Connector Plug</label>
                  <select
                    value={plugType}
                    onChange={(e) => setPlugType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold"
                  >
                    <option value="XT60 Female (14AWG)">XT60 Amass (14AWG Silicone Wire)</option>
                    <option value="XT90 Anti-Spark (12AWG)">XT90 Anti-Spark (12AWG Silicone Wire)</option>
                    <option value="T-Plug Dean (14AWG)">T-Plug Deans</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Instant Live Quote Summary Box */}
        <div className="lg:col-span-4 bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <h4 className="font-extrabold text-sm text-[#561269] uppercase tracking-wider">
              Instant Quote Breakdown
            </h4>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
              Live Calculation
            </span>
          </div>

          {activeTab === 'pcb' && (
            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Service Type:</span>
                <span className="font-bold text-slate-900">Custom PCB Manufacturing</span>
              </div>
              <div className="flex justify-between">
                <span>Layers & Dimensions:</span>
                <span className="font-mono text-slate-900">{pcbLayers} Layers ({pcbWidth}×{pcbHeight}mm)</span>
              </div>
              <div className="flex justify-between">
                <span>Finish & Color:</span>
                <span className="text-slate-900">{pcbFinish} • {pcbColor}</span>
              </div>
              <div className="flex justify-between">
                <span>Batch Quantity:</span>
                <span className="font-bold text-slate-900 font-mono">{pcbQty} boards</span>
              </div>
              <div className="flex justify-between">
                <span>Turnaround Time:</span>
                <span className="text-emerald-700 font-bold">4 - 6 Business Days</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-slate-900 pt-3 border-t border-slate-200">
                <span>Total Quote:</span>
                <span className="font-mono text-2xl text-[#561269]">
                  ₹{calculatePcbQuote().toLocaleString('en-IN')}
                </span>
              </div>
              <button
                onClick={() => handleOrderService(`PCB Fabrication (${pcbLayers}-Layer, ${pcbQty}pcs)`, calculatePcbQuote())}
                className="w-full bg-[#FF6B00] hover:bg-orange-600 text-white font-extrabold text-xs py-3.5 rounded-xl shadow-lg shadow-orange-950/20 flex items-center justify-center gap-2 mt-4 cursor-pointer"
              >
                <span>Add PCB Order to Prototyping Cart</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {activeTab === '3d-print' && (
            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Service Type:</span>
                <span className="font-bold text-slate-900">3D Rapid Prototyping</span>
              </div>
              <div className="flex justify-between">
                <span>Material:</span>
                <span className="text-slate-900">{printMaterial}</span>
              </div>
              <div className="flex justify-between">
                <span>Infill & Weight:</span>
                <span className="font-mono text-slate-900">{printInfill}% infill ({printWeightGrams}g)</span>
              </div>
              <div className="flex justify-between">
                <span>Turnaround Time:</span>
                <span className="text-emerald-700 font-bold">24 - 48 Hours Dispatch</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-slate-900 pt-3 border-t border-slate-200">
                <span>Total Quote:</span>
                <span className="font-mono text-2xl text-[#561269]">
                  ₹{calculate3DQuote().toLocaleString('en-IN')}
                </span>
              </div>
              <button
                onClick={() => handleOrderService(`3D Print (${printMaterial}, ${printWeightGrams}g)`, calculate3DQuote())}
                className="w-full bg-[#FF6B00] hover:bg-orange-600 text-white font-extrabold text-xs py-3.5 rounded-xl shadow-lg shadow-orange-950/20 flex items-center justify-center gap-2 mt-4 cursor-pointer"
              >
                <span>Add 3D Print Job to Cart</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {activeTab === 'laser-cutting' && (
            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Service Type:</span>
                <span className="font-bold text-slate-900">Laser Cut Acrylic & Panels</span>
              </div>
              <div className="flex justify-between">
                <span>Material & Sheet:</span>
                <span className="text-slate-900">{laserMaterial} ({laserThickness})</span>
              </div>
              <div className="flex justify-between">
                <span>Turnaround Time:</span>
                <span className="text-emerald-700 font-bold">2 Business Days</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-slate-900 pt-3 border-t border-slate-200">
                <span>Total Quote:</span>
                <span className="font-mono text-2xl text-[#561269]">
                  ₹{calculateLaserQuote().toLocaleString('en-IN')}
                </span>
              </div>
              <button
                onClick={() => handleOrderService(`Laser Cut Panel (${laserMaterial})`, calculateLaserQuote())}
                className="w-full bg-[#FF6B00] hover:bg-orange-600 text-white font-extrabold text-xs py-3.5 rounded-xl shadow-lg shadow-orange-950/20 flex items-center justify-center gap-2 mt-4 cursor-pointer"
              >
                <span>Add Laser Cut Job to Cart</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {activeTab === 'battery-pack' && (
            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Service Type:</span>
                <span className="font-bold text-slate-900">Custom Battery Pack</span>
              </div>
              <div className="flex justify-between">
                <span>Configuration:</span>
                <span className="font-mono text-slate-900 font-bold">{packConfig}</span>
              </div>
              <div className="flex justify-between">
                <span>Cells & BMS:</span>
                <span className="text-slate-900 truncate max-w-[180px]">{cellType}</span>
              </div>
              <div className="flex justify-between">
                <span>Lead Time:</span>
                <span className="text-emerald-700 font-bold">3 Business Days (Tested & Cycled)</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-slate-900 pt-3 border-t border-slate-200">
                <span>Total Quote:</span>
                <span className="font-mono text-2xl text-[#561269]">
                  ₹{calculateBatteryQuote().toLocaleString('en-IN')}
                </span>
              </div>
              <button
                onClick={() => handleOrderService(`Custom Battery Pack (${packConfig})`, calculateBatteryQuote())}
                className="w-full bg-[#FF6B00] hover:bg-orange-600 text-white font-extrabold text-xs py-3.5 rounded-xl shadow-lg shadow-orange-950/20 flex items-center justify-center gap-2 mt-4 cursor-pointer"
              >
                <span>Add Battery Pack to Cart</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Industrial testing & optical QA inspection included.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
