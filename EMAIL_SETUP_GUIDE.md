# 📧 Email Setup Guide - Infinus Website

## Problem
Email forme (Join Us i Contact Us) ne šalju email-ove jer nedostaje **Gmail App Password** u konfiguraciji.

---

## ✅ Rešenje (Koraci)

### Korak 1: Kreiraj Gmail App Password

1. **Loguj se** na Google Account: `ognjen.drinic31@gmail.com`

2. **Omogući 2-Step Verification** (ako već nije):
   - Idi na: https://myaccount.google.com/security
   - Klikni na "2-Step Verification"
   - Prati instrukcije da omogućiš

3. **Kreiraj App Password**:
   - Idi na: https://myaccount.google.com/apppasswords
   - Ili: Google Account → Security → 2-Step Verification → App passwords
   - Klikni "Generate" ili "Create"
   - **App name:** `Infinus Website`
   - **Tip:** `Mail`
   
4. **Kopiraj generisani password**:
   - Biće 16 karaktera u formatu: `xxxx xxxx xxxx xxxx`
   - **SAČUVAJ OVO!** Nećeš moći ponovo da vidiš ovaj password

---

### Korak 2: Dodaj u `.env.local`

Otvori fajl `.env.local` u root-u projekta i dodaj ove linije:

```bash
# Email Configuration
EMAIL_USER=ognjen.drinic31@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
```

**ZAMENI** `xxxx xxxx xxxx xxxx` sa pravim App Password-om koji si dobio u Koraku 1.

**Primer:**
```bash
# Email Configuration  
EMAIL_USER=ognjen.drinic31@gmail.com
GMAIL_APP_PASSWORD=abcd efgh ijkl mnop
```

> **NAPOMENA:** Razmaci u App Password-u su OK! Kod automatski uklanja razmake.

---

### Korak 3: Restartuj Dev Server

**Zaustavi trenutni server** (Ctrl+C u terminalu) i ponovo pokreni:

```bash
npm run dev
```

---

### Korak 4: Testiraj Email Sistem

#### Option A: Test Script (Brži način) ⚡

U terminalu pokreni:

```bash
npx tsx scripts/test-email.ts
```

**Šta će se desiti:**
- ✅ Proveriće SMTP konfiguraciju
- ✅ Pokušaće da pošalje test email
- ✅ Prikaže rezultate u terminalu

**Očekivani output:**
```
🧪 Email Configuration Test

📋 Configuration:
   Host: smtp.gmail.com
   Port: 587
   User: ognjen.drinic31@gmail.com
   Password: ✓ Found (16 chars)

🔌 Testing SMTP connection...
✅ SMTP connection successful!

📧 Sending test email...
✅ Test email sent successfully!
   Message ID: <...>

📬 Check inbox: ognjen.drinic31@gmail.com

🎉 Email configuration is working correctly!
```

**Ako vidiš grešku:**
- Proveri da li si dobro kopirao App Password
- Proveri da li ima razmaka ili novih linija u .env.local
- Proveri da li si restartovao server

#### Option B: Test Preko Web Forme 🌐

1. **Otvori sajt**: http://localhost:3000

2. **Testiraj Join Us formu:**
   - Scroll do "Join Our Team" sekcije
   - Popuni formu sa test podacima
   - Klikni "Submit Application"
   - Proveri inbox `ognjen.drinic31@gmail.com`

3. **Testiraj Contact formu:**
   - Idi na: http://localhost:3000/contact (ili gde god je Contact forma)
   - Popuni formu
   - Opciono: dodaj attachment
   - Klikni "Send Message"
   - Proveri inbox `ognjen.drinic31@gmail.com`

---

### Korak 5: Proveri Email Inbox

**Otvori** `ognjen.drinic31@gmail.com` inbox i proveri:

✅ **Test Email** (ako si koristio test script):
- Subject: "✅ Infinus Website Email Test - Success!"

✅ **Join Team Email** (ako si testirao Join Us formu):
- Subject: "New Job Application: [tvoj subject]"
- Sadrži: ime, email, phone, LinkedIn, poruka, UTM tracking

✅ **Contact Email** (ako si testirao Contact formu):
- Subject: "New Contact Form Submission: [tvoj subject]"
- Sadrži: ime, email, phone, company, poruka
- Attachment (ako si dodao)

---

## 🔧 Troubleshooting

### Problem: "Invalid login" greška

**Rešenje:**
- Proveri da li si kreirao **App Password** (ne obični Gmail password!)
- Proveri da li si ga tačno kopirao u `.env.local`
- Proveri da li si omogućio 2-Step Verification

### Problem: "ECONNREFUSED" greška

**Rešenje:**
- Proveri internet konekciju
- Proveri da li firewall blokira port 587
- Proveri da li antivirus blokira SMTP

### Problem: Email se ne prima

**Rešenje:**
- Proveri **Spam** folder u Gmail-u
- Proveri server logs u terminalu (npm run dev)
- Pokreni test script: `npx tsx scripts/test-email.ts`

### Problem: "Password not found" u test script-u

**Rešenje:**
- Dodaj `GMAIL_APP_PASSWORD` u `.env.local`
- Restartuj dev server
- Pokreni ponovo test script

---

## 📝 Vercel Production Setup

Kada testiraš lokalno i sve radi, moraš dodati Environment Variables i na **Vercel**:

1. **Idi na Vercel Dashboard**:
   - Projekat: `infinus-vercel-new-website`
   - Settings → Environment Variables

2. **Dodaj:**
   - Name: `EMAIL_USER`
   - Value: `ognjen.drinic31@gmail.com`
   - Environment: Production, Preview, Development ✅

3. **Dodaj:**
   - Name: `GMAIL_APP_PASSWORD`
   - Value: `[tvoj app password]`
   - Environment: Production, Preview, Development ✅

4. **Redeploy**:
   - Deployments → Latest Deployment → Redeploy

---

## 🎯 Finalni Korak: Dodaj office@infinus.rs

Kada sve funkcioniše i budeš siguran, otvori:

**Fajl:** `lib/email.ts`

**Trenutno (linija 21):**
```typescript
const RECIPIENT_EMAILS = [TEST_EMAIL]  // samo ognjen.drinic31@gmail.com
```

**Promeni u:**
```typescript
const RECIPIENT_EMAILS = [PRODUCTION_EMAIL, TEST_EMAIL]  // office@infinus.rs + ognjen.drinic31@gmail.com
```

Sačuvaj, commit, push, i svi email-ovi će stizati na **obe** adrese! 🎉

---

## 📊 Checklist

- [ ] Kreirao Gmail App Password
- [ ] Dodao `GMAIL_APP_PASSWORD` u `.env.local`
- [ ] Restartovao dev server
- [ ] Test script prošao (`npx tsx scripts/test-email.ts`)
- [ ] Join Us forma radi (homepage)
- [ ] Contact forma radi
- [ ] Email-ovi stižu u inbox (ne u spam)
- [ ] Dodao Environment Variables u Vercel
- [ ] Redeployovao na Vercel
- [ ] Production email radi
- [ ] Dodao `office@infinus.rs` u recipients
- [ ] Final test sa obe adrese

---

## 🆘 Pomoć

Ako nešto ne radi, proveri:
1. `EMAIL_DEBUG_REPORT.md` - detaljne informacije o problemu
2. Server logs u terminalu
3. Browser console (F12) za greške na frontendu
4. Test script output: `npx tsx scripts/test-email.ts`

---

**Status:** ⏳ Čeka Gmail App Password setup

**Next:** Kreiraj App Password → Dodaj u .env.local → Test!

