# `draftmymail-sdk`

TypeScript SDK for generating emails with DraftMyMail AI.

## Install

```bash
npm install draftmymail-sdk
```

## Usage

```ts
import { DraftMyMailAI } from "draftmymail-sdk";

const client = new DraftMyMailAI({
  apiKey: process.env.DRAFTMYMAIL_API_KEY
});

const result = await client.generate({
  context: "Welcome email for new newsletter signups",
  data: {
    email: "user@example.com"
  }
});

console.log(result.subject);
console.log(result.mail);
```

You can also set the API key with `DRAFTMYMAIL_API_KEY`.
