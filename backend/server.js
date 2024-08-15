const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const emailAttempts = new Map(); // Estructura para rastrear los intentos de envío

app.post('/api/send-email', async (req, res) => {
  const { name, email, message, recaptchaToken } = req.body;

  const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
  const recaptchaUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${recaptchaToken}`;

  const clientIp = req.ip; // Obtener la dirección IP del cliente
  const currentTime = Date.now();
  const lastAttemptTime = emailAttempts.get(clientIp);

  if (lastAttemptTime && currentTime - lastAttemptTime < 5 * 60 * 1000) {
    return res.status(429).json({ error: 'Por favor, espera 5 minutos antes de enviar otro correo.' });
  }

  try {
    const fetch = (await import('node-fetch')).default;
    const recaptchaResponse = await fetch(recaptchaUrl, { method: 'POST' });
    const recaptchaData = await recaptchaResponse.json();

    if (!recaptchaData.success || recaptchaData.score < 0.5) {
      return res.status(400).json({ error: 'Falló la verificación de reCAPTCHA' });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail', // Puedes usar cualquier servicio de correo compatible con Nodemailer
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_APP_PASS
      }
    });

    const mailOptions = {
      from: process.env.MAIL_USER, // El correo autenticado
      to: process.env.MAIL_USER, // El correo al que se enviará el mensaje
      subject: `Mensaje desde la web de ${name}`,
      text: `Mensaje: ${message}\n\nCorreo del remitente: ${email}`,
      replyTo: email // El correo del usuario para que las respuestas vayan a él
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).send(error.toString());
      }
      emailAttempts.set(clientIp, currentTime); // Actualizar el tiempo del último intento
      res.status(200).send({ message: 'Email enviado exitosamente' });
    });
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
