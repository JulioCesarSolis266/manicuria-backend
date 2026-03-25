import { dashboardRepository } from "./dashboard.repository.js";

const sDashboard = {
  getStats: async () => {
    const [
      totalClients,
      allAppointments,
      completedAppointments,
      pendingAppointments,
    ] = await Promise.all([
      dashboardRepository.countClients(),
      dashboardRepository.countAllAppointments(),
      dashboardRepository.countAppointmentsByStatus("completed"),
      dashboardRepository.countAppointmentsByStatus("pending"),
    ]);

    return {
      totalClients,
      allAppointments,
      completedAppointments,
      pendingAppointments,
    };
  },
};

export default sDashboard;
