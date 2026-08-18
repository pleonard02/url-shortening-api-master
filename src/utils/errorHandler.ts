export const ERROR_MESSAGES = {
    emptyUrl: "Please add a link.",
    invalidURL: "Please enter a complete URL, including https://.",
    generic: "Something went wrong. Please try again.",
} as const;

export class UrlValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "UrlValidationError"
    }
}

export function validateUrl(value: string): string {
    const trimmedValue = value.trim();

    if(!trimmedValue) {
        throw new UrlValidationError(ERROR_MESSAGES.emptyUrl);
    }

    try {
        return new URL(trimmedValue).href;
    } catch {
        throw new UrlValidationError(ERROR_MESSAGES.invalidURL);
    }
}

export function showInputError(
    input: HTMLInputElement,
    errorElement: HTMLParagraphElement,
    message: string
): void {
    input.classList.add("input-error");
    input.setAttribute("aria-invalid", "true");
    errorElement.textContent = message;
    input.focus();
}

export function clearInputError(
    input: HTMLInputElement,
    errorElement: HTMLParagraphElement
): void {
    input.classList.remove("input-error");
    input.removeAttribute("aria-invalid");
    errorElement.textContent = "";
}

export class ApiError extends Error {
    public readonly status: number;
    constructor(message: string, status: number) {
        super(message);

        this.name = "ApiError";
        this.status = status;
    }
}