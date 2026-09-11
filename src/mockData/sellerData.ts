import { RecurringOrder, SellerProfile, SellerNotification, AvailableSeller } from '../types';

export const AVAILABLE_SELLERS: AvailableSeller[] = [
  {
    id: 'usr-seller-01',
    name: 'Vikram Patel',
    email: 'seller@semixlabs.com',
    phone: '+91 98111 22334',
    warehouseHub: 'SEMIX LABS Hub Alpha, Outer Ring Road, Bengaluru',
    gstin: '29ABCDE1234F1Z5',
    rating: 4.92,
    bonusAmount: 5000,
    bonusUpdatedAt: '2026-09-01T10:00:00.000Z',
    bonusUpdatedBy: 'Admin Controller',
  },
  {
    id: 'usr-seller-02',
    name: 'Priya Sharma (ElectroComponents Hub)',
    email: 'priya.sharma@semixlabs.com',
    phone: '+91 98220 33445',
    warehouseHub: 'West Zone Hub, Pune Solapur Road, Pune',
    gstin: '27AABCS1429B1Z8',
    rating: 4.88,
    bonusAmount: 2500,
    bonusUpdatedAt: '2026-09-02T14:30:00.000Z',
    bonusUpdatedBy: 'Admin Controller',
  },
  {
    id: 'usr-seller-03',
    name: 'Rajesh Nair (MicroSilicon Express)',
    email: 'rajesh.nair@semixlabs.com',
    phone: '+91 94455 66778',
    warehouseHub: 'South Central Hub, Hitec City, Hyderabad',
    gstin: '36AAACE9876C1Z4',
    rating: 4.95,
    bonusAmount: 10000,
    bonusUpdatedAt: '2026-09-05T09:15:00.000Z',
    bonusUpdatedBy: 'Admin Controller',
  },
  {
    id: 'usr-seller-04',
    name: 'Ananya Desai (Silicon Valley Hub)',
    email: 'ananya.desai@semixlabs.com',
    phone: '+91 97230 44556',
    warehouseHub: 'North-West Hub, SG Highway, Ahmedabad',
    gstin: '24AACCD5543D1Z2',
    rating: 4.90,
    bonusAmount: 7500,
    bonusUpdatedAt: '2026-09-08T11:45:00.000Z',
    bonusUpdatedBy: 'Admin Controller',
  },
];

export const INITIAL_SELLER_PROFILE: SellerProfile = {
  name: 'Vikram Patel',
  role: 'Seller / Fulfilment Staff',
  email: 'seller@semixlabs.com',
  phone: '+91 98111 22334',
  warehouseHub: 'SEMIX LABS Hub Alpha, Tech Corridor, Outer Ring Road, Bengaluru',
  gstin: '29ABCDE1234F1Z5',
  preferredCourier: 'BlueDart Express',
  notifyOnNewOrder: true,
  notifyOnLowStock: true,
  performanceRating: 4.92,
  onTimeDispatchRate: 98.4,
  totalPackedThisWeek: 148,
};

