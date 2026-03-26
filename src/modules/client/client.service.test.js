import { jest } from "@jest/globals";

// ===== MOCK =====
jest.unstable_mockModule("./client.repository.js", () => ({
  clientRepository: {
    create: jest.fn(),
    findAllByUser: jest.fn(),
    findByIdAndUser: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

// ===== IMPORTS =====
const { default: clientService } = await import("./client.service.js");
const { clientRepository } = await import("./client.repository.js");

describe("Client Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // =========================
  // CREATE
  // =========================

  it("debería crear un cliente correctamente", async () => {
    const mockClient = { id: 1 };

    clientRepository.create.mockResolvedValue(mockClient);

    const result = await clientService.create(
      {
        name: "Juan",
        phone: "123",
      },
      10,
    );

    expect(result).toEqual(mockClient);

    expect(clientRepository.create).toHaveBeenCalledWith({
      name: "Juan",
      surname: undefined,
      phone: "123",
      notes: null,
      userId: 10,
    });
  });

  it("debería fallar si faltan campos obligatorios", async () => {
    await expect(clientService.create({ name: "" }, 10)).rejects.toThrow(
      "Los campos nombre y teléfono son obligatorios",
    );
  });

  // =========================
  // GET ONE
  // =========================

  it("debería devolver un cliente", async () => {
    const client = { id: 1 };

    clientRepository.findByIdAndUser.mockResolvedValue(client);

    const result = await clientService.getOne(1, 10);

    expect(result).toEqual(client);
  });

  it("debería fallar si no existe", async () => {
    clientRepository.findByIdAndUser.mockResolvedValue(null);

    await expect(clientService.getOne(1, 10)).rejects.toThrow(
      "Cliente no encontrado",
    );
  });

  // =========================
  // UPDATE
  // =========================

  it("debería actualizar un cliente correctamente", async () => {
    const existing = {
      id: 1,
      name: "Juan",
      surname: "Perez",
      phone: "123",
      notes: "nota",
    };

    clientRepository.findByIdAndUser.mockResolvedValue(existing);

    const updated = { id: 1 };
    clientRepository.update.mockResolvedValue(updated);

    const result = await clientService.update(1, { name: "Nuevo" }, 10);

    expect(result).toEqual(updated);

    expect(clientRepository.update).toHaveBeenCalledWith(1, {
      name: "Nuevo",
      surname: "Perez",
      phone: "123",
      notes: "nota",
    });
  });

  it("debería fallar si no existe o no pertenece", async () => {
    clientRepository.findByIdAndUser.mockResolvedValue(null);

    await expect(clientService.update(1, {}, 10)).rejects.toThrow(
      "Cliente no encontrado o no autorizado",
    );
  });

  // =========================
  // DELETE
  // =========================

  it("debería eliminar un cliente correctamente", async () => {
    clientRepository.findByIdAndUser.mockResolvedValue({
      id: 1,
      appointments: [],
    });

    clientRepository.delete.mockResolvedValue();

    const result = await clientService.delete(1, 10);

    expect(result).toBe(true);
    expect(clientRepository.delete).toHaveBeenCalledWith(1);
  });

  it("debería fallar si no existe o no pertenece", async () => {
    clientRepository.findByIdAndUser.mockResolvedValue(null);

    await expect(clientService.delete(1, 10)).rejects.toThrow(
      "Cliente no encontrado o no autorizado",
    );
  });

  it("debería fallar si tiene turnos", async () => {
    clientRepository.findByIdAndUser.mockResolvedValue({
      id: 1,
      appointments: [{ id: 1 }],
    });

    await expect(clientService.delete(1, 10)).rejects.toThrow(
      "No se puede eliminar este cliente porque tiene turnos pendientes",
    );
  });

  // =========================
  // GET ALL
  // =========================

  it("debería traer todos los clientes del usuario", async () => {
    const clients = [];

    clientRepository.findAllByUser.mockResolvedValue(clients);

    const result = await clientService.getAll(10);

    expect(result).toEqual(clients);
    expect(clientRepository.findAllByUser).toHaveBeenCalledWith(10);
  });
});
