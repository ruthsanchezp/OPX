import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function EditClientForm({ clientId }) {
  const [client, setClient] = useState({
    first_name: "",
    last_name: "",
    id_fiscal: "",
    agreement_type: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    birth_date: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (clientId) {
      axios
        .get(`http://localhost:3001/clients/${clientId}`)
        .then((response) => {
          setClient(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching client:", error);
          setLoading(false);
        });
    }
  }, [clientId]);

  const handleChange = (e) => {
    setClient({ ...client, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await axios.put(`http://localhost:3001/clients/${clientId}`, client);
      setMessage({ type: "success", text: "Client updated successfully!" });
      setTimeout(() => {
        setMessage(null);
        router.push(`/clients/${clientId}`); // Redirige después de guardar
      }, 2000);
    } catch (error) {
      console.error("Error updating client:", error);
      setMessage({ type: "danger", text: "Error updating client. Try again." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center">Loading...</div>;

  return (
    <div className="card p-4 shadow-sm">
      <h2 className="text-center mb-3">Edit Client</h2>

      {message && (
        <div className={`alert alert-${message.type} text-center`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">First Name:</label>
            <input
              type="text"
              className="form-control"
              name="first_name"
              value={client.first_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Last Name:</label>
            <input
              type="text"
              className="form-control"
              name="last_name"
              value={client.last_name || ""}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">ID Fiscal:</label>
            <input
              type="text"
              className="form-control"
              name="id_fiscal"
              value={client.id_fiscal}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Convenio:</label>
            <input
              type="text"
              className="form-control"
              name="agreement_type"
              value={client.agreement_type || ""}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Email:</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={client.email || ""}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Phone:</label>
            <input
              type="text"
              className="form-control"
              name="phone"
              value={client.phone || ""}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Address:</label>
            <input
              type="text"
              className="form-control"
              name="address"
              value={client.address || ""}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">City:</label>
            <input
              type="text"
              className="form-control"
              name="city"
              value={client.city || ""}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Birth Date:</label>
            <input
              type="date"
              className="form-control"
              name="birth_date"
              value={client.birth_date ? client.birth_date.split("T")[0] : ""}
              onChange={handleChange}
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary w-100" disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
