import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function Users() {
  const [users, setUsers] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:3001/users");
        if (Array.isArray(response.data)) {
          setUsers(response.data);
        } else {
          console.error("La respuesta no es un array:", response.data);
        }
      } catch (error) {
        console.error("Error fetching users", error);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Contenido principal */}
        <div className="col-10 offset-2 p-4">
          <h1 className="text-center mb-4">Users</h1>
          <div className="table-responsive bg-white shadow-sm rounded p-3">
          <table class="custom-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Email</th>
              <th>Actions</th>
              </tr>
            </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.name}</td>
                      <td>{user.role}</td>
                      <td>{user.email}</td>
                      <td>
                        <button
                          onClick={() => router.push(`/users/edit/${user.id}`)}
                          className="btn btn-primary btn-sm"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
