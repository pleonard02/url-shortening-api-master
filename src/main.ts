import { BitlyClient } from "./services/BitlyClient";
import { clearInputError, ERROR_MESSAGES, showInputError, UrlValidationError, validateUrl } from "./utils/errorHandler";
import { renderLink } from "./ui/renderLink";
import { loadLinks, saveLinks } from "./utils/storage";

const shortenInput = document.getElementById('shorten-link') as HTMLInputElement | null;
const shortenForm = document.getElementById('shorten-form') as HTMLFormElement | null;
const shortenBtn = document.getElementById('shorten-btn') as HTMLButtonElement | null;
const bitlyToken = import.meta.env.VITE_BITLY_TOKEN;
const urlError = document.getElementById("url-error") as HTMLParagraphElement | null;
const resultsContainer = document.getElementById("shortened-links-container") as HTMLDivElement | null;
const menuToggle = document.getElementById('mobile-menu-toggle') as HTMLButtonElement | null;
const siteNavigation = document.getElementById('primary-navigation') as HTMLElement | null;

if (!bitlyToken) {
  throw new Error("Bitly token is missing.");
}

const bitlyClient = new BitlyClient(bitlyToken);

const savedLinks = loadLinks();

if (resultsContainer) {
  savedLinks.forEach((link) => {
    renderLink(resultsContainer, link);
  });
}

shortenForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!shortenInput || !urlError) return;

  clearInputError(shortenInput, urlError);

  try {
    const longUrl = validateUrl(shortenInput.value);

    if (shortenBtn) {
      shortenBtn.disabled = true;
      shortenBtn.textContent = "Shortening...";
    }

    shortenForm.setAttribute("aria-busy", "true");
    const data = await bitlyClient.shorten(longUrl);
    
    if (resultsContainer) {
      savedLinks.push(data);
      saveLinks(savedLinks);
      renderLink(resultsContainer, data);
    }

    shortenInput.value = "";
  } catch (error) {
    const message =
      error instanceof UrlValidationError
        ? error.message
        : error instanceof Error
          ? error.message
          : ERROR_MESSAGES.generic;

    showInputError(shortenInput, urlError, message);
  } finally {
    if (shortenBtn) {
      shortenBtn.disabled = false;
      shortenBtn.textContent = "Shorten It!"
    }

    shortenForm.removeAttribute('aria-busy');

  }
});

shortenInput?.addEventListener("input", () => {
  if (!urlError) return;

  clearInputError(shortenInput, urlError);
});

function closeMobileMenu(): void {
  if (!menuToggle || !siteNavigation) return;

  siteNavigation.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation menu");
}

menuToggle?.addEventListener("click", () => {
  if (!siteNavigation) return;

  const isOpen = siteNavigation.classList.toggle("is-open");

  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "Close navigation menu" : "Open navigation menu"
  );
});

siteNavigation
  ?.querySelectorAll<HTMLAnchorElement>("a")
  .forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMobileMenu();
    menuToggle?.focus();
  }
});