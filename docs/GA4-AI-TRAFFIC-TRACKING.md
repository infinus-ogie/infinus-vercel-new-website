# GA4 - Praćenje AI Pretraživača

## 📊 Kako videti AI traffic u Google Analytics 4

### ⚠️ Važno znati

**AI pretraživači (ChatGPT, Perplexity, Gemini) obično NE šalju direktan traffic!**

Zašto?
- AI prikazuje odgovor u svojoj aplikaciji
- Korisnik vidi informacije, ali ne mora da klikne na link
- Ako klikne, može biti bez referrer-a ili sa "direct" source

**Ali:** Možeš pratiti:
1. **Direktan traffic** - korisnik vidi AI odgovor, pa ručno otvori sajt
2. **AI referrer** - retko, ali ponekad AI šalje referrer
3. **Custom events** - naša komponenta detektuje AI referrere

---

## 🚀 Korak 1: Podešavanje Custom Dimension u GA4

### 1.1. Kreiraj Custom Dimension

1. Otvori **GA4 Dashboard** → https://analytics.google.com
2. Idi na: **Admin** (⚙️) → **Custom Definitions** → **Custom Dimensions**
3. Klikni **"Create custom dimension"**
4. Popuni:
   - **Dimension name:** `AI Source`
   - **Scope:** `Event`
   - **Event parameter:** `ai_source`
   - **Description:** `Source of AI traffic (ChatGPT, Perplexity, etc.)`
5. Klikni **Save**

### 1.2. Kreiraj još jedan Custom Dimension

1. **Dimension name:** `AI Domain`
2. **Scope:** `Event`
3. **Event parameter:** `ai_domain`
4. **Description:** `Domain of AI search engine`

---

## 📈 Korak 2: Pregled AI Traffic-a

### 2.1. Pregled Custom Event-a

1. Idi na: **Reports** → **Engagement** → **Events**
2. Pronađi event: **`ai_traffic`**
3. Klikni na event da vidiš detalje
4. Vidiš:
   - Koliko puta se desio
   - Koji AI source (ChatGPT, Perplexity, itd.)
   - Koje stranice su posete

### 2.2. Kreiranje Custom Report-a

1. Idi na: **Explore** → **Blank**
2. Dodaj:
   - **Dimensions:** `Event name`, `AI Source` (custom dimension)
   - **Metrics:** `Event count`, `Users`
3. Filter: `Event name = ai_traffic`
4. Sačuvaj report kao **"AI Traffic Report"**

---

## 🔍 Korak 3: Analiza "Direct" Traffic-a

**Većina AI traffic-a će biti "Direct" ili "Unknown"!**

### 3.1. Pregled Direct Traffic-a

1. Idi na: **Reports** → **Acquisition** → **Traffic acquisition**
2. Filtriraj po **Source:** `(direct)`
3. Analiziraj:
   - Da li je porast direct traffic-a?
   - Koje stranice su najposjećenije?
   - Da li se poklapa sa vremenom kada si optimizovao `llms.txt`?

### 3.2. Pregled User-Agent Stringova

1. Idi na: **Admin** → **Data Streams** → Klikni na stream
2. Idi na: **Enhanced measurement** → **Page views**
3. Proveri **User-Agent** stringove (ako su dostupni)
4. Traži:
   - `GPTBot`
   - `PerplexityBot`
   - `Google-Extended`
   - `anthropic-ai`

---

## 📊 Korak 4: Kreiranje Dashboard-a

### 4.1. Custom Dashboard za AI Traffic

1. Idi na: **Explore** → **Free form**
2. Konfiguriši:

**Tab 1: AI Traffic Overview**
- **Dimensions:** `AI Source`, `Page path`
- **Metrics:** `Event count`, `Users`, `Sessions`
- **Filter:** `Event name = ai_traffic`

**Tab 2: Direct Traffic Analysis**
- **Dimensions:** `Source`, `Page path`
- **Metrics:** `Sessions`, `Users`, `Bounce rate`
- **Filter:** `Source = (direct)`

**Tab 3: Time Series**
- **Dimensions:** `Date`
- **Metrics:** `Event count` (ai_traffic)
- **Visualization:** Line chart

3. Sačuvaj kao **"AI Traffic Dashboard"**

---

## 🎯 Korak 5: Praćenje Indirektnog Uticaja

**AI pretraživači često ne šalju direktan traffic, ali utiču na:**

### 5.1. Brand Searches

1. Idi na: **Reports** → **Acquisition** → **User acquisition**
2. Filtriraj po **Source:** `google` ili `bing`
3. Proveri **Search terms** koji sadrže:
   - "Infinus"
   - "ProjectPulse"
   - "SAP Gold Partner Serbia"

### 5.2. Direct Traffic Trends

1. Idi na: **Reports** → **Acquisition** → **Traffic acquisition**
2. Poredaj po **Sessions** (descending)
3. Proveri trend **Direct** traffic-a:
   - Da li raste nakon optimizacije `llms.txt`?
   - Da li se poklapa sa AI optimizacijom?

---

## 📝 Korak 6: UTM Parametri za AI Linkove

**Za buduće kampanje, dodaj UTM parametre:**

```
https://www.infinus.co/projectpulse?utm_source=chatgpt&utm_medium=ai&utm_campaign=projectpulse
```

Onda u GA4:
1. Idi na: **Reports** → **Acquisition** → **Traffic acquisition**
2. Filtriraj: `utm_source = chatgpt` ili `utm_medium = ai`

---

## 🔧 Tehnički Detalji

### Kako radi AITrafficTracker komponenta?

1. **Detektuje referrer** - proverava `document.referrer` za AI domene
2. **Šalje custom event** - `ai_traffic` event sa parametrima:
   - `ai_source`: ChatGPT, Perplexity, itd.
   - `ai_domain`: chat.openai.com, www.perplexity.ai, itd.
   - `referrer`: pun referrer URL
3. **Postavlja custom dimension** - za sve AI traffic

### AI Domene koje pratimo:

- `chat.openai.com` → ChatGPT
- `www.perplexity.ai` → Perplexity
- `gemini.google.com` → Google Gemini
- `claude.ai` → Claude
- `copilot.microsoft.com` → Microsoft Copilot
- `www.bing.com` → Bing Chat

---

## ✅ Checklist

- [ ] Kreiran Custom Dimension "AI Source" u GA4
- [ ] Kreiran Custom Dimension "AI Domain" u GA4
- [ ] Proveren event "ai_traffic" u Reports → Events
- [ ] Kreiran Custom Report za AI Traffic
- [ ] Analiziran Direct Traffic trend
- [ ] Kreiran Dashboard za AI Traffic
- [ ] Proveren Brand Search traffic
- [ ] Postavljen UTM tracking za buduće kampanje

---

## 📞 Podrška

Ako imaš pitanja:
- GA4 dokumentacija: https://support.google.com/analytics/answer/10089681
- Custom Dimensions: https://support.google.com/analytics/answer/10075209

---

**Napomena:** Većina AI traffic-a će biti "Direct" jer AI pretraživači ne šalju referrer. Fokusiraj se na **trendove** i **porast direct traffic-a** nakon optimizacije `llms.txt` i `robots.txt`.

