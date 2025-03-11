import { AppBar, Toolbar } from "@mui/material";
import { SnackBar } from "./components/Snackbar";
import Edit from "./pages/Edit";
import Main from "./pages/Main";
import Write from "./pages/Write";

import {
  Routes,
  Route,
  NavLink,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <div className="flex-grow-0 sm:flex-1"></div>
          <NavLink
            to="/main"
            className="font-bold select-none cursor-pointer self-stretch flex items-center"
          >
            🐰 Jini’s To-Do 🐰
          </NavLink>
          <div className="flex-grow"></div>
          <div className="self-stretch flex items-center">
            {location.pathname === "/main" && (
              <NavLink
                className="select-none self-stretch flex items-center"
                to="/write"
              >
                할일 추가
              </NavLink>
            )}
            {location.pathname !== "/main" && (
              <button
                onClick={() => navigate(-1)}
                className="select-none self-stretch flex items-center"
              >
                이전
              </button>
            )}
          </div>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <SnackBar />
      <Routes>
        <Route path="/main" element={<Main />} />
        <Route path="/write" element={<Write />} />
        <Route path="/edit/:id" element={<Edit />} />
        <Route path="*" element={<Navigate to="/main" />} />
      </Routes>
    </>
  );
}

export default App;
