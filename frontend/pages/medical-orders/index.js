import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import PrescriptionPDF from "../components/PrescriptionPDF";
import ModalConfirm from "../components/ModalConfirm"; // 📌 Importamos el modal
import ReactDOMServer from "react-dom/server";


export default function ListMedicalOrders() {
  const [orders, setOrders] = useState([]);
  const [sortedField, setSortedField] = useState("order_id"); // Ordenar por ID por defecto
  const [sortOrder, setSortOrder] = useState("desc"); // Orden descendente por defecto
  const [showModal, setShowModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const router = useRouter();

  useEffect(() => {
    axios.get("http://localhost:3001/medical-orders").then((response) => {
      const sortedData = response.data.sort((a, b) => b.order_id - a.order_id); // Ordena DESC al inicio
      setOrders(sortedData);
    });
  }, []);

  const handleSort = (field) => {
    const order = sortedField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortedField(field);
    setSortOrder(order);

    const sortedOrders = [...orders].sort((a, b) => {
      let aValue = a[field] || "";
      let bValue = b[field] || "";

      if (typeof aValue === "string") aValue = aValue.toLowerCase();
      if (typeof bValue === "string") bValue = bValue.toLowerCase();

      return order === "asc" ? (aValue > bValue ? 1 : -1) : (aValue < bValue ? 1 : -1);
    });

    setOrders(sortedOrders);
  };

  
  const handlePrintPdf = (order) => {
    if (!order || !order.client) return;
  
    // ✅ Obtener los datos del cliente
    const firstName = order.client.first_name.replace(/\s+/g, "_"); // Reemplaza espacios con "_"
    const lastName = order.client.last_name.replace(/\s+/g, "_");
    const idFiscal = order.client.id_fiscal;
  
    // ✅ Construye el nombre del archivo
    const fileName = `${firstName}_${lastName}_${idFiscal}.pdf`;
  
    // ✅ Crea un contenedor temporal en el DOM
    const pdfContainer = document.createElement("div");
    pdfContainer.style.position = "absolute";
    pdfContainer.style.left = "-9999px"; // Lo oculta de la pantalla
    document.body.appendChild(pdfContainer);
  
    // ✅ Inserta el contenido del PDF
    pdfContainer.innerHTML = `
      <div id="pdf-content">
        ${ReactDOMServer.renderToString(<PrescriptionPDF order={order} />)}
      </div>
    `;
  
    // ✅ Captura la imagen y genera el PDF
    setTimeout(() => {
      html2canvas(pdfContainer, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        pdf.addImage(imgData, "PNG", 10, 10, 190, 270);
        pdf.save(fileName); // 📌 Usa el nuevo nombre personalizado
  
        // ✅ Limpia el DOM eliminando el div temporal
        document.body.removeChild(pdfContainer);
      });
    }, 500);
  };
  

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Medical Orders</h1>

      <div className="table-responsive bg-white shadow-sm rounded p-3">
        <table className="table table-bordered table-hover custom-table">
          <thead>
            <tr>
              {[
                { label: "ID", field: "order_id" },
                { label: "Client", field: "clientName" },
                { label: "Agreement", field: "agreement" },
                { label: "Technologist", field: "createdBy" },
                { label: "Date", field: "created_at" },
              ].map(({ label, field }) => (
                <th key={field} onClick={() => handleSort(field)} style={{ cursor: "pointer" }}>
                  {label} {sortedField === field && (sortOrder === "asc" ? "▲" : "▼")}
                </th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.order_id}>
                <td>{order.order_id}</td>
                <td>{order.client?.first_name} {order.client?.last_name}</td>
                <td>{order.client?.agreement_type || "No Agreement"}</td>
                <td>{order.createdBy?.name}</td>
                <td>{new Date(order.created_at).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => router.push(`/medical-orders/edit/${order.order_id}`)} className="btn btn-primary btn-sm me-2">
                    Edit
                  </button>
                  <button onClick={() => handlePrintPdf(order)} className="btn btn-warning btn-sm me-2">
                    Print PDF
                  </button>
                  <button onClick={() => { setOrderToDelete(order); setShowModal(true); }} className="btn btn-danger btn-sm">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ModalConfirm
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={() => {}}
        title="Confirm Deletion"
        message="Are you sure you want to delete this medical order?"
      />
    </div>
  );
}
