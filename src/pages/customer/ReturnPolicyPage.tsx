import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, PackageCheck, ShieldCheck, Truck } from 'lucide-react';

const policySections = [
  {
    title: 'Shipping Information',
    paragraphs: [
      'Customers can verify available shipping options and applicable shipping charges before placing an order. Shipping information is available while reviewing the cart and during checkout.',
      'Shipping charges and delivery options may depend on delivery location, order value, product weight, dimensions, and the applicable courier or logistics service.',
    ],
  },
  {
    title: 'Domestic Shipping - India',
    paragraphs: [
      'Semix Labs ships products across India using available courier and logistics partners. Depending on the delivery location and service availability, shipments may be handled through Blue Dart, DTDC, FedEx, Ecom Express, Delhivery, Ekart, or another suitable logistics partner.',
      'The available shipping service may vary by location. If a selected service is unavailable, Semix Labs may use another suitable service to fulfill the order. Standard domestic delivery generally takes approximately 1-7 working days, depending on the destination, courier service, product availability, and other logistical factors.',
    ],
  },
  {
    title: 'International Shipping',
    paragraphs: [
      'International shipping may be available for eligible products and destinations. Depending on the destination and availability, Semix Labs may use UPS, FedEx, DHL, or another suitable logistics provider.',
      'International shipping charges vary by destination, package weight, dimensions, and courier service. International delivery may generally take approximately 2-10 working days, but actual delivery times can vary.',
    ],
  },
  {
    title: 'Customs, Duties and Taxes',
    paragraphs: [
      'For international orders, customers may be responsible for customs duties, import taxes, local taxes, clearance charges, or other fees imposed by the destination country or courier. These charges are determined by the relevant authorities and are outside the control of Semix Labs.',
      'Customers are responsible for complying with applicable import requirements in their country. Semix Labs is not responsible for delays or additional charges caused by customs clearance, import restrictions, or unpaid duties and taxes.',
    ],
  },
  {
    title: 'Delivery Time',
    paragraphs: [
      'Estimated delivery times may vary because of customer location, product availability, order processing time, courier service, weather or natural events, public holidays, transportation delays, and customs clearance for international orders.',
    ],
    bullets: ['Domestic India: approximately 1-7 working days.', 'International: approximately 2-10 working days depending on destination and courier service.', 'These are estimates and are not guaranteed delivery dates.'],
  },
  {
    title: 'Warranty',
    paragraphs: [
      'Unless otherwise specified on the individual product page, products are covered by a minimum 15-day warranty against eligible manufacturing defects from the date of shipment or delivery, as applicable to the product.',
      'If a customer receives a defective product, they should contact Semix Labs customer support within the applicable warranty period. After reviewing the issue, Semix Labs may determine whether the appropriate resolution is replacement, repair, or refund.',
    ],
    bullets: ['Order number', 'Product details', 'Description of the problem', 'Clear photographs or videos showing the issue', 'Other information reasonably required for verification'],
    bulletIntro: 'Customers may be requested to provide:',
  },
  {
    title: 'Warranty Exclusions',
    paragraphs: [
      'Warranty does not normally cover damage caused by misuse, incorrect installation, incorrect electrical polarity, static discharge or ESD, negligence, accidents, physical damage, unauthorized modification, soldering or alteration, improper handling, or use outside the product\'s specified operating conditions.',
      'Customers should follow product specifications and installation instructions carefully. Products should be returned in their original packaging where reasonably possible, together with accessories and protective materials.',
    ],
  },
  {
    title: '5-Day Damage or Mismatch Reporting',
    paragraphs: [
      'Customers should report shipping damage, incorrect items, missing parts, or similar order-related issues to Semix Labs within 5 days from the date of delivery.',
      'Semix Labs may review the submitted information and determine the appropriate resolution. If an item is confirmed to be defective, damaged, incorrect, or missing components because of an issue attributable to fulfillment, Semix Labs may provide an appropriate replacement, repair, or refund, subject to verification.',
    ],
    bullets: ['Order number', 'Product name', 'Description of the issue', 'Clear photographs or videos of the package and product', 'Any other information requested by the support team'],
    bulletIntro: 'Please provide:',
  },
  {
    title: 'Return or Replacement Process',
    paragraphs: [
      'Before returning any product, customers should contact Semix Labs support and obtain return instructions. Where applicable, Semix Labs may issue a Return Merchandise Authorization (RMA) or another return reference.',
      'Customers should not send products back without receiving return instructions. Returned products may be inspected after receipt, and the final resolution may depend on the nature of the issue, product condition, warranty eligibility, and inspection results.',
    ],
  },
  {
    title: 'Return Conditions',
    paragraphs: [
      'Products eligible for return should generally meet the applicable return or warranty terms. Certain products may have specific return conditions stated on their individual product pages. In case of conflict, the product-specific return or warranty terms shown on the product page may apply.',
    ],
    bullets: ['Original order information is provided.', 'Original packaging is included where applicable.', 'Accessories and protective materials are included where applicable.', 'The product remains in the condition required under the applicable terms.'],
    bulletIntro: 'Products should generally be returned with:',
  },
  {
    title: 'Order Cancellation or Modification',
    paragraphs: [
      'Customers who want to change or cancel an order should contact Semix Labs as soon as possible through the official contact or support channel. Requests can only be accommodated if the order has not progressed too far in the fulfillment process.',
      'Once an order has been processed, packed, dispatched, or otherwise moved beyond the stage where modification is possible, cancellation or modification may not be available. Any applicable payment gateway, transaction, banking, or processing charges may be deducted where permitted and applicable.',
    ],
  },
  {
    title: 'Refunds',
    paragraphs: [
      'Where a refund is approved, it will generally be processed through the applicable payment method or another suitable method determined by Semix Labs. The time required for the refund to appear may depend on the payment gateway, bank, card issuer, or financial institution. Semix Labs does not control the processing time of external financial institutions.',
    ],
  },
  {
    title: 'Limitation of Responsibility',
    paragraphs: [
      'Semix Labs is not responsible for damage caused by improper installation, misuse, unauthorized modification, incorrect electrical connections, incorrect polarity, or operation outside the specifications provided for the product. Customers are responsible for ensuring that electronic components and equipment are installed and used correctly.',
    ],
  },
  {
    title: 'Important Note for Electronic Components',
    paragraphs: [
      'Because Semix Labs sells electronic components and related products, customers should verify product specifications, voltage and current ratings, polarity, dimensions, compatibility, package type, quantity, and other technical specifications before placing an order.',
      'Once a component has been soldered, modified, altered, damaged, or otherwise used outside its intended condition, it may not qualify for return or replacement unless the issue is covered by an applicable warranty or consumer protection requirement.',
    ],
  },
];

