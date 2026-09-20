import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  query,
  orderBy,
  limit,
  doc,
  getDoc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Order, AvailableSeller } from '../types';

export interface SentEmailRecord {
  id: string;
  recipientType: 'customer' | 'admin' | 'seller';
  to: string[];
  recipientName: string;
  subject: string;
  html: string;
  orderId: string;
  status: 'queued' | 'sent' | 'delivered';
  timestamp: string;
}

const ADMIN_NOTIFICATION_EMAIL = 'aryangandhale27@gmail.com';
const APP_URL = window.location.origin;

/**
 * Modern, responsive inline styles for email templates
 */
const BRAND_PRIMARY = '#561269';
const BRAND_ACCENT = '#7e22ce';

/**
 * Generates an attractive, responsive HTML Email for Customer Order Confirmation
 */
export function generateCustomerOrderEmailHtml(order: Order): string {
  const customerName = order.customer.fullName || 'Valued Maker';
  const finalTotal = order.finalTotal !== undefined ? order.finalTotal : order.totalAmount;
  const isCod = order.paymentMethod === 'COD';
  const orderDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation #${order.id}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #1e293b;">
  <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #f1f5f9; padding: 32px 12px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table width="600" border="0" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0;">
          
          <!-- Header Bar -->
          <tr>
            <td style="background: linear-gradient(135deg, ${BRAND_PRIMARY} 0%, #3b074a 100%); padding: 36px 32px; text-align: center;">
              <table width="100%" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <div style="display: inline-block; background: rgba(255, 255, 255, 0.15); padding: 8px 16px; border-radius: 9999px; margin-bottom: 12px; border: 1px solid rgba(255, 255, 255, 0.2);">
                      <span style="color: #f3e8ff; font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase;">
                        SEMIX LABS • ROBOTICS & SEMICONDUCTORS
                      </span>
                    </div>
                    <h1 style="color: #ffffff; font-size: 26px; font-weight: 800; margin: 0 0 8px 0; letter-spacing: -0.5px;">
                      Order Confirmed! ⚡
                    </h1>
                    <p style="color: #e9d5ff; font-size: 14px; margin: 0; line-height: 1.5;">
                      Thank you for your order, <strong>${customerName}</strong>. Your hardware components are entering fulfillment.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Status Highlight Ribbon -->
          <tr>
            <td style="padding: 20px 32px; background-color: #faf5ff; border-bottom: 1px solid #f3e8ff;">
              <table width="100%" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="font-size: 13px; color: #6b21a8; font-weight: 600;">
                    Status: <span style="display: inline-block; padding: 4px 10px; background-color: #e9d5ff; color: #581c87; border-radius: 6px; font-size: 11px; font-weight: 700; text-transform: uppercase; margin-left: 6px;">
                      ${isCod ? 'Order Placed (COD)' : 'Payment Verified'}
                    </span>
                  </td>
                  <td align="right" style="font-size: 13px; color: #64748b;">
                    Reference: <strong style="color: #0f172a; font-family: monospace;">#${order.id}</strong>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 32px;">

              <!-- Key Order Details Grid -->
              <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; margin-bottom: 28px;">
                <tr>
                  <td width="33%" style="padding: 16px 20px; border-right: 1px solid #e2e8f0;">
                    <div style="font-size: 11px; font-weight: 600; color: #64748b; text-transform: uppercase; margin-bottom: 4px;">Order Date</div>
                    <div style="font-size: 13px; font-weight: 700; color: #0f172a;">${orderDate}</div>
                  </td>
                  <td width="33%" style="padding: 16px 20px; border-right: 1px solid #e2e8f0;">
                    <div style="font-size: 11px; font-weight: 600; color: #64748b; text-transform: uppercase; margin-bottom: 4px;">Payment Method</div>
                    <div style="font-size: 13px; font-weight: 700; color: #0f172a;">${order.paymentMethod}</div>
                  </td>
                  <td width="34%" style="padding: 16px 20px;">
                    <div style="font-size: 11px; font-weight: 600; color: #64748b; text-transform: uppercase; margin-bottom: 4px;">Tracking No.</div>
                    <div style="font-size: 12px; font-weight: 700; color: ${BRAND_PRIMARY}; font-family: monospace;">${order.trackingNumber || 'Assigned on Dispatch'}</div>
                  </td>
                </tr>
              </table>

              <!-- Component Items Heading -->
              <h3 style="font-size: 16px; font-weight: 700; color: #0f172a; margin: 0 0 16px 0; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px;">
                Hardware & Component Items (${order.items.reduce((sum, item) => sum + item.quantity, 0)})
              </h3>

              <!-- Items Table -->
              <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 24px; border-collapse: collapse;">
                <thead>
                  <tr style="border-bottom: 1px solid #e2e8f0;">
                    <th align="left" style="padding: 10px 0; font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase;">Component Details</th>
                    <th align="center" style="padding: 10px 12px; font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase;">Qty</th>
                    <th align="right" style="padding: 10px 0; font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase;">Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${order.items
                    .map(
                      (item) => `
                    <tr style="border-bottom: 1px solid #f1f5f9;">
                      <td style="padding: 14px 0; vertical-align: top;">
                        <div style="font-size: 14px; font-weight: 600; color: #0f172a; line-height: 1.4;">${item.name}</div>
                        ${
                          item.sku
                            ? `<span style="display: inline-block; font-size: 11px; font-family: monospace; color: #64748b; background-color: #f1f5f9; padding: 2px 6px; border-radius: 4px; margin-top: 4px;">SKU: ${item.sku}</span>`
                            : ''
                        }
                      </td>
                      <td align="center" style="padding: 14px 12px; font-size: 13px; font-weight: 600; color: #334155; vertical-align: top;">
                        ${item.quantity}
                      </td>
                      <td align="right" style="padding: 14px 0; font-size: 14px; font-weight: 700; color: #0f172a; font-family: monospace; vertical-align: top;">
                        ₹${(item.price * item.quantity).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  `
                    )
                    .join('')}
                </tbody>
              </table>

              <!-- Cost Summary Table -->
              <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #faf5ff; border-radius: 12px; border: 1px solid #f3e8ff; padding: 18px 24px; margin-bottom: 28px;">
                <tr>
                  <td style="padding: 6px 0; font-size: 13px; color: #475569;">Components Subtotal:</td>
                  <td align="right" style="padding: 6px 0; font-size: 13px; font-weight: 600; color: #1e293b; font-family: monospace;">₹${order.subtotal.toLocaleString('en-IN')}</td>
                </tr>
                ${
                  (order.discount || 0) > 0
                    ? `
                <tr>
                  <td style="padding: 6px 0; font-size: 13px; color: #15803d; font-weight: 600;">
                    Coupon Discount ${order.couponCode ? `(${order.couponCode})` : ''}:
                  </td>
                  <td align="right" style="padding: 6px 0; font-size: 13px; font-weight: 700; color: #15803d; font-family: monospace;">
                    -₹${(order.discount || 0).toLocaleString('en-IN')}
                  </td>
                </tr>`
                    : ''
                }
                <tr>
                  <td style="padding: 6px 0; font-size: 13px; color: #475569;">Shipping & Handling:</td>
                  <td align="right" style="padding: 6px 0; font-size: 13px; font-weight: 600; color: #1e293b; font-family: monospace;">
                    ${order.shippingFee === 0 ? '<span style="color: #15803d; font-weight: 700;">FREE</span>' : `₹${order.shippingFee}`}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-size: 13px; color: #475569;">GST / Tax (18%):</td>
                  <td align="right" style="padding: 6px 0; font-size: 13px; font-weight: 600; color: #1e293b; font-family: monospace;">₹${order.tax.toFixed(2)}</td>
                </tr>
                <tr>
                  <td colspan="2" style="padding: 8px 0;"><hr style="border: none; border-top: 1px dashed #d8b4fe; margin: 0;" /></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-size: 16px; font-weight: 800; color: ${BRAND_PRIMARY};">
                    Total Amount ${isCod ? '(Pay upon Delivery)' : '(Paid)'}:
                  </td>
                  <td align="right" style="padding: 8px 0; font-size: 20px; font-weight: 900; color: ${BRAND_PRIMARY}; font-family: monospace;">
                    ₹${Math.round(finalTotal).toLocaleString('en-IN')}
                  </td>
                </tr>
              </table>

              <!-- Delivery Address Block -->
              <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; margin-bottom: 32px;">
                <tr>
                  <td style="padding: 20px;">
                    <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 8px;">
                      📍 Delivery Destination & Contact
                    </div>
                    <div style="font-size: 14px; font-weight: 700; color: #0f172a; margin-bottom: 4px;">
                      ${order.customer.fullName}
                    </div>
                    <div style="font-size: 13px; color: #334155; line-height: 1.5;">
                      ${order.customer.street}<br/>
                      ${order.customer.city}, ${order.customer.state} - <strong>${order.customer.pincode}</strong><br/>
                      Phone: ${order.customer.phone} | Email: ${order.customer.email}
                    </div>
                    ${
                      order.packingNotes
                        ? `
                    <div style="margin-top: 12px; padding: 10px 12px; background-color: #eff6ff; border-radius: 6px; border-left: 3px solid #3b82f6; font-size: 12px; color: #1e40af;">
                      <strong>Special Packing Instructions:</strong> ${order.packingNotes}
                    </div>`
                        : ''
                    }
                  </td>
                </tr>
              </table>

              <!-- Call to Action Button -->
              <table width="100%" border="0" cellpadding="0" cellspacing="0" style="text-align: center;">
                <tr>
                  <td align="center">
                    <a href="${APP_URL}/customer" style="display: inline-block; background-color: ${BRAND_PRIMARY}; color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 700; padding: 14px 32px; border-radius: 12px; box-shadow: 0 4px 12px rgba(86, 18, 105, 0.25);">
                      Track Your Order Live →
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 24px 32px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="font-size: 12px; color: #64748b; margin: 0 0 6px 0;">
                All semiconductors & active components are packaged in ESD-safe anti-static shielding.
              </p>
              <p style="font-size: 11px; color: #94a3b8; margin: 0;">
                SEMIX LABS Pvt. Ltd. • GSTIN: 29AABCS1429B1ZB • Bengaluru Central Tech Park • <a href="${APP_URL}/contact" style="color: ${BRAND_PRIMARY}; text-decoration: none;">Support Desk</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}

