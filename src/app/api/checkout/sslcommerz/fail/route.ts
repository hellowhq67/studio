// /src/app/api/checkout/sslcommerz/fail/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    // Optionally log the failure details from SSLCommerz if needed
    // const formData = await req.formData();
    // const body = Object.fromEntries(formData.entries());
    // console.log("Payment failed:", body);
    
    // Redirect the user to a failure page on your frontend
    return NextResponse.redirect(new URL('/checkout/fail', req.url));
}
