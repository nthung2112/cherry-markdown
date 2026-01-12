# Complex Diagrams

> MarkView supports complex Mermaid diagrams with interactive features like zooming and panning.

## Features

- Click the expand button (top-right corner of diagram) to **Open Fullscreen** view
- In fullscreen mode:
  - **Zoom In/Out**: Use the +/- buttons or mouse wheel
  - **Pan**: Click and drag to move around
  - **Reset View**: Click the reset button to return to original size
  - **Close**: Click the X button or press ESC key
- **Print-friendly**: Try printing this page (Ctrl+P / Cmd+P) - the expand buttons and modal should be hidden, and diagrams should print cleanly.

---

## HTTP 401 + Client-initiated

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant SPA
    participant Backend
    participant Session Store
    participant Keycloak

    User->>SPA: Access protected resource (/dashboard)
    Note over SPA: SPA saves current state
    SPA->>Backend: GET /api/dashboard
    Note over SPA,Backend: CORS applies
    Backend-->>SPA: 401 Unauthorized
    Note over SPA: SPA calls login() function
    SPA->>Browser: window.open('/oauth2/authorization/keycloak?redirect_uri=/dashboard&scope=openid', '_self')
    Browser->>Backend: GET /oauth2/authorization/keycloak?redirect_uri=/dashboard&scope=openid
    Backend->>Session Store: Create session, save original URL (/dashboard)
    Session Store-->>Backend: Return session ID
    Backend->>Backend: Generate state parameter
    Backend->>Session Store: Store state parameter
    Backend-->>Browser: 302 Redirect to Keycloak (with state parameter)
    Note over Browser: Store session ID in secure cookie
    Note over Browser: Set cookie flags: HttpOnly, Secure, SameSite=Lax
    Browser->>Keycloak: Follow redirect (with state parameter)
    alt Authentication Success
        Keycloak-->>Browser: Present login page
        Browser-->>User: Display login page
        User->>Browser: Enter credentials
        Browser->>Keycloak: Submit credentials
        Keycloak-->>Browser: 302 Redirect to Backend with auth code
        Browser->>Backend: Follow redirect with auth code, session cookie, and state
        Backend->>Session Store: Validate state parameter
        Backend->>Keycloak: Exchange code for tokens
        Keycloak-->>Backend: Return tokens (access, refresh, id)
        Backend->>Backend: Validate id token
        Backend->>Session Store: Update session with tokens
        Backend->>Backend: Generate CSRF token
        Backend->>Session Store: Store CSRF token in session
        Backend->>Session Store: Retrieve original URL from session
        Session Store-->>Backend: Return original URL (/dashboard)
        Backend-->>Browser: 302 Redirect to original URL (/dashboard)
        Note over Browser: Update session cookie, set CSRF cookie
        Note over Browser: Set cookie flags: HttpOnly, Secure, SameSite=Strict for session
        Note over Browser: Set cookie flags: Secure, SameSite=Strict for CSRF (not HttpOnly)
        Browser->>SPA: Load SPA with /dashboard route
        Note over SPA: SPA restores saved state
        SPA->>SPA: Read CSRF token from cookie
        SPA->>Backend: GET /api/dashboard (with session cookie and CSRF token in header)
        Note over SPA,Backend: CORS applies, CSRF validated
        Backend->>Session Store: Validate session and retrieve user data
        Session Store-->>Backend: Return user data
        Backend-->>SPA: Return dashboard data
        SPA-->>User: Display dashboard
    else Authentication Failure
        Keycloak-->>Browser: Return error
        Browser->>Backend: Redirect to error handler
        Backend->>Backend: Log error
        Backend-->>Browser: Display error page
        Browser-->>User: Show authentication error
    end

    Note over SPA,Backend: CORS is relevant for all SPA-Backend interactions
    Note over Browser,Keycloak: Browser redirects are not subject to CORS
    Note over SPA: State management happens client-side
    Note over SPA,Backend: Original URL (/dashboard) is preserved and used after auth
    Note over SPA,Backend: CSRF token read from cookie and sent in header
    Note over Browser: All cookies use Secure flag to ensure HTTPS-only transmission
    Note over Browser: Session cookie uses HttpOnly to prevent JS access
    Note over Browser: SameSite=Strict for session, SameSite=Lax for initial auth
```

---

## Refresh Token Flow

```mermaid
sequenceDiagram
    participant User
    participant SPA
    participant Browser
    participant Backend
    participant Session Store
    participant Keycloak

    Note over SPA: Access token expires
    SPA->>Backend: API request with expired access token
    Note over SPA,Backend: CORS applies
    Backend->>Session Store: Check token status
    Session Store-->>Backend: Token expired, return refresh token
    Backend->>Keycloak: Request new tokens using refresh token
    alt Refresh Successful
        Keycloak-->>Backend: Return new access and refresh tokens
        Backend->>Session Store: Update session with new tokens
        Backend->>Backend: Generate new CSRF token
        Backend->>Session Store: Store new CSRF token in session
        Backend-->>Browser: Set new session and CSRF cookies
        Note over Browser: Update cookies (HttpOnly, Secure, SameSite=Strict)
        Backend-->>SPA: Return success status (200 OK)
        SPA->>Backend: Retry original API request
        Backend->>Session Store: Validate session and retrieve user data
        Session Store-->>Backend: Return user data
        Backend-->>SPA: Return requested API data
    else Refresh Failed (e.g., refresh token expired)
        Keycloak-->>Backend: Return error
        Backend->>Session Store: Clear invalid session
        Backend-->>Browser: Clear session and CSRF cookies
        Backend-->>SPA: Return authentication error (401 Unauthorized)
        Note over SPA: Redirect to login page
        SPA-->>User: Display login required message
    end

    Note over SPA,Backend: CORS is relevant for all SPA-Backend interactions
    Note over Backend,Keycloak: Backend-Keycloak communication is server-to-server
    Note over SPA: SPA handles token refresh transparently to the user
    Note over Backend: Refresh token never sent to client
    Note over Browser: Cookies updated with secure flags
```
