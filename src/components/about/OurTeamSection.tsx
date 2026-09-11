import React from 'react';
import { motion } from 'motion/react';
import { 
  Linkedin, 
  Mail, 
  Crown, 
  Code2, 
  Briefcase, 
  Headphones, 
  Sparkles, 
  Github,
  Users
} from 'lucide-react';

export interface TeamMember {
  id: string;
  name: string;
  role?: string;
  position: string;
  department: string;
  description: string;
  initials: string;
  image?: string;
  isCeo?: boolean;
  avatarBg: string;
  avatarRing: string;
  badgeBg: string;
  badgeTextColor: string;
  icon: React.ComponentType<{ className?: string }>;
  socialLinks: {
    linkedin?: string;
    email?: string;
    github?: string;
  };
}

export const leadershipTeam: TeamMember[] = [
  {
    id: 'ritesh-shinde',
    name: 'Ritesh Shinde',
    position: 'CEO',
    department: 'Executive Leadership',
    description: "Founder and Chief Executive Officer, responsible for the company's overall vision, strategy, leadership, and growth.",
    initials: 'RS',
    isCeo: true,
    avatarBg: 'bg-gradient-to-br from-[#561269] via-[#6d1a84] to-[#FF6B00]',
    avatarRing: 'ring-2 ring-purple-300 ring-offset-2 ring-offset-white',
    badgeBg: 'bg-purple-100/80 border-purple-200',
    badgeTextColor: 'text-[#561269]',
    icon: Crown,
    socialLinks: {
      linkedin: 'https://linkedin.com/in/ritesh-shinde-semix',
      email: 'ritesh@semixlabs.com',
    }
  },
  {
    id: 'aryan-gandhale',
    name: 'Aryan Gandhale',
    position: 'Tech Head',
    department: 'Technology & Architecture',
    description: 'Leads the technology and product development, responsible for technical architecture, innovation, software development, and implementation.',
    initials: 'AG',
    isCeo: false,
    avatarBg: 'bg-gradient-to-br from-[#561269] via-[#400d4f] to-indigo-700',
    avatarRing: 'ring-2 ring-indigo-200 ring-offset-2 ring-offset-white',
    badgeBg: 'bg-indigo-50 border-indigo-200',
    badgeTextColor: 'text-indigo-700',
    icon: Code2,
    socialLinks: {
      linkedin: 'https://linkedin.com/in/aryan-gandhale',
      email: 'aryangandhale27@gmail.com',
      github: 'https://github.com/aryangandhale27',
    }
  },
  {
    id: 'ritish-duggal',
    name: 'Ritish Duggal',
    position: 'Business Operations',
    department: 'Operations & Strategy',
    description: 'Manages business operations, coordination, processes, partnerships, and day-to-day operational activities.',
    initials: 'RD',
    isCeo: false,
    avatarBg: 'bg-gradient-to-br from-[#380847] via-teal-700 to-emerald-600',
    avatarRing: 'ring-2 ring-emerald-200 ring-offset-2 ring-offset-white',
    badgeBg: 'bg-emerald-50 border-emerald-200',
    badgeTextColor: 'text-emerald-800',
    icon: Briefcase,
    socialLinks: {
      linkedin: 'https://linkedin.com/in/ritish-duggal',
      email: 'operations@semixlabs.com',
    }
  },
  {
    id: 'raj-sharma',
    name: 'Raj Sharma',
    position: 'Customer Support',
    department: 'Customer Experience & Success',
    description: 'Handles customer support and ensures a smooth customer experience by addressing queries, providing assistance, and resolving customer concerns.',
    initials: 'RS',
    isCeo: false,
    avatarBg: 'bg-gradient-to-br from-[#561269] via-amber-600 to-[#FF6B00]',
    avatarRing: 'ring-2 ring-orange-200 ring-offset-2 ring-offset-white',
    badgeBg: 'bg-orange-50 border-orange-200',
    badgeTextColor: 'text-[#FF6B00]',
    icon: Headphones,
    socialLinks: {
      linkedin: 'https://linkedin.com/in/raj-sharma-support',
      email: 'support@semixlabs.com',
    }
  },
];

