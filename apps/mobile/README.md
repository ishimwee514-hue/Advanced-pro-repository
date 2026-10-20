# Ruta mobile app (Android + iOS)

This Expo/React Native app is the mobile client in the Ruta monorepo and uses the same Express API as the browser app.

## Run locally
Requires Node.js 20+ and Expo Go or native build tooling.

```sh
cd apps/mobile
npm install
# Set the API URL reachable from the phone, including /api
# Example: EXPO_PUBLIC_API_URL=https://YOUR-API-HOST/api
npx expo start
```

On a physical phone, do not use localhost for an API running on your computer; use the computer's LAN IP or a deployed HTTPS URL. Never place secrets in EXPO_PUBLIC variables.

Included: passenger registration/sign-in, trip search, seat availability, pending seat reservations, and ticket history. Payment confirmation, persistent login storage, push notifications, device QA, EAS signing, and app-store publishing are not complete. iOS distribution requires Apple signing and an Apple Developer account.
