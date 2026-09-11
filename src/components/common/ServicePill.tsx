import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { CustomService } from '../../types';
import { Layers, Box, Zap, BatteryCharging, ArrowRight, Clock } from 'lucide-react';

interface ServicePillProps {
  service: CustomService;
}

export const ServicePill: React.FC<ServicePillProps> = ({ service }) => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'Layers': return <Layers className="w-5 h-5 text-cyan-600" />;
      case 'Box': return <Box className="w-5 h-5 text-purple-600" />;
      case 'Zap': return <Zap className="w-5 h-5 text-emerald-600" />;
      case 'BatteryCharging': return <BatteryCharging className="w-5 h-5 text-amber-600" />;
      default: return <Layers className="w-5 h-5 text-[#561269]" />;
    }
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      <Link
        to={`/services?tab=${service.id}`}
        id={`service-pill-${service.id}`}
        className={`group p-3.5 sm:p-4 rounded-xl border ${service.bgColor} ${service.borderColor} transition-all duration-200 hover:shadow-md flex flex-col justify-between block`}
      >
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-white shadow-xs flex items-center justify-center shrink-0 border border-slate-200/50">
              {getIcon(service.iconName)}
            </div>
            <div>
              <h4 className={`text-xs sm:text-sm font-bold ${service.textColor} group-hover:underline`}>
                {service.title}
              </h4>
              <span className="text-[10px] text-slate-500 font-semibold block line-clamp-1">
                {service.tagline}
              </span>
            </div>
          </div>

          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/80 border border-slate-200/60 text-slate-700 shrink-0">
            {service.basePrice}
          </span>
        </div>

        <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-200/40 text-slate-600">
          <div className="flex items-center gap-1 font-medium">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>{service.turnaround}</span>
          </div>
          <span className="font-bold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform text-[#561269]">
            Instant Quote <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
};
