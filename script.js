const nav = document.querySelector('.nav');
const toggle = document.querySelector('.menu-toggle');
toggle?.addEventListener('click', () => nav.classList.toggle('open'));

document.querySelectorAll('.nav a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));

const modal = document.querySelector('#modal');
const title = document.querySelector('#modal-title');
document.querySelectorAll('[data-product]').forEach(btn => {
  btn.addEventListener('click', () => {
    title.textContent = btn.dataset.product;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden','false');
  });
});
document.querySelector('.modal-close')?.addEventListener('click', () => {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden','true');
});
modal?.addEventListener('click', e => {
  if (e.target === modal) modal.classList.remove('open');
});
document.querySelector('#year').textContent = new Date().getFullYear();
