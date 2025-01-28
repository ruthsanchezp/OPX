import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function CreateUser() {
  const router = useRouter();

  const [user, setUser] = useState({
    name: "",
    role: "Vendedor",
    email: "",
    phone: "",
    address: "",
    city: "",
    password: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3001/users", user);
      setSuccessMessage("User created successfully!");
      setTimeout(() => {
        router.push("/users"); // Redirige a la lista de usuarios
      }, 2000);
    } catch (error) {
      console.error("Error creating user:", error);
      setErrorMessage("Failed to create user. Please try again.");
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Create User</h1>

      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

      <div className="card p-4 shadow-lg">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Role</label>
            <select
              name="role"
              value={user.role}
              onChange={handleChange}
              className="form-control"
            >
              <option value="Vendedor">Vendedor</option>
              <option value="Tecnólogo Médico">Tecnólogo Médico</option>
              <option value="Administrador">Administrador</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Phone</label>
            <input
              type="text"
              name="phone"
              value={user.phone}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Address</label>
            <input
              type="text"
              name="address"
              value={user.address}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">City</label>
            <input
              type="text"
              name="city"
              value={user.city}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              value={user.password}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">Create User</button>
        </form>
      </div>
    </div>
  );
}
