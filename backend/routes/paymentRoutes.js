import express from 'express';
import axios from 'axios';

const router = express.Router();

// INITIATE PAYMENT
router.post('/init', async (req, res) => {
  const { email, amount } = req.body;

  try {
    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email,
        amount: amount * 100, // Convert to pesewas
        currency: "GHS",
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.send(response.data);
  } catch (err) {
    res.status(500).send({ message: err.response.data });
  }
});

// VERIFY PAYMENT
router.get('/verify/:reference', async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${req.params.reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    res.send(response.data);
  } catch (err) {
    res.status(500).send({ message: err.response.data });
  }
});

export default router;
