const menu = document.querySelector('.menu');
const nav = document.querySelector('.header nav');

menu?.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menu.setAttribute('aria-expanded', String(isOpen));
});

document.querySelectorAll('.header nav a').forEach((link) => {
  link.addEventListener('click', () => nav.classList.remove('open'));
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

const form = document.getElementById('commissionForm');
form?.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const name = String(data.get('name') || '').trim();
  const email = String(data.get('email') || '').trim();
  const message = String(data.get('message') || '').trim();
  const service = String(data.get('service') || 'Custom commission');

  if (!name || !email || !message) {
    return;
  }

  const subject = encodeURIComponent('Commission enquiry');
  const body = encodeURIComponent(
    `Name: ${name}\nEmail: ${email}\nService: ${service}\n\nProject details:\n${message}`
  );

  window.location.href = `mailto:thecollective.inkanddesign@gmail.com?subject=${subject}&body=${body}`;
});
