# Security Report — WirelessCom

**Date:** July 2026  
**Scope:** Storefront, admin panel, accounting module, checkout, and cart hardening

## Summary

A security review was performed against authentication, authorization, input handling, pricing integrity, and sensitive data exposure. Hardening measures are applied in server actions and shared libs; residual risks are documented below.

## Implemented Controls

| Area | Control |
|------|---------|
| Passwords | bcrypt cost 12; unified policy (8+ chars, upper/lower/number/special); no plaintext storage |
| Password reset | SHA-256 hashed tokens, 1-hour expiry, single-use, anti-enumeration responses |
| Login lockout | Shared `login-lockout.ts` for **admin and customer** login (5 failures / 15 min / IP+email) |
| Sessions | Auth.js credentials; configurable admin session timeout in Site Settings |
| Authorization | `requireAdmin` / `getActorOrThrow` on admin actions; role checks on sensitive routes |
| Proxy / headers | Admin auth gating in `src/proxy.ts`; CSP and security headers in `next.config.ts` |
| Secrets | SMTP password encrypted at rest; sensitive fields stripped from API responses |
| Audit | Admin actions recorded with optional IP and before/after snapshots |
| File uploads | Invoice logo, expense attachments, and featured images restricted by MIME/size in actions |
| CSRF | Next.js Server Actions + Auth.js defaults for mutating requests |
| **Pricing** | Cart stores product/qty only; checkout recomputes all prices from DB server-side |
| **Cart validation** | `validatePurchasableLine` — ACTIVE products only; variant must match product |
| **Cart IDOR** | Update/remove cart items scoped to the caller's cart |
| **Checkout binding** | PayPal capture/cancel requires session ownership or pending-order cookie |
| **PayPal capture** | Captured amount and currency verified against order before marking PAID |
| **Public forms** | Rate limits on quote, pre-order, and newsletter actions (per IP) |

## Fixes Applied (July 2026 Hardening)

1. **Purchasability validation** — `src/lib/cart-validation.ts` blocks draft/hidden products and invalid variant pairings at add-to-cart and checkout.
2. **Cart IDOR** — `updateCartItemAction` / `removeCartItemAction` only affect items in the current cart.
3. **Checkout session binding** — `src/lib/checkout-access.ts` ties guest PayPal capture to a short-lived httpOnly cookie; logged-in users must own the order.
4. **PayPal amount verification** — Capture response amount/currency must match `order.totalCents` / `order.currency`.
5. **Form rate limits** — Quote, pre-order, and newsletter submissions limited per IP via `rateLimitAction`.

## Earlier Fixes

1. **Customer login lockout** — `loginAction` uses the same lockout tracker as admin login.
2. **Password policy** — Registration, admin create, change-password, and reset flows enforce complexity rules.
3. **Reset tokens** — Stored hashed; invalidated on use; old tokens cleared on new request.
4. **Lead export / admin actions** — Gated behind `getActorOrThrow()`.

## Residual Risks

| Risk | Severity | Notes |
|------|----------|-------|
| Default admin seed password | Medium | Change `admin@example.com` / `admin123` on production after first deploy |
| In-memory rate limits | Low | Resets on container restart; not shared across multiple app instances |
| Stock race under concurrency | Low | Two buyers may briefly order the last unit; consider DB locking if volume grows |
| PayPal refund automation | Low | Refunds recorded manually; no automatic PayPal API reversal |
| Dependency vulnerabilities | Medium | Run `npm audit` periodically |
| Customer checkout audit | Low | Order placement not yet written to audit log (admin edits are) |

## Recommendations

1. Enable WAF / reverse-proxy rate limits on `/account/login`, forgot-password, and quote endpoints.
2. Rotate SMTP and PayPal secrets on a schedule.
3. Enforce HTTPS and HSTS at the hosting layer (Cloudflare or Caddy).
4. Change default admin credentials immediately on production servers.
5. Review `SECURITY_REPORT.md` after major feature releases.

## Verification

- [x] Passwords hashed with bcrypt
- [x] Reset tokens single-use and expiring
- [x] Admin routes require authenticated admin role
- [x] Invoice PDF/email routes require ownership or admin
- [x] Customer + admin login lockout active
- [x] Checkout prices computed server-side from DB
- [x] Cart purchasability validated at add-to-cart and checkout
- [x] PayPal capture amount verified before PAID status
