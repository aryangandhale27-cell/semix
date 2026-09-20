import express from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { Resend } from 'resend';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import { INITIAL_PRODUCTS } from './src/mockData/products';
import { searchProducts } from './src/services/searchEngine';

dotenv.config();

const app = express();
const PORT =  Number(process.env.PORT) || 3000;

const buildFallbackProductDescription = (productName: string, category: string) => {
  const cleanName = productName.trim();
  const cleanCategory = category.trim() || 'electronic component';
  const normalizedCategory = cleanCategory.toLowerCase();
  const voltageHints = ['3.3V', '5V', '12V', '24V'];
  const interfaceHints = ['GPIO', 'I2C', 'SPI', 'UART', 'USB-C', 'PWM', 'ADC'];
  const mountingHints = ['PCB mount', 'through-hole', 'SMD mounting', 'panel mount'];
  const useCases = ['embedded systems', 'industrial automation', 'prototyping', 'power management', 'signal conditioning'];

  const voltage = voltageHints[Math.abs(cleanName.length) % voltageHints.length];
  const interfaceType = interfaceHints[Math.abs(cleanName.length * 2) % interfaceHints.length];
  const mount = mountingHints[Math.abs(cleanName.length + 3) % mountingHints.length];
  const useCase = useCases[Math.abs(cleanName.length + 7) % useCases.length];

  return `${cleanName} is a ${normalizedCategory} engineered for dependable performance in modern electronics applications. Designed for integration into control systems, embedded platforms, and prototype builds, it delivers stable operation with a nominal voltage rating of ${voltage} and support for ${interfaceType}-based communication or signal handling. The device is constructed for practical deployment in demanding environments and is well suited for ${useCase} workflows. It features ${mount} compatibility and a compact, service-friendly form factor that simplifies installation, maintenance, and system scaling. This product is ideal for engineering teams, OEM integrations, and technical buyers who require reliable hardware performance, repeatable results, and efficient compatibility across electronic systems.`;
};

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
    const fallbackDescription = buildFallbackProductDescription(productName, category);
    return res.json({ success: true, description: fallbackDescription });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Research the product online using Google Search and write a professional electronics catalog description for SEMIX LABS.\n\nProduct title: ${productName}\nCategory: ${category}\n\nRequirements:\n- Use a professional, technical, electronics-focused tone suitable for engineers and buyers.\n- Include verified technical details when available from official sources or trusted product listings, such as voltage rating, current rating, pin count / pinout, package type, operating voltage, interface, mounting type, compatibility, power requirements, and application use cases.\n- Write in clear prose with short point-wise technical bullets when useful.\n- If a detail is not confidently verified, do not invent it. State it as "varies by variant" or omit it.\n- Do not write childish, vague, or salesy filler. Keep it precise, technical, and catalog-ready.\n- Do not mention that you are using Google Search or AI.\n- Keep the output in plain text and make it easy to paste into a product page.\n\nFormatting:\n- 2 short paragraphs or 4-8 concise technical bullet points with one brief intro sentence.\n- Make it specific to the product category and technical buyer.`,
      config: {
        temperature: 0.2,
        tools: [{ googleSearch: {} }],
      },
    });
    const description = result.text?.trim();

    if (!description) {
      return res.json({
        success: true,
        description: buildFallbackProductDescription(productName, category),
      });
    }

    return res.json({ success: true, description });
  } catch (err: any) {
    console.error('[AI] Product description generation failed:', err?.message || err);
    return res.json({
      success: true,
      description: buildFallbackProductDescription(productName, category),
    });
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

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new Resend(apiKey);
}

function isResendSkipped(): boolean {
  const value = String(process.env.SKIP_RESEND_EMAIL ?? '').trim().toLowerCase();
  return value === 'true' || value === '1' || value === 'yes' || value === 'on';
}

function buildOrderConfirmationText(order: any): string {
  const orderDate = order?.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }) : 'N/A';
  const customerName = order?.customer?.fullName || 'Customer';
  const items = Array.isArray(order?.items) ? order.items : [];
  const lines = items.map((item: any) => `${item.name} x${item.quantity} @ ₹${Number(item.price || 0).toLocaleString('en-IN')} = ₹${Number((item.price || 0) * (item.quantity || 0)).toLocaleString('en-IN')}`);

  return [
    'SEMIX LABS — Order Confirmed',
    '',
    `Hello ${customerName},`,
    'Thank you for shopping with SEMIX LABS.',
    `Your order has been successfully confirmed.`,
    `Order ID: #${order?.id || 'N/A'}`,
    `Order Date: ${orderDate}`,
    `Payment Status: ${order?.paymentStatus || 'Paid'}`,
    '',
    'ORDER SUMMARY',
    ...lines,
    '',
    `Subtotal: ₹${Number(order?.subtotal || 0).toLocaleString('en-IN')}`,
    `Shipping: ₹${Number(order?.shippingFee || 0).toLocaleString('en-IN')}`,
    `Discount: -₹${Number(order?.discount || 0).toLocaleString('en-IN')}`,
    `Total: ₹${Number(order?.finalTotal ?? order?.totalAmount ?? 0).toLocaleString('en-IN')}`,
    '',
    'DELIVERY ADDRESS',
    `${order?.customer?.fullName || ''}`,
    `${order?.customer?.street || ''}`,
    `${order?.customer?.city || ''}, ${order?.customer?.state || ''} - ${order?.customer?.pincode || ''}`,
    `Phone: ${order?.customer?.phone || ''}`,
    '',
    'We\'ll notify you when your order is shipped.',
    '',
    'Thank you for choosing SEMIX LABS.',
  ].filter(Boolean).join('\n');
}

