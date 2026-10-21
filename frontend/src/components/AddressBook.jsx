import { useEffect, useState } from "react";
import { ArrowLeft, MapPin, Plus, Trash2 } from "lucide-react";
import { API } from "../lib/api.js";

const emptyAddress = { label: "Home", fullAddress: "", area: "", city: "Lahore", postalCode: "", deliveryInstructions: "", isDefault: true };

export default function AddressBook({ onBack, notify }) {
  const [addresses, setAddresses] = useState([]);
  const [form, setForm] = useState(emptyAddress);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const response = await fetch(`${API}/customer/addresses`, { credentials: "include" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      setAddresses(Array.isArray(result.data) ? result.data : []);
    } catch (error) {
      setAddresses([]);
      notify(error.message || "Could not load addresses");
    } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const change = (event) => setForm({ ...form, [event.target.name]: event.target.type === "checkbox" ? event.target.checked : event.target.value });
  const edit = (address) => {
    setEditing(address.id);
    setForm({ label: address.label || "Home", fullAddress: address.full_address || "", area: address.area || "", city: address.city || "", postalCode: address.postal_code || "", deliveryInstructions: address.delivery_instructions || "", isDefault: Boolean(address.is_default) });
  };
  const submit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`${API}/customer/addresses${editing ? `/${editing}` : ""}`, { method: editing ? "PATCH" : "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      setForm(emptyAddress); setEditing(null); notify("Address saved"); load();
    } catch (error) { notify(error.message || "Could not save address"); }
  };
  const remove = async (id) => {
    const response = await fetch(`${API}/customer/addresses/${id}`, { method: "DELETE", credentials: "include" });
    if (!response.ok) { const result = await response.json(); return notify(result.message || "Could not remove address"); }
    notify("Address removed"); load();
  };

  return <section className="page-container"><button className="back-link" onClick={onBack}><ArrowLeft size={15}/> My account</button><div className="page-heading"><h1>Your <em>addresses</em></h1><p>Saved addresses are used only for new orders. Existing orders keep their original delivery address.</p></div><div className="contact-layout"><div>{loading ? <p>Loading addresses…</p> : addresses.length ? addresses.map(address => <article className="info-panel" key={address.id}><MapPin/><h3>{address.label}{address.is_default ? " · Default" : ""}</h3><p>{address.full_address}<br/>{address.area}, {address.city}</p><button className="text-link" onClick={() => edit(address)}>Edit</button> <button className="text-link" onClick={() => remove(address.id)}><Trash2 size={14}/> Remove</button></article>) : <p>No saved address yet. Add one below for your next order.</p>}</div><form className="contact-form" onSubmit={submit}><h2>{editing ? "Edit" : "Add"} address</h2><label>Label<input required name="label" value={form.label} onChange={change}/></label><label>Street address<input required name="fullAddress" value={form.fullAddress} onChange={change}/></label><label>Area<input required name="area" value={form.area} onChange={change}/></label><label>City<input required name="city" value={form.city} onChange={change}/></label><label className="default-address-toggle"><input type="checkbox" name="isDefault" checked={form.isDefault} onChange={change}/> <span>Use as default</span></label><button className="primary-button"><Plus size={16}/> Save address</button>{editing && <button type="button" className="text-link" onClick={() => { setEditing(null); setForm(emptyAddress); }}>Cancel edit</button>}</form></div></section>;
}
