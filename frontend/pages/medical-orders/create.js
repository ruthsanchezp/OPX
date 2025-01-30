import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function CreateMedicalOrder() {
  const router = useRouter();
  const [technologists, setTechnologists] = useState([]);
  const [searchRut, setSearchRut] = useState(""); // Estado para buscar por RUT
  const [selectedClient, setSelectedClient] = useState(null); // Cliente seleccionado
  const [error, setError] = useState(null); // Estado para manejar el error

  const [order, setOrder] = useState({
    client_id: "",
    created_by: "",
    distanceGraduations: [
      { eye: "O.D", SPH: "", CYL: "", EJE: "", DP: "" },
      { eye: "O.I", SPH: "", CYL: "", EJE: "", DP: "" },
    ],
    nearGraduations: [
      { eye: "O.D", SPH: "", CYL: "", EJE: "", DP: "" },
      { eye: "O.I", SPH: "", CYL: "", EJE: "", DP: "" },
    ],
    observations: "",
    lenses: "",
  });

  useEffect(() => {
    axios.get("http://localhost:3001/users?role=technologist").then((response) => {
      setTechnologists(response.data);
    });
  }, []);

  // 🔹 Función para calcular la edad a partir de la fecha de nacimiento
  const calculateAge = (birthDate) => {
    if (!birthDate) return "";
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  // 🔹 Función para buscar cliente por RUT (id_fiscal)
  const fetchClientByRut = async () => {
    if (searchRut.trim().length > 0) {
      try {
        const response = await axios.get(`http://localhost:3001/clients/search/${searchRut}`);
        setSelectedClient(response.data);
        setOrder((prevOrder) => ({
          ...prevOrder,
          client_id: response.data.client_id,
        }));
        setError(null); // Limpiar mensaje de error si se encuentra un cliente
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setError("El cliente con ese RUT no existe.");
        } else {
          setError("Error al buscar el cliente. Inténtalo de nuevo.");
        }
        setSelectedClient(null);
      }
    }
  };

  // 🔹 Ejecutar búsqueda cuando se presione ENTER
  const handleRutKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      fetchClientByRut();
    }
  };

  // 🔹 Ejecutar búsqueda automáticamente después de escribir (con retraso)
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchClientByRut();
    }, 500); // Espera 500ms después de que el usuario deje de escribir

    return () => clearTimeout(delayDebounceFn);
  }, [searchRut]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3001/medical-orders", order);
      alert("Medical Order Created Successfully!");
      router.push("/medical-orders");
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Create Medical Order</h1>
      <form onSubmit={handleSubmit}>
        {/* 🔹 Campo de búsqueda por RUT */}
        <div className="mb-3">
          <label className="form-label">Buscar por RUT (ID Fiscal)</label>
          <input
            type="text"
            className="form-control"
            value={searchRut}
            onChange={(e) => setSearchRut(e.target.value)}
            onKeyDown={handleRutKeyDown}
            placeholder="Ingrese el RUT y presione Enter"
            required
          />
        </div>

        {/* 🔹 Mostrar error si el RUT no existe */}
        {error && <p className="text-danger">{error}</p>}

        {/* 🔹 Mostrar datos del cliente si se encuentra */}
        {selectedClient && (
          <div className="mb-3 d-flex align-items-center">
            <div style={{ flex: 3, marginRight: "10px" }}>
              <label className="form-label">Cliente</label>
              <input
                type="text"
                className="form-control"
                value={`${selectedClient.first_name} ${selectedClient.last_name}`}
                readOnly
              />
            </div>
            <div style={{ flex: 1 }}>
              <label className="form-label">Edad</label>
              <input
                type="text"
                className="form-control"
                value={calculateAge(selectedClient.birth_date)}
                readOnly
              />
            </div>
          </div>
        )}

        {/* Tecnólogo Médico */}
        <div className="mb-3">
          <label className="form-label">Tecnólogo Médico</label>
          <select
            className="form-control"
            value={order.created_by}
            onChange={(e) => setOrder({ ...order, created_by: e.target.value })}
            required
          >
            <option value="">Seleccione un Tecnólogo</option>
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
              <th>Ojo</th>
              <th>SPH</th>
              <th>CYL</th>
              <th>EJE</th>
              <th>DP</th>
            </tr>
          </thead>
          <tbody>
            {order.distanceGraduations.map((grad, index) => (
              <tr key={index}>
                <td>{grad.eye}</td>
                <td><input type="number" className="form-control" /></td>
                <td><input type="number" className="form-control" /></td>
                <td><input type="number" className="form-control" /></td>
                <td><input type="number" className="form-control" /></td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 🔹 Tabla de Lentes de Cerca */}
        <h3>Lentes de Cerca</h3>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Ojo</th>
              <th>SPH</th>
              <th>CYL</th>
              <th>EJE</th>
              <th>DP</th>
            </tr>
          </thead>
          <tbody>
            {order.nearGraduations.map((grad, index) => (
              <tr key={index}>
                <td>{grad.eye}</td>
                <td><input type="number" className="form-control" /></td>
                <td><input type="number" className="form-control" /></td>
                <td><input type="number" className="form-control" /></td>
                <td><input type="number" className="form-control" /></td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 🔹 Campos de Observaciones y Cristales */}
        <div className="mb-3">
          <label className="form-label">Observaciones</label>
          <textarea className="form-control" />
        </div>

        <div className="mb-3">
          <label className="form-label">Cristales</label>
          <input type="text" className="form-control" />
        </div>

        <button type="submit" className="btn btn-primary w-100">Crear Orden</button>
      </form>
    </div>
  );
}
