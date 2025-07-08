import { Handler } from '@netlify/functions';
import sgMail from '@sendgrid/mail';

// Initialize SendGrid with API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

const VERIFIED_SENDER = process.env.SENDGRID_VERIFIED_SENDER || 'noreply@imobiliarealtfel.ro';
const RECIPIENT_EMAIL = 'cordea@gmail.com';

export const handler: Handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    // Parse the incoming request body
    const payload = JSON.parse(event.body || '{}');
    const { formName, formData } = payload;

    if (!formData || !formName) {
      throw new Error('Missing required form data');
    }

    let emailSubject = '';
    let emailText = '';

    // Format email content based on form type
    if (formName === 'contact') {
      emailSubject = `Nou mesaj de contact - ${formData.subject || 'Imobiliare Altfel'}`;
      emailText = `
Detalii mesaj nou:

Nume: ${formData.name}
Email: ${formData.email}
Telefon: ${formData.phone}
Subiect: ${formData.subject}

Mesaj:
${formData.message}

Acest mesaj a fost trimis prin formularul de contact de pe imobiliarealtfel.ro
`;
    } else if (formName === 'sell-property') {
      emailSubject = `Nouă cerere de listare proprietate - ${formData.propertyType || 'Imobiliare Altfel'}`;
      emailText = `
Detalii proprietate nouă:

Tip Listare: ${formData.listingType === 'sale' ? 'Vânzare' : 'Închiriere'}
Tip Proprietate: ${formData.propertyType}
Adresă: ${formData.address}
Suprafață: ${formData.size}
Camere: ${formData.rooms}
An Construcție: ${formData.yearBuilt}
Stare: ${formData.condition}

Descriere:
${formData.description}

Informații contact:
Nume: ${formData.name}
Email: ${formData.email}
Telefon: ${formData.phone}
Metodă preferată de contact: ${formData.preferredContact}

Acest mesaj a fost trimis prin formularul de listare proprietăți de pe imobiliarealtfel.ro
`;
    }

    // Prepare email message
    const msg = {
      to: RECIPIENT_EMAIL,
      from: {
        email: VERIFIED_SENDER,
        name: 'Imobiliare Altfel'
      },
      subject: emailSubject,
      text: emailText,
      replyTo: formData.email
    };

    // Send email
    await sgMail.send(msg);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'Email sent successfully'
      })
    };
  } catch (error) {
    console.error('Email sending error:', error);

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        error: 'Failed to send email',
        message: error.message
      })
    };
  }
};