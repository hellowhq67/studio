// /src/app/api/checkout/sslcommerz/init/route.ts
import { NextRequest, NextResponse } from 'next/server';
import SSLCommerzPayment from 'sslcommerz-lts';
import { randomBytes } from 'crypto';

const store_id = process.env.SSLCOMMERZ_STORE_ID;
const store_passwd = process.env.SSLCOMMERZ_STORE_PASSWORD;
const is_live = process.env.SSLCOMMERZ_IS_LIVE === 'true';

export async function POST(req: NextRequest) {
    if (!store_id || !store_passwd) {
        return NextResponse.json({ message: 'SSLCommerz credentials are not configured.' }, { status: 500 });
    }

    try {
        const body = await req.json();
        const tran_id = `glowup_${randomBytes(8).toString('hex')}`;
        
        const successUrl = `${req.nextUrl.origin}/api/checkout/sslcommerz/success`;
        const failUrl = `${req.nextUrl.origin}/api/checkout/sslcommerz/fail`;
        const cancelUrl = `${req.nextUrl.origin}/api/checkout/sslcommerz/cancel`;

        const data = {
            ...body,
            tran_id,
            success_url: successUrl,
            fail_url: failUrl,
            cancel_url: cancelUrl,
            ipn_url: `${req.nextUrl.origin}/api/checkout/sslcommerz/ipn`, // Optional IPN
        };

        const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
        const apiResponse = await sslcz.init(data);

        if (apiResponse?.GatewayPageURL) {
            return NextResponse.json({ GatewayPageURL: apiResponse.GatewayPageURL });
        } else {
            return NextResponse.json({ message: 'Failed to get GatewayPageURL', error: apiResponse }, { status: 400 });
        }

    } catch (error) {
        console.error('SSLCommerz init error:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return NextResponse.json({ message: 'Internal Server Error', error: errorMessage }, { status: 500 });
    }
}
