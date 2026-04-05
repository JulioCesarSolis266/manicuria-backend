// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// export const appointmentRepository = {
//   create: (data) =>
//     prisma.appointment.create({
//       data,
//       include: {
//         client: true,
//         service: true,
//       },
//     }),

//   findById: (id) =>
//     prisma.appointment.findUnique({
//       where: { id },
//       include: {
//         client: true,
//         service: true,
//       },
//     }),

//   findAll: (where) =>
//     prisma.appointment.findMany({
//       where,
//       include: {
//         client: true,
//         service: true,
//       },
//       orderBy: { date: "desc" },
//     }),

//   findByDateAndUser: (date, userId, excludeId = null) =>
//     prisma.appointment.findFirst({
//       where: {
//         date,
//         userId,
//         ...(excludeId && { id: { not: excludeId } }),
//       },
//     }),

//   delete: (id) =>
//     prisma.appointment.delete({
//       where: { id },
//     }),

//   update: (id, data) =>
//     prisma.appointment.update({
//       where: { id },
//       data,
//       include: {
//         client: true,
//         service: true,
//       },
//     }),

//   clientExists: (clientId, userId) =>
//     prisma.client.findFirst({
//       where: {
//         id: clientId,
//         userId,
//       },
//     }),

//   serviceExists: (serviceId, userId) =>
//     prisma.service.findFirst({
//       where: {
//         id: serviceId,
//         userId,
//       },
//     }),
// };
// // refactors

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const appointmentRepository = {
  create: (data) =>
    prisma.appointment.create({
      data,
      include: {
        client: true,
        service: true,
      },
    }),

  findById: (id) =>
    prisma.appointment.findUnique({
      where: { id },
      include: {
        client: true,
        service: true,
      },
    }),

  findAll: (where) =>
    prisma.appointment.findMany({
      where,
      include: {
        client: true,
        service: true,
      },
      orderBy: { date: "desc" },
    }),

  // 👇 NUEVO (clave)
  countByDateAndUser: (date, userId, excludeId = null) =>
    prisma.appointment.count({
      where: {
        date,
        userId,
        ...(excludeId && { id: { not: excludeId } }),
      },
    }),

  delete: (id) =>
    prisma.appointment.delete({
      where: { id },
    }),

  update: (id, data) =>
    prisma.appointment.update({
      where: { id },
      data,
      include: {
        client: true,
        service: true,
      },
    }),

  clientExists: (clientId, userId) =>
    prisma.client.findFirst({
      where: {
        id: clientId,
        userId,
      },
    }),

  serviceExists: (serviceId, userId) =>
    prisma.service.findFirst({
      where: {
        id: serviceId,
        userId,
      },
    }),
};
