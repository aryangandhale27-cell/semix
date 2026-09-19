import express from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import { INITIAL_PRODUCTS } from './src/mockData/products';
import { searchProducts } from './src/services/searchEngine';

dotenv.config();

const app = express();
const PORT =  Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '15mb' }));

app.post('/api/ai/product-description', async (req, res) => {
  const productName = typeof req.body?.productName === 'string' ? req.body.productName.trim() : '';
  const category = typeof req.body?.category === 'string' ? req.body.category.trim() : '';

  if (!productName || !category) {
    return res.status(400).json({ success: false, error: 'Product name and category are required.' });
  }

  if (productName.length > 200 || category.length > 160) {
    return res.status(400).json({ success: false, error: 'Product name or category is too long.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ success: false, error: 'AI description generation is not configured on the server.' });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const result = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: `Write a professional electronics e-commerce product description for SEMIX LABS.\n\nProduct title: ${productName}\nCategory: ${category}\n\nUse only the product title and category as factual inputs. Do not invent specifications, ratings, compatibility claims, measurements, certifications, included items, or performance figures. Write 2 concise paragraphs, plain text only, suitable for a product catalog.`,
    });
    const description = result.text?.trim();

    if (!description) {
      return res.status(502).json({ success: false, error: 'The AI returned an empty description.' });
    }

    return res.json({ success: true, description });
  } catch (err: any) {
    console.error('[AI] Product description generation failed:', err?.message || err);
    return res.status(502).json({ success: false, error: 'Unable to generate a description right now. Please try again.' });
  }
});

function getRazorpayClient() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) return null;
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
}

app.post('/api/payments/razorpay/order', async (req, res) => {
  const amount = Number(req.body?.amount);
  const receipt = String(req.body?.receipt || '').slice(0, 40);

  if (!Number.isFinite(amount) || amount <= 0 || !receipt) {
    return res.status(400).json({ success: false, error: 'A valid amount and receipt are required.' });
  }

  const razorpay = getRazorpayClient();
  if (!razorpay) {
    return res.status(503).json({ success: false, error: 'Razorpay is not configured on the server.' });
  }

  try {
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: 'INR',
      receipt,
    });

    return res.json({
      success: true,
      order: { id: order.id, amount: order.amount, currency: order.currency },
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err: any) {
    console.error('[Razorpay] Failed to create order:', err);
    return res.status(502).json({ success: false, error: 'Unable to start Razorpay checkout.' });
  }
});

app.post('/api/payments/razorpay/verify', (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keySecret || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ success: false, error: 'Incomplete Razorpay payment details.' });
  }

  const expectedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');
  const receivedSignature = String(razorpay_signature);

  if (
    expectedSignature.length !== receivedSignature.length ||
    !crypto.timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(receivedSignature))
  ) {
    return res.status(400).json({ success: false, error: 'Razorpay payment verification failed.' });
  }

  return res.json({ success: true, paymentId: razorpay_payment_id });
});

// Ensure public uploads directories exist and serve statically
const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
['banners', 'categories'].forEach((sub) => {
  const subDir = path.join(uploadsDir, sub);
  if (!fs.existsSync(subDir)) {
    fs.mkdirSync(subDir, { recursive: true });
  }
});
app.use('/uploads', express.static(uploadsDir));

// Helper to get lazy nodemailer transporter
function getTransporter() {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '465', 10);
  const secure = port === 465;

  if (!user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });
}

// Check Email Delivery Service Status
app.get('/api/email-status', (req, res) => {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const configured = Boolean(user && pass);

  res.json({
    configured,
    provider: host.includes('gmail') ? 'Gmail SMTP' : 'Custom SMTP',
    user: user ? user.replace(/(.{3})(.*)(@.*)/, '$1***$3') : null,
    targetAdmin: 'aryangandhale27@gmail.com',
    message: configured
      ? 'SMTP transport active and ready to deliver real physical emails to Gmail.'
      : 'SMTP credentials not configured. In-app and Firestore mail queues are active. Set SMTP_USER and SMTP_PASS in Settings to deliver physical emails to Gmail.',
  });
});