/**
 * Generates an attractive HTML Email alert for Store Admins when an order is placed
 */
export function generateAdminOrderAlertHtml(order: Order): string {
  const finalTotal = order.finalTotal !== undefined ? order.finalTotal : order.totalAmount;
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Admin Alert: New Order #${order.id}</title>
</head>
<body style="margin:0; padding:0; background-color: #0f172a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #334155;">
  <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #0f172a; padding: 32px 12px;">
    <tr>
      <td align="center">
        <table width="600" border="0" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #334155;">
          
          <!-- Admin Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1e1b4b 0%, #311042 100%); padding: 32px; text-align: left;">
              <div style="display: inline-block; background-color: #fbbf24; color: #78350f; font-size: 10px; font-weight: 800; padding: 4px 10px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;">
                ⚡ NEW INCOMING WEB ORDER
              </div>
              <h1 style="color: #ffffff; font-size: 24px; font-weight: 800; margin: 0 0 6px 0;">
                Order Received: #${order.id}
              </h1>
              <p style="color: #cbd5e1; font-size: 13px; margin: 0;">
                Gross Revenue: <strong style="color: #4ade80; font-family: monospace;">₹${Math.round(finalTotal).toLocaleString('en-IN')}</strong> • Payment: <strong>${order.paymentMethod} (${order.paymentStatus})</strong>
              </p>
            </td>
          </tr>

          <!-- Priority KPI Ribbon -->
          <tr>
            <td style="background-color: #f8fafc; padding: 16px 32px; border-bottom: 1px solid #e2e8f0;">
              <table width="100%" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="33%">
                    <span style="font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: 600;">Status</span><br/>
                    <strong style="color: #ea580c; font-size: 13px; text-transform: uppercase;">Pending Seller Assignment</strong>
                  </td>
                  <td width="33%">
                    <span style="font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: 600;">Components</span><br/>
                    <strong style="color: #0f172a; font-size: 13px;">${itemCount} Items (${order.items.length} SKUs)</strong>
                  </td>
                  <td width="34%" align="right">
                    <span style="font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: 600;">Coupon</span><br/>
                    <strong style="color: #7c3aed; font-size: 13px;">${order.couponCode || 'None'}</strong>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Admin Details Body -->
          <tr>
            <td style="padding: 28px 32px;">
              <h3 style="font-size: 14px; font-weight: 700; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 12px 0;">
                Customer & Destination
              </h3>
              <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; margin-bottom: 24px; font-size: 13px; line-height: 1.6;">
                <strong>${order.customer.fullName}</strong> (${order.customer.email})<br/>
                Phone: <strong>${order.customer.phone}</strong><br/>
                Ship To: ${order.customer.street}, ${order.customer.city}, ${order.customer.state} - ${order.customer.pincode}
              </div>

              <h3 style="font-size: 14px; font-weight: 700; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 12px 0;">
                Ordered Component SKUs
              </h3>
              <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                ${order.items
                  .map(
                    (item) => `
                  <tr style="border-bottom: 1px solid #f1f5f9;">
                    <td style="padding: 8px 0; font-size: 13px; color: #0f172a;">
                      <strong>${item.quantity}x</strong> ${item.name}
                      <span style="color: #64748b; font-family: monospace; font-size: 11px; margin-left: 6px;">[${item.sku}]</span>
                    </td>
                    <td align="right" style="padding: 8px 0; font-size: 13px; font-weight: 700; font-family: monospace;">
                      ₹${(item.price * item.quantity).toLocaleString('en-IN')}
                    </td>
                  </tr>
                `
                  )
                  .join('')}
              </table>

              <!-- Action Button for Admin -->
              <table width="100%" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding-top: 12px;">
                    <a href="${APP_URL}/admin" style="display: inline-block; background-color: ${BRAND_PRIMARY}; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 700; padding: 12px 28px; border-radius: 10px; box-shadow: 0 4px 10px rgba(86, 18, 105, 0.2);">
                      Open Admin Portal & Assign Seller Hub →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Admin Footer -->
          <tr>
            <td style="background-color: #f1f5f9; padding: 16px 32px; text-align: center; font-size: 11px; color: #64748b;">
              SEMIX LABS Central Cloud Notification System • Auto-generated for Store Superadmins
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}

