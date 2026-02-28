import express from 'express';
import axios from 'axios';


const router = express.Router();

router.post("/create-checkout", async(req, res) => {
  try {
    const { planType } = req.body;

    const checkout = await axios.post(
      "htpps://api.paymongo.com/v1/checkout_sessions",
      {
        data: {
          attributes: {
            line_items: [
              {
                currency: "PHP",
                amount: planType === "monthly" ? 5000 : 50000,
                name: "Subscription Plan",
                quantity: 1,
              }
            ],
            payment_method_types: ["card"],
            success_url: "http://localhost:5173/success",
            cancel_url: "http://localhost:5173/cancel",
          }
        }
      },
      {
        headers: {
          Authorization: `Basic ${Buffer.from(process.env.PAYMONGO_SECRET + ":").toString("base64")}`,
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

