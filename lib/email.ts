import { Resend } from 'resend';
import { emailStyles, getEmailHeader, getEmailFooter, formatCurrency, formatDate } from './email-templates';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOrderConfirmationEmail = async (
  email: string,
  orderData: {
    orderId: number;
    customerName: string;
    totalAmount: string;
    deliveryAddress: string;
    items: Array<{ productName: string; quantity: number; price: string }>;
  }
) => {
  const itemsHtml = orderData.items
    .map(
      (item) =>
        `<tr>
          <td>${item.productName}</td>
          <td style="text-align: center;">${item.quantity}</td>
          <td style="text-align: right;">${formatCurrency(item.price)}</td>
        </tr>`
    )
    .join('');

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>${emailStyles}</style>
      </head>
      <body>
        <div class="container">
          ${getEmailHeader(`Commande #${orderData.orderId}`, `Merci pour votre achat, ${orderData.customerName}!`)}

          <div class="section">
            <div class="section-title">Détails de la commande</div>
            <table>
              <thead>
                <tr>
                  <th>Produit</th>
                  <th style="text-align: center;">Quantité</th>
                  <th style="text-align: right;">Prix</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
                <tr class="total-row">
                  <td colspan="2" style="text-align: right;">Total:</td>
                  <td style="text-align: right;">${formatCurrency(orderData.totalAmount)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="section">
            <div class="section-title">Adresse de livraison</div>
            <p>${orderData.deliveryAddress}</p>
          </div>

          <div class="section">
            <div class="section-title">Mode de paiement</div>
            <p>Paiement à la livraison</p>
          </div>

          <div class="section">
            <p>Vous recevrez une notification SMS quand votre commande sera en route.</p>
          </div>

          ${getEmailFooter()}
        </div>
      </body>
    </html>
  `;

  try {
    const response = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'noreply@example.com',
      to: email,
      subject: `Confirmation de commande #${orderData.orderId}`,
      html,
    });
    console.log(`✓ Order confirmation email sent to ${email}`);
    return response;
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    throw error;
  }
};

export const sendPaymentConfirmationEmail = async (
  email: string,
  paymentData: {
    orderId: number;
    customerName: string;
    totalAmount: string;
    paymentDate: string;
  }
) => {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>${emailStyles}</style>
      </head>
      <body>
        <div class="container">
          <div class="header" style="background-color: #d4edda; border-left: 4px solid #28a745;">
            <div style="font-size: 32px; margin-bottom: 10px;">✓</div>
            <h2 style="margin: 0 0 10px 0;">Paiement confirmé</h2>
            <p style="margin: 0; color: #666;">Merci ${paymentData.customerName}, votre paiement a été reçu avec succès!</p>
          </div>

          <div class="section">
            <div class="section-title">Détails du paiement</div>
            <table>
              <tr>
                <td>Numéro de commande:</td>
                <td style="text-align: right;"><strong>#${paymentData.orderId}</strong></td>
              </tr>
              <tr>
                <td>Montant:</td>
                <td style="text-align: right;"><strong>${formatCurrency(paymentData.totalAmount)}</strong></td>
              </tr>
              <tr>
                <td>Date:</td>
                <td style="text-align: right;"><strong>${paymentData.paymentDate}</strong></td>
              </tr>
            </table>
          </div>

          <div class="section">
            <p>Votre commande est maintenant en cours de traitement. Vous recevrez une notification SMS dès qu'elle sera expédiée.</p>
          </div>

          ${getEmailFooter()}
        </div>
      </body>
    </html>
  `;

  try {
    const response = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'noreply@example.com',
      to: email,
      subject: `Confirmation de paiement - Commande #${paymentData.orderId}`,
      html,
    });
    console.log(`✓ Payment confirmation email sent to ${email}`);
    return response;
  } catch (error) {
    console.error('Error sending payment confirmation email:', error);
    throw error;
  }
};

export const sendShippingNotificationEmail = async (
  email: string,
  shippingData: {
    orderId: number;
    customerName: string;
    trackingNumber?: string;
    estimatedDelivery: string;
  }
) => {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>${emailStyles}</style>
      </head>
      <body>
        <div class="container">
          <div class="header" style="background-color: #e7f3ff; border-left: 4px solid #0066cc;">
            <h2 style="margin: 0 0 10px 0;">Votre commande est en route!</h2>
            <p style="margin: 0; color: #666;">Bonjour ${shippingData.customerName},</p>
          </div>

          <div class="section">
            <div class="section-title">Informations de livraison</div>
            <table>
              <tr>
                <td>Numéro de commande:</td>
                <td style="text-align: right;"><strong>#${shippingData.orderId}</strong></td>
              </tr>
              ${
                shippingData.trackingNumber
                  ? `<tr>
                <td>Numéro de suivi:</td>
                <td style="text-align: right;"><strong>${shippingData.trackingNumber}</strong></td>
              </tr>`
                  : ''
              }
              <tr>
                <td>Livraison estimée:</td>
                <td style="text-align: right;"><strong>${shippingData.estimatedDelivery}</strong></td>
              </tr>
            </table>
          </div>

          <div class="section">
            <p>Votre commande a été expédiée et est en route vers vous. Vous recevrez un SMS avec les détails du livreur.</p>
          </div>

          ${getEmailFooter()}
        </div>
      </body>
    </html>
  `;

  try {
    const response = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'noreply@example.com',
      to: email,
      subject: `Votre commande #${shippingData.orderId} est en route`,
      html,
    });
    console.log(`✓ Shipping notification email sent to ${email}`);
    return response;
  } catch (error) {
    console.error('Error sending shipping notification email:', error);
    throw error;
  }
};
