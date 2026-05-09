
export interface color { useAs: string, color: string }
export interface image { useAs: string, image_link: string }

export type DMMOptions = {
    apiURL?: string,
    apiKey?: string,
    context?: string,
    colors?: color[]
    images?: image[]
} | undefined

export type GenerateParams = {
    context?: string
    data: object
    colors?: color[]
    images?: image[]
}

export type MailResponse = {
    subject: string,
    mail: string
}

export class DraftMyMailAI {
    private apiKey: string;
    private globalContext: string | undefined;
    private globalColors: color[] | undefined;
    private globalImages: image[] | undefined;

    private API_URL: string | undefined;

    private KEYS_URL = "https://draftmymail.com/account/api-keys";
    private UPGRADE_URL = "https://draftmymail.com/pricing";
    private SUPPORT_URL = "https://draftmymail.com/contact";

    constructor(options?: DMMOptions) {
        if (options?.apiKey) {
            this.apiKey = options?.apiKey;
        }
        else if (process.env.DRAFTMYMAIL_API_KEY) {
            this.apiKey = process.env.DRAFTMYMAIL_API_KEY;
        }
        else {
            throw new DraftMyMailAIError("DRAFTMYMAIL_API_KEY Not Found");
        }
        this.API_URL = options?.apiURL || "https://api.draftmymail.com";
        this.globalContext = options?.context;
        this.globalImages = options?.images;
        this.globalColors = options?.colors;
    }

    async generate({ data, images, colors, context }: GenerateParams) : Promise<MailResponse>
    {
        const mail_context = context || this.globalContext;
        let mail_colors: color[] = this.globalColors || [];
        (colors ?? []).forEach(c => {
            const index = mail_colors.findIndex(a => a.useAs == c.useAs);
            if (index !== -1) {
                mail_colors[index] = c;
            }
            else {
                mail_colors.push(c);
            }
        })

        let mail_images: image[] = this.globalImages?.map(i => ({useAs: i.useAs, image_link: `https://${i.useAs}`})) || [];
        (images ?? []).forEach(i => {
            const index = mail_images.findIndex(c => c.useAs == i.useAs);
            if (index !== -1) {
                mail_images[index] = { useAs: i.useAs, image_link: `https://${i.useAs}`};
            }
            else {
                mail_images.push({ useAs: i.useAs, image_link: `https://${i.useAs}`});
            }
        })

        try {
            const request = await fetch(`${this.API_URL}/v1/mail/generate`, {
                method: "POST",
                body: JSON.stringify({
                    context: mail_context,
                    data,
                    images: mail_images,
                    colors: mail_colors
                }),
                headers: {
                    "Content-Type": "application/json",
                    "x-dmm-key": this.apiKey
                }
            });

            if (request.status == 400) {
                throw new DraftMyMailAIError("Invalid Parameters! (Check context and data)")
            }
            else if (request.status == 401) {
                throw new DraftMyMailAIError("API Key Not Found! (set API Key in DRAFTMYMAIL_API_KEY env variable or set it in options)")
            }
            else if (request.status == 403) {
                throw new DraftMyMailAIError(`Invalid API Key! Verify key on ${this.KEYS_URL}`)
            }
            else if (request.status == 429) {
                throw new DraftMyMailAIError(`Generation Limit Reached! Upgrade your account on ${this.UPGRADE_URL}`);
            }
            else if (request.status == 500) {
                throw new DraftMyMailAIError(`Failed to generate mail! Get Help at ${this.SUPPORT_URL}`);
            }

            const response = await request.json() as MailResponse;
            
            let html = response.mail;
            mail_images.forEach(image => {
                html.replaceAll(`https://${image.useAs}`, image.image_link)
            })

            return {
                subject: response.subject,
                mail: response.mail
            }
        }
        catch (err) {
            if (err instanceof DraftMyMailAIError) { throw err }
            throw new Error(`Failed to generate mail! Get Help at ${this.SUPPORT_URL}`);
        }
    }
}

export class DraftMyMailAIError extends Error {
    constructor(message?: string) {
        super(message);
        this.name = "DraftMyMailAIError";
        
        this.stack = undefined;
    }
}
