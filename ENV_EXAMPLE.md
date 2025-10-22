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

