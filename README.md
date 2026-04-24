# Admin Onboarding Platform

A modern admin panel frontend for user authentication, password management, and organization onboarding. Built with React, Vite, and Tailwind CSS, integrated with a NestJS backend API.

## Features Implemented

### Authentication

- ✅ **Login** - Email/password authentication with JWT tokens
- ✅ **Signup** - User registration with form validation
- ✅ **Forgot Password** - Password reset flow via email
- ✅ **Reset Password** - Set new password with token validation
- ✅ **Token Management** - Access token storage and refresh capability

### Organization Management

- ✅ **Dashboard** - Main landing page after login
- ✅ **Create Organization** - Form to create new organizations (integration ready)
- ✅ **Onboard Organization** - Organization onboarding request form
- ✅ **Add Organization** - Dedicated organization setup page

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

## Project Structure

```
src/
├── api/
│   └── auth.js              # API service for authentication & organizations
├── pages/
│   ├── Login.jsx            # Login page with email/password form
│   ├── Signup.jsx           # User registration page
│   ├── ForgotPassword.jsx    # Password reset request
│   ├── ResetPassword.jsx     # Set new password with token
│   ├── Dashboard.jsx         # Main dashboard (post-login)
│   ├── AddOrganization.jsx   # Organization onboarding form
│   └── CreateOrganization.jsx # Create organization form
├── App.jsx                  # Route configuration
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

The application will be available at `http://localhost:5173`

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
- `POST /auth/refresh` - Refresh access token
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/password/validate` - Validate reset token
- `POST /auth/password/set` - Set new password

### Organization Endpoints

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

- [ ] Organization admin user management
- [ ] User invitation workflow
- [ ] Role-based access control (RBAC) UI
- [ ] Audit logs viewer
- [ ] Organization settings management
- [ ] Multi-language support

## License

Proprietary
