# Extrava — Website

Marketing site for **Extrava**, the company behind `extrava` — a wearable sensor that detects IV extravasation in real time.

Built with **Next.js 14 (App Router) + TypeScript + Tailwind CSS**.

---

## Local development

```bash
npm install
npm run dev
```

The dev server runs at `http://localhost:3000`.

## Production build

```bash
npm run build
npm start
```

## Project structure

```
extrava-website/
├── app/
│   ├── layout.tsx          # Root layout (Navbar + Footer wrap every page)
│   ├── page.tsx            # Home
│   ├── globals.css         # Tailwind base + design tokens
│   ├── product/page.tsx    # patch. product page
│   ├── technology/page.tsx # How the device works + clinical pipeline
│   ├── about/page.tsx      # Company + values + careers
│   └── contact/page.tsx    # Contact form + addresses
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── Hero.tsx
│   ├── LogoStrip.tsx
│   ├── FeatureSection.tsx  # "The problem" stats
│   ├── HowItWorks.tsx      # 4-step explainer
│   ├── Stats.tsx           # Big-number marquee
│   └── CTASection.tsx      # Reusable CTA used at the bottom of most pages
├── tailwind.config.ts      # Brand colors + gradients live here
├── next.config.mjs
├── tsconfig.json
└── package.json
```

## Design tokens

All brand color and gradient tokens live in `tailwind.config.ts`. Most important:

- `bg-grad-signal` — primary brand gradient (cyan → magenta)
- `bg-grad-heat` — accent gradient (coral → magenta → violet)
- `text-gradient` (utility in `globals.css`) — gradient text fill
- `card`, `btn-primary`, `btn-secondary`, `chip` — reusable component classes

To rebrand, change `theme.extend.colors` + `theme.extend.backgroundImage` in `tailwind.config.ts`.

## Deploying

### Vercel (one click)

1. Push this repo to GitHub.
2. Import the repo into Vercel (https://vercel.com/new).
3. Accept all defaults — Next.js is auto-detected.

### Anywhere else

Run `npm run build` then `npm start`. The app is a standard Next.js server. Or use `next export` patterns if you need a fully static deploy.

## Roadmap

- [ ] Real customer / pilot-partner logos in `LogoStrip.tsx`
- [ ] OG / Twitter card images in `public/`
- [ ] Favicon set in `app/`
- [ ] Form backend (currently form is a mailto stub — wire to Formspree, Resend, or your own API route)
- [ ] Blog / news at `/news`

---

© Extrava, Inc. patch. is an investigational device. Not yet cleared by the FDA.
