// Email template utilities and constants

export const EMAIL_CONFIG = {
  brandName: 'Grandson Gree',
  brandColor: '#000000',
  accentColor: '#0066cc',
  successColor: '#28a745',
  warningColor: '#ffc107',
};

export const emailStyles = `
  * { margin: 0; padding: 0; }
  body { 
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    color: #333;
    line-height: 1.6;
    background-color: #f5f5f5;
  }
  .container { 
    max-width: 600px; 
    margin: 0 auto; 
    padding: 0;
    background-color: #ffffff;
  }
  .header { 
    background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
    color: white;
    padding: 40px 20px;
    text-align: center;
    border-bottom: 4px solid ${EMAIL_CONFIG.accentColor};
  }
  .header h1 {
    font-size: 28px;
    margin-bottom: 10px;
    font-weight: bold;
  }
  .header p {
    font-size: 14px;
    opacity: 0.9;
  }
  .content {
    padding: 30px 20px;
  }
  .section { 
    margin-bottom: 30px; 
  }
  .section-title { 
    font-size: 16px; 
    font-weight: bold; 
    margin-bottom: 15px; 
    color: #000;
    border-bottom: 2px solid ${EMAIL_CONFIG.accentColor};
    padding-bottom: 10px;
  }
  .product-item {
    display: flex;
    gap: 15px;
    margin-bottom: 20px;
    padding: 15px;
    background-color: #f9f9f9;
    border-radius: 8px;
    border-left: 4px solid ${EMAIL_CONFIG.accentColor};
  }
  .product-image {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 4px;
    flex-shrink: 0;
  }
  .product-details {
    flex: 1;
  }
  .product-name {
    font-weight: bold;
    font-size: 14px;
    margin-bottom: 5px;
  }
  .product-quantity {
    font-size: 13px;
    color: #666;
    margin-bottom: 5px;
  }
  .product-price {
    font-size: 14px;
    font-weight: bold;
    color: ${EMAIL_CONFIG.accentColor};
  }
  table { 
    width: 100%; 
    border-collapse: collapse; 
  }
  th, td { 
    padding: 12px; 
    text-align: left; 
    border-bottom: 1px solid #eee; 
  }
  th { 
    background-color: #f8f9fa; 
    font-weight: bold;
    font-size: 13px;
  }
  td {
    font-size: 13px;
  }
  .total-row { 
    font-weight: bold; 
    font-size: 16px;
    background-color: #f0f0f0;
  }
  .info-box {
    background-color: #e7f3ff;
    border-left: 4px solid ${EMAIL_CONFIG.accentColor};
    padding: 15px;
    border-radius: 4px;
    margin-bottom: 15px;
    font-size: 13px;
  }
  .footer { 
    color: #999; 
    font-size: 11px; 
    padding: 20px;
    border-top: 1px solid #eee;
    text-align: center;
    background-color: #f9f9f9;
  }
  .button {
    display: inline-block;
    padding: 12px 24px;
    background-color: ${EMAIL_CONFIG.accentColor};
    color: white;
    text-decoration: none;
    border-radius: 4px;
    margin: 15px 0;
    font-weight: bold;
    font-size: 14px;
  }
  .success-badge {
    display: inline-block;
    background-color: ${EMAIL_CONFIG.successColor};
    color: white;
    padding: 6px 12px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: bold;
  }
  .divider {
    height: 1px;
    background-color: #eee;
    margin: 20px 0;
  }
`;

export function getEmailHeader(title: string, subtitle?: string) {
  return `
    <div class="header">
      <h1 style="margin: 0 0 10px 0; font-size: 24px;">${title}</h1>
      ${subtitle ? `<p style="margin: 0; color: #666;">${subtitle}</p>` : ''}
    </div>
  `;
}

export function getEmailFooter(companyName: string = EMAIL_CONFIG.brandName) {
  return `
    <div class="footer">
      <p style="margin: 10px 0;">© ${new Date().getFullYear()} ${companyName}. Tous droits réservés.</p>
      <p style="margin: 5px 0; color: #999; font-size: 11px;">
        Cet email a été envoyé à votre adresse email associée à votre compte.
      </p>
    </div>
  `;
}

