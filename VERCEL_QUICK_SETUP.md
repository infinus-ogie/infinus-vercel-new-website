# ⚡ Vercel Environment Variables - Quick Setup

## 🎯 SAMO 2 MINUTA!

### 1️⃣ Otvori Vercel
```
https://vercel.com
→ Login (Infinus account)
→ infinus-vercel-new-website
```

### 2️⃣ Settings → Environment Variables
```
Settings (top menu)
→ Environment Variables (left sidebar)
```

### 3️⃣ Dodaj 2 Varijable

**Varijabla 1:**
```
Name: EMAIL_USER
Value: ognjen.drinic31@gmail.com
Environments: ✅ All
```

**Varijabla 2:**
```
Name: GMAIL_APP_PASSWORD
Value: [tvoj app password iz .env.local]
Environments: ✅ All
```

### 4️⃣ Redeploy
```
Deployments → Latest → "..." → Redeploy
```

---

## 🔑 Gde je App Password?

**Otvori:** `.env.local` fajl

**Pronađi:**
```bash
GMAIL_APP_PASSWORD=abcd efgh ijkl mnop
```

**Kopiraj:** `abcd efgh ijkl mnop` (bez `GMAIL_APP_PASSWORD=`)

---

## ✅ Test

**Kada završiš:**
1. Otvori production URL
2. Testiraj Join Us formu
3. Proveri inbox: ognjen.drinic31@gmail.com

---

**GOTOVO!** 🎉

**Detaljne instrukcije:** `VERCEL_ENV_SETUP.md`
