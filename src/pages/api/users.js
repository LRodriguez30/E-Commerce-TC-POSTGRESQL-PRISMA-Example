// pages/api/users.js
import prisma from "@/lib/prisma"; // <- usar instancia global

export default async function handler(req, res) {
  try {
    const token = req.headers["x-api-key"];
    const SECRET_KEY = process.env.API_KEY;

    if (!SECRET_KEY) {
      return res
        .status(500)
        .json({ error: "Error de configuración: API_KEY no definida" });
    }

    if (!token) {
      return res.status(401).json({ error: "No autorizado: falta x-api-key" });
    }

    if (token !== SECRET_KEY) {
      return res.status(401).json({ error: "No autorizado: token inválido" });
    }

    switch (req.method) {
      case "GET":
        try {
          const users = await prisma.testing.findMany();
          return res.status(200).json(users);
        } catch (err) {
          return res.status(500).json({ error: err.message });
        }

      case "POST":
        try {
          const { name, email } = req.body;
          if (!name || !email) {
            return res
              .status(400)
              .json({ error: "Faltan campos obligatorios (name, email)" });
          }

          const newUser = await prisma.testing.create({
            data: {
              Nombre: name,
              Correo: email,
            },
          });

          return res.status(201).json(newUser);
        } catch (err) {
          return res.status(400).json({ error: err.message });
        }

      case "PUT":
        try {
          const { id, name, email } = req.body;
          if (!id) return res.status(400).json({ error: "Falta id" });

          const updatedUser = await prisma.testing.update({
            where: { id: Number(id) },
            data: {
              Nombre: name,
              Correo: email,
            },
          });

          return res.status(200).json(updatedUser);
        } catch (err) {
          return res.status(400).json({ error: err.message });
        }

      case "DELETE":
        try {
          const { id } = req.body;
          if (!id) return res.status(400).json({ error: "Falta id" });

          const deletedUser = await prisma.testing.delete({
            where: { id: Number(id) },
          });

          return res.status(200).json(deletedUser);
        } catch (err) {
          return res.status(400).json({ error: err.message });
        }

      default:
        res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}