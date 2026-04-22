import axios from "axios";
import express from "express";

const router = express.Router();
const baseURL = process.env.FRONTEND_URL

router.post("/create-checkout", async (req, res) => {
  console.log("🔥 /create-checkout endpoint HIT");
  try {
    const { planType, userId } = req.body;

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
                quantity: 1
              }
            ],
            payment_method_types: ["card"],

            metadata: {
              userId,
              planType
            },

            success_url: `${baseURL}/Home/?payment=success&plan=${planType}&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${baseURL}/Home/?payment=cancel&plan=${planType}`
          }
        }
      },
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            process.env.PAYMONGO_SECRET_KEY + ":"
          ).toString("base64")}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.json({
      checkout_url: checkout.data.data.attributes.checkout_url
    });

  } catch (err) {
    console.log("==== PAYMONGO ERROR ====");
    console.log("STATUS:", err.response?.status);
    console.log("DATA:", JSON.stringify(err.response?.data, null, 2));
    console.log("========================");

    res.status(err.response?.status || 500).json(err.response?.data || err.message);
  }
});

export default router;