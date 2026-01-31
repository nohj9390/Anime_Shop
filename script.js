/* ═══════════════════════════════════════════
   OTAKU VAULT  —  Master Script
   ═══════════════════════════════════════════ */

// ─── PRODUCT DATA ───────────────────────────
const PRODUCTS = [
  { id:1,  name:"Naruto Uzumaki – Sage Mode Figure",        cat:"figures",     price:34.99, badge:"New",       emoji:"🍃", desc:"Highly detailed 1/8 scale figure. Sage mode chakra sculpt. Authentic Bandai." },
  { id:2,  name:"Chainsaw Man – Denji Plush (40 cm)",       cat:"figures",     price:24.99, badge:"Hot",       emoji:"🪓", desc:"Super soft licensed plush. Approx 40 cm tall. Great for any collector." },
  { id:3,  name:"Attack on Titan – Eren Yeager Statue",     cat:"figures",     price:59.99, badge:"Limited",   emoji:"⚔️", desc:"Premium resin statue. Hand-painted details. Certificate of authenticity included." },
  { id:4,  name:"One Piece – Zoro Action Figure",           cat:"figures",     price:29.99, badge:null,        emoji:"🗡️", desc:"Poseable action figure with 3 swords & extra hands. 15 cm tall." },
  { id:5,  name:"Demon Slayer – Hoodie (Official)",         cat:"apparel",     price:44.99, badge:"New",       emoji:"👕", desc:"100 % cotton official hoodie. Tomioka breathing style pattern on back." },
  { id:6,  name:"Jujutsu Kaisen – Gojo T-Shirt",           cat:"apparel",     price:22.99, badge:null,        emoji:"🕶️", desc:"Soft cotton tee. Front print + small back logo. Sizes S–XXL available." },
  { id:7,  name:"Spy x Family – Anya Beanie",              cat:"accessories", price:16.99, badge:"Cute",      emoji:"🧢", desc:"Knitted beanie with Anya's iconic expression embroidered on front." },
  { id:8,  name:"Re:Zero – Rem Keychain Set",              cat:"accessories", price:12.99, badge:null,        emoji:"🔑", desc:"Set of 3 acrylic keychains. Double-sided print. Includes metal ring." },
  { id:9,  name:"My Hero Academia – All Might Poster",     cat:"posters",     price:18.99, badge:"Popular",   emoji:"🖼️", desc:"A2 size official poster. Matte finish. Rolled & protected in tube." },
  { id:10, name:"Steins;Gate – Lab Coat Costume",          cat:"apparel",     price:67.99, badge:"Exclusive", emoji:"🧥", desc:"Full Hacking Lab Coat with patches and ID badge. Sizes M–XL." },
  { id:11, name:"Fullmetal Alchemist – Ed & Al Figures",   cat:"figures",     price:41.99, badge:"Sale",      emoji:"✨", desc:"Two-pack figure set. Edward & Alphonse. Detailed alchemy circle base." },
  { id:12, name:"Neon Genesis – Eva Unit-01 Model Kit",    cat:"accessories", price:38.99, badge:"Builder",   emoji:"🤖", desc:"1/144 scale model kit. 120+ parts. LED compatible (LED sold separately)." },
];

const FAQS = [
  { q:"Are all items officially licensed?",          a:"Yes — we only carry officially licensed merchandise sourced directly from approved distributors, or verified independent artist originals." },
  { q:"How long does shipping take?",                a:"Domestic orders arrive in 3–7 business days. International shipping is 10–21 days depending on your location." },
  { q:"Can I return an item?",                       a:"Absolutely. We offer a 30-day return window on any unopened or unused item. Reach out via our Contact page to start a return." },
  { q:"Do you ship worldwide?",                      a:"Yes! We ship to over 150 countries. Shipping costs are calculated at checkout based on weight and destination." },
  { q:"How do I track my order?",                    a:"Once your order ships, you'll receive an email with a tracking number and a link to track your package in real time." },
  { q:"What payment methods do you accept?",        a:"We accept all major credit cards, PayPal, Apple Pay, and Google Pay. All transactions are SSL encrypted." },
];

