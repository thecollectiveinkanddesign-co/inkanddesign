const nav = document.querySelector('.nav');
const toggle = document.querySelector('.menu-toggle');

const setMenuState = isOpen => {
  if (!nav || !toggle) return;
  nav.classList.toggle('open', isOpen);
  toggle.setAttribute('aria-expanded', String(isOpen));
  toggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
};

toggle?.addEventListener('click', () => { setMenuState(!nav.classList.contains('open')); });
document.querySelectorAll('.nav a').forEach(a => { a.addEventListener('click', () => setMenuState(false)); });

const modal = document.querySelector('#modal');
const title = document.querySelector('#modal-title');
const preview = document.querySelector('#modal-preview');
const closeModal = () => { if (!modal) return; modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); };
document.querySelector('.modal-close')?.addEventListener('click', closeModal);
modal?.addEventListener('click', e => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();

/* =========================================================
   COLLECTIVE DESIGNS — FREE STOREFRONT LAYER
   =========================================================
   This adds a real product catalogue + local shopping bag to
   the existing GitHub Pages site. It intentionally stores NO
   Printful/API/payment secrets in the browser.

   Next stage: connect a secure payment/serverless endpoint so
   paid orders can be sent automatically to Printful.
   ========================================================= */
(() => {
  'use strict';

  const PRODUCTS = {
    'Moonlit Notes': { category:'STATIONERY', description:'Moonlit art cards, letter paper and envelopes.', price:null, currency:'ZAR', sizes:['One size'], colors:['Warm cream'], pod:'Printful' },
    'Hollow Art Print': { category:'PRINTS', description:'Gothic botanical archival art print.', price:null, currency:'ZAR', sizes:['A4'], colors:['Warm paper'], pod:'Printful' },
    'Night Garden Sticker Set': { category:'PAPER GOODS', description:'Six illustrated vinyl stickers from the Night Garden.', price:null, currency:'ZAR', sizes:['One size'], colors:['Mixed'], pod:'Printful' }
  };

  const CART_KEY = 'collective-designs-cart-v1';
  const getCart = () => { try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); } catch { return []; } };
  const saveCart = cart => localStorage.setItem(CART_KEY, JSON.stringify(cart));
  const money = (n, currency='ZAR') => n == null ? 'Price to be set' : new Intl.NumberFormat('en-ZA', {style:'currency', currency}).format(n);
  const total = cart => cart.reduce((sum, item) => sum + (Number(item.price) || 0) * item.qty, 0);
  const escapeHtml = s => String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));

  const css = document.createElement('style');
  css.textContent = `
    .cd-storebar{position:fixed;right:22px;bottom:22px;z-index:10000;display:flex;gap:8px;align-items:center}
    .cd-cart-btn{border:1px solid rgba(255,255,255,.28);background:#211522;color:#fff;padding:12px 16px;border-radius:999px;box-shadow:0 12px 35px rgba(0,0,0,.28);font:inherit;cursor:pointer}
    .cd-cart-count{display:inline-grid;place-items:center;min-width:22px;height:22px;margin-left:6px;border-radius:50%;background:#e8c7b7;color:#211522;font-size:.75rem;font-weight:700}
    .cd-cart-btn:hover{transform:translateY(-1px)}
    .cd-product-extra{font-size:.85rem;opacity:.78;margin:8px 0 10px}
    .cd-drawer-backdrop{position:fixed;inset:0;background:rgba(10,6,12,.55);z-index:10001;opacity:0;pointer-events:none;transition:opacity .2s}
    .cd-drawer-backdrop.open{opacity:1;pointer-events:auto}
    .cd-drawer{position:fixed;top:0;right:0;width:min(440px,94vw);height:100%;background:#f4eee6;color:#201820;z-index:10002;transform:translateX(105%);transition:transform .25s;box-shadow:-20px 0 60px rgba(0,0,0,.25);display:flex;flex-direction:column}
    .cd-drawer.open{transform:translateX(0)}
    .cd-drawer-head{display:flex;justify-content:space-between;align-items:center;padding:22px;border-bottom:1px solid rgba(32,24,32,.15)}
    .cd-drawer-head h3{margin:0;font-family:Georgia,serif;font-size:1.35rem}
    .cd-x{border:0;background:none;font-size:28px;cursor:pointer;color:inherit}
    .cd-cart-items{padding:18px 22px;overflow:auto;flex:1}
    .cd-cart-item{padding:15px 0;border-bottom:1px solid rgba(32,24,32,.12)}
    .cd-cart-item-top{display:flex;justify-content:space-between;gap:12px}
    .cd-cart-item strong{font-family:Georgia,serif}
    .cd-cart-meta{font-size:.82rem;opacity:.72;margin-top:5px}
    .cd-qty{display:flex;align-items:center;gap:8px;margin-top:9px}
    .cd-qty button{width:28px;height:28px;border:1px solid rgba(32,24,32,.25);border-radius:50%;background:transparent;cursor:pointer}
    .cd-cart-foot{padding:20px 22px;border-top:1px solid rgba(32,24,32,.15)}
    .cd-total{display:flex;justify-content:space-between;font-weight:700;margin-bottom:14px}
    .cd-checkout{display:block;width:100%;border:0;border-radius:999px;background:#211522;color:#fff;padding:13px 18px;cursor:pointer;font:inherit}
    .cd-note{font-size:.75rem;opacity:.65;margin-top:10px;line-height:1.45}
    .cd-empty{text-align:center;opacity:.65;padding:55px 15px}
    .cd-form-label{display:block;font-size:.78rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;margin-top:9px}
    .cd-size,.cd-color{width:100%;box-sizing:border-box;padding:11px;border-radius:10px;border:1px solid rgba(32,24,32,.2);background:#fff}
    @media(max-width:700px){.cd-storebar{right:12px;bottom:12px}.cd-cart-btn{padding:10px 13px}}
  `;
  document.head.appendChild(css);

  const bar = document.createElement('div');
  bar.className = 'cd-storebar';
  bar.innerHTML = '<button class="cd-cart-btn" type="button" aria-label="Open shopping bag">Bag <span class="cd-cart-count">0</span></button>';
  document.body.appendChild(bar);

  const backdrop = document.createElement('div');
  backdrop.className = 'cd-drawer-backdrop';
  backdrop.innerHTML = `<aside class="cd-drawer" aria-label="Shopping bag"><div class="cd-drawer-head"><h3>Your Night Garden bag</h3><button class="cd-x" type="button" aria-label="Close bag">×</button></div><div class="cd-cart-items"></div><div class="cd-cart-foot"></div></aside>`;
  document.body.appendChild(backdrop);

  const drawer = backdrop.querySelector('.cd-drawer');
  const itemsEl = backdrop.querySelector('.cd-cart-items');
  const footEl = backdrop.querySelector('.cd-cart-foot');
  const countEl = bar.querySelector('.cd-cart-count');

  function renderCart(){
    const cart = getCart();
    countEl.textContent = cart.reduce((n,i)=>n+i.qty,0);
    if(!cart.length){
      itemsEl.innerHTML='<div class="cd-empty">Your bag is waiting for a little magic.<br><br>Add something from the Night Garden.</div>';
      footEl.innerHTML='';
      return;
    }
    itemsEl.innerHTML = cart.map((item, i) => `<div class="cd-cart-item"><div class="cd-cart-item-top"><strong>${escapeHtml(item.name)}</strong><span>${money(item.price*item.qty)}</span></div><div class="cd-cart-meta">${escapeHtml(item.size)} · ${escapeHtml(item.color)}</div><div class="cd-qty"><button type="button" data-minus="${i}">−</button><span>${item.qty}</span><button type="button" data-plus="${i}">+</button><button type="button" data-remove="${i}" style="margin-left:auto;width:auto;padding:0 9px;border-radius:999px">Remove</button></div></div>`).join('');
    const hasPrices = cart.every(i => i.price != null);
    footEl.innerHTML = `<div class="cd-total"><span>Total</span><span>${hasPrices ? money(total(cart)) : 'Price to be set'}</span></div><button class="cd-checkout" type="button" ${hasPrices?'':'disabled style="opacity:.55;cursor:not-allowed"'}>Continue to order</button><div class="cd-note">Printful can manufacture and ship the item after an order is paid. Your payment/API credentials are never stored in this page.</div>`;
  }

  function openBag(){renderCart();backdrop.classList.add('open');drawer.classList.add('open');document.body.style.overflow='hidden';}
  function closeBag(){backdrop.classList.remove('open');drawer.classList.remove('open');document.body.style.overflow='';}
  bar.querySelector('button').addEventListener('click',openBag);
  backdrop.querySelector('.cd-x').addEventListener('click',closeBag);
  backdrop.addEventListener('click',e=>{if(e.target===backdrop)closeBag();});

  backdrop.addEventListener('click', e => {
    const cart=getCart(), target=e.target;
    const idx=Number(target.dataset.minus ?? target.dataset.plus ?? target.dataset.remove);
    if(!Number.isInteger(idx) || !cart[idx]) return;
    if(target.dataset.minus!==undefined) cart[idx].qty=Math.max(0,cart[idx].qty-1);
    if(target.dataset.plus!==undefined) cart[idx].qty+=1;
    if(target.dataset.remove!==undefined) cart.splice(idx,1);
    saveCart(cart.filter(i=>i.qty>0)); renderCart();
  });

  function addProduct(name, size, color){
    const p=PRODUCTS[name]; if(!p) return;
    if(p.price == null){ alert('This product is ready, but its retail price still needs to be set. We will add the Printful product cost and your profit margin next.'); return; }
    const cart=getCart();
    const existing=cart.find(i=>i.name===name&&i.size===size&&i.color===color);
    if(existing) existing.qty+=1; else cart.push({name,size,color,price:p.price,qty:1});
    saveCart(cart); openBag();
  }

  function productDialog(name){
    const p=PRODUCTS[name]; if(!p) return;
    if(!modal||!title||!preview) return;
    title.textContent=name;
    const art=document.querySelector(`[data-product="${CSS.escape(name)}"]`)?.closest('.product')?.querySelector('.product-art');
    preview.replaceChildren(art?art.cloneNode(true):document.createTextNode(''));
    const body=modal.querySelector('.modal-card > p:not(.kicker)');
    if(body) body.textContent=`${p.description} · ${money(p.price)} · print-on-demand with Printful.`;
    modal.querySelector('.cd-modal-buy')?.remove();
    const buy=document.createElement('div'); buy.className='cd-modal-buy';
    buy.innerHTML=`<div class="cd-product-extra">Retail price will be added after we choose the exact Printful product and margin.</div><label class="cd-form-label">Size</label><select class="cd-size">${p.sizes.map(s=>`<option>${escapeHtml(s)}</option>`).join('')}</select><label class="cd-form-label">Colour</label><select class="cd-color">${p.colors.map(s=>`<option>${escapeHtml(s)}</option>`).join('')}</select><button class="button cd-add-to-bag" type="button" style="margin-top:12px;width:100%">Add to bag</button>`;
    const ask=modal.querySelector('.button[href="#contact"]');
    ask?.insertAdjacentElement('beforebegin',buy);
    buy.querySelector('.cd-add-to-bag').addEventListener('click',()=>{addProduct(name,buy.querySelector('.cd-size').value,buy.querySelector('.cd-color').value);});
    modal.classList.add('open'); modal.setAttribute('aria-hidden','false');
  }

  document.querySelectorAll('[data-product]').forEach(btn=>{
    const name=btn.dataset.product;
    btn.textContent='Shop this piece';
    btn.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();productDialog(name);});
  });
  document.querySelectorAll('.product-art[role="button"]').forEach(art=>{
    const btn=art.closest('.product')?.querySelector('[data-product]');
    if(!btn) return;
    art.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();productDialog(btn.dataset.product);});
    art.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();productDialog(btn.dataset.product);}});
  });

  footEl.addEventListener('click', e=>{
    if(!e.target.classList.contains('cd-checkout')) return;
    const cart=getCart();
    if(!cart.length || cart.some(i=>i.price==null)) return;
    const orderLines=cart.map(i=>`${i.qty} × ${i.name} — ${i.size} — ${i.color} — ${money(i.price*i.qty)}`).join('\n');
    const subject=encodeURIComponent(`Collective Designs order request — ${money(total(cart))}`);
    const body=encodeURIComponent(`Hi Collective Designs!\n\nI'd like to place this order:\n\n${orderLines}\n\nTotal: ${money(total(cart))}\n\nName:\nShipping address:\nPhone:\n\nPlease send me the payment/shipping instructions.\n`);
    window.location.href=`mailto:thecollective.inkanddesign@gmail.com?subject=${subject}&body=${body}`;
  });

  renderCart();
})();
