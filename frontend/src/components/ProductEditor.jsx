import { useEffect, useState } from "react";
import { API } from "../lib/api.js";

const toId = value => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export default function ProductEditor({ product, onSave, onCancel }) {
  const [form, setForm] = useState({
    id: product?.id || "", name: product?.name || "", brand: product?.brand || "", category: product?.category || "",
    variants: (product?.variants || []).join("\n"), basePrice: product?.base_price || "", discountPrice: product?.discount_price ?? "",
    description: product?.description || "", metaTitle: product?.meta_title || "", metaDescription: product?.meta_description || "",
    imageUrls: (product?.image_urls || []).join("\n"), stockQuantity: product?.stock_quantity ?? 0, lowStockThreshold: product?.low_stock_threshold ?? 5, status: product?.status || "PUBLISHED",
  });
  const [categories, setCategories] = useState([]);
  const [addingCategory, setAddingCategory] = useState(false);
  useEffect(() => { fetch(`${API}/admin/categories`, { credentials: "include" }).then(response => response.ok ? response.json() : null).then(result => { if (result?.success) setCategories(result.data.map(category => category.name)); }).catch(() => {}); }, []);
  const set = (key, value) => setForm(old => ({ ...old, [key]: value }));
  const uploadImage = event => {
    const file = event.target.files?.[0];
    if (!file || file.size > 500 * 1024) return alert("Choose an image smaller than 500 KB.");
    const reader = new FileReader();
    reader.onload = () => set("imageUrls", [reader.result, ...form.imageUrls.split("\n").filter(Boolean)].slice(0, 10).join("\n"));
    reader.readAsDataURL(file);
  };
  const save = event => {
    event.preventDefault();
    const discountPrice = form.discountPrice === "" ? null : Number(form.discountPrice);
    if (discountPrice != null && discountPrice >= Number(form.basePrice)) return alert("Discounted price must be lower than regular price.");
    onSave({ ...form, id: product?.id || toId(form.id || form.name), basePrice: Number(form.basePrice), discountPrice, stockQuantity: Number(form.stockQuantity), lowStockThreshold: Number(form.lowStockThreshold), variants: form.variants.split("\n").map(value => value.trim()).filter(Boolean), imageUrls: form.imageUrls.split("\n").map(value => value.trim()).filter(Boolean) });
  };
  return <section className="admin-editor">
    <div className="admin-editor-head"><button onClick={onCancel}>← Back to products</button><h1>{product ? "Edit product" : "Add product"}</h1><button className="primary-button" onClick={save}>Save product</button></div>
    <form className="blog-editor-layout" onSubmit={save}>
      <div className="blog-editor-main">
        <label>Title <small>{form.name.length}/60</small><input required maxLength="60" value={form.name} onChange={event => set("name", event.target.value)} /></label>
        {!product && <label>Product ID<input value={form.id} onChange={event => set("id", toId(event.target.value))} placeholder="Generated from title if empty" /></label>}
        <div className="product-editor-fields">
          <label>Brand<input required value={form.brand} onChange={event => set("brand", event.target.value)} /></label>
          <label>Category<select value={addingCategory ? "__new__" : form.category} onChange={event => { const value = event.target.value; setAddingCategory(value === "__new__"); if (value !== "__new__") set("category", value); }}><option value="" disabled>Select category</option>{form.category && !addingCategory && !categories.includes(form.category) && <option value={form.category}>{form.category}</option>}{categories.map(category => <option key={category} value={category}>{category}</option>)}<option value="__new__">+ Add new category</option></select>{addingCategory && <input required autoFocus value={form.category} onChange={event => set("category", event.target.value)} placeholder="New category name" />}</label>
          <label>Regular price (PKR)<input required min="1" type="number" value={form.basePrice} onChange={event => set("basePrice", event.target.value)} /></label>
          <label>Discounted price (PKR)<input min="0" type="number" value={form.discountPrice} onChange={event => set("discountPrice", event.target.value)} placeholder="Optional" /></label>
          <label>Quantity<input min="0" type="number" value={form.stockQuantity} onChange={event => set("stockQuantity", event.target.value)} /></label>
          <label>Low stock alert<input min="0" type="number" value={form.lowStockThreshold} onChange={event => set("lowStockThreshold", event.target.value)} /></label>
          <label>Status<select value={form.status} onChange={event => set("status", event.target.value)}><option value="PUBLISHED">Published</option><option value="DRAFT">Draft</option></select></label>
        </div>
        <label>Variants <small>one grocery pack size per line</small><textarea required value={form.variants} onChange={event => set("variants", event.target.value)} /></label>
        <label>Description<textarea required maxLength="1000" value={form.description} onChange={event => set("description", event.target.value)} /></label>
        <label>Image URLs <small>one per line, up to 10</small><textarea value={form.imageUrls} onChange={event => set("imageUrls", event.target.value)} placeholder="https://..." /></label>
        <label className="upload-image">Upload image from computer <small>PNG, JPG or WebP — max 500 KB</small><input type="file" accept="image/png,image/jpeg,image/webp" onChange={uploadImage} /></label>
      </div>
      <aside className="blog-editor-side"><h2>Search engine listing</h2><label>Meta title <small>{form.metaTitle.length}/60</small><input maxLength="60" value={form.metaTitle} onChange={event => set("metaTitle", event.target.value)} placeholder={form.name} /></label><label>Meta description <small>{form.metaDescription.length}/160</small><textarea maxLength="160" value={form.metaDescription} onChange={event => set("metaDescription", event.target.value)} /></label><button className="primary-button full-button" type="submit">Save product</button></aside>
    </form>
  </section>;
}
