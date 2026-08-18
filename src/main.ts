import { BitlyClient } from "./services/BitlyClient";
import { clearInputError, ERROR_MESSAGES, showInputError, UrlValidationError, validateUrl } from "./utils/errorHandler";
import { renderLink } from "./ui/renderLink";
import { loadLinks, saveLinks } from "./utils/storage";

const shortenInput = document.getElementById('shorten-link') as HTMLInputElement | null;
const shortenBtn = document.getElementById('shorten-btn') as HTMLButtonElement | null;
const bitlyToken = import.meta.env.VITE_BITLY_TOKEN;
const urlError = document.getElementById("url-error") as HTMLParagraphElement | null;
const resultsContainer = document.getElementById("shortened-links-container") as HTMLDivElement | null;

if (!bitlyToken) {
  throw new Error("Bitly token is missing.");
}

const bitlyClient = new BitlyClient(bitlyToken);

let savedLinks = loadLinks();

if (resultsContainer) {
  savedLinks.forEach((link) => {
    renderLink(resultsContainer, link);
  });
}

shortenBtn?.addEventListener("click", async () => {
  if (!shortenInput || !urlError) return;

  clearInputError(shortenInput, urlError);

  try {
  const longUrl = validateUrl(shortenInput.value);
  const data = await bitlyClient.shorten(longUrl);
  
  if (resultsContainer) {
    savedLinks.push(data);
    saveLinks(savedLinks);
    renderLink(resultsContainer, data);
  }

  shortenInput.value = "";

  } catch (error) {
    const message = error instanceof UrlValidationError
      ? error.message
      : error instanceof Error
        ? error.message
        : ERROR_MESSAGES.generic;

    showInputError(shortenInput, urlError, message);
  }
}); 

