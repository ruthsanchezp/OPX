import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import PrescriptionPDF from "../components/PrescriptionPDF";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import ModalConfirm from "../components/ModalConfirm"; // 📌 Importamos el modal

export default function ListMedicalOrders() {
  const [orders, setOrders] = useState([]);
  const [deleteSuccess, setDeleteSuccess] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const router = useRouter();

  useEffect(() => {
    axios.get("http://localhost:3001/medical-orders").then((response) => {
      setOrders(response.data);
    });
  }, []);

  const handlePrintPdf = async (order) => {
    const input = document.getElementById(`receta-${order.order_id}`);

    if (!input) {
      console.error("No se encontró la receta para capturar.");
      return;
    }

    input.style.display = "block";
    await new Promise((resolve) => setTimeout(resolve, 500));

    html2canvas(input, {
      scale: 3,
      useCORS: true,
      backgroundColor: "#ffffff",
    })
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "letter",
        });

        pdf.addImage(imgData, "PNG", 10, 10, 400, 280, "", "FAST");
        pdf.save(`receta_${order.order_id}.pdf`);
      })
      .catch((error) => {
        console.error("Error generando el PDF:", error);
      })
      .finally(() => {
        input.style.display = "none";
      });
  };

  const handleDeleteConfirm = async () => {
    if (orderToDelete) {
      try {
        await axios.delete(`http://localhost:3001/medical-orders/${orderToDelete.order_id}`);
        setOrders(orders.filter((order) => order.order_id !== orderToDelete.order_id));
        setDeleteSuccess("✔️ Medical order deleted successfully.");
        setDeleteError(null);
      } catch (error) {
        setDeleteError("❌ Error deleting medical order. Please try again.");
        setDeleteSuccess(null);
      }

      setShowModal(false);
      setOrderToDelete(null);

      setTimeout(() => {
        setDeleteSuccess(null);
        setDeleteError(null);
      }, 3000);
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Medical Orders</h1>

      {deleteSuccess && <div className="alert alert-success text-center">{deleteSuccess}</div>}
      {deleteError && <div className="alert alert-danger text-center">{deleteError}</div>}

      <div className="table-responsive bg-white shadow-sm rounded p-3">
        <table className="table table-bordered table-hover custom-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Client</th>
              <th>Agreement</th>
              <th>Technologist</th>
              <th>Distance Graduation</th>
              <th>Near Graduation</th>
              <th>Observaciones</th>
              <th>Cristales</th>
              <th>Date</th>
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
                <td>
                  {order.graduations?.length > 0 ? (
                    order.graduations.map((grad, index) => (
                      <div key={index}>
                        {grad.eye}: SPH {grad.SPH}, CYL {grad.CYL}, EJE {grad.EJE}, DP {grad.DP}
                      </div>
                    ))
                  ) : (
                    "No Data"
                  )}
                </td>
                <td>
                  {order.graduationsNear?.length > 0 ? (
                    order.graduationsNear.map((grad, index) => (
                      <div key={index}>
                        {grad.eye}: SPH {grad.SPH}, CYL {grad.CYL}, EJE {grad.EJE}, DP {grad.DP}
                      </div>
                    ))
                  ) : (
                    "No Data"
                  )}
                </td>
                <td>{order.observaciones || "No Data"}</td>
                <td>{order.cristales || "No Data"}</td>
                <td>{new Date(order.created_at).toLocaleDateString()}</td>
                <td>
                  <button
                    onClick={() => router.push(`/medical-orders/edit/${order.order_id}`)}
                    className="btn btn-primary btn-sm me-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handlePrintPdf(order)}
                    className="btn btn-warning btn-sm me-2"
                  >
                    Print PDF
                  </button>
                  <button
                    onClick={() => {
                      setOrderToDelete(order);
                      setShowModal(true);
                    }}
                    className="btn btn-danger btn-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🔹 Usando el modal reutilizable */}
      <ModalConfirm
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleDeleteConfirm}
        title="Confirm Deletion"
        message="Are you sure you want to delete this medical order?"
      />

      {orders.map((order) => (
        <div key={order.order_id} id={`receta-${order.order_id}`} style={{ display: "none" }}>
          <PrescriptionPDF order={order} />
        </div>
      ))}
    </div>
  );
}
