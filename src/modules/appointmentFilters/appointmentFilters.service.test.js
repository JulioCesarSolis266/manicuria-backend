import { jest } from "@jest/globals";

// Mock primero
jest.unstable_mockModule("./appointmentFilters.repository.js", () => ({
  appointmentFiltersRepository: {
    filter: jest.fn(),
  },
}));

// Imports dinámicos
const { default: appointmentFiltersService } =
  await import("./appointmentFilters.service.js");
const { appointmentFiltersRepository } =
  await import("./appointmentFilters.repository.js");

describe("Appointment Filters Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // =========================
  // SUCCESS
  // =========================

  it("debería filtrar por status", async () => {
    appointmentFiltersRepository.filter.mockResolvedValue([]);

    await appointmentFiltersService.filterAppointments({
      status: "pending",
    });

    expect(appointmentFiltersRepository.filter).toHaveBeenCalledWith({
      status: "pending",
    });
  });

  it("debería filtrar por rango de fechas", async () => {
    appointmentFiltersRepository.filter.mockResolvedValue([]);

    await appointmentFiltersService.filterAppointments({
      startDate: "2030-01-01",
      endDate: "2030-02-01",
    });

    expect(appointmentFiltersRepository.filter).toHaveBeenCalledWith({
      date: {
        gte: new Date("2030-01-01"),
        lte: new Date("2030-02-01"),
      },
    });
  });

  it("debería filtrar por status y fechas", async () => {
    appointmentFiltersRepository.filter.mockResolvedValue([]);

    await appointmentFiltersService.filterAppointments({
      status: "done",
      startDate: "2030-01-01",
    });

    expect(appointmentFiltersRepository.filter).toHaveBeenCalledWith({
      status: "done",
      date: {
        gte: new Date("2030-01-01"),
      },
    });
  });

  // =========================
  // ERRORS
  // =========================

  it("debería fallar si startDate es inválido", async () => {
    await expect(
      appointmentFiltersService.filterAppointments({
        startDate: "fecha-invalida",
      }),
    ).rejects.toMatchObject({
      message: "startDate inválido",
      status: 400,
    });
  });

  it("debería fallar si endDate es inválido", async () => {
    await expect(
      appointmentFiltersService.filterAppointments({
        endDate: "fecha-invalida",
      }),
    ).rejects.toMatchObject({
      message: "endDate inválido",
      status: 400,
    });
  });
});
