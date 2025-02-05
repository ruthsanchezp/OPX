import { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button, Alert } from "react-bootstrap";
import { useRouter } from "next/router";
import Link from "next/link";

export default function ListClients() {
  const [clients, setClients] = useState([]);
  const [sortedField, setSortedField] = useState("client_id"); // Ordenar por ID por defecto
  const [sortOrder, setSortOrder] = useState("desc"); // Orden descendente por defecto
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get("http://localhost:3001/clients");
        const sortedData = response.data.sort((a, b) => b.client_id - a.client_id); // Ordena DESC al inicio
        setClients(sortedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching clients:", error);
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const handleSort = (field) => {
    const order = sortedField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortedField(field);
    setSortOrder(order);

    const sortedClients = [...clients].sort((a, b) => {
      let aValue = a[field];
      let bValue = b[field];

      if (aValue == null) aValue = "";
      if (bValue == null) bValue = "";

      if (typeof aValue === "string") aValue = aValue.toLowerCase();
      if (typeof bValue === "string") bValue = bValue.toLowerCase();

      return order === "asc" ? (aValue > bValue ? 1 : -1) : (aValue < bValue ? 1 : -1);
    });

    setClients(sortedClients);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:3001/clients/${selectedClientId}`);
      setClients(clients.filter((client) => client.client_id !== selectedClientId));
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    } catch (error) {
      console.error("Error deleting client:", error);
    } finally {
      setShowModal(false);
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">List of Clients</h1>

      {showAlert && (
        <Alert variant="success" className="text-center">
          Client deleted successfully!
        </Alert>
      )}

      <div className="table-responsive bg-white shadow-sm rounded p-3">
        <table className="table table-bordered table-hover custom-table">
          <thead>
            <tr>
              {[
                { label: "ID", field: "client_id" },
                { label: "First Name", field: "first_name" },
                { label: "Last Name", field: "last_name" },
                { label: "ID Fiscal", field: "id_fiscal" },
                { label: "Email", field: "email" },
                { label: "Agreement Type", field: "agreement_type" }
              ].map(({ label, field }) => (
                <th key={field} onClick={() => handleSort(field)} style={{ cursor: "pointer" }}>
                  {label} {sortedField === field && (sortOrder === "asc" ? "▲" : "▼")}
                </th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.length > 0 ? (
              clients.map((client) => (
                <tr key={client.client_id}>
                  <td>{client.client_id}</td>
                  <td>
                    <Link href={`/clients/${client.client_id}`} className="text-decoration-none">
                      {client.first_name} {client.last_name}
                    </Link>
                  </td>
                  <td>{client.last_name || "N/A"}</td>
                  <td>{client.id_fiscal}</td>
                  <td>{client.email || "N/A"}</td>
                  <td>{client.agreement_type || "N/A"}</td>
                  <td>
                    <button
                      onClick={() => router.push(`/clients/edit/${client.client_id}`)}
                      className="btn btn-primary btn-sm me-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setSelectedClientId(client.client_id);
                        setShowModal(true);
                      }}
                      className="btn btn-danger btn-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  No clients found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this client? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
