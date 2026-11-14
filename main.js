/**
 * THE SECOND SERVE — Main Site Script
 * Configure live organization metrics, donation link, and public contact info below.
 */

const SITE_CONFIG = {
  ballsCollected: 1150,
  ballsShipped: 500,
  shipmentsCompleted: 1,
  packagesSent: 2,
  // Update these once confirmed before launch:
  donateUrl: "", // e.g., "https://donate.stripe.com/your-link"
  contactEmail: "contact@thesecondserve.org",
  contactPhone: "" // Optional public phone/text number, e.g., "(269) 555-0199"
};

document.addEventListener("DOMContentLoaded", () => {
  initMobileNav();
  initImpactCounters();
  initDonateControls();
  initContactPlaceholders();
  initPartnerForm();
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
  const donateStatus = document.getElementById("donate-url-status");
  if (!donateBtn) return;

  if (SITE_CONFIG.donateUrl && SITE_CONFIG.donateUrl.trim() !== "") {
    donateBtn.href = SITE_CONFIG.donateUrl;
    donateBtn.target = "_blank";
    donateBtn.rel = "noopener noreferrer";
    if (donateStatus) {
      donateStatus.textContent = "You will be directed to our secure fiscal sponsor donation page.";
    }
  } else {
    donateBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (donateStatus) {
        donateStatus.textContent =
          "Our online donation link is currently being finalized. Please contact us directly via the Partner With Us page to arrange a contribution.";
      }
    });
  }
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

function initPartnerForm() {
  const form = document.getElementById("partner-inquiry-form");
  const status = document.getElementById("partner-form-status");
  if (!form || !status) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const facility = document.getElementById("facility-name").value.trim();
    const contactName = document.getElementById("contact-name").value.trim();
    const replyContact = document.getElementById("reply-contact").value.trim();
    const inquiryType = document.getElementById("inquiry-type").value;
    const notes = document.getElementById("notes").value.trim();

    const subject = encodeURIComponent(`Facility Inquiry: ${facility || "Tennis Facility"} — The Second Serve`);
    const bodyLines = [
      `Facility / Organization: ${facility}`,
      `Contact Name: ${contactName}`,
      `Email / Phone: ${replyContact}`,
      `Program Interest: ${inquiryType}`,
      notes ? `Additional Details: ${notes}` : ""
    ].filter(Boolean);

    const mailtoHref = `mailto:${SITE_CONFIG.contactEmail}?subject=${subject}&body=${encodeURIComponent(bodyLines.join("\n"))}`;
    status.textContent = `Opening your email client to send this inquiry to ${SITE_CONFIG.contactEmail}...`;
    window.location.href = mailtoHref;
  });
}
