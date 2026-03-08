// Quick test script for Resend email
import { sendOrderConfirmationEmail } from './lib/email';

async function testEmail() {
  try {
    console.log('🧪 Testing email service...\n');

    const result = await sendOrderConfirmationEmail('papicamara22@gmail.com', {
      orderId: 1,
      customerName: 'Test User',
      totalAmount: '150000',
      deliveryAddress: 'Rue de la Paix, Conakry',
      items: [
        {
          productName: 'T-shirt Premium',
          quantity: 2,
          price: '75000',
        },
      ],
    });

    console.log('✅ Email sent successfully!');
    console.log('Response:', result);
  } catch (error) {
    console.error('❌ Error sending email:', error);
    process.exit(1);
  }
}

testEmail();
