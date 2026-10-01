const header = document.getElementById('header');
const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');
const revealEls = document.querySelectorAll('.reveal');
const propertyCards = [...document.querySelectorAll('.property-card')];
const emptyState = document.getElementById('emptyState');
const typeFilter = document.getElementById('typeFilter');
const neighborhoodFilter = document.getElementById('neighborhoodFilter');
const priceFilter = document.getElementById('priceFilter');
const chips = [...document.querySelectorAll('.chip')];
let activeChip = 'todos';

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 25);
});

menuToggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuToggle.classList.toggle('open', open);
  document.body.classList.toggle('menu-open', open);
  menuToggle.setAttribute('aria-expanded', open);
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuToggle.classList.remove('open');
  document.body.classList.remove('menu-open');
  menuToggle.setAttribute('aria-expanded', 'false');
}));

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: .12 });
revealEls.forEach(el => revealObserver.observe(el));

const counters = document.querySelectorAll('[data-counter]');
let countersStarted = false;
const counterObserver = new IntersectionObserver(entries => {
  if (entries.some(entry => entry.isIntersecting) && !countersStarted) {
    countersStarted = true;
    counters.forEach(counter => {
      const target = +counter.dataset.counter;
      let value = 0;
      const step = Math.max(1, Math.ceil(target / 35));
      const timer = setInterval(() => {
        value += step;
        if (value >= target) {
          value = target;
          clearInterval(timer);
        }
        counter.textContent = target === 48 ? value + 'h' : value + '+';
      }, 35);
    });
  }
}, { threshold: .3 });
const proof = document.querySelector('.hero-proof');
if (proof) counterObserver.observe(proof);

function priceMatches(price, filter) {
  if (filter === 'todos') return true;
  if (filter === 'ate800') return price <= 800000;
  if (filter === '800a1500') return price > 800000 && price <= 1500000;
  if (filter === 'acima1500') return price > 1500000;
  return true;
}

function applyFilters() {
  const type = typeFilter.value;
  const neighborhood = neighborhoodFilter.value;
  const price = priceFilter.value;
  let visible = 0;

  propertyCards.forEach(card => {
    const cardType = card.dataset.type;
    const cardNeighborhood = card.dataset.neighborhood;
    const cardPrice = Number(card.dataset.price);
    const typeMatch = type === 'todos' || cardType === type;
    const chipMatch = activeChip === 'todos' || cardType === activeChip;
    const neighborhoodMatch = neighborhood === 'todos' || cardNeighborhood === neighborhood;
    const valueMatch = priceMatches(cardPrice, price);
    const show = typeMatch && chipMatch && neighborhoodMatch && valueMatch;
    card.classList.toggle('hidden', !show);
    if (show) visible++;
  });

  emptyState.classList.toggle('show', visible === 0);
}

document.getElementById('searchForm').addEventListener('submit', e => {
  e.preventDefault();
  applyFilters();
  document.getElementById('imoveis').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

chips.forEach(chip => {
  chip.addEventListener('click', () => {
    chips.forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    activeChip = chip.dataset.chip;
    typeFilter.value = 'todos';
    applyFilters();
  });
});

document.querySelectorAll('.favorite').forEach(button => {
  button.addEventListener('click', () => {
    button.classList.toggle('active');
    button.textContent = button.classList.contains('active') ? '♥' : '♡';
  });
});

document.getElementById('leadForm').addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('leadName').value.trim();
  const goal = document.getElementById('leadGoal').value;
  const budget = document.getElementById('leadBudget').value;
  const message = `Olá! Meu nome é ${name}. Meu objetivo é: ${goal}. Faixa de investimento: ${budget}. Gostaria de receber uma seleção de imóveis.`;
  window.open('https://wa.me/5562998230185?text=' + encodeURIComponent(message), '_blank', 'noopener');
});

const glow = document.querySelector('.cursor-glow');
window.addEventListener('mousemove', e => {
  if (!glow) return;
  glow.style.left = e.clientX + 'px';
  glow.style.top = e.clientY + 'px';
});

const cards = document.querySelectorAll('.property-card, .neighborhood-card, .hero-card');
cards.forEach(card => {
  card.addEventListener('mousemove', e => {
    if (window.innerWidth < 900) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - .5;
    const y = (e.clientY - rect.top) / rect.height - .5;
    if (card.classList.contains('hero-card')) {
      card.style.transform = `perspective(900px) rotateY(${x * 3}deg) rotateX(${y * -3}deg) rotate(1.3deg)`;
    }
  });
  card.addEventListener('mouseleave', () => {
    if (card.classList.contains('hero-card')) card.style.transform = '';
  });
});
