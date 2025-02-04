import { useRouter } from "next/router";
import CreateMedicalOrder from "../../../medical-orders/create"; // 📌 Reutiliza la lógica existente
import ClientTabs from "../../../components/ClientTabs"; // 📌 Mantiene la barra de navegación

export default function CreateMedicalOrderPage() {
  const router = useRouter();
  const { client_id } = router.query;

  const handleRedirect = () => {
    router.push(`/clients/${client_id}/medical-orders`); // 🔹 Fuerza la redirección correcta
  };

  return (
    <div className="container mt-4">
      <ClientTabs clientId={client_id} />
      <CreateMedicalOrder clientId={client_id} onRedirect={handleRedirect} /> {/* ✅ Pasa la función de redirección */}
    </div>
  );
}
