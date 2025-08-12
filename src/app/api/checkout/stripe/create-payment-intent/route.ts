// src/app/api/checkout/stripe/create-payment-intent/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createOrder } from '@/actions/order-actions';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-06-20',
});

export async function POST(req: NextRequest) {
    try {
        const { amount, currency, items, shippingAddress, firebaseUid } = await req.json();

        if (!amount || !currency || !items || !shippingAddress || !firebaseUid) {
            return NextResponse.json({ error: 'Missing required payment information.' }, { status: 400 });
        }
        
        // Create a preliminary order with 'Processing' status
        // The webhook will later update it to 'Paid'
        const order = await createOrder(
            firebaseUid,
            items,
            amount / 100, // Convert cents to dollars for your DB
            shippingAddress,
            undefined, // No transaction ID yet
            'Processing'
        );

        if (!order) {
            return NextResponse.json({ error: 'Failed to create preliminary order.' }, { status: 500 });
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
            automatic_payment_methods: { enabled: true },
            metadata: {
                orderId: order.id, // Pass your internal order ID to Stripe
                firebaseUid: firebaseUid,
            },
        });

        return NextResponse.json({ clientSecret: paymentIntent.client_secret });

    } catch (error) {
        console.error('Stripe Payment Intent Error:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return NextResponse.json({ error: `Internal Server Error: ${errorMessage}` }, { status: 500 });
    }
}
