# Cloudflare Workflows 🧡 Twilio


[<img src="https://img.youtube.com/vi/Pz0-mFk6aBM/0.jpg">](https://youtu.be/Pz0-mFk6aBM "Schedule Twilio Messaging and Phone Calls with Cloudflare Workflows")

This repo is an example of how to use Cloudflare Workers + [Workflows](https://developers.cloudflare.com/workflows) to create a time based Twilio experience.

[Twilio](https://twilio.com/docs) allows you to buy phone numbers that you can program. You can send and receive messages, and even make actual phone calls.

## Setup

### Get your Twilio Phone Number

If you don't have an account head over to [Register](https://twilio.com/try-twilio) and [Get Started](https://www.twilio.com/docs/usage/tutorials/how-to-use-your-free-trial-account-namer)


### Install your dependencies

```bash
npm install
```

## Deploy

### Upload your secrets

Log into

```bash
npx wrangler secret put TWILIO_ACCOUNT_SID
```

```bash
npx wrangler secret put TWILIO_AUTH_TOKEN
```

```bash
npx wrangler secret put TWILIO_PHONE_NUMBER
```

### Deploy your application

```bash
npm run deploy
```

This will give you a URL, copy it and paste it

### Set up your Twilio Phone Number

Head over to your phone number and change the Incoming Message to Webhook and for the URL replace it with
the URL from the deployment followed by a forward slash, then incoming.

```
https://<your-url-from-previous-step>/incoming
```

Make sure you save the configuration.
