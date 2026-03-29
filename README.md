# Admin Command Center

A modern, full-stack administrative dashboard built with **React**, **Vite**, **Tailwind CSS**, and **Electron**. This platform supports multi-platform deployment, including Web, Desktop (Windows/macOS/Linux), and Android.

---

## 🚀 Quick Start (Local Setup)

Follow these steps to get the project running on your machine:

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **npm** (v9 or higher)

### 2. Clone and Install
```bash
# Clone the repository (if you exported to GitHub)
# git clone <your-repo-url>
# cd admin-command-center

# Install dependencies
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory. You can use `.env.example` as a template:
```bash
cp .env.example .env
```

**Key Variables:**
- `VITE_API_BASE_URL`: The URL of your backend service (e.g., `http://192.168.1.100:8000/api/v1`).
- `VITE_FRONTEND_BASE_URL`: The URL where your frontend is hosted (e.g., `http://localhost:3000`).
- `GOOGLE_CLIENT_ID`: Your Google OAuth client ID for authentication.

### 4. Run the Development Server
```bash
# Start the Vite dev server
npm run dev
```
The app will be available at `http://localhost:3000`.

---

## 🔗 Linking to a Backend (e.g., FastAPI)

To connect this frontend to a separate backend service (like a FastAPI server running at `192.168.1.50:8000`):

1.  **Update `.env`**:
    ```env
    VITE_API_BASE_URL=http://192.168.1.50:8000/api/v1
    ```
2.  **CORS Configuration (Backend)**:
    Ensure your FastAPI backend allows requests from your frontend origin. In FastAPI, you would add:
    ```python
    from fastapi.middleware.cors import CORSMiddleware

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:3000", "http://localhost:4321"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    ```
3.  **API Client**:
    The project uses `axios` for API calls. Check `src/services/apiClient.ts` (or similar) to see how `VITE_API_BASE_URL` is utilized.

---

## 🖥️ Desktop App (Electron)

The project is pre-configured with **Electron** for native desktop support.

### Run in Development
```bash
npm run electron:dev
```
This will start the Vite dev server and launch the Electron window simultaneously.

### Build Executable
```bash
npm run electron:build
```
The packaged application (e.g., `.exe`, `.dmg`, or `.AppImage`) will be generated in the `dist_electron` folder.

---

## 🌐 Web Deployment

To deploy as a standard web application:

1.  **Build the project**:
    ```bash
    npm run build
    ```
2.  **Deploy**:
    Upload the contents of the `dist/` folder to any static hosting provider (Vercel, Netlify, AWS S3, etc.).

---

## 📱 Android App (Capacitor)

The project uses **Capacitor** to wrap the web app into a native Android container.

### 1. Initial Setup (First Time Only)
Ensure you have **Android Studio** installed and configured.
```bash
# Initialize Capacitor and add the Android platform
npm run android:init
```

### 2. Sync and Build
Whenever you make changes to the web code, sync them to the Android project:
```bash
# Build the web app and sync to Android
npm run android:sync
```

### 3. Open in Android Studio
```bash
# Open the project in Android Studio to build the APK/Bundle
npm run android:open
```
From Android Studio, you can run the app on an emulator or a physical device.

---

## 🛠️ Tech Stack
- **Frontend**: React 19, Vite, Tailwind CSS 4
- **Animations**: Motion (formerly Framer Motion)
- **Icons**: Lucide React
- **Desktop**: Electron
- **Mobile**: Capacitor
- **API**: Axios

---

## 📝 License
This project is licensed under the MIT License.
