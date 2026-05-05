import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { organizationAPI, authService } from "../api/auth";

function VerifyOrganization() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [organizationData, setOrganizationData] = useState(null);

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setError("Invalid verification link. No token provided.");
        setLoading(false);
        return;
      }

      try {
        const data = await organizationAPI.verify(token);
        setOrganizationData(data);
        setError("");
      } catch (err) {
        setError(
          err.message ||
            "Invalid or expired verification link. Please create a new organization.",
        );
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="text-gray-600">Verifying organization...</div>
      </div>
    );
  }

  if (error) {
    const isAuthenticated = authService.isAuthenticated();
    const loginLink = `/login?redirect=/organizations/verify?token=${token}`;

    return (
      <div className="flex h-screen w-screen">
        <div className="flex w-[65%] h-screen bg-gray-100">
          <div className="flex flex-col items-center justify-center w-full">
            <h1 className="text-4xl font-bold text-gray-800">
              Verification Failed
            </h1>
            <p className="text-lg text-gray-600 mt-4">{error}</p>
            {!isAuthenticated ? (
              <Link
                to={loginLink}
                className="mt-4 text-blue-600 hover:underline"
              >
                Login to verify organization
              </Link>
            ) : (
              <Link
                to="/add-organization"
                className="mt-4 text-blue-600 hover:underline"
              >
                Create a new organization
              </Link>
            )}
          </div>
        </div>
        <div className="flex w-[35%] h-screen bg-white justify-center items-center">
          <Link
            to="/dashboard"
            className="text-sm text-blue-600 hover:underline"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen">
      <div className="flex w-[65%] h-screen bg-gray-100">
        <div className="flex flex-col items-center justify-center w-full">
          <h1 className="text-4xl font-bold text-gray-800 mt-20">
            Flyersoft Admin Panel
          </h1>
          <h1 className="text-4xl font-bold text-gray-800 mt-20">
            Organization Verified
          </h1>
          <p className="text-lg text-gray-600 mt-4">
            Your organization has been successfully verified!
          </p>
        </div>
      </div>
      <div className="flex w-[35%] h-screen bg-white justify-center items-center overflow-y-auto">
        <div className="bg-white p-8 rounded-lg w-[80%]">
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
            Success
          </h2>

          <div className="bg-green-50 border border-green-100 rounded-lg p-4 mb-6">
            <p className="text-green-800">
              <span className="font-semibold">Organization:</span>{" "}
              {organizationData?.organizationName}
            </p>
            <p className="text-green-800 mt-2">
              <span className="font-semibold">Contact Email:</span>{" "}
              {organizationData?.contactEmail}
            </p>
            {organizationData?.domain && (
              <p className="text-green-800 mt-2">
                <span className="font-semibold">Domain:</span>{" "}
                {organizationData?.domain}
              </p>
            )}
          </div>

          <p className="text-gray-600 mb-6 text-center">
            Your organization is now ready to use. You can manage it from your
            dashboard.
          </p>

          <Link
            to="/dashboard"
            className="w-full block text-center bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

export default VerifyOrganization;
