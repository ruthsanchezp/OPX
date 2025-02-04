import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function CreateMedicalOrder({clientId, onRedirect }) {
  const router = useRouter();
  const [technologists, setTechnologists] = useState([]);
  const [searchRut, setSearchRut] = useState("");
  const [selectedClient, setSelectedClient] = useState(null);
  const [error, setError] = useState(null);
  const [order, setOrder] = useState({
    client_id: clientId || "", // ✅ Usa el clientId si está disponible
    created_by: "",
    created_at: new Date().toISOString(),
    graduations: [
      { eye: "O.D", SPH: "", CYL: "", EJE: "", DP: "" },
      { eye: "O.I", SPH: "", CYL: "", EJE: "", DP: "" },
    ],
    graduationsNear: [
      { eye: "O.D", SPH: "", CYL: "", EJE: "", DP: "" },
      { eye: "O.I", SPH: "", CYL: "", EJE: "", DP: "" },
    ],
    observaciones: "",
    cristales: "",
  });

// 1️⃣ Cargar tecnólogos médicos al montar el componente
useEffect(() => {
  axios.get("http://localhost:3001/users?role=technologist").then((response) => {
    setTechnologists(response.data);
  });
}, []);

// 2️⃣ Cargar automáticamente los datos del cliente si hay un `clientId` en la URL
useEffect(() => {
  if (clientId) {
    axios
      .get(`http://localhost:3001/clients/${clientId}`)
      .then((response) => {
        setSelectedClient(response.data);
        setSearchRut(response.data.id_fiscal); // ✅ Rellenar automáticamente el campo del RUT
        setOrder((prevOrder) => ({
          ...prevOrder,
          client_id: response.data.client_id,
        }));
      })
      .catch((error) => {
        setError("Error fetching client details.");
        console.error("Error fetching client:", error);
      });
  }
}, [clientId]);

// ✅ Función para calcular la edad del cliente
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


  const handleRutKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      fetchClientByRut();
    }
  };

  // ✅ Definir la función `fetchClientByRut`
