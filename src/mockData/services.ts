import { CustomService } from '../types';

export const CUSTOM_SERVICES: CustomService[] = [
  {
    id: 'pcb-manufacturing',
    title: 'PCB Manufacturing',
    tagline: '2 to 8 Layer High Density Interconnect',
    description: 'FR-4 industrial Grade A substrate, HASL/ENIG gold finish, impedance control, solder mask colors (Green, Matte Black, Blue, Red, White, Purple).',
    turnaround: '24-48 Hours Fast Dispatch',
    basePrice: '₹120 / 5 pcs',
    bgColor: 'bg-cyan-50 hover:bg-cyan-100/70',
    borderColor: 'border-cyan-200',
    textColor: 'text-cyan-900',
    iconName: 'Layers',
    features: ['Gerber Instant Viewer', 'Free DFM Check', 'SMD Stencil Bundles', '100% AOI Tested']
  },
  {
    id: '3d-printing',
    title: '3D Printing Prototyping',
    tagline: 'FDM, SLA Resin & SLS Nylon Fabrication',
    description: 'Rapid additive prototyping with PLA+, Tough PETG, Carbon Fiber, and optical clear resin with up to 20 micron layer resolution.',
    turnaround: 'Same-day Production',
    basePrice: '₹3 / gram',
    bgColor: 'bg-purple-50 hover:bg-purple-100/70',
    borderColor: 'border-purple-200',
    textColor: 'text-purple-900',
    iconName: 'Box',
    features: ['Instant STL/STEP Quote', 'Tolerance ±0.1mm', 'Metal Insert Heat Staking', 'Vapor Smoothing']
  },
  {
    id: 'laser-cutting',
    title: 'Laser Cutting & Enclosures',
    tagline: 'Acrylic, Wood & Aluminum Panels',
    description: 'Custom maker enclosures, faceplates, robot chassis, and mechanical spacers cut with high-precision CO2 and fiber laser cutters.',
    turnaround: '24 Hours Dispatch',
    basePrice: '₹2 / cm²',
    bgColor: 'bg-emerald-50 hover:bg-emerald-100/70',
    borderColor: 'border-emerald-200',
    textColor: 'text-emerald-900',
    iconName: 'Zap',
    features: ['DXF/SVG Direct Upload', 'Engraved Labels & Pinouts', 'Snap-fit Joint Design', '1mm - 10mm Thickness']
  },
  {
    id: 'custom-battery-packs',
    title: 'Custom Battery Packs',
    tagline: 'Spot Welded 18650 & 21700 Lithium Packs',
    description: 'Custom voltage and capacity lithium-ion packs (1S to 14S) welded with 99.6% pure nickel strips, active smart BMS, and heat-shrink wrap.',
    turnaround: '48 Hours Build & Test',
    basePrice: 'From ₹850',
    bgColor: 'bg-amber-50 hover:bg-amber-100/70',
    borderColor: 'border-amber-200',
    textColor: 'text-amber-900',
    iconName: 'BatteryCharging',
    features: ['Automated Spot Welding', 'Smart BMS with Temp Sensor', 'Cycle Capacity Tested', 'Custom JST/XT60 Harness']
  }
];
