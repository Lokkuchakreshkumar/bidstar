import DodoPayments from 'dodopayments';

const apiKey = process.env.DODO_PAYMENTS_API_KEY || process.env.dodo_api_key || '';
const environment = (process.env.DODO_PAYMENTS_ENVIRONMENT === 'test_mode' ? 'test_mode' : 'live_mode') as 'live_mode' | 'test_mode';

export const dodoClient = new DodoPayments({
  bearerToken: apiKey,
  environment,
  webhookKey: process.env.DODO_PAYMENTS_WEBHOOK_KEY,
});

export const DODO_PRODUCT_ID = process.env.DODO_PRODUCT_ID || 'pdt_0NmeFlIJoDNldkF4i4p72';
export const DODO_ENVIRONMENT = environment;
