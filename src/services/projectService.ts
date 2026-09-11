import { 
  CustomProjectSubmission, 
  CustomProjectCategory, 
  CustomProjectQuantity, 
  CustomProjectBudget, 
  CustomProjectTimeline,
  CustomProjectStatus,
  AttachedFile,
  AdminProjectNotification
} from '../types';

export interface CustomProjectInquiryPayload {
  projectName: string;
  category: CustomProjectCategory;
  quantity: CustomProjectQuantity | string;
  timeline: CustomProjectTimeline | string;
  budgetRange: CustomProjectBudget | string;
  description: string;
  preferredComponents?: string;
  attachedFiles: AttachedFile[];
  
  // Client info
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  companyName: string;
  gstin?: string;
}

export const INITIAL_CUSTOM_PROJECTS: CustomProjectSubmission[] = [
  {
    id: 'PRJ-2026-7841',
    projectName: 'Smart Industrial Multi-Gas Sensing Edge Node',
    category: 'Embedded Systems & IoT',
    quantity: 'Pilot Run (10-50 units)',
    timeline: 'Standard (3-4 weeks)',
    budgetRange: '₹50,000 – ₹2,00,000',
    description: 'Battery-powered LoRaWAN and BLE sensor gateway measuring CO2, VOCs, particulate matter (PM2.5), ambient temperature and humidity for chemical plant safety automation. Requires rugged IP67 enclosure and ultra-low sleep current (<15uA).',
    preferredComponents: 'STM32WB55 / ESP32-S3, Sensirion SCD41, SHT40, Semtech SX1262 LoRa module',
    attachedFiles: [
      {
        id: 'file-1',
        name: 'Gas_Sensor_Block_Diagram_v1.2.pdf',
        size: 1420000,
        type: 'application/pdf',
        uploadedAt: '2026-08-28'
      },
      {
        id: 'file-2',
        name: 'Preliminary_BOM_List.xlsx',
        size: 85000,
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        uploadedAt: '2026-08-28'
      }
    ],
    clientName: 'Dr. Arindam Bose',
    clientEmail: 'arindam.bose@chemtronics-india.com',
    clientPhone: '+91 98310 44521',
    companyName: 'Chemtronics Process Automation Ltd',
    gstin: '27AABCC1234F1Z8',
    status: 'Pending Review',
    createdAt: '2026-08-28 11:30 AM',
    updatedAt: '2026-08-28 11:30 AM',
    adminNotes: 'High priority customer. Evaluated BOM components available in Pune warehouse.',
    replies: []
  },
  {
    id: 'PRJ-2026-8290',
    projectName: '4-Layer High-Density BLDC Motor FOC Inverter',
    category: 'PCB Design & Prototyping',
    quantity: 'Prototype (1-5 units)',
    timeline: 'Urgent (< 2 weeks)',
    budgetRange: '₹50,000 – ₹2,00,000',
    description: 'Custom 4-layer FR4 PCB with 2oz outer copper thickness for 48V / 30A continuous Field Oriented Control motor driver. Includes inline current shunt amplifiers, gate drivers with bootstrap diodes, and CAN-FD communication transceiver.',
    preferredComponents: 'DRV8305 gate driver, INA240 current sense, STM32G474 high-resolution timer MCU',
    attachedFiles: [
      {
        id: 'file-3',
        name: 'BLDC_Inverter_Schematic_KiCAD.zip',
        size: 3840000,
        type: 'application/zip',
        uploadedAt: '2026-08-26'
      }
    ],
    clientName: 'Pooja Kulkarni',
    clientEmail: 'pooja.k@aerodynamic-tech.in',
    clientPhone: '+91 99224 81092',
    companyName: 'AeroDynamic eVTOL Labs',
    gstin: '27AALCP9012K1ZY',
    status: 'In Discussion',
    createdAt: '2026-08-26 03:15 PM',
    updatedAt: '2026-08-27 10:00 AM',
    adminNotes: 'Discussing thermal dissipation vias and copper pour spacing with client.',
    quoteAmount: '₹88,500 (Including PCB fab + 5x assembled prototypes)',
    replies: [
      {
        id: 'rep-1',
        sender: 'admin',
        senderName: 'SEMIX LABS Engineering Admin',
        message: 'Hello Pooja, we reviewed your KiCAD schematic. We recommend upgrading the shunt resistors to 3W metal alloy for 30A thermal margin. Our initial quote for quick-turn 5 boards is ₹88,500 + GST.',
        quotedAmount: '₹88,500',
        timestamp: '2026-08-27 10:00 AM'
      }
    ]
  },
  {
    id: 'PRJ-2026-6102',
    projectName: 'Autonomous Agricultural Weeding Rover Controller',
    category: 'Robotics & Automation',
    quantity: 'Batch Production (50-200 units)',
    timeline: 'Extended (2-3 months)',
    budgetRange: '₹2,00,000 – ₹10,00,000',
    description: 'Turnkey fabrication and assembly of main robotics control carrier board. Integrates RTK-GNSS centimeter positioning module, dual differential drive quadrature encoders, 4x ultrasonic distance sensors, and emergency stop relay circuit.',
    preferredComponents: 'Raspberry Pi Compute Module 4, u-blox ZED-F9P RTK, BTS7960 H-Bridge',
    attachedFiles: [
      {
        id: 'file-4',
        name: 'Agricultural_Rover_PRD_v2.pdf',
        size: 2150000,
        type: 'application/pdf',
        uploadedAt: '2026-08-22'
      }
    ],
    clientName: 'Suresh Patel',
    clientEmail: 'suresh@krishirobotics.org',
    clientPhone: '+91 97123 55890',
    companyName: 'KrishiRobotics Agri Innovations',
    status: 'Quoted',
    createdAt: '2026-08-22 09:45 AM',
    updatedAt: '2026-08-24 04:30 PM',
    adminNotes: 'Formal quote approved for 75 units initial run with 6-week turnaround.',
    quoteAmount: '₹3,40,000 + GST for 75 fully assembled units',
    replies: [
      {
        id: 'rep-2',
        sender: 'admin',
        senderName: 'SEMIX LABS Engineering Admin',
        message: 'Dear Suresh, we have issued the formal quote: ₹3,40,000 for 75 assembled units with complete functional burn-in test. Sourcing CM4 carrier silicon is pre-allocated.',
        quotedAmount: '₹3,40,000 + GST',
        timestamp: '2026-08-24 04:30 PM'
      }
    ]
  }
];

