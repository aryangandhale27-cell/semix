import { Order, EscalationIssue, StaffMember } from '../types';

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-89214',
    trackingNumber: 'RTZ-IN-8921498',
    customer: {
      fullName: 'Vikramaditya Sharma',
      phone: '+91 98451 23098',
      email: 'vikram.maker@gmail.com',
      street: 'Flat 402, Prithvi Silicon Heights, Outer Ring Road',
      landmark: 'Near Marathahalli Bridge',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560037',
      isDefault: true
    },
    items: [
      {
        productId: 'prod-001',
        name: 'Raspberry Pi 5 Single Board Computer (8GB RAM)',
        sku: 'RPI-5-8GB-ORIG',
        price: 8250,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=300&q=80'
      },
      {
        productId: 'prod-004',
        name: 'MPU-6050 3-Axis Gyroscope + Accelerometer',
        sku: 'SEN-MPU-6050-6DOF',
        price: 165,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=300&q=80'
      },
      {
        productId: 'prod-012',
        name: 'TP4056 1A Li-Ion Battery Charger Module',
        sku: 'PWR-TP4056-USBC-PROT',
        price: 32,
        quantity: 5,
        image: 'https://images.unsplash.com/photo-1619725002198-6a689b72f41d?auto=format&fit=crop&w=300&q=80'
      }
    ],
    subtotal: 8740,
    shippingFee: 0,
    tax: 1573.20,
    discount: 200,
    totalAmount: 10113.20,
    status: 'shipped',
    statusTimeline: [
      {
        status: 'placed',
        timestamp: '2026-08-24 10:15 AM',
        note: 'Order confirmed & payment verified via UPI (Razorpay)',
        updatedBy: 'System Gateway'
      },
      {
        status: 'packed',
        timestamp: '2026-08-24 02:40 PM',
        note: 'ESD anti-static bubble packaging applied. Bin location checked by Rahul S.',
        updatedBy: 'Rahul Sharma (Fulfillment QA)'
      },
      {
        status: 'shipped',
        timestamp: '2026-08-25 09:10 AM',
        note: 'Handed over to BlueDart Express Hub. AWB: BD-BLR-904128912',
        updatedBy: 'Logistics Dispatch'
      }
    ],
    createdAt: '2026-08-24T10:15:00.000Z',
    paymentMethod: 'UPI',
    paymentStatus: 'Paid',
    packingNotes: 'Include complementary SEMIX LABS maker sticker pack and ESD safety guide.',
    courier: 'BlueDart Express Air',
    courierTrackingId: 'BD-BLR-904128912',
    packedBy: 'Rahul Sharma',
    assignedSellerId: 'usr-seller-01',
    assignedSellerName: 'Vikram Patel',
    assignedAt: '2026-08-24T10:20:00.000Z'
  },
  {
    id: 'ORD-89215',
    trackingNumber: 'RTZ-IN-8921511',
    customer: {
      fullName: 'Aanya Kulkarni',
      phone: '+91 97234 56123',
      email: 'aanya.robotics@coep.ac.in',
      street: 'Robotics Lab 3, Department of Instrumentation, COEP Tech',
      landmark: 'Shivajinagar',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411005'
    },
    items: [
      {
        productId: 'prod-002',
        name: 'Arduino Uno R4 WiFi',
        sku: 'ARD-UNO-R4-WIFI',
        price: 2450,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=300&q=80'
      },
      {
        productId: 'prod-007',
        name: 'L298N Dual H-Bridge Motor Driver',
        sku: 'DRV-L298N-DUAL-HBRDG',
        price: 185,
        quantity: 4,
        image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=300&q=80'
      },
      {
        productId: 'prod-008',
        name: 'TowerPro SG90 9g Micro Servo Motor',
        sku: 'SER-SG90-MICRO-9G',
        price: 110,
        quantity: 6,
        image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&q=80'
      }
    ],
    subtotal: 6300,
    shippingFee: 0,
    tax: 1134,
    discount: 300,
    totalAmount: 7134,
    status: 'packed',
    statusTimeline: [
      {
        status: 'placed',
        timestamp: '2026-08-25 11:30 AM',
        note: 'Order placed with Academic Institution purchase order',
        updatedBy: 'System Gateway'
      },
      {
        status: 'packed',
        timestamp: '2026-08-25 04:15 PM',
        note: 'Verified with optical barcode scanner in Bin E-01-2 & E-03-4',
        updatedBy: 'Priya Mehta (Team Desk)'
      }
    ],
    createdAt: '2026-08-25T11:30:00.000Z',
    paymentMethod: 'NetBanking',
    paymentStatus: 'Paid',
    packingNotes: 'Double box required for servo gears protect.',
    packedBy: 'Priya Mehta',
    assignedSellerId: 'usr-seller-01',
    assignedSellerName: 'Vikram Patel',
    assignedAt: '2026-08-25T11:35:00.000Z'
  },
  {
    id: 'ORD-89216',
    trackingNumber: 'RTZ-IN-8921677',
    customer: {
      fullName: 'Rohan Deshmukh',
      phone: '+91 99112 87654',
      email: 'rohan.d@dronecraft.io',
      street: 'Plot 88, Sector 18, Udyog Vihar',
      landmark: 'Opposite DLF CyberCity Phase 2',
      city: 'Gurugram',
      state: 'Haryana',
      pincode: '122002'
    },
    items: [
      {
        productId: 'prod-006',
        name: 'Orange 3S 11.1V 2200mAh 30C LiPo Battery Pack',
        sku: 'BAT-LIPO-3S-2200-30C',
        price: 1480,
        quantity: 3,
        image: 'https://images.unsplash.com/photo-1619725002198-6a689b72f41d?auto=format&fit=crop&w=300&q=80'
      },
      {
        productId: 'prod-016',
        name: 'A2212 1400KV Brushless Outrunner DC Motor',
        sku: 'DRN-BLDC-2212-1400KV',
        price: 520,
        quantity: 4,
        image: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=300&q=80'
      }
    ],
    subtotal: 6520,
    shippingFee: 80,
    tax: 1188,
    discount: 0,
    totalAmount: 7788,
    status: 'pending_assignment',
    statusTimeline: [
      {
        status: 'pending_assignment',
        timestamp: '2026-08-26 08:45 AM',
        note: 'Order placed by customer via Maker Line Credit. Awaiting Admin seller allocation.',
        updatedBy: 'System Gateway'
      }
    ],
    createdAt: '2026-08-26T08:45:00.000Z',
    paymentMethod: 'MakersCredit',
    paymentStatus: 'Paid',
    packingNotes: 'Dangerous Goods Class 9 Battery warning label mandatory on outer carton.',
    assignedSellerId: null,
    assignedSellerName: null,
    assignedAt: null
  },
  {
    id: 'ORD-89218',
    trackingNumber: 'RTZ-IN-8921890',
    customer: {
      fullName: 'Sneha Patil',
      phone: '+91 98231 44552',
      email: 'sneha.iot@makerspace.in',
      street: 'Flat 304, Emerald Court, Baner',
      landmark: 'Near Balewadi High Street',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411045'
    },
    items: [
      {
        productId: 'prod-003',
        name: 'ESP32-WROOM-32D Dual Core Dev Board',
        sku: 'ESP32-WROOM-32D-MOD',
        price: 380,
        quantity: 5,
        image: 'https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?auto=format&fit=crop&w=300&q=80'
      },
      {
        productId: 'prod-011',
        name: '0.96 inch I2C OLED Display SSD1306',
        sku: 'DIS-OLED-096-I2C-BLU',
        price: 220,
        quantity: 3,
        image: 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=300&q=80'
      }
    ],
    subtotal: 2560,
    shippingFee: 0,
    tax: 460.80,
    discount: 100,
    totalAmount: 2920.80,
    status: 'pending_assignment',
    statusTimeline: [
      {
        status: 'pending_assignment',
        timestamp: '2026-08-27 10:20 AM',
        note: 'Order confirmed & paid via UPI. Pending Admin assignment to regional seller hub.',
        updatedBy: 'System Gateway'
      }
    ],
    createdAt: '2026-08-27T10:20:00.000Z',
    paymentMethod: 'UPI',
    paymentStatus: 'Paid',
    packingNotes: 'Standard antistatic foam wrap.',
    assignedSellerId: null,
    assignedSellerName: null,
    assignedAt: null
  },
  {
    id: 'ORD-89210',
    trackingNumber: 'RTZ-IN-8921045',
    customer: {
      fullName: 'Deepak Nambiar',
      phone: '+91 94471 67890',
      email: 'deepak.kochi@gmail.com',
      street: '42, Skyline Riveria, Panampilly Nagar',
      landmark: 'Near Club House',
      city: 'Kochi',
      state: 'Kerala',
      pincode: '682036'
    },
    items: [
      {
        productId: 'prod-003',
        name: 'ESP32-WROOM-32D Dual Core Dev Board',
        sku: 'ESP32-WROOM-32D-MOD',
        price: 380,
        quantity: 4,
        image: 'https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?auto=format&fit=crop&w=300&q=80'
      },
      {
        productId: 'prod-011',
        name: '0.96 inch I2C OLED Display SSD1306',
        sku: 'DIS-OLED-096-I2C-BLU',
        price: 220,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=300&q=80'
      }
    ],
    subtotal: 1960,
    shippingFee: 60,
    tax: 363.60,
    discount: 50,
    totalAmount: 2333.60,
    status: 'delivered',
    statusTimeline: [
      {
        status: 'placed',
        timestamp: '2026-08-20 03:20 PM',
        note: 'Order confirmed',
        updatedBy: 'System Gateway'
      },
      {
        status: 'packed',
        timestamp: '2026-08-20 05:40 PM',
        note: 'Packed and sealed in waterproof bag',
        updatedBy: 'Rahul Sharma'
      },
      {
        status: 'shipped',
        timestamp: '2026-08-21 10:00 AM',
        note: 'Dispatched via Delhivery Express',
        updatedBy: 'Logistics Dispatch'
      },
      {
        status: 'delivered',
        timestamp: '2026-08-23 01:15 PM',
        note: 'Delivered to resident and signed by D. Nambiar',
        updatedBy: 'Delhivery Field Courier'
      }
    ],
    createdAt: '2026-08-20T15:20:00.000Z',
    paymentMethod: 'Card',
    paymentStatus: 'Paid',
    courier: 'Delhivery Surface Express',
    courierTrackingId: 'DLHV-KC-7729182',
    packedBy: 'Rahul Sharma',
    assignedSellerId: 'usr-seller-01',
    assignedSellerName: 'Vikram Patel',
    assignedAt: '2026-08-20T15:25:00.000Z'
  }
];

