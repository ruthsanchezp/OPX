import { useEffect, useState } from "react"; 
import axios from "axios";
import { useRouter } from "next/router";

export default function EditMedicalOrder() {
  const router = useRouter();
  const { id } = router.query;
  const [order, setOrder] = useState(null);
  const [technologists, setTechnologists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:3001/medical-orders/${id}`)
        .then((response) => {
          const fetchedOrder = response.data;

          // ✅ Asegurar que graduations y graduationsNear existan y se mantengan
          setOrder({
            ...fetchedOrder,
            graduations: fetchedOrder.graduations?.length
              ? fetchedOrder.graduations
              : [
                  { eye: "O.D", SPH: 0, CYL: 0, EJE: 0, DP: 0 },
                  { eye: "O.I", SPH: 0, CYL: 0, EJE: 0, DP: 0 },
                ],
            graduationsNear: fetchedOrder.graduationsNear?.length
              ? fetchedOrder.graduationsNear
              : [
                  { eye: "O.D", SPH: 0, CYL: 0, EJE: 0, DP: 0 },
                  { eye: "O.I", SPH: 0, CYL: 0, EJE: 0, DP: 0 },
                ],
            observaciones: fetchedOrder.observaciones || "",
            cristales: fetchedOrder.cristales || "",
          });

          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching medical order:", error);
          setLoading(false);
        });
    }

    axios
      .get("http://localhost:3001/users?role=technologist")
      .then((response) => setTechnologists(response.data))
      .catch((error) => console.error("Error fetching technologists:", error));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Convertir valores a Float antes de enviar
    const updatedOrder = {
      ...order,
      graduations: order.graduations.map((grad) => ({
        ...grad,
        SPH: parseFloat(grad.SPH) || 0,
        CYL: parseFloat(grad.CYL) || 0,
        EJE: parseFloat(grad.EJE) || 0,
        DP: parseFloat(grad.DP) || 0,
      })),
      graduationsNear: order.graduationsNear.map((grad) => ({
        ...grad,
        SPH: parseFloat(grad.SPH) || 0,
        CYL: parseFloat(grad.CYL) || 0,
        EJE: parseFloat(grad.EJE) || 0,
        DP: parseFloat(grad.DP) || 0,
      })),
    };

    try {
      await axios.put(`http://localhost:3001/medical-orders/${id}`, updatedOrder);
      setSuccessMessage("Medical Order updated successfully!");
      setTimeout(() => router.push("/medical-orders"), 2000);
    } catch (error) {
      console.error("Error updating medical order:", error);
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Edit Medical Order</h1>
      {successMessage && <div className="alert alert-success">{successMessage}</div>}

      {order && (
        <form onSubmit={handleSubmit}>
          {/* Cliente (Solo lectura) */}
          <div className="mb-3">
            <label className="form-label">Client</label>
            <input type="text" className="form-control" value={`${order.client.first_name} ${order.client.last_name}`} readOnly />
          </div>

          {/* Tecnólogo Médico */}
          <div className="mb-3">
            <label className="form-label">Medical Technologist</label>
            <select
              className="form-control"
              value={order.created_by}
              onChange={(e) => setOrder({ ...order, created_by: e.target.value })}
              required
            >
              <option value="">Select a Technologist</option>
              {technologists.map((tech) => (
                <option key={tech.id} value={tech.id}>
                  {tech.name}
                </option>
              ))}
            </select>
          </div>

          {/* 🔹 Tabla de Lentes de Lejos */}
          <h3>Lentes de Lejos</h3>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Eye</th>
                <th>SPH</th>
                <th>CYL</th>
                <th>EJE</th>
                <th>DP</th>
              </tr>
            </thead>
            <tbody>
              {order.graduations.map((grad, index) => (
                <tr key={index}>
                  <td>{grad.eye}</td>
                  {["SPH", "CYL", "EJE", "DP"].map((field) => (
                    <td key={field}>
                      <input
                        type="number"
                        step="0.01"
                        className="form-control"
                        value={grad[field]}
                        onChange={(e) => {
                          const grads = [...order.graduations];
                          grads[index][field] = parseFloat(e.target.value) || 0;
                          setOrder({ ...order, graduations: grads });
                        }}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {/* 🔹 Tabla de Lentes de Cerca */}
          <h3>Lentes de Cerca</h3>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Eye</th>
                <th>SPH</th>
                <th>CYL</th>
                <th>EJE</th>
                <th>DP</th>
              </tr>
            </thead>
            <tbody>
              {order.graduationsNear.map((grad, index) => (
                <tr key={index}>
                  <td>{grad.eye}</td>
                  {["SPH", "CYL", "EJE", "DP"].map((field) => (
                    <td key={field}>
                      <input
                        type="number"
                        step="0.01"
                        className="form-control"
                        value={grad[field]}
                        onChange={(e) => {
                          const grads = [...order.graduationsNear];
                          grads[index][field] = parseFloat(e.target.value) || 0;
                          setOrder({ ...order, graduationsNear: grads });
                        }}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Observaciones */}
          <div className="mb-3">
            <label className="form-label">Observaciones</label>
            <textarea className="form-control" value={order.observaciones} onChange={(e) => setOrder({ ...order, observaciones: e.target.value })} />
          </div>

          {/* Cristales */}
          <div className="mb-3">
            <label className="form-label">Cristales</label>
            <input type="text" className="form-control" value={order.cristales} onChange={(e) => setOrder({ ...order, cristales: e.target.value })} />
          </div>

          <button type="submit" className="btn btn-primary w-100">Save Changes</button>
        </form>
      )}
    </div>
  );
}
