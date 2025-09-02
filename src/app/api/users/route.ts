// src/app/api/users/route.ts
import prisma from "@/src/lib/prisma";

// Helper para verificar API Key
function checkApiKey(token: string | null, secret?: string) {
  if (!secret) return { valid: false, error: "API_KEY no definida" };
  if (!token) return { valid: false, error: "Falta x-api-key" };
  if (token !== secret) return { valid: false, error: "Token inválido" };
  return { valid: true };
}

// GET /api/users
export async function GET(req: Request) {
  const token = req.headers.get("x-api-key");
  const check = checkApiKey(token, process.env.API_KEY);
  if (!check.valid) {
    return new Response(JSON.stringify({ error: check.error }), { status: 401 });
  }

  const users = await prisma.testing.findMany();
  return new Response(JSON.stringify(users), { status: 200 });
}

// POST /api/users
export async function POST(req: Request) {
  const token = req.headers.get("x-api-key");
  const check = checkApiKey(token, process.env.API_KEY);
  if (!check.valid) {
    return new Response(JSON.stringify({ error: check.error }), { status: 401 });
  }

  const body = await req.json();
  const { name, email } = body;

  if (!name || !email) {
    return new Response(JSON.stringify({ error: "Faltan campos (name, email)" }), { status: 400 });
  }

  const newUser = await prisma.testing.create({
    data: { Nombre: name, Correo: email },
  });

  return new Response(JSON.stringify(newUser), { status: 201 });
}

// PUT /api/users
export async function PUT(req: Request) {
  const token = req.headers.get("x-api-key");
  const check = checkApiKey(token, process.env.API_KEY);
  if (!check.valid) {
    return new Response(JSON.stringify({ error: check.error }), { status: 401 });
  }

  const body = await req.json();
  const { id, name, email } = body;

  if (!id) return new Response(JSON.stringify({ error: "Falta id" }), { status: 400 });

  const updatedUser = await prisma.testing.update({
    where: { id: Number(id) },
    data: { Nombre: name, Correo: email },
  });

  return new Response(JSON.stringify(updatedUser), { status: 200 });
}

// DELETE /api/users
export async function DELETE(req: Request) {
  const token = req.headers.get("x-api-key");
  const check = checkApiKey(token, process.env.API_KEY);
  if (!check.valid) {
    return new Response(JSON.stringify({ error: check.error }), { status: 401 });
  }

  const body = await req.json();
  const { id } = body;

  if (!id) return new Response(JSON.stringify({ error: "Falta id" }), { status: 400 });

  const deletedUser = await prisma.testing.delete({
    where: { id: Number(id) },
  });

  return new Response(JSON.stringify(deletedUser), { status: 200 });
}