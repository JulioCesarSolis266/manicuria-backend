import { jest } from "@jest/globals";

// MOCK
jest.unstable_mockModule("./dashboard.repository.js", () => ({
  dashboardRepository: {
    countClients: jest.fn(),
    countAllAppointments: jest.fn(),
    countAppointmentsByStatus: jest.fn(),
  },
}));

// IMPORTS
const { default: sDashboard } = await import("./dashboard.service.js");
const { dashboardRepository } = await import("./dashboard.repository.js");

describe("Dashboard Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("debería devolver las estadísticas correctamente", async () => {
    dashboardRepository.countClients.mockResolvedValue(10);
    dashboardRepository.countAllAppointments.mockResolvedValue(50);
    dashboardRepository.countAppointmentsByStatus
      .mockResolvedValueOnce(30) // completed
      .mockResolvedValueOnce(20); // pending

    const result = await sDashboard.getStats();

    expect(result).toEqual({
      totalClients: 10,
      allAppointments: 50,
      completedAppointments: 30,
      pendingAppointments: 20,
    });

    expect(dashboardRepository.countAppointmentsByStatus).toHaveBeenCalledWith(
      "completed",
    );
    expect(dashboardRepository.countAppointmentsByStatus).toHaveBeenCalledWith(
      "pending",
    );
  });
});