export const OurTeamSection: React.FC = () => {
  return (
    <div id="meet-our-team" className="space-y-8 scroll-mt-24 pt-4">
      {/* Section Heading & Subtitle */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-purple-50 text-[#561269] border border-purple-200/80 text-xs font-bold uppercase tracking-wider">
          <Users className="w-3.5 h-3.5 text-[#561269]" />
          <span>Leadership &amp; Core Team</span>
        </div>
        
        <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
          Meet Our Team
        </h3>
        
        <p className="text-xs sm:text-sm sm:leading-relaxed text-slate-600 max-w-2xl mx-auto">
          The people behind our vision, technology, operations, and customer experience.
        </p>
      </div>

      {/* 4-Column Layout (1 col mobile, 2 col tablet, 4 col desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {leadershipTeam.map((member, index) => {
          const IconComponent = member.icon;
          
          return (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.08 }}
              className={`rounded-2xl p-6 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative group border ${
                member.isCeo
                  ? 'bg-gradient-to-b from-purple-50/40 via-white to-white border-purple-200/90 hover:border-[#561269]/70 ring-1 ring-[#561269]/10'
                  : 'bg-white border-slate-200 hover:border-[#561269]/40'
              } hover:-translate-y-1.5`}
            >
              {/* Optional Subtle CEO Distinction Pill */}
              {member.isCeo && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#561269] to-[#8a1e8a] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-0.5 rounded-full shadow-xs flex items-center gap-1 border border-purple-300/40 whitespace-nowrap">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  <span>Founder &amp; Vision</span>
                </div>
              )}

              {/* Card Top Section: Avatar & Badges */}
              <div className="space-y-4 text-center">
                {/* Profile Image / Avatar Area */}
                <div className="relative inline-block mx-auto pt-1">
                  <div
                    className={`w-24 h-24 sm:w-28 sm:h-28 rounded-2xl ${member.avatarBg} ${member.avatarRing} shadow-md flex items-center justify-center text-white relative transition-transform duration-300 group-hover:scale-105 overflow-hidden`}
                  >
                    {member.image ? (
                      <img
                        src={member.image}
                        alt={member.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover rounded-2xl"
                      />
                    ) : (
                      <>
                        {/* Subtle Circuit Overlay Lines */}
                        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:10px_10px]" />
                        
                        {/* Monogram Initials */}
                        <span className="text-2xl sm:text-3xl font-black tracking-tight drop-shadow-sm font-mono select-none">
                          {member.initials}
                        </span>
                      </>
                    )}

                    {/* Role Icon Mini Badge */}
                    <div className="absolute bottom-1.5 right-1.5 w-6 h-6 rounded-lg bg-white/90 backdrop-blur-xs text-slate-800 flex items-center justify-center shadow-xs">
                      <IconComponent className={`w-3.5 h-3.5 ${member.isCeo ? 'text-[#561269]' : 'text-slate-700'}`} />
                    </div>
                  </div>
                </div>

                {/* Name & Position */}
                <div className="space-y-1">
                  <h4 className="text-lg font-black text-slate-900 tracking-tight group-hover:text-[#561269] transition-colors">
                    {member.name}
                  </h4>
                  
                  {/* Position clearly displayed directly below name */}
                  <div className="flex items-center justify-center gap-1.5">
                    <span className="text-sm font-bold text-[#FF6B00]">
                      {member.position}
                    </span>
                  </div>

                  {/* Department Pill */}
                  <div className="pt-0.5">
                    <span className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${member.badgeBg} ${member.badgeTextColor}`}>
                      {member.department}
                    </span>
                  </div>
                </div>

                {/* Short, Professional Description */}
                <p className="text-xs text-slate-600 leading-relaxed text-left pt-1 min-h-[4.5rem]">
                  {member.description}
                </p>
              </div>

              {/* Card Footer: Social & Contact Links */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-400">
                  Connect
                </span>
                
                <div className="flex items-center gap-1.5">
                  {member.socialLinks.linkedin && (
                    <a
                      href={member.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`${member.name} on LinkedIn`}
                      className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-[#0A66C2] hover:text-white text-slate-600 flex items-center justify-center transition-all cursor-pointer"
                    >
                      <Linkedin className="w-3.5 h-3.5" />
                    </a>
                  )}

                  {member.socialLinks.email && (
                    <a
                      href={`mailto:${member.socialLinks.email}`}
                      title={`Email ${member.name}`}
                      className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-[#561269] hover:text-white text-slate-600 flex items-center justify-center transition-all cursor-pointer"
                    >
                      <Mail className="w-3.5 h-3.5" />
                    </a>
                  )}

                  {member.socialLinks.github && (
                    <a
                      href={member.socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`${member.name} on GitHub`}
                      className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-600 flex items-center justify-center transition-all cursor-pointer"
                    >
                      <Github className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
