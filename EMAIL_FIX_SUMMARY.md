# 📧 Email System - Fix Summary

**Status:** ❌ NE RADI  
**Razlog:** Nedostaje Gmail App Password u konfiguraciji  
**Vreme popravke:** ~5 minuta  

---

## 🔍 Dijagnostika

### Trenutna Konfiguracija

**Email Forme na Sajtu:**
- ✅ Join Us forma (Homepage) → `/api/join-team`
- ✅ Contact Us forma → `/api/contact`

**Email Sistem (`lib/email.ts`):**
- ✅ SMTP: Gmail (smtp.gmail.com:587)
- ✅ FROM: ognjen.drinic31@gmail.com
- ✅ TO: ognjen.drinic31@gmail.com (trenutno)
- ❌ GMAIL_APP_PASSWORD: **NEDOSTAJE!**

**Environment Variables (`.env.local`):**
```bash
✅ NEXT_PUBLIC_GA_ID
✅ NEXT_PUBLIC_DNB_VI_SITE_ID
✅ NEXT_PUBLIC_SITE_URL
❌ EMAIL_USER - NEDOSTAJE!
❌ GMAIL_APP_PASSWORD - NEDOSTAJE!
```

---

## 🔧 Popravka

### Quick Fix (5 minuta)

**Pročitaj:** `EMAIL_QUICKSTART.md` - najbrže rešenje!

**Detaljna verzija:** `EMAIL_SETUP_GUIDE.md` - kompletne instrukcije

### Koraci:

1. **Kreiraj Gmail App Password:**
   - https://myaccount.google.com/apppasswords
   - Create → "Infinus Website" → Copy password

2. **Dodaj u `.env.local`:**
   ```bash
   EMAIL_USER=ognjen.drinic31@gmail.com
   GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
   ```

3. **Restartuj Server:**
   ```bash
   npm run dev
   ```

4. **Test:**
   ```bash
   npx tsx scripts/test-email.ts
   ```

---

## 📁 Fajlovi Kreirani

| Fajl | Svrha |
|------|-------|
| `EMAIL_QUICKSTART.md` | ⚡ Brzo rešenje (5 min) |
| `EMAIL_SETUP_GUIDE.md` | 📚 Detaljne instrukcije |
| `EMAIL_DEBUG_REPORT.md` | 🔍 Tehnički detalji problema |
| `ENV_EXAMPLE.md` | 📝 Template za .env.local |
| `scripts/test-email.ts` | 🧪 Test script za email |
| `EMAIL_FIX_SUMMARY.md` | 📄 Ovaj fajl (pregled) |

---

## 🧪 Testiranje

### Automated Test
```bash
npx tsx scripts/test-email.ts
```

**Očekivani rezultat:**
```
✅ SMTP connection successful!
✅ Test email sent successfully!
📬 Check inbox: ognjen.drinic31@gmail.com
```

### Manual Test

**Join Us Forma:**
1. http://localhost:3000
2. Scroll → "Join Our Team"
3. Popuni → Submit
4. Check inbox

**Contact Forma:**
1. Otvori Contact page
2. Popuni formu
3. (Opciono) dodaj attachment
4. Send Message
5. Check inbox

---

## 🚀 Production Deployment (Vercel)

**Kada lokalno radi**, dodaj environment variables u Vercel:

### Vercel Dashboard
```
Project: infinus-vercel-new-website
Settings → Environment Variables

EMAIL_USER = ognjen.drinic31@gmail.com
GMAIL_APP_PASSWORD = [app password]

Environments: ✅ Production ✅ Preview ✅ Development
```

**Redeploy** → Done!

---

## 📊 Flow Diagram

```
Homepage (Join Us forma)
    ↓
/api/join-team/route.ts
    ↓
lib/email.ts → sendJoinTeamEmail()
    ↓
Gmail SMTP (ognjen.drinic31@gmail.com)
    ↓
📧 Email → ognjen.drinic31@gmail.com
```

