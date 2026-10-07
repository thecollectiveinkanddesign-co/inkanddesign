const header=document.querySelector('.header');
const menu=document.querySelector('.menu');
menu?.addEventListener('click',()=>{header.classList.toggle('nav-open');menu.setAttribute('aria-expanded',header.classList.contains('nav-open'))});
document.querySelectorAll('nav a').forEach(a=>a.addEventListener('click',()=>header.classList.remove('nav-open')));

const portfolioModal=document.getElementById('portfolioModal');
const portfolioModalImage=document.getElementById('portfolioModalImage');
const portfolioModalTitle=document.getElementById('portfolioModalTitle');
const portfolioModalMeta=document.getElementById('portfolioModalMeta');
const portfolioClose=document.querySelector('.portfolio-close');

const openPortfolioModal=card=>{
  if(!portfolioModal||!portfolioModalImage||!portfolioModalTitle||!portfolioModalMeta)return;
  const imageSrc=card.dataset.image||card.querySelector('img')?.src||'';
  const title=card.dataset.title||card.querySelector('strong')?.textContent||'Portfolio piece';
  const meta=card.dataset.meta||card.querySelector('span')?.textContent||'';
  portfolioModalImage.src=imageSrc;
  portfolioModalImage.alt=title;
  portfolioModalTitle.textContent=title;
  portfolioModalMeta.textContent=meta;
  portfolioModal.classList.add('is-open');
  portfolioModal.setAttribute('aria-hidden','false');
  document.body.style.overflow='hidden';
};

const closePortfolioModal=()=>{
  if(!portfolioModal)return;
  portfolioModal.classList.remove('is-open');
  portfolioModal.setAttribute('aria-hidden','true');
  document.body.style.overflow='';
};

document.querySelectorAll('.image-card').forEach(card=>{
  if(card.closest('a'))return;
  card.addEventListener('click',()=>openPortfolioModal(card));
  card.addEventListener('keydown',event=>{
    if(event.key==='Enter'||event.key===' '){
      event.preventDefault();
      openPortfolioModal(card);
    }
  });
});
portfolioClose?.addEventListener('click',closePortfolioModal);
portfolioModal?.addEventListener('click',event=>{if(event.target===portfolioModal)closePortfolioModal();});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&portfolioModal?.classList.contains('is-open'))closePortfolioModal();});
const observer=new IntersectionObserver(entries=>entries.forEach(e=>e.isIntersecting&&e.target.classList.add('show')),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
const form=document.getElementById('commissionForm');
form?.addEventListener('submit',e=>{e.preventDefault();const d=new FormData(form);const subject=encodeURIComponent(`Commission enquiry — ${d.get('service')}`);const body=encodeURIComponent(`Name: ${d.get('name')}\nEmail: ${d.get('email')}\nService: ${d.get('service')}\n\nProject details:\n${d.get('message')}`);window.location.href=`mailto:thecollective.inkanddesign@gmail.com?subject=${subject}&body=${body}`});
