# `draftmymail`

TypeScript SDK for generating HTML emails with DraftMyMail AI.

## Requirements

- Node.js `18+`
- A DraftMyMail API key

## Install

```bash
npm install draftmymail
```

## Quick Start

Set your API key:

```bash
export DRAFTMYMAIL_API_KEY=your_api_key
```

Then generate an email:

```ts
import { DraftMyMailAI } from "draftmymail";

const client = new DraftMyMailAI();

const result = await client.generate({
  context: "Write a welcome email for a new SaaS user who just created an account.",
  data: {
    firstName: "Ava",
    productName: "DraftMyMail",
    loginUrl: "https://app.example.com/login",
  },
});

console.log(result.subject);
console.log(result.mail);
```

## Example With Reusable Defaults

You can define shared context, brand colors, and image placeholders once in the client constructor, then override or extend them per request.

```ts
import { DraftMyMailAI } from "draftmymail";

const client = new DraftMyMailAI({
  apiKey: process.env.DRAFTMYMAIL_API_KEY,
  context: "Write concise, polished transactional emails for a B2B SaaS company.",
  colors: [
    { useAs: "primary", color: "#14532d" },
    { useAs: "accent", color: "#f59e0b" },
  ],
  images: [
    { useAs: "logo", image_link: "https://cdn.example.com/logo.png" },
    { useAs: "hero", image_link: "https://cdn.example.com/welcome-banner.png" },
  ],
});

const result = await client.generate({
  context: "Create an onboarding email for users starting a free trial.",
  data: {
    firstName: "Ava",
    companyName: "Northwind",
    trialEndsOn: "2026-05-15",
    dashboardUrl: "https://app.example.com/dashboard",
  },
  colors: [
    { useAs: "accent", color: "#dc2626" },
  ],
  images: [
    { useAs: "hero", image_link: "https://cdn.example.com/trial-banner.png" },
  ],
});

console.log(result.subject);
console.log(result.mail);
```

## API

### `new DraftMyMailAI(options?)`

Creates a new client.

#### Options

- `apiKey?: string`
  DraftMyMail API key. If omitted, the SDK reads `process.env.DRAFTMYMAIL_API_KEY`.
- `apiURL?: string`
  Override the default API base URL. Useful for testing or internal environments.
- `context?: string`
  Default prompt/context used for every generation unless overridden in `generate()`.
- `colors?: { useAs: string; color: string }[]`
  Default color tokens available to the generator.
- `images?: { useAs: string; image_link: string }[]`
  Default image placeholders available to the generator.

### `client.generate(params)`

Generates an email and returns:

```ts
{
  subject: string;
  mail: string;
}
```

#### Params

- `data: object`
  Structured data injected into the generation request.
- `context?: string`
  Request-specific context. Overrides the constructor-level `context`.
- `colors?: { useAs: string; color: string }[]`
  Request-specific colors. If a `useAs` key matches a default color, it overrides it.
- `images?: { useAs: string; image_link: string }[]`
  Request-specific images. If a `useAs` key matches a default image, it overrides it.

## Error Handling

The SDK throws `DraftMyMailAIError` for known API failures.

```ts
import { DraftMyMailAI, DraftMyMailAIError } from "draftmymail";

try {
  const client = new DraftMyMailAI();
  const result = await client.generate({
    context: "Write a password reset email.",
    data: { resetUrl: "https://app.example.com/reset" },
  });

  console.log(result.subject);
} catch (error) {
  if (error instanceof DraftMyMailAIError) {
    console.error(error.message);
  } else {
    console.error("Unexpected error", error);
  }
}
```

## Notes

- `DRAFTMYMAIL_API_KEY` is required unless `apiKey` is passed directly.
- The SDK uses the global `fetch` API, so Node.js `18+` is required.
- `context`, `colors`, and `images` can be defined globally and overridden per request.

## License

MIT