const fetchClientByRut = async () => {
  if (searchRut.trim().length > 0) {
    try {
      const response = await axios.get(`http://localhost:3001/clients/search/${searchRut}`);
      setSelectedClient(response.data);
      setOrder((prevOrder) => ({
        ...prevOrder,
        client_id: response.data.client_id,
      }));
      setError(null);
    } catch (error) {
      setError(error.response?.status === 404 ? "El cliente con ese RUT no existe." : "Error al buscar el cliente.");
      setSelectedClient(null);
    }
  }
};


  useEffect(() => {
    const delayDebounceFn = setTimeout(fetchClientByRut, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchRut]);

  const handleGraduationChange = (type, index, field, value) => {
    setOrder((prevOrder) => {
      const updatedGraduations = [...prevOrder[type]];
      updatedGraduations[index] = {
        ...updatedGraduations[index],
        [field]: value !== "" ? parseFloat(value) : "",
      };
      return { ...prevOrder, [type]: updatedGraduations };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!order.client_id) {
      alert("No se ha seleccionado un cliente válido.");
      return;
    }

    const formattedOrder = {
      ...order,
      graduations: order.graduations.map((grad) => ({
        eye: grad.eye,
        SPH: grad.SPH !== "" ? parseFloat(grad.SPH) : 0, 
        CYL: grad.CYL !== "" ? parseFloat(grad.CYL) : 0, 
        EJE: grad.EJE !== "" ? parseFloat(grad.EJE) : 0, 
        DP: grad.DP !== "" ? parseFloat(grad.DP) : 0,
      })),
      graduationsNear: order.graduationsNear.map((grad) => ({
        eye: grad.eye,
        SPH: grad.SPH !== "" ? parseFloat(grad.SPH) : 0, 
        CYL: grad.CYL !== "" ? parseFloat(grad.CYL) : 0, 
        EJE: grad.EJE !== "" ? parseFloat(grad.EJE) : 0, 
        DP: grad.DP !== "" ? parseFloat(grad.DP) : 0,
      })),
      observaciones: order.observaciones.trim(),
      cristales: order.cristales.trim(),
    };

    console.log("📤 Enviando datos al backend:", formattedOrder);
    try {
      await axios.post("http://localhost:3001/medical-orders", formattedOrder);
      alert("¡Orden médica creada con éxito!");
      if (onRedirect) {
        onRedirect(); // ✅ Usa la redirección personalizada si está en el perfil del cliente
      } else {
        router.push("/medical-orders"); // 🔹 Redirección normal si no está en perfil cliente
      }
    } catch (error) {
      console.error("❌ Error al crear la orden:", error);
    }
    
  };
  const handleDeleteConfirm = async () => {
    if (orderToDelete) {
      const orderId = Number(orderToDelete.order_id); // ✅ Asegurar que sea número
      if (isNaN(orderId)) {
        console.error("❌ Error: order_id is not a valid number", orderToDelete.order_id);
        return;
      }
  
      try {
        const response = await axios.delete(`http://localhost:3001/medical-orders/${orderId}`);
        if (response.status === 200) {
          setOrders(orders.filter((order) => order.order_id !== orderId));
          setDeleteSuccess("✔️ Medical order deleted successfully.");
          setDeleteError(null);
        }
      } catch (error) {
        console.error("❌ Error deleting medical order:", error);
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
      <h1 className="text-center mb-4">Crear Orden Médica</h1>
      
      <form onSubmit={handleSubmit}>
      <div className="mb-3">
  <label className="form-label">Buscar por RUT (ID Fiscal)</label>
  <input
    type="text"
    className="form-control"
    value={searchRut} // ✅ Muestra el ID Fiscal automáticamente
    onChange={(e) => setSearchRut(e.target.value)}
    onKeyDown={handleRutKeyDown}
    placeholder="Ingrese el RUT y presione Enter"
    required
    disabled={!!selectedClient} // ✅ Bloquea edición si ya hay cliente seleccionado
  />
</div>


        {error && <p className="text-danger">{error}</p>}

        {selectedClient && (
          <div className="mb-3 d-flex align-items-center">
            <div style={{ flex: 3, marginRight: "10px" }}>
              <label className="form-label">Cliente</label>
              <input type="text" className="form-control" value={`${selectedClient.first_name} ${selectedClient.last_name}`} readOnly />
            </div>
            <div style={{ flex: 1 }}>
              <label className="form-label">Edad</label>
              <input type="text" className="form-control" value={calculateAge(selectedClient.birth_date)} readOnly />
            </div>
          </div>
        )}

        <div className="mb-3">
          <label className="form-label">Tecnólogo Médico</label>
          <select className="form-control" value={order.created_by} onChange={(e) => setOrder({ ...order, created_by: e.target.value })} required>
            <option value="">Seleccione un Tecnólogo</option>
            {technologists.map((tech) => (
              <option key={tech.id} value={tech.id}>{tech.name}</option>
            ))}
          </select>
        </div>

        <h3>Lentes de Lejos</h3>
        <table className="table">
          <tbody>
            {order.graduations.map((grad, index) => (
              <tr key={index}>
                <td>{grad.eye}</td>
                {["SPH", "CYL", "EJE", "DP"].map((field) => (
                  <td key={field}>
                    <input type="number" className="form-control" value={grad[field]} onChange={(e) => handleGraduationChange("graduations", index, field, e.target.value)} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <h3>Lentes de Cerca</h3>
        <table className="table">
          <tbody>
            {order.graduationsNear.map((grad, index) => (
              <tr key={index}>
                <td>{grad.eye}</td>
                {["SPH", "CYL", "EJE", "DP"].map((field) => (
                  <td key={field}>
                    <input type="number" className="form-control" value={grad[field]} onChange={(e) => handleGraduationChange("graduationsNear", index, field, e.target.value)} />
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

        <button type="submit" className="btn btn-primary w-100">Crear Orden</button>
      </form>
    </div>
  );
}
