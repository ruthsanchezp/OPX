import { useState } from "react";
import axios from "axios";

export default function CreateAgreement() {
  const [newAgreement, setNewAgreement] = useState({
    agreement_type: "",
    start_date: "",
    end_date: "",
    status: "",
    total_installments: 0,
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedAgreement = {
        ...newAgreement,
        start_date: newAgreement.start_date ? new Date(newAgreement.start_date).toISOString() : null,
        end_date: newAgreement.end_date ? new Date(newAgreement.end_date).toISOString() : null,
      };
  
      await axios.post("http://localhost:3001/agreements", formattedAgreement);
      setNewAgreement({
        agreement_type: "",
        start_date: "",
        end_date: "",
        status: "",
        total_installments: 0,
      });
      alert("Agreement created successfully!");
    } catch (error) {
      console.error("Error creating agreement:", error);
    }
  };
  

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Create Agreement</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Agreement Type</label>
          <input
            type="text"
            name="agreement_type"
            value={newAgreement.agreement_type}
            onChange={(e) =>
              setNewAgreement({ ...newAgreement, agreement_type: e.target.value })
            }
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Start Date</label>
          <input
            type="date"
            name="start_date"
            value={newAgreement.start_date}
            onChange={(e) =>
              setNewAgreement({ ...newAgreement, start_date: e.target.value })
            }
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">End Date</label>
          <input
            type="date"
            name="end_date"
            value={newAgreement.end_date}
            onChange={(e) =>
              setNewAgreement({ ...newAgreement, end_date: e.target.value })
            }
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Status</label>
          <input
            type="text"
            name="status"
            value={newAgreement.status}
            onChange={(e) =>
              setNewAgreement({ ...newAgreement, status: e.target.value })
            }
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Total Installments</label>
          <input
            type="number"
            name="total_installments"
            value={newAgreement.total_installments}
            onChange={(e) =>
              setNewAgreement({
                ...newAgreement,
                total_installments: parseInt(e.target.value, 10),
              })
            }
            className="form-control"
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Create Agreement
        </button>
      </form>
    </div>
  );
}