/**
 * Generates an attractive HTML Email for Seller Hub when an order is assigned
 */
export function generateSellerAssignmentEmailHtml(
  order: Order,
  seller: AvailableSeller,
  customNotes?: string
): string {
  const sellerName = seller.name || 'Fulfillment Partner';
  const warehouseHub = seller.warehouseHub || 'Assigned Regional Hub';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Order Assigned for Fulfillment #${order.id}</title>
</head>
<body style="margin:0; padding:0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1e293b;">
  <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #f1f5f9; padding: 32px 12px;">
    <tr>
      <td align="center">
        <table width="600" border="0" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); padding: 36px 32px; text-align: left;">
              <div style="display: inline-block; background-color: #f59e0b; color: #451a03; font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;">
                📦 DISPATCH PRIORITY: SAME-DAY
              </div>
              <h1 style="color: #ffffff; font-size: 24px; font-weight: 800; margin: 0 0 6px 0;">
                New Order Assigned: #${order.id}
              </h1>
              <p style="color: #94a3b8; font-size: 14px; margin: 0;">
                Allocated to <strong>${sellerName}</strong> • Hub: <strong style="color: #38bdf8;">${warehouseHub}</strong>
              </p>
            </td>
          </tr>

          <!-- Dispatch SLA Ribbon -->
          <tr>
            <td style="background-color: #fffbeb; padding: 16px 32px; border-bottom: 1px solid #fef3c7;">
              <table width="100%" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="font-size: 13px; color: #92400e; font-weight: 600;">
                    ⏰ <strong>SLA Requirement:</strong> Pick, pack, and generate courier manifest within 4 business hours.
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Pick List Table -->
          <tr>
            <td style="padding: 28px 32px;">
              <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 12px;">
                <h3 style="font-size: 15px; font-weight: 700; color: #0f172a; margin: 0; text-transform: uppercase;">
                  Picking List & Quantity
                </h3>
              </div>

              <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 24px; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
                <thead style="background-color: #f8fafc;">
                  <tr style="border-bottom: 1px solid #e2e8f0;">
                    <th align="left" style="padding: 10px 14px; font-size: 11px; font-weight: 700; color: #475569; text-transform: uppercase;">Component SKU & Name</th>
                    <th align="center" style="padding: 10px 14px; font-size: 11px; font-weight: 700; color: #475569; text-transform: uppercase;">Pick Qty</th>
                  </tr>
                </thead>
                <tbody>
                  ${order.items
                    .map(
                      (item) => `
                    <tr style="border-bottom: 1px solid #f1f5f9;">
                      <td style="padding: 12px 14px; font-size: 13px; color: #0f172a;">
                        <strong>${item.name}</strong><br/>
                        <span style="font-family: monospace; font-size: 11px; color: #64748b;">SKU: ${item.sku || 'N/A'}</span>
                      </td>
                      <td align="center" style="padding: 12px 14px; font-size: 15px; font-weight: 800; color: #0f172a; font-family: monospace;">
                        ${item.quantity}
                      </td>
                    </tr>
                  `
                    )
                    .join('')}
                </tbody>
              </table>

              <!-- Customer Packing Instructions & Shipping Details -->
              <div style="background-color: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; padding: 16px; margin-bottom: 24px;">
                <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 6px;">
                  Destination Details
                </div>
                <div style="font-size: 13px; color: #334155; line-height: 1.5;">
                  <strong>Recipient:</strong> ${order.customer.fullName}<br/>
                  <strong>Destination:</strong> ${order.customer.city}, ${order.customer.state} (${order.customer.pincode})<br/>
                  <strong>Courier Service:</strong> ${order.courier || 'BlueDart / Delhivery Surface Express'}
                </div>
                ${
                  customNotes || order.packingNotes
                    ? `
                <div style="margin-top: 10px; padding: 8px 10px; background-color: #eff6ff; border-radius: 4px; font-size: 12px; color: #1e40af;">
                  <strong>Admin Operations Note:</strong> ${customNotes || order.packingNotes}
                </div>`
                    : ''
                }
              </div>

              <!-- Button to Open Seller Dashboard -->
              <table width="100%" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="${APP_URL}/seller" style="display: inline-block; background-color: ${BRAND_PRIMARY}; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 700; padding: 14px 32px; border-radius: 10px; box-shadow: 0 4px 12px rgba(86, 18, 105, 0.2);">
                      Open Today's Pack List & Print Packing Slip →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Seller Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 16px 32px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0;">
              Ensure ESD compliance, bubble packing, and clear thermal barcode label placement.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}

