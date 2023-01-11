// import prisma from '../db'

// // Get all herds
// export const getAllHerds = async (req, res, next) => {
//   try {
//     const user = await prisma.user.findUnique({
//       where: {
//         id: req.user.id,
//       },
//       include: {
//         herds: true,
//       },
//     })

//     res.json({ ok: true, data: user.herds })
//   } catch (err) {
//     next(err)
//   }
// }

// // Get created herds
// export const getShepHerds = async (req, res, next) => {
//   try {
//     const shepherds = await prisma.herdMembership.findMany({
//       where: {
//         userId: req.user.id,
//         role: 'SHEPHERD',
//       },
//     })

//     res.json({ ok: true, data: shepherds })
//   } catch (err) {
//     next(err)
//   }
// }

// // Get one herd
// export const getHerd = async (req, res, next) => {
//   try {
//     const id = req.params.id
//     const herd = await prisma.herd.findFirst({
//       where: {
//         id,
//       },
//     })
//     res.json({ ok: true, data: herd })
//   } catch (err) {
//     next(err)
//   }
// }

// // Create a herd
// export const createHerd = async (req, res, next) => {
//   try {
//     const herd = await prisma.herd.create({
//       data: {
//         name: req.body.name,
//         members: {
//           create: {
//             role: 'SHEPHERD',
//             user: {
//               connect: {
//                 id: req.user.id,
//               },
//             },
//           },
//         },
//       },
//     })
//     res.json({ ok: true, data: herd })
//   } catch (err) {
//     next(err)
//   }
// }

// // Update a herd
// export const updateHerd = async (req, res, next) => {
//   try {
//     const updated = await prisma.herd.update({
//       where: {
//         id: req.params.id,
//       },
//       data: req.body,
//     })
//     res.json({ ok: true, data: updated })
//   } catch (err) {
//     next(err)
//   }
// }

// // Delete a herd
// export const deleteHerd = async (req, res, next) => {
//   try {
//     const deleted = await prisma.herd.delete({
//       where: {
//         id: req.params.id,
//       },
//     })
//     res.json({ ok: true, data: deleted })
//   } catch (err) {
//     next(err)
//   }
// }
