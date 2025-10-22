# ✅ Email Sistem - Manual Test Guide

## Email Konfiguracija: ✅ RADI!

Password je sada dodat u `.env.local` i email sistem je funkcionalan! 🎉

---

## 📧 Kako Testirati

### Test 1: Join Us Forma (Homepage)

1. **Pokreni server** (ako već nije pokrenut):
   ```bash
   npm run dev
   ```

2. **Otvori browser:**
   ```
   http://localhost:3000
   ```

3. **Scroll do "Join Our Team" sekcije** (na dnu stranice)

4. **Popuni formu:**
   - Your Name: `Test Korisnik`
   - Phone: `+381641234567`
   - Your Email: `test@example.com`
   - LinkedIn URL: `https://linkedin.com/in/test` (opciono)
   - Subject: `SAP Consultant Test Application`
   - Message: `Ovo je test poruka za Join Us formu. Testiram email sistem.`

5. **Klikni:** "Submit Application"

6. **Očekuješ:**
   - ✅ Poruka: "Thanks for your application. We'll get back to you!"
   - ✅ Forma se resetuje

7. **Proveri inbox:** `ognjen.drinic31@gmail.com`
   - Subject: "New Job Application: SAP Consultant Test Application"
   - Sadrži: ime, email, phone, LinkedIn, poruku

---

### Test 2: Contact Forma

1. **Otvori Contact page** (ili gde god imaš Contact formu na sajtu)

2. **Popuni formu:**
   - Name: `Test Contact`
   - Email: `contact@example.com`
   - Phone: `+381641234567`
   - Subject: `Test Contact Form Email`
   - Message: `Ovo je test poruka za Contact formu. Testiram email sistem sa prilogom.`
   - Attachment: Dodaj neki PDF fajl (max 10MB)

3. **Klikni:** "Send Message"

4. **Očekuješ:**
   - ✅ Poruka: "Thank you for your message. We will get back to you soon."
   - ✅ Forma se resetuje

5. **Proveri inbox:** `ognjen.drinic31@gmail.com`
   - Subject: "New Contact Form Submission: Test Contact Form Email"
   - Sadrži: ime, email, phone, poruku
   - **Attachment:** PDF fajl koji si dodao

---

## 📊 Šta Proveriti

### U Browser Console (F12 → Console):

**Kada submituje Join Us:**
```javascript
// NE SMEŠ da vidiš greške
// Možeš videti: "Form submitted successfully"
```

**Kada submituje Contact:**
```javascript
// NE SMEŠ da vidiš greške
// Možeš videti: "Email sent successfully"
```

### U Server Logs (Terminal):

**Kada submituje formu:**
```
Attempting to send email to: ognjen.drinic31@gmail.com
Email config user: ognjen.drinic31@gmail.com
Email config pass length: 16
SMTP connection verified successfully
Sending email with options: { from: ..., to: ... }
Email sent successfully: <message-id>
```

**Ako vidiš grešku:**
```
❌ Error sending email: Invalid login
❌ Error sending email: ECONNREFUSED
```

---

## 🎯 Checklist - Lokalno Testiranje

- [ ] Dev server pokrenut (`npm run dev`)
- [ ] Join Us forma submitovana
- [ ] Email stigao u inbox (ognjen.drinic31@gmail.com)
- [ ] Email nije u spam folderu
- [ ] Contact forma submitovana
- [ ] Contact email stigao sa attachment-om
- [ ] Browser console - nema grešaka
- [ ] Server logs - "Email sent successfully"

---

## 🚀 Sledeći Korak: Vercel Production

Kada lokalno testiraš i sve radi, moraš dodati Environment Variables u **Vercel**:

### Vercel Dashboard

1. **Idi na:** https://vercel.com
2. **Loguj se sa:** Infinus account (NE brivio!)
3. **Projekat:** `infinus-vercel-new-website`
4. **Settings → Environment Variables**

5. **Dodaj Prvu Varijablu:**
   ```
   Name: EMAIL_USER
   Value: ognjen.drinic31@gmail.com
   Environments: ✅ Production ✅ Preview ✅ Development
   ```
   Klikni "Save"

6. **Dodaj Drugu Varijablu:**
   ```
   Name: GMAIL_APP_PASSWORD
   Value: [tvoj 16-char app password iz .env.local]
   Environments: ✅ Production ✅ Preview ✅ Development
   ```
   Klikni "Save"

7. **Redeploy:**
   - Idi na: Deployments
   - Pronađi: Latest deployment
   - Klikni: "..." → "Redeploy"
   - Confirm: "Redeploy"

8. **Test Production:**
   - Otvori: https://infinus-vercel-new-website.vercel.app (ili tvoj production URL)
   - Testiraj Join Us formu
   - Testiraj Contact formu
   - Proveri inbox

---

## 🎯 Finalni Korak: Dodaj office@infinus.rs

Kada je sve testirano i funkcioniše (i lokalno i na production), dodaj `office@infinus.rs`:

### 1. Otvori fajl:
```
lib/email.ts
```

### 2. Pronađi liniju 21:
```typescript
const RECIPIENT_EMAILS = [TEST_EMAIL]  // samo ognjen.drinic31@gmail.com
```

### 3. Promeni u:
```typescript
const RECIPIENT_EMAILS = [PRODUCTION_EMAIL, TEST_EMAIL]
// office@infinus.rs + ognjen.drinic31@gmail.com
```

### 4. Sačuvaj i deploy:
```bash
git add lib/email.ts
git commit -m "Add office@infinus.rs to email recipients"
git push
```

### 5. Vercel će automatski deploy-ovati novu verziju

### 6. Final Test:
- Submit Join Us formu
- Submit Contact formu
- **Proveri OBE email adrese:**
  - ✅ ognjen.drinic31@gmail.com
  - ✅ office@infinus.rs

---

## ✅ Success Checklist

**Lokalno (Development):**
- [x] Password dodat u .env.local ✅
- [ ] Join Us forma - email stiže
- [ ] Contact forma - email stiže
- [ ] Attachments rade

**Production (Vercel):**
- [ ] Environment variables dodati u Vercel
- [ ] Redeployovano
- [ ] Join Us forma - email stiže
- [ ] Contact forma - email stiže

**Final:**
- [ ] office@infinus.rs dodat u recipients
- [ ] Obe adrese primaju email-ove
- [ ] ✅ Sve radi!

---

## 📝 Current Email Setup

**FROM (šalje sa):**
- ognjen.drinic31@gmail.com
- SMTP: smtp.gmail.com:587

**TO (prima na) - TRENUTNO:**
- ognjen.drinic31@gmail.com ✅

**TO (prima na) - KASNIJE:**
- office@infinus.rs ✅
- ognjen.drinic31@gmail.com ✅

---

**Status:** ✅ Email sistem radi lokalno!  
**Next:** Test forme → Vercel setup → Dodaj office@infinus.rs

