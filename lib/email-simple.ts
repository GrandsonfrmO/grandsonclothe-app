import { Resend } from 'resend';
import { emailStyles, getEmailHeader, getEmailFooter, formatCurrency, formatDate } from './email-templates';

// Initialize Resend only if API key is available
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export const sendOrderConfirmationEmail = async (
  email: string,
  orderData: any
) => {
  try {
    if (!resend) {
      console.warn(`⚠️  Email service not configured. Skipping email to ${email}`);
      return { success: true, skipped: true };
    }
    
    const response = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: email,
      subject: `Confirmation de commande #${orderData.orderId}`,
      html: `<h1>Commande #${orderData.orderId}</h1><p>Merci pour votre achat!</p>`,
    });
    console.log(`✓ Order confirmation email sent to ${email}`);
    return response;
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    return { success: false, error };
  }
};

export const sendPaymentConfirmationEmail = async (
  email: string,
  paymentData: any
) => {
  try {
    if (!resend) {
      console.warn(`⚠️  Email service not configured. Skipping email to ${email}`);
      return { success: true, skipped: true };
    }
    
    const response = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'noreply@example.com',
      to: email,
      subject: `Confirmation de paiement - Commande #${paymentData.orderId}`,
      html: `<h1>Paiement confirmé</h1><p>Commande #${paymentData.orderId}</p>`,
    });
    console.log(`✓ Payment confirmation email sent to ${email}`);
    return response;
  } catch (error) {
    console.error('Error sending payment confirmation email:', error);
    return { success: false, error };
  }
};

export const sendShippingNotificationEmail = async (
  email: string,
  shippingData: any
) => {
  try {
    if (!resend) {
      console.warn(`⚠️  Email service not configured. Skipping email to ${email}`);
      return { success: true, skipped: true };
    }
    
    const response = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: email,
      subject: `Votre commande #${shippingData.orderId} est en route`,
      html: `<h1>Commande en route</h1><p>Commande #${shippingData.orderId}</p>`,
    });
    console.log(`✓ Shipping notification email sent to ${email}`);
    return response;
  } catch (error) {
    console.error('Error sending shipping notification email:', error);
    return { success: false, error };
  }
};

export const sendAdminOrderNotificationEmail = async (
  adminEmail: string,
  orderData: any
) => {
  try {
    if (!resend) {
      console.warn(`⚠️  Email service not configured. Skipping admin email to ${adminEmail}`);
      return { success: true, skipped: true };
    }
    
    const response = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: adminEmail,
      subject: `[ADMIN] Nouvelle commande #${orderData.orderId}`,
      html: `<h1>Nouvelle commande</h1><p>Commande #${orderData.orderId} de ${orderData.customerName}</p>`,
    });
    console.log(`✓ Admin notification email sent to ${adminEmail}`);
    return response;
  } catch (error) {
    console.error('Error sending admin notification email:', error);
    return { success: false, error };
  }
};