export const ReturnPolicyPage: React.FC = () => {
  useEffect(() => {
    const previousTitle = document.title;
    const description = 'Read the Semix Labs Return & Refund Policy covering product returns, replacements, warranty, refunds, shipping damage, order cancellation, and related conditions.';
    document.title = 'Return & Refund Policy | Semix Labs';

    let meta = document.querySelector('meta[name="description"]');
    const createdMeta = !meta;
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    const previousDescription = meta.getAttribute('content');
    meta.setAttribute('content', description);

    return () => {
      document.title = previousTitle;
      if (createdMeta) {
        meta?.remove();
      } else if (previousDescription !== null) {
        meta?.setAttribute('content', previousDescription);
      }
    };
  }, []);

  return (
    <div className="bg-slate-50/70">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#561269]/15 bg-[#561269]/5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#561269]">
              <ShieldCheck className="h-3.5 w-3.5" />
              Customer Policy
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">Return &amp; Refund Policy</h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              This policy describes the conditions under which customers can request returns, replacements, repairs, or refunds for products purchased from Semix Labs.
            </p>
            <div className="mt-8 grid gap-3 text-sm text-slate-600 sm:grid-cols-3">
              <div className="flex items-center gap-2"><Truck className="h-4 w-4 text-[#561269]" /> India and international delivery</div>
              <div className="flex items-center gap-2"><PackageCheck className="h-4 w-4 text-[#561269]" /> Product inspection when applicable</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#561269]" /> Support-led resolution process</div>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_220px] lg:items-start">
          <article className="space-y-8">
            {policySections.map((section) => (
              <section key={section.title} className="border-b border-slate-200 pb-8 last:border-b-0">
                <h2 className="text-xl font-bold text-slate-950 sm:text-2xl">{section.title}</h2>
                <div className="mt-4 space-y-4 text-sm leading-7 text-slate-600 sm:text-base">
                  {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  {section.bulletIntro && <p className="font-semibold text-slate-800">{section.bulletIntro}</p>}
                  {section.bullets && (
                    <ul className="list-disc space-y-2 pl-5 marker:text-[#561269]">
                      {section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
                    </ul>
                  )}
                </div>
              </section>
            ))}

            <section className="border-t border-slate-200 pt-8">
              <h2 className="text-xl font-bold text-slate-950 sm:text-2xl">Contact</h2>
              <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
                For return, replacement, warranty, cancellation, or refund-related questions, please contact Semix Labs through the official contact and support channel provided on the website.
              </p>
              <Link to="/contact" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#561269] hover:text-[#3f0d4d]">
                Contact Us &amp; Support <ArrowRight className="h-4 w-4" />
              </Link>
            </section>

            <p className="border-t border-slate-200 pt-6 text-xs leading-6 text-slate-500 sm:text-sm">
              Nothing in this policy is intended to limit any rights or remedies available to customers under applicable law.
            </p>
          </article>

          <aside className="hidden lg:block lg:sticky lg:top-28">
            <div className="border-l-2 border-[#561269]/20 pl-5">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Policy topics</p>
              <ul className="mt-4 space-y-3 text-sm text-slate-500">
                <li>Shipping and delivery</li>
                <li>Warranty coverage</li>
                <li>Returns and replacements</li>
                <li>Refunds and cancellations</li>
                <li>Electronic component care</li>
              </ul>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};