// ═══════════════════════════════════════════
// CART  (sessionStorage so it survives page navigations)
// ═══════════════════════════════════════════
function loadCart() {
  try { return JSON.parse(sessionStorage.getItem('ov_cart')) || []; }
  catch { return []; }
}
function saveCart(cart) {
  sessionStorage.setItem('ov_cart', JSON.stringify(cart));
}
function getCart() { return loadCart(); }

function addToCart(id) {
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) return;
  let cart = getCart();
  const existing = cart.find(c => c.id === id);
  if (existing) existing.qty++;
  else cart.push({ id: product.id, name: product.name, price: product.price, emoji: product.emoji, qty: 1 });
  saveCart(cart);
  updateBadge();
  showToast('✅', `<strong>${product.name}</strong><br/>Added to your cart.`);
  // if we're on cart page, re-render
  if (document.getElementById('cartItemsWrap')) renderCartPage();
}

function removeFromCart(id) {
  let cart = getCart().filter(c => c.id !== id);
  saveCart(cart);
  updateBadge();
  if (document.getElementById('cartItemsWrap')) renderCartPage();
}

function changeQty(id, delta) {
  let cart = getCart();
  const item = cart.find(c => c.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(c => c.id !== id);
  saveCart(cart);
  updateBadge();
  if (document.getElementById('cartItemsWrap')) renderCartPage();
}

function updateBadge() {
  const badge = document.getElementById('cartBadge');
  if (!badge) return;
  const total = getCart().reduce((s, c) => s + c.qty, 0);
  badge.textContent = total;
}

// ═══════════════════════════════════════════
// TOAST
// ═══════════════════════════════════════════
let _toastTimer;
function showToast(icon, html) {
  clearTimeout(_toastTimer);
  const t = document.getElementById('toast');
  if (!t) return;
  document.getElementById('toastIcon').textContent = icon;
  document.getElementById('toastText').innerHTML = html;
  t.classList.add('show');
  _toastTimer = setTimeout(() => t.classList.remove('show'), 3200);
}

// ═══════════════════════════════════════════
// NAV  —  highlight current page link  &  hamburger
// ═══════════════════════════════════════════
function initNav() {
  // active link
  const page = window.location.pathname.split('/').pop().replace('.html','') || 'index';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href') || '';
    const name = href.replace('.html','').replace('./','').replace('/','') || 'index';
    if (name === page) a.classList.add('active');
  });
  // badge
  updateBadge();
  // hamburger toggle
  const ham = document.getElementById('hamburger');
  const links = document.querySelector('.nav-links');
  if (ham && links) {
    ham.addEventListener('click', () => {
      ham.classList.toggle('open');
      links.classList.toggle('mobile-open');
    });
  }
}

// ═══════════════════════════════════════════
// PRODUCT CARDS  —  render into any container
// ═══════════════════════════════════════════
function renderCards(containerId, items) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = items.map(p => `
    <div class="product-card">
      <div class="card-img">
        <span class="emoji">${p.emoji}</span>
        ${p.badge ? `<span class="card-badge ${p.badge === 'Sale' ? 'gold' : ''}">${p.badge}</span>` : ''}
      </div>
      <div class="card-body">
        <span class="card-cat">${p.cat}</span>
        <h3 class="card-name">${p.name}</h3>
        <p class="card-desc">${p.desc}</p>
        <div class="card-bottom">
          <span class="card-price">
            $${p.price.toFixed(2)}
            ${p.badge === 'Sale' ? `<span class="old">$${(p.price * 1.2).toFixed(2)}</span>` : ''}
          </span>
          <button class="btn-add" onclick="addToCart(${p.id})">+ Add</button>
        </div>
      </div>
    </div>
  `).join('');
}

// ═══════════════════════════════════════════
// INDEX  —  featured grid  &  marquee (no-op if element missing)
// ═══════════════════════════════════════════
function initIndex() {
  renderCards('featuredGrid', PRODUCTS.slice(0, 6));
}

