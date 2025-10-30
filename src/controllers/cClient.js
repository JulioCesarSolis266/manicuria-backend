import { PrismaClient } from "@prisma/client";
import mError from "../middlewares/mError.js";

const prisma = new PrismaClient();

const cClient = {
  // Create a new client
  create: async (req, res) => {
    try {
      const { name, phone, notes } = req.body;

      if (!name || !phone) {
        return mError.e400(res, "name and phone are required");
      }

      const newClient = await prisma.client.create({
        data: {
          name,
          phone,
          notes: notes || null,
        },
      });

      res.status(201).json({ message: "Client created", client: newClient });
    } catch (error) {
      mError.e500(res, "Error creating client", error);
    }
  },

  // Get all clients
  getAll: async (req, res) => {
    try {
      const clients = await prisma.client.findMany({
        include: {
          appointments: true, // include related appointments
        },
      });
      res.status(200).json(clients);
    } catch (error) {
      mError.e500(res, "Error fetching clients", error);
    }
  },

  // Get a client by ID
  getOne: async (req, res) => {
    try {
      const { id } = req.params;
      const client = await prisma.client.findUnique({
        where: { id: parseInt(id) },
        include: { appointments: true },
      });

      if (!client) return mError.e404(res, "Client not found");

      res.status(200).json(client);
    } catch (error) {
      mError.e500(res, "Error fetching client", error);
    }
  },

  // Update a client
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, phone, notes } = req.body;

      const updatedClient = await prisma.client.update({
        where: { id: parseInt(id) },
        data: { name, phone, notes },
      });

      res.status(200).json({ message: "Client updated", client: updatedClient });
    } catch (error) {
      mError.e500(res, "Error updating client", error);
    }
  },

  // Delete a client
  delete: async (req, res) => {
    try {
      const { id } = req.params;

      await prisma.client.delete({
        where: { id: parseInt(id) },
      });

      res.status(200).json({ message: "Client deleted" });
    } catch (error) {
      mError.e500(res, "Error deleting client", error);
    }
  },
};

export default cClient;
