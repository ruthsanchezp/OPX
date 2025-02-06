import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { Form, Button, Alert } from "react-bootstrap";

export default function CreateAgreement() {
  const router = useRouter();
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVariant, setAlertVariant] = useState("success");

  // 🔹 Estado para el formulario
  const [newAgreement, setNewAgreement] = useState({
    name: "",  // ✅ Agregado porque es obligatorio en tu schema
    agreement_type: "",
    start_date: "",
    end_date: "",
    status: "",
    total_installments: 0,
  });

  // 🔹 Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewAgreement({
      ...newAgreement,
      [name]: value,
    });
  };

  // 🔹 Enviar datos al backend
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!newAgreement.name) {
      setAlertMessage("Agreement name is required.");
      setAlertVariant("warning");
      setShowAlert(true);
      return;
    }
  
    try {
      await axios.post("http://localhost:3001/agreements", {
        ...newAgreement,
        total_installments: parseInt(newAgreement.total_installments, 10) || null, // 🔹 Convertir antes de enviar
      });
  
      setAlertMessage("Agreement created successfully!");
      setAlertVariant("success");
      setShowAlert(true);
      setTimeout(() => router.push("/agreements"), 2000);
    } catch (error) {
      console.error("Error creating agreement:", error);
      setAlertMessage("Failed to create agreement. Please check the form and try again.");
      setAlertVariant("danger");
      setShowAlert(true);
    }
  };
  

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Create Agreement</h1>

      {showAlert && <Alert variant={alertVariant}>{alertMessage}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Código</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={newAgreement.name}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Nombre Convenio</Form.Label>
          <Form.Control
            type="text"
            name="agreement_type"
            value={newAgreement.agreement_type}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Start Date</Form.Label>
          <Form.Control
            type="date"
            name="start_date"
            value={newAgreement.start_date}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>End Date</Form.Label>
          <Form.Control
            type="date"
            name="end_date"
            value={newAgreement.end_date}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Status</Form.Label>
          <Form.Control
            type="text"
            name="status"
            value={newAgreement.status}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Total Installments</Form.Label>
          <Form.Control
            type="number"
            name="total_installments"
            value={newAgreement.total_installments}
            onChange={handleChange}
            min="0"
          />
        </Form.Group>

        <Button type="submit" className="mt-3">Create Agreement</Button>
      </Form>
    </div>
  );
}
