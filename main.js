// DiffBell Beta Waitlist Tally Form ID (https://tally.so/r/Gel6jz).
const TALLY_FORM_ID = 'Gel6jz';

const tallyIframe = document.getElementById('tally-waitlist-iframe');
const tallyPlaceholder = document.getElementById('tally-placeholder');
const pageParams = new URLSearchParams(window.location.search);
const incomingRef = (pageParams.get('ref') || '').trim();

function hasRealTallyForm() {
  return Boolean(TALLY_FORM_ID && TALLY_FORM_ID !== 'YOUR_TALLY_FORM_ID');
}

function buildTallyEmbedUrl() {
  const base = `https://tally.so/embed/${encodeURIComponent(TALLY_FORM_ID)}`;
  const params = new URLSearchParams({
    alignLeft: '1',
    hideTitle: '1',
    transparentBackground: '1',
    dynamicHeight: '1',
  });
  if (incomingRef) {
    params.set('ref', incomingRef);
  }
  return `${base}?${params.toString()}`;
}

if (hasRealTallyForm() && tallyIframe) {
  if (tallyPlaceholder) tallyPlaceholder.hidden = true;
  const targetUrl = buildTallyEmbedUrl();
  tallyIframe.setAttribute('data-tally-src', targetUrl);
  if (tallyIframe.getAttribute('src') && tallyIframe.getAttribute('src') !== targetUrl) {
    tallyIframe.setAttribute('src', targetUrl);
  }
  if (window.Tally && typeof window.Tally.loadEmbeds === 'function') {
    window.Tally.loadEmbeds();
  }
}

// --- Expand all / Collapse all FAQ accordion controls (with invoker command fallback) ---
function setAllDetails(accordion, expand) {
  for (const details of accordion.querySelectorAll(':scope > details')) {
    details.open = expand;
  }
}

document.addEventListener(
  'command',
  (event) => {
    if (event.command !== '--toggle-all') return;
    const expand = event.source.getAttribute('aria-expanded') !== 'true';
    setAllDetails(event.target, expand);
  },
  { capture: true },
);

if (!Object.hasOwn(HTMLButtonElement.prototype, 'commandForElement')) {
  const toggleBtn = document.querySelector('[command="--toggle-all"]');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const targetId = toggleBtn.getAttribute('commandfor');
      const accordion = targetId ? document.getElementById(targetId) : null;
      if (!accordion) return;
      const expand = toggleBtn.getAttribute('aria-expanded') !== 'true';
      setAllDetails(accordion, expand);
    });
  }
}

document.addEventListener(
  'toggle',
  (event) => {
    const target = event.target;
    if (!(target instanceof HTMLDetailsElement) || !target.matches('.accordion > details')) {
      return;
    }
    const accordion = target.parentElement;
    const button = accordion?.querySelector('[command="--toggle-all"]');
    if (!accordion || !button) return;
    const items = accordion.querySelectorAll(':scope > details');
    const allOpen = Array.prototype.every.call(items, (d) => d.open);
    button.setAttribute('aria-expanded', String(allOpen));
  },
  { capture: true },
);
