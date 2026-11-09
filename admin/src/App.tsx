import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreatePost from "./pages/createPost";
import HomePage from "./features/post/pages/HomePage";
import Login from "./features/auth/pages/signin";
import SignUp from "./features/auth/pages/signup";
import ProtectedRoutes from "./protectedRoutes";

import "./App.css";
import { ThemeProvider } from "./components/ui/theme-provider";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Routes>
          <Route element={<ProtectedRoutes />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/create" element={<CreatePost />} />
          </Route>

          <Route path="/signin" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
