import express from 'express';
import axios from 'axios';


const router = express.Router();

router.post("/create-checkout", async(req, res) => {
  try {
    const { planType } = req.body;

    const checkout = await axios.post(
      "https://api.paymongo.com/v1/checkout_sessions",
      {
        data: {
          attributes: {
            line_items: [
              {
                currency: "PHP",
                amount: planType === "monthly" ? 50000 : 500000,
                name: "Subscription Plan",
                quantity: 1,
              }
            ],
            payment_method_types: ["card"],
            success_url: `http://localhost:5173/Home/?payment=success&plan=${planType}&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `http://localhost:5173/Home/?payment=cancel&plan=${planType}`
          }
        }
      },
      {
        headers: {
          Authorization: `Basic ${Buffer.from(process.env.PAYMONGO_SECRET_KEY + ":").toString("base64")}`,
          "Content-Type": "application/json",
        }
      }
    )

    res.json({ checkout_url: checkout.data.data.attributes.checkout_url})

  } catch (err) {
    res.status(500).json(err.response?.data || err.message);
  }
})

export default router;

