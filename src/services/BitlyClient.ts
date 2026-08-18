import type { ShortenedLink } from "../models/ShortenedLinks";
import { ApiError } from "../utils/errorHandler";

interface BitlyErrorResponse {
    message?: string;
    description?: string;
}

export class BitlyClient {
    private readonly token: string;
    private readonly endpoint =
        "https://api-ssl.bitly.com/v4/shorten";

    constructor(token: string) {
        this.token = token;
    }

    async shorten(longUrl: string): Promise<ShortenedLink> {
        const response = await fetch(this.endpoint, {
            method: "POST",

            headers: {
                Authorization: `Bearer ${this.token}`,
                "Content-Type": "application/json",
            },

            body: JSON.stringify({
                long_url: longUrl,
            }),
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            const errorData = data as BitlyErrorResponse;

            throw new ApiError(
                errorData.description ||
                    errorData.message ||
                    "Bitly could not shorten this URL.",
                response.status
            );
        }

        return data as ShortenedLink;
    }
}
