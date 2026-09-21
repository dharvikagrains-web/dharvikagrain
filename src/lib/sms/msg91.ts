/**
 * DHARVIKA GRAINS — MSG91 Indian SMS Gateway Integration
 * High-reliability OTP delivery for Indian mobile numbers (+91)
 */

export interface Msg91SendOtpResult {
  success: boolean;
  message: string;
  requestId?: string;
  error?: string;
}

/**
 * Format 10-digit Indian phone number to MSG91 format (91XXXXXXXXXX)
 */
export function formatIndianMobileForMsg91(mobile: string): string {
  const digits = mobile.replace(/\D/g, '');
  if (digits.length === 10) {
    return `91${digits}`;
  }
  if (digits.length === 12 && digits.startsWith('91')) {
    return digits;
  }
  return digits;
}

/**
 * Dispatches OTP via MSG91 Send OTP v5 API
 */
export async function sendOtpViaMsg91(params: {
  mobile: string;
  otp: string;
}): Promise<Msg91SendOtpResult> {
  const authKey = process.env.MSG91_AUTH_KEY?.trim();
  const templateId = process.env.MSG91_TEMPLATE_ID?.trim();
  const formattedMobile = formatIndianMobileForMsg91(params.mobile);

  // If MSG91 credentials are not yet configured, log for development sandbox testing
  if (!authKey || authKey.includes('placeholder')) {
    if (process.env.NODE_ENV !== 'production') {
      console.log(
        `[MSG91 SANDBOX] (No MSG91_AUTH_KEY set) Mobile: ${formattedMobile} | OTP: ${params.otp}`
      );
    }
    return {
      success: true,
      message: 'Verification code generated (development simulation).',
      requestId: `sim_msg91_${Date.now()}`,
    };
  }

  try {
    // MSG91 OTP v5 API parameters
    // Query parameters or JSON body: template_id, mobile, authkey, otp
    const url = new URL('https://control.msg91.com/api/v5/otp');
    url.searchParams.set('mobile', formattedMobile);
    url.searchParams.set('otp', params.otp);
    if (templateId) {
      url.searchParams.set('template_id', templateId);
    }

    const senderId = process.env.MSG91_SENDER_ID || 'DHRVIK';
    url.searchParams.set('sender', senderId);

    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        authkey: authKey,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok || data.type === 'error') {
      console.error('[MSG91 ERROR]', data);
      return {
        success: false,
        message: data.message || 'SMS delivery failed through carrier network.',
        error: data.message || 'MSG91 API error',
      };
    }

    return {
      success: true,
      message: 'SMS verification code dispatched via MSG91.',
      requestId: data.request_id || `msg91_${Date.now()}`,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown communication error';
    console.error('[MSG91 NETWORK ERROR]', err);
    return {
      success: false,
      message: 'Temporary communication failure with SMS gateway.',
      error: errorMsg,
    };
  }
}

/**
 * Dispatches Order Confirmation SMS via MSG91
 */
export async function sendOrderConfirmationViaMsg91(params: {
  mobile: string;
  orderNumber: string;
  total: number;
}): Promise<Msg91SendOtpResult> {
  const authKey = process.env.MSG91_AUTH_KEY?.trim();
  const formattedMobile = formatIndianMobileForMsg91(params.mobile);

  if (!authKey || authKey.includes('placeholder')) {
    if (process.env.NODE_ENV !== 'production') {
      console.log(
        `[MSG91 SANDBOX] Order Confirmation SMS to ${formattedMobile} for #${params.orderNumber} (Amount: ₹${params.total})`
      );
    }
    return {
      success: true,
      message: 'SMS notification logged (development simulation).',
      requestId: `sim_order_sms_${Date.now()}`,
    };
  }

  try {
    const response = await fetch('https://control.msg91.com/api/v5/flow/', {
      method: 'POST',
      headers: {
        authkey: authKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        template_id: process.env.MSG91_ORDER_TEMPLATE_ID || process.env.MSG91_TEMPLATE_ID,
        short_url: '0',
        recipients: [
          {
            mobiles: formattedMobile,
            order_number: params.orderNumber,
            amount: params.total.toString(),
          },
        ],
      }),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      console.error('[MSG91 ORDER SMS ERROR]', data);
      return { success: false, message: 'Failed to send confirmation SMS', error: data.message };
    }

    return {
      success: true,
      message: 'Order confirmation SMS dispatched via MSG91.',
      requestId: data.request_id || `msg91_${Date.now()}`,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Communication error';
    return { success: false, message: 'Failed to send order SMS', error: errorMsg };
  }
}
