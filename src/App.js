import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Landing, Error, Register, ProtectedRoute } from "./pages/index";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Profile,
  AllJobs,
  AddJob,
  Stats,
  SharedLayout,
} from "./pages/dashboard/index";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* dashboard */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <SharedLayout />
            </ProtectedRoute>
          }
        >
          {/* uso index per mostrare la pagina Stats come prima pagina di SharedLayout */}
          <Route index element={<Stats />} />
          <Route path="all-jobs" element={<AllJobs />} />
          <Route path="add-job" element={<AddJob />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route path="landing" element={<Landing />} />
        <Route path="register" element={<Register />} />
        <Route path="*" element={<Error />} />
      </Routes>
      <ToastContainer position="top-center" />
    </BrowserRouter>
  );
}

export default App;