// Send Transactional Email API Endpoint
app.post('/api/send-email', async (req, res) => {
  const { to, subject, html, text, recipientType, orderId } = req.body;

  if (!to || !subject || !html) {
    return res.status(400).json({
      success: false,
      error: 'Missing required parameters: to, subject, html',
    });
  }

  const recipients = Array.isArray(to) ? to : [to];
  const transporter = getTransporter();

  if (!transporter) {
    console.log(
      `[Email Dispatcher] Notice: SMTP not configured. Transaction queued for: ${recipients.join(
        ', '
      )} | Subject: ${subject}`
    );
    return res.json({
      success: true,
      delivered: false,
      mode: 'queued_in_app',
      message:
        'Email queued in Firestore and local dispatcher. To receive real emails in your Gmail inbox, configure SMTP_USER & SMTP_PASS in Settings.',
      recipients,
      orderId,
    });
  }

  try {
    const fromAddress =
      process.env.EMAIL_FROM ||
      `"SEMIX LABS Electronics" <${process.env.SMTP_USER}>`;

    const info = await transporter.sendMail({
      from: fromAddress,
      to: recipients.join(', '),
      subject,
      html,
      text: text || 'Please view this order email in an HTML-compatible client.',
    });

    console.log(`[Email Dispatcher] Real email delivered to ${recipients.join(', ')}. MessageId: ${info.messageId}`);

    return res.json({
      success: true,
      delivered: true,
      messageId: info.messageId,
      recipients,
      orderId,
    });
  } catch (err: any) {
    console.error('[Email Dispatcher] SMTP error when sending to', recipients, err);
    return res.status(500).json({
      success: false,
      delivered: false,
      error: err.message || 'Failed to dispatch email through SMTP transport.',
      recipients,
    });
  }
});

// Health check API
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Intelligent Product Search & Autocomplete API
app.get('/api/products/search', (req, res) => {
  const query = (req.query.q as string) || '';
  const category = (req.query.category as string) || undefined;
  const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
  const inStockOnly = req.query.inStock === 'true';

  const results = searchProducts(INITIAL_PRODUCTS, query, {
    category,
    limit,
    inStockOnly,
  });

  res.json({
    success: true,
    data: results,
  });
});

// Image Upload API for Banners & Category Images
app.post('/api/admin/upload-image', (req, res) => {
  try {
    const { imageBase64, filename, folder = 'banners' } = req.body;

    if (!imageBase64 || typeof imageBase64 !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'No image data provided.',
      });
    }

    // Validate folder target
    const targetFolder = folder === 'categories' ? 'categories' : 'banners';
    const destinationDir = path.join(uploadsDir, targetFolder);
    if (!fs.existsSync(destinationDir)) {
      fs.mkdirSync(destinationDir, { recursive: true });
    }

    // Parse Data URL scheme: data:image/jpeg;base64,....
    const matches = imageBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({
        success: false,
        error: 'Invalid image format. Must be a valid base64 data URL.',
      });
    }

    const mimeType = matches[1].toLowerCase();
    const base64Data = matches[2];

    const ALLOWED_MIMES: Record<string, string> = {
      'image/jpeg': '.jpg',
      'image/jpg': '.jpg',
      'image/png': '.png',
      'image/webp': '.webp',
    };

    if (!ALLOWED_MIMES[mimeType]) {
      return res.status(400).json({
        success: false,
        error: 'Unsupported image type. Only JPG, PNG, and WEBP are supported.',
      });
    }

    const buffer = Buffer.from(base64Data, 'base64');
    const MAX_BYTES = 5 * 1024 * 1024; // 5MB

    if (buffer.length > MAX_BYTES) {
      return res.status(400).json({
        success: false,
        error: `File size (${(buffer.length / (1024 * 1024)).toFixed(2)}MB) exceeds maximum limit of 5MB.`,
      });
    }

    const ext = ALLOWED_MIMES[mimeType];
    const cleanBaseName = (filename || 'image')
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .substring(0, 40);
    const uniqueFilename = `${cleanBaseName}-${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;
    const filePath = path.join(destinationDir, uniqueFilename);

    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${targetFolder}/${uniqueFilename}`;
    console.log(`[Storage] Saved uploaded image to ${publicUrl} (${buffer.length} bytes)`);

    return res.json({
      success: true,
      url: publicUrl,
      filename: uniqueFilename,
      size: buffer.length,
      mimeType,
    });
  } catch (err: any) {
    console.error('[Storage] Error saving uploaded image:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Failed to save uploaded image.',
    });
  }
});

