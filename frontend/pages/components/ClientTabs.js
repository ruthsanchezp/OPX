// components/ClientTabs.js
import { useRouter } from "next/router";
import Link from "next/link";

export default function ClientTabs({ clientId }) {
  const router = useRouter();
  const currentPath = router.asPath; // 📌 Obtiene la URL actual

  return (
    <div className="nav nav-tabs mb-4">
      <Link
        href={`/clients/${clientId}`}  // 🔹 Cambiado de /clients/${clientId}/edit a /clients/${clientId}
        className={`nav-link ${currentPath === `/clients/${clientId}` ? "active" : ""}`}
      >
        Perfil Cliente
      </Link>

      <Link
        href={`/clients/${clientId}/medical-orders`}
        className={`nav-link ${currentPath.includes(`/clients/${clientId}/medical-orders`) ? "active" : ""}`}
      >
        Orden Médica
      </Link>

      <Link href={`/clients/${clientId}/payments`} className={`nav-link ${currentPath.includes(`/clients/${clientId}/payments`) ? "active" : ""}`}>
        Pagos
      </Link>
      
    </div>
  );
}
