# The Second Serve — Website Repository

Official static website for **The Second Serve** (`thesecondserve.org`), a 501(c)(3) fiscally sponsored project founded in September 2026 by Aayush Paul and Ryan in Southwest Michigan.

## Mission
Reduce the number of used tennis balls ending up in landfills by collecting them from tennis facilities for free and shipping them to [RecycleBalls](https://www.recycleballs.org/) for processing.

---

## Repository Structure

```text
thesecondserve/
├── index.html                    # Home page
├── about.html                    # About The Second Serve
├── founders.html                 # The Founders (Aayush Paul & Ryan)
├── our-work.html                 # Operations Gallery & Shipping Records
├── partner.html                  # Partner With Us (Facility Inquiries)
├── sponsors.html                 # Sponsors & Partner Grid
├── donate.html                   # Donate Page
├── CNAME                         # Custom domain configuration (thesecondserve.org)
├── README.md                     # Deployment & maintenance guide
├── css/
│   └── styles.css                # Editorial + community stylesheet (#103B2E, #B8E52B, #FFFFFF)
├── js/
│   └── main.js                   # Dynamic impact counters, mobile menu, interactive forms
└── assets/
    ├── logo.png                  # Compact wordmark/icon mark
    ├── collection-1.jpg          # Replace with actual photograph 1 (boxes of collected balls)
    ├── collection-2.jpg          # Replace with actual photograph 2 (additional collected balls)
    └── ups-receipt-redacted.jpg  # Replace with redacted UPS Ground drop-off receipt
```

---

## How to Update Impact Numbers & Settings

Open `js/main.js` and edit the `SITE_CONFIG` object at the top of the file:

```javascript
const SITE_CONFIG = {
  ballsCollected: 1150,
  ballsShipped: 500,
  shipmentsCompleted: 1,
  packagesSent: 2,
  donateUrl: "#donate-link-pending", // Replace with live 501(c)(3) donation URL
  contactEmail: "contact@thesecondserve.org", // Replace with verified public email
  contactPhone: "" // Optional: add public phone/text number
};
```
Updating `ballsCollected` or `ballsShipped` in `js/main.js` automatically updates the dynamic counters across the website without needing to rewrite HTML copy.

---

## Before Publishing Checklist

1. **Replace Placeholder Assets in `/assets/`:**
   - Replace `assets/collection-1.jpg` and `assets/collection-2.jpg` with the founders' actual collection photographs.
   - Replace `assets/ups-receipt-redacted.jpg` with the actual UPS Ground drop-off receipt (ensure tracking numbers, barcodes, and personal details are redacted).
   - Replace `assets/logo.png` if desired (the site uses a clean editorial wordmark in the navigation by default).
2. **Confirm Donation URL & Contact Details:**
   - Update `donateUrl`, `contactEmail`, and `contactPhone` in `js/main.js` (and `donate.html` / `partner.html` if desired).
3. **Add Sponsors:**
   - When sponsors are secured, duplicate the sponsor card template in `sponsors.html` and add their logo file to `assets/`.

---

## GitHub Pages Deployment Instructions

1. Extract this ZIP archive.
2. Upload all files and folders (`index.html`, `about.html`, `css/`, `js/`, `assets/`, `CNAME`, etc.) directly into the **root** of your GitHub repository.
3. Commit and push the changes to the `main` branch.
4. Go to your repository on GitHub and click **Settings** → **Pages**.
5. Under **Build and deployment**, set **Source** to `Deploy from a branch`, select `main` branch and `/ (root)` folder, and click **Save**.
6. Verify that `thesecondserve.org` is listed under **Custom domain** (preserved via the `CNAME` file and your DNS records).
