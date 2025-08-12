// /src/app/api/checkout/sslcommerz/cancel/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    // User cancelled the payment
    // Redirect to the cart or a "payment cancelled" page
    return NextResponse.redirect(new URL('/products', req.url));
}
