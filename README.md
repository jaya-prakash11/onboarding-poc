# Admin Onboarding Platform

A modern admin panel frontend for user authentication, password management, and organization onboarding. Built with React, Vite, and Tailwind CSS, integrated with a NestJS backend API.

## Features Implemented

### Authentication

- ✅ **Login** - Email/password authentication with JWT access & refresh tokens
- ✅ **Organization Registration** - Signup creates organization + admin user
- ✅ **Forgot Password** - Password reset request via email
- ✅ **Password Setup** - Set password from email invitation/reset links
- ✅ **Token Management** - Access & refresh token storage with rotation
- ✅ **Logout** - Secure logout with token revocation

### Organization Management

- ✅ **Dashboard** - Protected main landing page after login
- ✅ **Organization Registration** - Create organization with admin user
- ✅ **Add Organization** - Organization onboarding form

### Security & Protection

- ✅ **Protected Routes** - Dashboard only accessible when authenticated
- ✅ **Header with Logout** - Persistent header with logout functionality
- ✅ **Token Refresh** - Automatic token refresh on expiry

### UI/UX

- ✅ **Responsive Design** - Works on desktop and mobile devices
- ✅ **Split Layout** - Two-panel design (information + form)
- ✅ **Error Handling** - User-friendly error messages
- ✅ **Loading States** - Loading indicators on form submission
- ✅ **Success Feedback** - Success messages and confirmations
- ✅ **Tailwind CSS** - Modern styling with utility classes

## Tech Stack

- **Frontend**: React 19.2.5
- **Build Tool**: Vite 8.0.9
- **Styling**: Tailwind CSS 4.2.3
- **Routing**: React Router DOM
- **Backend API**: NestJS (POC App)
- **Port**: 3001 (configured for backend integration)

## Project Structure

```
src/
├── api/
│   └── auth.js              # API service for auth & organization registration
├── components/
│   └── Header.jsx           # Persistent header with logout button
├── pages/
│   ├── Login.jsx            # Login page with email/password form
│   ├── Signup.jsx           # Organization registration page
│   ├── ForgotPassword.jsx   # Password reset request
│   ├── ResetPassword.jsx    # Legacy reset password (redirects to PasswordSetup)
│   ├── PasswordSetup.jsx    # Password set/reset from email links
│   ├── Dashboard.jsx        # Protected main dashboard (post-login)
│   └── AddOrganization.jsx # Organization onboarding form
├── App.jsx                  # Route configuration with ProtectedRoute
├── main.jsx                 # Entry point
└── index.css                # Global styles with Tailwind
```

## Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/jaya-prakash11/onboarding-poc.git
   cd admin-onboarding
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the root directory:

   ```env
   VITE_API_URL=http://localhost:3000
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3001`

## Running the Backend

The frontend requires the POC backend API running:

```bash
cd ../poc-app
npm run start:dev
```

The backend runs on `http://localhost:3000` by default.

## API Integration

### Authentication Endpoints

- `POST /auth/login` - Login with email and password
- `POST /auth/refresh` - Refresh access token using refresh token
- `POST /auth/logout` - Logout and revoke refresh token
- `POST /auth/forgot-password` - Request password reset (email required)
- `POST /auth/password/validate` - Validate password setup/reset token
- `POST /auth/password/set` - Set new password using valid token

### Organization Endpoints

- `POST /auth/register-organization` - Register new organization with admin user
- `POST /organizations` - Create new organization (Super Admin only)
- `GET /organizations` - List all organizations (Super Admin only)
- `GET /organizations/me` - Get current organization details
- `GET /organizations/users` - List organization users

## Test Credentials

Use these credentials to test the login flow:

| Field    | Value                    |
| -------- | ------------------------ |
| Email    | `superadmin@example.com` |
| Password | `ChangeMe123!`           |

## Build for Production

```bash
npm run build
```

This generates optimized files in the `dist/` directory.

## Available Scripts

- `npm run dev` - Start development server with HMR
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint checks

## Features Coming Soon

- [ ] User invitation workflow (admin can invite users)
- [ ] Role-based access control (RBAC) UI
- [ ] Audit logs viewer
- [ ] Organization settings management
- [ ] Multi-language support

## License

Proprietary
