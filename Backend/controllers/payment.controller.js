import dotenv from "dotenv";
dotenv.config();

import Payment from "../models/payment.model.js";
import User from "../models/user.model.js";
import stripe from "../services/stripe.service.js";

/**
 * CREATE STRIPE CHECKOUT SESSION
 */
export const createOrder = async (req, res) => {
  try {
    const { planId, amount, credits } = req.body;

    if (!planId || !amount || !credits) {
      return res.status(400).json({
        message: "Invalid plan data",
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",

      customer_creation: "always",

      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: `${credits} Credits Plan`,
            },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],

      success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/pricing`,
    });

    await Payment.create({
      userId: req.userId,
      planId,
      amount,
      credits,
      stripeSessionId: session.id,
      status: "created",
    });

    return res.status(200).json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error("Stripe Checkout Error:", error);
    return res.status(500).json({
      message: "Failed to create checkout session",
    });
  }
};

/**
 * STRIPE WEBHOOK
 */
export const stripeWebhook = async (req, res) => {
  console.log("🔥 STRIPE WEBHOOK ROUTE HIT");
  console.log("Headers:", req.headers["stripe-signature"]);
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );

    console.log("🔥 WEBHOOK HIT"); // 👈 ADD HERE (FIRST LINE)
    console.log("Event type:", event.type);
    console.log("Session:", event.data.object);
  } catch (err) {
    console.error("Webhook signature error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const payment = await Payment.findOne({
        stripeSessionId: session.id,
      });

      if (!payment) {
        console.error("Payment not found for session:", session.id);
        return res.status(404).json({
          message: "Payment record not found",
        });
      }

      // Prevent duplicate processing
      if (payment.status === "paid") {
        return res.status(200).json({
          message: "Already processed",
        });
      }

      payment.status = "paid";
      payment.stripePaymentIntentId = session.payment_intent;

      await payment.save();

      await User.findByIdAndUpdate(
        payment.userId,
        {
          $inc: { credits: payment.credits },
        },
        { new: true },
      );

      console.log(
        `✅ Credits added: ${payment.credits} to user ${payment.userId}`,
      );
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error("Webhook Processing Error:", error);
    return res.status(500).json({
      message: "Webhook processing failed",
    });
  }
};