export const INITIAL_RECURRING_ORDERS: RecurringOrder[] = [
  {
    id: 'REC-9012',
    subscriberName: 'Dr. Alok Sen & Team',
    organization: 'MakerLab IoT Innovation Hub, IIT Delhi',
    frequency: 'bi-weekly',
    nextScheduledDate: '2026-09-06',
    category: 'Development Boards & Modules',
    priority: 'critical',
    status: 'active',
    totalAmount: 18450,
    locationBin: 'BIN-A2-04',
    autoPackDaysBefore: 1,
    items: [
      {
        productId: 'prod-002',
        name: 'ESP32-WROOM-32D Dual-Core Dev Board',
        sku: 'ESP-32-WROOM-32D',
        price: 245,
        quantity: 25,
        image: 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=300&q=80',
      },
      {
        productId: 'prod-004',
        name: 'MPU-6050 3-Axis Gyroscope + Accelerometer',
        sku: 'SEN-MPU-6050-6DOF',
        price: 165,
        quantity: 20,
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=300&q=80',
      },
      {
        productId: 'prod-008',
        name: '830-Point Solderless Breadboard MB-102',
        sku: 'PRT-BB-830P-MB102',
        price: 115,
        quantity: 15,
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=300&q=80',
      },
    ],
  },
  {
    id: 'REC-9015',
    subscriberName: 'Captain Rohan Iyer',
    organization: 'Skylark Aerial Drone Prototyping Consortium',
    frequency: 'weekly',
    nextScheduledDate: '2026-09-04',
    category: 'Batteries & Drone Power',
    priority: 'high',
    status: 'preparing',
    totalAmount: 34200,
    locationBin: 'BIN-B1-09',
    autoPackDaysBefore: 2,
    items: [
      {
        productId: 'prod-010',
        name: 'Orange 3S 11.1V 2200mAh 30C LiPo Battery Pack',
        sku: 'BAT-LIPO-3S-2200-30C',
        price: 1450,
        quantity: 12,
        image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=300&q=80',
      },
      {
        productId: 'prod-012',
        name: 'TP4056 1A Li-Ion Battery Charger Module',
        sku: 'PWR-TP4056-USBC-PROT',
        price: 32,
        quantity: 30,
        image: 'https://images.unsplash.com/photo-1619725002198-6a689b72f41d?auto=format&fit=crop&w=300&q=80',
      },
    ],
  },
  {
    id: 'REC-9018',
    subscriberName: 'Prof. Meenakshi Sundaram',
    organization: 'Smart Agri Sensing Lab, PAU Ludhiana',
    frequency: 'monthly',
    nextScheduledDate: '2026-09-12',
    category: 'Sensors & Wireless Modules',
    priority: 'medium',
    status: 'active',
    totalAmount: 12850,
    locationBin: 'BIN-C3-11',
    autoPackDaysBefore: 3,
    items: [
      {
        productId: 'prod-005',
        name: 'DHT22 Digital Temperature & Humidity Sensor',
        sku: 'SEN-DHT-22-AM2302',
        price: 285,
        quantity: 30,
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=300&q=80',
      },
      {
        productId: 'prod-007',
        name: '0.96 inch I2C OLED Display Module (128x64 Blue)',
        sku: 'DSP-OLED-096-I2C-BL',
        price: 195,
        quantity: 15,
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=300&q=80',
      },
    ],
  },
  {
    id: 'REC-9022',
    subscriberName: 'Vikramaditya Sharma',
    organization: 'Vidyashilp Robotics STEM Guild',
    frequency: 'monthly',
    nextScheduledDate: '2026-09-20',
    category: 'Robotics, Motors & Drivers',
    priority: 'medium',
    status: 'active',
    totalAmount: 9600,
    locationBin: 'BIN-D1-05',
    autoPackDaysBefore: 2,
    items: [
      {
        productId: 'prod-003',
        name: 'SG90 9g Micro Servo Motor 180°',
        sku: 'MTR-SG90-9G-MICRO',
        price: 95,
        quantity: 40,
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=300&q=80',
      },
      {
        productId: 'prod-006',
        name: 'L298N Dual H-Bridge Motor Driver Module',
        sku: 'DRV-L298N-DUAL-H',
        price: 135,
        quantity: 20,
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=300&q=80',
      },
    ],
  },
];

