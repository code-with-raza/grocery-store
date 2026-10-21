import "dotenv/config";
import bcrypt from "bcryptjs";
import { randomUUID } from "node:crypto";
import { pool } from "../db/pool.js";
const categoryNames = [
  ["flour", "Atta, Flour & Grains"], ["rice", "Rice"], ["daal", "Daal & Pulses"], ["oil", "Cooking Oil & Ghee"], ["sugar", "Sugar & Salt"], ["spices", "Spices & Masala"], ["tea", "Tea & Coffee"], ["dairy", "Milk & Dairy"], ["eggs", "Eggs"], ["bakery", "Bakery"], ["snacks", "Biscuits & Snacks"], ["beverages", "Beverages"], ["breakfast", "Breakfast & Cereals"], ["canned", "Canned & Packaged Foods"], ["frozen", "Frozen Foods"], ["produce", "Fruits & Vegetables"], ["meat", "Meat & Chicken"], ["personal", "Personal Care"], ["household", "Household Cleaning"], ["baby", "Baby Care"], ["pets", "Pet Supplies"],
];
const demoProducts = [
  ["guard-rice", "Super Kernel Basmati Rice", "Guard", "rice", "5 kg", 1950, "Long-grain aroma for fluffy everyday meals."],
  ["olpers-milk", "Full Cream UHT Milk", "Olpers", "dairy", "1 litre", 370, "Rich, creamy UHT milk packed for freshness."],
  ["national-ketchup", "Chilli Garlic Ketchup", "National", "canned", "1 kg", 495, "Tangy tomato ketchup with a chilli-garlic kick."],
  ["spinach", "Fresh Baby Spinach", "Farm Fresh", "produce", "250 g", 120, "Tender leaves selected fresh for your table."],
  ["tapal-tea", "Tapal Danedar Tea", "Tapal", "tea", "430 g", 890, "A full-bodied blend for the perfect cup of chai."],
  ["shan-biryani", "Sindhi Biryani Masala", "Shan", "spices", "50 g", 110, "A fragrant spice blend for richly flavoured biryani."],
  ["eggs", "Farm Fresh Eggs", "Day Fresh", "eggs", "12 pack", 420, "Farm fresh, quality sorted eggs."],
  ["oreo", "Chocolate Sandwich Biscuits", "Oreo", "snacks", "133 g", 160, "Chocolate biscuits with a smooth vanilla centre."],
  ["sunridge-atta", "Chakki Atta", "Sunridge", "flour", "5 kg", 780, "Stone-ground whole wheat flour for soft rotis."],
  ["masoor-daal", "Masoor Daal", "Al-Habib", "daal", "1 kg", 470, "Carefully cleaned red lentils, a pantry staple."],
  ["millat-sugar", "Refined White Sugar", "Millat", "sugar", "1 kg", 180, "Fine-grain sugar for tea, baking and desserts."],
  ["fresh-bread", "Whole Wheat Bread", "Fresh Bake", "bakery", "400 g", 190, "Soft-sliced whole wheat loaf baked fresh daily."],
  ["pepsi-cola", "Pepsi", "Pepsi", "beverages", "1.5 litre", 190, "Chilled refreshment for the whole family."],
  ["kelloggs-cornflakes", "Corn Flakes", "Kellogg's", "breakfast", "250 g", 490, "Crispy golden flakes for a quick breakfast."],
  ["frozen-peas", "Garden Peas", "K&N's", "frozen", "500 g", 360, "Frozen peas, ready for your favourite recipes."],
  ["meatone-chicken", "Chicken Breast Boneless", "Meat One", "meat", "500 g", 720, "Fresh, chilled boneless chicken breast."],
  ["dettol-handwash", "Antibacterial Hand Wash", "Dettol", "personal", "250 ml", 340, "Gentle everyday hand wash with trusted protection."],
  ["surf-excel", "Surf Excel Detergent Powder", "Surf Excel", "household", "500 g", 390, "Effective stain removal for everyday laundry."],
  ["pampers-wipes", "Baby Gentle Wipes", "Pampers", "baby", "64 pack", 520, "Soft wipes for delicate skin."],
  ["meo-catfood", "Me-O Tuna Cat Food", "Me-O", "pets", "400 g", 450, "Complete tuna-flavour nutrition for adult cats."],
];
const demoBlogs = [
  ["Easy Pantry Meals for Busy Evenings", "easy-pantry-meals-for-busy-evenings", "Recipe ideas for quick family dinners using everyday pantry staples.", "<h2>Easy pantry meals</h2><p>Build quick dinners with rice, daal, pasta, beans and seasonal vegetables. Plan flexible portions and use leftovers for lunch.</p><h2>Conclusion</h2><p>A stocked pantry makes everyday cooking easier and more affordable.</p>", "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=900&q=80"],
  ["How to Plan a Smarter Weekly Grocery Shop", "smarter-weekly-grocery-shop", "Practical grocery planning tips for a simpler weekly shop.", "<h2>Plan before shopping</h2><p>Check your pantry, make a category-based list and buy quantities your household can use.</p><h2>Conclusion</h2><p>A useful list helps reduce food waste and makes grocery shopping faster.</p>", "https://images.unsplash.com/photo-1547592180-85f173990554?w=900&q=80"],
  ["Simple Ways to Keep Produce Fresh Longer", "keep-produce-fresh-longer", "Food storage tips to help fresh produce last longer.", "<h2>Store produce correctly</h2><p>Keep leafy greens dry, separate ethylene-producing fruits and wash produce just before eating.</p><h2>Conclusion</h2><p>Small storage habits help protect freshness and your grocery budget.</p>", "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=900&q=80"],
  ["Make More Meals from Everyday Staples", "budget-meals-from-everyday-staples", "Budget-friendly meal ideas using everyday groceries.", "<h2>Cook with staples</h2><p>Rice, daal, atta, eggs and seasonal vegetables can make varied, filling meals.</p><h2>Conclusion</h2><p>Thoughtful shopping makes affordable family meals easier.</p>", "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=900&q=80"],
];
try {
  const categories = new Map();
  for (let index = 0; index < categoryNames.length; index++) {
    const [slug, name] = categoryNames[index];
    const { rows } = await pool.query("INSERT INTO categories (id,name,slug,sort_order,created_at,updated_at) VALUES ($1,$2,$3,$4,NOW(),NOW()) ON CONFLICT (slug) DO UPDATE SET name=EXCLUDED.name,sort_order=EXCLUDED.sort_order,updated_at=NOW() RETURNING id", [randomUUID(), name, slug, index]);
    categories.set(slug, rows[0]);
  }
  for (const [slug, name] of new Set(demoProducts.map(([, , brand]) => [brand.toLowerCase().replace(/[^a-z0-9]+/g, "-"), brand]))) {
    await pool.query("INSERT INTO brands (id,name,slug,created_at,updated_at) VALUES ($1,$2,$3,NOW(),NOW()) ON CONFLICT (slug) DO UPDATE SET name=EXCLUDED.name,updated_at=NOW()", [randomUUID(), name, slug]);
  }
  for (const [slug, name, brandName, categorySlug, size, price, description] of demoProducts) {
    const brandSlug = brandName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const brand = (await pool.query("SELECT id FROM brands WHERE slug=$1", [brandSlug])).rows[0];
    const product = (await pool.query("INSERT INTO products (id,name,slug,description,category_id,brand_id,created_at,updated_at) VALUES ($1,$2,$3,$4,$5,$6,NOW(),NOW()) ON CONFLICT (slug) DO UPDATE SET name=EXCLUDED.name,description=EXCLUDED.description,category_id=EXCLUDED.category_id,brand_id=EXCLUDED.brand_id,updated_at=NOW() RETURNING id", [randomUUID(), name, slug, description, categories.get(categorySlug).id, brand.id])).rows[0];
    await pool.query("INSERT INTO product_variants (id,product_id,sku,variant_name,price,stock_quantity,low_stock_threshold,created_at,updated_at) VALUES ($1,$2,$3,$4,$5,30,5,NOW(),NOW()) ON CONFLICT (sku) DO UPDATE SET product_id=EXCLUDED.product_id,variant_name=EXCLUDED.variant_name,price=EXCLUDED.price,updated_at=NOW()", [randomUUID(), product.id, `DEMO-${slug.toUpperCase()}`, size, price]);
  }

  if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
    const email = process.env.ADMIN_EMAIL.trim().toLowerCase();
    const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
    await pool.query("INSERT INTO users (id,name,email,password_hash,role,is_active,created_at,updated_at) VALUES ($1,$2,$3,$4,'ADMIN',true,NOW(),NOW()) ON CONFLICT (email) DO UPDATE SET password_hash=EXCLUDED.password_hash,role='ADMIN',is_active=true,updated_at=NOW()", [randomUUID(), process.env.ADMIN_NAME || "Store Admin", email, passwordHash]);
    console.log(`Seeded admin account ${email}`);
  } else {
    console.log("ADMIN_EMAIL and ADMIN_PASSWORD were not set; skipped admin account.");
  }
  for (const [title, slug, excerpt, content, imageUrl] of demoBlogs) {
    await pool.query(
      "INSERT INTO blogs (id,title,slug,excerpt,content,image_url,status) VALUES ($1,$2,$3,$4,$5,$6,'PUBLISHED') ON CONFLICT (slug) DO NOTHING",
      [randomUUID(), title, slug, excerpt, content, imageUrl],
    );
  }
  console.log(`Seeded ${categoryNames.length} categories and ${demoProducts.length} demo products.`);
} finally {
  await pool.end();
}
