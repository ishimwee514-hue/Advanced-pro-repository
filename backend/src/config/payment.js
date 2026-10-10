export const paymentConfig = Object.freeze({
  mtnMomo: Object.freeze({
    baseUrl: process.env.MTN_MOMO_BASE_URL,
    subscriptionKey: process.env.MTN_MOMO_SUBSCRIPTION_KEY,
    apiUser: process.env.MTN_MOMO_API_USER,
    apiKey: process.env.MTN_MOMO_API_KEY,
  }),
  airtelMoney: Object.freeze({
    baseUrl: process.env.AIRTEL_MONEY_BASE_URL,
    clientId: process.env.AIRTEL_MONEY_CLIENT_ID,
    clientSecret: process.env.AIRTEL_MONEY_CLIENT_SECRET,
  }),
})
