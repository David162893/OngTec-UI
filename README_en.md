# 🎯 OngTec - Comprehensive Management System for NGOs

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg?style=for-the-badge)](https://github.com/tu-usuario/OngTec)  
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green.svg?style=for-the-badge)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18%2B-61dafb.svg?style=for-the-badge)](https://react.dev)

---

## 📋 Description

**OngTec** is a modern and scalable web platform designed to centralize and optimize the administrative management of non-governmental organizations (NGOs). It provides intuitive tools to manage users, volunteers, tasks, and other key operational functions.

It is currently under active development with core features implemented and an ambitious roadmap for new capabilities.

### 🎯 Target Audience
- **NGOs and non-profit organizations**
- **Administrative staff**
- **Volunteer coordinators**
- **Any organization that needs centralized management**

---

## ✨ Main Features

### Implemented Features ✅
- ✔️ **User Management** - Creation, editing, and administration of profiles
- ✔️ **Secure Authentication** - Login system with Auth context
- ✔️ **Task Dashboard** - Task visualization and tracking
- ✔️ **Reusable Components** - Library of modular React components
- ✔️ **Responsive Interface** - Layout adaptable to any device

### 🚀 Planned Features
- Advanced volunteer and scheduling management
- Reporting and analytics system
- Real-time notifications and alerts
- Granular roles and permissions system
- Data export (PDF, Excel)
- Events and activities calendar

> ⚠️ **Note:** The project is under active development. New features are added regularly.

---

## 🛠️ Technologies Used

### Frontend
| Technology | Purpose |
|-----------|----------|
| **React 18+** | Modern UI library |
| **Vite** | Ultra-fast build tool |
| **JavaScript/JSX** | Main language |
| **SCSS/Sass** | Advanced styling |

### Additional Tools
- **Sass-embedded** - Enhanced Sass compiler
- **Toastify** - User notifications
- **Node.js** - Development environment
- **ESLint** - Code linter
- **npm/yarn** - Dependency manager

---

## 🚀 Installation and Usage

### 📋 Prerequisites
- **Node.js** v18+ ([Download](https://nodejs.org))
- **npm** v9+ or **yarn** v3+ (included with Node.js)
- **Git** (to clone the repository)

### 📥 Installation Steps

#### 1. Clone the Repository
```bash
git clone https://github.com/David162893/OngTec.git
cd OngTec
```

#### 2. Install Dependencies
```bash
npm install
# or if you prefer yarn
yarn install
```

#### 3. Run in Development Mode
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173` (Vite's default port).

### 📦 Available Scripts

```bash
# Development with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Run tests (if configured)
npm run test
```

---

## 📁 Project Structure

```
OngTec/
├── public/                 # Static files (favicon, images)
├── src/
│   ├── components/         # Reusable components
│   │   ├── Button/
│   │   ├── DrumRoll/
│   │   ├── FormDate/
│   │   ├── FormInput/
│   │   ├── FormModal/
│   │   ├── FormSelect/
│   │   ├── Header/
│   │   ├── Modal/
│   │   ├── PdfView/
│   │   ├── Table/
│   │   ├── ToastToggle/
│   │   └── CoudinaryUpload.jsx
│   ├── context/            # Context API for global state
│   │   ├── AuthContext.jsx
│   │   └── ToastContext.jsx
│   ├── hooks/              # Custom hooks
│   │   ├── useAuth.js/
│   │   ├── useAutoSize.js
│   │   ├── useCloseModal.js
│   │   ├── useCountryQueries.js
│   │   ├── useDrumRoll.js
│   │   ├── useGenderQueries.js
│   │   ├── useHideOnScroll.js
│   │   ├── useInfiniteScroll.js
│   │   ├── useKeyboardShortcut.js
│   │   ├── useLocalidadQueries.js
│   │   ├── usePersistedColumns.js
│   │   ├── useProfileMutations.js
│   │   ├── useProfileQueries.js
│   │   ├── useRegionQueries.js
│   │   ├── useRequirementsQueries.js
│   │   ├── useRoleQueries
│   │   ├── useStatusQueries.js
│   │   ├── useTaskMutations.js
│   │   ├── useTaskTypeQueries.js
│   │   ├── useToast.js
│   │   ├── useUserMutations.js
│   │   ├── useUserQueries.js
│   │   └── useValidation.js
│   ├── layout/             # Reusable layouts
│   ├── pages/              # Page components
│   │   ├── Home/
│   │   ├── Login/
│   │   ├── NotFound/
│   │   ├── OwnTasks/
│   │   ├── Profile/
│   │   ├── Register/
│   │   ├── Tasks/
│   │   ├── Users/
│   │   └── RegisterPage.jsx
│   ├── routes/             # Routing configuration
│   │   ├── BreadcrumbLabels.js
│   │   ├── LinkByRole.js
│   │   └── ProtectedRoute.jsx
│   ├── services/           # API services
│   ├── styles/             # Global SCSS and variables
│   ├── utils/              # Utility functions
│   ├── websocket/          # WebSocket configuration
│   ├── assets/             # Images, fonts, etc.
│   ├── App.jsx             # Root component
│   └── main.jsx            # Entry point
├── eslint.config.js        # ESLint configuration
├── vite.config.js          # Vite configuration
├── package.json            # Project dependencies
├── LICENSE                 # Project license
├── TODO                    # Pending tasks
└── README.md               # This file

```

---

## 🔐 Authentication and Security

OngTec implements a robust authentication system:

- **Context API** for centralized management of authentication state
- **Route protection** based on user roles
- **Secure tokens** to maintain sessions
- Login and registration functionality for new users

---

## 🎨 Main Components

### Available Components
- **Button** 
Reusable button component with support for multiple visual variants. Accepts dynamic styles via props and allows additional CSS classes for customization. Passes native HTML button properties for maximum flexibility.

- **DrumRoll**
Selector component with a "drum roll" (vertical carousel) behavior, supporting touch, mouse wheel, and keyboard interaction. Allows selecting values from a list with scale and opacity visual effects. Includes outside-click handling to close, disabled state support, and floating label.

- **FormDate**
Date input component with three drum roll selectors (day, month, year). Automatically validates days according to the selected month, locks dependent fields, and supports customizable year ranges. Returns an object with the structure { day, month, year }.

- **FormInput**
Text input component with built-in validation for email, phone, and password. Supports dynamic auto-sizing, contextual error messages, and disabled states. Automatically generates unique IDs if no name is provided.

- **FormModal**
Modal component with dynamic form that generates fields automatically based on the initial data structure. Supports multiple input types (text, number, date, select, multiselect, checkbox), nested objects, and arrays. Includes validation, handling of custom hooks for options, and configurable field order.

- **FormSelect**
Select component with integrated searchable filtering. Calculates the dropdown's dynamic position relative to the window, supports keyboard navigation, and closes on outside click. Automatically generates unique IDs.

- **Header**
Header component with dynamic navigation based on user role. Includes profile dropdown with contextual options, automatically hides on scroll, and shows a hero section for unauthenticated users. Integrates authentication and permission-based redirects.

- **Modal**
Dialog modal component rendered via Portal outside the DOM hierarchy. Supports closing with the Escape key and outside click through a unified hook. Includes header with title and close button, and a flexible body for any content.

- **PdfView**
PDF viewer component based on react-pdf. Generates dynamic documents with configurable structure (title, sections, items). Renders PDFs in an embedded viewer with customizable dimensions. Code is currently commented out and requires installing @react-pdf/renderer dependencies.

- **Table**
Advanced data table with hierarchical headers, dynamic filters (text, multiselect, date range), multi-column sorting, and persistent column selector. Supports nested data, hides configurable columns, and per-row actions (edit and delete for now).

- **CoudinaryUpload**
Image upload component that retrieves signed credentials from the backend server and uploads files to Cloudinary. Shows a preview of the uploaded image and returns a secure URL. Manages authentication securely without exposing credentials on the client.

### Custom Hooks
- `useAuth`
Custom authentication hook that manages loading and error state during login. Executes the authentication service request, shows success notifications, and handles errors centrally.

- `useAutoSize`
Hook that dynamically adjusts an input's width according to the text content. Measures text using canvas and respects configurable minimum and maximum limits. Returns ref, current width, and onChange handler.

- `useCloseModal`
Custom hook that manages automatic closing of modals via two mechanisms: outside click and Escape key press. Adds document listeners only when the modal is open and cleans them up on unmount or close, preventing memory leaks and optimizing performance.

- `useCountryQueries`
Custom hook that fetches the list of countries from the backend service on component mount. Manages loading, error, and data states with support for request cancellation via AbortController. Shows error notifications and returns data, loading state, and errors.

- `useDrumRoll`
Custom hook that implements the interaction logic for a drum roll selector (vertical carousel). Manages touch/mouse drag with inertia, mouse wheel, keyboard navigation, and automatic snapping to items. Includes smooth animations, request cancellation, and resource cleanup to prevent memory leaks.

- `useGenderQueries`
Custom hook that fetches the list of genders from the backend service on component mount. Manages loading, error, and data states with support for request cancellation via AbortController. Shows error notifications and returns data, loading state, and errors.

- `useHideOnScroll`
Custom hook that detects scroll direction and hides elements (such as headers) when the user scrolls down. Uses delta accumulation to avoid frequent changes and requires a minimum configurable scroll distance before activating. Returns a boolean visibility state.

- `useInfiniteScroll`
Custom hook that implements infinite scroll using IntersectionObserver. Places an invisible sentinel element at the end of the list that detects when the user approaches, automatically triggering more content loading. Stops when there is no more data or a request is in progress. Returns a ref for the sentinel element.

- `useKeyboardShortCut`
Not implemented yet.

- `useLocalidadQueries`
Custom hook that fetches the list of localities from the backend service on component mount. Manages loading, error, and data states with support for request cancellation via AbortController. Shows error notifications and returns data, loading state, and errors.

- `usePersistedColumns`
Custom hook that manages column visibility in tables with persistence in localStorage. Keeps a record of hidden columns, allows toggling their visibility, and syncs changes with local storage. Returns visible columns, hidden columns, toggle function, and manual setter.

- `useProfileMutations`
Custom hook to update the user profile, managing loading and error states. Executes the profile service request, shows success and error notifications, and handles exceptions centrally. Returns mutate function, loading state, and errors.

- `useProfileQueries`
Custom hook that fetches the user profile from localStorage. Safely parses stored data and returns the profile, loading state (always false), and errors (always null) since reading is synchronous.

- `useRegionQueries`
Custom hook that fetches the list of regions from the backend service on component mount. Manages loading, error, and data states with support for request cancellation via AbortController. Shows error notifications and returns data, loading state, and errors.

- `useRequirementsQueries`
Custom hook that fetches the list of requirements from the backend service on component mount. Manages loading, error, and data states with support for request cancellation via AbortController. Shows error notifications and returns data, loading state, and errors.

- `useRoleQueries`
Custom hook that fetches the list of roles from the backend service on component mount. Manages loading, error, and data states with support for request cancellation via AbortController. Shows error notifications and returns data, loading state, and errors.

- `useStatusQueries`
Custom hook that fetches the list of statuses from the backend service on component mount. Manages loading, error, and data states with support for request cancellation via AbortController. Shows error notifications and returns data, loading state, and errors.

- `useTaskMutations`
Custom hook that provides functions for CRUD task operations (create, update, delete). Manages loading and errors for each operation, shows success and error notifications, and handles exceptions centrally. Returns mutate functions, loading state, and errors.

- `useTaskQueries`
Custom hook that groups task queries: fetches tasks for a specific user or the general list with pagination. Manages loading, error, and data states with support for request cancellation via AbortController. Shows error notifications and returns tasks, loading state, and errors.

- `useTaskTypeQueries`
Custom hook that fetches the list of task types from the backend service on component mount. Manages loading, error, and data states with support for request cancellation via AbortController. Shows error notifications and returns data, loading state, and errors.

- `useToast`
Custom hook that manages notifications with react-toastify integrated into a context. Allows toggling global notifications and shows messages only when they are enabled. Throws an error if used outside ToastProvider. Returns notification state, toggle function, and notify and toast methods.

- `useUserMutations`
Custom hook that provides functions for CRUD user operations (create, update, delete). Manages loading and errors for each operation, shows success and error notifications, and handles exceptions centrally. Returns mutate functions, loading state, and errors.

- `useUserQueries`
Custom hook that fetches the list of users with pagination. Manages loading, error, and data states with support for request cancellation via AbortController. Shows error notifications and returns users, loading state, and errors.

- `useValidation`
Custom hook that validates values against configurable regex patterns (email, phone, password). Returns a boolean validity state that automatically updates when the value or type changes. Treats empty fields as valid.

---

## 🔄 Data Flow

The application uses:
- **Context API** for global state (authentication)
- **Custom Hooks** for business logic
- **Functional components** for maximum reusability

```
Component → Custom Hook → API Service → Backend
             ↓
           Context API (Global State)
```

---

## 📝 Contributing

Contributions are welcome! I want to make OngTec better with your help.

### How to Contribute

1. **Fork** the repository
2. **Create a branch** for your feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

### Contribution Guidelines
- Follow the [code conventions](https://google.github.io/styleguide/jsguide.html)
- Make sure the linter passes (`npm run lint`)
- Document significant changes
- Create issues to discuss major changes **before** submitting a PR

### Reporting Bugs
- Use [GitHub Issues](https://github.com/David162893/OngTec/issues)
- Clearly describe the problem
- Include steps to reproduce
- Specify your environment (OS, Node.js, browser)

---

## 📄 License

This project is under the **MIT License** - see the [LICENSE](./LICENSE) file for more details.

---

## 👤 Contact

**David Rodríguez López**

- 📧 Email: [davidrolo2005@gmail.com](mailto:davidrolo2005@gmail.com)
- 🔗 LinkedIn: [David Rodríguez López](https://www.linkedin.com/in/david-rodr%C3%ADguez-l%C3%B3pez-37918630b/)
- 🐙 GitHub: [@David162893](https://github.com/David162893)

---

## 📊 Project Status

- **Current Version:** 1.0.0
- **Status:** 🟡 Under active development
- **Main and currently developed branch:** `main`

---

## 🖼️ Screenshots

*Home dashboard screenshot*
![Dashboard](https://via.placeholder.com/1200x600?text=Dashboard+OngTec)

*Task management system*
![Tasks Management](https://via.placeholder.com/1200x600?text=Task+Management)

*Administration area*
![Admin Panel](https://via.placeholder.com/1200x600?text=Admin+Panel)

---

## ❓ FAQ

**Q: Is OngTec free?**  
A: Yes, OngTec is an open-source project under the MIT license.

**Q: Can I contribute to the project?**  
A: Absolutely, contributions via Pull Requests and issue reporting are welcome.

**Q: Is there a backend included?**  
A: The current focus is on the frontend. You can integrate it with your own backend or extend the project.

**Q: Do I need technical experience to use OngTec?**  
A: The interface is designed to be intuitive, but I recommend technical support for the initial setup.

**Q: Which browsers are supported?**  
A: Chrome, Firefox, Safari, and Edge modern versions (last 2 years).

**Q: How do I report a bug?**  
A: Create an issue in [GitHub Issues](https://github.com/David162893/OngTec/issues) with clear details.

---

**⭐ If you find OngTec useful, consider leaving a star on GitHub**

---
