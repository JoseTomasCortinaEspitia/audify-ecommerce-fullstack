ALTER TABLE "Category"
  ADD COLUMN "nameEs" TEXT,
  ADD COLUMN "nameEn" TEXT;

ALTER TABLE "Product"
  ADD COLUMN "descriptionEs" TEXT,
  ADD COLUMN "descriptionEn" TEXT,
  ADD COLUMN "priceCop" DOUBLE PRECISION,
  ADD COLUMN "priceUsd" DOUBLE PRECISION;

UPDATE "Category" SET
  "nameEn" = "name",
  "nameEs" = CASE "name"
    WHEN 'Headphones' THEN 'Audífonos'
    WHEN 'Microphones' THEN 'Micrófonos'
    WHEN 'Speakers' THEN 'Altavoces'
    WHEN 'DJ Mixers' THEN 'Mezcladores DJ'
    ELSE "name"
  END;

UPDATE "Product" SET
  "priceUsd" = "price",
  "priceCop" = ROUND(("price" * 4000)::numeric, 0),
  "descriptionEn" = "description",
  "descriptionEs" = CASE "name"
    WHEN 'JBL GO4' THEN 'Altavoz portátil JBL GO 4 con Bluetooth y resistencia al agua.'
    WHEN 'Pioneer DJM-750MK2' THEN 'Mezclador profesional para DJ con distribución tipo club, efectos y sonido de alta calidad.'
    WHEN 'Yamaha DBR12' THEN 'Altavoz activo de gran potencia, rendimiento confiable y diseño compacto.'
    WHEN 'JBL EON715' THEN 'Altavoz amplificado para eventos en vivo, DJ, salas de conferencias y sistemas de sonido portátiles.'
    WHEN 'Shure SM7B' THEN 'Micrófono dinámico de radiodifusión para pódcast, transmisiones y grabación en estudio.'
    WHEN 'Shure SM58' THEN 'Micrófono vocal dinámico ideal para sonido en vivo, ensayos y eventos profesionales.'
    WHEN 'Sony WH-1000XM5' THEN 'Audífonos inalámbricos con cancelación de ruido para producción musical, viajes y uso diario.'
    WHEN 'Audio-Technica ATH-M50x' THEN 'Audífonos profesionales de estudio con sonido claro, bajos potentes y almohadillas cómodas.'
    ELSE "description"
  END;
