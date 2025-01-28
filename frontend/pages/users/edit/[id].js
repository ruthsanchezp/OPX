import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function EditUser() {
  const router = useRouter();
  const { id } = router.query;

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:3001/users/${id}`)
        .then((response) => {
          setUser(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          setLoading(false);
        });
    }
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .put(`http://localhost:3001/users/${id}`, user)
      .then(() => {
        setSuccessMessage("Changes saved successfully!");
        setTimeout(() => {
          router.push(`/users`);
        }, 2000);
      })
      .catch((error) => {
        console.error("Error updating user:", error);
      });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-10 offset-2 p-4">
          <h1 className="mb-4">Edit User</h1>
          {successMessage && (
            <div className="alert alert-success">{successMessage}</div>
          )}
          {user && (
            <form onSubmit={handleSubmit}>
              <div className="mb-3 row">
                <label htmlFor="name" className="col-sm-2 col-form-label">
                  Name:
                </label>
                <div className="col-sm-10">
                  <input
                    type="text"
                    id="name"
                    value={user.name}
                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="mb-3 row">
                <label htmlFor="role" className="col-sm-2 col-form-label">
                  Role:
                </label>
                <div className="col-sm-10">
                  <select
                    id="role"
                    value={user.role}
                    onChange={(e) =>
                      setUser({ ...user, role: e.target.value })
                    }
                    className="form-select"
                  >
                    <option value="Vendedor">Vendedor</option>
                    <option value="Tecnólogo Médico">Tecnólogo Médico</option>
                    <option value="Externo">Administrador</option>
                  </select>
                </div>
              </div>

              <div className="mb-3 row">
                <label htmlFor="email" className="col-sm-2 col-form-label">
                  Email:
                </label>
                <div className="col-sm-10">
                  <input
                    type="email"
                    id="email"
                    value={user.email}
                    onChange={(e) =>
                      setUser({ ...user, email: e.target.value })
                    }
                    className="form-control"
                  />
                </div>
              </div>

              <div className="mb-3 row">
                <label htmlFor="phone" className="col-sm-2 col-form-label">
                  Phone:
                </label>
                <div className="col-sm-10">
                  <input
                    type="text"
                    id="phone"
                    value={user.phone}
                    onChange={(e) =>
                      setUser({ ...user, phone: e.target.value })
                    }
                    className="form-control"
                  />
                </div>
              </div>

              <div className="mb-3 row">
                <label htmlFor="address" className="col-sm-2 col-form-label">
                  Address:
                </label>
                <div className="col-sm-10">
                  <input
                    type="text"
                    id="address"
                    value={user.address}
                    onChange={(e) =>
                      setUser({ ...user, address: e.target.value })
                    }
                    className="form-control"
                  />
                </div>
              </div>

              <div className="mb-3 row">
                <label htmlFor="city" className="col-sm-2 col-form-label">
                  City:
                </label>
                <div className="col-sm-10">
                  <input
                    type="text"
                    id="city"
                    value={user.city}
                    onChange={(e) => setUser({ ...user, city: e.target.value })}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="mb-3 row">
                <label htmlFor="password" className="col-sm-2 col-form-label">
                  Password:
                </label>
                <div className="col-sm-10">
                  <input
                    type="password"
                    id="password"
                    value={user.password}
                    onChange={(e) =>
                      setUser({ ...user, password: e.target.value })
                    }
                    className="form-control"
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
