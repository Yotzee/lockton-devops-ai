import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/resources/auth";
import { Layout } from "@/components/Layout/Layout";
import { LoginPage } from "@/pages/LoginPage/LoginPage";
import { HomePage } from "@/pages/HomePage/HomePage";
import { ChatPage } from "@/pages/ChatPage/ChatPage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/chat" element={<ChatPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