// Image Deletion API
app.delete('/api/admin/delete-image', (req, res) => {
  try {
    const { url } = req.body;
    if (!url || typeof url !== 'string' || !url.startsWith('/uploads/')) {
      return res.status(400).json({
        success: false,
        error: 'Invalid file URL.',
      });
    }

    // Security check: avoid directory traversal
    const safeRelPath = path.normalize(url.replace('/uploads/', '')).replace(/^(\.\.[\/\\])+/, '');
    const filePath = path.join(uploadsDir, safeRelPath);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`[Storage] Deleted image at ${filePath}`);
    }

    return res.json({ success: true });
  } catch (err: any) {
    console.error('[Storage] Error deleting image:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Failed to delete image.',
    });
  }
});

// ==========================================
// SELLER BONUS MANAGEMENT BACKEND SERVICE
// ==========================================

const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
const bonusFilePath = path.join(dataDir, 'seller-bonuses.json');

const INITIAL_BONUSES: Record<string, {
  sellerId: string;
  sellerName: string;
  sellerEmail: string;
  bonusAmount: number;
  previousBonus: number;
  updatedBy: string;
  updatedAt: string;
  history: Array<{
    previousBonus: number;
    newBonus: number;
    updatedBy: string;
    updatedAt: string;
  }>;
}> = {
  'usr-seller-01': {
    sellerId: 'usr-seller-01',
    sellerName: 'Vikram Patel',
    sellerEmail: 'seller@semixlabs.com',
    bonusAmount: 5000,
    previousBonus: 0,
    updatedBy: 'Admin Controller',
    updatedAt: '2026-09-01T10:00:00.000Z',
    history: [
      {
        previousBonus: 0,
        newBonus: 5000,
        updatedBy: 'Admin Controller',
        updatedAt: '2026-09-01T10:00:00.000Z',
      },
    ],
  },
  'usr-seller-02': {
    sellerId: 'usr-seller-02',
    sellerName: 'Priya Sharma (ElectroComponents Hub)',
    sellerEmail: 'priya.sharma@semixlabs.com',
    bonusAmount: 2500,
    previousBonus: 0,
    updatedBy: 'Admin Controller',
    updatedAt: '2026-09-02T14:30:00.000Z',
    history: [
      {
        previousBonus: 0,
        newBonus: 2500,
        updatedBy: 'Admin Controller',
        updatedAt: '2026-09-02T14:30:00.000Z',
      },
    ],
  },
  'usr-seller-03': {
    sellerId: 'usr-seller-03',
    sellerName: 'Rajesh Nair (MicroSilicon Express)',
    sellerEmail: 'rajesh.nair@semixlabs.com',
    bonusAmount: 10000,
    previousBonus: 5000,
    updatedBy: 'Admin Controller',
    updatedAt: '2026-09-05T09:15:00.000Z',
    history: [
      {
        previousBonus: 0,
        newBonus: 5000,
        updatedBy: 'Admin Controller',
        updatedAt: '2026-08-15T09:00:00.000Z',
      },
      {
        previousBonus: 5000,
        newBonus: 10000,
        updatedBy: 'Admin Controller',
        updatedAt: '2026-09-05T09:15:00.000Z',
      },
    ],
  },
  'usr-seller-04': {
    sellerId: 'usr-seller-04',
    sellerName: 'Ananya Desai (Silicon Valley Hub)',
    sellerEmail: 'ananya.desai@semixlabs.com',
    bonusAmount: 7500,
    previousBonus: 0,
    updatedBy: 'Admin Controller',
    updatedAt: '2026-09-08T11:45:00.000Z',
    history: [
      {
        previousBonus: 0,
        newBonus: 7500,
        updatedBy: 'Admin Controller',
        updatedAt: '2026-09-08T11:45:00.000Z',
      },
    ],
  },
};

