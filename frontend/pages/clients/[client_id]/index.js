// pages/clients/[client_id]/index.js
import { useRouter } from "next/router";
import ClientTabs from "../../components/ClientTabs";
import EditClientForm from "../../components/EditClientForm"; // 📌 Importa el formulario de edición

export default function ClientPage() {
  const router = useRouter();
  const { client_id } = router.query; // Obtiene el ID de la URL

  if (!client_id) return <div>Loading...</div>;

  return (
    <div className="container mt-4">
      <ClientTabs clientId={client_id} />

      {/* 🔹 Cargar el formulario de edición automáticamente */}
      <EditClientForm clientId={client_id} />
    </div>
  );
}
