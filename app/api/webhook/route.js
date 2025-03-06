import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

export async function POST(req) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  switch (event.type) {
    case 'payment_intent.succeeded':
      console.log('✅ PaymentIntent succeeded:', event.data.object);
      break;
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return new Response('Event received', { status: 200 });
}