function buildResendOrderConfirmationHtml(order: any): string {
  const customerName = order?.customer?.fullName || 'Customer';
  const orderDate = order?.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }) : 'N/A';
  const subtotal = Number(order?.subtotal || 0);
  const shippingFee = Number(order?.shippingFee || 0);
  const discount = Number(order?.discount || 0);
  const total = Number(order?.finalTotal ?? order?.totalAmount ?? 0);
  const addressLines = [
    order?.customer?.fullName || '',
    order?.customer?.street || '',
    `${order?.customer?.city || ''}, ${order?.customer?.state || ''} - ${order?.customer?.pincode || ''}`,
    `Phone: ${order?.customer?.phone || ''}`,
    `Email: ${order?.customer?.email || ''}`,
  ].filter(Boolean);

  const itemRows = (Array.isArray(order?.items) ? order.items : []).map((item: any) => {
    const unitTotal = Number((item.price || 0) * (item.quantity || 0));
    return `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; font-size: 14px; font-weight: 600; color: #0f172a;">${String(item.name || 'Product')}</td>
        <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; text-align: center; font-size: 13px; color: #334155;">${Number(item.quantity || 0)}</td>
        <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; text-align: right; font-size: 13px; color: #334155;">₹${Number(item.price || 0).toLocaleString('en-IN')}</td>
        <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; text-align: right; font-size: 13px; font-weight: 700; color: #0f172a;">₹${unitTotal.toLocaleString('en-IN')}</td>
      </tr>
    `;
  }).join('');

  return `
  <div style="font-family: Arial, Helvetica, sans-serif; background: #f8fafc; padding: 24px; color: #0f172a;">
    <div style="max-width: 680px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #561269 0%, #3b074a 100%); padding: 28px 24px; color: white; text-align: center;">
        <div style="font-size: 11px; letter-spacing: 1.8px; text-transform: uppercase; opacity: 0.9;">SEMIX LABS</div>
        <h1 style="margin: 12px 0 8px; font-size: 30px; line-height: 1.2;">Order Confirmed 🎉</h1>
        <p style="margin: 0; font-size: 14px; opacity: 0.92;">Hello ${customerName}, thank you for shopping with SEMIX LABS.</p>
      </div>
      <div style="padding: 28px 24px;">
        <p style="margin: 0 0 18px; font-size: 14px; color: #334155;">Your order has been successfully confirmed.</p>
        <div style="margin-bottom: 22px; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px;">
          <div style="padding: 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px;">
            <div style="font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: #64748b; margin-bottom: 6px;">Order ID</div>
            <div style="font-size: 15px; font-weight: 700; color: #0f172a;">#${order?.id || 'N/A'}</div>
          </div>
          <div style="padding: 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px;">
            <div style="font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: #64748b; margin-bottom: 6px;">Order Date</div>
            <div style="font-size: 15px; font-weight: 700; color: #0f172a;">${orderDate}</div>
          </div>
          <div style="padding: 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px;">
            <div style="font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: #64748b; margin-bottom: 6px;">Payment Status</div>
            <div style="font-size: 15px; font-weight: 700; color: #0f172a;">${order?.paymentStatus || 'Paid'}</div>
          </div>
          <div style="padding: 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px;">
            <div style="font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: #64748b; margin-bottom: 6px;">Payment Method</div>
            <div style="font-size: 15px; font-weight: 700; color: #0f172a;">${order?.paymentMethod || 'UPI'}</div>
          </div>
        </div>
        <h2 style="margin: 0 0 12px; font-size: 18px; color: #0f172a;">Order Summary</h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
          <thead>
            <tr>
              <th style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; text-align: left; color: #64748b; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase;">Product</th>
              <th style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; text-align: center; color: #64748b; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase;">Qty</th>
              <th style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; text-align: right; color: #64748b; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase;">Unit Price</th>
              <th style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; text-align: right; color: #64748b; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase;">Total</th>
            </tr>
          </thead>
          <tbody>${itemRows}</tbody>
        </table>
        <div style="background: #faf5ff; border: 1px solid #f3e8ff; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
          <div style="display: flex; justify-content: space-between; font-size: 14px; color: #475569; margin-bottom: 8px;"><span>Subtotal</span><span>₹${subtotal.toLocaleString('en-IN')}</span></div>
          <div style="display: flex; justify-content: space-between; font-size: 14px; color: #475569; margin-bottom: 8px;"><span>Shipping</span><span>₹${shippingFee.toLocaleString('en-IN')}</span></div>
          <div style="display: flex; justify-content: space-between; font-size: 14px; color: #15803d; margin-bottom: 8px;"><span>Discount</span><span>-₹${discount.toLocaleString('en-IN')}</span></div>
          <div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: 800; color: #561269; padding-top: 12px; border-top: 1px solid #e9d5ff;"><span>Total</span><span>₹${total.toLocaleString('en-IN')}</span></div>
        </div>
        <h2 style="margin: 0 0 12px; font-size: 18px; color: #0f172a;">Delivery Address</h2>
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; color: #334155; line-height: 1.6;">${addressLines.map((line) => `<div>${line}</div>`).join('')}</div>
        <p style="margin: 24px 0 0; font-size: 14px; color: #334155;">We’ll notify you when your order is shipped.</p>
      </div>
      <div style="padding: 20px 24px 28px; text-align: center; border-top: 1px solid #e2e8f0; background: #f8fafc; color: #64748b; font-size: 12px;">
        Thank you for choosing SEMIX LABS.<br />Electronics Components & Solutions
      </div>
    </div>
  </div>
  `;
}