export const INITIAL_ESCALATIONS: EscalationIssue[] = [
  {
    id: 'ESC-401',
    reportedBy: 'Priya Mehta (Fulfillment Desk)',
    orderId: 'ORD-89215',
    productId: 'prod-008',
    productName: 'TowerPro SG90 9g Micro Servo Motor',
    type: 'count_discrepancy',
    description: 'System indicated 284 units in BIN-E-03-4, physical count found 280 units (4 units short). Requesting inventory count sync.',
    priority: 'medium',
    status: 'open',
    createdAt: '2026-08-25T16:30:00.000Z'
  },
  {
    id: 'ESC-402',
    reportedBy: 'Rahul Sharma (Inbound QA)',
    productId: 'prod-006',
    productName: 'Orange 3S 11.1V 2200mAh 30C LiPo Battery Pack',
    type: 'damaged_stock',
    description: 'Received supplier crate with 2 battery boxes having slight cell puffing / dent on terminal seal. Quarantined in Hazmat safety container.',
    priority: 'high',
    status: 'investigating',
    createdAt: '2026-08-24T14:10:00.000Z'
  },
  {
    id: 'ESC-398',
    reportedBy: 'Priya Mehta (Fulfillment Desk)',
    productId: 'prod-012',
    productName: 'TP4056 1A Li-Ion Battery Charger Module',
    type: 'missing_label',
    description: 'Tape strip #4 missing laser printed barcode sticker. Re-labeled with zebra thermal printer.',
    priority: 'low',
    status: 'resolved',
    resolutionNote: 'Barcode reprint approved and relabeled on 2026-08-23. Stock verified.',
    createdAt: '2026-08-23T09:00:00.000Z',
    resolvedAt: '2026-08-23T11:30:00.000Z',
    resolvedBy: 'Karthik Rao (Admin Operations)'
  }
];

export const INITIAL_STAFF: StaffMember[] = [
  {
    id: 'STF-01',
    name: 'Karthik Rao',
    email: 'karthik.ops@semixlabs.com',
    role: 'admin',
    department: 'Operations & Platform Admin',
    active: true,
    lastActive: 'Just now'
  },
  {
    id: 'STF-02',
    name: 'Rahul Sharma',
    email: 'rahul.logistics@semixlabs.com',
    role: 'team',
    department: 'Fulfillment & Logistics',
    active: true,
    lastActive: '12 mins ago'
  },
  {
    id: 'STF-03',
    name: 'Priya Mehta',
    email: 'priya.qa@semixlabs.com',
    role: 'team',
    department: 'Inventory & QA Desk',
    active: true,
    lastActive: '4 mins ago'
  },
  {
    id: 'STF-04',
    name: 'Anand Kumar',
    email: 'anand.pcb@semixlabs.com',
    role: 'team',
    department: 'Custom Fabrication & 3D Lab',
    active: true,
    lastActive: '1 hour ago'
  }
];
