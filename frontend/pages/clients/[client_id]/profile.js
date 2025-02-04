// pages/clients/[client_id]/profile.js
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import axios from "axios";
import ClientTabs from "../../components/ClientTabs";


export default function ClientProfile() {
  const router = useRouter();
  const { client_id } = router.query;
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (client_id) {
      axios.get(`http://localhost:3001/clients/${client_id}`)
        .then((response) => {
          setClient(response.data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [client_id]);

  const handleChange = (e) => {
    setClient({ ...client, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3001/clients/${client_id}`, client);
      alert("Perfil actualizado correctamente.");
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (!client) return <p>Cliente no encontrado.</p>;

  return (
    <div className="container mt-4">
      <h2>Editar Perfil</h2>
      <ClientTabs clientId={client_id} activeTab="profile" />
      
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nombre</label>
          <input type="text" className="form-control" name="first_name" value={client.first_name} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Apellido</label>
          <input type="text" className="form-control" name="last_name" value={client.last_name} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label className="form-label">ID Fiscal</label>
          <input type="text" className="form-control" name="id_fiscal" value={client.id_fiscal} onChange={handleChange} required />
        </div>

        <button type="submit" className="btn btn-primary">Guardar Cambios</button>
      </form>
    </div>
  );
}
