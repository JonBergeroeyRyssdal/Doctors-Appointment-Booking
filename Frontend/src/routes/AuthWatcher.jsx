import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function AuthWatcher({ tokenName, redirectTo }) {
  const navigate = useNavigate();

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem(tokenName);

      if (!token) {
        return;
      }

      try {
        const decoded = jwtDecode(token);

        if (decoded.exp * 1000 <= Date.now()) {
          localStorage.removeItem(tokenName);

          navigate(redirectTo, {
            replace: true,
          });
        }
      } catch {
        localStorage.removeItem(tokenName);

        navigate(redirectTo, {
          replace: true,
        });
      }
    };

    // Check the token immediately when the component mounts
    checkToken();

    // Check the token every 10 seconds
    const interval = setInterval(checkToken, 10000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(interval);
  }, [navigate, tokenName, redirectTo]);

  return null;
}

export default AuthWatcher;
