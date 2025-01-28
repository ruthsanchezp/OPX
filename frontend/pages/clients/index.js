import { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button, Alert } from "react-bootstrap";
import { useRouter } from "next/router";

export default function ListClients() {
  const [clients, setClients] = useState([]); // Estado para almacenar los clientes
  const [loading, setLoading] = useState(true); // Estado de carga
  const [showModal, setShowModal] = useState(false); // Estado para mostrar el modal de confirmación
  const [selectedClientId, setSelectedClientId] = useState(null); // ID del cliente a eliminar
  const [showAlert, setShowAlert] = useState(false); // Estado para mostrar la alerta de eliminación
  const router = useRouter(); // Manejo de rutas con Next.js

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get("http://localhost:3001/clients"); // Llamada al backend
        setClients(response.data); // Guardar clientes en el estado
        setLoading(false); // Ocultar el cargador
      } catch (error) {
        console.error("Error fetching clients:", error);
        setLoading(false); // Ocultar el cargador en caso de error
      }
    };

    fetchClients(); // Llamar a la función para obtener clientes
  }, []);

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:3001/clients/${selectedClientId}`); // Llamada DELETE
      setClients(
        clients.filter((client) => client.client_id !== selectedClientId)
      ); // Actualizar la lista
      setShowAlert(true); // Mostrar alerta de éxito
      setTimeout(() => setShowAlert(false), 3000); // Ocultar alerta después de 3 segundos
    } catch (error) {
      console.error("Error deleting client:", error);
    } finally {
      setShowModal(false); // Cerrar el modal
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">List of Clients</h1>

      {/* Alerta de eliminación */}
      {showAlert && (
        <Alert variant="success" className="text-center">
          Client deleted successfully!
        </Alert>
      )}

      <div className="table-responsive bg-white shadow-sm rounded p-3">
        <table className="table table-bordered table-hover custom-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>ID Fiscal</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.length > 0 ? (
              clients.map((client) => (
                <tr key={client.client_id}>
                  <td>{client.client_id}</td>
                  <td>{client.first_name}</td>
                  <td>{client.last_name || "N/A"}</td>
                  <td>{client.id_fiscal}</td>
                  <td>{client.email || "N/A"}</td>
                  <td>
                    <button
                      onClick={() =>
                        router.push(`/clients/edit/${client.client_id}`)
                      }
                      className="btn btn-primary btn-sm me-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setSelectedClientId(client.client_id); // Configurar ID del cliente
                        setShowModal(true); // Mostrar el modal
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
                <td colSpan="6" className="text-center">
                  No clients found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de confirmación */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this client? This action cannot be
          undone.
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
