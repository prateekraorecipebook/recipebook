# Recipe Book

A static, offline-friendly recipe book designed for GitHub Pages. Open `index.html` locally to preview, or publish the repository with GitHub Pages (Deploy from a branch, `/ (root)`).

## Add a recipe

1. Copy the contents of `RECIPE_PROMPT.txt` into your preferred AI along with your notes.
2. Save its generated page in `recipes/`.
3. Add the returned metadata object to both `data/recipes.json` and `data/recipes.js` (and validate it against `data/recipe-metadata-example.json`).
4. Commit and push. GitHub Pages will publish the new recipe.

The recipe page uses `assets/recipe.js` for the yield scaler and step timers. Keep its prescribed data attributes in new recipes.

## Offline use

After visiting the published site once, install it from your browser's **Install app** / **Add to Home Screen** control. The service worker keeps the app shell and recipes you have opened available without a connection. When you add recipes, open the site online once to receive the update.
