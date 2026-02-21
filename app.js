const express = require('express');
const axios = require('axios');

const app = express();

app.use(express.json());

const port = process.env.PORT || 3000;
const verifyToken = process.env.VERIFY_TOKEN || 'andres_token_secreto'; // Define esto en Render

// 1. VALIDACIÓN PARA META (GET)
app.get('/', (req, res) => {
  const { 'hub.mode': mode, 'hub.challenge': challenge, 'hub.verify_token': token } = req.query;

  if (mode === 'subscribe' && token === verifyToken) {
    console.log('WEBHOOK VERIFICADO POR META');
    res.status(200).send(challenge);
  } else {
    res.status(403).end();
  }
});

// 2. REENVÍO A N8N (POST)
app.post('/', async (req, res) => {
  console.log(`Mensaje recibido de WhatsApp a las ${new Date().toLocaleString()}`);
  
  try {
    // REEMPLAZA ESTA URL con la "Production URL" de tu nodo Webhook en n8n
    const n8nUrl = 'https://andres31416.app.n8n.cloud/webhook-test/whatsappwebhook'; 
    
    await axios.post(n8nUrl, req.body);
    console.log('Datos enviados a n8n correctamente');
  } catch (error) {
    console.error('Error al contactar n8n:', error.message);
  }

  res.status(200).send('EVENT_RECEIVED');
});

app.listen(port, () => {
  console.log(`Servidor puente escuchando en puerto ${port}`);
});