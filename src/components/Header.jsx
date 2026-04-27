import { useNavigate } from "react-router-dom";
import { authAPI, authService } from "../api/auth";

function Header() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const refreshToken = authService.getRefreshToken();
      console.log("Refresh token:", refreshToken);
      if (refreshToken) {
        console.log("Calling logout API...");
        await authAPI.logout(refreshToken);
        console.log("Logout API called successfully");
      } else {
        console.warn("No refresh token found");
      }
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      authService.clearTokens();
      navigate("/login");
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-[60px] bg-[#1a73e8] text-white shadow-md z-[1000]">
      <div className="flex items-center justify-between h-full px-6 max-w-[1200px] mx-auto">
        <h1 className="text-xl font-semibold m-0">Admin Onboarding</h1>
        <button
          className="bg-transparent border border-white text-white px-4 py-2 rounded text-sm font-medium cursor-pointer transition-colors hover:bg-white/20"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default Header;
