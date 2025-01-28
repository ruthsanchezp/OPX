import { useState } from "react";

export default function SidebarLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Botón de hamburguesa siempre visible */}
        <div
          className="text-white p-2"
          style={{
            backgroundColor: "#021859",
            width: "64px",
            position: "fixed",
            height: "100vh",
            zIndex: 10,
          }}
        >
          <button
            className="btn-hamburger"
            onClick={toggleSidebar}
            aria-label="Toggle Sidebar"
          >
            ☰
          </button>
        </div>

        {/* Sidebar desplegable */}
        <div
          className={`text-white vh-100 p-4 ${isSidebarOpen ? "d-block" : "d-none"}`}
          style={{
            backgroundColor: "#021859",
            position: "fixed",
            width: "250px",
            left: "64px",
            top: 0,
            zIndex: 9,
          }}
        >
          <h1 className="text-xl font-bold mb-4">Admin Dashboard</h1>
          <ul className="list-unstyled">
            <li className="mb-2">Opción 1</li>
            <li className="mb-2">Opción 2</li>
            <li className="mb-2">Opción 3</li>
            <li className="mb-2">Opción 4</li>
          </ul>
        </div>

        {/* Contenido principal */}
        <div
          className="col"
          style={{ marginLeft: isSidebarOpen ? "314px" : "64px", transition: "margin-left 0.3s" }}
        >
          <div className="p-4 bg-light">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
