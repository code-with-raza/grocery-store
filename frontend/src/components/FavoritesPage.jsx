import { ArrowLeft, Heart } from "lucide-react";
import ProductCard from "./ProductCard.jsx";

export default function FavoritesPage({ products, liked, onBack, onFavorite, onOpen, getQuantity, onQuantity, onAdd }) {
  const saved=products.filter(product=>liked[product.id]);
  return <section className="page-container"><button className="back-link" onClick={onBack}><ArrowLeft size={15}/> My account</button><div className="page-heading"><h1>Saved <em>favourites</em></h1><span>{saved.length} products</span></div>{saved.length?<div className="product-grid">{saved.map(product=><ProductCard key={product.id} product={product} favorite onFavorite={()=>onFavorite(product.id)} onOpen={()=>onOpen(product)} getQuantity={size=>getQuantity(product,size)} onQuantity={(amount,size)=>onQuantity(product,size,amount)} onAdd={size=>onAdd(product,size)}/>)}</div>:<div className="empty-state"><Heart/><h3>No saved favourites</h3><p>Use the heart button on any product to save it here.</p></div>}</section>;
}
