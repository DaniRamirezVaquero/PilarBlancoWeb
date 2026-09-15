const nodemailer = require('nodemailer');

const RATE_LIMIT_MS = 5 * 60 * 1000;
const emailAttempts = new Map();

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim();
  }
  return req.socket?.remoteAddress || 'unknown';
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { name, email, message, recaptchaToken } = req.body || {};

  if (!name || !email || !message || !recaptchaToken) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
  const mailUser = process.env.MAIL_USER;
  const mailPass = process.env.MAIL_APP_PASS;

  if (!recaptchaSecret || !mailUser || !mailPass) {
    return res.status(500).json({ error: 'El servidor de correo no está configurado' });
  }

  const clientIp = getClientIp(req);
  const now = Date.now();
  const lastAttemptTime = emailAttempts.get(clientIp);
  if (lastAttemptTime && now - lastAttemptTime < RATE_LIMIT_MS) {
    return res.status(429).json({ error: 'Por favor, espera 5 minutos antes de enviar otro correo.' });
  }

  try {
    const recaptchaUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${encodeURIComponent(recaptchaSecret)}&response=${encodeURIComponent(recaptchaToken)}`;
    const recaptchaResponse = await fetch(recaptchaUrl, { method: 'POST' });
    const recaptchaData = await recaptchaResponse.json();

    if (!recaptchaData.success || recaptchaData.score < 0.5) {
      return res.status(400).json({ error: 'Falló la verificación de reCAPTCHA' });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: mailUser,
        pass: mailPass,
      },
    });

    await transporter.sendMail({
      from: mailUser,
      to: mailUser,
      subject: `Mensaje desde la web de ${name}`,
      text: `Mensaje: ${message}\n\nCorreo del remitente: ${email}`,
      replyTo: email,
    });

    emailAttempts.set(clientIp, now);
    return res.status(200).json({ message: 'Email enviado exitosamente' });
  } catch (error) {
    return res.status(500).json({ error: 'Error al enviar el email' });
  }
};
