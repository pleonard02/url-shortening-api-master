import type { ShortenedLink } from "../models/ShortenedLinks";

export function renderLink(
    container: HTMLDivElement,
    shortenedLink: ShortenedLink
): void {
    const result = document.createElement("article");
    result.classList.add("shortened-link");

    const originalUrl = document.createElement("p"); 
    originalUrl.classList.add("original-url");
    originalUrl.textContent = shortenedLink.long_url;

    const shortUrl = document.createElement("a");
    shortUrl.classList.add("short-url");
    shortUrl.href = shortenedLink.link;
    shortUrl.textContent = shortenedLink.link;
    shortUrl.target = "_blank";
    shortUrl.rel = "noopener noreferrer";

    const copyButton = document.createElement("button");
    copyButton.classList.add("copy-btn");
    copyButton.type = "button";
    copyButton.textContent = "Copy";

    copyButton.addEventListener("click", async () => {
        try {
            await navigator.clipboard.writeText(shortenedLink.link);

            container
                .querySelectorAll<HTMLButtonElement>(".copy-btn")
                .forEach((button) => {
                    button.textContent = "Copy";
                    button.classList.remove("copied");
                });
            
            copyButton.textContent = "Copied!";
            copyButton.classList.add("copied");
        } catch {
            copyButton.textContent = "Copy failed";
        }
    });
    
    result.append(originalUrl, shortUrl, copyButton);
    container.appendChild(result);
}
