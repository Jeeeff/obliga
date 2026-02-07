# E2E Login Debug Report

## 1. Diagnostic Steps

### 1.1 Backend Health
- **GET /healthz**: 200 OK
- **GET /readyz**: 200 OK
- **Date**: 2026-02-07
- **Evidence**:
  ```
  HTTP/1.1 200 OK
  Content-Length: 2
  ```

### 1.2 Login API
- **URL**: http://localhost:3001/auth/login
- **Credentials**: client@acme.com / password123
- **Result**: 200 OK
- **Body**:
  ```json
  {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```
- **Evidence**: Command `curl.exe -X POST ... -d "@temp_login.json"` succeeded.

### 1.3 Frontend Configuration
- **File**: `lib/api.ts`
- **Config**: `NEXT_PUBLIC_API_BASE_URL` or `http://localhost:3001` (dev)
- **Verified**: Frontend uses default `http://localhost:3001` in dev environment.

### 1.4 CORS Configuration
- **Backend**: `cors({ origin: env.CORS_ORIGINS })`
- **Frontend Origin**: `http://localhost:3000`
- **Verified**: Request from `curl` worked. Browser requests should work if `CORS_ORIGINS` includes localhost:3000.
- **Note**: `GET /healthz` headers show `Access-Control-Allow-Credentials: true`.

## 2. Root Cause Analysis

- **Initial Failure**: Playwright failed at login step.
- **Investigation**:
  - Backend is healthy.
  - Login API works with correct credentials.
  - Frontend code (`app/login/page.tsx`) correctly calls API and saves `accessToken`.
- **Potential Issue**: Race condition in E2E test or `CORS_ORIGINS` environment variable issue if running in a containerized/CI environment (though local `curl` works).
- **Fix**: The issue might be the `toHaveURL` assertion timing out before the redirect completes, or the frontend taking too long to hydrate/load data after login.

## 3. Action Plan

1.  **Enhance E2E Tests**:
    - Add `waitForURL` instead of `toHaveURL` with increased timeout.
    - Add console log capture.
    - Add request failure capture.
    - Explicitly wait for `/auth/login` response.
2.  **Verify**: Run `npm run test:e2e` after changes.
