const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const port = 3000;
const dotenv = require('dotenv')

//configurar dotenv

dotenv.config()


// Middleware para analizar datos del formulario
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Middleware para servir archivos estáticos desde la carpeta 'public'

app.use(express.static(path.join(__dirname, 'src', 'public')));

// Ruta para manejar el envío del formulario de contacto
app.post('/contact', (req, res) => {
  const { name, email, message } = req.body;

  // Validar nombre (solo letras)
  if (!/^[a-zA-Z]+$/.test(name)) {
    return res.status(400).json({ error: 'El nombre solo puede contener letras.' });
  }

  // Validar formato de correo electrónico
  if (!/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ error: 'El correo electrónico no es válido.' });
  }

  // Configurar el transporte de correo
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'XXXXXX@gmail.com', // Reemplaza con tu correo
      pass: 'XXX' // Reemplaza con tu contraseña
    }
  });

  // Configurar el mensaje de correo electrónico
  const mailOptions = {
    from: 'XXXXX@gmail.com', // Reemplaza con tu correo
    to: 'XXXXX@gmail.com', // Reemplaza con el correo personal de la empresa
    subject: 'Mensaje de contacto desde tu sitio web',
    text: `Nombre: ${name}\nCorreo: ${email}\n\nMensaje:\n${message}`
  };

  // Enviar correo electrónico
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ error: 'Hubo un error al enviar el mensaje.' });
    }
    console.log('Correo enviado: ' + info.response);
    res.status(200).json({ message: 'Mensaje enviado correctamente.' });
  });
});

// Ruta para servir la página principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'index.ejs'));
});

// Servidor escuchando en el puerto 3000
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
