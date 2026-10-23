import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreatePost from "./pages/createPost";
import HomePage from "./pages/homePage";
import SignIn from "./pages/signInPage/signin";
import SignUp from "./pages/signUpPage/signup";
import ProtectedRoutes from "./protectedRoutes";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ProtectedRoutes />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/create" element={<CreatePost />} />
        </Route>

        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
