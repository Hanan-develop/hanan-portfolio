# Abdul Hanan — Portfolio Website

> WordPress Developer & Shopify Designer · Lahore, Pakistan

Modern, responsive portfolio website with glassmorphism dark theme, animated yellow accents, and full visitor analytics tracking via a separate private dashboard.

## ✨ Features

- 🎨 Premium dark + yellow theme with glassmorphism effects
- ⚡ Smooth scroll, reveal animations, custom typing effect
- 🌟 Rotating "Available for work" badge in hero
- 📱 Fully responsive (mobile, tablet, desktop)
- 📊 Built-in analytics tracker (sends events to private dashboard)
- 💬 Contact form with AJAX submission
- 🚀 Floating WhatsApp button with mobile popup
- ⌨️ Live typing animation, animated counters, skill bars
- 🔄 Sticky sidebar navigation with active section highlighting
- 📈 Scroll progress bar
- ✏️ Floating labels on form fields

## 📂 Project Structure

```
hanan-website/
├── index.html              # Main portfolio page
├── CSS/
│   └── Style.css          # All styles (glassmorphism, animations)
├── JS/
│   ├── script.js          # UI interactions (typing, reveal, form)
│   └── tracker.js         # Analytics tracker (talks to dashboard API)
├── img/                    # Project images & profile (you add these)
│   ├── Image-1.jpg ... Image-6.jpg
│   ├── Scroll_To_Top.png
│   └── (any other assets)
└── Abdul Hanan.pdf         # CV (you add this)
```

## 🚀 Quick Start

### 1. Add your assets

Drop the following into the project root:

- `img/` folder with your portfolio images (`Image-1.jpg` through `Image-6.jpg`, `Scroll_To_Top.png`)
- `Abdul Hanan.pdf` (CV file for the Download CV button)

### 2. Connect with the admin dashboard

Open `JS/tracker.js` and update line 23 with your **deployed dashboard's API URL**:

```js
const ADMIN_API = 'https://YOUR-DASHBOARD-URL.com/api';
```

> The dashboard is hosted in the **private** repo `hanan-dashboard`. See its README for deployment instructions.

If you skip this step, the tracker just silently fails (won't break the site) — analytics won't be collected, but the portfolio will work fine.

### 3. Deploy

This is a **static site** — works anywhere:

| Platform | How |
|----------|-----|
| **GitHub Pages** | Settings → Pages → Deploy from branch `main` / `(root)` |
| **Netlify** | Drag & drop the folder, or connect this repo |
| **Vercel** | Import the repo, no build settings needed |
| **Hostinger** | Upload all files via File Manager / FTP to `public_html/` |

## 🔗 How It Connects to the Dashboard

```
┌──────────────────┐                  ┌──────────────────────┐
│  hanan-website   │   tracking POST  │   hanan-dashboard    │
│   (PUBLIC repo)  │ ───────────────▶ │   (PRIVATE repo)     │
│                  │                  │                      │
│  tracker.js  ────┼──── events ──────┼──▶  api/track.php    │
│  contact form ───┼──── submission ──┼──▶  api/submit.php   │
│                  │                  │                      │
│                  │                  │   Dashboard UI       │
│                  │                  │   (login required)   │
└──────────────────┘                  └──────────────────────┘
```

The website only needs the dashboard's **API URL** — nothing else. Database, auth, and admin UI all live inside the dashboard repo.

## 🛠 Customization

| What | Where |
|------|-------|
| Name, role, bio | `index.html` (hero, about, contact sections) |
| Typed words rotating | `JS/script.js` → `CONFIG.typedWords` |
| WhatsApp number | `JS/script.js` → `CONFIG.whatsappNumber` |
| Skill percentages | `index.html` → skill `data-percent="..."` |
| Project titles | `index.html` → portfolio section |
| Counter numbers | `index.html` → about counter `data-count="..."` |
| Yellow accent color | `CSS/Style.css` → `--yellow` variable |

## 📜 License

Personal portfolio — feel free to fork and adapt for your own use.

## 👤 Author

**Abdul Hanan** — WordPress Developer & Shopify Designer
- Email: abdulhanan4145534@gmail.com
- Phone: +92 325 4145534
- Location: Lahore, Pakistan
- GitHub: [@Hanan-develop](https://github.com/Hanan-develop)
- LinkedIn: [abdul-hanan](https://www.linkedin.com/in/abdul-hanan-b23a24339/)
