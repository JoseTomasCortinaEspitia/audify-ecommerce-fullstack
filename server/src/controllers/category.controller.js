import prisma from "../config/prisma.js";
import { translateToEnglish } from "./localization.controller.js";

export const getCategories = async (language = "es") => {
  const categories = await prisma.category.findMany({
    include: {
      products: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  if (language !== "en") return categories;
  const translations = await translateToEnglish(categories.map((category) => category.name));
  return categories.map((category) => ({ ...category, name: translations.get(category.name) }));
};

export const getCategoryById = (id) => {
  return prisma.category.findUnique({
    where: { id },
    include: {
      products: true
    }
  });
};

export const createCategory = ({ name }) => {
  return prisma.category.create({
    data: {
      name
    }
  });
};

export const updateCategory = async (id, categoryData) => {
  const category = await prisma.category.findUnique({
    where: { id }
  });

  if (!category) return null;

  return prisma.category.update({
    where: { id },
    data: categoryData
  });
};

export const deleteCategory = async (id) => {
  const category = await prisma.category.findUnique({
    where: { id }
  });

  if (!category) return null;

  return prisma.category.delete({
    where: { id }
  });
};