export function formatCurrency(amount: string | number): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('fr-GN', {
    style: 'currency',
    currency: 'GNF',
    minimumFractionDigits: 0,
  }).format(num);
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
}

// Marketing email templates

export function getMarketingEmailTemplate(data: {
  type: 'newsletter' | 'promotion' | 'reactivation' | 'announcement';
  subject: string;
  content: string;
  customerName?: string;
  couponCode?: string;
  discountPercent?: number;
  productName?: string;
  productImage?: string;
  productPrice?: number;
  ctaText?: string;
  ctaUrl?: string;
}) {
  const { type, content, customerName, couponCode, discountPercent, productName, productImage, productPrice, ctaText, ctaUrl } = data;

  // Remplacer les variables dynamiques dans le contenu
  let processedContent = content
    .replace(/\{\{customerName\}\}/g, customerName || 'Cher client')
    .replace(/\{\{couponCode\}\}/g, couponCode || '')
    .replace(/\{\{discountPercent\}\}/g, discountPercent?.toString() || '')
    .replace(/\{\{productName\}\}/g, productName || '')
    .replace(/\{\{productPrice\}\}/g, productPrice ? formatCurrency(productPrice) : '');

  // Icône selon le type
  const typeIcons = {
    newsletter: '📰',
    promotion: '🎉',
    reactivation: '💝',
    announcement: '📢',
  };

  const icon = typeIcons[type] || '📧';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>${emailStyles}</style>
    </head>
    <body style="margin: 0; padding: 20px; background-color: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%); color: white; padding: 40px 20px; text-align: center; border-bottom: 4px solid ${EMAIL_CONFIG.accentColor};">
          <h1 style="margin: 0 0 10px 0; font-size: 28px; font-weight: bold;">${icon} ${EMAIL_CONFIG.brandName}</h1>
          <p style="margin: 0; font-size: 14px; opacity: 0.9;">Votre boutique de confiance</p>
        </div>

        <!-- Content -->
        <div style="padding: 30px 20px;">
          
          <!-- Greeting -->
          ${customerName ? `<p style="font-size: 16px; margin-bottom: 20px;">Bonjour <strong>${customerName}</strong>,</p>` : ''}
          
          <!-- Main Content -->
          <div style="font-size: 14px; color: #333; line-height: 1.8; margin-bottom: 25px;">
            ${processedContent}
          </div>

          ${couponCode ? `
          <!-- Coupon Code -->
          <div style="background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%); border: 2px dashed #ff6b00; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 25px;">
            <p style="margin: 0 0 10px 0; font-size: 14px; color: #333; font-weight: bold;">🎁 CODE PROMO EXCLUSIF</p>
            <div style="background-color: white; padding: 15px; border-radius: 4px; display: inline-block; margin: 10px 0;">
              <span style="font-size: 24px; font-weight: bold; color: #ff6b00; letter-spacing: 2px;">${couponCode}</span>
            </div>
            ${discountPercent ? `<p style="margin: 10px 0 0 0; font-size: 16px; color: #333; font-weight: bold;">-${discountPercent}% sur votre prochaine commande!</p>` : ''}
          </div>
          ` : ''}

          ${productImage && productName ? `
          <!-- Featured Product -->
          <div style="background-color: #f9f9f9; border-radius: 8px; padding: 20px; margin-bottom: 25px; text-align: center;">
            <img src="${productImage}" alt="${productName}" style="width: 200px; height: 200px; object-fit: cover; border-radius: 8px; margin-bottom: 15px;" />
            <h3 style="margin: 0 0 10px 0; font-size: 18px; color: #000;">${productName}</h3>
            ${productPrice ? `<p style="margin: 0 0 15px 0; font-size: 20px; font-weight: bold; color: ${EMAIL_CONFIG.accentColor};">${formatCurrency(productPrice)}</p>` : ''}
          </div>
          ` : ''}

          ${ctaText && ctaUrl ? `
          <!-- Call to Action -->
          <div style="text-align: center; margin: 30px 0;">
            <a href="${ctaUrl}" style="display: inline-block; padding: 15px 40px; background-color: ${EMAIL_CONFIG.accentColor}; color: white; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 16px;">
              ${ctaText}
            </a>
          </div>
          ` : ''}

        </div>

        <!-- Footer -->
        <div style="color: #999; font-size: 12px; padding: 20px; border-top: 1px solid #eee; text-align: center; background-color: #f9f9f9;">
          <p style="margin: 10px 0;">© ${new Date().getFullYear()} ${EMAIL_CONFIG.brandName}. Tous droits réservés.</p>
          <p style="margin: 5px 0; color: #999; font-size: 11px;">
            Vous recevez cet email car vous êtes inscrit à notre newsletter.
          </p>
          <p style="margin: 5px 0;">
            <a href="#" style="color: #999; text-decoration: underline;">Se désabonner</a>
          </p>
        </div>

      </div>
    </body>
    </html>
  `;
}

// Template pour newsletter
export function getNewsletterTemplate(data: {
  customerName: string;
  content: string;
  featuredProducts?: Array<{ name: string; image: string; price: number; url: string }>;
}) {
  const { customerName, content, featuredProducts } = data;

  const productsHtml = featuredProducts?.map(product => `
    <div style="display: inline-block; width: 180px; margin: 10px; vertical-align: top; text-align: center;">
      <img src="${product.image}" alt="${product.name}" style="width: 180px; height: 180px; object-fit: cover; border-radius: 8px; margin-bottom: 10px;" />
      <h4 style="margin: 0 0 5px 0; font-size: 14px; color: #000;">${product.name}</h4>
      <p style="margin: 0 0 10px 0; font-size: 16px; font-weight: bold; color: ${EMAIL_CONFIG.accentColor};">${formatCurrency(product.price)}</p>
      <a href="${product.url}" style="display: inline-block; padding: 8px 16px; background-color: ${EMAIL_CONFIG.accentColor}; color: white; text-decoration: none; border-radius: 4px; font-size: 12px;">
        Voir le produit
      </a>
    </div>
  `).join('') || '';

  return getMarketingEmailTemplate({
    type: 'newsletter',
    subject: 'Newsletter',
    content: content + (productsHtml ? `<div style="text-align: center; margin-top: 30px;"><h3 style="font-size: 18px; margin-bottom: 20px;">🌟 Produits en vedette</h3>${productsHtml}</div>` : ''),
    customerName,
  });
}

// Template pour promotion
export function getPromotionTemplate(data: {
  customerName: string;
  content: string;
  couponCode: string;
  discountPercent: number;
  expiryDate?: string;
}) {
  const { customerName, content, couponCode, discountPercent, expiryDate } = data;

  let finalContent = content;
  if (expiryDate) {
    finalContent += `<p style="margin-top: 15px; font-size: 13px; color: #666;"><strong>⏰ Offre valable jusqu'au ${expiryDate}</strong></p>`;
  }

  return getMarketingEmailTemplate({
    type: 'promotion',
    subject: 'Promotion spéciale',
    content: finalContent,
    customerName,
    couponCode,
    discountPercent,
    ctaText: 'Profiter de l\'offre',
    ctaUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  });
}

// Template pour réactivation
export function getReactivationTemplate(data: {
  customerName: string;
  daysSinceLastOrder: number;
  couponCode?: string;
}) {
  const { customerName, daysSinceLastOrder, couponCode } = data;

  const content = `
    <p>Cela fait ${daysSinceLastOrder} jours que nous ne vous avons pas vu! 😢</p>
    <p>Nous avons ajouté de nouveaux produits qui pourraient vous intéresser.</p>
    ${couponCode ? '<p><strong>Pour vous remercier de votre fidélité, voici un code promo exclusif:</strong></p>' : ''}
  `;

  return getMarketingEmailTemplate({
    type: 'reactivation',
    subject: 'Nous vous avons manqué!',
    content,
    customerName,
    couponCode,
    discountPercent: couponCode ? 15 : undefined,
    ctaText: 'Découvrir les nouveautés',
    ctaUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  });
}
