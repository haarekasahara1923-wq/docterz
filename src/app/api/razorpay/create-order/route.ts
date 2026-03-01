import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { prisma } from '@/lib/prisma';



export async function POST(req: Request) {
    try {
        const bodyText = await req.text();
        console.log('Raw body:', bodyText);
        const { plan, amount, tenantId } = JSON.parse(bodyText);

        if (!amount) {
            return NextResponse.json({ error: 'Amount is required' }, { status: 400 });
        }

        // Amount in paisa
        const orderOptions = {
            amount: Math.round(amount * 100),
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
        };

        const razorpay = new Razorpay({
            key_id: (process.env.RAZORPAY_KEY_ID || 'rzp_live_RsbFKZwt1ZtSQF').replace(/"/g, ''),
            key_secret: (process.env.RAZORPAY_KEY_SECRET || '5ERk59shUraQto1EJ51we7aK').replace(/"/g, ''),
        });

        const order = await razorpay.orders.create(orderOptions);

        return NextResponse.json({ order }, { status: 200 });
    } catch (error) {
        console.error('Error creating razorpay order:', error);
        let errorMsg = 'Failed to create order';
        if (error instanceof Error) {
            errorMsg = error.message;
        } else if (typeof error === 'object' && error !== null) {
            errorMsg = JSON.stringify(error) || error.toString();
        }
        return NextResponse.json({ error: errorMsg }, { status: 500 });
    }
}
