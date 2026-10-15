import { NextRequest, NextResponse } from 'next/server';
import { brandConfig } from '@/data/brandConfig';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, subject, message, topic } = body;

    const senderEmail = (email || '').trim().toLowerCase();
    const senderName = (name || 'Customer').trim();
    const senderPhone = (phone || '').trim();
    const inquiryTopic = (subject || topic || 'General Inquiry').trim();
    const content = (message || '').trim();

    if (!content) {
      return NextResponse.json(
        { success: false, error: 'Message content is required.' },
        { status: 400 }
      );
    }

    // Basic email format check if email provided
    if (senderEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(senderEmail)) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    const timestamp = new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'short',
    });

    console.log(`[CONTACT INQUIRY RECEIVED] [${timestamp}]`);
    console.log(`From: ${senderName} <${senderEmail || 'N/A'}> | Phone: ${senderPhone || 'N/A'}`);
    console.log(`Topic: ${inquiryTopic}`);
    console.log(`Message: ${content}`);

    // Optional dispatch via Resend if configured
    const apiKey = process.env.RESEND_API_KEY?.trim();
    const adminEmail = process.env.ADMIN_EMAIL || brandConfig.supportEmail || 'care@dharvikagrains.in';
    const fromEmail = process.env.EMAIL_FROM || 'Dharvika Support <onboarding@resend.dev>';

    if (apiKey && !apiKey.includes('placeholder')) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: fromEmail,
            to: [adminEmail],
            reply_to: senderEmail || undefined,
            subject: `[New Inquiry] ${inquiryTopic} — ${senderName}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #E7DED4; border-radius: 8px; background: #FAF7F2;">
                <div style="background: #0D3522; padding: 16px 20px; border-radius: 6px; text-align: center; color: #FAF7F2;">
                  <h2 style="margin: 0; font-size: 18px; letter-spacing: 0.05em;">DHARVIKA GRAINS — Customer Inquiry</h2>
                </div>
                <div style="padding: 20px; background: #FFFFFF; margin-top: 15px; border-radius: 6px; border: 1px solid #E7DED4;">
                  <p><strong>Topic:</strong> ${inquiryTopic}</p>
                  <p><strong>Customer Name:</strong> ${senderName}</p>
                  <p><strong>Email:</strong> ${senderEmail || 'Not provided'}</p>
                  <p><strong>Phone:</strong> ${senderPhone || 'Not provided'}</p>
                  <p><strong>Received At:</strong> ${timestamp} IST</p>
                  <hr style="border: 0; border-top: 1px solid #E7DED4; margin: 15px 0;" />
                  <p><strong>Message:</strong></p>
                  <p style="white-space: pre-wrap; background: #F5EFEB; padding: 12px; border-radius: 4px; color: #241611;">${content}</p>
                </div>
              </div>
            `,
          }),
        });
      } catch (emailErr) {
        console.error('[CONTACT RESEND ERROR]', emailErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you! Your message has been received by our kitchen support team.',
      receivedAt: timestamp,
    });
  } catch (err: any) {
    console.error('[CONTACT API ERROR]', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error submitting inquiry. Please try again.' },
      { status: 500 }
    );
  }
}
