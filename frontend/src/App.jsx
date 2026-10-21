import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, BadgeCheck, ChevronDown, CircleUserRound, Clock3, Cookie, CookingPot, CupSoda, Heart, House, Image, Leaf, LogIn, Mail, MapPin, Menu, Milk, Minus, Package, PackageCheck, Phone, Plus, Search, ShoppingBag, ShoppingBasket, ShoppingCart, Soup, Sparkles, SprayCan, Store, Truck, UserPlus, Wheat, X } from "lucide-react";
import { categories as cats, products as initialProducts, money, readStored } from "./data/storefront.js";
import ProductCard from "./components/ProductCard.jsx";
import AuthPanel from "./components/AuthPanel.jsx";
import AdminPanel from "./components/AdminPanel.jsx";
import AddressBook from "./components/AddressBook.jsx";
import FavoritesPage from "./components/FavoritesPage.jsx";
import CheckoutPage from "./components/CheckoutPage.jsx";
import { API, CATALOG_API } from "./lib/api.js";

const catalogCategoryIds = { "Atta, Rice & Daal": "staples", "Oil & Ghee": "oil", "Milk & Eggs": "dairy", "Spices & Masala": "spices", "Bakery & Breakfast": "bakery", "Biscuits & Snacks": "snacks", "Beverages": "beverages", "Personal Care": "personal", "Household": "household" };
const orderStatusLabel = { CONFIRMED: "Order received", PREPARING: "Processing", OUT_FOR_DELIVERY: "On the way", DELIVERED: "Delivered", CANCELLED: "Cancelled" };
const localCatalogImage = (product) => initialProducts.find(item => item.name?.toLowerCase() === product.name?.toLowerCase() || item.brand?.toLowerCase() === product.brand?.toLowerCase())?.image;
const cartKey=(product,size=product.variants?.[0]?.[0]||product.size||"default")=>`${product.id}::${size}`;
const normalizeCart=(saved,products)=>Object.fromEntries(Object.entries(saved||{}).flatMap(([key,quantity])=>{if(key.includes("::"))return [[key,quantity]];const product=products.find(item=>item.id===key);return product&&quantity>0?[[cartKey(product),quantity]]:[];}));
const getCategoryBySlug = (slug) => cats.find((category) => category.slug === slug || category.id === slug);
const legacyBlogSlugs = { "1": "easy-pantry-meals-for-busy-evenings", "2": "smarter-weekly-grocery-shop", "3": "keep-produce-fresh-longer", "4": "budget-meals-from-everyday-staples" };

const readRoute = () => { const parts = decodeURIComponent(window.location.pathname).split("/").filter(Boolean); const path = window.location.pathname.replace(/\/$/, "") || "/"; const search = new URLSearchParams(window.location.search).get("search") || ""; if ((parts[0] === "category" || parts[0] === "categories") && parts[1]) return { page: "category", category: getCategoryBySlug(parts[1])?.id || "all", search }; if (parts[0] === "products" && parts[1]) return { page: "product", product: parts[1], search }; if (parts[0] === "blog" && parts[1]) { const blogSlug = legacyBlogSlugs[parts[1]] || parts[1]; if (legacyBlogSlugs[parts[1]]) window.history.replaceState({}, "", `/blog/${blogSlug}`); return { page: "blog-detail", blog: blogSlug, search }; } const pages = { "/": "home", "/categories": "categories", "/blog": "blog", "/contact": "contact", "/about": "about", "/press": "press", "/help-center": "help-center", "/returns-policy": "returns-policy", "/delivery-info": "delivery-info", "/delivery-information": "delivery-info", "/privacy-policy": "privacy-policy", "/cart": "cart", "/checkout": "checkout", "/login": "login", "/register": "register", "/account": "account", "/favorites": "favorites", "/addresses": "addresses", "/orders": "orders", "/admin": "admin", "/order-confirmation": "order-success" }; return { page: pages[path] || "home", search }; };
const categoryImage = (categoryId) => initialProducts.find((product) => product.category === categoryId)?.image || initialProducts[0]?.image;
const SALE_CATEGORIES = new Set(["oil", "personal"]);
const salePrice = (product, amount) => SALE_CATEGORIES.has(product.category) && amount != null ? Number(amount) * 0.7 : amount;

const motionProps={};

