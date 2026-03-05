import express from "express";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase.js";

const router = express.Router();

router.post("/webhook", async (req, res) => {
  console.log(JSON.stringify(req.body, null, 2)); 
  try {
    const event = req.body;

    if (event.data.attributes.type === "checkout_session.payment.paid") {

        const attributes = event?.data?.attributes?.data?.attributes;
        const payment = attributes?.payments?.[0];

        if (!payment) {
          console.log("No payment found in webhook");
          return res.sendStatus(200);
        }

        const metadata = payment.attributes?.metadata;

        if (!metadata) {
          console.log("No metadata found");
          return res.sendStatus(200);
        }

        const { userId, planType } = metadata;

      let subscriptionEnd = new Date();

      if (planType === "monthly") {
        subscriptionEnd.setMonth(subscriptionEnd.getMonth() + 1);
      }

      if (planType === "yearly") {
        subscriptionEnd.setFullYear(subscriptionEnd.getFullYear() + 1);
      }

      const userRef = doc(db, "users", userId);

      await updateDoc(userRef, {
        planType,
        subscriptionStatus: "active",
        subscriptionEnd: subscriptionEnd.toISOString()
      });

      console.log("Subscription activated for:", userId);
    }

    res.sendStatus(200);

  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

export default router;