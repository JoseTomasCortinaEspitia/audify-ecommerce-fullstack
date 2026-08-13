import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import prisma from "../config/prisma.js";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class AuthError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.name = "AuthError";
    this.status = status;
  }
}

const publicUser = ({ id, name, email, role, avatarUrl }) => ({
  id,
  name,
  email,
  role,
  avatarUrl
});

const createToken = (user) => jwt.sign(
  { id: user.id, email: user.email, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: "7d" }
);

const createAuthResult = (user, message) => ({
  message,
  token: createToken(user),
  user: publicUser(user)
});

export const registerUser = async ({ name: providedName, email: providedEmail, password }) => {
  const name = providedName?.trim();
  const email = providedEmail?.trim().toLowerCase();

  if (!name || !emailPattern.test(email || "") || typeof password !== "string" || password.length < 8) {
    throw new AuthError(
      "Ingresa nombre, un correo válido y una contraseña de mínimo 8 caracteres",
      400
    );
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    throw new AuthError("Este correo ya está registrado", 409);
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword }
  });

  return createAuthResult(user, "Cuenta creada correctamente");
};

export const loginUser = async ({ identifier: providedIdentifier, email, password }) => {
  const identifier = providedIdentifier?.trim() || email?.trim();

  if (!identifier || !password) {
    throw new AuthError("Ingresa tu correo o nombre y contraseña", 400);
  }

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { email: { equals: identifier.toLowerCase() } },
        { name: { equals: identifier, mode: "insensitive" } }
      ]
    }
  });

  const validPassword = user?.password
    ? await bcrypt.compare(password, user.password)
    : false;

  if (!user || !validPassword) {
    throw new AuthError("Usuario o contraseña incorrectos", 401);
  }

  return createAuthResult(user, "Sesión iniciada correctamente");
};

export const loginWithGoogle = async (credential) => {
  if (!process.env.GOOGLE_CLIENT_ID) {
    throw new AuthError("El acceso con Google aún no está configurado", 503);
  }

  if (!credential) {
    throw new AuthError("No se recibió la credencial de Google", 400);
  }

  let payload;

  try {
    const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    payload = ticket.getPayload();
  } catch (error) {
    console.error("Google verification error:", error);
    throw new AuthError("No se pudo validar el acceso con Google", 401);
  }

  if (!payload?.email || !payload.email_verified) {
    throw new AuthError("Google no pudo verificar este correo", 401);
  }

  const email = payload.email.toLowerCase();
  let user = await prisma.user.findUnique({ where: { email } });

  if (user) {
    user = await prisma.user.update({
      where: { id: user.id },
      data: {
        googleId: user.googleId || payload.sub,
        avatarUrl: user.avatarUrl || payload.picture
      }
    });
  } else {
    user = await prisma.user.create({
      data: {
        name: payload.name || email.split("@")[0],
        email,
        googleId: payload.sub,
        avatarUrl: payload.picture
      }
    });
  }

  return createAuthResult(user, "Sesión iniciada con Google");
};

export const getUserProfile = async (userId) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new AuthError("Usuario no encontrado", 404);
  }

  return publicUser(user);
};

export const logoutUser = async () => ({
  message: "Sesión cerrada correctamente"
});