/**
 * Generates an attractive, responsive HTML Email for New Customer Registration Welcome
 */
export function generateWelcomeEmailHtml(name: string, email: string): string {
  const cleanName = name || 'Valued Maker';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Welcome to SEMIX LABS!</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #f1f5f9; padding: 32px 12px;">
    <tr>
      <td align="center">
        <table width="600" border="0" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0;">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, ${BRAND_PRIMARY} 0%, #311042 100%); padding: 36px 32px; text-align: center;">
              <div style="display: inline-block; background: rgba(255, 255, 255, 0.15); padding: 8px 16px; border-radius: 9999px; margin-bottom: 12px; border: 1px solid rgba(255, 255, 255, 0.2);">
                <span style="color: #f3e8ff; font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase;">
                  SEMIX LABS • ROBOTICS & SEMICONDUCTORS
                </span>
              </div>
              <h1 style="color: #ffffff; font-size: 26px; font-weight: 800; margin: 0 0 8px 0; letter-spacing: -0.5px;">
                Welcome to SEMIX LABS, ${cleanName}! 🚀
              </h1>
              <p style="color: #e9d5ff; font-size: 14px; margin: 0; line-height: 1.5;">
                Your maker account for <strong>${email}</strong> has been successfully registered and initialized.
              </p>
            </td>
          </tr>

          <!-- Welcome Ribbon -->
          <tr>
            <td style="padding: 20px 32px; background-color: #faf5ff; border-bottom: 1px solid #f3e8ff;">
              <table width="100%" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="font-size: 13px; color: #6b21a8; font-weight: 600;">
                    Status: <span style="display: inline-block; padding: 4px 10px; background-color: #dcfce7; color: #166534; border-radius: 6px; font-size: 11px; font-weight: 700; text-transform: uppercase; margin-left: 6px;">
                      Active Verified Maker
                    </span>
                  </td>
                  <td align="right" style="font-size: 13px; color: #64748b;">
                    Member ID: <strong style="color: #0f172a; font-family: monospace;">#MKR-${Math.floor(1000 + Math.random() * 9000)}</strong>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 32px;">
              <p style="font-size: 14px; line-height: 1.6; color: #334155; margin-top: 0;">
                You now have direct access to India's premier hardware & robotics component supply chain. From microcontrollers (ESP32, Raspberry Pi, STM32) to industrial motor drivers, LiDAR sensors, and ESD-protected semiconductors.
              </p>

              <!-- Special Maker Gift Coupon Card -->
              <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #fdf4ff 0%, #fae8ff 100%); border: 2px dashed #d946ef; border-radius: 12px; padding: 20px 24px; margin: 24px 0;">
                <tr>
                  <td>
                    <div style="font-size: 11px; font-weight: 800; color: #a21caf; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">
                      🎁 Special Welcome Gift For You
                    </div>
                    <div style="font-size: 18px; font-weight: 800; color: #701a75; margin-bottom: 4px;">
                      10% Off Your First Component Order
                    </div>
                    <div style="font-size: 13px; color: #86198f; margin-bottom: 12px;">
                      Use coupon code at checkout:
                    </div>
                    <div style="display: inline-block; background-color: #ffffff; border: 1px solid #f0abfc; padding: 8px 18px; border-radius: 8px; font-family: monospace; font-size: 16px; font-weight: 800; color: #561269; letter-spacing: 1.5px;">
                      WELCOME10
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Perks Grid -->
              <h3 style="font-size: 15px; font-weight: 700; color: #0f172a; margin: 0 0 14px 0;">
                Your Maker Account Benefits:
              </h3>
              <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 28px;">
                <tr>
                  <td width="50%" style="padding: 10px 12px 10px 0; vertical-align: top;">
                    <div style="font-size: 13px; font-weight: 700; color: #0f172a;">⚡ Instant Dispatch SLA</div>
                    <div style="font-size: 12px; color: #64748b; line-height: 1.4;">Orders processed by regional seller hubs within 4 hours.</div>
                  </td>
                  <td width="50%" style="padding: 10px 0 10px 12px; vertical-align: top;">
                    <div style="font-size: 13px; font-weight: 700; color: #0f172a;">🛡️ 100% Genuine Silicon</div>
                    <div style="font-size: 12px; color: #64748b; line-height: 1.4;">Tested & shipped in ESD antistatic protective packaging.</div>
                  </td>
                </tr>
              </table>

              <!-- Action Button -->
              <table width="100%" border="0" cellpadding="0" cellspacing="0" style="text-align: center;">
                <tr>
                  <td align="center">
                    <a href="${APP_URL}/catalog" style="display: inline-block; background-color: ${BRAND_PRIMARY}; color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 700; padding: 14px 32px; border-radius: 12px; box-shadow: 0 4px 12px rgba(86, 18, 105, 0.25);">
                      Explore Catalog & Build Your Project →
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 24px 32px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="font-size: 12px; color: #64748b; margin: 0 0 6px 0;">
                Need custom project development, bill of materials (BOM), or bulk PCB assembly?
              </p>
              <p style="font-size: 11px; color: #94a3b8; margin: 0;">
                SEMIX LABS Pvt. Ltd. • Bengaluru Central Tech Park • <a href="${APP_URL}/contact" style="color: ${BRAND_PRIMARY}; text-decoration: none;">Contact Engineering Team</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}

