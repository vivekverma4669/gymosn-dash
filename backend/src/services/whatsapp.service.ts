import { env } from '../config/env.config';
import { logger } from '../utils/logger';

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

// Provider-agnostic sender for a WhatsApp Business Solution Provider (AiSensy, Interakt, Gupshup, etc).
// Until WHATSAPP_API_URL / WHATSAPP_API_KEY are configured, this safely no-ops (status: "skipped")
// instead of throwing, so reminders/cron logic can be built and logged ahead of a live account.
// The exact request shape below is a generic placeholder — swap it for the chosen provider's actual
// REST contract once credentials are available.
export const sendWhatsAppMessage = async ({ to, templateName, params }: SendWhatsAppParams): Promise<SendWhatsAppResult> => {
  if (!env.WHATSAPP_API_URL || !env.WHATSAPP_API_KEY) {
    logger.warn(`WhatsApp not configured — skipped "${templateName}" to ${to}`);
    return { status: 'skipped', error: 'WhatsApp provider not configured' };
  }

  try {
    const res = await fetch(env.WHATSAPP_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.WHATSAPP_API_KEY}`,
      },
      body: JSON.stringify({ to, template: templateName, params }),
    });

    if (!res.ok) {
      const text = await res.text();
      logger.error(`WhatsApp send failed (${res.status}) for ${to}:`, text);
      return { status: 'failed', error: `Provider returned ${res.status}` };
    }

    return { status: 'sent' };
  } catch (error) {
    logger.error(`WhatsApp send error for ${to}:`, error);
    return { status: 'failed', error: error instanceof Error ? error.message : 'Unknown error' };
  }
};
