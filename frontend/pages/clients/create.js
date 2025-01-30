import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function CreateClient() {
  const router = useRouter();

  const [client, setClient] = useState({
    first_name: "",
    last_name: "",
    id_fiscal: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    birth_date: "",
    agreement_type: "", // Aquí se almacenará el convenio seleccionado
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [agreements, setAgreements] = useState([]); // Lista de convenios disponibles

  // Obtener convenios disponibles de la API
  useEffect(() => {
    axios
      .get("http://localhost:3001/agreements")
      .then((response) => {
        setAgreements(response.data);
      })
      .catch((error) => {
        console.error("Error fetching agreements:", error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Si se está modificando birth_date, convertirlo al formato requerido
    if (name === "birth_date" && value) {
      const formattedDate = new Date(value).toISOString();
      setClient((prevClient) => ({ ...prevClient, birth_date: formattedDate }));
    } else {
      setClient((prevClient) => ({ ...prevClient, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3001/clients", client);
      setSuccessMessage("Client created successfully!");
      setTimeout(() => {
        router.push("/clients");
      }, 2000);
    } catch (error) {
      console.error("Error creating client:", error);
      setErrorMessage("Failed to create client. Please try again.");
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Create Client</h1>

      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

      <div className="card p-4 shadow-lg">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">First Name</label>
            <input
              type="text"
              name="first_name"
              value={client.first_name}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Last Name</label>
            <input
              type="text"
              name="last_name"
              value={client.last_name}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">ID Fiscal</label>
            <input
              type="text"
              name="id_fiscal"
              value={client.id_fiscal}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          {/* Campo para seleccionar un convenio */}
          <div className="mb-3">
            <label className="form-label">Convenio</label>
            <select
              name="agreement_type"
              value={client.agreement_type}
              onChange={handleChange}
              className="form-control"
              required
            >
              <option value="">Seleccione un convenio</option>
              {agreements.map((agreement) => (
                <option key={agreement.agreement_id} value={agreement.agreement_type}>
                  {agreement.agreement_type}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Phone</label>
            <input
              type="text"
              name="phone"
              value={client.phone}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              value={client.email}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Address</label>
            <input
              type="text"
              name="address"
              value={client.address}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">City</label>
            <input
              type="text"
              name="city"
              value={client.city}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Birth Date</label>
            <input
              type="date"
              name="birth_date"
              value={client.birth_date.split("T")[0]} // Mostrar solo la parte de fecha
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Create Client
          </button>
        </form>
      </div>
    </div>
  );
}