export default function App(){
 const [remoteBlogs,setRemoteBlogs]=useState([]);
 useEffect(()=>{fetch(`${API}/blogs`).then(response=>response.ok?response.json():null).then(result=>{if(result?.success)setRemoteBlogs(result.data||[]);}).catch(()=>{});},[]);
 const [page,setPage]=useState(()=>readRoute().page),[products,setProducts]=useState(initialProducts),[category,setCategory]=useState(()=>readRoute().category||"all"),[search,setSearch]=useState(()=>readRoute().search),[cart,setCart]=useState(()=>normalizeCart(readStored("gb-cart", {}),initialProducts)),[liked,setLiked]=useState({}),[selected,setSelected]=useState(null),[variant,setVariant]=useState(0),[toast,setToast]=useState(""),[user,setUser]=useState(null),[orders,setOrders]=useState(()=>readStored("gb-orders", [])),[form,setForm]=useState({}),[adminTab,setAdminTab]=useState("Overview"),[mobileMenu,setMobileMenu]=useState(false),[faqQuery,setFaqQuery]=useState("");
 useEffect(()=>{const onPopState=()=>{const route=readRoute();setPage(route.page);setCategory(route.category||"all");setSearch(route.search);if(route.product)setSelected(products.find(p=>p.id===route.product)||null);};window.addEventListener("popstate",onPopState);return()=>window.removeEventListener("popstate",onPopState);},[products]);
 useEffect(()=>{if(page==="product"&&!selected){const route=readRoute();if(route.product)setSelected(products.find(p=>p.id===route.product)||null);}},[page,products,selected]);
useEffect(()=>{fetch(`${CATALOG_API}/api/products`).then(r=>{if(!r.ok)throw new Error("Catalog unavailable");return r.json();}).then(({products:rows=[]})=>{if(rows.length)setProducts(rows.map(p=>{const fallback=localCatalogImage(p);const remoteImages=(p.image_urls||[]).filter(url=>url.startsWith("data:image/")||/\.(jpe?g|png|webp|gif)(\?|$)/i.test(url));const image_urls=remoteImages.length?remoteImages:(fallback?[fallback]:[]);return {id:p.id,name:p.name,brand:p.brand,category:catalogCategoryIds[p.category]||"all",description:p.description,variants:(p.variants||[]).map(size=>[size,Number(p.discount_price ?? p.base_price)]),price:Number(p.discount_price ?? p.base_price),originalPrice:Number(p.base_price),discountPrice:p.discount_price == null ? null : Number(p.discount_price),currency:p.currency||"PKR",image_urls,image:image_urls[0]||null,color:"#edf1e7",size:p.variants?.[0]||""};}));}).catch(()=>{});fetch(`${API}/auth/me`,{credentials:"include"}).then(r=>r.ok?r.json():null).then(r=>{if(r?.success)setUser(r.data.user);}).catch(()=>{});},[]);
 useEffect(()=>{localStorage.setItem("gb-cart",JSON.stringify(cart));},[cart]);
 useEffect(()=>{if(!user){setLiked({});return;}fetch(`${API}/customer/favorites`,{credentials:"include"}).then(response=>response.ok?response.json():null).then(result=>{if(result?.success)setLiked(Object.fromEntries(result.data.map(id=>[id,true])));}).catch(()=>{});fetch(`${API}/customer/orders`,{credentials:"include"}).then(response=>response.ok?response.json():null).then(result=>{if(result?.success)setOrders(result.data.map(order=>({id:order.order_number,date:new Date(order.created_at).toLocaleDateString(),items:order.items,total:Number(order.total_amount),status:order.status})));}).catch(()=>{});},[user]);
 const filtered=useMemo(()=>{const term=search.trim().toLowerCase();return products.filter(p=>(category==="all"||p.category===category)&&(!term||`${p.name} ${p.brand} ${cats.find(c=>c.id===p.category)?.name||""}`.toLowerCase().includes(term)));},[products,category,search]);
 const cartLines=useMemo(()=>products.flatMap(product=>(product.variants||[]).map(([size,price])=>{const key=cartKey(product,size);const quantity=cart[key]||0;return quantity?{product,size,price:salePrice(product,price),quantity,key}:null;}).filter(Boolean)),[products,cart]); const count=cartLines.reduce((total,line)=>total+line.quantity,0), subtotal=cartLines.reduce((total,line)=>total+line.price*line.quantity,0), delivery=subtotal===0||subtotal>=3000?0:200;
 const say=(s)=>{setToast(s);setTimeout(()=>setToast(""),2300)};
 const qty=(id,n)=>setCart(old=>({...old,[id]:Math.max(0,(old[id]||0)+n)}));
 const go=(target,param)=>{if(target==="admin"&&user?.role!=="ADMIN"){say("Admin sign-in is required");target="login";}const selectedCategory=target==="category"?getCategoryBySlug(param):null;const path=target==="home"?"/":target==="category"?`/category/${selectedCategory?.slug||"all"}`:target==="product"?`/products/${param}`:target==="blog-detail"?`/blog/${param}`:target==="order-success"?"/order-confirmation":`/${target}`;window.history.pushState({},"",path);setPage(target);if(target==="category")setCategory(selectedCategory?.id||"all");if(target==="home"||target==="categories")setCategory("all");if(target==="product")setSelected(products.find(p=>p.id===param)||null);setMobileMenu(false);window.scrollTo({top:0,behavior:"smooth"});};
 useEffect(()=>{const routes={"About Us":"about",Blog:"blog",Press:"press","Help Center":"help-center","Returns Policy":"returns-policy","Delivery Info":"delivery-info","Privacy Policy":"privacy-policy"};const handleClick=(event)=>{const link=event.target.closest("a");const target=link&&routes[link.textContent.trim()];if(target){event.preventDefault();go(target);}};document.addEventListener("click",handleClick);return()=>document.removeEventListener("click",handleClick);},[go]);
 useEffect(()=>{const footer=document.querySelector(".footer-brand");if(footer&&!footer.querySelector(".footer-socials")){footer.insertAdjacentHTML("beforeend",'<div class="footer-socials" aria-label="Social media links"><a href="#" aria-label="Facebook">f</a><a href="#" aria-label="Instagram"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1"/></svg></a><a href="#" aria-label="Twitter">𝕏</a></div>');}return()=>footer?.querySelector(".footer-socials")?.remove();},[]);
 const submitSearch=(event)=>{event.preventDefault();const term=search.trim();const normalized=term.toLowerCase();const productMatch=term&&products.find(product=>product.name.toLowerCase()===normalized||product.brand.toLowerCase()===normalized);if(productMatch){setSearch("");go("product",productMatch.id);return;}const categoryMatch=term&&cats.find(c=>c.id!=="all"&&(`${c.name} ${c.slug}`.toLowerCase().includes(normalized)||normalized.includes(c.name.split(",")[0].toLowerCase())));if(categoryMatch){setSearch("");setCategory(categoryMatch.id);go("category",categoryMatch.slug);return;}setSearch(term);setCategory("all");go("category","all");};
 const add=(p,size=p.variants?.[0]?.[0])=>{qty(cartKey(p,size),1);say(`${p.name} added to basket`);};
 const toggleFavorite=async(id)=>{if(!user){go("login");say("Sign in to save favourites");return;}const active=!liked[id];setLiked(old=>({...old,[id]:active}));try{const response=await fetch(`${API}/customer/favorites/${encodeURIComponent(id)}`,{method:active?"PUT":"DELETE",credentials:"include"});if(!response.ok)throw new Error();say(active?"Saved to favourites":"Removed from favourites");}catch{setLiked(old=>({...old,[id]:!active}));say("Could not update favourites");}};
 const blogPosts=remoteBlogs.map(post=>({id:post.id,slug:post.slug,cat:"Good Basket",title:post.title,date:new Date(post.created_at).toLocaleDateString(),image:post.image_url,content:post.content}));
 const header=<><div className="announcement"><Truck size={14}/> Free delivery over <b>Rs. 3,000</b><span className="ann-sep">·</span><Sparkles size={13}/> Freshness, guaranteed</div><header className="site-header"><div className="header-inner"><a className="brand" onClick={()=>go("home")}><span className="brand-mark"><ShoppingBag size={20}/></span><span>good<span className="brand-accent">basket</span><small>YOUR NEIGHBOURHOOD SUPERSTORE</small></span></a><button className="location" onClick={()=>say("Currently serving Lahore")}><MapPin size={16}/><span><small>Delivering to</small><strong>Lahore, Pakistan</strong></span><ChevronDown size={14}/></button><form className="search-box" onSubmit={submitSearch}><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search for groceries, brands & more..." aria-label="Search products"/><button className="search-btn" type="submit"><Search size={14}/>Search</button></form><div className="header-actions"><button className="cart-button" onClick={()=>go("cart")}><span className="cart-icon"><ShoppingCart size={18}/>{count>0&&<i>{count}</i>}</span><span>Basket<small>{money(subtotal)}</small></span></button><button className="account-button" onClick={()=>go(user?"account":"login")}><CircleUserRound size={18}/><span>{user?.name||"Sign in"}<small>{user?"My Account":"Welcome back"}</small></span></button><button className="mobile-menu" onClick={()=>setMobileMenu(!mobileMenu)} aria-label="Toggle menu"><Menu size={18}/></button></div></div></header>{mobileMenu&&<nav className="mobile-nav">{["home","blog","orders","account"].map(p=><button key={p} onClick={()=>go(p)}>{p.charAt(0).toUpperCase()+p.slice(1)}</button>)}</nav>}</>;
 const visibleProducts=page==="home"&&category==="all"&&!search.trim()?filtered.slice(0,8):filtered;
 const productListing=<section className="products-section" id="shop"><div className="section-heading"><div className="section-heading-left"><div className="eyebrow muted">{category==="all"&&!search.trim()?"": "Our Products"}</div><h2>{category==="all"?<>Shop the <em>good stuff</em></>:<>{cats.find(c=>c.id===category)?.name} <em>favourites</em></>}</h2></div><span className="result-count">{visibleProducts.length} products</span></div>{visibleProducts.length?<div className="product-grid">{visibleProducts.map(p=><ProductCard key={p.id} product={p} favorite={Boolean(liked[p.id])} onFavorite={()=>toggleFavorite(p.id)} discount={SALE_CATEGORIES.has(p.category)?0.3:0} getQuantity={size=>cart[cartKey(p,size)]||0} onQuantity={(amount,size)=>qty(cartKey(p,size),amount)} onAdd={size=>add(p,size)} onOpen={()=>{setSelected(p);setVariant(0);go("product",p.id);}}/> )}</div>:<div className="empty-state"><span className="empty-icon"><Package size={24}/></span><h3>No finds just yet</h3><p>Try another search or browse all the aisles.</p><button className="text-link" onClick={()=>{setSearch("");go("categories");}}>See all categories →</button></div>}</section>;
 const home=<>

    {/* ── HERO ── */}
    <div className="hero-wrap">
      <div className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><Truck size={12}/> Same-day delivery in Lahore</div>
          <h1>Fastest <em>Delivery</em><br/>&amp; Easy Pickup.</h1>
          <p>Fresh groceries delivered from your neighbourhood superstore to your door — fast, fresh and affordable.</p>
          <div className="hero-actions">
            <button className="primary-button" onClick={()=>go("categories")}>Order Now <ShoppingCart size={16}/></button>
            <div className="hero-proof"><BadgeCheck size={16}/> 10,000+ happy customers</div>
          </div>
        </div>
        <div className="hero-art">
          <div className="hero-badge"><Truck/><div><strong>Free Delivery</strong><small>Above Rs. 3,000</small></div></div>
          <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=480&q=80" alt="Fresh groceries basket" className="hero-img"/>
        </div>
      </div>
    </div>

    {/* ── SHOP BY CATEGORY ── */}
    <section className="category-section">
      <div className="section-heading">
        <div className="section-heading-left"><div className="eyebrow muted">What are you looking for?</div><h2>Shop By <em>Category</em></h2></div>
        <button className="text-link" onClick={()=>go("categories")}>See all →</button>
      </div>
      <div className="category-list">
        {cats.filter(c=>c.id!=="all").slice(0,8).map((c,i)=>{
          const bgs=["#fff3ea","#e8f5ed","#fff8e1","#f3e5f5","#e3f2fd","#fce4ec","#f1f8e9","#e0f7fa"];
          return <button key={c.id} className="category-tile" onClick={()=>go("category",c.slug)}>
            <span className="category-icon" style={{background:bgs[i%bgs.length]}}><img src={categoryImage(c.id)} alt="" /></span>
            <strong>{c.name}</strong>
            <small>{products.filter(p=>p.category===c.id).length} items</small>
          </button>;
        })}
      </div>
    </section>

    {/* ── PROMO BANNERS ── */}
    <div className="promo-banners">
      <div className="promo-card promo-card-green">
        <div className="promo-copy">
          <small>Everyday clean eating</small>
          <h3>Make your food<br/>healthy &amp; clean<br/>with our products</h3>
          <button className="promo-btn" onClick={()=>go("category","milk-eggs")}>Shop Now <ArrowRight size={14}/></button>
        </div>
        <div className="promo-art"><img src="/products/Gemini_Generated_Image_dcod8kdcod8kdcod.jpg" alt="Fresh produce" /></div>
      </div>
      <div className="promo-card promo-card-lime">
        <div className="promo-copy">
          <small>Start every morning right</small>
          <h3>Make your breakfast<br/>healthy &amp; delicious<br/>every single day</h3>
          <button className="promo-btn" onClick={()=>go("category","bakery-breakfast")}>Shop Now <ArrowRight size={14}/></button>
        </div>
        <div className="promo-art"><img src="/products/Gemini_Generated_Image_4cs7p94cs7p94cs7.jpg" alt="Fresh vegetables" /></div>
      </div>
    </div>

    {/* ── PRODUCTS ── */}
    {productListing}

    {/* ── SALES BANNERS ── */}
    <div className="sales-banner">
      <div className="sales-card sales-card-orange">
        <div className="sales-copy">
          <small>Exclusive brands</small>
          <div className="discount">30% Off</div>
          <h3>On selected brands<br/>this week only</h3>
          <button className="promo-btn" style={{marginTop:12}} onClick={()=>go("category","oil-ghee")}>Claim Now <ArrowRight size={14}/></button>
        </div>
        <span className="sales-emoji"><img src="/products/Gemini_Generated_Image_4cs7p94cs7p94cs7.jpg" alt="Pepsi bottle" /></span>
      </div>
      <div className="sales-card sales-card-green">
        <div className="sales-copy">
          <small>Super sales</small>
          <h3>Vegetables<br/>Organic &amp; Fresh</h3>
          <button className="promo-btn" style={{marginTop:12}} onClick={()=>go("category","milk-eggs")}>Shop Now <ArrowRight size={14}/></button>
        </div>
        <span className="sales-emoji"><img src="/products/Gemini_Generated_Image_dcod8kdcod8kdcod.jpg" alt="Organic spinach" /></span>
      </div>
    </div>

    {/* ── BRAND LOGOS ── */}
    <section className="brands-section">
      <div className="section-heading">
        <div className="section-heading-left"><div className="eyebrow muted">Our Partners</div><h2>Top <em>Brands</em> We Carry</h2></div>
      </div>
      <div className="brands-grid">
        {[
          ["Pepsi", "https://www.clipartmax.com/png/middle/142-1426831_pepsi-logo-png-transparent-image-pepsi-logo-transparent.png"],
          ["Olper's", "https://www.frieslandcampina.com/uploads/sites/7/2023/04/Olpers-Logo-1320x1320.png"],
          ["Shan", "https://upload.wikimedia.org/wikipedia/commons/e/e9/Shan-Logo-PNG.png"],
        ].map(([name, image]) => <div key={name} className="brand-logo"><span><img src={image} alt={`${name} logo`} /></span>{name}</div>)}
      </div>
    </section>

    {/* ── LATEST NEWS BLOG ── */}
    <section className="blog-section">
      <div className="section-heading">
        <div className="section-heading-left"><div className="eyebrow muted">Stay Updated</div><h2>Latest News <em>Blog</em></h2></div>
        <button className="text-link" onClick={()=>go("blog")}>View all →</button>
      </div>
      <div className="blog-grid">
        {blogPosts.map(post=>
          <article key={post.id} className="blog-card" onClick={()=>go("blog-detail",post.slug)}>
            <div className="blog-img"><img src={post.image} alt={post.title}/></div>
            <div className="blog-body">
              <span className="blog-cat">{post.cat}</span>
              <h3>{post.title}</h3>
              <small>{post.date}</small>
            </div>
          </article>)}
      </div>
    </section>

    {/* ── PROMISE STRIP ── */}
    <section className="promise-strip">
      <div><Leaf size={22}/><span><strong>Always Fresh</strong><small>Picked with care, packed fresh daily</small></span></div>
      <div><Truck size={22}/><span><strong>Fast Delivery</strong><small>Across Lahore, same day</small></span></div>
      <div><BadgeCheck size={22}/><span><strong>Best Prices</strong><small>Everyday prices, no hidden fees</small></span></div>
    </section>

    {/* ── NEWSLETTER ── */}
    <section className="newsletter-section">
      <div className="newsletter-card">
        <div className="newsletter-copy">
          <small>Stay in the loop</small>
          <h2>Get updates regularly and best<br/>prices, subscribe us</h2>
          <p>Join thousands of shoppers and get the freshest deals straight to your inbox.</p>
          <div className="newsletter-form">
            <input type="email" placeholder="Enter your email address..."/>
            <button type="button">Subscribe</button>
          </div>
        </div>
        <div className="newsletter-art"><img src="/products/Gemini_Generated_Image_dcod8kdcod8kdcod.jpg" alt="Fresh groceries" /></div>
      </div>
    </section>
  </>;
 const auth=(register)=><AuthPanel register={register} onBack={()=>go("home")} onSwitch={()=>go(register?"login":"register")} notify={say} onSuccess={(account)=>{setUser(account);say("You’re signed in");go(account.role==="ADMIN"?"admin":"home");}}/>;
 const cartPage=<motion.section {...motionProps} className="page-container"><button className="back-link" onClick={()=>go("home")}><ArrowLeft size={15}/> Continue shopping</button><div className="page-heading"><div><div className="eyebrow muted">Good choices so far</div><h1>Your <em>basket</em></h1></div><span>{count} items</span></div>{count?<div className="checkout-layout"><div className="cart-lines">{cartLines.map(({product:p,size,price,quantity,key})=><div className="cart-line" key={key}>{p.image?<img src={p.image} alt=""/>:<span className="cart-photo-placeholder"><Image size={18}/></span>}<div className="line-desc"><strong>{p.name}</strong><small>{size} · {money(price)} each</small></div><div className="quantity-control"><button onClick={()=>qty(key,-1)}><Minus size={14}/></button><b>{quantity}</b><button onClick={()=>qty(key,1)}><Plus size={14}/></button></div><strong>{money(quantity*price)}</strong></div>)}</div><aside className="summary-card"><h3>Order summary</h3><div><span>Subtotal</span><b>{money(subtotal)}</b></div><div><span>Delivery</span><b>{delivery?money(delivery):"Free"}</b></div><div className="summary-total"><span>Total</span><b>{money(subtotal+delivery)}</b></div>{subtotal<3000&&<p>Add {money(3000-subtotal)} for free delivery</p>}<button className="primary-button full-button" onClick={()=>go(user?"checkout":"login")}>Continue to checkout <ArrowRight size={16}/></button><small>Cash on delivery available · Secure checkout</small></aside></div>:<div className="empty-state"><span className="empty-icon"><Package size={24}/></span><h3>Your basket is taking a nap</h3><p>Add a few favourites and we’ll take it from there.</p><button className="primary-button" onClick={()=>go("home")}>Explore the shop <ArrowRight/></button></div>}</motion.section>;
 const account=<motion.section {...motionProps} className="page-container"><div className="page-heading"><div><div className="eyebrow muted">Your Good Basket</div><h1>Hello, <em>{user?.name||"shopper"}</em></h1></div><button className="text-link" onClick={async()=>{await fetch(`${API}/auth/logout`,{method:"POST",credentials:"include"}).catch(()=>{});setUser(null);go("home");}}>Sign out</button></div><div className="account-grid"><button onClick={()=>go("orders")}><PackageCheck/><b>Your orders</b><small>Track recent deliveries</small></button><button onClick={()=>go("favorites")}><Heart/><b>Saved favourites</b><small>Browse and add favourites</small></button><button onClick={()=>go("addresses")}><MapPin/><b>Addresses</b><small>Add an address at checkout</small></button></div><div className="section-heading"><h2>Recent <em>orders</em></h2><button className="text-link" onClick={()=>go("orders")}>View all →</button></div>{orders.slice(0,3).map(o=><div key={o.id} className="order-row"><b>{o.id}</b><span>{o.date}</span><span>{o.items.length} items</span><b>{money(o.total)}</b><span className="status-pill">{orderStatusLabel[o.status] || o.status}</span></div>)}</motion.section>;
 const ordersPage=<motion.section {...motionProps} className="page-container"><button className="back-link" onClick={()=>go("account")}><ArrowLeft size={15}/> My account</button><div className="page-heading"><div><div className="eyebrow muted">From our store to your door</div><h1>Your <em>orders</em></h1></div></div>{orders.length?orders.map(o=><article key={o.id} className="order-card"><div className="order-top"><div><b>{o.id}</b><small>Placed {o.date}</small></div><span className="status-pill"><PackageCheck size={14}/>{orderStatusLabel[o.status] || o.status}</span></div><div className="timeline"><span className="done"><BadgeCheck/>Confirmed</span><i/><span><Clock3/>Preparing</span><i/><span><Truck/>On the way</span></div><div className="order-bottom"><span>{o.items.map(i=>`${i.name} × ${i.qty}`).join(" · ")}</span><b>{money(o.total)}</b></div></article>):<div className="empty-state"><span className="empty-icon"><Package size={24}/></span><h3>No orders yet</h3><p>Your grocery runs will show up here.</p><button className="primary-button" onClick={()=>go("home")}>Start shopping <ArrowRight/></button></div>}</motion.section>;
 const productPage=selected&&<motion.section {...motionProps} className="page-container"><button className="back-link" onClick={()=>go("home")}><ArrowLeft size={15}/> Back to shop</button><div className="product-detail"><div className="detail-image" style={{background:selected.color}}>{selected.image?<img src={selected.image} alt={selected.name}/>:<span className="photo-placeholder"><Image size={34}/><small>Product photo needed</small></span>}</div><div className="detail-copy"><small className="product-brand">{selected.brand}</small><h1>{selected.name}</h1><div className="rating"><span>Available from Good Basket</span></div><p>{selected.description}</p><div className="variant-label">{selected.variants?.length?"Choose a size":"Product information"}</div>{!selected.variants?.length&&<p>Brand, photo, pack size and price are awaiting confirmation.</p>}<div className="variant-list">{(selected.variants||[]).map(([size,price],i)=><button key={size} className={variant===i?"active":""} onClick={()=>setVariant(i)}><span>{size}</span><b>{money(price)}</b></button>)}</div><div className="detail-price">{selected.discountPrice != null&&<><del>{money(selected.originalPrice)}</del><span className="detail-save">Save {Math.round((1-selected.discountPrice/selected.originalPrice)*100)}%</span></>}<strong>{selected.variants?.[variant]?.[1]!=null?money(selected.variants[variant][1]):"Price pending"}</strong><small>Inclusive of applicable taxes</small></div><button className="primary-button" disabled={!selected.variants?.[variant]?.[1]} onClick={()=>{add(selected,selected.variants[variant][0]);}}>Add to basket <ShoppingCart size={16}/></button><div className="detail-promise"><Truck/> Delivered fresh to your door <span>·</span> Lahore</div></div></div></motion.section>;
 const success=<motion.section {...motionProps} className="success-page"><span><BadgeCheck size={36}/></span><div className="eyebrow">Order confirmed</div><h1>Good things are <em>on the way.</em></h1><p>Thank you for shopping with us. Your order has been placed and we’ll take good care of it.</p><button className="primary-button" onClick={()=>go("orders")}>Track your order <ArrowRight/></button><button className="text-link" onClick={()=>go("home")}>Back to shopping</button></motion.section>;
 const categoriesPage=<motion.section {...motionProps} className="page-container category-page"><div className="eyebrow muted">Find your everyday essentials</div><div className="page-heading"><h1>All <em>categories</em></h1><span>{cats.length-1} aisles</span></div><div className="all-categories-grid">{cats.filter(c=>c.id!=="all").map(c=><button key={c.id} className="category-tile" onClick={()=>go("category",c.slug)}><span className="category-icon"><img src={categoryImage(c.id)} alt="" /></span><strong>{c.name}</strong><small>{products.filter(p=>p.category===c.id).length} products <ArrowRight size={12}/></small></button>)}</div></motion.section>;
 const discountedCategories={oil:"Oil & Ghee",personal:"Personal Care"};
 const categoryPage=<motion.section {...motionProps} className="page-container"><button className="back-link" onClick={()=>go("categories")}><ArrowLeft size={15}/> All categories</button>{discountedCategories[category]&&<div className="category-discount-banner"><div><small>Category offer</small><strong>30% Off {discountedCategories[category]}</strong><span>Save on selected products in this category.</span></div><ShoppingCart size={54}/></div>}{productListing}</motion.section>;
 const blogPage=<motion.section {...motionProps} className="page-container blog-page"><button className="back-link" onClick={()=>go("home")}><ArrowLeft size={15}/> Back to shop</button><div className="page-heading"><div><div className="eyebrow muted">Fresh ideas from Good Basket</div><h1>Our <em>blog</em></h1></div><span>{blogPosts.length} stories</span></div><div className="blog-grid blog-page-grid">{blogPosts.map(post=><article key={post.id} className="blog-card" onClick={()=>go("blog-detail",post.slug)}><div className="blog-img"><img src={post.image} alt={post.title}/></div><div className="blog-body"><span className="blog-cat">{post.cat}</span><h3>{post.title}</h3><small>{post.date}</small></div></article>)}</div></motion.section>;
const blogDetail=(()=>{const post=blogPosts.find(item=>item.slug===readRoute().blog)||blogPosts[0];if(!post)return <section className="page-container"><p>Loading blog posts…</p></section>;return <motion.section {...motionProps} className="page-container blog-detail-page"><button className="back-link" onClick={()=>go("blog")}><ArrowLeft size={15}/> All blog posts</button><div className="blog-detail-hero"><img src={post.image} alt={post.title}/><div><span className="blog-cat">{post.cat}</span><h1>{post.title}</h1><small>{post.date}</small></div></div><article className="info-panel blog-article"><div className="blog-article-content" dangerouslySetInnerHTML={{__html:post.content}}/></article></motion.section>;})();
 const infoCopy={about:["About Us",<>Good Basket is a neighbourhood grocery superstore serving Lahore with everyday essentials.<h2>Why shop with us?</h2><ul><li>Fresh pantry, dairy, snacks, beverages, personal care, and household products.</li><li>Clear prices, convenient basket management, and same-day delivery in Lahore.</li><li>Cash on delivery is available at checkout.</li></ul><button className="primary-button" onClick={()=>go("categories")}>Shop Now <ArrowRight size={16}/></button></>],contact:["Contact Us",<>We’re here to help with orders, products, delivery, and account questions.<h2>Get in touch</h2><p>Email: <a href="mailto:hello@goodbasket.pk">hello@goodbasket.pk</a><br/>Phone: +92-300-1234567<br/>Serving Lahore, Pakistan</p></>],press:["Press",<>No verified announcements are currently published. For media enquiries, contact <a href="mailto:hello@goodbasket.pk">hello@goodbasket.pk</a>.</>],"returns-policy":["Returns Policy",<>If an item is damaged, incorrect, expired, or missing, contact Good Basket support with your order details and photos where useful. We will review the order and confirm whether a replacement or refund is available. Eligibility, refund timing, and any deadline depend on the order review; no fixed guarantee is published here.</>],"delivery-info":["Delivery Information",<>Good Basket currently advertises same-day delivery across Lahore. Delivery is free for orders of Rs. 3,000 or more; otherwise checkout currently calculates a Rs. 200 delivery charge. Orders are processed after checkout and delays may occur because of traffic, weather, availability, or service issues. Delivery coverage outside Lahore and exact time windows require confirmation.</>],"privacy-policy":["Privacy Policy",<>The app uses account details, checkout details, order history, basket data, and basic browser storage to provide shopping, authentication, carts, and orders. Payment selection is currently Cash on Delivery; no online payment integration is shown. Data is used to fulfil orders and support the storefront. Sharing, retention periods, cookies beyond local storage, and customer-rights procedures require confirmation before publication.</>]};
 const faqItems=["How do I place an order? Add products to your basket, then continue to checkout and enter delivery details.","Which payment methods are available? Cash on Delivery is currently available; online payments are marked as coming soon.","Where do you deliver? The storefront currently advertises same-day delivery across Lahore.","How do I report a product issue? Contact support with your order details if an item is damaged, incorrect, expired, or missing.","How do I manage my account? Use Sign in to register, log in, view orders, or sign out."];
 const faqResults=faqItems.filter(item=>item.toLowerCase().includes(faqQuery.toLowerCase()));
 const infoPage=infoCopy[page]&&<motion.section {...motionProps} className="page-container info-page"><button className="back-link" onClick={()=>go("home")}><ArrowLeft size={15}/> Back to shop</button><div className="info-hero"><span className="info-hero-icon">{page==="delivery-info"?<Truck size={28}/>:page==="returns-policy"?<Package size={28}/>:<BadgeCheck size={28}/>}</span><div><div className="eyebrow muted">Good Basket</div><h1>{infoCopy[page][0]}</h1></div></div><div className="info-panel"><div className="info-copy">{infoCopy[page][1]}</div></div></motion.section>;
 const contactPage=<motion.section {...motionProps} className="page-container contact-page"><button className="back-link" onClick={()=>go("home")}><ArrowLeft size={15}/> Back to shop</button><div className="eyebrow muted">Good Basket support</div><h1>Contact <em>Us</em></h1><div className="contact-layout"><div className="info-copy"><p>We’re here to help with orders, products, delivery, and account questions.</p><h2>Get in touch</h2><p>Email: <a href="mailto:hello@goodbasket.pk">hello@goodbasket.pk</a><br/>Phone: +92-300-1234567<br/>Serving Lahore, Pakistan</p></div><form className="contact-form" onSubmit={e=>{e.preventDefault();say("Thanks — we’ll get back to you soon");}}><label>Name<input required value={form.contactName||""} onChange={e=>setForm({...form,contactName:e.target.value})}/></label><label>Email<input required type="email" value={form.contactEmail||""} onChange={e=>setForm({...form,contactEmail:e.target.value})}/></label><label>Subject<input required value={form.contactSubject||""} onChange={e=>setForm({...form,contactSubject:e.target.value})}/></label><label>Message<textarea required rows="5" value={form.contactMessage||""} onChange={e=>setForm({...form,contactMessage:e.target.value})}/></label><button className="primary-button" type="submit">Send message <ArrowRight size={16}/></button></form></div></motion.section>;
 const helpPage=<motion.section {...motionProps} className="page-container info-page"><button className="back-link" onClick={()=>go("home")}><ArrowLeft size={15}/> Back to shop</button><div className="eyebrow muted">Support for your shop</div><h1>Help <em>Center</em></h1><input className="faq-search" value={faqQuery} onChange={e=>setFaqQuery(e.target.value)} placeholder="Search orders, products, delivery..." aria-label="Search FAQs"/><div className="faq-list">{faqResults.length?faqResults.map(item=><article key={item}><h3>{item.split("?")[0]}?</h3><p>{item.split("?").slice(1).join("?").trim()}</p></article>):<p>No matching FAQs found.</p>}</div></motion.section>;
 const pageContent=page==="categories"?categoriesPage:page==="category"?categoryPage:page==="blog-detail"?blogDetail:page==="blog"?blogPage:page==="help-center"?helpPage:page==="contact"?contactPage:infoCopy[page]?infoPage:page==="home"?home:page==="login"?auth(false):page==="register"?auth(true):page==="cart"?cartPage:page==="checkout"?<CheckoutPage cartLines={cartLines} subtotal={subtotal} delivery={delivery} money={money} onBack={()=>go("cart")} onAddresses={()=>go("addresses")} notify={say} onPlaced={(order)=>{setOrders(old=>[{id:order.order_number,date:new Date(order.created_at).toLocaleDateString(),items:cartLines.map(({product,size,price,quantity})=>({name:product.name,variant:size,price,qty:quantity})),total:Number(order.total_amount),status:order.status},...old]);setCart({});go("order-success");}}/>:page==="account"?account:page==="orders"?ordersPage:page==="favorites"?<FavoritesPage products={products} liked={liked} onBack={()=>go("account")} onFavorite={toggleFavorite} onOpen={(p)=>{setSelected(p);go("product",p.id);}} getQuantity={(p,size)=>cart[cartKey(p,size)]||0} onQuantity={(p,size,amount)=>qty(cartKey(p,size),amount)} onAdd={add}/>:page==="addresses"?<AddressBook onBack={()=>go("account")} notify={say}/>:page==="product"?productPage:page==="admin"?<AdminPanel onBack={()=>go("home")} notify={say} onUnauthorized={()=>{setUser(null);go("login");say("Admin sign-in is required");}}/>:success;
 const content=<>{page!=="admin"&&<nav className="primary-nav" aria-label="Primary navigation"><button onClick={()=>go("home")} className={page==="home"?"active":""}>Home</button><button onClick={()=>go("categories")} className={page==="categories"?"active":""}>Categories</button><button onClick={()=>go("blog")} className={page==="blog"?"active":""}>Blogs</button><button onClick={()=>go("contact")} className={page==="contact"?"active":""}>Contact Us</button></nav>}{pageContent}</>;
 return <>{page!=="admin"&&header}{page==="admin"&&<header className="admin-mobile-head"><button onClick={()=>go("home")}>← Store</button><b>Good Basket Admin</b><button onClick={()=>setMobileMenu(!mobileMenu)}><Menu size={19}/></button></header>}<main id="top"><AnimatePresence mode="wait"><motion.div key={page} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.12,ease:"easeOut"}}>{content}</motion.div></AnimatePresence></main>{page!=="admin"&&<footer><div className="footer-inner"><div className="footer-brand"><a className="brand" onClick={()=>go("home")}><span className="brand-mark"><ShoppingBag size={18}/></span><span>good<span className="brand-accent">basket</span><small>YOUR NEIGHBOURHOOD SUPERSTORE</small></span></a><p>Your neighbourhood grocery superstore. Fresh products, fast delivery, unbeatable prices across Lahore.</p><div className="footer-contact"><span>📞 +92-300-1234567</span><span>📧 hello@goodbasket.pk</span></div></div><div className="footer-col"><h4>About</h4><ul><li><a onClick={()=>go("home")}>About Us</a></li><li><a>Careers</a></li><li><a>Blog</a></li><li><a>Press</a></li></ul></div><div className="footer-col"><h4>Company</h4><ul><li><a onClick={()=>go("categories")}>All Categories</a></li><li><a onClick={()=>go("cart")}>My Cart</a></li><li><a onClick={()=>go(user?"account":"login")}>My Account</a></li><li><a onClick={()=>go("orders")}>My Orders</a></li></ul></div><div className="footer-col"><h4>Support</h4><ul><li><a>Help Center</a></li><li><a>Returns Policy</a></li><li><a>Delivery Info</a></li><li><a>Privacy Policy</a></li></ul></div><div className="footer-col"><h4>Get in Touch</h4><p style={{color:"rgba(255,255,255,.45)",fontSize:"12px",lineHeight:1.6}}>123 Gulberg III, Lahore, Pakistan</p><div className="footer-apps"><span>📱 Download App</span><small>Coming soon for iOS & Android</small></div></div></div><div className="footer-bottom"><span>© 2026 <b>Good Basket</b> · Your neighbourhood superstore</span><button onClick={()=>go("admin")} style={{border:0,background:"none",color:"rgba(255,255,255,.3)",fontSize:"11px",cursor:"pointer"}}>Admin</button></div></footer>}{toast&&<div className="toast"><BadgeCheck size={14}/> {toast}</div>}</>;
}










