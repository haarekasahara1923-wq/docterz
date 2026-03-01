import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { prisma } from '@/lib/prisma';



export async function POST(req: Request) {
    try {
        const { plan, amount, tenantId } = await req.json();

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
            key_id: process.env.RAZORPAY_KEY_ID || 'rzp_live_RsbFKZwt1ZtSQF',
            key_secret: process.env.RAZORPAY_KEY_SECRET || '5ERk59shUraQto1EJ51we7aK',
        });

        const order = await razorpay.orders.create(orderOptions);

        return NextResponse.json({ order }, { status: 200 });
    } catch (error) {
        console.error('Error creating razorpay order:', error);
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to create order' }, { status: 500 });
    }
}
