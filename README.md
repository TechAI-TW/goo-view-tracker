# BreakPing Rest Bank Cloud Demo

BreakPing Rest Bank is a cloud dashboard concept for a screen-health desktop app.

The intended product flow is:

1. User installs the Windows desktop app.
2. The app records only state-level data: active use, verified rest, rest override, reminders, snoozes, and Rest Cheque events.
3. The app syncs summary data to the cloud.
4. The website shows the user's Rest Bank passbook, daily timeline, Rest Cheques, reports, and billing options.
5. Paid plans unlock cloud sync, long-term history, exports, and future App pass benefits.

## Privacy position

BreakPing is designed as a wellness product, not an employee monitoring tool.

It does not collect:

- screenshots
- keystroke content
- application names
- website URLs
- window titles
- clipboard content

It only stores time segments and wellness events.

## Current version

This repository contains a static GitHub Pages prototype:

- landing page
- Rest Bank dashboard
- health passbook
- Rest Cheque screen
- pricing / checkout placeholder
- desktop sync data preview

The current web demo uses sample data and localStorage. A production version should replace the mock sync layer with a real backend API.

## Suggested production stack

- Web: Next.js or Remix
- Database: PostgreSQL / Supabase
- Auth: email magic link + OAuth
- Payments Taiwan: ECPay / NewebPay / TapPay
- Payments global: Paddle / Lemon Squeezy / Stripe where supported
- Desktop app: signed Windows EXE with background sync

## Deployment

This repo can be served through GitHub Pages.

Default URL pattern:

```text
https://techai-tw.github.io/goo-view-tracker/
```

## Pilot scope

This demo is suitable for product validation, investor/partner discussion, and UX review. It is not yet a production payment or medical-health compliance system.
