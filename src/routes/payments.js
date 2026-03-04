  import express from 'express';
  import axios from 'axios';


  const router = express.Router();

  router.post("/webhook", async (req, res) => {
    const event = req.body;

    if (event.data.attributes.type === "checkout_session.payment.paid") {
      const amount = event.data.attributes.data.attributes.payments[0].amount;

      console.log("Payment received:", amount);

      if (amount === 5000) {
        console.log("Activate monthly plan");
      }

      if (amount === 50000) {
        console.log("Activate yearly plan");
      }
    }

    res.sendStatus(200);
  });

  export default router;