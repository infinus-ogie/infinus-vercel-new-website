# Infinus Project - Account Usage Rules

## 🚨 CRITICAL: Always Use Infinus Accounts ONLY

### ⛔ FORBIDDEN ACCOUNTS - NEVER USE THESE:
- **ogie-sigma** - ABSOLUTELY FORBIDDEN - This is a separate work account that must NEVER be used for this project
- **brivio** - FORBIDDEN
- **sigma-content** - FORBIDDEN
- Any other account that is not `infinus-ogie`

### ✅ REQUIRED ACCOUNTS - ALWAYS USE THESE:

#### GitHub Account
- **Username:** `infinus-ogie`
- **Repository:** `infinus-ogie/infinus-vercel-new-website`
- **Email:** `office@infinus.rs`
- **NEVER use:** ogie-sigma, brivio, sigma-content, or any other account

#### Vercel Account
- **Team:** `Infinus' projects`
- **Project:** `infinus-vercel-new-website`
- **NEVER use:** ogie-sigma, brivio, or any other Vercel account

#### Email Account
- **Use:** Infinus email accounts only
- **NEVER use:** ogie-sigma, brivio, or any other email accounts

### Git Remote Configuration
```bash
git remote set-url origin https://[TOKEN]@github.com/infinus-ogie/infinus-vercel-new-website.git
```

### Verification Commands
```bash
# Check current remote
git remote -v

# Should show: infinus-ogie/infinus-vercel-new-website.git
```

## ⚠️ CRITICAL WARNING
- **FOR THIS PROJECT, ALWAYS USE `infinus-ogie` ACCOUNT - NO EXCEPTIONS**
- **If you see any commits or deployments from accounts other than `infinus-ogie`, STOP IMMEDIATELY and switch to the correct account.**
- **ESPECIALLY WATCH OUT FOR:** `ogie-sigma` - This is a separate work account that must NEVER be used for this project
- **Before any Git operations, ALWAYS verify:** `git config user.name` should show `infinus-ogie`
- **Before any GitHub CLI operations, ALWAYS verify:** `gh auth status` should show `infinus-ogie` account
- **If GitHub CLI is logged in as `ogie-sigma` or any other account, DO NOT proceed with Git operations - switch to `infinus-ogie` first**

## 🔒 MANDATORY RULE FOR THIS PROJECT
**ALWAYS use `infinus-ogie` account for:**
- Git commits and pushes
- GitHub CLI operations
- Vercel deployments
- Email communications
- Any other operations related to this project

**NEVER use any other account, especially `ogie-sigma` or `brivio`**