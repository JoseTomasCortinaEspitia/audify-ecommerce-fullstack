import prisma from "../config/prisma.js";

export const getCategories = () => {
  return prisma.category.findMany({
    include: {
      products: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });
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
