import { useCallback, useEffect, useState } from "react";
import { API } from "../lib/api.js";
import BlogEditor from "./BlogEditor.jsx";
import ProductEditor from "./ProductEditor.jsx";
import CategoryEditor from "./CategoryEditor.jsx";

const request = async (path, options = {}) => {
  const response = await fetch(`${API}/admin${path}`, { credentials: "include", headers: { "Content-Type": "application/json", ...options.headers }, ...options });
  if (response.status === 204) return null;
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Admin request failed");
  return result.data;
};
const money = value => `Rs. ${Number(value || 0).toLocaleString("en-PK")}`;

export default function AdminPanel({ onBack, onUnauthorized, notify }) {
  const [tab, setTab] = useState("Overview");
  const [data, setData] = useState([]);
  const [overview, setOverview] = useState({});
  const [loading, setLoading] = useState(true);
  const [blogEditor, setBlogEditor] = useState(null);
  const [productEditor, setProductEditor] = useState(null);
  const [categoryEditor, setCategoryEditor] = useState(null);
  const load = useCallback(async () => {
    setLoading(true);
    try {
      if (tab === "Overview") setOverview(await request("/overview"));
      else setData(await request(`/${tab === "Customers" ? "users" : tab.toLowerCase()}?limit=100`) || []);
    } catch (error) {
      if (/sign in|session|admin/i.test(error.message)) onUnauthorized();
      else notify(error.message);
    } finally { setLoading(false); }
  }, [tab, notify, onUnauthorized]);
  useEffect(() => { load(); }, [load]);
  const action = async (path, method, body) => {
    try { await request(path, { method, body: body ? JSON.stringify(body) : undefined }); notify("Saved successfully"); load(); }
    catch (error) { notify(error.message); }
  };
  const saveBlog = async blog => {
    try { await request(blog.id ? `/blogs/${blog.id}` : "/blogs", { method: blog.id ? "PATCH" : "POST", body: JSON.stringify(blog) }); notify("Blog saved successfully"); setBlogEditor(null); load(); }
    catch (error) { notify(error.message); }
  };
  const saveProduct = async product => {
    try { await request(productEditor.id ? `/products/${productEditor.id}` : "/products", { method: productEditor.id ? "PATCH" : "POST", body: JSON.stringify(product) }); notify("Product saved successfully"); setProductEditor(null); load(); }
    catch (error) { notify(error.message); }
  };
  const saveCategory = async category => { try { await request(categoryEditor.id ? `/categories/${categoryEditor.id}` : "/categories", { method: categoryEditor.id ? "PATCH" : "POST", body: JSON.stringify(category) }); notify("Category saved successfully"); setCategoryEditor(null); load(); } catch (error) { notify(error.message); } };
  const deleteCategory = async category => { if (!confirm(`Delete “${category.name}”?`)) return; try { await request(`/categories/${category.id}`, { method: "DELETE" }); notify("Category deleted successfully"); setCategoryEditor(null); load(); } catch (error) { notify(error.message); } };
  if (blogEditor) return <BlogEditor blog={blogEditor.id ? blogEditor : null} onSave={saveBlog} onCancel={() => setBlogEditor(null)} />;
  if (productEditor) return <ProductEditor product={productEditor.id ? productEditor : null} onSave={saveProduct} onCancel={() => setProductEditor(null)} />;
  if (categoryEditor) return <CategoryEditor category={categoryEditor.id ? categoryEditor : null} onSave={saveCategory} onDelete={() => deleteCategory(categoryEditor)} onCancel={() => setCategoryEditor(null)} onEditProduct={product => { setCategoryEditor(null); setProductEditor(product); }} />;
  const tabs = ["Overview", "Orders", "Products", "Categories", "Customers", "Blogs"];
  return <section className="admin-layout">
    <aside className="admin-side"><div className="admin-brand">GOOD BASKET <small>STORE ADMIN</small></div>{tabs.map(item => <button key={item} className={tab === item ? "active" : ""} onClick={() => setTab(item)}>{item}</button>)}<button className="admin-back" onClick={onBack}>← View storefront</button></aside>
    <div className="admin-main"><div className="admin-head"><div><small>Authenticated administrator</small><h1>{tab}</h1></div><span className="status-pill">Database connected</span></div>
      {loading ? <div className="admin-panel">Loading…</div> : tab === "Overview" ? <div className="metric-grid">{[["Gross sales", money(overview.sales)], ["Orders", overview.orders], ["Customers", overview.customers], ["Products", overview.products]].map(([label, value]) => <div key={label}><small>{label}</small><strong>{value}</strong></div>)}</div> : tab === "Categories" ? <div className="admin-panel"><h2>Categories <button onClick={() => setCategoryEditor({})}>+ Add</button></h2>{data.map(category => <div className="admin-order" key={category.id}><b>{category.name}</b><span>{Array.isArray(category.products) ? category.products.length : 0} products</span><button onClick={() => setCategoryEditor(category)}>Open category</button></div>)}</div> : <div className="admin-panel">
        <h2>{tab} management {(tab === "Blogs" || tab === "Products") && <button onClick={() => tab === "Blogs" ? setBlogEditor({}) : setProductEditor({})}>+ Add</button>}</h2>
        {data.length === 0 ? <p>No records found.</p> : data.map(item => {
          if (tab === "Blogs") return <div className="admin-order" key={item.id}><b>{item.title}</b><span>{item.status}</span><button onClick={() => setBlogEditor(item)}>Edit</button><button onClick={() => action(`/blogs/${item.id}`, "PATCH", { status: item.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED" })}>{item.status === "PUBLISHED" ? "Unpublish" : "Publish"}</button><button onClick={() => action(`/blogs/${item.id}`, "DELETE")}>Delete</button></div>;
          if (tab === "Orders") return <div className="admin-order" key={item.id}><b>{item.order_number}</b><span>{item.customer_name}</span><span>{money(item.total_amount)}</span><select value={item.status} onChange={event => action(`/orders/${item.id}/status`, "PATCH", { status: event.target.value })}><option value="CONFIRMED">Order received</option><option value="PREPARING">Processing</option><option value="OUT_FOR_DELIVERY">On the way</option><option value="DELIVERED">Delivered</option><option value="CANCELLED">Cancelled</option></select></div>;
          if (tab === "Products") return <div className="admin-order" key={item.id}><b>{item.name}</b><span>{item.brand}</span><span>{money(item.base_price)}</span><button onClick={() => setProductEditor(item)}>Edit</button><button onClick={() => action(`/products/${item.id}`, "DELETE")}>Delete</button></div>;
          return <div className="admin-order" key={item.id}><b>{item.order_number || item.name || item.email || item.product_name}</b><span>{item.status || item.brand || item.role || item.variant_name}</span></div>;
        })}
      </div>}
    </div>
  </section>;
}
