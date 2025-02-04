// pages/clients/[client_id]/medical-orders.js
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import ClientTabs from "../../components/ClientTabs"; // 📌 Importa la barra de navegación

export default function ClientMedicalOrders() {
  const router = useRouter();
  const { client_id } = router.query; // 📌 Obtiene client_id desde la URL
  const [medicalOrders, setMedicalOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (client_id) {
      axios
        .get(`http://localhost:3001/clients/${client_id}/medical-orders`)
        .then((response) => {
          setMedicalOrders(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching medical orders:", error);
          setLoading(false);
        });
    }
  }, [client_id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-4">
      {/* 🔹 Barra superior con pestañas SIEMPRE visible */}
      <ClientTabs clientId={client_id} />

      <h1 className="text-center mb-4">Medical Orders for Client {client_id}</h1>

      {medicalOrders.length === 0 ? (
        <div className="alert alert-warning text-center">
          No medical orders found. <br />
          <a href={`/clients/${client_id}/medical-orders/create`} className="btn btn-primary mt-2">
            Create Medical Order
          </a>
        </div>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Observations</th>
              <th>Crystals</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {medicalOrders.map((order) => (
              <tr key={order.order_id}>
                <td>{order.order_id}</td>
                <td>{new Date(order.created_at).toLocaleDateString()}</td>
                <td>{order.observaciones || "N/A"}</td>
                <td>{order.cristales || "N/A"}</td>
                <td>
                  <a href={`/clients/${client_id}/medical-orders/edit/${order.order_id}`} className="btn btn-warning btn-sm">
                    Edit Order
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
