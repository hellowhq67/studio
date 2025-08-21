// /src/app/api/checkout/sslcommerz/success/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createOrder } from '@/actions/order-actions';
import SSLCommerzPayment from 'sslcommerz-lts';


const store_id = process.env.SSLCOMMERZ_STORE_ID;
const store_passwd = process.env.SSLCOMMERZ_STORE_PASSWORD;
const is_live = process.env.SSLCOMMERZ_IS_LIVE === 'true';

export async function POST(req: NextRequest) {
    if (!store_id || !store_passwd) {
        // In a real app, redirect to an error page
        return NextResponse.redirect(new URL('/checkout/fail', req.url));
    }
    
    try {
        const formData = await req.formData();
        const body = Object.fromEntries(formData.entries());

        // Validate the transaction
        const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live)
        const validationResponse = await sslcz.validate(body);
        
        if (validationResponse.status !== 'VALID') {
            // Potentially log this attempt or handle it more gracefully
            console.error("SSLCommerz validation failed:", validationResponse);
            return NextResponse.redirect(new URL('/checkout/fail?error=validation_failed', req.url));
        }
        
        // --- Transaction is VALID, proceed with order creation ---
        const { value_a, value_b, value_c, total_amount, tran_id } = validationResponse;
        
        const items = JSON.parse(value_a); // Cart items
        const shippingAddress = JSON.parse(value_b); // Shipping address
        const firebaseUid = value_c; // User's Firebase UID

        // In a mock scenario, we don't need to check for existing orders.
        // In a real app, you would check if an order with this tran_id already exists.
        
        // Create the order in your database
        const order = await createOrder(
            firebaseUid, 
            items, 
            parseFloat(total_amount), 
            shippingAddress,
            tran_id,
            'Paid'
        );

        if (order) {
            // Redirect to a success page on your frontend
            return NextResponse.redirect(new URL('/checkout/success', req.url));
        } else {
            // Handle DB order creation failure
            console.error("Failed to create order in DB after successful payment:", validationResponse);
            return NextResponse.redirect(new URL('/checkout/fail?error=order_creation_failed', req.url));
        }
        
    } catch (error) {
        console.error('SSLCommerz success callback error:', error);
        return NextResponse.redirect(new URL('/checkout/fail', req.url));
    }
}
