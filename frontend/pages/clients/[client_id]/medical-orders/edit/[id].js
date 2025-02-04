import { useRouter } from "next/router";
import ClientTabs from "../../../../components/ClientTabs"; // 🔹 Importa la barra de navegación
import EditMedicalOrder from "../../../../medical-orders/edit/[id]"; // 🔹 Importa la página existente

export default function EditMedicalOrderPage() {
  const router = useRouter();
  const { client_id, id } = router.query;

  const handleRedirect = () => {
    router.push(`/clients/${client_id}/medical-orders`); // 🔹 Fuerza la redirección correcta
  };

  return (
    <div className="container mt-4">
      <ClientTabs clientId={client_id} />
      <EditMedicalOrder orderId={id} clientId={client_id} onRedirect={handleRedirect} /> {/* ✅ Pasa la función de redirección */}
    </div>
  );
}