// ═══════════════════════════════════════════
// MERCHANDISE  —  filter bar  &  full grid
// ═══════════════════════════════════════════
function initMerchandise() {
  const cats = ['all','figures','apparel','accessories','posters'];
  const bar = document.getElementById('filterBar');
  if (!bar) return;
  bar.innerHTML = cats.map(c =>
    `<button class="filter-btn ${c === 'all' ? 'active' : ''}" onclick="filterCategory('${c}')">${c.charAt(0).toUpperCase() + c.slice(1)}</button>`
  ).join('');
  renderCards('shopGrid', PRODUCTS);
}

function filterCategory(cat) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  const btn = [...document.querySelectorAll('.filter-btn')].find(b => b.textContent.toLowerCase() === cat);
  if (btn) btn.classList.add('active');
  renderCards('shopGrid', cat === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.cat === cat));
}

// ═══════════════════════════════════════════
// CART PAGE  —  full renderer
// ═══════════════════════════════════════════
function renderCartPage() {
  const wrap    = document.getElementById('cartItemsWrap');
  const empty   = document.getElementById('cartEmpty');
  const summary = document.getElementById('cartSummary');
  if (!wrap) return;

  const cart = getCart();

  if (cart.length === 0) {
    empty.style.display   = 'block';
    wrap.innerHTML        = '';
    summary.style.display = 'none';
    return;
  }

  empty.style.display   = 'none';
  summary.style.display = 'block';

  wrap.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="ci-thumb">${item.emoji}</div>
      <div class="ci-info">
        <h4>${item.name}</h4>
        <p class="ci-unit">Unit price: <strong>$${item.price.toFixed(2)}</strong></p>
        <div class="ci-qty">
          <button onclick="changeQty(${item.id}, -1)">−</button>
          <span>${item.qty}</span>
          <button onclick="changeQty(${item.id}, 1)">+</button>
          <button class="ci-rm" onclick="removeFromCart(${item.id})">✕ Remove</button>
        </div>
      </div>
      <div class="ci-total">$${(item.price * item.qty).toFixed(2)}</div>
    </div>
  `).join('');

  const sub = cart.reduce((s, c) => s + (c.price * c.qty), 0);
  const tax = sub * 0.08;
  document.getElementById('cpSubtotal').textContent = '$' + sub.toFixed(2);
  document.getElementById('cpTax').textContent      = '$' + tax.toFixed(2);
  document.getElementById('cpTotal').textContent   = '$' + (sub + tax).toFixed(2);
}

function initCart() {
  renderCartPage();
}

function doCheckout() {
  if (getCart().length === 0) return;
  saveCart([]);
  updateBadge();
  renderCartPage();
  showToast('🎉', '<strong>Order placed!</strong><br/>This is a demo — no payment was charged.');
}

// ═══════════════════════════════════════════
// CONTACT FORM
// ═══════════════════════════════════════════
function initContact() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const fname   = document.getElementById('cf-fname').value;
    const subject = document.getElementById('cf-subject').value;
    if (!subject) {
      showToast('⚠️', '<strong>Please select a subject</strong><br/>from the dropdown.');
      return;
    }
    showToast('📧', `<strong>Message sent!</strong><br/>Thanks ${fname} — we'll get back to you soon.`);
    form.reset();
  });
}

// ═══════════════════════════════════════════
// FAQ ACCORDION
// ═══════════════════════════════════════════
function initFaq() {
  const wrap = document.getElementById('faqWrap');
  if (!wrap) return;
  wrap.innerHTML = FAQS.map((f, i) => `
    <div class="faq-item" id="faq${i}">
      <div class="faq-q" onclick="toggleFaq(${i})">
        <h4>${f.q}</h4>
        <span class="faq-icon">+</span>
      </div>
      <div class="faq-a"><p>${f.a}</p></div>
    </div>
  `).join('');
}

function toggleFaq(i) {
  const item = document.getElementById('faq' + i);
  const wasOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(el => el.classList.remove('open'));
  if (!wasOpen) item.classList.add('open');
}

// ═══════════════════════════════════════════
// AUTO-INIT  —  runs once DOM is ready
// ═══════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initIndex();
  initMerchandise();
  initCart();
  initContact();
  initFaq();
});
