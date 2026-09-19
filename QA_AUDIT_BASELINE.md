# SEMIX LABS QA Audit Baseline

Date: 2026-09-19
Scope: Read-only baseline before new fixes

## Critical

None confirmed during static inspection.

## High

None confirmed during static inspection.

## Medium

### MEDIUM - Repository typecheck fails in admin user creation service
- Page/component: Build/typecheck
- Location: `src/services/adminUserService.ts:139`
- Problem: `ReturnType<typeof secondaryAuth.currentUser>` is used even though `currentUser` is a value, not a function.
- Reproduction: Run `npm run lint`.
- Cause: Incorrect TypeScript utility type.
- Recommended fix: Use the Firebase user type or infer the variable from the assigned credential without changing authentication behavior.

### MEDIUM - Admin directory data loading needs runtime verification
- Page/component: Admin dashboard and user directory
- Locations: `src/context/AuthContext.tsx`, `src/components/admin/AdminUserManagementTab.tsx`
- Problem: Firestore user-directory loading is gated by Firebase auth restoration and merged asynchronously.
- Reproduction: Sign in as admin, open the user directory without refreshing, and compare counts with Firestore.
- Cause: Runtime ordering and merge behavior need verification.
- Recommended fix: Only if runtime reproduces stale counts, make the smallest loading/merge correction and preserve UID/role authority.

### MEDIUM - Secondary Firebase Auth type/runtime cleanup may affect admin-created users
- Page/component: Admin user management
- Location: `src/services/adminUserService.ts`
- Problem: The typecheck failure is in the secondary-auth cleanup path used to create managed users.
- Reproduction: Run `npm run lint`; then create a team member if the environment permits.
- Cause: Invalid type expression around `secondaryAuth.currentUser`.
- Recommended fix: Correct the type without changing the secondary Firebase app/session design.

## Low

### LOW - Duplicate `.env` ignore rules
- Page/component: Repository configuration
- Location: `.gitignore`
- Problem: `.env` and `.env.*` patterns are repeated.
- Recommended fix: Consolidate only if configuration cleanup is included in the final fix set.

### LOW - Large initial JavaScript bundle
- Page/component: Production build
- Location: Vite output
- Problem: Build reports the main JS chunk above 500 kB after minification.
- Recommended fix: Measure route-level impact first, then introduce targeted lazy loading rather than a broad refactor.

## Improvement

- Run responsive browser checks at 320, 360, 375, 390, 430, 768, 1024, 1280, 1440, and 1920 px.
- Validate navigation, search, cart, checkout, authentication, protected routes, admin directory, seller/team pages, modals, empty states, images, console errors, network failures, and accessibility affordances.
- Validate actual Firestore listener cleanup and request behavior with the local app and browser network logs.

## Baseline Commands

- `npm run lint`: failed with the `adminUserService.ts:139` type error above.
- `npm run build`: last known run passed before this audit.
- `npm test`: not available in `package.json`.
- Browser/runtime audit: pending local server and browser capability.

## Worktree Context

Existing modified files were present before this audit and are not treated as audit changes. They include Razorpay integration, mobile navigation, seller dashboard layout, and toast UI changes.

## Final Audit Results

### Tests Performed

- Local app opened at `http://localhost:3000`.
- Responsive overflow checks at 320, 375, 430, 768, 1024, and 1280 px; additional home rendering was checked at the requested viewport family.
- Home, shop, categories, services, bulk enquiry, contact, cart empty state, checkout route, product detail, protected admin/team/seller routes, and navigation links.
- Search interaction and no-match state.
- Product detail navigation and add-to-cart interaction.
- Admin login, immediate admin dashboard access, user-directory opening without refresh, Firestore user records, role labels, and logout.
- Unauthenticated console/network capture after listener fixes.
- Firestore rules inspection.
- `npm run lint`, `npm run build`.

### Bugs Fixed

- Tablet header horizontal overflow at 768/1024 px caused by desktop search, labels, and role controls activating too early. Full desktop treatment now begins at `xl`; compact search/actions remain through tablet widths.
- Logout restoration race where Firebase auth state could restore the user immediately after `setUser(null)`. Added a sign-out guard.
- Unauthenticated orders and seller-bonus Firestore listeners caused permission warnings. Both now attach only after Firebase authentication and clean up on auth changes.
- Existing TypeScript error in `adminUserService.ts` caused by applying `ReturnType` to the `currentUser` value.
- Auth modal now exposes dialog semantics with `role="dialog"`, `aria-modal`, and a labelled heading.

### Verified Outcomes

- Responsive overflow after fixes: none at 768, 1024, or 1280 px; no overflow was observed at 320, 375, or 430 px.
- Unauthenticated home load after fixes: no console warnings/errors from app listeners.
- Admin directory: 8 Firestore-backed accounts rendered without a manual refresh, including multiple Team Member records and preserved roles.
- Product detail and Add to Cart: passed.
- Empty cart state: passed.
- Production build: passed.
- Typecheck: passed.

### Bugs Not Fixed / Not Tested

- Team login with `team@semixlabs.com / Team@123`: **NOT FIXED**. Runtime Firebase returned `auth/invalid-credential`, and the local fallback intentionally contains only the admin account. Credentials and authentication design were not changed.
- Google login: **NOT TESTED — external provider interaction requires a configured interactive Google account/browser flow**.
- Customer registration: **NOT TESTED — no account was created during the audit**.
- Razorpay live payment: **NOT TESTED — requires a real payment attempt and valid live gateway configuration**.
- Full checkout transaction: **NOT TESTED** in the final session because logout correctly cleared the cart before checkout could be reached.
- True load testing: **NOT TESTED — no load-test tool was run against external services**.
- Accessibility automated scan: **NOT TESTED — no dedicated axe/Lighthouse capability was available**. Manual dialog semantics and visible labels were checked where encountered.

### Remaining Issues

- MEDIUM: One external Unsplash asset request was blocked by the browser (`https://images.unsplash.com/photo-1608755728617-aefab37d45f1?...`), producing a missing image risk. Replace that specific asset with a controlled local/public asset or add an image fallback.
- LOW: Production build still reports a main JavaScript chunk around 2.2 MB and a >500 kB minified-chunk warning. Consider route-level lazy loading after baseline performance measurement.
- LOW: `.gitignore` contains duplicate `.env` patterns; harmless but should be consolidated.

### Files Changed During Audit

- `QA_AUDIT_BASELINE.md`
- `src/components/layout/Header.tsx`
- `src/context/AuthContext.tsx`
- `src/context/AppContext.tsx`
- `src/services/adminUserService.ts`
- `src/components/common/AuthModal.tsx`

### Final Command Results

- `npm run lint`: passed.
- `npm run build`: passed, with the existing large-chunk warning above.
- `npm test`: unavailable; no test script exists in `package.json`.
