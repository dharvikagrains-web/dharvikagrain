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

/**
 * Builds branded luxury HTML invoice receipt for Dharvika Grains orders
 */
function buildOrderConfirmationEmailHtml(order: {
  orderNumber: string;
  customerName: string;
  items: { name: string; selectedWeight: string; price: number; quantity: number }[];
  total: number;
  subtotal: number;
  discount: number;
  shippingFee: number;
  shippingAddress: { fullName?: string; houseFlat?: string; streetArea?: string; city: string; state: string; pincode: string };
  paymentMethod: string;
}): string {
  const itemsRows = order.items
    .map(
      (it) => `
    <tr>
      <td style="padding: 12px 0; border-bottom: 1px solid #F0E8DF; color: #241611; font-size: 13px;">
        <strong>${it.name}</strong><br>
        <span style="color: #6B5B52; font-size: 11px;">${it.selectedWeight} × ${it.quantity}</span>
      </td>
      <td align="right" style="padding: 12px 0; border-bottom: 1px solid #F0E8DF; color: #0D3522; font-weight: 700; font-size: 13px;">
        ₹${it.price * it.quantity}
      </td>
    </tr>
  `
    )
    .join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Order Confirmation #${order.orderNumber}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAF7F2; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #241611;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #FAF7F2; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 580px; background-color: #FFFFFF; border: 1px solid #E7DED4; border-radius: 4px; overflow: hidden; box-shadow: 0 4px 12px rgba(43, 24, 16, 0.05);">
          <!-- Header -->
          <tr>
            <td style="background-color: #0D3522; padding: 32px 24px; text-align: center;">
              <span style="color: #C5A059; font-size: 11px; letter-spacing: 0.25em; text-transform: uppercase; font-weight: 700; display: block; margin-bottom: 6px;">
                Farm-Direct Traceable Harvest
              </span>
              <h1 style="color: #FAF7F2; font-size: 24px; font-weight: 700; margin: 0; letter-spacing: 0.05em; font-family: Georgia, serif;">
                DHARVIKA GRAINS
              </h1>
            </td>
          </tr>
          
          <!-- Body -->
          <tr>
            <td style="padding: 36px 32px;">
              <div style="text-align: center; margin-bottom: 24px;">
                <span style="background-color: #EBF7EE; color: #0D3522; padding: 4px 12px; border-radius: 12px; font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;">
                  ✓ Payment Confirmed
                </span>
                <h2 style="font-size: 20px; font-weight: 700; color: #0D3522; margin: 12px 0 4px 0; font-family: Georgia, serif;">
                  Thank you for your order, ${order.customerName}!
                </h2>
                <p style="font-size: 13px; color: #6B5B52; margin: 0;">
                  Order <strong style="color: #0D3522;">#${order.orderNumber}</strong> has been received and is being prepared with stone-cleaned care.
                </p>
              </div>

              <!-- Items Table -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
                <thead>
                  <tr style="border-bottom: 2px solid #0D3522;">
                    <th align="left" style="padding-bottom: 8px; font-size: 11px; text-transform: uppercase; color: #8C7B70; letter-spacing: 0.1em;">Item</th>
                    <th align="right" style="padding-bottom: 8px; font-size: 11px; text-transform: uppercase; color: #8C7B70; letter-spacing: 0.1em;">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsRows}
                </tbody>
              </table>

              <!-- Totals -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 24px; font-size: 13px; color: #6B5B52;">
                <tr>
                  <td style="padding: 4px 0;">Subtotal:</td>
                  <td align="right" style="padding: 4px 0;">₹${order.subtotal}</td>
                </tr>
                ${order.discount > 0 ? `
                <tr>
                  <td style="padding: 4px 0; color: #0D3522; font-weight: 600;">Discount Savings:</td>
                  <td align="right" style="padding: 4px 0; color: #0D3522; font-weight: 600;">-₹${order.discount}</td>
                </tr>` : ''}
                <tr>
                  <td style="padding: 4px 0;">Shipping:</td>
                  <td align="right" style="padding: 4px 0;">${order.shippingFee === 0 ? 'FREE' : `₹${order.shippingFee}`}</td>
                </tr>
                <tr style="border-top: 2px solid #E7DED4; font-size: 15px; font-weight: 700; color: #0D3522;">
                  <td style="padding: 10px 0 0 0;">Total Paid:</td>
                  <td align="right" style="padding: 10px 0 0 0;">₹${order.total}</td>
                </tr>
              </table>

              <!-- Shipping Info Card -->
              <div style="background-color: #FAF7F2; border: 1px solid #E7DED4; padding: 16px 20px; border-radius: 4px; font-size: 12px; line-height: 1.6; margin-bottom: 24px;">
                <strong style="color: #0D3522; font-size: 13px; display: block; margin-bottom: 4px;">Delivery Destination:</strong>
                ${order.shippingAddress.fullName || order.customerName}<br>
                ${order.shippingAddress.houseFlat ? `${order.shippingAddress.houseFlat}, ` : ''}${order.shippingAddress.streetArea || ''}<br>
                ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}
              </div>

              <div style="text-align: center;">
                <p style="font-size: 12px; color: #8C7B70; margin: 0;">
                  Have questions about your order? Reach out anytime at <a href="mailto:care@dharvikagrains.in" style="color: #0D3522; font-weight: 600;">care@dharvikagrains.in</a> or call <strong>+91 94942 81818</strong>.
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #FAF7F2; border-top: 1px solid #E7DED4; padding: 20px 24px; text-align: center;">
              <p style="font-size: 11px; color: #8C7B70; margin: 0; line-height: 1.5;">
                FSSAI Central Licence: 13626011000284<br>
                © 2026 Dharvika Grains. 100% Traceable Indian Harvest.
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
 * Dispatches Order Confirmation Email via Resend
 */
export async function sendOrderConfirmationViaResend(order: {
  orderNumber: string;
  email: string;
  customerName: string;
  items: { name: string; selectedWeight: string; price: number; quantity: number }[];
  total: number;
  subtotal: number;
  discount: number;
  shippingFee: number;
  shippingAddress: { fullName?: string; houseFlat?: string; streetArea?: string; city: string; state: string; pincode: string };
  paymentMethod: string;
}): Promise<ResendSendOtpResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const fromEmail = process.env.EMAIL_FROM?.trim() || 'Dharvika Grains <onboarding@resend.dev>';
  const cleanEmail = order.email.trim().toLowerCase();

  if (!apiKey || apiKey.includes('placeholder')) {
    if (process.env.NODE_ENV !== 'production') {
      console.log(
        `[RESEND SANDBOX] Order Confirmation Receipt logged for #${order.orderNumber} to ${cleanEmail} (Total: ₹${order.total})`
      );
    }
    return {
      success: true,
      message: 'Order confirmation logged (development simulation).',
      emailId: `sim_order_resend_${Date.now()}`,
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
        subject: `Order Confirmed #${order.orderNumber} — Dharvika Grains`,
        html: buildOrderConfirmationEmailHtml(order),
      }),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      console.error('[RESEND ORDER ERROR]', data);
      return { success: false, message: 'Failed to send confirmation email', error: data.message };
    }

    return {
      success: true,
      message: 'Order confirmation dispatched via Resend.',
      emailId: data.id || `resend_${Date.now()}`,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Communication error';
    return { success: false, message: 'Failed to send order email', error: errorMsg };
  }
}
