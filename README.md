# TaskFlow - A Mobile Task Management App

TaskFlow is a sleek and intuitive mobile application for managing your daily tasks. Built with React Native and Expo, it offers a seamless cross-platform experience on both Android and iOS. The app is powered by Firebase for real-time data synchronization and user authentication, ensuring your tasks are always up-to-date and secure.

## ✨ Features

- **User Authentication**: Secure sign-up and login functionality using Firebase Authentication.
- **Task Management**: Create, edit, delete, and mark tasks as complete.
- **Due Dates & Countdowns**: Set due dates and times for your tasks and see a live countdown.
- **Filtering**: Filter tasks by 'All', 'Pending', and 'Completed' status.
- **Search**: Quickly find tasks with a real-time search bar.
- **Real-time Sync**: Tasks are synchronized in real-time across all your devices using Firestore.
- **Dark Mode UI**: A modern, dark-themed user interface.

## 🌐 Web Version

A web version of this application is also available, built with React and Vite. You can find the repository [here](https://github.com/vedantdalavi14/vexocore-task-manager).

## 🛠️ Tech Stack

- **Framework**: React Native with Expo
- **Language**: JavaScript (ES6+)
- **Backend**: Firebase (Authentication & Firestore)
- **Navigation**: React Navigation
- **UI Components**: `lucide-react-native` for icons, `react-native-modal-datetime-picker` for date/time selection.
- **State Management**: React Hooks (`useState`, `useEffect`, `useMemo`) and Context API.

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo Go](https://expo.dev/go) app on your Android or iOS device.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/vedantdalavi14/vexocore-task-manager-mobile.git
    cd vexocore-task-manager-mobile
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project by copying the example file:
    ```bash
    cp .env.example .env
    ```
    Open the `.env` file and replace the placeholder values with your own Firebase project credentials.

4.  **Start the development server:**
    ```bash
    npx expo start
    ```

5.  **Run on your device:**
    - Install the **Expo Go** app on your iOS or Android phone.
    - Scan the QR code shown in the terminal with the Expo Go app. This will bundle the app and run it on your device.

## 📁 Project Structure

```
vexocore-task-manager-mobile/
├── assets/         # Fonts and images
├── components/     # Reusable UI components
├── constants/      # Color schemes and other constants
├── context/        # React Context for global state (e.g., Auth)
├── hooks/          # Custom React hooks
├── screens/        # Main application screens (Login, Dashboard, etc.)
├── firebase.js     # Firebase configuration
├── App.js          # Main app entry point with navigation setup
└── package.json    # Project dependencies and scripts
```

## 🤝 Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request.
