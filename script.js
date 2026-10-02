const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((item) => revealObserver.observe(item));

const escapeHtml = (value) => value.replace(/[&<>'"]/g, (char) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
}[char]));

const ideaImages = {
  'Таиланд': 'assets/thailand.png',
  'Турция': 'assets/ideas/turkey.jpg',
  'Египет': 'assets/ideas/egypt.jpg',
  'Вьетнам': 'assets/vietnam.png',
  'Мальдивы': 'assets/island.png',
  'Китай': 'assets/ideas/china.jpg',
  'Шри-Ланка': 'assets/ideas/sri-lanka.jpg'
};

async function loadIdeas() {
  const grid = document.querySelector('#ideas-grid');
  try {
    const response = await fetch('content/ideas.csv', { cache: 'no-store' });
    if (!response.ok) throw new Error('Не удалось загрузить подборку');
    const lines = (await response.text()).trim().split(/\r?\n/).slice(1);
    const ideas = lines.map((line) => {
      const [country, tag, description, price] = line.split(';').map((item) => item.trim());
      return { country, tag, description, price };
    }).filter((idea) => idea.country);
    grid.innerHTML = ideas.map((idea, index) => `
      <article class="idea-card reveal">
        <img class="idea-image" src="${ideaImages[idea.country] || 'assets/island.png'}" alt="${escapeHtml(idea.country)} — идея для путешествия" loading="lazy">
        <div class="idea-meta"><span>${String(index + 1).padStart(2, '0')}</span><span>${escapeHtml(idea.tag)}</span></div>
        <h3>${escapeHtml(idea.country)}</h3>
        <p>${escapeHtml(idea.description)}</p>
        <div class="idea-bottom"><strong>${escapeHtml(idea.price)}</strong><a class="idea-select" href="#request">Узнать актуальную цену</a></div>
      </article>`).join('');
    grid.querySelectorAll('.reveal').forEach((item) => revealObserver.observe(item));
  } catch {
    grid.innerHTML = '<p class="ideas-loading">Подборка временно недоступна. Напишите Ирине — она предложит актуальные варианты лично.</p>';
  }
}

loadIdeas();

const credentialTrack = document.querySelector('#credential-track');
const credentialCount = document.querySelector('#credential-count');
const slides = [...credentialTrack.querySelectorAll('.credential-slide')];
let credentialIndex = 0;

function showCredential(index) {
  credentialIndex = (index + slides.length) % slides.length;
  credentialTrack.scrollTo({ left: slides[credentialIndex].offsetLeft - credentialTrack.offsetLeft, behavior: 'smooth' });
  credentialCount.textContent = `${credentialIndex + 1} / ${slides.length}`;
}

document.querySelector('#credential-prev').addEventListener('click', () => showCredential(credentialIndex - 1));
document.querySelector('#credential-next').addEventListener('click', () => showCredential(credentialIndex + 1));
credentialTrack.addEventListener('scroll', () => {
  const left = credentialTrack.scrollLeft;
  credentialIndex = slides.reduce((best, slide, index) => Math.abs(slide.offsetLeft - credentialTrack.offsetLeft - left) < Math.abs(slides[best].offsetLeft - credentialTrack.offsetLeft - left) ? index : best, 0);
  credentialCount.textContent = `${credentialIndex + 1} / ${slides.length}`;
}, { passive: true });

const form = document.querySelector('#travel-form');
const result = document.querySelector('#form-result');
const copyButton = document.querySelector('#copy-request');
const sendTelegram = document.querySelector('#send-telegram');
let preparedRequest = '';

form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  preparedRequest = [
    'Заявка на подбор путешествия',
    `Город вылета: ${data.get('departure')}`,
    `Даты: ${data.get('dates')}`,
    `Путешественники: ${data.get('travellers')}`,
    `Бюджет: ${data.get('budget')}`,
    `Направление: ${data.get('destination')}`,
    `Пожелания: ${data.get('wishes') || 'не указаны'}`,
    `Связаться через: ${data.get('channel')}`,
    `Контакт: ${data.get('contact')}`
  ].join('\n');
  const telegramUrl = `https://t.me/Irina0704_Dol?text=${encodeURIComponent(preparedRequest)}`;
  sendTelegram.href = telegramUrl;
  result.hidden = false;
  result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  window.open(telegramUrl, '_blank', 'noopener');
});

copyButton.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(preparedRequest);
    copyButton.textContent = 'Скопировано';
  } catch {
    copyButton.textContent = 'Не удалось скопировать';
  }
});
