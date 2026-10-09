# Auth

Login, register, Google sign-in, and forgot-password for Kahoot.uz.

## What the user sees

- `/login` — email/password plus Google. Redirects to `/dashboard` if already signed in.
- `/register` — creates a **student** (`role: 'user'` on the old backend).
- `/register/teacher` — same form, role **teacher**.
- `/forgot-password` — always shows “email sent” after a 1.5s delay. No API.

## Data

Real HTTP via `api/authApi.ts` and `AuthContext`:

| Action | Method | Path |
|--------|--------|------|
| Login | POST | `/login` |
| Register | POST | `/register` |
| Google | POST | `/auth/google` `{ token }` |
| Profile | GET | `/me/:userId` (defined, unused) |

Token + user JSON in `localStorage` keys `token` and `user`. Axios reads the token on each request.

## File map

```
api/authApi.ts          HTTP + flat-response normalizer
components/             LoginForm, RegisterForm, ForgotPasswordForm, LogoutButton
hooks/                  useLogin, useRegister, useForgotPassword
constants/              limits, messages, mock delays
utils/pasteHandler.ts   paste-length guard
types/                  form state types
```

`LogoutButton` is unused; logout lives in `src/components/nav-user.tsx`.

## Gaps

- Forgot-password is mock.
- Register has no confirm-password field.
- Google signup does not send role.
- `MIN_PASSWORD_LENGTH` is not enforced on the form.
