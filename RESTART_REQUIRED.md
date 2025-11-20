# ⚠️ RESTART REQUIRED

## Configuration Changes Applied

Your `next.config.ts` has been updated with new body size limits for Server Actions and API routes.

## Action Required

**You MUST restart your development server for these changes to take effect:**

```bash
# 1. Stop the current dev server
# Press Ctrl+C in your terminal

# 2. Restart the dev server
npm run dev
```

## What Changed

- **Server Actions Body Size Limit:** 2MB → 50MB
- **API Route Body Size Limit:** Added 50MB limit
- **Reason:** To support large image uploads (up to 15MB) with form data overhead

## Verification

After restarting, test the following:

1. ✅ Navigate to admin panel
2. ✅ Try uploading a product image
3. ✅ Verify no "Body exceeded 2mb limit" error appears

## Why Restart is Needed

Next.js configuration files (`next.config.ts`) are only read during server startup. Changes to these files require a full server restart to take effect.

---

**Status:** Configuration updated, restart pending  
**Priority:** High - Required for image uploads to work
