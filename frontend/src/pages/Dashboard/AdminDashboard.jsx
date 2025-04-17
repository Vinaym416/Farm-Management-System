import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [adminName, setAdminName] = useState("");

  useEffect(() => {
    // Get admin user data from localStorage
   

    const handlePopState = () => {
      navigate("/admin-login");
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);

  const handleSignOut = () => {
    // Clear admin data from localStorage
   
    navigate("/admin-login");
  };

  return (
    <div className="h-screen flex flex-col">
      <header
        className="flex justify-between items-center p-4 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://cdn.pixabay.com/photo/2017/08/06/07/33/field-2591506_1280.jpg')",
        }}
      >
        <h1 className="text-black text-2xl font-bold"></h1>
        <h1 className="text-center text-black text-3xl mb-4 font-semibold">
          Welcome to the Admin Dashboard
        </h1>
        <button
          onClick={handleSignOut}
          className="bg-red-500 text-white p-2 rounded font-medium"
        >
          Sign Out
        </button>
      </header>

      <div className="flex-grow bg-cover bg-center bg-opacity-100 bg-black">
        <main className="p-4 flex flex-col items-center h-full gap-20">
          <div className="grid grid-cols-3 gap-40">
            <div
              className="border-4 border-green-700 p-4 bg-white bg-opacity-90 rounded flex flex-col items-center cursor-pointer"
              onClick={() => navigate("/admin/add-plant")} // Navigate to AddMethod page
            >
              <img
                src="https://cdn-icons-png.flaticon.com/128/2303/2303716.png"
                alt="Add Plant"
                className="mb-2"
              />
              <span className="font-medium text-lg">Add Plant</span>
            </div>

            <div
              className="border-4 border-blue-700 p-4 bg-white bg-opacity-90 rounded flex flex-col items-center cursor-pointer"
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
              className="border-4 border-yellow-700 p-4 bg-white bg-opacity-90 rounded flex flex-col items-center cursor-pointer"
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
              className="border-4 border-orange-700 p-4 bg-white bg-opacity-90 rounded flex flex-col items-center cursor-pointer"
              onClick={() => navigate("/admin/mediance")} // Fixed the case to match the route
            >
              <img
                src="https://cdn-icons-png.flaticon.com/128/2910/2910768.png"
                alt="Mediance"
                className="mb-2"
              />
              <span className="font-medium text-lg">Mediance</span>
            </div>

            <div
              className="border-4 border-purple-700 p-4 bg-white bg-opacity-90 rounded flex flex-col items-center cursor-pointer"
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
            className="fixed bottom-4 right-4 w-20 h-20 bg-purple-700 rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 transition-transform duration-300"
            onClick={() => navigate("/admin/ai-assistant")}
          >
            <img
              src="https://cdn-icons-png.flaticon.com/128/14958/14958196.png"
              alt="AI Assistant"
              className="w-12 h-12"
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;