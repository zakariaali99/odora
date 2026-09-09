> ✅ APPLIED 2026-09-08 (settings.py): DEBUG default False, SECRET_KEY raises in prod, ALLOWED_HOSTS from env, CORS_ALLOW_ALL_ORIGINS=False + allow-list, HSTS/secure-cookies gated on prod. Verify before deploy.

# FIX PLAN — Backend security (before any deploy)

> **Type:** PLAN. Source: `reviews/review-2026-09-08-full.md`. All are fine for LOCAL dev; they MUST be locked before production/staging.
> **File:** `backend/odora_backend/settings.py`.

## 1 — DEBUG off by default
`DEBUG = os.environ.get('DJANGO_DEBUG', 'False')...` — default **False**; only True when explicitly set for dev.

## 2 — Real ALLOWED_HOSTS
Replace `ALLOWED_HOSTS = ['*']` with a value from env (comma-split), e.g. `os.environ.get('DJANGO_ALLOWED_HOSTS','localhost,127.0.0.1').split(',')`. Never `*` in prod.

## 3 — Lock CORS
Remove `CORS_ALLOW_ALL_ORIGINS = True`. Use an explicit allow-list from env: `CORS_ALLOWED_ORIGINS = os.environ.get('CORS_ORIGINS','http://localhost:5173').split(',')`. Keep `CORS_ALLOW_CREDENTIALS = True` ONLY with a concrete origin list (never with allow-all).

## 4 — SECRET_KEY has no insecure fallback in prod
Keep reading from `DJANGO_SECRET_KEY`. If unset AND DEBUG is False, **raise** (fail fast) instead of using a hardcoded default.

## 5 — Hardening (prod)
When DEBUG is False, set `SECURE_SSL_REDIRECT`, `SESSION_COOKIE_SECURE`, `CSRF_COOKIE_SECURE`, `SECURE_HSTS_SECONDS`. Ensure `.env`, `db.sqlite3`, `venv/`, `media/` are git-ignored and not deployed as code.

## DoD
- [ ] DEBUG defaults False; True only via env in dev.
- [ ] ALLOWED_HOSTS + CORS from env allow-lists (no `*`, no allow-all-with-credentials).
- [ ] SECRET_KEY fails fast when unset in prod.
- [ ] Secure-cookie/HSTS flags on when DEBUG False.
