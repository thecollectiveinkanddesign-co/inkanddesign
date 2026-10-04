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
const openProductPreview = btn => {
  if (!title || !modal || !preview) return;
  const productName = btn.dataset.product;
  const productArt = btn.closest('.product')?.querySelector('.product-art');
  if (!productName || !productArt) return;
  title.textContent = productName;
  preview.replaceChildren(productArt.cloneNode(true));
  preview.setAttribute('role', 'img');
  preview.setAttribute('aria-label', `${productName} preview`);
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
};
const closeModal = () => { if (!modal) return; modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); };
document.querySelectorAll('[data-product]').forEach(btn => btn.addEventListener('click', () => openProductPreview(btn)));
document.querySelectorAll('.product-art[role="button"]').forEach(art => {
  const productButton = art.closest('.product')?.querySelector('[data-product]');
  if (!productButton) return;
  art.addEventListener('click', () => openProductPreview(productButton));
  art.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openProductPreview(productButton); } });
});
document.querySelector('.modal-close')?.addEventListener('click', closeModal);
modal?.addEventListener('click', e => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();
