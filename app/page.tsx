import { obtenerDatosPortafolio } from '@/lib/queries';
import PortafolioCliente from '@/components/PortafolioCliente';

// La página se re-valida cada 60 segundos en producción
export const revalidate = 60;

export default async function PaginaPrincipal() {
  // Obtener todos los datos desde la base de datos
  const datos = await obtenerDatosPortafolio();

  return <PortafolioCliente datos={datos} />;
}