```
Contact Page
    ↓
/api/contact/route.ts
    ↓
lib/email.ts → sendContactFormEmail()
    ↓
Gmail SMTP (ognjen.drinic31@gmail.com)
    ↓
📧 Email (+ attachment) → ognjen.drinic31@gmail.com
```

---

## 🎯 Next Steps (Nakon što radi)

### 1. Dodaj office@infinus.rs kao Recipient

**Fajl:** `lib/email.ts`  
**Linija:** 21

```typescript
// Trenutno (samo test email)
const RECIPIENT_EMAILS = [TEST_EMAIL]

// Promeni u (obe adrese)
const RECIPIENT_EMAILS = [PRODUCTION_EMAIL, TEST_EMAIL]
```

**Rezultat:** Email-ovi će stizati na:
- ✅ office@infinus.rs
- ✅ ognjen.drinic31@gmail.com

### 2. Test sa Obe Adrese

**Test checklist:**
- [ ] Join Us forma → obe adrese primaju email
- [ ] Contact forma → obe adrese primaju email
- [ ] Attachment radi (Contact forma)
- [ ] Email ne pada u spam
- [ ] Production (Vercel) radi

### 3. Finalna Provera

- [ ] Lokalni dev server - radi ✅
- [ ] Vercel preview - radi ✅
- [ ] Vercel production - radi ✅
- [ ] Obe email adrese primaju poruke ✅
- [ ] Attachments rade ✅

---

## ❓ FAQ

**Q: Zašto ne mogu da koristim obični Gmail password?**  
A: Google zahteva App Password za SMTP autentifikaciju zbog bezbednosti.

**Q: Hoće li moj obični Gmail password prestati da radi?**  
A: Ne, App Password je dodatni password samo za aplikacije.

**Q: Mogu li da kreiram više App Passwords?**  
A: Da, možeš imati različite za različite aplikacije.

**Q: Šta ako izgubim App Password?**  
A: Jednostavno kreiraj novi i zameni u .env.local i Vercel-u.

**Q: Da li je bezbedno čuvati App Password u .env.local?**  
A: Da, .env.local je u .gitignore i neće biti commit-ovan.

**Q: Šta ako email padne u spam?**  
A: To je normalno za prve par email-ova. Označi kao "Not Spam".

**Q: Kako da testiram attachments?**  
A: Koristi Contact formu i dodaj PDF/DOC fajl (max 10MB).

---

## 🆘 Pomoć

**Ako nešto ne radi:**

1. **Prvo:** Pročitaj `EMAIL_QUICKSTART.md`
2. **Ako ne radi:** Pročitaj `EMAIL_SETUP_GUIDE.md`
3. **Još ne radi?** Pročitaj `EMAIL_DEBUG_REPORT.md`
4. **Još uvek ne radi?** Pokreni: `npx tsx scripts/test-email.ts`
5. **Error u test script-u?** Proveri:
   - Da li si kreirao **App Password** (ne obični password)
   - Da li si ga tačno kopirao u .env.local
   - Da li si restartovao dev server
   - Da li imaš internet konekciju

---

## ✅ Checklist

**Setup:**
- [ ] Kreiran Gmail App Password
- [ ] Dodat u `.env.local`
- [ ] Restartovan dev server
- [ ] Test script prošao

**Testing:**
- [ ] Join Us forma radi (lokalno)
- [ ] Contact forma radi (lokalno)
- [ ] Email-ovi stižu u inbox

**Production:**
- [ ] Environment variables u Vercel-u
- [ ] Redeployovan Vercel
- [ ] Production email radi

**Final:**
- [ ] Dodat office@infinus.rs u recipients
- [ ] Obe adrese primaju email-ove
- [ ] Sve radi! 🎉

---

**START HERE:** `EMAIL_QUICKSTART.md` ⚡

**NEED HELP:** `EMAIL_SETUP_GUIDE.md` 📚

**Technical Details:** `EMAIL_DEBUG_REPORT.md` 🔍