export const INITIAL_ADMIN_NOTIFICATIONS: AdminProjectNotification[] = [
  {
    id: 'notif-1',
    projectId: 'PRJ-2026-7841',
    projectTitle: 'Smart Industrial Multi-Gas Sensing Edge Node',
    clientName: 'Dr. Arindam Bose',
    timestamp: '2026-08-28 11:30 AM',
    read: false,
    message: 'New custom IoT project enquiry awaiting specification review and BOM pricing.'
  }
];

/**
 * Mock API service simulating POST /api/projects/custom-inquiry
 * Handles schema validation, automatic admin notification dispatch, and persistence.
 */
export async function submitCustomProjectInquiry(
  payload: CustomProjectInquiryPayload
): Promise<CustomProjectSubmission> {
  // Validate schema
  if (!payload.projectName?.trim()) {
    throw new Error('Project Name is required');
  }
  if (!payload.clientName?.trim() || !payload.clientEmail?.trim()) {
    throw new Error('Client Name and Email are required');
  }
  if (!payload.description?.trim()) {
    throw new Error('Project Description & Scope of Work are required');
  }

  // Simulate network latency (250ms)
  await new Promise((resolve) => setTimeout(resolve, 250));

  const randomId = Math.floor(1000 + Math.random() * 9000);
  const now = new Date();
  const dateStr = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

  const newSubmission: CustomProjectSubmission = {
    id: `PRJ-2026-${randomId}`,
    projectName: payload.projectName.trim(),
    category: payload.category,
    quantity: payload.quantity,
    timeline: payload.timeline,
    budgetRange: payload.budgetRange,
    description: payload.description.trim(),
    preferredComponents: payload.preferredComponents?.trim() || undefined,
    attachedFiles: payload.attachedFiles || [],
    clientName: payload.clientName.trim(),
    clientEmail: payload.clientEmail.trim(),
    clientPhone: payload.clientPhone.trim(),
    companyName: payload.companyName.trim(),
    gstin: payload.gstin?.trim() || undefined,
    status: 'Pending Review',
    createdAt: dateStr,
    updatedAt: dateStr,
    replies: []
  };

  // Dispatch simulated automated notification to Admin (console log + storage sync)
  console.log('[API POST /api/projects/custom-inquiry] Successfully received payload:', {
    submissionId: newSubmission.id,
    project: newSubmission.projectName,
    client: `${newSubmission.clientName} (${newSubmission.companyName})`,
    budget: newSubmission.budgetRange,
    category: newSubmission.category,
    timestamp: newSubmission.createdAt
  });

  return newSubmission;
}
