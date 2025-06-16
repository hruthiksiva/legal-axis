# Legal Axis

A modern web application connecting lawyers and clients, built with React, TypeScript, Tailwind CSS, and Firebase.

## Features

- User authentication (Sign up/Sign in)
- Role-based access (Lawyer/Client)
- Responsive design
- Real-time data with Firebase

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd legal-axis
```

2. Install dependencies:
```bash
npm install
```

3. Create a Firebase project and enable:
   - Authentication (Email/Password)
   - Firestore Database
   - Firebase Functions (if needed)

4. Create a `.env` file in the root directory with your Firebase configuration:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

5. Start the development server:
```bash
npm run dev
```

## Project Structure

```
src/
  ├── components/        # React components
  │   ├── auth/         # Authentication components
  │   └── Dashboard.tsx # Main dashboard component
  ├── contexts/         # React contexts
  │   └── AuthContext.tsx
  ├── config/          # Configuration files
  │   └── firebase.ts
  └── App.tsx          # Main application component
```

## Technologies Used

- React.js with TypeScript
- Vite
- Tailwind CSS
- Firebase (Authentication, Firestore)
- React Router
- Headless UI

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
