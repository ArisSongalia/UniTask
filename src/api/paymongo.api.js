import axios from "axios";


export const createPaymentMethod = async (cardData) => {
  const response = await axios.post(
    "https://api.paymongo.com/v1/payment_methods",
    {
      data: {
        attributes: {
          type: "card",
          details: {
            card_number: cardData.cardNumber,
            exp_month: cardData.expMonth,
            exp_year: cardData.expYear,
            cvc: cardData.cvc,
          }
        }
      }
    },
    {
      headers: {
        Authorization: `Basic ${btoa(process.env.REACT_APP_PAYMONGO_PUBLIC_KEY = ":")}`,
        "Content-Type": "application/json",
      }
    }
  );

  return response.data.data.id;
}