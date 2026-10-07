const header=document.querySelector('.header');
const menu=document.querySelector('.menu');
menu?.addEventListener('click',()=>{header.classList.toggle('nav-open');menu.setAttribute('aria-expanded',header.classList.contains('nav-open'))});
document.querySelectorAll('nav a').forEach(a=>a.addEventListener('click',()=>header.classList.remove('nav-open')));
const observer=new IntersectionObserver(entries=>entries.forEach(e=>e.isIntersecting&&e.target.classList.add('show')),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
const form=document.getElementById('commissionForm');
form?.addEventListener('submit',e=>{e.preventDefault();const d=new FormData(form);const subject=encodeURIComponent(`Commission enquiry — ${d.get('service')}`);const body=encodeURIComponent(`Name: ${d.get('name')}\nEmail: ${d.get('email')}\nService: ${d.get('service')}\n\nProject details:\n${d.get('message')}`);window.location.href=`mailto:thecollective.inkanddesign@gmail.com?subject=${subject}&body=${body}`});
