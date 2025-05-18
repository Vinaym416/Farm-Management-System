import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [adminName, setAdminName] = useState("");

  useEffect(() => {
    const handlePopState = () => {
      navigate("/admin-login");
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);

  const handleSignOut = () => {
    navigate("/admin-login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex flex-col">
      <header
        className="flex justify-between items-center p-4 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://png.pngtree.com/thumb_back/fh260/background/20220313/pngtree-close-up-of-golden-paddy-field-taken-on-the-horizontal-plate-image_1001142.jpg')",
        }}
      >
        <h1 className="text-black text-2xl font-bold">Hi, {adminName || "Admin"}</h1>
        <h1 className="text-center text-black text-3xl mb-4 font-semibold">
          Welcome to the Admin Dashboard
        </h1>
        <button
          onClick={handleSignOut}
          className="bg-red-500 text-white p-2 rounded font-medium hover:bg-red-600 transition-all duration-300"
        >
          Sign Out
        </button>
      </header>

      <div className="flex-grow bg-cover bg-center">
        <main className="p-4 flex flex-col items-center gap-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              className="border-4 border-green-700 p-4 bg-white bg-opacity-90 rounded-lg shadow-lg flex flex-col items-center cursor-pointer hover:scale-105 transition-transform duration-300"
              onClick={() => navigate("/admin/add-plant")}
            >
              <img
                src="https://cdn-icons-png.flaticon.com/128/2303/2303716.png"
                alt="Add Plant"
                className="mb-2"
              />
              <span className="font-medium text-lg">Add Plant</span>
            </div>

            <div
              className="border-4 border-blue-700 p-4 bg-white bg-opacity-90 rounded-lg shadow-lg flex flex-col items-center cursor-pointer hover:scale-105 transition-transform duration-300"
              onClick={() => navigate("/admin/add-method")}
            >
              <img
                src="https://cdn-icons-png.flaticon.com/128/8898/8898495.png"
                alt="Add Method"
                className="mb-2"
              />
              <span className="font-medium text-lg">Add Method</span>
            </div>

            <div
              className="border-4 border-yellow-700 p-4 bg-white bg-opacity-90 rounded-lg shadow-lg flex flex-col items-center cursor-pointer hover:scale-105 transition-transform duration-300"
              onClick={() =>
                navigate("/Community/communitydash", {
                  state: { user: { name: "Admin", role: "admin" } },
                })
              }
            >
              <img
                src="https://cdn-icons-png.flaticon.com/128/3365/3365355.png"
                alt="Manage Community"
                className="mb-2"
              />
              <span className="font-medium text-lg">Manage Community</span>
            </div>

            <div
              className="border-4 border-orange-700 p-4 bg-white bg-opacity-90 rounded-lg shadow-lg flex flex-col items-center cursor-pointer hover:scale-105 transition-transform duration-300"
              onClick={() => navigate("/admin/mediance")}
            >
              <img
                src="https://cdn-icons-png.flaticon.com/128/2910/2910768.png"
                alt="Mediance"
                className="mb-2"
              />
              <span className="font-medium text-lg">Mediance</span>
            </div>

            <div
              className="border-4 border-purple-700 p-4 bg-white bg-opacity-90 rounded-lg shadow-lg flex flex-col items-center cursor-pointer hover:scale-105 transition-transform duration-300"
              onClick={() => navigate("/admin/helpdesk")}
            >
              <img
                src="https://cdn-icons-png.flaticon.com/128/17645/17645791.png"
                alt="Helpdesk"
                className="mb-2"
              />
              <span className="font-medium text-lg">Helpdesk</span>
            </div>
          </div>

          <div
            className="fixed bottom-4 right-4 w-16 h-16 bg-purple-700 rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 transition-transform duration-300"
            onClick={() => navigate("/admin/ai-assistant")}
          >
            <img
              src="https://cdn-icons-png.flaticon.com/128/14958/14958196.png"
              alt="AI Assistant"
              className="w-10 h-10"
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;