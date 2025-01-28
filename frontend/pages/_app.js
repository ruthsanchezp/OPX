// pages/_app.js

import SidebarLayout from './components/Layouts/SidebarLayout';
import 'bootstrap/dist/css/bootstrap.min.css'; // Si estás usando Bootstrap
import '../styles/globals.css'; // Importa tus estilos personalizados

function MyApp({ Component, pageProps }) {
  return (
    <SidebarLayout>
      <Component {...pageProps} />
    </SidebarLayout>
  );
}

export default MyApp;
