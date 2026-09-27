# AI recipe authoring workflow

## The two-part output

Give an AI your cooking notes plus the entire `RECIPE_PROMPT.txt`. Its response begins with a metadata object, followed by `---HTML---`, then the recipe page. Save the HTML into `recipes/` and add the metadata object as a comma-separated item inside the array in `data/recipes.json`.

The index intentionally does not scrape individual pages. `data/recipes.json` is its quick, reliable catalogue—both files are required for a new recipe.

## Metadata rules

Use `data/recipe-metadata-example.json` as the exact shape. Every recipe needs a unique kebab-case `id`, a matching `.html` `url`, and ordinary lower-case ingredient names. Include broad and specific values where useful: `Indian` and `Kerala`, for example. Use only whole minutes in `timeMinutes`; use `Easy`, `Medium`, or `Hard` for difficulty. `accent` is a readable hex colour used on the index card.

The ingredient matcher is intentionally forgiving: it matches when one pantry phrase contains the other. Prefer `coconut milk` instead of a brand or a full clause such as `400 ml tin coconut milk`.

## Interactive-page contract

Each page is independent and can have its own design, but must retain the JS hooks from the main prompt:

- `<main data-recipe data-servings="N">` defines the base yield.
- Numeric amounts use `data-base-qty="N"` so the yield stepper can scale them.
- `data-serving-down`, `data-serving-output`, and `data-serving-up` are the controls.
- A timed step uses `data-timer="SECONDS"`, a `span` display, and a button.
- The theme navigation uses `data-theme-toggle`. `recipe.js` persists the visitor's light/dark choice and adds the existing page's fallback toggle automatically. New visual styles must use the shared colour variables rather than fixed background and text colours, so dark mode remains readable.

Fractions can use decimals (`0.5`, `0.25`); the scaler rounds to two decimal places. Do not mark qualitative values such as `a pinch`, `to taste`, or `a handful` as scalable. Do mark all amounts that should change with the yield—including liquid, spices, and garnishes.

## Quality checklist

Before committing, check that the file opens from the index, the catalogue URL and filename match, every needed quantity scales, each timer starts, and the light/dark toggle is legible. Keep `data/recipes.json` and `data/recipes.js` identical: the `.js` catalogue makes the index work when opened directly from Finder, while the JSON file remains the human-readable canonical format. Refresh the hosted site once online after publishing so its offline cache updates.
