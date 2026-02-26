import express from 'express';
import axios from 'axios';


const router = express.Router();

router.post('/create', async (req, res) => {
  try{
    const { amount, payment_method_id } = req.body;
    const paymentIntent = await axios.post(
      'https://api.paymongo.com/v1/payment_intents',
      { 
        data: {
          attributes: {
            amount: amount,
            payment_method_allowed: ["card"],
            currency: "PHP",
            capture_type: "automatic"
          }
        }
      }, {
        headers: {
          Authorization: `Basic ${Buffer.from(process.env.PAYMONGO_SECRET + ":").toString("base64")}`,
          "Content-Type": "application/json"
        }
      }
    );

    const piId = paymentIntent.data.data.id;

    const attached = await axios.post(
      `https://api.paymongo.com/v1/payment_intents/${piId}/attach`,
      {
        data: {
          attributes: {
            payment_method: payment_method_id,
            return_url: "http://localhost:3000/payment-success"
          }
        }
      },
      { headers }
    );

    

    res.json({
      success: true,
      payment: attached.data
    });
  } catch (err) {
    res.status(500).json(err.response?.data || err.message);
  }
});


router.post('/webhook', (req, res) => {
  console.log("Webhook received:", req.body);
  res.sendStatus(200);
});

export default router;