function loadBonuses() {
  try {
    if (fs.existsSync(bonusFilePath)) {
      const data = fs.readFileSync(bonusFilePath, 'utf-8');
      const parsed = JSON.parse(data);
      if (parsed && typeof parsed === 'object') {
        return { ...INITIAL_BONUSES, ...parsed };
      }
    }
  } catch (err) {
    console.warn('[Bonuses] Error reading persistent bonus file, using fallback in-memory store:', err);
  }
  return { ...INITIAL_BONUSES };
}

function saveBonuses(bonuses: Record<string, any>) {
  try {
    fs.writeFileSync(bonusFilePath, JSON.stringify(bonuses, null, 2), 'utf-8');
  } catch (err) {
    console.error('[Bonuses] Error saving bonuses to persistent file:', err);
  }
}

// 1. Strict Seller Read-Only Enforcement on All Mutation Verbs
app.all(['/api/seller/bonus', '/api/seller/bonus/*'], (req, res, next) => {
  if (['PUT', 'POST', 'PATCH', 'DELETE'].includes(req.method)) {
    return res.status(403).json({
      success: false,
      error: 'Sellers have read-only access to bonuses. Modifying bonuses is strictly restricted to authorized platform administrators.',
    });
  }
  next();
});

// 2. Admin: Get all seller bonuses
app.get('/api/admin/bonuses', (req, res) => {
  const userRole = (req.headers['x-user-role'] as string) || '';
  if (userRole !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Access denied: Admin role required to view seller bonus management.',
    });
  }

  const bonuses = loadBonuses();
  return res.json({
    success: true,
    data: Object.values(bonuses),
  });
});

