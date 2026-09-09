# Odora Web Store & API — Production Deployment Guide

This guide documents the exact environment variables, build procedures, and execution commands required to deploy the **Odora** web storefront and shared Django API backend.

---

## 1. Architecture Overview

- **Frontend (`odora/frontend`)**: Single-page application built with React 18, Vite, TypeScript, TailwindCSS, and `react-i18next`. Compiles into high-performance static HTML/JS/CSS assets with route-level code-splitting (all chunks `< 165 KB`).
- **Backend (`odora/backend`)**: Django 5.1 REST Framework API serving storefront data, session-based & JWT authentication, cart, order management, and administrative CRM/CMS endpoints.
- **Media & Assets**: Product images, colorway photography, and fragrance notes are served from `/media/products/`.

---

## 2. Production Environment Variables

Never commit secrets or credentials to version control. Set these variables via your server environment or container orchestration secrets.

### A. Backend (`odora/backend/.env`)

| Variable | Recommended Production Value | Description |
|---|---|---|
| `DJANGO_DEBUG` | `False` | Disables debug mode and Django detailed error pages. |
| `DJANGO_SECRET_KEY` | *(Generate a 50+ char random string)* | Cryptographic key for sessions, CSRF, and signing. Generate via `python -c "import secrets; print(secrets.token_urlsafe(50))"`. |
| `DJANGO_ALLOWED_HOSTS` | `odora.ly,api.odora.ly,www.odora.ly` | Comma-separated list of valid Host header domains. |
| `CORS_ORIGINS` | `https://odora.ly,https://www.odora.ly` | Comma-separated list of allowed origins. Locked down (`CORS_ALLOW_ALL_ORIGINS=False`). |
| `SECURE_SSL_REDIRECT` | `True` | Redirects all incoming HTTP requests to HTTPS. |
| `SESSION_COOKIE_SECURE` | `True` | Ensures session cookies are only transmitted over HTTPS. |
| `CSRF_COOKIE_SECURE` | `True` | Ensures CSRF cookies are only transmitted over HTTPS. |
| `SECURE_HSTS_SECONDS` | `31536000` | HTTP Strict Transport Security header duration (1 year). |

### B. Frontend (`odora/frontend/.env.production`)

| Variable | Recommended Production Value | Description |
|---|---|---|
| `VITE_API_BASE_URL` | `https://api.odora.ly/api/v1` *(or `/api/v1` if served behind same reverse proxy)* | Base URL for all API client requests in `src/services/api.ts`. |

---

## 3. Build & Run Procedures

### Step 1: Backend Preparation & Launch

```bash
# 1. Navigate to backend directory
cd odora/backend

# 2. Activate virtual environment
source venv/bin/activate

# 3. Install production dependencies
pip install -r requirements.txt
pip install gunicorn

# 4. Apply database migrations
python manage.py migrate --noinput

# 5. Seed initial brand data (Diffusers, Oils, Bundles, CMS content, Admin user)
python manage.py seed_odora

# 6. Collect static assets
python manage.py collectstatic --noinput

# 7. Start production WSGI server with Gunicorn
gunicorn odora_backend.wsgi:application \
    --bind 127.0.0.1:8000 \
    --workers 3 \
    --threads 2 \
    --access-logfile - \
    --error-logfile -
```

### Step 2: Frontend Build

```bash
# 1. Navigate to frontend directory
cd odora/frontend

# 2. Install dependencies
npm ci

# 3. Typecheck verification
npm run typecheck

# 4. Compile optimized production bundle
npm run build

# Output directory: odora/frontend/dist/
```

---

## 4. Reverse Proxy Configuration (Nginx Example)

```nginx
# Odora Production Server Block
server {
    listen 443 ssl http2;
    server_name odora.ly www.odora.ly;

    ssl_certificate /etc/letsencrypt/live/odora.ly/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/odora.ly/privkey.pem;

    # Frontend Static Distribution
    root /var/www/odora/frontend/dist;
    index index.html;

    # Gzip & Performance
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml image/svg+xml;

    # SPA Routing (fallback to index.html for React Router)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API Proxy to Django
    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Django Admin Proxy
    location /django-admin/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Media files (Product packshots, colorways)
    location /media/ {
        alias /var/www/odora/backend/media/;
        expires 30d;
        add_header Cache-Control "public, max-age=2592000";
    }

    # Static files (Django admin styling)
    location /static/ {
        alias /var/www/odora/backend/staticfiles/;
        expires 30d;
        add_header Cache-Control "public, max-age=2592000";
    }
}
```

---

## 5. Pre-Launch Verification Checklist

Before opening traffic to public customers:

- [ ] `DJANGO_DEBUG=False` verified on the production host.
- [ ] `DJANGO_SECRET_KEY` is randomized, securely generated, and not shared.
- [ ] `DJANGO_ALLOWED_HOSTS` only permits registered production hostnames.
- [ ] `CORS_ORIGINS` is locked down to frontend origins.
- [ ] Database seeded (`python manage.py seed_odora`) and admin password updated.
- [ ] Product imagery in `/media/products/` verified (real packshots of A316, oils, and bundles).
- [ ] SSL/TLS certificate is active with A+ SSL Labs rating.
- [ ] Route-level lazy loading confirmed (all bundle chunks `< 165 KB`).
- [ ] WCAG AA color contrast (≥ 4.5:1 body text, ≥ 3:1 large elements, visible `:focus-visible` states) validated across both Arabic and English.
