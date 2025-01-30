import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function EditAgreement() {
  const router = useRouter();
  const { id } = router.query; // Obtener el ID desde la URL
  const [agreement, setAgreement] = useState({
    agreement_type: "",
    start_date: "",
    end_date: "",
    status: "",
    total_installments: 0,
  });

  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (id) {
      const parsedId = parseInt(id, 10);
      if (!isNaN(parsedId)) {
        axios
          .get(`http://localhost:3001/agreements/${parsedId}`)
          .then((response) => {
            // Convertir fechas a formato "YYYY-MM-DD" para el input date
            const formattedAgreement = {
              ...response.data,
              start_date: response.data.start_date
                ? response.data.start_date.split("T")[0]
                : "",
              end_date: response.data.end_date
                ? response.data.end_date.split("T")[0]
                : "",
            };
            setAgreement(formattedAgreement);
            setLoading(false);
          })
          .catch((error) => {
            console.error("Error fetching agreement:", error);
            setLoading(false);
          });
      } else {
        console.error("Invalid ID provided");
        setLoading(false);
      }
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAgreement((prev) => ({
      ...prev,
      [name]: name.includes("date") ? new Date(value).toISOString() : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3001/agreements/${id}`, agreement);
      setSuccessMessage("Agreement updated successfully!");
      setTimeout(() => {
        router.push("/agreements");
      }, 2000);
    } catch (error) {
      console.error("Error updating agreement:", error);
      setErrorMessage("Failed to update agreement. Please try again.");
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Edit Agreement</h1>

      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

      <div className="card p-4 shadow-lg">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Agreement Type</label>
            <input
              type="text"
              name="agreement_type"
              value={agreement.agreement_type}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Start Date</label>
            <input
              type="date"
              name="start_date"
              value={agreement.start_date}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">End Date</label>
            <input
              type="date"
              name="end_date"
              value={agreement.end_date}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Status</label>
            <input
              type="text"
              name="status"
              value={agreement.status}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Total Installments</label>
            <input
              type="number"
              name="total_installments"
              value={agreement.total_installments}
              onChange={(e) =>
                setAgreement({
                  ...agreement,
                  total_installments: parseInt(e.target.value, 10),
                })
              }
              className="form-control"
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Update Agreement
          </button>
        </form>
      </div>
    </div>
  );
}
