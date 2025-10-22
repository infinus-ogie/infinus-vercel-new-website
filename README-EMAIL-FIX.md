# 📧 Email System Fix - README

## 🚨 Problem

**Email forme ne rade** - Join Us i Contact Us forme ne šalju email-ove.

**Razlog:** Nedostaje Gmail App Password u environment varijablama.

---

## ⚡ Quick Fix (5 minuta)

**Čitaj:** [`EMAIL_QUICKSTART.md`](./EMAIL_QUICKSTART.md)

```bash
# 1. Kreiraj Gmail App Password
→ https://myaccount.google.com/apppasswords

# 2. Dodaj u .env.local
EMAIL_USER=ognjen.drinic31@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx

# 3. Restartuj server
npm run dev

# 4. Testiraj
npx tsx scripts/test-email.ts
```

✅ **Gotovo!**

---

## 📚 Dokumentacija

| Fajl | Kada Koristiti |
|------|----------------|
| **[EMAIL_QUICKSTART.md](./EMAIL_QUICKSTART.md)** | ⚡ Počni ovde! Brzo rešenje (5 min) |
| **[EMAIL_SETUP_GUIDE.md](./EMAIL_SETUP_GUIDE.md)** | 📚 Detaljne instrukcije sa screenshots |
| **[EMAIL_DEBUG_REPORT.md](./EMAIL_DEBUG_REPORT.md)** | 🔍 Tehnička dijagnostika problema |
| **[EMAIL_FIX_SUMMARY.md](./EMAIL_FIX_SUMMARY.md)** | 📊 Kompletan pregled i flow diagram |
| **[ENV_EXAMPLE.md](./ENV_EXAMPLE.md)** | 📝 Template za .env.local fajl |

---

## 🧪 Test Script

**Location:** `scripts/test-email.ts`

**Run:**
```bash
npx tsx scripts/test-email.ts
```

**Šta radi:**
- ✅ Proveri SMTP konfiguraciju
- ✅ Proveri environment varijable
- ✅ Testira konekciju sa Gmail SMTP
- ✅ Šalje test email
- ✅ Prikazuje rezultate

---

## 📧 Email Flow

### Join Us Forma (Homepage)

```
User fills form (Join Our Team)
    ↓
Frontend: components/ui/join-section.tsx
    ↓
POST /api/join-team
    ↓
Backend: app/api/join-team/route.ts
    ↓
Email: lib/email.ts → sendJoinTeamEmail()
    ↓
SMTP: smtp.gmail.com:587
    ↓
📧 Inbox: ognjen.drinic31@gmail.com
```

### Contact Forma

```
User fills form (Contact Us)
    ↓
Frontend: components/forms/contact-form.tsx
    ↓
POST /api/contact
    ↓
Backend: app/api/contact/route.ts
    ↓
Email: lib/email.ts → sendContactFormEmail()
    ↓
SMTP: smtp.gmail.com:587
    ↓
📧 Inbox: ognjen.drinic31@gmail.com (+ attachment)
```

---

## 🔧 Tehnički Detalji

### Email Konfiguracija (`lib/email.ts`)

**SMTP:**
- Host: `smtp.gmail.com`
- Port: `587`
- Security: STARTTLS

**Auth:**
- User: `process.env.EMAIL_USER` (default: ognjen.drinic31@gmail.com)
- Pass: `process.env.GMAIL_APP_PASSWORD` ⚠️ **REQUIRED!**

**Recipients (trenutno):**
```typescript
const RECIPIENT_EMAILS = [TEST_EMAIL]  // samo test email
```

**Recipients (kasnije):**
```typescript
const RECIPIENT_EMAILS = [PRODUCTION_EMAIL, TEST_EMAIL]
// office@infinus.rs + ognjen.drinic31@gmail.com
```

---

## 🎯 Roadmap

### ✅ Faza 1: Setup (Trenutno)
- [x] Dijagnostikovao problem
- [x] Kreirao test script
- [x] Napisao dokumentaciju
- [ ] **→ Korisnik kreira Gmail App Password**
- [ ] **→ Korisnik dodaje u .env.local**
- [ ] **→ Test lokalno**

