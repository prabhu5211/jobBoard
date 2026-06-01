import { Resend } from 'resend';

/**
 * Send an email using Resend.
 * Resend client is created lazily so dotenv has time to load.
 * @param {Object} options - { to, subject, html }
 */
const sendEmail = async ({ to, subject, html }) => {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not set — email not sent.');
    return null;
  }

  // Create client here (not at module level) so env vars are loaded
  const resend = new Resend(process.env.RESEND_API_KEY);

  const { data, error } = await resend.emails.send({
    from: process.env.EMAIL_FROM || 'JobBoard <onboarding@resend.dev>',
    to,
    subject,
    html,
  });

  if (error) {
    console.error('Resend error:', error);
    throw new Error(error.message);
  }

  console.log('Email sent:', data?.id);
  return data;
};

export default sendEmail;
