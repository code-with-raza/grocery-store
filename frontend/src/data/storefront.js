// Products from F:\Grocery Store\Pakistani_Grocery_Catalog_Products
// Images served from /products/ in the Vite public folder

export const categories = [
  { id: "all",       name: "All Products", slug: "all" },
  { id: "staples",   name: "Atta, Rice & Daal", slug: "atta-rice-daal" },
  { id: "oil",       name: "Oil & Ghee", slug: "oil-ghee" },
  { id: "dairy",     name: "Milk & Eggs", slug: "milk-eggs" },
  { id: "spices",    name: "Spices & Masala", slug: "spices-masala" },
  { id: "bakery",    name: "Bakery & Breakfast", slug: "bakery-breakfast" },
  { id: "snacks",    name: "Biscuits & Snacks", slug: "biscuits-snacks" },
  { id: "beverages", name: "Beverages", slug: "beverages" },
  { id: "personal",  name: "Personal Care", slug: "personal-care" },
  { id: "household", name: "Household", slug: "household" },
];

// [id, name, brand, category, variants[[size,price],...], description, imageFile]
const entries = [
  // ── STAPLES ──────────────────────────────────────────────────────────────
  ["chakki-atta", "Chakki Atta", "SunRidge", "staples",
    [["5 kg", 780], ["10 kg", 1520]],
    "100% whole wheat flour, stone-ground for soft, nutritious rotis every day.",
    "Gemini_Generated_Image_hw1ji5hw1ji5hw1j.jpg"],

  ["basmati-rice", "Super Kernel Basmati Rice", "Guard", "staples",
    [["1 kg", 420], ["5 kg", 1950], ["10 kg", 3790]],
    "Long-grain, aromatic basmati rice carefully milled for fluffy, fragrant meals.",
    "Gemini_Generated_Image_ihrfrxihrfrxihrf.jpg"],

  ["masoor-daal", "Masoor Daal (Red Lentils)", "Al-Habib", "staples",
    [["500 g", 245], ["1 kg", 470]],
    "Cleaned and sorted red lentils — a Pakistani kitchen staple.",
    "Gemini_Generated_Image_owpco8owpco8owpc.jpg"],

  ["refined-sugar", "Refined White Sugar", "Millat", "staples",
    [["1 kg", 180], ["5 kg", 870]],
    "Fine-grain 100% pure refined white sugar for tea, baking and desserts.",
    "Gemini_Generated_Image_8y6sa48y6sa48y6s.jpg"],

  // ── OIL & GHEE ───────────────────────────────────────────────────────────
  ["dalda-ghee", "Vanaspati Ghee", "Dalda", "oil",
    [["1 litre", 620], ["2.5 litre", 1480]],
    "Fortified with Vitamins A & D. Ideal for cooking, frying and traditional recipes.",
    "Gemini_Generated_Image_82su2c82su2c82su.jpg"],

  ["dalda-oil-pouch", "Cooking Oil Pouch", "Dalda", "oil",
    [["1 litre", 580], ["2.5 litre", 1350]],
    "Premium quality cooking oil enriched with Vitamins A & D. PSQCA certified.",
    "Gemini_Generated_Image_f1mliwf1mliwf1ml.jpg"],

  ["dalda-oil-bottle", "Fortified Cooking Oil", "Dalda", "oil",
    [["1 litre", 590]],
    "Pure vegetable oil fortified for healthier everyday cooking.",
    "Gemini_Generated_Image_r8r7dxr8r7dxr8r7.jpg"],

  // ── DAIRY & EGGS ─────────────────────────────────────────────────────────
  ["olpers-milk-1", "Full Cream UHT Milk", "Olper's", "dairy",
    [["1 litre", 370]],
    "Rich, creamy milk from quality-checked farms. UHT packed for long-lasting freshness.",
    "Gemini_Generated_Image_9rmf789rmf789rmf.jpg"],

  ["olpers-milk-2", "Full Cream UHT Milk", "Olper's", "dairy",
    [["250 ml", 95], ["1 litre", 370]],
    "Pure, rich & creamy UHT milk. Great for tea, cooking and drinking.",
    "Gemini_Generated_Image_jz4w9pjz4w9pjz4w.jpg"],

  ["day-fresh-eggs", "Farm Fresh Eggs", "Day Fresh", "dairy",
    [["6 pack", 220], ["12 pack", 420]],
    "Premium Grade A farm-fresh eggs, hygienically packed for your family.",
    "Gemini_Generated_Image_5p8hrm5p8hrm5p8h.jpg"],

  ["baby-spinach", "Fresh Baby Spinach", "Farm Fresh", "dairy",
    [["250 g", 120], ["500 g", 220]],
    "Tender, pre-washed baby spinach leaves picked fresh from the farm.",
    "Gemini_Generated_Image_dcod8kdcod8kdcod.jpg"],

  // ── SPICES & MASALA ──────────────────────────────────────────────────────
  ["shan-bombay-biryani", "Bombay Biryani Masala", "Shan", "spices",
    [["60 g", 110], ["120 g", 205]],
    "Authentic Bombay biryani spice blend for a richly aromatic rice dish.",
    "Gemini_Generated_Image_embjkuembjkuembj.jpg"],

  ["shan-sindhi-biryani", "Sindhi Biryani Masala", "Shan", "spices",
    [["50 g", 110], ["250 g", 350]],
    "Fragrant & bold authentic recipe mix for classic Sindhi biryani.",
    "Gemini_Generated_Image_xpezw8xpezw8xpez.jpg"],

  ["national-chilli-box", "Chilli Powder", "National", "spices",
    [["100 g", 130], ["200 g", 240]],
    "Premium Childer chilli powder. 100% pure with vibrant colour and heat.",
    "Gemini_Generated_Image_pqce5kpqce5kpqce.jpg"],

  ["national-chilli-bag", "Chilli Powder Pouch", "National", "spices",
    [["200 g", 240]],
    "100% pure bright red chilli powder for everyday cooking.",
    "Gemini_Generated_Image_vqax57vqax57vqax.jpg"],

  ["shan-coriander", "Coriander Powder", "Shan", "spices",
    [["100 g", 130], ["200 g", 240]],
    "Pure, freshly ground coriander powder for authentic Pakistani flavours.",
    "Gemini_Generated_Image_gyryu5gyryu5gyry.jpg"],

  ["national-ketchup", "Chilli Garlic Ketchup", "National", "spices",
    [["300 g", 200], ["800 g", 450]],
    "A tangy ketchup with real chillies & garlic — great as a dip or sauce.",
    "Gemini_Generated_Image_efqj0hefqj0hefqj.jpg"],

  ["mitchells-jam", "Mixed Fruit Jam", "Mitchell's", "snacks",
    [["430 g", 340]],
    "Classic mixed fruit jam made with real fruit pieces. Perfect with bread.",
    "Gemini_Generated_Image_61gaxw61gaxw61ga.jpg"],

  // ── BAKERY & BREAKFAST ───────────────────────────────────────────────────
  ["whole-wheat-bread", "Whole Wheat Bread", "Fresh Bake", "bakery",
    [["400 g", 190]],
    "Soft-sliced whole wheat loaf baked fresh. Healthy & nutritious.",
    "Gemini_Generated_Image_mpci9mpci9mpci9m.jpg"],

  ["kelloggs-cornflakes", "Corn Flakes", "Kellogg's", "bakery",
    [["250 g", 490], ["500 g", 890]],
    "The original & best crispy golden flakes for a great start to the day.",
    "Gemini_Generated_Image_pzzmscpzzmscpzzm.jpg"],

  ["tapal-tea", "Tapal Danedar Tea", "Tapal", "bakery",
    [["95 g", 230], ["250 g", 570], ["430 g", 890]],
    "Premium Danedar blend for a full-bodied, aromatic cup of chai.",
    "Gemini_Generated_Image_hamyfhhamyfhhamy.jpg"],

  // ── BEVERAGES ────────────────────────────────────────────────────────────
  ["pepsi-bottle", "Pepsi Cola", "Pepsi", "beverages",
    [["500 ml", 100], ["1.5 litre", 190]],
    "Ice-cold, refreshing Pepsi. Perfect for meals and gatherings.",
    "Gemini_Generated_Image_4cs7p94cs7p94cs7.jpg"],

  ["rooh-afza", "Rooh Afza Sharbat", "Hamdard", "beverages",
    [["800 ml", 490]],
    "Pakistan's iconic rose-flavoured syrup. Refreshing in milk, water or lassi.",
    "Gemini_Generated_Image_7j8wyz7j8wyz7j8w.jpg"],

  // ── BISCUITS & SNACKS ────────────────────────────────────────────────────
  ["oreo-biscuits", "Chocolate Sandwich Biscuits", "Oreo", "snacks",
    [["109 g", 160], ["288 g", 330]],
    "Crispy chocolate biscuits filled with smooth vanilla-flavoured cream.",
    "Gemini_Generated_Image_om1x8com1x8com1x.jpg"],

  // ── PERSONAL CARE ────────────────────────────────────────────────────────
  ["dettol-gold", "Antibacterial Hand Wash Original", "Dettol", "personal",
    [["250 ml", 340]],
    "Kills 99.9% of germs. Trusted antibacterial protection for the whole family.",
    "Gemini_Generated_Image_bohixqbohixqbohi.jpg"],

  ["dettol-white", "Antibacterial Hand Wash", "Dettol", "personal",
    [["250 ml", 320]],
    "New formula — kills 99.9% of germs while being gentle on skin.",
    "Gemini_Generated_Image_c8bonfc8bonfc8bo.jpg"],

  ["english-toothpaste", "Anticavity Toothpaste", "English", "personal",
    [["100 g", 120]],
    "Fluoride toothpaste for strong teeth and fresh breath.",
    "Gemini_Generated_Image_d2ithmd2ithmd2it.jpg"],

  // ── HOUSEHOLD ────────────────────────────────────────────────────────────
  ["surf-excel", "Surf Excel Detergent Powder", "Surf Excel", "household",
    [["500 g", 390], ["1 kg", 740]],
    "Powerful stain removal for front load and top load washing machines.",
    "Gemini_Generated_Image_rb635hrb635hrb63.jpg"],

  ["bonus-tristar", "Bonus Tristar Washing Powder", "Bonus", "household",
    [["1 kg", 320], ["5 kg", 1450]],
    "Active Wash formula for brilliant whites and sparkling clean clothes.",
    "Gemini_Generated_Image_qjoqcsqjoqcsqjoq.jpg"],
];

export const products = entries.map(([id, name, brand, category, variants, description, imageFile]) => ({
  id,
  name,
  brand,
  category,
  variants,
  description,
  color: "#f5f5f0",
  size: variants[0]?.[0] || "",
  price: variants[0]?.[1] ?? null,
  image: `/products/${imageFile}`,
}));

export const money = (amount) => `Rs. ${Number(amount).toLocaleString("en-PK")}`;

export const readStored = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    if (!value) return fallback;
    const parsed = JSON.parse(value);
    if (key === "gb-orders") return Array.isArray(parsed) ? parsed : fallback;
    if (key === "gb-cart") return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : fallback;
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
};
