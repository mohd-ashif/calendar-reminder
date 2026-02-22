# EventReminder Frontend

A production-ready frontend for the Google Event to Twilio Call Alert System. Built with Next.js 15, TypeScript, Tailwind CSS, shadcn/ui, and Redux Toolkit.

## 🚀 Tech Stack

- **Framework:** Next.js 15 (App Router)
- **State Management:** Redux Toolkit
- **Styling:** Tailwind CSS + shadcn/ui
- **Icons:** Lucide React
- **API Client:** Axios (with generic error handling and interceptors)
- **Forms:** React Hook Form + Zod

## 🛠️ Setup Steps

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Access the app:**
   Open [http://localhost:3000](http://localhost:3000)

## 📁 Folder Structure

- `src/app`: Page routes and layouts (App Router).
- `src/features`: Feature-specific logic and hooks (Auth, User).
- `src/store`: Redux store configuration and slices.
- `src/services`: Centralized API layer using axios.
- `src/components`: Reusable UI elements (shadcn-based), common layouts, and guards.
- `src/hooks`: Custom React hooks for business logic and Redux.

## 🔄 App Flow

1. **Landing:** User views the entry point and clicks "Login with Google".
2. **OAuth:** Redirected to backend -> Google -> Backend Callback -> Frontend Callback.
3. **Frontend Callback:** Captures token, verifies auth status via Redux, and redirects to Dashboard.
4. **Dashboard:** Authenticated user manages their phone number for receiving voice alerts.
5. **API Layer:** All requests are handled via `apiClient` with automatic token attachment.

## 🎤 Screenshare Explanation Tips

- **Scalability:** Highlight the `features/` based architecture which isolates domain logic.
- **Generic Handling:** Show the `api.client.ts` interceptors for token management and error normalization.
- **Type Safety:** Point to `src/types/index.ts` showing strict typing across the app.
- **UX/UI:** Mention the use of `ProtectedRoute` for auth guarding and shadcn/ui for consistent aesthetics.
- **Redux:** Explain that Redux is strictly used for shared state (Auth/User) while keeping component state local.
