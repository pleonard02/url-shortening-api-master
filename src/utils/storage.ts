import type { ShortenedLink } from "../models/ShortenedLinks";

const STORAGE_KEY = "shortened-links";

function isShortenedLink(value: unknown): value is ShortenedLink {
    if (typeof value !== "object" || value === null) {
        return false;
    }

    const candidate = value as Record<string, unknown>;

    return(
        typeof candidate.long_url === "string" && typeof candidate.link === "string"
    );
}

export function loadLinks(): ShortenedLink[] {
    const storedValue = localStorage.getItem(STORAGE_KEY);

    if (!storedValue) {
        return [];
    }

    try {
        const parsedValue: unknown = JSON.parse(storedValue);

        if (!Array.isArray(parsedValue)) {
            return [];
        }

        return parsedValue.filter(isShortenedLink);
    } catch {
        return [];
    }
}

export function saveLinks(links: ShortenedLink[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
}