const CACHE_DURATION_MS = 60 * 60 * 1000;
let exchangeRateCache = null;

const fallbackTranslations = new Map([
  ["Audífonos", "Headphones"],
  ["Micrófonos", "Microphones"],
  ["Altavoces", "Speakers"],
  ["Mezcladores DJ", "DJ Mixers"],
  ["Altavoz portátil JBL GO 4 con Bluetooth y resistencia al agua.", "JBL GO 4 portable speaker with Bluetooth and water resistance."],
  ["Mezclador profesional para DJ con distribución tipo club, efectos y sonido de alta calidad.", "Professional DJ mixer with a club-style layout, effects, and high-quality sound."],
  ["Altavoz activo de gran potencia, rendimiento confiable y diseño compacto.", "High-output active speaker with reliable performance and a compact design."],
  ["Altavoz amplificado para eventos en vivo, DJ, salas de conferencias y sistemas de sonido portátiles.", "Powered speaker for live events, DJs, conference rooms, and portable sound systems."],
  ["Micrófono dinámico de radiodifusión para pódcast, transmisiones y grabación en estudio.", "Broadcast dynamic microphone for podcasting, streaming, and studio recording."],
  ["Micrófono vocal dinámico ideal para sonido en vivo, ensayos y eventos profesionales.", "Dynamic vocal microphone ideal for live sound, rehearsals, and professional events."],
  ["Audífonos inalámbricos con cancelación de ruido para producción musical, viajes y uso diario.", "Wireless noise-cancelling headphones for music production, travel, and daily listening."],
  ["Audífonos profesionales de estudio con sonido claro, bajos potentes y almohadillas cómodas.", "Professional studio headphones with clear sound, strong bass, and comfortable ear pads."],
  ["Los audífonos KZ AS10 Cyan utilizan tecnología de armadura equilibrada para ofrecer un sonido claro y detallado, ideal para audiencias exigentes que buscan calidad en cada nota.", "The KZ AS10 Cyan earphones use balanced-armature technology to deliver clear, detailed sound for demanding listeners who value quality in every note."],
  ["La banda sonora de tu vida, en la palma de la mano. El JBL Flip 7 ofrece el sonido JBL para que lo lleves contigo allá donde vayas. Mejorará cualquier experiencia, dondequiera que te lleve la vida.", "The soundtrack of your life in the palm of your hand. The JBL Flip 7 delivers portable JBL sound that enhances every experience wherever life takes you."],
]);

export const translateToEnglish = async (texts) => {
  const uniqueTexts = [...new Set(texts.filter(Boolean))];
  return new Map(uniqueTexts.map((text) => {
    const partyBoxFallback = text.startsWith("Enciende el JBL PartyBox Encore 2 Plus")
      ? "Turn on the JBL PartyBox Encore 2 Plus, grab a wireless microphone, and let the fun begin. Enjoy deep bass, crystal-clear highs, dynamic lights, intelligent EasySing karaoke features, and two feedback-resistant digital wireless microphones in a compact, portable design."
      : null;
    return [text, fallbackTranslations.get(text) || partyBoxFallback || text];
  }));
};

export const getCopToUsdRate = async () => {
  if (exchangeRateCache && Date.now() - exchangeRateCache.updatedAt < CACHE_DURATION_MS) {
    return exchangeRateCache.rate;
  }

  try {
    const response = await fetch("https://open.er-api.com/v6/latest/COP");
    if (!response.ok) throw new Error(`Exchange rate API error: ${response.status}`);
    const result = await response.json();
    const rate = Number(result.rates?.USD);
    if (!rate) throw new Error("USD exchange rate was not returned");

    exchangeRateCache = { rate, updatedAt: Date.now() };
    return rate;
  } catch (error) {
    console.error("Exchange rate service error:", error.message);
    return 1 / Number(process.env.COP_PER_USD_FALLBACK || 4000);
  }
};
