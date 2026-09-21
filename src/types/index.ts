export type UserRole = 'customer' | 'team' | 'admin' | 'seller';
export type AccountStatus = 'active' | 'suspended';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  department?: string;
  createdAt?: string;
  status?: AccountStatus;
  password?: string;
  // Seller-specific:
  businessName?: string;
  gstin?: string;
  warehouseHub?: string;
  commissionRate?: string;
  settlementTerms?: string;
  bonusAmount?: number;
  bonusUpdatedAt?: string;
  bonusUpdatedBy?: string;
  // Team-specific:
  designation?: string;
  permissionLevel?: 'Standard Operator' | 'Lead Technician' | 'Operations Supervisor' | 'Full Access' | string;
  // Customer-specific:
  shippingAddress?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: 'team' | 'seller' | 'customer';
  status?: AccountStatus;
  // Seller-specific
  businessName?: string;
  gstin?: string;
  warehouseHub?: string;
  commissionRate?: string;
  settlementTerms?: string;
  // Team-specific
  department?: string;
  designation?: string;
  permissionLevel?: string;
  // Customer-specific
  shippingAddress?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

export interface BulkPriceTier {
  minQty: number;
  discountPercent: number;
  unitPrice: number;
}

export interface ProductSpec {
  name: string;
  value: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  brand: string;
  category: string;
  subcategory: string;
  semixPrice?: number;
  price: number;
  originalPrice: number;
  inStock: boolean;
  stockCount: number;
  minOrderQty: number;
  rating: number;
  reviewCount: number;
  image: string;
  images: string[];
  shortDescription: string;
  description: string;
  specifications: ProductSpec[];
  datasheetUrl?: string;
  bulkTiers: BulkPriceTier[];
  tags: string[];
  locationBin: string;
  isNew?: boolean;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  voltage?: string;
  protocol?: string;
  addedBy?: string;
  addedByEmail?: string;
  addedByRole?: string;
  addedByUid?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  description: string;
  count: number;
  color: string;
  image: string;
  popularItems: string[];
}

export interface HomepageBanner {
  id: string;
  type?: 'banner-india-largest' | 'banner-top-brands' | 'banner-projects-ready' | 'custom' | 'product';
  title: string;
  subtitle?: string;
  description?: string;
  // Laptop / Desktop view image (wide ratio ~16:5 to 16:9, e.g. 1920x600 or 1600x500)
  desktopImage: string;
  // Mobile view image (ratio ~4:3 or 1:1, e.g. 800x600 or 750x750)
  mobileImage?: string;
  badge?: string;
  linkUrl?: string;
  tabLabel: string;
  shortLabel: string;
  telemetry?: string;
  price?: string;
  productId?: string;
  highlights?: string[];
  order: number;
  isActive: boolean;
  bgGradient?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  appliedUnitPrice: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  image: string;
  availableQty?: number;
  isUnavailable?: boolean;
  shortageReason?: string;
}

export interface OrderShortageItem {
  productId: string;
  sku: string;
  name: string;
  quantity: number;
  reason?: string;
}

export type OrderStatus = 
  | 'placed' 
  | 'pending_assignment' 
  | 'assigned' 
  | 'processing' 
  | 'packed' 
  | 'shipped' 
  | 'delivered' 
  | 'completed' 
  | 'cancelled';

export interface StatusTimelineEntry {
  status: OrderStatus;
  timestamp: string;
  note: string;
  updatedBy: string;
}

export interface CustomerAddress {
  fullName: string;
  phone: string;
  email: string;
  street: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

export interface Order {
  id: string;
  trackingNumber: string;
  customer: CustomerAddress;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  tax: number;
  discount: number;
  totalAmount: number;
  status: OrderStatus;
  statusTimeline: StatusTimelineEntry[];
  createdAt: string;
  paymentMethod: 'UPI' | 'Card' | 'NetBanking' | 'COD';
  paymentStatus: 'Paid' | 'Pending';
  packingNotes?: string;
  courier?: string;
  courierTrackingId?: string;
  packedBy?: string;
  assignedSellerId: string | null;
  assignedSellerName: string | null;
  assignedAt: string | null;
  missingItems?: OrderShortageItem[];
  // Coupon & Discount System fields
  couponCode?: string;
  discountAmount?: number;
  finalTotal?: number;
  userId?: string;
  confirmationEmailSent?: boolean;
}

export type CouponDiscountType = 'percentage' | 'fixed';
export type CouponStatus = 'active' | 'inactive';

export interface Coupon {
  code: string; // Uppercase, e.g., "ORDER10"
  discountType: CouponDiscountType;
  discountValue: number;
  minOrderValue: number;
  maxDiscount: number | null;
  startDate: string; // ISO 8601 string or Timestamp representation
  expiryDate: string; // ISO 8601 string or Timestamp representation
  totalUsageLimit: number;
  perCustomerLimit: number;
  timesUsed: number;
  status: CouponStatus;
  createdAt?: string | any;
  updatedAt?: string | any;
}

export interface CouponUsage {
  userId: string;
  orderId?: string;
  usageCount: number;
  lastUsedAt?: string | any;
}

export interface CouponValidationResult {
  isValid: boolean;
  coupon?: Coupon;
  discount: number;
  finalTotal: number;
  error?: string;
}

export interface AvailableSeller {
  id: string;
  name: string;
  email: string;
  phone: string;
  warehouseHub: string;
  gstin: string;
  rating: number;
  activeOrdersCount?: number;
  businessName?: string;
  commissionRate?: string;
  settlementTerms?: string;
  status?: AccountStatus;
  bonusAmount?: number;
  bonusUpdatedAt?: string;
  bonusUpdatedBy?: string;
}

export interface SellerBonusAuditEntry {
  previousBonus: number;
  newBonus: number;
  updatedBy: string;
  updatedAt: string;
}

export interface SellerBonusRecord {
  sellerId: string;
  sellerName: string;
  sellerEmail: string;
  bonusAmount: number;
  previousBonus?: number;
  updatedBy: string;
  updatedAt: string;
  history?: SellerBonusAuditEntry[];
}

export type EscalationType = 
  | 'damaged_stock' 
  | 'count_discrepancy' 
  | 'missing_product'
  | 'incorrect_info'
  | 'defective_batch' 
  | 'missing_label' 
  | 'supplier_delay'
  | 'other';
export type EscalationPriority = 'low' | 'medium' | 'high' | 'critical';
export type EscalationStatus = 'open' | 'investigating' | 'resolved' | 'pending';

export interface EscalationIssue {
  id: string;
  reportedBy: string;
  orderId?: string;
  productId?: string;
  productName?: string;
  affectedQuantity?: number;
  type: EscalationType;
  description: string;
  priority: EscalationPriority;
  status: EscalationStatus;
  resolutionNote?: string;
  createdAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
}

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: 'team' | 'admin';
  department: string;
  active: boolean;
  lastActive: string;
}