// Local cache for in-app demo preview and instant feedback
let localSentEmails: SentEmailRecord[] = [];

/**
 * Helper to dispatch email via the server-side API (which connects to live SMTP if configured)
 */
async function dispatchViaServerApi(record: SentEmailRecord, order?: Order): Promise<{ delivered: boolean; message?: string }> {
  try {
    const res = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: record.to,
        subject: record.subject,
        html: record.html,
        recipientType: record.recipientType,
        orderId: record.orderId,
        orderData: order || undefined,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      return { delivered: Boolean(data.delivered), message: data.message };
    }
  } catch (e) {
    console.warn('[EmailService] Server dispatch notice (offline/local):', e);
  }
  return { delivered: false };
}

/**
 * Checks server SMTP configuration status
 */
export async function checkServerEmailStatus(): Promise<{
  configured: boolean;
  provider?: string;
  user?: string | null;
  message?: string;
}> {
  try {
    const res = await fetch('/api/email-status');
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Offline / Client fallback
  }
  return {
    configured: false,
    message: 'Server endpoint unreachable or running in static client mode.',
  };
}

/**
 * Dispatches a Welcome Email to a newly registered user
 */
export async function sendWelcomeEmail(user: {
  name: string;
  email: string;
}): Promise<SentEmailRecord> {
  const now = new Date().toISOString();
  const html = generateWelcomeEmailHtml(user.name, user.email);
  const subject = `🚀 Welcome to SEMIX LABS, ${user.name}! (Maker Account Activated)`;

  const record: SentEmailRecord = {
    id: `email-welcome-${Date.now()}`,
    recipientType: 'customer',
    to: [user.email],
    recipientName: user.name,
    subject,
    html,
    orderId: 'REGISTRATION',
    status: 'queued',
    timestamp: now,
  };

  // Add to local preview cache immediately
  localSentEmails = [record, ...localSentEmails];

  // 1. Dispatch via Server API (handles real SMTP delivery if configured)
  dispatchViaServerApi(record).then((res) => {
    if (res.delivered) {
      record.status = 'delivered';
    }
  });

  // 2. Queue in Firestore 'mail' collection (for Firebase Trigger Email extension)
  try {
    const mailCol = collection(db, 'mail');
    await addDoc(mailCol, {
      to: record.to,
      message: {
        subject: record.subject,
        html: record.html,
      },
      recipientType: record.recipientType,
      recipientName: record.recipientName,
      orderId: 'REGISTRATION',
      status: 'queued',
      createdAt: serverTimestamp(),
    });
    console.log(`[EmailService] Welcome email queued in Firestore 'mail' collection for ${user.email}`);
  } catch (err) {
    console.warn('[EmailService] Firestore mail queue deferred:', err);
  }

  return record;
}

