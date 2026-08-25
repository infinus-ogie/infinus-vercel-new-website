> **reCAPTCHA is TEMPORARILY DISABLED.** `RECAPTCHA_ENFORCEMENT_ENABLED` in
> `lib/security/enforcement.ts` is `false` until the owner's post-vacation security pass, so
> the two reCAPTCHA variables below are **not required** on localhost, Preview or Production.
> Forms submit without them. See docs/FORMS-SECURITY.md.

# Environment Variables Template

Kopiraj ove linije u tvoj `.env.local` fajl:

```bash
# Google Analytics
NEXT_PUBLIC_GA_ID=G-S0YZ6MZWK1

# D&B Visitor Intelligence
NEXT_PUBLIC_ENABLE_DNB_VI=true
NEXT_PUBLIC_DNB_VI_SITE_ID=paapi1084
NEXT_PUBLIC_DNB_VI_DEBUG=true

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# ========================================
# EMAIL CONFIGURATION (REQUIRED!)
# ========================================
EMAIL_USER=ognjen.drinic31@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
```

## 📝 Kako dobiti Gmail App Password:

1. Idi na: https://myaccount.google.com/apppasswords
2. Kreiraj novi App Password za "Infinus Website"
3. Kopiraj 16-karakterni password
4. **ZAMENI** `xxxx xxxx xxxx xxxx` sa pravim password-om

## ⚠️ VAŽNO:

- **NE KORISTI** obični Gmail password!
- **KORISTI** Gmail App Password (16 karaktera)
- Razmaci u password-u su OK
- Vidi `EMAIL_SETUP_GUIDE.md` za detaljne instrukcije

## 🧪 Test:

```bash
npx tsx scripts/test-email.ts
```


## Forms security (reCAPTCHA v3)

Required for public form submissions. See `docs/FORMS-SECURITY.md`.

```
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your-v3-site-key
RECAPTCHA_SECRET_KEY=your-v3-secret-key
# Optional, 0–1, defaults to 0.5
RECAPTCHA_MIN_SCORE=0.5
```

`RECAPTCHA_SECRET_KEY` is server-only and must NOT use the `NEXT_PUBLIC_` prefix.

In a deployed environment (Production and Preview) a missing secret makes every public form
submission FAIL CLOSED. Set both keys on a Preview before doing form QA.