export interface BOMParsedItem {
  id: string;
  rawQuery: string;
  requestedQty: number;
  matchedProduct?: Product;
  matchScore: number;
  status: 'matched' | 'unmatched' | 'low_stock';
}

export interface CustomService {
  id: string;
  title: string;
  tagline: string;
  description: string;
  turnaround: string;
  basePrice: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  iconName: string;
  features: string[];
}

export interface BulkEnquiryComponentItem {
  id: string;
  partNumber: string;
  category: string;
  quantity: number;
  targetPrice?: string;
  notes?: string;
}

export interface AttachedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  dataUrl?: string;
  uploadedAt: string;
}

export type CustomProjectCategory = 
  | 'Embedded Systems & IoT'
  | 'PCB Design & Prototyping'
  | 'Firmware & Software Development'
  | 'Turnkey Manufacturing'
  | 'Robotics & Automation'
  | 'Other';

export type CustomProjectQuantity = 
  | 'Prototype (1-5 units)'
  | 'Pilot Run (10-50 units)'
  | 'Batch Production (50-200 units)'
  | 'Mass Production (500+ units)'
  | 'Custom Volume';

export type CustomProjectBudget = 
  | '< ₹50,000'
  | '₹50,000 – ₹2,00,000'
  | '₹2,00,000 – ₹10,00,000'
  | '> ₹10,00,000'
  | 'Custom / Open for Discussion';

export type CustomProjectTimeline =
  | 'Urgent (< 2 weeks)'
  | 'Standard (3-4 weeks)'
  | 'Extended (2-3 months)'
  | 'Flexible / Roadmap planning';

export type CustomProjectStatus = 
  | 'Pending Review'
  | 'In Discussion'
  | 'Quoted'
  | 'Approved'
  | 'Rejected';

export interface AdminReplyMessage {
  id: string;
  sender: 'admin' | 'client';
  senderName: string;
  message: string;
  quotedAmount?: string;
  timestamp: string;
}

export interface CustomProjectSubmission {
  id: string; // e.g. "PRJ-2026-8942"
  userId?: string;
  projectName: string;
  category: CustomProjectCategory;
  quantity: CustomProjectQuantity | string;
  timeline: CustomProjectTimeline | string;
  budgetRange: CustomProjectBudget | string;
  description: string;
  preferredComponents?: string;
  attachedFiles: AttachedFile[];
  
  // Client & Organization
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  companyName: string;
  gstin?: string;
  
  // Admin & Routing fields
  status: CustomProjectStatus;
  createdAt: string;
  updatedAt: string;
  adminNotes?: string;
  quoteAmount?: string;
  replies?: AdminReplyMessage[];
}

export interface AdminProjectNotification {
  id: string;
  projectId: string;
  projectTitle: string;
  clientName: string;
  timestamp: string;
  read: boolean;
  message: string;
}

export interface BulkEnquirySubmission {
  id: string; // e.g. "ENQ-2026-8942"
  userId?: string;
  fullName: string;
  email: string;
  phone: string;
  companyName: string;
  targetDeliveryDate?: string;
  projectNotes?: string;
  items: BulkEnquiryComponentItem[];
  totalDistinctItems: number;
  totalQuantity: number;
  status: 'submitted' | 'under_review' | 'quoted' | 'closed';
  createdAt: string;
}

export interface RecurringOrder {
  id: string; // e.g. "REC-9012"
  subscriberName: string;
  organization: string;
  frequency: 'weekly' | 'bi-weekly' | 'monthly' | 'quarterly';
  nextScheduledDate: string;
  category: string;
  items: OrderItem[];
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'paused' | 'preparing' | 'dispatched';
  totalAmount: number;
  locationBin: string;
  autoPackDaysBefore: number;
}

export interface SellerProfile {
  name: string;
  role: string;
  email: string;
  phone: string;
  warehouseHub: string;
  gstin: string;
  preferredCourier: string;
  notifyOnNewOrder: boolean;
  notifyOnLowStock: boolean;
  performanceRating: number;
  onTimeDispatchRate: number;
  totalPackedThisWeek: number;
}

export interface SellerNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'order' | 'inventory' | 'courier' | 'subscription';
  isRead: boolean;
  orderId?: string;
  priority?: 'normal' | 'urgent';
}

export * from './audit';
