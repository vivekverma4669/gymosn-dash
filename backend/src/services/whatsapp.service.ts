import { env } from '../config/env.config';
import { logger } from '../utils/logger';
import { toWhatsAppNumber } from '../utils/phone';

interface SendWhatsAppParams {
  to: string;
  templateName: string;
  params: Record<string, string>;
}

export type WhatsAppSendStatus = 'sent' | 'skipped' | 'failed';

export interface SendWhatsAppResult {
  status: WhatsAppSendStatus;
  error?: string;
}

// Sends via the official Meta WhatsApp Cloud API (Graph API). `templateName` must match a
// template already approved in Meta Business Manager, and `params` must be supplied in the
// same order as that template's {{1}}, {{2}}, ... body placeholders — Meta has no notion of
// named variables, so object key order here IS the positional order sent on the wire.
// Until WHATSAPP_PHONE_NUMBER_ID / WHATSAPP_ACCESS_TOKEN are configured, this safely no-ops
// (status: "skipped") instead of throwing, so reminders/cron logic can run ahead of a live account.
export const sendWhatsAppMessage = async ({ to, templateName, params }: SendWhatsAppParams): Promise<SendWhatsAppResult> => {
  if (!env.WHATSAPP_PHONE_NUMBER_ID || !env.WHATSAPP_ACCESS_TOKEN) {
    logger.warn(`WhatsApp not configured — skipped "${templateName}" to ${to}`);
    return { status: 'skipped', error: 'WhatsApp provider not configured' };
  }

  const url = `https://graph.facebook.com/${env.WHATSAPP_API_VERSION}/${env.WHATSAPP_PHONE_NUMBER_ID}/messages`;
  const parameters = Object.values(params).map((text) => ({ type: 'text', text }));

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.WHATSAPP_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: toWhatsAppNumber(to),
        type: 'template',
        template: {
          name: templateName,
          language: { code: 'en' },
          components: parameters.length > 0 ? [{ type: 'body', parameters }] : undefined,
        },
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      logger.error(`WhatsApp send failed (${res.status}) for ${to}:`, text);
      return { status: 'failed', error: `Meta API returned ${res.status}` };
    }

    return { status: 'sent' };
  } catch (error) {
    logger.error(`WhatsApp send error for ${to}:`, error);
    return { status: 'failed', error: error instanceof Error ? error.message : 'Unknown error' };
  }
};
