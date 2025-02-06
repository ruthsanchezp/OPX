import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { Table, Button, Form, Alert } from "react-bootstrap";
import ClientTabs from "../../../components/ClientTabs"; // ✅ Integrando la barra superior

export default function CreatePayment() {
  const router = useRouter();
  const { client_id } = router.query;
  const [payments, setPayments] = useState([]); 
  const [selectedPayment, setSelectedPayment] = useState(null); // ✅ Definir el pago seleccionado
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVariant, setAlertVariant] = useState("success");
  const [medicalOrders, setMedicalOrders] = useState([]);

  const fetchMedicalOrders = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/clients/${client_id}/medical-orders`);
      setMedicalOrders(response.data);
    } catch (error) {
      console.error("Error fetching medical orders:", error);
    }
  };

  const [formData, setFormData] = useState({
    client_id: client_id ? parseInt(client_id, 10) : 0,
    order_id: "",
    amount: 0,
    prepaid: 0,
    method: "",
    status: "PENDING",
    transaction_id: "",
    description: "",
    installments: 1,
    amount_per_installment: 0,
  });

  useEffect(() => {
    if (client_id) {
      fetchMedicalOrders();
      fetchPayments();
      setFormData((prevData) => ({
        ...prevData,
        client_id: parseInt(client_id, 10) || 0,
      }));
    }
  }, [client_id]);

  const fetchPayments = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/clients/${client_id}/payments`);
      setPayments(response.data);
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  };

  const handleAddPayment = async (installmentId) => {
    const amount = parseFloat(prompt("Enter the amount to pay:"));
    if (isNaN(amount) || amount <= 0) return alert("Invalid amount!");

    try {
      await axios.post(`http://localhost:3001/installments/${installmentId}/pay`, { amount });
      alert("Payment added successfully!");
      fetchPayments();
    } catch (error) {
      console.error("Error adding payment:", error);
      alert("Error processing payment.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (["amount", "prepaid", "installments", "client_id", "order_id"].includes(name)) {
      newValue = parseInt(value, 10) || 0;
    }

    const remainingAmount = formData.amount - formData.prepaid;
    const calculatedAmountPerInstallment = remainingAmount / (formData.installments || 1);

    setFormData({
      ...formData,
      [name]: newValue,
      amount_per_installment: calculatedAmountPerInstallment.toFixed(2),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.client_id || isNaN(formData.client_id)) {
      setAlertMessage("Error: Missing or invalid Client ID.");
      setAlertVariant("danger");
      setShowAlert(true);
      return;
    }

    try {
      const response = await axios.post("http://localhost:3001/payments", {
        ...formData,
        client_id: parseInt(formData.client_id, 10),
        order_id: formData.order_id ? parseInt(formData.order_id, 10) : null,
      });

      if (response.data.success === false) {
        // ✅ Mostrar el mensaje de error sin generar AxiosError
        setAlertMessage(response.data.message);
        setAlertVariant("warning");
        setShowAlert(true);
        return;
      }

      setAlertMessage("Payment created successfully!");
      setAlertVariant("success");
      setShowAlert(true);
      setTimeout(() => router.push(`/clients/${client_id}/payments`), 2000);
    } catch (error) {
      console.error("Error creating payment:", error);
      setAlertMessage("Error creating payment. Please try again.");
      setAlertVariant("danger");
      setShowAlert(true);
    }
  };


  return (
    <div className="container mt-4">
      <ClientTabs clientId={client_id} />

      <h1 className="text-center mb-4">Create Payment for Client {client_id}</h1>

      {showAlert && <Alert variant={alertVariant}>{alertMessage}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Description</Form.Label>
          <Form.Control
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Order ID</Form.Label>
          <Form.Control
            as="select"
            name="order_id"
            value={formData.order_id}
            onChange={handleChange}
          >
            <option value="">Select an order</option>
            {medicalOrders.map((order) => (
              <option key={order.order_id} value={order.order_id}>
                {`Order #${order.order_id}`}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group>
          <Form.Label>Total Amount</Form.Label>
          <Form.Control
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Prepaid</Form.Label>
          <Form.Control
            type="number"
            name="prepaid"
            value={formData.prepaid}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Payment Method</Form.Label>
          <Form.Control
            as="select"
            name="method"
            value={formData.method}
            onChange={handleChange}
            required
          >
            <option value="">Select a method</option>
            <option value="Cash">Efectivo</option>
            <option value="Transfer">Transferencia</option>
            <option value="Webpay">Webpay</option>
          </Form.Control>
        </Form.Group>

        <Form.Group>
          <Form.Label>Installments</Form.Label>
          <Form.Control
            type="number"
            name="installments"
            value={formData.installments}
            onChange={handleChange}
            min="1"
            required
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Amount Per Installment</Form.Label>
          <Form.Control type="text" value={formData.amount_per_installment} disabled />
        </Form.Group>

        <Button type="submit" className="mt-3">Create Payment</Button>
      </Form>


      <h2 className="text-center mt-5">Payment History</h2>

<Table striped bordered hover>
  <thead>
    <tr>
      <th>Medical Order ID</th> {/* ✅ Agregado */}
      <th>Installment #</th> {/* ✅ Nuevo campo para numerar cuotas */}
      <th>Due Date</th>
      <th>Amount</th>
      <th>Paid</th>
      <th>Status</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {payments.length > 0 ? (
      payments.flatMap((payment) =>
        payment.installments.map((installment, index) => ( // ✅ Enumerar cuotas
          <tr key={installment.installment_id}>
            <td>{payment.order_id ? `#${payment.order_id}` : "N/A"}</td> {/* ✅ Mostrar número de orden o 'N/A' */}
            <td>{index + 1}</td> {/* ✅ Enumerar cuotas automáticamente */}
            <td>{new Date(installment.due_date).toLocaleDateString()}</td>
            <td>${installment.amount.toFixed(2)}</td>
            <td>${installment.paid_amount?.toFixed(2) || 0}</td>
            <td>{installment.status}</td>
            <td>
              {installment.status === "PENDING" && (
                <Button variant="success" size="sm" onClick={() => handleAddPayment(installment.installment_id)}>
                  Add Payment
                </Button>
              )}
            </td>
          </tr>
        ))
      )
    ) : (
      <tr>
        <td colSpan="7" className="text-center">No installments found.</td>
      </tr>
    )}
  </tbody>
</Table>
    </div>
  );
}
