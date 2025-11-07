MOBILE SHOP APPLICATION - FER202-01

INSTALLED PACKAGES:
- react: ^19.1.1
- react-dom: ^19.1.1
- react-router-dom: ^6.x.x
- react-bootstrap: ^2.x.x
- bootstrap: ^5.x.x
- axios: ^1.x.x
- prop-types: ^15.8.1
- json-server: (dev dependency)

HOW TO RUN:

1. Install dependencies:
   npm install

2. Start JSON Server (in one terminal):
   Open terminal in project root directory
   Run command: json-server --watch db.json --port 3001
   
   You should see:
   \{^_^}/ hi!
   Loading db.json
   Done
   Resources
   http://localhost:3001/mobiles
   http://localhost:3001/accounts

3. Start React app (in another terminal):
   Open another terminal in project root directory
   Run command: npm run dev
   
   React app will start on http://localhost:5173 (default Vite port)

4. Open browser:
   Navigate to http://localhost:5173

JSON SERVER ENDPOINTS:
- http://localhost:3001/mobiles (GET all mobiles)
- http://localhost:3001/mobiles/:id (GET single mobile)
- http://localhost:3001/accounts (GET all accounts)

NOTES:
- Make sure JSON Server is running on port 3001 before starting React app
- If port 5173 is already in use, Vite will ask to use another port
- JSON Server must be running for the app to work properly
- The app uses React Bootstrap for styling and is responsive

PROJECT STRUCTURE:
- src/api/ - API configuration (PhoneAPI.js)
- src/components/ - Reusable components (NavBar, PhoneList, ViewPhone, LoginForm, ConfirmModal)
- src/context/ - Context providers (AuthContext, CartContext, FavouriteContext)
- src/pages/ - Page components (HomePage, CartPage, FavouritePage, NotFoundPage)
- src/reducers/ - Reducers for state management (AuthReducer, LoginFormReducer)
- src/routes/ - Route definitions (AppRoutes.jsx)
- db.json - Mock database for JSON Server
- public/images/ - Static images (mobiles, carousel)