/**
 * Generates a direct 1-click web compose link to open this email in Gmail
 */
export function getGmailComposeUrl(email: SentEmailRecord): string {
  const recipient = email.to.join(',');
  const subject = email.subject;
  // Create plain text fallback summary
  const bodyText = `Hello ${email.recipientName},\n\nThis is your automated transactional notification from SEMIX LABS regarding ${email.orderId === 'REGISTRATION' ? 'your account registration' : `Order #${email.orderId}`}.\n\nPlease find the complete details below:\nSubject: ${email.subject}\nRecipient: ${recipient}\n\nSEMIX LABS Central Dispatch & Robotics Supply\nBengaluru, India`;

  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    recipient
  )}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;
}

/**
 * Exports and downloads the email as an .eml file that can be opened in Apple Mail, Outlook, or Thunderbird
 */
export function downloadEmailAsEml(email: SentEmailRecord) {
  const boundary = '----=_Part_0_' + Date.now();
  const dateStr = new Date(email.timestamp).toUTCString();
  const fromStr = 'SEMIX LABS <noreply@semixlabs.com>';
  const toStr = email.to.join(', ');

  const emlContent = [
    `From: ${fromStr}`,
    `To: ${toStr}`,
    `Subject: ${email.subject}`,
    `Date: ${dateStr}`,
    `MIME-Version: 1.0`,
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    '',
    `--${boundary}`,
    `Content-Type: text/plain; charset=UTF-8`,
    `Content-Transfer-Encoding: 7bit`,
    '',
    `SEMIX LABS Transactional Email: ${email.subject}`,
    `Recipient: ${toStr}`,
    `Reference: ${email.orderId}`,
    '',
    `--${boundary}`,
    `Content-Type: text/html; charset=UTF-8`,
    `Content-Transfer-Encoding: 7bit`,
    '',
    email.html,
    '',
    `--${boundary}--`,
  ].join('\r\n');

  const blob = new Blob([emlContent], { type: 'message/rfc822' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${email.orderId}-${email.recipientType}-email.eml`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Sends/Queues emails for Order Placement:
 * 1. Customer Confirmation Email
 * 2. Admin Alert Email
 */
export async function sendOrderPlacedEmails(order: Order): Promise<{
  customerEmailSent: boolean;
  adminEmailSent: boolean;
  records: SentEmailRecord[];
}> {
  const records: SentEmailRecord[] = [];
  const now = new Date().toISOString();

  if (!order?.id) {
    console.warn('[EmailService] Missing order id; skipping order confirmation email.');
    return { customerEmailSent: false, adminEmailSent: false, records };
  }

  if (order.confirmationEmailSent) {
    console.log(`[EmailService] Skipping duplicate confirmation email for order ${order.id}.`);
    return { customerEmailSent: false, adminEmailSent: false, records };
  }

  try {
    const orderSnap = await getDoc(doc(db, 'orders', order.id));
    if (orderSnap.exists() && Boolean((orderSnap.data() as Partial<Order>)?.confirmationEmailSent)) {
      console.log(`[EmailService] Firestore indicates confirmation email already sent for order ${order.id}.`);
      return { customerEmailSent: false, adminEmailSent: false, records };
    }
  } catch (err) {
    console.warn('[EmailService] Duplicate-check read failed; continuing with send guard.', err);
  }

  let customerEmailSent = false;

  if (order.customer?.email) {
    const customerHtml = generateCustomerOrderEmailHtml(order);
    const customerSubject = `SEMIX LABS — Order Confirmed #${order.id}`;
    const customerRecord: SentEmailRecord = {
      id: `email-cust-${order.id}-${Date.now()}`,
      recipientType: 'customer',
      to: [order.customer.email],
      recipientName: order.customer.fullName,
      subject: customerSubject,
      html: customerHtml,
      orderId: order.id,
      status: 'queued',
      timestamp: now,
    };
    records.push(customerRecord);

    localSentEmails = [customerRecord, ...localSentEmails];

    const customerDispatch = await dispatchViaServerApi(customerRecord, order);
    if (customerDispatch.delivered) {
      customerEmailSent = true;
      customerRecord.status = 'delivered';
      try {
        await updateDoc(doc(db, 'orders', order.id), {
          confirmationEmailSent: true,
          confirmationEmailSentAt: new Date().toISOString(),
        });
      } catch (err) {
        console.warn(`[EmailService] Failed to mark order ${order.id} confirmationEmailSent flag:`, err);
      }
    } else {
      console.warn(`[EmailService] Customer confirmation email for order ${order.id} failed to dispatch.`);
    }
  } else {
    console.warn(`[EmailService] Customer email missing for order ${order.id}; customer confirmation email skipped.`);
  }

  const adminHtml = generateAdminOrderAlertHtml(order);
  const adminSubject = `🔔 [Admin Alert] New Order Received: #${order.id} (₹${(order.finalTotal || order.totalAmount).toLocaleString('en-IN')})`;
  const adminRecord: SentEmailRecord = {
    id: `email-admin-${order.id}-${Date.now()}`,
    recipientType: 'admin',
    to: [ADMIN_NOTIFICATION_EMAIL],
    recipientName: 'SEMIX LABS Admin Desk',
    subject: adminSubject,
    html: adminHtml,
    orderId: order.id,
    status: 'queued',
    timestamp: now,
  };
  records.push(adminRecord);

  localSentEmails = [...records, ...localSentEmails];

  const adminDispatch = await dispatchViaServerApi(adminRecord, order);
  if (adminDispatch.delivered) {
    adminRecord.status = 'delivered';
  }

  try {
    const mailCol = collection(db, 'mail');
    for (const rec of records) {
      await addDoc(mailCol, {
        to: rec.to,
        message: {
          subject: rec.subject,
          html: rec.html,
        },
        recipientType: rec.recipientType,
        recipientName: rec.recipientName,
        orderId: rec.orderId,
        status: 'queued',
        createdAt: serverTimestamp(),
      });
    }
    console.log(`[EmailService] Order emails queued in Firestore 'mail' collection for order ${order.id}`);
  } catch (err) {
    console.warn('[EmailService] Firestore mail queue deferred (offline/permission fallback):', err);
  }

  return {
    customerEmailSent,
    adminEmailSent: adminDispatch.delivered,
    records,
  };
}

/**
 * Sends/Queues email for Seller Assignment:
 * 3. Seller Order Assignment Email
 */
export async function sendSellerAssignmentEmail(
  order: Order,
  seller: AvailableSeller,
  customNotes?: string
): Promise<SentEmailRecord> {
  const now = new Date().toISOString();
  const sellerHtml = generateSellerAssignmentEmailHtml(order, seller, customNotes);
  const sellerSubject = `📦 Urgent Order Assigned: #${order.id} for Pack & Dispatch (${seller.warehouseHub})`;

  const record: SentEmailRecord = {
    id: `email-seller-${order.id}-${Date.now()}`,
    recipientType: 'seller',
    to: [seller.email || 'seller@semixlabs.com'],
    recipientName: seller.name || 'Merchant Partner',
    subject: sellerSubject,
    html: sellerHtml,
    orderId: order.id,
    status: 'queued',
    timestamp: now,
  };

  localSentEmails = [record, ...localSentEmails];

  // Dispatch via Server API (triggers real SMTP if configured)
  dispatchViaServerApi(record).then((res) => {
    if (res.delivered) {
      record.status = 'delivered';
    }
  });

  try {
    const mailCol = collection(db, 'mail');
    await addDoc(mailCol, {
      to: record.to,
      message: {
        subject: record.subject,
        html: record.html,
      },
      recipientType: record.recipientType,
      recipientName: record.recipientName,
      orderId: record.orderId,
      status: 'queued',
      createdAt: serverTimestamp(),
    });
    console.log(`[EmailService] Seller assignment email queued in Firestore 'mail' collection for order ${order.id}`);
  } catch (err) {
    console.warn('[EmailService] Firestore mail queue deferred (offline/permission fallback):', err);
  }

  return record;
}

/**
 * Returns all sent / queued transactional email records
 */
export function getLocalSentEmails(): SentEmailRecord[] {
  return localSentEmails;
}
