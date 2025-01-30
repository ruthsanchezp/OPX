import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { Modal, Button, Alert } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

export default function ListAgreements() {
  const [agreements, setAgreements] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedAgreementId, setSelectedAgreementId] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const router = useRouter();

  // Obtener todos los acuerdos
  useEffect(() => {
    axios.get("http://localhost:3001/agreements").then((response) => {
      setAgreements(response.data);
    });
  }, []);

  // Eliminar un acuerdo
  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:3001/agreements/${selectedAgreementId}`);
      setAgreements(agreements.filter((agreement) => agreement.agreement_id !== selectedAgreementId));
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    } catch (error) {
      console.error("Error deleting agreement:", error);
    } finally {
      setShowModal(false);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Agreements</h1>

      {/* Alerta de eliminación */}
      {showAlert && (
        <Alert variant="success" className="text-center">
          Agreement deleted successfully!
        </Alert>
      )}

      <div className="table-responsive bg-white shadow-sm rounded p-3">
        <table className="table table-bordered table-hover custom-table">
          <thead className="thead-dark">
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
              <th>Total Installments</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {agreements.length > 0 ? (
              agreements.map((agreement) => (
                <tr key={agreement.agreement_id}>
                  <td>{agreement.agreement_id}</td>
                  <td>{agreement.agreement_type || "N/A"}</td>
                  <td>{agreement.start_date ? agreement.start_date.split("T")[0] : "N/A"}</td>
                  <td>{agreement.end_date ? agreement.end_date.split("T")[0] : "N/A"}</td>
                  <td>{agreement.status || "N/A"}</td>
                  <td>{agreement.total_installments || 0}</td>
                  <td>
                    <button
                      onClick={() => router.push(`/agreements/edit/${agreement.agreement_id}`)}
                      className="btn btn-primary btn-sm me-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setSelectedAgreementId(agreement.agreement_id);
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
                  No agreements found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de confirmación para eliminar */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this agreement? This action cannot be undone.</Modal.Body>
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
