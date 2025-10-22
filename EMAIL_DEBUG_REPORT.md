# Email Debug Report 🔍

## Trenutno Stanje

### 📧 Email Konfiguracija (`lib/email.ts`)

**SMTP Server:**
- Host: `smtp.gmail.com`
- Port: `587`
- Secure: `false` (STARTTLS)

**FROM Email:**
- `ognjen.drinic31@gmail.com` (Gmail SMTP)

**TO Email (Trenutno):**
```typescript
const RECIPIENT_EMAILS = [TEST_EMAIL] // samo ognjen.drinic31@gmail.com
```

**Environment Varijable Potrebne:**
- `EMAIL_USER` ili koristi default `ognjen.drinic31@gmail.com`
- `EMAIL_PASS` ili `GMAIL_APP_PASSWORD` ⚠️ **NEDOSTAJE!**

---

## 🔴 Problemi

### 1. Nema Gmail App Password
Gmail zahteva **App Password** umesto običnog password-a za SMTP autentifikaciju.

**Linija 11 u `lib/email.ts`:**
```typescript
pass: (process.env.EMAIL_PASS || process.env.GMAIL_APP_PASSWORD)?.replace(/\s/g, '')
```

Ako nema environment varijable, `pass` je `undefined` i autentifikacija pada!

### 2. Trenutna `.env.local` Datoteka
```
NEXT_PUBLIC_ENABLE_DNB_VI=true
NEXT_PUBLIC_DNB_VI_SITE_ID=paapi1084
NEXT_PUBLIC_GA_ID=G-S0YZ6MZWK1
NEXT_PUBLIC_DNB_VI_DEBUG=true
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**NEMA EMAIL VARIJABLI!**

---

## ✅ Rešenje

### Korak 1: Kreiraj Gmail App Password

1. Idi na Google Account Settings: https://myaccount.google.com/security
2. Uključi **2-Step Verification** (ako već nije)
3. Idi na **App Passwords**: https://myaccount.google.com/apppasswords
4. Kreiraj novi App Password:
   - App name: "Infinus Website"
   - Kopiraj generisani 16-karakterni password

### Korak 2: Dodaj u `.env.local`

```bash
# Email Configuration
EMAIL_USER=ognjen.drinic31@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx  # <-- Gmail App Password ovde
```

### Korak 3: Restartuj Dev Server

```bash
npm run dev
```

### Korak 4: Testiraj

1. Popuni Join Us formu na homepage-u
2. Proveri konzolu u browser-u (F12) za greške
3. Proveri server logs u terminalu
4. Proveri inbox `ognjen.drinic31@gmail.com`

---

## 📝 Dodatne Informacije

### Contact Form vs Join Team Form

**Join Team Form** (`/api/join-team`):
- Ne šalje attachment
- JSON payload
- Endpoint: `/api/join-team/route.ts`

**Contact Form** (`/api/contact`):
- Može imati attachment
- FormData payload
- Endpoint: `/app/api/contact/route.ts`

### Production Email (Za Kasnije)

Kada sve bude radilo, promeniti liniju 21 u `lib/email.ts`:

```typescript
// Trenutno
const RECIPIENT_EMAILS = [TEST_EMAIL]

// Kasnije (production)
const RECIPIENT_EMAILS = [PRODUCTION_EMAIL, TEST_EMAIL]
// office@infinus.rs + ognjen.drinic31@gmail.com
```

---

## 🧪 Test Plan

- [ ] Kreiraj Gmail App Password
- [ ] Dodaj u `.env.local`
- [ ] Restartuj server
- [ ] Test Join Us forma
- [ ] Test Contact forma
- [ ] Proveri mejl inbox
- [ ] Proveri da li attachments rade (Contact forma)
- [ ] Dodaj `office@infinus.rs` u recipients
- [ ] Final test sa obe adrese

---

**Status:** ⏳ Čeka Gmail App Password setup

