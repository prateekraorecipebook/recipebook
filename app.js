const state = { recipes: [], filters: {}, pantry: [] };
const filterGroups = [['cuisine','Cuisine'],['course','Course'],['diet','Diet'],['meal','Meal'],['difficulty','Difficulty'],['time','Time']];
const $ = selector => document.querySelector(selector);
const norm = value => value.toLowerCase().trim();

function valuesFor(key) {
  if (key === 'time') return ['Under 30 min', '30–45 min', 'Over 45 min'];
  return [...new Set(state.recipes.flatMap(r => key === 'difficulty' ? [r.difficulty] : r[key]))].sort();
}
function renderFilters() {
  $('#filterGroups').innerHTML = filterGroups.map(([key,label]) => `<label class="filter"><select data-filter="${key}" aria-label="Filter by ${label}"><option value="">${label}: all</option>${valuesFor(key).map(v=>`<option>${v}</option>`).join('')}</select></label>`).join('');
  document.querySelectorAll('[data-filter]').forEach(el => el.addEventListener('change', e => { state.filters[e.target.dataset.filter] = e.target.value; render(); }));
}
function matchesTime(minutes, filter) { return !filter || (filter === 'Under 30 min' && minutes < 30) || (filter === '30–45 min' && minutes >= 30 && minutes <= 45) || (filter === 'Over 45 min' && minutes > 45); }
function matchingRecipes() {
  const query = norm($('#search').value || '');
  return state.recipes.filter(r => {
    const haystack = [r.title,r.description,...r.cuisine,...r.course,...r.diet,...r.meal,...r.ingredients,...r.tags,r.difficulty].join(' ').toLowerCase();
    return (!query || haystack.includes(query)) && filterGroups.every(([key]) => {
      const f = state.filters[key]; if (!f) return true;
      return key === 'time' ? matchesTime(r.timeMinutes,f) : key === 'difficulty' ? r.difficulty === f : r[key].includes(f);
    });
  }).map(r => ({...r, match: state.pantry.length ? r.ingredients.filter(i => state.pantry.some(p => i.includes(p) || p.includes(i))).length : 0})).sort((a,b) => b.match - a.match || a.title.localeCompare(b.title));
}
function render() {
  const recipes = matchingRecipes(); const pantryMode = state.pantry.length > 0;
  $('#resultsTitle').textContent = pantryMode ? 'Best pantry matches' : 'All recipes';
  $('#count').textContent = `${recipes.length} recipe${recipes.length === 1 ? '' : 's'}${pantryMode ? ' · ranked by match' : ''}`;
  $('#recipeGrid').innerHTML = recipes.length ? recipes.map(r => `<a class="recipe-card" style="--card:${r.accent}26;border-top:5px solid ${r.accent}" href="${r.url}"><div><div class="card-meta"><span>${r.timeMinutes} min</span><span>·</span><span>${r.difficulty}</span>${pantryMode ? `<span>· ${r.match}/${r.ingredients.length} on hand</span>` : ''}</div><h3>${r.title}</h3><p>${r.description}</p></div><div class="chip-row">${r.cuisine.slice(0,1).concat(r.diet.slice(0,1)).map(v=>`<span class="chip">${v}</span>`).join('')}</div></a>`).join('') : '<p class="empty">No recipes fit those filters. Try clearing one or searching more broadly.</p>';
}
async function init() {
  state.recipes = window.RECIPE_CATALOG || await fetch('data/recipes.json').then(r => r.json()); renderFilters(); render();
  $('#search').addEventListener('input', render);
  $('#clearFilters').addEventListener('click', () => { state.filters = {}; $('#search').value = ''; state.pantry=[]; $('#pantryIngredients').value=''; renderFilters(); render(); });
  $('#findMatches').addEventListener('click', () => { state.pantry = $('#pantryIngredients').value.split(',').map(norm).filter(Boolean); render(); document.querySelector('.results-head').scrollIntoView({behavior:'smooth'}); });
  const toggle = $('[data-theme-toggle]');
  const storedTheme = () => { try { return localStorage.getItem('recipe-book-theme'); } catch { return null; } };
  const setTheme = theme => { document.documentElement.dataset.theme = theme; try { localStorage.setItem('recipe-book-theme', theme); } catch {} toggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`); };
  setTheme(storedTheme() || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
  toggle.addEventListener('click', () => setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'));
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js');
}
init().catch(() => { $('#recipeGrid').innerHTML='<p class="empty">Could not load the recipe collection. Please refresh the page.</p>'; });
