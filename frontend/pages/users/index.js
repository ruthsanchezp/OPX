import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { Modal, Button } from "react-bootstrap"; // Importamos los componentes de Bootstrap

export default function Users() {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false); // Estado para controlar la visibilidad del modal
  const [selectedUserId, setSelectedUserId] = useState(null); // Estado para almacenar el ID del usuario seleccionado
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

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3001/users/${selectedUserId}`);
      setUsers(users.filter((user) => user.id !== selectedUserId));
      setShowModal(false); // Cerrar el modal después de eliminar
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const openModal = (userId) => {
    setSelectedUserId(userId);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Contenido principal */}
        <div className="col-10 offset-2 p-4">
          <h1 className="text-center mb-4">Users</h1>
          <div className="table-responsive bg-white shadow-sm rounded p-3">
            <table className="custom-table">
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
                          className="btn btn-primary btn-sm me-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => openModal(user.id)}
                          className="btn btn-danger btn-sm"
                        >
                          Delete
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

      {/* Modal de confirmación */}
      <Modal show={showModal} onHide={closeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this user? This action cannot be
          undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
