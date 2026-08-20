UPDATE "Product" SET
  "description" = COALESCE("descriptionEs", "description"),
  "price" = COALESCE("priceCop", "price");

UPDATE "Category" SET
  "name" = COALESCE("nameEs", "name");

ALTER TABLE "Product"
  DROP COLUMN "descriptionEs",
  DROP COLUMN "descriptionEn",
  DROP COLUMN "priceCop",
  DROP COLUMN "priceUsd";

ALTER TABLE "Category"
  DROP COLUMN "nameEs",
  DROP COLUMN "nameEn";
