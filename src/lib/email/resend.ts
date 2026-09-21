/**
 * DHARVIKA GRAINS — Resend Email Gateway Integration
 * High-deliverability transactional email for authentication OTPs
 */

export interface ResendSendOtpResult {
  success: boolean;
  message: string;
  emailId?: string;
  error?: string;
}

/**
 * Builds branded luxury HTML email for Dharvika Grains OTP verification
 */
function buildOtpEmailHtml(otp: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dharvika Grains Verification Code</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAF7F2; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #2B1810;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #FAF7F2; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 540px; background-color: #FFFFFF; border: 1px solid #E7DED4; border-radius: 4px; overflow: hidden; box-shadow: 0 4px 12px rgba(43, 24, 16, 0.05);">
          <!-- Header -->
          <tr>
            <td style="background-color: #0D3522; padding: 32px 24px; text-align: center;">
              <span style="color: #C5A059; font-size: 11px; letter-spacing: 0.25em; text-transform: uppercase; font-weight: 700; display: block; margin-bottom: 6px;">
                Heritage Chiru Dhanyalu & Pure Spices
              </span>
              <h1 style="color: #FAF7F2; font-size: 22px; font-weight: 700; margin: 0; letter-spacing: 0.05em;">
                DHARVIKA GRAINS
              </h1>
            </td>
          </tr>
          
          <!-- Content Body -->
          <tr>
            <td style="padding: 36px 32px; text-align: center;">
              <h2 style="font-size: 18px; font-weight: 600; color: #0D3522; margin: 0 0 12px 0;">
                Your Verification Code
              </h2>
              <p style="font-size: 14px; line-height: 1.6; color: #6B5B52; margin: 0 0 28px 0;">
                Please enter the one-time verification code below to securely access your Dharvika Grains account:
              </p>
              
              <!-- OTP Box -->
              <div style="background-color: #FAF7F2; border: 2px dashed #C5A059; border-radius: 6px; padding: 18px 24px; margin: 0 auto 28px auto; display: inline-block;">
                <span style="font-family: monospace, Courier, sans-serif; font-size: 32px; font-weight: 700; letter-spacing: 0.35em; color: #0D3522; margin-right: -0.35em;">
                  ${otp}
                </span>
              </div>
              
              <p style="font-size: 12px; color: #8C7B70; margin: 0 0 8px 0;">
                ⏳ This code is valid for <strong>5 minutes</strong>.
              </p>
              <p style="font-size: 12px; color: #8C7B70; margin: 0;">
                For your security, never share this verification code with anyone.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #FAF7F2; border-top: 1px solid #E7DED4; padding: 20px 24px; text-align: center;">
              <p style="font-size: 11px; color: #8C7B70; margin: 0; line-height: 1.5;">
                If you did not request this code, you can safely ignore this email.<br>
                © 2026 Dharvika Grains. Farm-direct millets and cold-ground spices.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Dispatches OTP via Resend Transactional Email REST API
 */
export async function sendOtpViaResend(params: {
  email: string;
  otp: string;
}): Promise<ResendSendOtpResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const fromEmail = process.env.EMAIL_FROM?.trim() || 'Dharvika Grains <onboarding@resend.dev>';
  const cleanEmail = params.email.trim().toLowerCase();

  // If Resend API key is not yet configured, log for development sandbox testing
  if (!apiKey || apiKey.includes('placeholder')) {
    if (process.env.NODE_ENV !== 'production') {
      console.log(
        `[RESEND SANDBOX] (No RESEND_API_KEY set) Email: ${cleanEmail} | OTP: ${params.otp}`
      );
    }
    return {
      success: true,
      message: 'Verification code generated (development simulation).',
      emailId: `sim_resend_${Date.now()}`,
    };
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [cleanEmail],
        subject: `Your Dharvika Grains Verification Code: ${params.otp}`,
        html: buildOtpEmailHtml(params.otp),
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error('[RESEND ERROR]', data);
      return {
        success: false,
        message: data.message || 'Failed to dispatch email verification code.',
        error: data.message || 'Resend API error',
      };
    }

    return {
      success: true,
      message: 'Email verification code dispatched via Resend.',
      emailId: data.id || `resend_${Date.now()}`,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown communication error';
    console.error('[RESEND NETWORK ERROR]', err);
    return {
      success: false,
      message: 'Temporary communication failure with email gateway.',
      error: errorMsg,
    };
  }
}
