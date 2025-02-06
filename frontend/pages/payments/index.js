import { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button, Form, Alert } from "react-bootstrap";

export default function PaymentsPage() {
  const [medicalOrders, setMedicalOrders] = useState([]);
  const [payments, setPayments] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVariant, setAlertVariant] = useState("success");
  const [clientError, setClientError] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);

  const [formData, setFormData] = useState({
    client_id: "",
    id_fiscal: "",
    order_id: "", // ✅ Puede quedar vacío
    prepaid: 0,
    method: "",
    status: "PENDING",
    transaction_id: "",
    quantity: 1,
    unit_price: 0.0,
    total_price: 0.0,
    description: "",
  });

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await axios.get("http://localhost:3001/payments");
      if (response.data && Array.isArray(response.data)) {
        setPayments(response.data);
      }
    } catch (error) {
      console.error("Error fetching payments");
    }
  };

  const fetchMedicalOrders = async (clientId) => {
    try {
      if (!clientId) return;
      const response = await axios.get(`http://localhost:3001/clients/${clientId}/medical-orders`);
      if (response.data && Array.isArray(response.data)) {
        setMedicalOrders(response.data);
      }
    } catch (error) {
      console.error("Error fetching medical orders");
    }
  };

  const handleClientSearch = (e) => {
    const idFiscal = e.target.value.toString();
    setFormData({ ...formData, id_fiscal: idFiscal });

    if (!idFiscal || idFiscal.length < 8) {
      setClientError("");
      setMedicalOrders([]);
      setFormData((prev) => ({ ...prev, client_id: "" }));
      return;
    }

    if (searchTimeout) clearTimeout(searchTimeout);

    setSearchTimeout(
      setTimeout(async () => {
        try {
          const response = await axios.get(`http://localhost:3001/clients/search/${idFiscal}`);
          if (response.data) {
            setClientError("");
            setFormData((prev) => ({
              ...prev,
              client_id: response.data.client_id,
            }));
            fetchMedicalOrders(response.data.client_id);
          } else {
            setClientError("No client found with this ID Fiscal.");
            setMedicalOrders([]);
            setFormData((prev) => ({ ...prev, client_id: "" }));
          }
        } catch (error) {
          if (error.response && error.response.status === 404) {
            setClientError("No client found with this ID Fiscal.");
          }
          setMedicalOrders([]);
          setFormData((prev) => ({ ...prev, client_id: "" }));
        }
      }, 500)
    );
  };

  const handleCreatePayment = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3001/payments", formData);
      setShowCreateModal(false);
      setAlertMessage("Payment saved successfully!");
      setAlertVariant("success");
      setShowAlert(true);
      fetchPayments();
      setTimeout(() => setShowAlert(false), 3000);
    } catch (error) {
      setAlertMessage("Error saving payment. Please try again.");
      setAlertVariant("danger");
      setShowAlert(true);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">List of Payments</h1>

      {showAlert && (
        <Alert variant={alertVariant} className="text-center">
          {alertMessage}
        </Alert>
      )}

      <Button onClick={() => setShowCreateModal(true)} className="mb-3">
        Create New Payment
      </Button>

      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create Payment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleCreatePayment}>
            <Form.Group>
              <Form.Label>ID Fiscal</Form.Label>
              <Form.Control
                type="text"
                required
                value={formData.id_fiscal}
                onChange={handleClientSearch}
                placeholder="Enter ID Fiscal"
              />
              {clientError && <div className="text-danger mt-1">{clientError}</div>}
            </Form.Group>

            {medicalOrders.length > 0 && (
              <Form.Group className="mt-3">
              <Form.Label>Medical Orders</Form.Label>
              <Form.Control
                as="select"
                name="order_id"
                value={formData.order_id}
                onChange={(e) => setFormData({ ...formData, order_id: parseInt(e.target.value, 10) || 0 })}
              >
                <option value="">Select an order</option>
                {medicalOrders.map(order => (
                  <option key={order.order_id} value={order.order_id}>
                    {`Order ID: ${order.order_id}`}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            
            )}

            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter payment description"
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="number"
                required
                name="amount"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Prepaid</Form.Label>
              <Form.Control
                type="number"
                required
                name="prepaid"
                value={formData.prepaid}
                onChange={(e) => setFormData({ ...formData, prepaid: parseFloat(e.target.value) || 0 })}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Method</Form.Label>
              <Form.Control
                type="text"
                required
                name="method"
                value={formData.method}
                onChange={(e) => setFormData({ ...formData, method: e.target.value })}
              />
            </Form.Group>

            <Button type="submit" className="mt-3">Create Payment</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
