// pages/_app.js

import SidebarLayout from './components/Layouts/SidebarLayout';
import 'bootstrap/dist/css/bootstrap.min.css'; // Si estás usando Bootstrap
import '../styles/globals.css'; // Importa tus estilos personalizados
import { Modal, Button } from "react-bootstrap"; // Importación global de componentes

function MyApp({ Component, pageProps }) {
  return (
    <SidebarLayout>
      <Component {...pageProps} />
    </SidebarLayout>
  );
}

export default MyApp;
