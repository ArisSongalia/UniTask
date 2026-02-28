  import express from 'express';
  import axios from 'axios';


  const router = express.Router();

  router.post('/subscribe', async (req, res) => {
    try{
      const { planType, customer_id, payment_method_id } = req.body;

      let plan_id;

      if(planType === 'monthly') {
        plan_id = process.env.PLAN_MONTHLY_ID;
      }

      if(planType === 'yearly') {
        plan_id = process.env.PLAN_YEARLY_ID;
      }

      const subscription = await axios.post(
        'https://api.paymongo.com/v1/subscriptions',
        {
          data: {
            attributes: {
              plan: plan_id,
              customer: customer_id,
              payment_method: payment_method_id,
            }
          }
        },
        {
          headers: {
            Authorization: `Basic ${Buffer.from(process.env.PAYMONGO_SECRET + ":").toString("base64")}`,
            "Content-Type": "application/json",
          }
        }
      );

      res.json({
        success: true,
        subscription: subscription.data
      });

    } catch (err) {
      res.status(500).json(err.response?.data || err.message);
    }
  })

  router.post('/webhook', (req, res) => {
    try{
      const event = req.body;
      const eventType = event.data.attributes.type;

      switch(eventType) {
        case 'subscription.activated':
          console.log('subscription activated');
          break

        case 'subscription.invoice.paid':
          console.log('subscription paid');
          break

        case 'subscription.invoice.payment_failed':
          console.log('subscription payment failed');
          break

        case 'subscription.unpaid':
          console.log('subscription payment unpaid');
          break

        case 'subscription.past_due':
          console.log('subscription payment past due');
          break

        default:
          console.log('unhandled event', eventType)
      }

      res.sendStatus(200)
    } catch (err) {
      console.error(err);
      res.status(500).send("webhook error")
    }
  });

  export default router;