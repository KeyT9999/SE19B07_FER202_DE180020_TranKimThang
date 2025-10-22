# useContext Exercises

This project demonstrates the usage of React's `useContext` hook through two comprehensive exercises.

## Project Structure

```
src/
├── contexts/
│   ├── ThemeContext.js    # Theme management context
│   └── AuthContext.js     # Authentication context
├── components/
│   ├── CounterComponent.jsx  # Counter with useReducer + ThemeContext
│   ├── LightSwitch.jsx       # Light switch with useReducer + ThemeContext
│   └── LoginForm.jsx         # Login form with useReducer + AuthContext
└── App.js                   # Main app with providers
```

## Exercise 1: ThemeContext Implementation

### Features:
- **ThemeContext**: Manages light/dark theme state globally
- **CounterComponent**: Uses `useReducer` for counter state + `useTheme` hook
- **LightSwitch**: Uses `useReducer` for light state + `useTheme` hook
- **Theme Toggle**: Both components can toggle theme independently

### Key Components:

#### ThemeContext.js
- Creates context with default values
- Provides `ThemeProvider` component
- Includes custom `useTheme` hook for easy access
- Manages theme state and toggle functionality

#### CounterComponent.jsx
- Uses `useReducer` for counter state management
- Integrates with `ThemeContext` for theme switching
- Displays current count and provides increment/decrement/reset actions

#### LightSwitch.jsx
- Uses `useReducer` for light switch state
- Integrates with `ThemeContext` for theme switching
- Provides toggle/on/off actions for the light

## Exercise 2: AuthContext Implementation

### Features:
- **AuthContext**: Manages user authentication state globally
- **LoginForm**: Uses `useReducer` for form state + `useAuth` hook
- **Mock Data**: Uses predefined user accounts instead of API calls
- **Admin Only**: Only admin users can successfully log in
- **Form Validation**: Comprehensive client-side validation

### Key Components:

#### AuthContext.js
- Creates authentication context with mock data
- Provides `AuthProvider` component
- Includes custom `useAuth` hook
- Manages login/logout functionality
- Enforces admin-only access policy

#### LoginForm.jsx
- Uses `useReducer` for form state management
- Integrates with `AuthContext` for authentication
- Includes form validation (username, password length)
- Shows user information after successful login
- Provides logout functionality

### Mock Data:
```javascript
const mockAccounts = [
    {
        id: 1,
        username: 'admin',
        email: 'admin@example.com',
        password: '123456',
        role: 'admin',
        status: 'active'
    },
    {
        id: 2,
        username: 'user1',
        email: 'user1@example.com',
        password: '123456',
        role: 'user',
        status: 'active'
    },
    {
        id: 3,
        username: 'user2',
        email: 'user2@example.com',
        password: '123456',
        role: 'user',
        status: 'locked'
    }
];
```

## How to Use

### Demo Credentials:
- **Username**: admin
- **Password**: 123456

### Features to Test:
1. **Theme Switching**: Click the Dark/Light buttons in CounterComponent or LightSwitch
2. **Counter Operations**: Use increment, decrement, and reset buttons
3. **Light Control**: Use toggle, turn on, and turn off buttons
4. **Login System**: Try logging in with different credentials
5. **Form Validation**: Test with empty fields or invalid data
6. **Admin Restriction**: Try logging in with non-admin accounts

## Technical Implementation Details

### useContext Pattern:
1. **Create Context**: Using `React.createContext()`
2. **Provide Context**: Using `Context.Provider` component
3. **Consume Context**: Using `useContext()` hook or custom hook
4. **Custom Hooks**: For better error handling and easier usage

### useReducer Integration:
- Both exercises combine `useContext` with `useReducer`
- `useReducer` manages local component state
- `useContext` manages global application state
- Demonstrates how to use both hooks together effectively

### Error Handling:
- Custom hooks include error boundaries
- Form validation with user-friendly error messages
- Authentication error handling with specific messages

## Dependencies

- React 19.2.0
- Bootstrap 5.x (for UI components)
- React-Bootstrap (for React components)

## Running the Application

```bash
npm install
npm start
```

The application will open at `http://localhost:3000`

## Key Learning Points

1. **Context API**: How to create and use React Context
2. **Provider Pattern**: How to wrap components with providers
3. **Custom Hooks**: How to create reusable context hooks
4. **State Management**: Combining local (useReducer) and global (useContext) state
5. **Form Handling**: Managing complex form state with useReducer
6. **Authentication**: Implementing login/logout functionality
7. **Validation**: Client-side form validation
8. **Error Handling**: Proper error management in React applications