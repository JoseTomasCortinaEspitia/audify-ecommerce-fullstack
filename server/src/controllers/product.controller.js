import prisma from "../config/prisma.js";
import cloudinary from "../config/cloudinary.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";

export const getProducts = () => {
  return prisma.product.findMany({
    include: {
      category: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};

export const getProductById = (id) => {
  return prisma.product.findUnique({
    where: { id },
    include: {
      category: true
    }
  });
};

export const createProduct = async (productData, file) => {
  const { name, description, price, stock, categoryId, imageUrl: providedImageUrl, imagePublicId: providedImagePublicId } = productData;

  const existingProduct = await prisma.product.findFirst({
    where: {
      name: {
        equals: name.trim(),
        mode: "insensitive"
      }
    }
  });

  if (existingProduct) {
    const error = new Error("Ya existe un producto con ese nombre");
    error.code = "P2002";
    throw error;
  }

  let imageUrl = providedImageUrl || null;
  let imagePublicId = providedImagePublicId || null;

  if (file) {
    const uploadResult = await uploadToCloudinary(file.buffer);

    imageUrl = uploadResult.secure_url;
    imagePublicId = uploadResult.public_id;
  }

  return prisma.product.create({
    data: {
      name: name.trim(),
      description,
      price: Number(price),
      stock: Number(stock),
      categoryId,
      imageUrl,
      imagePublicId
    }
  });
};

export const updateProduct = async (id, productData, file) => {
  const currentProduct = await prisma.product.findUnique({
    where: { id }
  });

  if (!currentProduct) return null;

  const data = {
    ...productData
  };

  if (data.price !== undefined) data.price = Number(data.price);
  if (data.stock !== undefined) data.stock = Number(data.stock);

  if (file) {
    if (currentProduct.imagePublicId) {
      await cloudinary.uploader.destroy(currentProduct.imagePublicId);
    }

    const uploadResult = await uploadToCloudinary(file.buffer);

    data.imageUrl = uploadResult.secure_url;
    data.imagePublicId = uploadResult.public_id;
  }

  return prisma.product.update({
    where: { id },
    data
  });
};

export const deleteProduct = async (id) => {
  const product = await prisma.product.findUnique({
    where: { id }
  });

  if (!product) return null;

  if (product.imagePublicId) {
    await cloudinary.uploader.destroy(product.imagePublicId);
  }

  return prisma.product.delete({
    where: { id }
  });
};
