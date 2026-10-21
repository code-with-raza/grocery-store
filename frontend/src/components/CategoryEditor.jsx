import { useState } from "react";

export default function CategoryEditor({ category, onSave, onDelete, onCancel, onEditProduct }) {
  const [form, setForm] = useState({ name: category?.name || "", metaTitle: category?.meta_title || "", metaDescription: category?.meta_description || "" });
  const set = (key, value) => setForm(old => ({ ...old, [key]: value }));
  const products = category?.products || [];
  const save = event => { event.preventDefault(); onSave(form); };
  return <section className="admin-editor">
    <div className="admin-editor-head"><button onClick={onCancel}>← Back to categories</button><h1>{category ? "Edit category" : "Add category"}</h1><button className="primary-button" onClick={save}>Save category</button></div>
    <form className="blog-editor-layout" onSubmit={save}><div className="blog-editor-main"><label>Category name<input required maxLength="150" value={form.name} onChange={event => set("name", event.target.value)} /></label>{category && <section className="admin-panel"><h2>Products in this category</h2>{products.length ? products.map(product => <div className="admin-order" key={product.id}><b>{product.name}</b><span>{product.brand}</span><button type="button" onClick={() => onEditProduct(product)}>Edit product</button></div>) : <p>No products in this category.</p>}</section>}</div><aside className="blog-editor-side"><h2>Search engine listing</h2><label>Meta title <small>{form.metaTitle.length}/60</small><input maxLength="60" value={form.metaTitle} onChange={event => set("metaTitle", event.target.value)} placeholder={form.name} /></label><label>Meta description <small>{form.metaDescription.length}/160</small><textarea maxLength="160" value={form.metaDescription} onChange={event => set("metaDescription", event.target.value)} /></label>{category && <button type="button" className="text-link" onClick={onDelete}>Delete category</button>}<button className="primary-button full-button" type="submit">Save category</button></aside></form>
  </section>;
}
