import Sidebar from './components/Layouts/Sidebar';
import { useRouter } from "next/router";

export default function Layout({ children }) {
  return (
    <div className="flex">
      <Sidebar /> {/* Asegúrate de que Sidebar esté exportado correctamente */}
      <div className="flex-1">
        <header className="bg-gray-800 text-white p-4">
          <h1>Dashboard</h1>
        </header>
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
}
