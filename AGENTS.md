# Architecture
- Keep the TanStack file router and existing axios Express integration; the frontend must remain compatible with the user's server.
- Centralize workspace models and mutations in a browser-safe provider; demo data is isolated to mock sessions and never silently replaces failed live requests.
- Use a shared workspace shell and focused feature views for consistent navigation across content routes.