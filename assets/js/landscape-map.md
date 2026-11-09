# `landscape-map.js`

This file controls the interactive landscape map on the website.

## What this file does

It does four main jobs:

1. Creates the Leaflet map.
2. Loads map data from `assets/data/landscape-map.json`.
3. Builds the filter dropdowns.
4. Draws arcs, project icons, destination icons, and popup info on top of the map.

## Main flow

When the script loads, it runs inside an IIFE:

```js
(function () {
  ...
})();
```

This keeps all variables local to this file.

The startup order is:

1. `initialiseMap()`
2. `registerFilterDismiss()`
3. `loadDataset()`

## Important parts

### `state`

This stores the current map state:

- loaded dataset
- selected connection
- selected filters
- Leaflet map object
- SVG overlay

If the map behaves strangely, this is often the first place to inspect.

### `FILTER_CONFIGS`

This is the shared setup for the filter dropdowns.

Each filter defines:

- which state field it uses
- which dataset field it filters
- which HTML elements belong to it
- what text to show in the dropdown summary

This lets the code reuse one filter renderer instead of repeating similar functions.

### `loadDataset()`

This fetches the JSON file:

- reads `data-map-data-url` from the HTML
- loads the map data
- stores it in `state.dataset`
- syncs filters
- renders the dashboard

### `renderDashboard()`

This is the main high-level render function.

It:

- updates the filter UI
- checks whether the selected popup connection is still valid
- fits the map to the filtered results
- draws the map
- draws the popup

### `getConnections()`

This is the main filtering function.

It returns the connections that should currently appear on the map.

Right now it filters by:

- project name
- project city
- destination city

If you want to add a new filter, this is one of the main places to update.

### `renderMap()`

This draws the visible map overlay.

It:

1. Clears the old SVG overlay.
2. Gets the filtered connections.
3. Draws the arc arrow marker definition.
4. Draws all arcs.
5. Groups project points.
6. Groups destination points.
7. Draws the origin and destination icons.

### `renderInfoBox()`

This builds the popup card shown when an arc is clicked.

It uses `getPopupActivities()` to show all activities for the selected project at the selected destination city.

## Where to change common things

### Change default map view

Edit `initialiseMap()`:

```js
}).setView([54.5, -3], 5);
```

### Change what filters exist

Edit `FILTER_CONFIGS`.

### Change how filtering works

Edit `getConnections()`.

### Change arc shape

Edit `buildCurvePath(fromPoint, toPoint)`.

### Change popup content

Edit `renderInfoBox()` and `getPopupActivities()`.

### Change project and destination icons

Edit the image marker blocks inside `renderMap()`.