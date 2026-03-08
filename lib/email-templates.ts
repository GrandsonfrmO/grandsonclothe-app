// Email template utilities and constants

export const EMAIL_CONFIG = {
  brandName: 'Grandson Gree',
  brandColor: '#000000',
  accentColor: '#0066cc',
  successColor: '#28a745',
  warningColor: '#ffc107',
};

export const emailStyles = `
  body { 
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    color: #333;
    line-height: 1.6;
  }
  .container { 
    max-width: 600px; 
    margin: 0 auto; 
    padding: 20px; 
  }
  .header { 
    background-color: #f8f9fa; 
    padding: 20px; 
    border-radius: 8px; 
    margin-bottom: 20px; 
  }
  .section { 
    margin-bottom: 20px; 
  }
  .section-title { 
    font-size: 16px; 
    font-weight: bold; 
    margin-bottom: 10px; 
    color: #000;
  }
  table { 
    width: 100%; 
    border-collapse: collapse; 
  }
  th, td { 
    padding: 8px; 
    text-align: left; 
    border-bottom: 1px solid #eee; 
  }
  th { 
    background-color: #f8f9fa; 
    font-weight: bold; 
  }
  .total-row { 
    font-weight: bold; 
    font-size: 18px; 
  }
  .footer { 
    color: #666; 
    font-size: 12px; 
    margin-top: 30px; 
    padding-top: 20px; 
    border-top: 1px solid #eee; 
    text-align: center;
  }
  .button {
    display: inline-block;
    padding: 10px 20px;
    background-color: ${EMAIL_CONFIG.accentColor};
    color: white;
    text-decoration: none;
    border-radius: 4px;
    margin: 10px 0;
  }
  .success-badge {
    display: inline-block;
    background-color: ${EMAIL_CONFIG.successColor};
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: bold;
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
