# FormSphere Frontend

This is the frontend application for FormSphere, built with Angular, Angular Material, and TypeScript.  
It provides a modern, responsive UI for form creation, management, analytics, and user authentication, supporting advanced features like drag-and-drop form building, reusable templates, and secure user flows.

---

## 🚀 Tech Stack

- **Framework:** Angular 19
- **Language:** TypeScript
- **UI:** Angular Material
- **State Management:** RxJS Services
- **Forms:** Reactive Forms
- **Charts:** ng2-charts, Chart.js
- **Notifications:** ngx-toastr
- **Loader:** ngx-ui-loader
- **Signature:** angular2-signaturepad
- **Linting/Formatting:** ESLint, Prettier, Husky, lint-staged

---

## 📁 Project Structure

```
src/
├── app/
│   ├── modules/
│   │   ├── auth/               # Authentication (login, signup, animation)
│   │   ├── create-forms/       # Form builder (form builder, canvas, sidebar)
│   │   ├── dashboard/          # main, hero sections, footer, etc.
│   │   ├── my-forms/           # User's forms, shared forms, responses
│   │   ├── templates/          # Form templates
│   ├── services/               # Shared Angular services (auth, forms, file upload, etc.)
│   ├── shared/                 # Shared modules, components, interfaces
│   ├── app-routing.module.ts   # Root routing module
│   ├── app.module.ts           # Root app module
│   └── app.component.*         # Root app component files
├── environments/               # Environment configs
├── styles.css                  # Global styles
├── index.html                  # Main HTML file
└── main.ts                     # Main entry point
```

---

## 🎯 Core Functionality

- **User Authentication**
  - Register, login, logout, session management
  - Route guards for protected pages

- **Form Builder**
  - Drag-and-drop form creation
  - Support for various field types (text, choice, file, signature, etc.)

- **Template Management**
  - Use and manage reusable form templates

- **Form Responses**
  - Submit and view responses
  - File uploads and signature capture

- **Analytics**
  - Visualize form data with charts

- **User Dashboard**
  - Manage created forms, view analytics, and responses

---

## 🛠️ Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)
- Angular CLI

---

## 🔧 Installation

1. **Clone the repository**
   ```sh
   git clone https://github.com/Meshwa-Simform/FormSphere-Frontend.git
   cd FormSphere-Frontend
   ```

2. **Install dependencies**
   ```sh
   npm install
   ```

3. **Set up environment variables**
   - Generate and Edit `src/environments/environment.ts` and `environment.development.ts` setting the `API_URL` to your backend endpoint.

---

## 🚀 Running the Application

- **Development Mode**
  ```sh
  npm start
  ```
- **Production Build**
  ```sh
  npm run build
  ```

---

## 📦 Available Scripts

| Script           | Description                                   |
|------------------|-----------------------------------------------|
| `npm start`      | Start development server (`ng serve`)         |
| `npm run build`  | Build the application for production          |
| `npm run test`   | Run unit tests                                |
| `npm run lint`   | Run ESLint and auto-fix issues                |
| `npm run format` | Format code with Prettier                     |

---

## 📝 Code Quality

- **TypeScript** for type safety
- **ESLint** for code linting (`npm run lint`)
- **Prettier** for code formatting (`npm run format`)
- **Husky** and **lint-staged** for pre-commit checks

---

## 🔐 Environment Variables

- `API_URL`: Backend API endpoint (set in `src/environments/environment.ts`)

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/feature-name`)
3. Commit your changes (`git commit -m 'Add some feature description'`)
4. Push to the branch (`git push origin feature/feature-name`)
5. Open a Pull Request

---

## Author

**Meshwa Patel**

---

## 📣 Notes

- This project is tightly integrated with the [FormSphere Backend](https://github.com/Meshwa-Simform/FormSphere-Backend).
---