### 🔄 Faza 2: Testing
- [ ] Join Us forma radi lokalno
- [ ] Contact forma radi lokalno
- [ ] Email-ovi stižu u inbox
- [ ] Attachments rade

### 🚀 Faza 3: Production
- [ ] Dodaj environment variables u Vercel
- [ ] Redeploy na Vercel
- [ ] Test production email

### 🎉 Faza 4: Final
- [ ] Dodaj office@infinus.rs u recipients
- [ ] Test sa obe email adrese
- [ ] Sve radi! ✅

---

## 🆘 Troubleshooting

### Email ne stigne

**Proveri:**
1. Da li si kreirao **App Password** (ne obični Gmail password)?
2. Da li si dodao u `.env.local`?
3. Da li si restartovao dev server?
4. Da li email pada u **Spam** folder?

**Debug:**
```bash
# Test email sistem
npx tsx scripts/test-email.ts

# Proveri server logs
npm run dev
# Submit formu → proveri terminal output

# Proveri browser console
# F12 → Console → Submit formu → proveri greške
```

### "Invalid login" greška

**Problem:** App Password nije validan ili ne postoji

**Rešenje:**
1. Kreiraj novi App Password: https://myaccount.google.com/apppasswords
2. Kopiraj tačno onako kako je
3. Dodaj u .env.local (razmaci su OK)
4. Restartuj server

### "ECONNREFUSED" greška

**Problem:** Ne može se konektovati na SMTP server

**Rešenje:**
1. Proveri internet konekciju
2. Proveri da li firewall blokira port 587
3. Proveri da li antivirus blokira SMTP

### Test script kaže "Password not found"

**Problem:** Environment varijabla nije učitana

**Rešenje:**
1. Proveri da li `.env.local` postoji u root-u projekta
2. Proveri da li ima liniju: `GMAIL_APP_PASSWORD=...`
3. Restartuj dev server
4. Pokreni ponovo test script

---

## 📝 Environment Variables

**Lokalno (`.env.local`):**
```bash
EMAIL_USER=ognjen.drinic31@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
```

**Vercel (Production):**
```
Settings → Environment Variables

EMAIL_USER = ognjen.drinic31@gmail.com
GMAIL_APP_PASSWORD = [app password]

Environments: ✅ Production ✅ Preview ✅ Development
```

**Template:** Vidi `ENV_EXAMPLE.md`

---

## 🔒 Sigurnost

**Q: Da li je bezbedno čuvati App Password u .env.local?**  
**A:** Da! `.env.local` je u `.gitignore` i neće biti commit-ovan na Git.

**Q: Šta ako neko dobije pristup mom App Password-u?**  
**A:** Možeš ga revoke-ovati u Google Account Settings i kreirati novi.

**Q: Da li treba da commitujem .env.local?**  
**A:** **NE!** Nikada ne commit-uj `.env.local` ili bilo koji fajl sa lozinkama!

---

## 📞 Kontakt Email Adrese

**Test Email (trenutno):**
- ognjen.drinic31@gmail.com ✅

**Production Email (kasnije):**
- office@infinus.rs + ognjen.drinic31@gmail.com ✅

---

## ✅ Final Checklist

**Before Production:**
- [ ] Gmail App Password kreiran
- [ ] Dodato u `.env.local`
- [ ] Test script prošao
- [ ] Join Us forma radi
- [ ] Contact forma radi
- [ ] Email stižu u inbox
- [ ] Environment variables u Vercel-u
- [ ] Production deployment testiran
- [ ] `office@infinus.rs` dodat u recipients
- [ ] Final test sa obe adrese
- [ ] Dokumentacija ažurirana ✅

---

## 🎯 Start Here

**→ [`EMAIL_QUICKSTART.md`](./EMAIL_QUICKSTART.md)** ⚡

Sve ostalo je opciono ako Quick Start ne radi! 😊

---

**Created:** October 22, 2025  
**Status:** ⏳ Awaiting Gmail App Password setup  
**Next Step:** User creates App Password → Test → Done!

