# FER202 Mobile Shop - Practical Examination 01

## Project Overview
This is a mobile management application built with React, JSON Server, React Router, and React Bootstrap. The application demonstrates various functionalities including data fetching, routing, form validation, and state management using useReducer and useContext.

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Install Dependencies
```bash
npm install
```

### Required Packages
The following packages are used in this project:
- `react` - UI library
- `react-dom` - React DOM rendering
- `react-router-dom` - Routing functionality
- `react-bootstrap` - UI component library
- `bootstrap` - CSS framework
- `axios` - HTTP client for API requests
- `prop-types` - Runtime type checking for React props
- `react-icons` - Icon library
- `json-server` - JSON Server for mock REST API

## Running the Application

### 1. Start JSON Server
Open a terminal and run:
```bash
npx json-server --watch db.json --port 3000
```

### 2. Start React Application
In a new terminal, run:
```bash
npm start
```

The application will open at `http://localhost:3000`

## Project Structure

```
fer202-01/
├── public/
│   ├── images/
│   │   ├── mobiles/     # Mobile product images
│   │   └── carousel/     # Carousel images
│   └── index.html
├── src/
│   ├── components/       # Reusable components
│   │   ├── Carousel.jsx
│   │   ├── MobileCard.jsx
│   │   └── Navbar.jsx
│   ├── context/          # Context providers
│   │   └── UserContext.jsx
│   ├── data/
│   │   └── db.json       # Mock data
│   ├── pages/            # Page components
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── MobileDetail.jsx
│   │   ├── MobileList.jsx
│   │   └── NotFound.jsx
│   ├── routes/           # Route definitions
│   │   └── AppRoutes.jsx
│   ├── App.js
│   └── index.js
├── db.json               # JSON Server database (copy of src/data/db.json)
├── package.json
└── README.md
```

## Features

### 1. Navigation
- NavBar with Home link on the left
- Right-aligned icons for Favourite, Cart, and Login
- Responsive design with collapsible menu

### 2. Home Page
- Three-image carousel showcasing featured products
- Welcome section with call-to-action
- "Browse mobile shop" button navigates to mobile list

### 3. Mobile List (Products Page)
- Display all mobiles fetched from JSON Server
- Shows name, description, price, and image
- Search functionality
- Category filter (placeholder for future expansion)
- Sort by Name (A-Z, Z-A) or Price (Low-High, High-Low)
- View Details, Add to Cart, and Favourite buttons for each mobile

### 4. Mobile Detail Page
- Full product information display
- URL parameter contains mobile ID (e.g., /mobiles/:id)
- View Details functionality
- Add to Cart and Favourite buttons
- Back to List button to return to mobile list
- 404 redirect for invalid IDs

### 5. Login Form
- Username or Email input with validation
- Password input with validation
- Real-time error messages:
  - "Username or Email is required" if empty
  - "Password is required" if empty
  - "Invalid username or password" on incorrect credentials
- Success modal showing "Welcome, [username]! Login successful."
- Automatic redirect to mobile list on successful login
- Uses useContext and useReducer for state management

### 6. 404 Page
- Custom 404 Not Found page
- Back to Home button

## Technical Requirements Met

✅ **React Bootstrap**: Used for styling and responsive design
✅ **PropTypes**: All components validated with PropTypes
✅ **Axios**: Used for API calls to JSON Server
✅ **useReducer**: Implemented in UserContext for state management
✅ **useContext**: Used for user authentication state
✅ **React Router**: Implemented routing with URL parameters

## API Endpoints

The application uses the following JSON Server endpoints:
- `GET http://localhost:3000/mobiles` - Fetch all mobiles
- `GET http://localhost:3000/mobiles/:id` - Fetch single mobile
- `GET http://localhost:3000/users` - Fetch all users
- `GET http://localhost:3000/carousel` - Fetch carousel items

## Test Credentials

Use these credentials to test the login functionality:

```
Username: admin
Email: admin@mail.com
Password: 123456
```

## Development Notes

- The application is fully responsive and works on mobile devices
- All components use PropTypes for type checking
- State management is handled through React Context and useReducer
- Error handling is implemented for API calls
- Image fallbacks are provided for missing images

## Author
FER202 - Block 3 - Practical Examination 01