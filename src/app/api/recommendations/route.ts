import { NextRequest, NextResponse } from 'next/server';
import { getProductRecommendations } from '@/ai/flows/product-recommendations';

export async function POST(req: NextRequest) {
  try {
    const { browsingHistory, productDescription } = await req.json();

    if (typeof browsingHistory !== 'string' || typeof productDescription !== 'string') {
      return NextResponse.json({ error: 'Invalid input data' }, { status: 400 });
    }

    const recommendations = await getProductRecommendations({
      browsingHistory,
      productDescription,
    });

    return NextResponse.json(recommendations, { status: 200 });
  } catch (error) {
    console.error('Error in recommendations API route:', error);
    return NextResponse.json({ error: 'Failed to get recommendations' }, { status: 500 });
  }
}