// 3. Admin: Add/Update seller bonus amount with strict validation & audit logging
app.put('/api/admin/bonuses/:sellerId', (req, res) => {
  const userRole = (req.headers['x-user-role'] as string) || '';
  if (userRole !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Access denied: Sellers are not permitted to modify bonuses. Only authorized administrators can manage seller bonuses.',
    });
  }

  const { sellerId } = req.params;
  const { bonusAmount, sellerName, sellerEmail, updatedBy } = req.body;

  // Proper numeric validation: no negative amounts, no text/letters, must be valid number
  if (bonusAmount === undefined || bonusAmount === null || bonusAmount === '') {
    return res.status(400).json({
      success: false,
      error: 'Please enter a valid bonus amount.',
    });
  }

  const strVal = String(bonusAmount).trim();
  // Ensure string is strictly a positive integer or decimal number (e.g., 5000, 5000.50)
  if (!/^\d+(\.\d{1,2})?$/.test(strVal)) {
    return res.status(400).json({
      success: false,
      error: 'Please enter a valid bonus amount.',
    });
  }

  const numAmount = Number(strVal);
  if (isNaN(numAmount) || !isFinite(numAmount) || numAmount < 0) {
    return res.status(400).json({
      success: false,
      error: 'Please enter a valid bonus amount.',
    });
  }

  try {
    const bonuses = loadBonuses();
    const existing = bonuses[sellerId];
    const previousBonus = existing ? existing.bonusAmount : 0;
    const now = new Date().toISOString();
    const adminUser = updatedBy || (req.headers['x-user-name'] as string) || 'Admin Controller';

    const history = (existing && Array.isArray(existing.history)) ? [...existing.history] : [];
    history.unshift({
      previousBonus,
      newBonus: numAmount,
      updatedBy: adminUser,
      updatedAt: now,
    });

    const updatedRecord = {
      sellerId,
      sellerName: sellerName || (existing && existing.sellerName) || 'Seller Hub',
      sellerEmail: sellerEmail || (existing && existing.sellerEmail) || 'seller@semixlabs.com',
      bonusAmount: numAmount,
      previousBonus,
      updatedBy: adminUser,
      updatedAt: now,
      history: history.slice(0, 30),
    };

    bonuses[sellerId] = updatedRecord;
    saveBonuses(bonuses);

    // Automatically record immutable audit log for this bonus allocation
    saveActivityLog({
      logId: `log_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      timestamp: now,
      userId: (req.headers['x-user-id'] as string) || 'usr-admin-01',
      userEmail: (req.headers['x-user-email'] as string) || 'aryangandhale27@gmail.com',
      userName: adminUser,
      userRole: 'admin',
      actionType: 'BONUS_ALLOCATION',
      targetEntity: 'seller_bonuses',
      targetId: sellerId,
      changes: {
        diffs: {
          bonusAmount: { oldValue: previousBonus, newValue: numAmount },
        },
        affectedFields: ['bonusAmount'],
        summary: `Admin updated bonus for ${updatedRecord.sellerName} from ₹${previousBonus.toLocaleString('en-IN')} to ₹${numAmount.toLocaleString('en-IN')}`,
      },
      metadata: {
        source: 'express_api',
        route: `/api/admin/bonuses/${sellerId}`,
      },
    });

    console.log(`[Bonuses] Admin '${adminUser}' updated bonus for seller ${sellerId} (${updatedRecord.sellerName}) from ₹${previousBonus} to ₹${numAmount}`);

    return res.json({
      success: true,
      message: 'Bonus updated successfully.',
      data: updatedRecord,
    });
  } catch (err: any) {
    console.error('[Bonuses] Error updating seller bonus:', err);
    return res.status(500).json({
      success: false,
      error: 'Unable to update bonus. Please try again.',
    });
  }
});

// 4. Seller: Read-only access to own bonus
app.get('/api/seller/bonus', (req, res) => {
  const userRole = (req.headers['x-user-role'] as string) || '';
  const userId = (req.headers['x-user-id'] as string) || '';
  const querySellerId = (req.query.sellerId as string) || userId || 'usr-seller-01';

  // Strict isolation: Seller cannot see another seller's bonus
  if (userRole === 'seller' && userId && querySellerId !== userId) {
    return res.status(403).json({
      success: false,
      error: 'Access denied: Sellers are strictly restricted to viewing only their own bonus.',
    });
  }

  const bonuses = loadBonuses();
  const record = bonuses[querySellerId] || {
    sellerId: querySellerId,
    sellerName: 'Seller Hub',
    sellerEmail: 'seller@semixlabs.com',
    bonusAmount: 0,
    previousBonus: 0,
    updatedBy: 'Admin Controller',
    updatedAt: new Date().toISOString(),
  };

  return res.json({
    success: true,
    data: record,
  });
});

// 5. Seller: Read-only access by sellerId with strict role check
app.get('/api/seller/bonus/:sellerId', (req, res) => {
  const { sellerId } = req.params;
  const userRole = (req.headers['x-user-role'] as string) || '';
  const userId = (req.headers['x-user-id'] as string) || '';

  // Strict isolation: Seller cannot access another seller's bonus
  if (userRole === 'seller' && userId && userId !== sellerId) {
    return res.status(403).json({
      success: false,
      error: 'Access denied: Sellers are strictly restricted to viewing only their own bonus.',
    });
  }

  const bonuses = loadBonuses();
  const record = bonuses[sellerId] || {
    sellerId,
    sellerName: 'Seller Hub',
    sellerEmail: 'seller@semixlabs.com',
    bonusAmount: 0,
    previousBonus: 0,
    updatedBy: 'Admin Controller',
    updatedAt: new Date().toISOString(),
  };

  return res.json({
    success: true,
    data: record,
  });
});

// =========================================================================
// IMMUTABLE AUDIT LOGS PERSISTENCE & API
// =========================================================================
const activityLogsFilePath = path.join(dataDir, 'activity-logs.json');

const INITIAL_AUDIT_LOGS = [
  {
    logId: 'log_seed_001',
    timestamp: '2026-09-08T11:45:00.000Z',
    userId: 'usr-admin-01',
    userEmail: 'aryangandhale27@gmail.com',
    userName: 'Aryan Gandhale',
    userRole: 'admin',
    actionType: 'BONUS_ALLOCATION',
    targetEntity: 'seller_bonuses',
    targetId: 'usr-seller-04',
    changes: {
      diffs: {
        bonusAmount: { oldValue: 0, newValue: 7500 },
      },
      affectedFields: ['bonusAmount'],
      summary: 'Allocated ₹7,500 festive fulfillment incentive to Pune Circuit Hub',
    },
    metadata: {
      source: 'web_client',
      reason: 'Q3 High SLA Performance Bonus',
      route: '/admin',
    },
  },
  {
    logId: 'log_seed_002',
    timestamp: '2026-09-05T09:15:00.000Z',
    userId: 'usr-admin-01',
    userEmail: 'aryangandhale27@gmail.com',
    userName: 'Aryan Gandhale',
    userRole: 'admin',
    actionType: 'UPDATE',
    targetEntity: 'banners',
    targetId: 'banner-01',
    changes: {
      diffs: {
        title: { oldValue: 'Electronics Hardware', newValue: 'Next-Gen Edge AI Silicon Modules' },
      },
      affectedFields: ['title'],
      summary: 'Updated Homepage Front Banner headline and promotional assets',
    },
    metadata: {
      source: 'web_client',
      route: '/admin',
    },
  },
  {
    logId: 'log_seed_003',
    timestamp: '2026-09-03T14:20:00.000Z',
    userId: 'usr-seller-01',
    userEmail: 'seller@semixlabs.com',
    userName: 'Vikram Patel',
    userRole: 'seller',
    actionType: 'STATUS_CHANGE',
    targetEntity: 'orders',
    targetId: 'ORD-89412',
    changes: {
      diffs: {
        status: { oldValue: 'processing', newValue: 'packed' },
      },
      affectedFields: ['status'],
      summary: 'Seller packed order ORD-89412 with anti-static shielding',
    },
    metadata: {
      source: 'web_client',
      route: '/seller',
    },
  },
];

function loadActivityLogs(): any[] {
  try {
    if (fs.existsSync(activityLogsFilePath)) {
      const data = fs.readFileSync(activityLogsFilePath, 'utf-8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('[AuditLogs] Error reading activity logs file:', err);
  }
  return [...INITIAL_AUDIT_LOGS];
}

function saveActivityLog(log: any) {
  try {
    const logs = loadActivityLogs();
    // Immutability check: if log already exists, reject modification!
    const existingIndex = logs.findIndex((l: any) => l.logId === log.logId);
    if (existingIndex !== -1) {
      console.warn(`[AuditLogs] Immutability violation attempt: Log ${log.logId} already exists. Write rejected.`);
      return false;
    }
    logs.unshift(log); // Prepend new log
    fs.writeFileSync(activityLogsFilePath, JSON.stringify(logs.slice(0, 1000), null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('[AuditLogs] Error saving activity log:', err);
    return false;
  }
}

// GET /api/admin/audit-logs
app.get('/api/admin/audit-logs', (req, res) => {
  const { targetEntity, userRole, actionType, targetId, limit: queryLimit } = req.query;
  let logs = loadActivityLogs();

  if (targetEntity && targetEntity !== 'all') {
    logs = logs.filter((l: any) => l.targetEntity === targetEntity);
  }
  if (userRole && userRole !== 'all') {
    logs = logs.filter((l: any) => l.userRole === userRole);
  }
  if (actionType && actionType !== 'all') {
    logs = logs.filter((l: any) => l.actionType === actionType);
  }
  if (targetId) {
    logs = logs.filter((l: any) => String(l.targetId).toLowerCase().includes(String(targetId).toLowerCase()));
  }

  const maxItems = queryLimit ? parseInt(String(queryLimit), 10) : 100;
  return res.json({
    success: true,
    data: logs.slice(0, maxItems),
    totalCount: logs.length,
  });
});

// POST /api/admin/audit-logs (Append-Only)
app.post('/api/admin/audit-logs', (req, res) => {
  const { logId, userId, userRole, actionType, targetEntity, targetId, changes } = req.body;

  if (!logId || !userId || !userRole || !actionType || !targetEntity || !targetId) {
    return res.status(400).json({
      success: false,
      error: 'Missing required audit log parameters.',
    });
  }

  const logEntry = {
    logId,
    timestamp: req.body.timestamp || new Date().toISOString(),
    userId,
    userEmail: req.body.userEmail || '',
    userName: req.body.userName || '',
    userRole,
    actionType,
    targetEntity,
    targetId,
    changes: changes || { diffs: {}, affectedFields: [] },
    metadata: req.body.metadata || { source: 'express_api' },
  };

  const saved = saveActivityLog(logEntry);
  if (!saved) {
    return res.status(409).json({
      success: false,
      error: 'Log already exists. Audit logs are immutable and cannot be modified or replaced.',
    });
  }

  return res.status(201).json({
    success: true,
    data: logEntry,
  });
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SEMIX LABS Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
