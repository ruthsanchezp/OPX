import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function EditClient() {
  const router = useRouter();
  const { id } = router.query; // Obtener el ID desde la URL
  const [client, setClient] = useState(null);
  const [agreements, setAgreements] = useState([]); // Lista de convenios disponibles
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (id) {
      const parsedId = parseInt(id, 10);
      if (!isNaN(parsedId)) {
        axios
          .get(`http://localhost:3001/clients/${parsedId}`)
          .then((response) => {
            setClient(response.data);
            setLoading(false);
          })
          .catch((error) => {
            console.error("Error fetching client data:", error);
            setLoading(false);
          });
      } else {
        console.error("Invalid ID provided");
        setLoading(false);
      }
    }

    // Obtener lista de convenios (agreements) desde la API
    axios
      .get("http://localhost:3001/agreements")
      .then((response) => setAgreements(response.data))
      .catch((error) => console.error("Error fetching agreements:", error));
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!client.agreement_type || client.agreement_type.trim() === "") {
      console.error("Agreement type is required");
      return;
    }

    axios
      .put(`http://localhost:3001/clients/${id}`, client)
      .then(() => {
        setSuccessMessage("Client updated successfully!");
        setTimeout(() => router.push("/clients"), 2000);
      })
      .catch((error) => {
        console.error("Error updating client:", error);
      });
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Edit Client</h1>
      {successMessage && <div className="alert alert-success">{successMessage}</div>}

      {client && (
        <form onSubmit={handleSubmit}>
          <div className="mb-3 row">
            <label htmlFor="first_name" className="col-sm-2 col-form-label">First Name:</label>
            <div className="col-sm-10">
              <input type="text" id="first_name" value={client.first_name}
                onChange={(e) => setClient({ ...client, first_name: e.target.value })}
                className="form-control" />
            </div>
          </div>

          <div className="mb-3 row">
            <label htmlFor="last_name" className="col-sm-2 col-form-label">Last Name:</label>
            <div className="col-sm-10">
              <input type="text" id="last_name" value={client.last_name || ""}
                onChange={(e) => setClient({ ...client, last_name: e.target.value })}
                className="form-control" />
            </div>
          </div>

          <div className="mb-3 row">
            <label htmlFor="id_fiscal" className="col-sm-2 col-form-label">ID Fiscal:</label>
            <div className="col-sm-10">
              <input type="text" id="id_fiscal" value={client.id_fiscal}
                onChange={(e) => setClient({ ...client, id_fiscal: e.target.value })}
                className="form-control" />
            </div>
          </div>

          {/* 🔹 Campo de Convenio con SELECT */}
          <div className="mb-3 row">
            <label htmlFor="agreement_type" className="col-sm-2 col-form-label">Convenio</label>
            <div className="col-sm-10">
              <select
                id="agreement_type"
                value={client.agreement_type}
                onChange={(e) => setClient({ ...client, agreement_type: e.target.value })}
                className="form-control"
              >
                <option value={client.agreement_type}>{client.agreement_type} (Actual)</option>
                {agreements.map((agreement) => (
                  <option key={agreement.agreement_id} value={agreement.agreement_type}>
                    {agreement.agreement_type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-3 row">
            <label htmlFor="email" className="col-sm-2 col-form-label">Email:</label>
            <div className="col-sm-10">
              <input type="email" id="email" value={client.email || ""}
                onChange={(e) => setClient({ ...client, email: e.target.value })}
                className="form-control" />
            </div>
          </div>

          <div className="mb-3 row">
            <label htmlFor="phone" className="col-sm-2 col-form-label">Phone:</label>
            <div className="col-sm-10">
              <input type="text" id="phone" value={client.phone || ""}
                onChange={(e) => setClient({ ...client, phone: e.target.value })}
                className="form-control" />
            </div>
          </div>

          <div className="mb-3 row">
            <label htmlFor="address" className="col-sm-2 col-form-label">Address:</label>
            <div className="col-sm-10">
              <input type="text" id="address" value={client.address || ""}
                onChange={(e) => setClient({ ...client, address: e.target.value })}
                className="form-control" />
            </div>
          </div>

          <div className="mb-3 row">
            <label htmlFor="city" className="col-sm-2 col-form-label">City:</label>
            <div className="col-sm-10">
              <input type="text" id="city" value={client.city || ""}
                onChange={(e) => setClient({ ...client, city: e.target.value })}
                className="form-control" />
            </div>
          </div>

          <button type="submit" className="btn btn-primary">Save Changes</button>
        </form>
      )}
    </div>
  );
}
