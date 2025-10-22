# 🚀 Vercel Environment Variables Setup

## ⚡ Quick Setup (2 minuta)

### 1. Otvori Vercel Dashboard

**Link:** https://vercel.com

**Loguj se sa:** Infinus account (NE brivio!)

### 2. Otvori Projekat

**Projekat:** `infinus-vercel-new-website`  
**Team:** Infinus' projects

### 3. Idi na Settings

**Klikni:** Settings (u top menu)

**Klikni:** Environment Variables (u left sidebar)

### 4. Dodaj Prvu Varijablu

**Klikni:** "Add New" ili "Create"

**Popuni:**
```
Name: EMAIL_USER
Value: ognjen.drinic31@gmail.com
Environment: ✅ Production ✅ Preview ✅ Development
```

**Klikni:** "Save"

### 5. Dodaj Drugu Varijablu

**Klikni:** "Add New" ili "Create"

**Popuni:**
```
Name: GMAIL_APP_PASSWORD
Value: [tvoj 16-char app password iz .env.local]
Environment: ✅ Production ✅ Preview ✅ Development
```

**Klikni:** "Save"

### 6. Redeploy

**Idi na:** Deployments (u top menu)

**Pronađi:** Latest deployment

**Klikni:** "..." (tri tačke) → "Redeploy"

**Confirm:** "Redeploy"

---

## 📸 Screenshot Guide

### Step 1: Vercel Dashboard
```
https://vercel.com
→ Login (Infinus account)
→ infinus-vercel-new-website project
```

### Step 2: Settings
```
Project Dashboard
→ Settings (top menu)
→ Environment Variables (left sidebar)
```

### Step 3: Add Variables
```
Environment Variables page
→ "Add New" button
→ Fill form:
   Name: EMAIL_USER
   Value: ognjen.drinic31@gmail.com
   Environments: All checked
→ Save

→ "Add New" button again
→ Fill form:
   Name: GMAIL_APP_PASSWORD
   Value: [your app password]
   Environments: All checked
→ Save
```

### Step 4: Redeploy
```
Deployments page
→ Latest deployment
→ "..." menu
→ "Redeploy"
→ Confirm
```

---

## 🔍 Kako Pronaći App Password

**Ako ne znaš App Password:**

1. **Otvori:** `.env.local` fajl u projektu
2. **Pronađi liniju:** `GMAIL_APP_PASSWORD=...`
3. **Kopiraj:** vrednost posle `=` (bez razmaka)

**Primer:**
```bash
# U .env.local:
GMAIL_APP_PASSWORD=abcd efgh ijkl mnop

# U Vercel dodaj:
Value: abcd efgh ijkl mnop
```

---

## ✅ Verification

**Kada završiš:**

1. **Proveri da su varijable dodane:**
   - Settings → Environment Variables
   - Trebalo bi da vidiš:
     - ✅ EMAIL_USER
     - ✅ GMAIL_APP_PASSWORD

2. **Proveri deployment:**
   - Deployments → Latest
   - Status: "Ready" ili "Completed"

3. **Test production:**
   - Otvori production URL
   - Testiraj Join Us formu
   - Proveri inbox: ognjen.drinic31@gmail.com

---

## 🆘 Troubleshooting

### "Environment Variables" se ne vidi

**Rešenje:**
- Proveri da si u Settings sekciji
- Proveri da si na pravom projektu
- Refresh stranicu

### "Add New" dugme ne radi

**Rešenje:**
- Proveri da si logovan sa Infinus account-om
- Proveri da imaš admin pristup projektu
- Pokušaj u incognito/private browser

### Deployment ne radi

**Rešenje:**
- Proveri da su obe varijable dodane
- Proveri da su sve environment-ovi checked
- Pokušaj manual redeploy

### Email ne radi na production

**Rešenje:**
- Proveri da su varijable dodane u Vercel
- Proveri da je deployment završen
- Proveri da je App Password tačan
- Proveri server logs u Vercel Functions

---

## 📞 Pomoć

**Ako nešto ne radi:**

1. **Proveri da si logovan sa Infinus account-om**
2. **Proveri da si na pravom projektu**
3. **Proveri da imaš admin pristup**
4. **Refresh stranicu i pokušaj ponovo**

**Vercel Support:**
- https://vercel.com/help
- ili contact Vercel support

---

## ⏱️ Vreme

**Procenjeno vreme:** 2-3 minuta

**Koraci:**
- Login: 30 sec
- Navigate: 30 sec
- Add variables: 1 min
- Redeploy: 1 min
- Test: 30 sec

---

**Status:** ⏳ Čeka da korisnik doda environment variables

**Next:** Test production email system

