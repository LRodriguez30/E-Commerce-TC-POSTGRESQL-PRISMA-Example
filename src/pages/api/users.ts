// pages/api/users.ts
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

type Data = 
  | { error: string }
  | any; // aquí puedes reemplazar 'any' por un tipo de usuario más adelante

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const token = req.headers["x-api-key"];
    const SECRET_KEY = process.env.API_KEY;

    if (!SECRET_KEY) {
      return res.status(500).json({ error: "Error de configuración: API_KEY no definida" });
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
        } catch (err: any) {
          return res.status(500).json({ error: err.message });
        }

      case "POST":
        try {
          const { name, email } = req.body as { name?: string; email?: string };
          if (!name || !email) {
            return res.status(400).json({ error: "Faltan campos obligatorios (name, email)" });
          }

          const newUser = await prisma.testing.create({
            data: { Nombre: name, Correo: email },
          });

          return res.status(201).json(newUser);
        } catch (err: any) {
          return res.status(400).json({ error: err.message });
        }

      case "PUT":
        try {
          const { id, name, email } = req.body as { id?: number; name?: string; email?: string };
          if (!id) return res.status(400).json({ error: "Falta id" });

          const updatedUser = await prisma.testing.update({
            where: { id: Number(id) },
            data: { Nombre: name, Correo: email },
          });

          return res.status(200).json(updatedUser);
        } catch (err: any) {
          return res.status(400).json({ error: err.message });
        }

      case "DELETE":
        try {
          const { id } = req.body as { id?: number };
          if (!id) return res.status(400).json({ error: "Falta id" });

          const deletedUser = await prisma.testing.delete({
            where: { id: Number(id) },
          });

          return res.status(200).json(deletedUser);
        } catch (err: any) {
          return res.status(400).json({ error: err.message });
        }

      default:
        res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}