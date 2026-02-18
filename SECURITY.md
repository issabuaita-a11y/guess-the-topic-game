# Security

## API Key Protection

This project uses a secure backend proxy architecture to protect API keys from exposure in the browser.

### How It Works

1. **Development**: 
   - API keys stored in `.env.local` (git-ignored)
   - Backend server (`dev-server.mjs`) makes API calls
   - Frontend calls backend via proxy (`/api/*`)
   - Vite proxies requests from port 3000 → 3001

2. **Production (Vercel)**:
   - API keys stored as Vercel environment variables
   - Serverless functions in `/api` folder make API calls
   - Frontend calls `/api/*` endpoints
   - Keys never exposed to browser

### Why This Matters

**Without backend proxy** (insecure):
- API keys embedded in JavaScript bundle
- Anyone can open DevTools and extract keys
- Keys visible in network requests
- Malicious users can steal and abuse your keys

**With backend proxy** (secure):
- API keys only on server
- Browser only sends game data to `/api/*`
- Keys never leave backend
- Safe to push code to GitHub

### Files to NEVER Commit

❌ **NEVER** commit these files:
- `.env.local` (contains your actual keys)
- `.env` (if you create one)
- Any file with actual API keys

✅ **DO** commit:
- `.env.example` (template with placeholder values)
- `/api/*.ts` (serverless functions - no keys inside)
- `dev-server.mjs` (local dev server - no keys inside)
- `lib/ai.ts` (calls backend, no keys)

### Checking for Leaks

Before pushing to GitHub, verify:

```bash
# Check .env.local is ignored
git ls-files | grep env
# Should show only .env.example

# Check no keys in tracked files
git grep -i "AIza" || echo "✓ No Gemini keys"
git grep -i "sk-proj" || echo "✓ No OpenAI keys"

# Check .env.local never committed
git log --all --full-history -- .env.local
# Should be empty
```

### If You Accidentally Leaked a Key

**IMMEDIATE STEPS:**

1. **Revoke the compromised key**:
   - OpenAI: https://platform.openai.com/api-keys → Delete the key
   - Google Gemini: https://aistudio.google.com/apikey → Delete the key

2. **Generate new keys** from the same platforms

3. **Update everywhere**:
   - Update `.env.local` with new keys
   - Update Vercel environment variables
   - Never commit new keys

4. **Git history cleanup** (advanced):
   - If key was committed, it's in git history
   - Use `git-filter-repo` or BFG Repo-Cleaner to remove
   - Force push cleaned history
   - **Warning**: This rewrites history, coordinate with team

### GitHub Security Features

Enable these in your repository:

1. **Secret Scanning** (Settings → Security → Secret scanning):
   - Automatically detects committed secrets
   - Notifies you if keys are found

2. **Push Protection** (Settings → Security → Push protection):
   - Blocks pushes containing secrets
   - Prevents accidental leaks

3. **Dependabot Alerts**:
   - Notifies of vulnerable dependencies
   - Keeps your packages secure

### Best Practices

- ✅ Use `.env.local` for local development
- ✅ Use Vercel environment variables for production
- ✅ Provide `.env.example` template for team
- ✅ Add `.env*` (except `.env.example`) to `.gitignore`
- ✅ Never use `dangerouslyAllowBrowser: true`
- ✅ Always make API calls from backend/serverless functions
- ✅ Review code before committing
- ✅ Use GitHub's security features

### For Collaborators

If you're a new developer on this project:

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Ask project maintainer for API keys (never commit them)

3. Add your keys to `.env.local`

4. The file will be git-ignored automatically

5. Never commit actual keys!

### Production Deployment Checklist

Before deploying to Vercel:

- [ ] `.env.local` is in `.gitignore`
- [ ] No API keys in git history
- [ ] `.env.example` committed (without real keys)
- [ ] Vercel environment variables configured
- [ ] Test locally with `npm run dev`
- [ ] Verify API calls go through `/api/*` endpoints
- [ ] Check browser DevTools - no keys visible

---

**Remember**: A leaked key is a compromised key. Rotation is the only fix.
