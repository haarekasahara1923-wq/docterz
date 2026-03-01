import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import Razorpay from 'razorpay'; // Added import for Razorpay

export async function POST(req: Request) {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, tenantId, plan, amount } = await req.json();

        // Initialize Razorpay instance (as per instruction)
        const razorpay = new Razorpay({
            key_id: (process.env.RAZORPAY_KEY_ID || 'rzp_live_RsbFKZwt1ZtSQF').replace(/"/g, ''),
            key_secret: (process.env.RAZORPAY_KEY_SECRET || '5ERk59shUraQto1EJ51we7aK').replace(/"/g, ''),
        });

        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", (process.env.RAZORPAY_KEY_SECRET || '5ERk59shUraQto1EJ51we7aK').replace(/"/g, '')) // Modified this line
            .update(sign.toString())
            .digest("hex");

        if (razorpay_signature === expectedSign) {
            // Payment is successful, logic to update database here
            if (tenantId) {
                // Create or update subscription
                // Check if a subscription exists for the tenant
                const existingSub = await prisma.subscription.findFirst({
                    where: { tenantId }
                });

                const subscriptionData = {
                    plan: plan === 'ENTERPRISE' ? 'ENTERPRISE' : 'PRO',
                    status: 'ACTIVE',
                    startDate: new Date(),
                    endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
                    razorpayOrderId: razorpay_order_id,
                    razorpaySubId: razorpay_payment_id,
                    amount,
                };

                if (existingSub) {
                    await prisma.subscription.update({
                        where: { id: existingSub.id },
                        data: subscriptionData as any
                    });
                } else {
                    await prisma.subscription.create({
                        data: {
                            tenantId,
                            ...(subscriptionData as any)
                        }
                    });
                }
            }

            return NextResponse.json({ message: "Payment verified successfully" }, { status: 200 });
        } else {
            return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
        }
    } catch (error) {
        console.error("Payment verification failed", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
