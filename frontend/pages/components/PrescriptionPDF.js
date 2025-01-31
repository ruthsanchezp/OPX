import React from "react";
import { calculateAge } from "./calculateAge"; // 📌 Importamos la función

const PrescriptionPDF = ({ order }) => {
  if (!order) return null;

  // 📌 Función para calcular la edad desde la fecha de nacimiento
  const calculateAge = (birthDate) => {
    if (!birthDate) return "N/A";
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    if (today.getMonth() < birth.getMonth() || (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div 
      id={`receta-${order.order_id}`} 
      style={{
        width: "160mm",  
        height: "215mm", 
        padding: "10mm", 
        backgroundColor: "#fff",
        border: "0",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between"
      }}
    >
      {/* 🔹 Encabezado */}
      <div style={{ textAlign: "center", marginBottom: "5px" }}>
        <h3 style={{ margin: "0", fontSize: "14px" }}>OFTALMOLOGÍA</h3>
        <p style={{ margin: "0", fontSize: "10px" }}>Receta de Lentes Ópticos</p>
        <p style={{ margin: "0", fontSize: "10px" }}>Tenderini N°85 - Of.101 - Piso 10</p>
        <p style={{ margin: "0", fontSize: "10px" }}>Cel.: 9 7324 7900</p>
      </div>

 
      {/* 🔹 Datos del Paciente */}
      <div style={{ fontSize: "10px", marginBottom: "8px", display: "flex", justifyContent: "space-between" }}>
        <p><strong>Paciente:</strong> {order.client?.first_name} {order.client?.last_name}</p>
        <p><strong>Edad:</strong> {calculateAge(order.client?.birth_date)}</p> {/* ✅ Usamos la función aquí */}
        <p><strong>Rut:</strong> {order.client?.id_fiscal || "N/A"}</p>
        <p><strong>Fecha:</strong> {new Date(order.created_at).toLocaleDateString()}</p>
      </div>

      {/* 🔹 Tablas de Graduaciones */}
      <div style={{ fontSize: "9px", marginBottom: "10px" }}>
        <h4 style={{ fontSize: "10px", marginBottom: "5px" }}>Visión de Lejos</h4>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "9px" }}>
          <thead>
            <tr>
              {["Ojo", "SPH", "CYL", "EJE", "DP"].map((header) => (
                <th key={header} style={{ border: "1px solid black", padding: "3px" }}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {order.graduations?.map((grad, index) => (
              <tr key={index}>
                <td style={{ border: "1px solid black", padding: "3px" }}>{grad.eye}</td>
                <td style={{ border: "1px solid black", padding: "3px" }}>{grad.SPH}</td>
                <td style={{ border: "1px solid black", padding: "3px" }}>{grad.CYL}</td>
                <td style={{ border: "1px solid black", padding: "3px" }}>{grad.EJE}</td>
                <td style={{ border: "1px solid black", padding: "3px" }}>{grad.DP}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ fontSize: "9px", marginBottom: "10px" }}>
        <h4 style={{ fontSize: "10px", marginBottom: "5px" }}>Visión de Cerca</h4>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "9px" }}>
          <thead>
            <tr>
              {["Ojo", "SPH", "CYL", "EJE", "DP"].map((header) => (
                <th key={header} style={{ border: "1px solid black", padding: "3px" }}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {order.graduationsNear?.map((grad, index) => (
              <tr key={index}>
                <td style={{ border: "1px solid black", padding: "3px" }}>{grad.eye}</td>
                <td style={{ border: "1px solid black", padding: "3px" }}>{grad.SPH}</td>
                <td style={{ border: "1px solid black", padding: "3px" }}>{grad.CYL}</td>
                <td style={{ border: "1px solid black", padding: "3px" }}>{grad.EJE}</td>
                <td style={{ border: "1px solid black", padding: "3px" }}>{grad.DP}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🔹 Observaciones y Cristales */}
      <p style={{ fontSize: "9px", marginBottom: "5px" }}><strong>Observaciones:</strong> {order.observaciones || "N/A"}</p>
      <p style={{ fontSize: "9px", marginBottom: "5px" }}><strong>Cristales:</strong> {order.cristales || "N/A"}</p>

      {/* 🔹 Firma y Timbre */}
      <div style={{ textAlign: "center", marginTop: "10px" }}>
        <p style={{ fontSize: "9px", margin: "2px 0" }}>_____________________</p>
        <p style={{ fontSize: "9px", margin: "2px 0" }}>Firma y Timbre</p>
        <p style={{ fontSize: "8px", marginTop: "5px" }}>Sirvase traer la Receta, cuando consulte nuevamente al médico.</p>
      </div>
    </div>
  );
};

export default PrescriptionPDF;
