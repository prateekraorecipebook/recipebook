(() => {
  const themeStyles = document.createElement('link');
  themeStyles.rel = 'stylesheet';
  themeStyles.href = new URL('recipe-dark.css', document.currentScript.src).href;
  document.head.append(themeStyles);
  let toggle = document.querySelector('[data-theme-toggle]');
  if (!toggle && document.querySelector('.recipe-nav')) {
    toggle = document.createElement('button');
    toggle.className = 'theme-toggle';
    toggle.type = 'button';
    toggle.dataset.themeToggle = '';
    toggle.innerHTML = '<span aria-hidden="true">◐</span> Theme';
    document.querySelector('.recipe-nav').insertBefore(toggle, document.querySelector('.recipe-nav a:last-child'));
  }
  const storedTheme = () => { try { return localStorage.getItem('recipe-book-theme'); } catch { return null; } };
  const setTheme = theme => { document.documentElement.dataset.theme = theme; try { localStorage.setItem('recipe-book-theme', theme); } catch {} toggle?.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`); };
  setTheme(storedTheme() || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
  toggle?.addEventListener('click', () => setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'));
  const root = document.querySelector('[data-recipe]');
  if (!root) return;
  const originalServings = Number(root.dataset.servings);
  const output = document.querySelector('[data-serving-output]');
  const setServings = value => {
    const servings = Math.max(1, Number(value) || originalServings); const ratio = servings / originalServings;
    output.textContent = servings;
    document.querySelectorAll('[data-base-qty]').forEach(el => {
      const amount = Number(el.dataset.baseQty) * ratio;
      el.textContent = Number.isInteger(amount) ? amount : Math.round(amount * 100) / 100;
    });
  };
  document.querySelector('[data-serving-down]').addEventListener('click', () => setServings(Number(output.textContent)-1));
  document.querySelector('[data-serving-up]').addEventListener('click', () => setServings(Number(output.textContent)+1));
  document.querySelectorAll('[data-timer]').forEach(timer => {
    let remaining = Number(timer.dataset.timer), interval; const button = timer.querySelector('button'), display = timer.querySelector('span');
    const show = () => display.textContent = `${String(Math.floor(remaining/60)).padStart(2,'0')}:${String(remaining%60).padStart(2,'0')}`;
    show(); button.addEventListener('click', () => {
      if (interval) { clearInterval(interval); interval = null; button.textContent='Resume'; return; }
      button.textContent='Pause'; interval = setInterval(() => { if (remaining <= 1) { remaining=0; clearInterval(interval); interval=null; button.textContent='Done!'; timer.classList.add('finished'); try { navigator.vibrate?.([120,80,120]); } catch {} } else remaining--; show(); },1000);
    });
  });
})();
