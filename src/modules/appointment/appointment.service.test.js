import { jest } from "@jest/globals";

// Mock del repository
jest.unstable_mockModule("./appointment.repository.js", () => ({
  appointmentRepository: {
    clientExists: jest.fn(),
    serviceExists: jest.fn(),
    findByDateAndUser: jest.fn(),
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

const { default: appointmentService } =
  await import("./appointment.service.js");
const { appointmentRepository } = await import("./appointment.repository.js");

describe("Appointment Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // =========================
  // CREATE
  // =========================

  it("debería crear un turno correctamente", async () => {
    const data = {
      serviceId: "1",
      clientId: "2",
      date: "2030-01-01",
      description: "Consulta",
    };

    const user = { id: 10 };

    appointmentRepository.clientExists.mockResolvedValue(true);
    appointmentRepository.serviceExists.mockResolvedValue(true);
    appointmentRepository.findByDateAndUser.mockResolvedValue(null);

    const mockResult = { id: 1 };
    appointmentRepository.create.mockResolvedValue(mockResult);

    const result = await appointmentService.create(data, user);

    expect(result).toEqual(mockResult);

    expect(appointmentRepository.create).toHaveBeenCalledWith({
      serviceId: 1,
      clientId: 2,
      date: new Date(data.date),
      description: "Consulta",
      userId: 10,
    });
  });

  it("debería fallar si faltan campos obligatorios", async () => {
    const data = { serviceId: "1" };
    const user = { id: 10 };

    await expect(appointmentService.create(data, user)).rejects.toThrow(
      "Los campos serviceId, clientId y date son obligatorios",
    );
  });

  it("debería fallar si IDs no son numéricos", async () => {
    const data = {
      serviceId: "abc",
      clientId: "2",
      date: "2030-01-01",
    };

    const user = { id: 10 };

    await expect(appointmentService.create(data, user)).rejects.toThrow(
      "serviceId y clientId deben ser numéricos",
    );
  });

  it("debería fallar si la fecha es pasada", async () => {
    const data = {
      serviceId: "1",
      clientId: "2",
      date: "2020-01-01",
    };

    const user = { id: 10 };

    await expect(appointmentService.create(data, user)).rejects.toThrow(
      "No se pueden crear turnos en el pasado",
    );
  });

  it("debería fallar si el cliente no existe", async () => {
    const data = {
      serviceId: "1",
      clientId: "2",
      date: "2030-01-01",
    };

    const user = { id: 10 };

    appointmentRepository.clientExists.mockResolvedValue(false);

    await expect(appointmentService.create(data, user)).rejects.toThrow(
      "El cliente no existe o no pertenece al usuario",
    );
  });

  it("debería fallar si ya existe un turno en esa fecha", async () => {
    const data = {
      serviceId: "1",
      clientId: "2",
      date: "2030-01-01",
    };

    const user = { id: 10 };

    appointmentRepository.clientExists.mockResolvedValue(true);
    appointmentRepository.serviceExists.mockResolvedValue(true);
    appointmentRepository.findByDateAndUser.mockResolvedValue({ id: 99 });

    await expect(appointmentService.create(data, user)).rejects.toThrow(
      "Ya existe un turno en esa fecha y hora",
    );
  });

  // =========================
  // GET ONE
  // =========================

  it("debería devolver una cita si existe", async () => {
    const appointment = { id: 1, userId: 10 };

    appointmentRepository.findById.mockResolvedValue(appointment);

    const result = await appointmentService.getOne(1, {
      id: 10,
      role: "user",
    });

    expect(result).toEqual(appointment);
  });

  it("debería fallar si la cita no existe", async () => {
    appointmentRepository.findById.mockResolvedValue(null);

    await expect(
      appointmentService.getOne(1, { id: 10, role: "user" }),
    ).rejects.toThrow("No se encontró la cita");
  });

  it("debería fallar si no tiene permisos", async () => {
    appointmentRepository.findById.mockResolvedValue({
      id: 1,
      userId: 99,
    });

    await expect(
      appointmentService.getOne(1, { id: 10, role: "user" }),
    ).rejects.toThrow("No tenés permiso para ver esta cita");
  });
});
// =========================
// UPDATE
// =========================
it("debería actualizar una cita correctamente", async () => {
  const user = { id: 10, role: "user" };

  const existingAppointment = {
    id: 1,
    userId: 10,
    clientId: 2,
    date: new Date("2030-01-01"),
  };

  appointmentRepository.findById.mockResolvedValue(existingAppointment);
  appointmentRepository.findByDateAndUser.mockResolvedValue(null);

  const updated = { id: 1 };
  appointmentRepository.update.mockResolvedValue(updated);

  const result = await appointmentService.update(
    1,
    { date: "2030-02-01" },
    user,
  );

  expect(result).toEqual(updated);
});

it("debería fallar si la cita no existe", async () => {
  appointmentRepository.findById.mockResolvedValue(null);

  await expect(
    appointmentService.update(1, {}, { id: 10, role: "user" }),
  ).rejects.toThrow("No se encontró la cita");
});

it("debería fallar si no tiene permisos", async () => {
  appointmentRepository.findById.mockResolvedValue({
    id: 1,
    userId: 99,
  });

  await expect(
    appointmentService.update(1, {}, { id: 10, role: "user" }),
  ).rejects.toThrow("No tenés permiso para modificar esta cita");
});

it("debería fallar si la nueva fecha es inválida", async () => {
  appointmentRepository.findById.mockResolvedValue({
    id: 1,
    userId: 10,
    clientId: 2,
    date: new Date("2030-01-01"),
  });

  await expect(
    appointmentService.update(
      1,
      { date: "fecha-invalida" },
      { id: 10, role: "user" },
    ),
  ).rejects.toThrow("La fecha es inválida");
});

it("debería fallar si intenta mover el turno al pasado", async () => {
  appointmentRepository.findById.mockResolvedValue({
    id: 1,
    userId: 10,
    clientId: 2,
    date: new Date("2030-01-01"),
  });

  await expect(
    appointmentService.update(
      1,
      { date: "2020-01-01" },
      { id: 10, role: "user" },
    ),
  ).rejects.toThrow("No se puede mover el turno al pasado");
});

it("debería fallar si ya existe otro turno en esa fecha", async () => {
  appointmentRepository.findById.mockResolvedValue({
    id: 1,
    userId: 10,
    clientId: 2,
    date: new Date("2030-01-01"),
  });

  appointmentRepository.findByDateAndUser.mockResolvedValue({ id: 2 });

  await expect(
    appointmentService.update(
      1,
      { date: "2030-02-01" },
      { id: 10, role: "user" },
    ),
  ).rejects.toThrow("Ya existe otro turno en esa fecha y hora");
});

// =========================
// DELETE
// =========================

it("debería eliminar una cita correctamente", async () => {
  appointmentRepository.findById.mockResolvedValue({
    id: 1,
    userId: 10,
  });

  appointmentRepository.delete.mockResolvedValue();

  const result = await appointmentService.delete(1, {
    id: 10,
    role: "user",
  });

  expect(result).toBe(true);
  expect(appointmentRepository.delete).toHaveBeenCalledWith(1);
});

it("debería fallar si la cita no existe", async () => {
  appointmentRepository.findById.mockResolvedValue(null);

  await expect(
    appointmentService.delete(1, { id: 10, role: "user" }),
  ).rejects.toThrow("No se encontró la cita");
});

it("debería fallar si no tiene permisos", async () => {
  appointmentRepository.findById.mockResolvedValue({
    id: 1,
    userId: 99,
  });

  await expect(
    appointmentService.delete(1, { id: 10, role: "user" }),
  ).rejects.toThrow("No tenés permiso para eliminar esta cita");
});

// =========================
// GET ALL
// =========================

it("debería traer solo citas del usuario si no es admin", async () => {
  appointmentRepository.findAll.mockResolvedValue([]);

  await appointmentService.getAll({ id: 10, role: "user" });

  expect(appointmentRepository.findAll).toHaveBeenCalledWith({
    userId: 10,
  });
});