export const INITIAL_SELLER_NOTIFICATIONS: SellerNotification[] = [
  {
    id: 'notif-01',
    title: 'New Packing Assignment: ORD-89216',
    message: 'Same-day dispatch priority. 3 line items for Rohan Deshmukh (Gurugram).',
    timestamp: '10 mins ago',
    type: 'order',
    isRead: false,
    orderId: 'ORD-89216',
    priority: 'urgent',
  },
  {
    id: 'notif-02',
    title: 'Courier Pickup Vehicle Approaching',
    message: 'BlueDart Express van scheduled at Loading Bay 2 in 35 minutes.',
    timestamp: '28 mins ago',
    type: 'courier',
    isRead: false,
    priority: 'urgent',
  },
  {
    id: 'notif-03',
    title: 'Recurring Batch Ready for Packing',
    message: 'REC-9015 (Skylark Drone Consortium) reaches pack window for tomorrow.',
    timestamp: '1 hour ago',
    type: 'subscription',
    isRead: true,
  },
  {
    id: 'notif-04',
    title: 'Low Stock Alert for Warehouse Bin',
    message: 'ESP32-WROOM-32D count reached 14 units at BIN-A1-03.',
    timestamp: '3 hours ago',
    type: 'inventory',
    isRead: true,
  },
];

export interface PayoutRecord {
  id: string;
  orderId: string;
  date: string;
  itemsSummary: string;
  grossAmount: number;
  commissionFee: number;
  netPayout: number;
  payoutStatus: 'Paid' | 'In Escrow' | 'Processing';
  courier: string;
}

export const INITIAL_PAYOUT_HISTORY: PayoutRecord[] = [
  {
    id: 'PAY-8812',
    orderId: 'ORD-89214',
    date: '2026-08-28',
    itemsSummary: 'Raspberry Pi 5, MPU-6050, TP4056 (3 SKUs)',
    grossAmount: 8740,
    commissionFee: 262.20,
    netPayout: 8477.80,
    payoutStatus: 'Paid',
    courier: 'BlueDart Express',
  },
  {
    id: 'PAY-8811',
    orderId: 'ORD-89213',
    date: '2026-08-27',
    itemsSummary: 'Orange 3S LiPo, SG90 Servo x 10',
    grossAmount: 5850,
    commissionFee: 175.50,
    netPayout: 5674.50,
    payoutStatus: 'Paid',
    courier: 'Delhivery Air',
  },
  {
    id: 'PAY-8810',
    orderId: 'ORD-89212',
    date: '2026-08-26',
    itemsSummary: 'Arduino Uno R3, L298N Drivers x 4',
    grossAmount: 3480,
    commissionFee: 104.40,
    netPayout: 3375.60,
    payoutStatus: 'Paid',
    courier: 'BlueDart Express',
  },
  {
    id: 'PAY-8809',
    orderId: 'ORD-89210',
    date: '2026-08-25',
    itemsSummary: 'DHT22 Sensors x 8, OLED Displays x 4',
    grossAmount: 4260,
    commissionFee: 127.80,
    netPayout: 4132.20,
    payoutStatus: 'Paid',
    courier: 'DTDC Priority',
  },
  {
    id: 'PAY-8808',
    orderId: 'ORD-89215',
    date: '2026-08-29',
    itemsSummary: 'Raspberry Pi Pico W, Breadboards x 5',
    grossAmount: 1890,
    commissionFee: 56.70,
    netPayout: 1833.30,
    payoutStatus: 'In Escrow',
    courier: 'Speed Post India',
  },
  {
    id: 'PAY-8807',
    orderId: 'ORD-89216',
    date: '2026-08-30',
    itemsSummary: 'LiPo Batteries, ESP32 Modules',
    grossAmount: 7650,
    commissionFee: 229.50,
    netPayout: 7420.50,
    payoutStatus: 'Processing',
    courier: 'BlueDart Express',
  },
];

// Helper to determine warehouse shelf/bin location from SKU
export function getBinLocationForSku(sku?: string): string {
  if (!sku) return 'BIN-GEN-01';
  let hash = 0;
  for (let i = 0; i < sku.length; i++) {
    hash = (hash << 5) - hash + sku.charCodeAt(i);
    hash |= 0;
  }
  const aisle = ['A', 'B', 'C', 'D'][Math.abs(hash) % 4];
  const bay = (Math.abs(hash >> 2) % 4) + 1;
  const slot = (Math.abs(hash >> 4) % 18) + 1;
  return `BIN-${aisle}${bay}-${slot < 10 ? '0' + slot : slot}`;
}
