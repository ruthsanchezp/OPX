import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function ListMedicalOrders() {
  const [orders, setOrders] = useState([]);
  const router = useRouter();

  useEffect(() => {
    axios.get("http://localhost:3001/medical-orders").then((response) => {
      setOrders(response.data);
    });
  }, []);

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this medical order?")) {
      await axios.delete(`http://localhost:3001/medical-orders/${id}`);
      setOrders(orders.filter((order) => order.order_id !== id));
    }
  };

  const handleDownloadPdf = (id) => {
    window.open(`http://localhost:3001/medical-orders/${id}/pdf`);
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Medical Orders</h1>

      <div className="table-responsive bg-white shadow-sm rounded p-3">
        <table className="table table-bordered table-hover custom-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Client</th>
              <th>Agreement</th> {/* Convenio del cliente */}
              <th>Technologist</th>
              <th>Distance Graduation</th> {/* Lentes de Lejos */}
              <th>Near Graduation</th> {/* Lentes de Cerca */}
              <th>Observaciones</th> {/* Observaciones */}
              <th>Cristales</th> {/* Cristales */}
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

                {/* 🔹 Lentes de Lejos */}
                <td>
                  {order.graduations?.length > 0 ? (
                    order.graduations.map((grad) => (
                      <div key={grad.graduation_id}>
                        {grad.eye}: SPH {grad.SPH}, CYL {grad.CYL}, EJE {grad.EJE}, DP {grad.DP}
                      </div>
                    ))
                  ) : (
                    "No Data"
                  )}
                </td>

                {/* 🔹 Lentes de Cerca */}
                <td>
                  {order.graduationsNear?.length > 0 ? (
                    order.graduationsNear.map((grad) => (
                      <div key={grad.graduation_near_id}>
                        {grad.eye}: SPH {grad.SPH}, CYL {grad.CYL}, EJE {grad.EJE}, DP {grad.DP}
                      </div>
                    ))
                  ) : (
                    "No Data"
                  )}
                </td>

                {/* 🔹 Observaciones */}
                <td>{order.observaciones || "No Data"}</td>

                {/* 🔹 Cristales */}
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
                    onClick={() => handleDownloadPdf(order.order_id)}
                    className="btn btn-warning btn-sm me-2"
                  >
                    PDF
                  </button>
                  <button
                    onClick={() => handleDelete(order.order_id)}
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
    </div>
  );
}
