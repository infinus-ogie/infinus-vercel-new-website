# ⚡ Email Quick Start (5 minuta)

## Problem
Email forme ne rade jer nedostaje Gmail App Password.

## Brzo Rešenje

### 1️⃣ Kreiraj Gmail App Password (2 min)
```
→ https://myaccount.google.com/apppasswords
→ Create App Password: "Infinus Website"
→ Kopiraj 16-char password
```

### 2️⃣ Dodaj u `.env.local` (1 min)
```bash
EMAIL_USER=ognjen.drinic31@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx  # paste ovde
```

### 3️⃣ Restartuj Server (10 sec)
```bash
# Zaustavi (Ctrl+C)
npm run dev
```

### 4️⃣ Testiraj (1 min)
```bash
npx tsx scripts/test-email.ts
```

✅ **Ako vidiš:** "Email sent successfully!" → **RADI!** 🎉

❌ **Ako vidiš grešku** → Čitaj `EMAIL_SETUP_GUIDE.md`

---

## Test Forme

**Join Us:** http://localhost:3000 → scroll do "Join Our Team"
**Contact:** Popuni Contact formu na sajtu

**Proveri inbox:** ognjen.drinic31@gmail.com

---

## Vercel Production

U Vercel Dashboard → Settings → Environment Variables:

```
EMAIL_USER = ognjen.drinic31@gmail.com
GMAIL_APP_PASSWORD = [tvoj app password]
```

Redeploy → Done! ✅

---

## Dodaj office@infinus.rs (Kasnije)

**Fajl:** `lib/email.ts` **Linija 21:**

```typescript
// Promeni ovo:
const RECIPIENT_EMAILS = [TEST_EMAIL]

// U ovo:
const RECIPIENT_EMAILS = [PRODUCTION_EMAIL, TEST_EMAIL]
```

**Commit → Push → Done!** 🚀

---

**Puna dokumentacija:** `EMAIL_SETUP_GUIDE.md`
**Debug info:** `EMAIL_DEBUG_REPORT.md`

