'use strict';
(() => {
  const eras = [...document.querySelectorAll('.era')];
  const events = [...document.querySelectorAll('.event')];
  const search = document.querySelector('#search');
  const topic = document.querySelector('#topic');
  const status = document.querySelector('#result-status');
  const pager = document.querySelector('#chapter-pager');
  const reset = document.querySelector('#reset');
  const expand = document.querySelector('#expand');
  const menu = document.querySelector('#menu');
  const menuToggle = document.querySelector('#menu-toggle');
  let selected = eras[0].id;
  let filtered = false;
  function render() {
    const query = search.value.trim().toLowerCase();
    const words = query.split(/\s+/).filter(Boolean);
    filtered = words.length > 0 || topic.value !== 'all';
    let shown = 0;
    let visibleEras = 0;
    for (const era of eras) {
      let count = 0;
      for (const event of era.querySelectorAll('.event')) {
        const matches = (topic.value === 'all' || event.dataset.topic === topic.value) && words.every(word => event.dataset.search.includes(word));
        event.hidden = !matches;
        if (matches) count++;
      }
      era.hidden = count === 0 || (!filtered && selected !== 'all' && selected !== era.id);
      if (!era.hidden) { shown += count; visibleEras++; }
    }
    const era = eras.find(item => item.id === selected);
    status.textContent = filtered ? `${shown} ${shown === 1 ? 'match' : 'matches'} across ${visibleEras} ${visibleEras === 1 ? 'era' : 'eras'}` : selected === 'all' ? `${shown} milestones · All six eras` : `${shown} milestones · ${era.querySelector('.chapter-meta span').textContent}`;
    document.querySelector('#empty').hidden = shown > 0;
    reset.hidden = !filtered;
    document.querySelectorAll('.era-link').forEach(link => {
      if (!filtered && link.dataset.era === selected) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
    pager.hidden = filtered || selected === 'all';
    if (!pager.hidden) {
      const index = eras.findIndex(item => item.id === selected);
      const previous = document.querySelector('#previous');
      const next = document.querySelector('#next');
      previous.hidden = index === 0;
      next.hidden = index === eras.length - 1;
      if (index > 0) previous.href = `#${eras[index - 1].id}`;
      if (index < eras.length - 1) next.href = `#${eras[index + 1].id}`;
    }
    syncExpand();
  }
  function visibleEvents() { return events.filter(event => !event.hidden && !event.closest('.era').hidden); }
  function syncExpand() {
    const visible = visibleEvents();
    const allOpen = visible.length > 0 && visible.every(event => event.open);
    expand.textContent = allOpen ? 'Collapse stories −' : 'Expand stories +';
    expand.disabled = visible.length === 0;
  }
  function clearFilters() { search.value = ''; topic.value = 'all'; }
  function closeMenu(returnFocus = false) {
    menu.hidden = true;
    menuToggle.setAttribute('aria-expanded', 'false');
    if (returnFocus) menuToggle.focus();
  }
  function route(scroll = true) {
    const hash = decodeURIComponent(location.hash.slice(1));
    const target = document.getElementById(hash);
    if (target?.classList.contains('event')) {
      clearFilters();
      selected = target.closest('.era').id;
      render();
      target.open = true;
    } else if (target?.classList.contains('era')) {
      clearFilters();
      selected = target.id;
      render();
    } else if (hash === 'reader') {
      selected = 'all';
      clearFilters();
      render();
    } else if (hash === 'top' || !hash) {
      selected = eras[0].id;
      clearFilters();
      render();
    }
    if (scroll && target) requestAnimationFrame(() => target.scrollIntoView({block:'start'}));
  }
  search.addEventListener('input', render);
  topic.addEventListener('change', render);
  reset.addEventListener('click', () => {clearFilters(); render(); search.focus();});
  expand.addEventListener('click', () => {
    const visible = visibleEvents();
    const open = !visible.every(event => event.open);
    visible.forEach(event => event.open = open);
    syncExpand();
  });
  events.forEach(event => event.addEventListener('toggle', syncExpand));
  menuToggle.addEventListener('click', () => {
    menu.hidden = !menu.hidden;
    menuToggle.setAttribute('aria-expanded', String(!menu.hidden));
    if (!menu.hidden) menu.querySelector('a').focus();
  });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && !menu.hidden) closeMenu(true); });
  document.addEventListener('click', event => {
    const anchor = event.target.closest('a[href^="#"]');
    if (anchor && anchor.getAttribute('href') !== '#') {
      closeMenu();
      // Clicking the current fragment still needs to restore its era after filtering.
      if (anchor.hash === location.hash) route();
    } else if (!menu.hidden && !menu.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
  });
  window.addEventListener('hashchange', () => route());
  let scheduled = false;
  function progress() {
    const max = document.documentElement.scrollHeight - innerHeight;
    document.querySelector('#progress').style.width = `${max > 0 ? Math.min(100, scrollY / max * 100) : 0}%`;
    scheduled = false;
  }
  addEventListener('scroll', () => { if (!scheduled) {scheduled = true; requestAnimationFrame(progress);} }, {passive:true});
  addEventListener('resize', progress);
  route(false);
  render();
  if (location.hash) requestAnimationFrame(() => route());
})();
