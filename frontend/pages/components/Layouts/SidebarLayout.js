import { useState } from "react";
import Link from "next/link";

export default function SidebarLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isClientOpen, setIsClientOpen] = useState(false);
  const [isAgreementOpen, setIsAgreementOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleAdmin = () => setIsAdminOpen(!isAdminOpen);
  const toggleClient = () => setIsClientOpen(!isClientOpen);
  const toggleAgreement = () => setIsAgreementOpen(!isAgreementOpen);

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
            className="btn btn-light w-100"
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
          <h1 className="text-xl font-bold mb-4">Logo</h1>
          <ul className="list-unstyled" style={{ listStyle: "none", paddingLeft: 0 }}>
            {/* Sección Administración */}
            <li>
              <div className="text-white text-start p-0 mb-2" onClick={toggleAdmin} style={{ cursor: "pointer" }}>
                Administración {isAdminOpen ? "▲" : "▼"}
              </div>
              {isAdminOpen && (
                <ul className="pl-3" style={{ listStyle: "none", paddingLeft: "15px" }}>
                  <li className="mb-2" style={{ marginLeft: "10px" }}>
                    <Link href="/users" className="text-white text-decoration-none">
                      Listar usuarios
                    </Link>
                  </li>
                  <li style={{ marginLeft: "10px" }}>
                    <Link href="/users/create" className="text-white text-decoration-none">
                      Crear usuario
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            <li className="mt-4"></li>

            {/* Sección Clientes */}
            <li>
              <div className="text-white text-start p-0 mb-2" onClick={toggleClient} style={{ cursor: "pointer" }}>
                Clientes {isClientOpen ? "▲" : "▼"}
              </div>
              {isClientOpen && (
                <ul className="pl-3" style={{ listStyle: "none", paddingLeft: "15px" }}>
                  <li className="mb-2" style={{ marginLeft: "10px" }}>
                    <Link href="/clients" className="text-white text-decoration-none">
                      Listar Clientes
                    </Link>
                  </li>
                  <li style={{ marginLeft: "10px" }}>
                    <Link href="/clients/create" className="text-white text-decoration-none">
                      Crear Cliente
                    </Link>
                  </li>
                  <li className="mt-4"></li>
                  {/* 🔹 Nueva Sección: Órdenes Médicas */}
                  <li className="mb-2" style={{ marginLeft: "10px" }}>
                    <Link href="/medical-orders" className="text-white text-decoration-none">
                      Listar Órdenes
                    </Link>
                  </li>
                  <li style={{ marginLeft: "10px" }}>
                    <Link href="/medical-orders/create" className="text-white text-decoration-none">
                      Crear Orden
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            <li className="mt-4"></li>

            {/* Sección Convenios */}
            <li>
              <div className="text-white text-start p-0 mb-2" onClick={toggleAgreement} style={{ cursor: "pointer" }}>
                Convenios {isAgreementOpen ? "▲" : "▼"}
              </div>
              {isAgreementOpen && (
                <ul className="pl-3" style={{ listStyle: "none", paddingLeft: "15px" }}>
                  <li className="mb-2" style={{ marginLeft: "10px" }}>
                    <Link href="/agreements" className="text-white text-decoration-none">
                      Listar Convenios
                    </Link>
                  </li>
                  <li style={{ marginLeft: "10px" }}>
                    <Link href="/agreements/create" className="text-white text-decoration-none">
                      Crear Convenio
                    </Link>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </div>

        {/* Contenido principal */}
        <div
          className="col"
          style={{
            marginLeft: isSidebarOpen ? "314px" : "64px",
            transition: "margin-left 0.3s",
          }}
        >
          <div className="p-4 bg-light">{children}</div>
        </div>
      </div>
    </div>
  );
}
