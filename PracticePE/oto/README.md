# FER202 – PRACTICAL EXAMINATION 01 (Car Manager)

## Tech stack

- ReactJS (functional components, Hooks: useState, useEffect, useReducer)
- React Router v6 (routing + route protection)
- Bootstrap 5 (responsive UI)
- JSON Server (mock REST API)
- Axios (HTTP client)

## Project structure (key files)

- `db.json`: JSON Server database with `Cars` and `Users` collections
- `src/api/CarAPI.js`: Axios instance targeting `http://localhost:3001`
- `src/context/CarContext.jsx`: State for cars (useReducer + useContext)
- `src/components/RegisterForm.jsx`: Register form (Username, Email, Password) + POST to `/Users`
- `src/components/CarManagement.jsx`: Car list + price filter (live + Search button)
- `src/App.js`: Router, Navbar, route guard (only access `/cars` after register)

## How to run

1. Install dependencies

```
npm install
```

2. Start JSON Server (in the `oto` folder)

```
npx json-server --watch db.json --port 3001
```

3. Start React app

```
npm start
```

4. Open

- Register: `http://localhost:3000/register`
- Cars: `http://localhost:3000/cars`

## Features mapping to exam requirements

- Setup JSON Server (1 mark)
  - `db.json` contains sample `Cars`; also includes `Users` for registration persistence.
- Create ReactJS Application (1 mark)
  - Functional components with hooks in `src/`.
- Create Register Form (1.5 marks)
  - Three inputs (Username, Email, Password) in `RegisterForm.jsx`.
  - On submit: alert “Hello, {username}! Your registration is successful.”
  - Also POSTs to `/Users` on JSON Server.
- Create Car Management Form (4 marks)
  - Show car list from JSON Server in `CarManagement.jsx`.
  - Filter by price with an input and a Search button; also updates live while typing.
- useReducer + useContext (1.5 marks)
  - `CarContext.jsx` manages `cars` and `price` state via useReducer/useContext.
- User Interface (0.5 mark)
  - Bootstrap-based responsive layout (navbar/grid/cards/forms).
- Routing (0.5 mark)
  - React Router routes `/register` and `/cars`. Guard: must register before accessing `/cars`.

## Notes

- Ensure JSON Server runs on port 3001 to match `CarAPI.js`.
- Images in `db.json` are optional. Put files under `public/img` if you want them displayed.
- For submission, exclude `node_modules` when zipping.

## Scripts

- `npm start` – start React dev server
- `npm run build` – production build
- JSON Server (manual): `npx json-server --watch db.json --port 3001`

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
