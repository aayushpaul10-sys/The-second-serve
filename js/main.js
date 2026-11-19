/**
 * THE SECOND SERVE — Main Site Script
 * Configure live organization metrics, donation link, and public contact info below.
 */

const SITE_CONFIG = {
  ballsCollected: 1150,
  ballsShipped: 1000,
  shipmentsCompleted: 1,
  packagesSent: 2,
  // Update these once confirmed before launch:
  donateUrl: "https://hcb.hackclub.com/donations/start/the-second-serve",
  contactEmail: "contact@thesecondserve.org",
  contactPhone: ""
};

document.addEventListener("DOMContentLoaded", () => {
  initMobileNav();
  initImpactCounters();
  initDonateControls();
  initContactPlaceholders();
});

function initMobileNav() {
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.querySelector(".nav-links");
  if (!toggle || !menu) return;

  toggle.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
}

function initImpactCounters() {
  const collectedEls = document.querySelectorAll("[data-counter='collected']");
  const shippedEls = document.querySelectorAll("[data-counter='shipped']");

  collectedEls.forEach((el) => {
    el.textContent = SITE_CONFIG.ballsCollected.toLocaleString("en-US");
  });

  shippedEls.forEach((el) => {
    el.textContent = SITE_CONFIG.ballsShipped.toLocaleString("en-US");
  });
}

function initDonateControls() {
  const donateBtn = document.getElementById("primary-donate-btn");
  if (!donateBtn) return;
  donateBtn.href = SITE_CONFIG.donateUrl;
  donateBtn.target = "_blank";
  donateBtn.rel = "noopener noreferrer";
}

function initContactPlaceholders() {
  const emailLinks = document.querySelectorAll("[data-contact-email]");
  emailLinks.forEach((link) => {
    link.textContent = SITE_CONFIG.contactEmail;
    link.href = `mailto:${SITE_CONFIG.contactEmail}`;
  });

  const phoneContainers = document.querySelectorAll("[data-contact-phone-row]");
  const phoneLinks = document.querySelectorAll("[data-contact-phone]");
  if (SITE_CONFIG.contactPhone && SITE_CONFIG.contactPhone.trim() !== "") {
    phoneLinks.forEach((link) => {
      link.textContent = SITE_CONFIG.contactPhone;
      link.href = `tel:${SITE_CONFIG.contactPhone.replace(/[^0-9+]/g, "")}`;
    });
  } else {
    phoneContainers.forEach((row) => {
      row.style.display = "none";
    });
  }
}