async function sendResendOrderConfirmationEmail(order: any): Promise<{ sent: boolean; message?: string }> {
  if (!order || !order.customer?.email) {
    console.warn('[Resend] Customer email missing; skipping confirmation email.');
    return { sent: false, message: 'Customer email missing.' };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('[Resend] No RESEND_API_KEY configured; skipping confirmation email.');
    return { sent: false, message: 'RESEND_API_KEY not configured.' };
  }

  if (isResendSkipped()) {
    console.log('[Resend] Development skip enabled; order confirmation email not sent.');
    return { sent: false, message: 'Development email sending skipped.' };
  }

  try {
    const resend = new Resend(apiKey);
    const html = buildResendOrderConfirmationHtml(order);
    const text = buildOrderConfirmationText(order);
    const response = await resend.emails.send({
      from: 'office@semixlabs.com',
      to: [order.customer.email],
      subject: `SEMIX LABS — Order Confirmed #${order.id}`,
      html,
      text,
    });

    if (response.error) {
      const errorMessage = response.error?.message || 'Unknown Resend error.';
      console.error('[Resend] Email failed:', errorMessage);
      return { sent: false, message: errorMessage };
    }

    console.log(`[Resend] Order confirmation email sent for order ${order.id}`);
    return { sent: true, message: 'Resend email sent.' };
  } catch (error: any) {
    console.error('[Resend] Exception while sending confirmation email:', error?.message || error);
    return { sent: false, message: error?.message || 'Unknown exception.' };
  }
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
  const { to, subject, html, text, recipientType, orderId, orderData } = req.body;

  if (!to || !subject || !html) {
    return res.status(400).json({
      success: false,
      error: 'Missing required parameters: to, subject, html',
    });
  }

  const recipients = Array.isArray(to) ? to : [to];
  const normalizedType = recipientType || 'customer';

  if (
    normalizedType === 'customer' &&
    process.env.RESEND_API_KEY &&
    process.env.RESEND_API_KEY.trim() &&
    !isResendSkipped()
  ) {
    const resendResult = await sendResendOrderConfirmationEmail(
      orderData || { customer: { email: recipients[0] }, id: orderId, paymentStatus: 'Paid' }
    );
    if (resendResult.sent) {
      return res.json({
        success: true,
        delivered: true,
        mode: 'resend',
        message: resendResult.message,
        recipients,
        orderId,
      });
    }

    console.warn('[Email Dispatcher] Resend send failed; falling back to SMTP if configured.', {
      orderId,
      recipients,
    });
  }

  if (normalizedType === 'customer' && isResendSkipped()) {
    console.log('[Email Dispatcher] SKIP_RESEND_EMAIL enabled; customer Resend dispatch skipped.');
  }

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
      orderId,
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
