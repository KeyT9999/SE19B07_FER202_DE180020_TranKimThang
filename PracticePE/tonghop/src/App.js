import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/styles.css";
import AppRoutes from "./routes/AppRoutes";

function App() {
  // const { isDarkMode } = useTheme();

  // Áp dụng class dark-mode vào thẻ body
  // document.body.className = isDarkMode ? "dark-mode" : "";

  return <AppRoutes />;
}

export default App;
