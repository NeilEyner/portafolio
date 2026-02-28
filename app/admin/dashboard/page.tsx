import { obtenerDatosDashboard } from '@/lib/actions-admin';
import DashboardCliente from '@/components/admin/DashboardCliente';

export default async function PaginaDashboard() {
  const datos = await obtenerDatosDashboard();
  return <DashboardCliente datos={datos} />;
}