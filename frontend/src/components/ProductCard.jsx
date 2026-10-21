import { useState } from "react";
import { Heart, Image, Minus, Plus } from "lucide-react";

export default function ProductCard({ product, getQuantity = () => 0, onQuantity, onOpen, onAdd, onFavorite, favorite = false, discount = 0 }) {
  const [variantIndex, setVariantIndex] = useState(0);
  const [imageIndex, setImageIndex] = useState(0);
  const [imageFailed, setImageFailed] = useState(false);
  const variants = product.variants || [];
  const images = product.image_urls?.length ? product.image_urls : product.image ? [product.image] : [];
  const variant = variants[variantIndex];
  const size = Array.isArray(variant) ? variant[0] : variant;
  const regularPrice = product.originalPrice ?? (Array.isArray(variant) ? variant[1] : product.price);
  const listedPrice = Array.isArray(variant) ? variant[1] : product.price;
  const price = listedPrice == null ? listedPrice : listedPrice * (product.discountPrice != null ? 1 : 1 - discount);
  const quantity = getQuantity(size);

  const cycleImage = (event) => {
    event.stopPropagation();
    if (images.length < 2) return;
    setImageIndex((index) => (index + 1) % images.length);
    setImageFailed(false);
  };

  return <article className="product-card group relative flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition-shadow hover:shadow-md" onClick={onOpen} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onOpen?.(); } }} role="link" tabIndex={0}>
    <div className="product-image-wrap">
      <button type="button" className={`favorite-button ${favorite ? "active" : ""}`} onClick={(event) => { event.stopPropagation(); onFavorite?.(); }} aria-label={`${favorite ? "Remove" : "Save"} ${product.name} ${favorite ? "from" : "to"} favourites`}><Heart size={18} fill={favorite ? "currentColor" : "none"}/></button>
      <button className="product-image" style={{ backgroundColor: product.color }} onClick={(event) => { event.stopPropagation(); onOpen?.(); }} aria-label={`View ${product.name}`}>
        {images[imageIndex] && !imageFailed
          ? <img loading="lazy" src={images[imageIndex]} alt={`${product.name} product view ${imageIndex + 1}`} onError={() => setImageFailed(true)} />
          : <span className="photo-placeholder"><Image size={24}/><small>Product photo needed</small></span>}
        <span className="product-badge">{!price ? "Details pending" : images.length > 1 ? `${imageIndex + 1} / ${images.length} views` : "Fresh pick"}</span>
      </button>
      {images.length > 1 && <button type="button" className="view-angle" onClick={cycleImage}>View Angle <span aria-hidden="true">↻</span></button>}
    </div>
    <div className="product-info">
      <small className="product-brand">{product.brand}</small>
      <h3>{product.name}</h3>
      {product.description && <p className="product-description">{product.description}</p>}
      {variants.length > 0 ? <label className="variant-select-label">Pack size
        <select className="variant-select block w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-800/20" value={variantIndex} onClick={(event) => event.stopPropagation()} onChange={(event) => { event.stopPropagation(); setVariantIndex(Number(event.target.value)); setImageIndex(0); setImageFailed(false); }} aria-label={`Select ${product.name} variant`}>
          {variants.map((item, index) => <option key={Array.isArray(item) ? item[0] : item} value={index}>{Array.isArray(item) ? item[0] : item}</option>)}
        </select>
      </label> : <span className="product-size">Pack size to confirm</span>}
      <div className="product-buy"><strong>{price != null ? <>{(discount > 0 || product.discountPrice != null) && <del>PKR {Number(regularPrice).toLocaleString("en-PK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</del>}<span>PKR {Number(price).toLocaleString("en-PK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>{(discount > 0 || product.discountPrice != null) && <small className="price-save">Save {Math.round((1 - Number(price) / Number(regularPrice)) * 100)}%</small>}</> : "Price pending"}</strong>
        {quantity ? <div className="quantity-control">
          <button onClick={(event) => { event.stopPropagation(); onQuantity(-1, size); }} aria-label={`Remove one ${product.name}`}><Minus size={14}/></button><b>{quantity}</b>
          <button onClick={(event) => { event.stopPropagation(); onQuantity(1, size); }} aria-label={`Add one ${product.name}`}><Plus size={14}/></button>
        </div> : <button className="add-button" onClick={(event) => { event.stopPropagation(); onAdd(size); }} disabled={price == null}><Plus size={15}/> {price != null ? "Add" : "Pending"}</button>}
      </div>
    </div>
  </article>;
}
