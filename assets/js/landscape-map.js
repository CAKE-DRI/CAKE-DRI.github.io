(function () {
  var dashboard = document.querySelector("[data-map-dashboard]");
  if (!dashboard || typeof L === "undefined") {
    return;
  }

  var dataUrl = dashboard.getAttribute("data-map-data-url");
  var originIconUrl = dashboard.getAttribute("data-origin-icon-url");
  var destinationIconUrl = dashboard.getAttribute("data-destination-icon-url");
  var mapContainer = dashboard.querySelector("#landscape-map");
  var popupEl = dashboard.querySelector("[data-map-popup]");
  var errorEl = dashboard.querySelector("[data-map-error]");
  var multiselectEls = dashboard.querySelectorAll("[data-map-multiselect]");
  var projectFilterSummaryEl = dashboard.querySelector("[data-project-filter-summary]");
  var projectFilterOptionsEl = dashboard.querySelector("[data-project-filter-options]");
  var originCityFilterSummaryEl = dashboard.querySelector("[data-origin-city-filter-summary]");
  var originCityFilterOptionsEl = dashboard.querySelector("[data-origin-city-filter-options]");
  var destinationCityFilterSummaryEl = dashboard.querySelector("[data-destination-city-filter-summary]");
  var destinationCityFilterOptionsEl = dashboard.querySelector("[data-destination-city-filter-options]");

  var state = {
    dataset: null,
    selectedConnectionId: null,
    selectedProjects: [],
    selectedOriginCities: [],
    selectedDestinationCities: [],
    svg: null,
    map: null,
  };

  var FILTER_CONFIGS = [
    {
      stateKey: "selectedProjects",
      fieldName: "project_name",
      summaryEl: projectFilterSummaryEl,
      optionsEl: projectFilterOptionsEl,
      emptyOptionsText: "No projects are available.",
      emptySummaryText: "No projects",
      defaultSummaryText: "Select projects",
      allSummaryText: "All projects",
    },
    {
      stateKey: "selectedOriginCities",
      fieldName: "project_city",
      summaryEl: originCityFilterSummaryEl,
      optionsEl: originCityFilterOptionsEl,
      emptyOptionsText: "No origin cities are available.",
      emptySummaryText: "No origin cities",
      defaultSummaryText: "Select origin cities",
      allSummaryText: "All origin cities",
    },
    {
      stateKey: "selectedDestinationCities",
      fieldName: "activity_location",
      summaryEl: destinationCityFilterSummaryEl,
      optionsEl: destinationCityFilterOptionsEl,
      emptyOptionsText: "No destination cities are available.",
      emptySummaryText: "No destination cities",
      defaultSummaryText: "Select destination cities",
      allSummaryText: "All destination cities",
    },
  ];

  initialiseMap();
  registerFilterDismiss();
  loadDataset();

  function initialiseMap() {
    state.map = L.map(mapContainer, {
      minZoom: 4,
      maxZoom: 7,
      worldCopyJump: false,
      zoomControl: false,
    }).setView([54.5, -3], 5);

    L.control.zoom({ position: "topright" }).addTo(state.map);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      noWrap: true,
    }).addTo(state.map);

    L.svg({ clickable: true }).addTo(state.map);
    state.svg = state.map.getPanes().overlayPane.querySelector("svg");
    state.svg.style.pointerEvents = "auto";
    state.map.getPanes().overlayPane.style.pointerEvents = "auto";
    state.map.on("zoomend moveend resize", function () {
      renderMap();
    });
  }

  function registerFilterDismiss() {
    if (!multiselectEls.length) {
      return;
    }

    document.addEventListener("click", function (event) {
      Array.prototype.forEach.call(multiselectEls, function (multiselectEl) {
        if (!multiselectEl.open || multiselectEl.contains(event.target)) {
          return;
        }

        multiselectEl.open = false;
      });
    });
  }

  function loadDataset() {
    fetch(dataUrl)
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Unable to load landscape map data.");
        }
        return response.json();
      })
      .then(function (dataset) {
        state.dataset = dataset;
        syncSelectedFilters();
        renderDashboard();
        setError("");
      })
      .catch(function (error) {
        setError(error.message || "Unable to load landscape map data.");
        hideInfoBox();
      });
  }

  function renderDashboard() {
    var connections = getConnections();
    renderFilters();

    if (
      state.selectedConnectionId &&
      !connections.some(function (connection) {
        return connection.id === state.selectedConnectionId;
      })
    ) {
      state.selectedConnectionId = null;
      hideInfoBox();
    }

    var bounds = getConnectionBounds(connections);
    if (bounds) {
      state.map.fitBounds(bounds.pad(0.3));
    }

    renderMap();
    renderInfoBox();
  }

  function renderFilters() {
    FILTER_CONFIGS.forEach(function (filterConfig) {
      renderFilter(filterConfig);
    });
  }

  function renderFilter(filterConfig) {
    renderFilterOptions({
      optionsEl: filterConfig.optionsEl,
      summaryEl: filterConfig.summaryEl,
      values: getFilterValues(filterConfig),
      selectedValues: state[filterConfig.stateKey],
      emptyOptionsText: filterConfig.emptyOptionsText,
      emptySummaryText: filterConfig.emptySummaryText,
      defaultSummaryText: filterConfig.defaultSummaryText,
      allSummaryText: filterConfig.allSummaryText,
      onChange: function (nextSelectedValues) {
        state[filterConfig.stateKey] = nextSelectedValues;
      },
    });
  }

  function renderFilterOptions(config) {
    if (!config.optionsEl) {
      return;
    }

    updateFilterSummary(config.summaryEl, config.selectedValues, config.values, config.emptySummaryText, config.defaultSummaryText, config.allSummaryText);

    config.optionsEl.innerHTML = "";

    if (!config.values.length) {
      config.optionsEl.innerHTML =
        "<p class='landscape-map-multiselect__empty'>" + config.emptyOptionsText + "</p>";
      return;
    }

    config.values.forEach(function (value) {
      var option = document.createElement("label");
      option.className = "landscape-map-multiselect__option";

      var checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.value = value;
      checkbox.checked = config.selectedValues.indexOf(value) !== -1;
      checkbox.addEventListener("change", function () {
        var nextSelectedValues = Array.prototype.slice
          .call(config.optionsEl.querySelectorAll("input[type='checkbox']:checked"))
          .map(function (input) {
            return input.value;
          });

        config.onChange(nextSelectedValues);
        renderDashboard();
      });

      var labelText = document.createElement("span");
      labelText.textContent = value;

      option.appendChild(checkbox);
      option.appendChild(labelText);
      config.optionsEl.appendChild(option);
    });
  }

  function updateFilterSummary(summaryEl, selectedValues, allValues, emptySummaryText, defaultSummaryText, allSummaryText) {
    if (!summaryEl) {
      return;
    }

    var totalCount = allValues.length;
    var selectedCount = selectedValues.length;

    if (!totalCount) {
      summaryEl.textContent = emptySummaryText;
      return;
    }

    if (!selectedCount) {
      summaryEl.textContent = defaultSummaryText;
      return;
    }

    if (selectedCount === totalCount) {
      summaryEl.textContent = allSummaryText;
      return;
    }

    if (selectedCount === 1) {
      summaryEl.textContent = selectedValues[0];
      return;
    }

    summaryEl.textContent = selectedCount + " selected";
  }

  function renderMap() {
    if (!state.svg || !state.map) {
      return;
    }

    var existingGroup = state.svg.querySelector("[data-map-overlay]");
    if (existingGroup) {
      existingGroup.remove();
    }

    var connections = getConnections();

    if (!connections.length) {
      setError(hasActiveFilters() ? "No mapped connections match the selected filters." : "");
      hideInfoBox();
      return;
    }

    setError("");

    var group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    group.setAttribute("data-map-overlay", "true");
    state.svg.appendChild(group);

    var defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");

    var marker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
    marker.setAttribute("id", "landscape-map-arrow");
    marker.setAttribute("markerWidth", "10");
    marker.setAttribute("markerHeight", "10");
    marker.setAttribute("refX", "3");
    marker.setAttribute("refY", "4");
    marker.setAttribute("orient", "auto");
    marker.setAttribute("markerUnits", "strokeWidth");

    var markerPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    markerPath.setAttribute("class", "landscape-map-arrowhead");
    markerPath.setAttribute("d", "M 1 3 L 3 4 L 1 5");
    marker.appendChild(markerPath);
    defs.appendChild(marker);
    group.appendChild(defs);

    connections.forEach(function (connection) {
      var fromPoint = state.map.latLngToLayerPoint([connection.project_coordinates.lat, connection.project_coordinates.lon]);
      var toPoint = state.map.latLngToLayerPoint([connection.activity_coordinates.lat, connection.activity_coordinates.lon]);
      var isConnectionActive = connection.id === state.selectedConnectionId;

      var gradientId = "landscape-map-arc-gradient-" + connection.id;
      var gradient = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
      gradient.setAttribute("id", gradientId);
      gradient.setAttribute("gradientUnits", "userSpaceOnUse");
      gradient.setAttribute("x1", fromPoint.x);
      gradient.setAttribute("y1", fromPoint.y);
      gradient.setAttribute("x2", toPoint.x);
      gradient.setAttribute("y2", toPoint.y);

      var stop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
      stop1.setAttribute("offset", "0%");
      stop1.setAttribute("stop-color", "#de3a45");

      var stop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
      stop2.setAttribute("offset", "100%");
      stop2.setAttribute("stop-color", "#2db3ff");

      gradient.appendChild(stop1);
      gradient.appendChild(stop2);
      defs.appendChild(gradient);

      var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("class", "landscape-map-arc" + (isConnectionActive ? " is-active" : ""));
      path.setAttribute("d", buildCurvePath(fromPoint, toPoint));
      path.style.stroke = "url(#" + gradientId + ")";
      appendTitle(
        path,
        connection.project_name + " (" + connection.project_city + ") -> " +
          connection.activity_name + " (" + connection.activity_location + ")"
      );

      path.style.pointerEvents = "stroke";
      path.addEventListener("pointerdown", function (event) {
        event.preventDefault();
        event.stopPropagation();
        console.log("pointerdown fired", connection.id);
        showInfoBox(connection);
      });
      group.appendChild(path);
    });

    var projectPoints = {};
    var activityPoints = {};
    connections.forEach(function (connection) {
      var key = [
        connection.project_name,
        connection.project_coordinates.lat,
        connection.project_coordinates.lon,
      ].join("|");

      if (!projectPoints[key]) {
        projectPoints[key] = {
          coords: connection.project_coordinates,
          title: connection.project_name + " (" + connection.project_city + ")",
          count: 0,
        };
      }

      projectPoints[key].count += 1;

      var activityKey = [
        connection.activity_location,
        connection.activity_coordinates.lat,
        connection.activity_coordinates.lon,
      ].join("|");

      if (!activityPoints[activityKey]) {
        activityPoints[activityKey] = {
          coords: connection.activity_coordinates,
          title: connection.activity_location,
          count: 0,
        };
      }

      activityPoints[activityKey].count += 1;
    });

    Object.keys(projectPoints).forEach(function (key) {
      var point = projectPoints[key];
      var layerPoint = state.map.latLngToLayerPoint([point.coords.lat, point.coords.lon]);
      var marker = createImageMarker({
        className: "landscape-map-point landscape-map-point--project",
        href: originIconUrl,
        x: layerPoint.x - 20,
        y: layerPoint.y - 30,
        width: 44,
        height: 44,
      });
      appendTitle(marker, point.title + " | " + point.count + " mapped activities");
      group.appendChild(marker);
    });

    Object.keys(activityPoints).forEach(function (key) {
      var point = activityPoints[key];
      var layerPoint = state.map.latLngToLayerPoint([point.coords.lat, point.coords.lon]);
      var marker = createImageMarker({
        className: "landscape-map-point landscape-map-point--destination",
        href: destinationIconUrl,
        x: layerPoint.x - 10,
        y: layerPoint.y - 30,
        width: 40,
        height: 40,
      });
      appendTitle(marker, point.title + " | " + point.count + " mapped activities");
      group.appendChild(marker);
    });
  }

  function showInfoBox(connection) {
    console.log("get click, run showInfoBox");
    state.selectedConnectionId = connection.id;
    renderMap();
    renderInfoBox();
  }

  function renderInfoBox() {
    var connection = getSelectedConnection();
    if (!connection || !popupEl) {
      hideInfoBox();
      return;
    }

    var activityItemsHtml = getPopupActivities(connection)
      .map(function (activityName) {
        return "<div>" + escapeHtml(activityName) + "</div>";
      })
      .join("");

    popupEl.innerHTML =
      "<div class='landscape-map-popup'>" +
      "<button type='button' class='landscape-map-popup__close' data-popup-close aria-label='Close'>x</button>" +
      "<strong>" + escapeHtml(connection.project_name) + "</strong>" +
      activityItemsHtml +
      "</div>";
    popupEl.hidden = false;

    var mapWidth = mapContainer.clientWidth;
    var mapHeight = mapContainer.clientHeight;
    var mapLeft = mapContainer.offsetLeft;
    var mapTop = mapContainer.offsetTop;
    var left = clamp(mapLeft + 0.02 * mapWidth, 10, Math.max(10, mapLeft + mapWidth));
    var top = clamp(mapTop + 0.2 * mapHeight, 10, Math.max(10, mapTop + mapHeight));

    popupEl.style.left = left + "px";
    popupEl.style.top = top + "px";

    var closeButton = popupEl.querySelector("[data-popup-close]");
    if (closeButton) {
      closeButton.addEventListener("click", function () {
        state.selectedConnectionId = null;
        hideInfoBox();
        renderMap();
      });
    }
  }

  function hideInfoBox() {
    popupEl.hidden = true;
  }

  function getSelectedConnection() {
    if (!state.selectedConnectionId) {
      return null;
    }

    return getConnections().find(function (connection) {
      return connection.id === state.selectedConnectionId;
    }) || null;
  }

  function getPopupActivities(selectedConnection) {
    var activities = getConnections()
      .filter(function (connection) {
        return (
          connection.project_name === selectedConnection.project_name &&
          connection.activity_location === selectedConnection.activity_location
        );
      })
      .map(function (connection) {
        return connection.activity_name;
      });

    return activities.filter(function (activityName, index) {
      return activities.indexOf(activityName) === index;
    });
  }

  function setError(message) {
    errorEl.hidden = !message;
    errorEl.textContent = message || "";
  }

  function getConnections() {
    if (!state.dataset) {
      return [];
    }

    if (!hasActiveFilters()) {
      return [];
    }

    var selectedProjectLookup = buildLookup(state.selectedProjects);
    var selectedOriginCityLookup = buildLookup(state.selectedOriginCities);
    var selectedDestinationCityLookup = buildLookup(state.selectedDestinationCities);

    return state.dataset.connections.filter(function (connection) {
      return (
        connection.is_mappable &&
        (!state.selectedProjects.length || selectedProjectLookup[connection.project_name]) &&
        (!state.selectedOriginCities.length || selectedOriginCityLookup[connection.project_city]) &&
        (!state.selectedDestinationCities.length || selectedDestinationCityLookup[connection.activity_location])
      );
    });
  }

  function syncSelectedFilters() {
    FILTER_CONFIGS.forEach(function (filterConfig) {
      state[filterConfig.stateKey] = syncSelectedValues(
        state[filterConfig.stateKey],
        getFilterValues(filterConfig)
      );
    });
  }

  function getConnectionBounds(connections) {
    var points = [];
    connections.forEach(function (connection) {
      if (connection.project_coordinates) {
        points.push([connection.project_coordinates.lat, connection.project_coordinates.lon]);
      }
      if (connection.activity_coordinates) {
        points.push([connection.activity_coordinates.lat, connection.activity_coordinates.lon]);
      }
    });
    return points.length ? L.latLngBounds(points) : null;
  }

  function buildCurvePath(fromPoint, toPoint) {
    var dx = toPoint.x - fromPoint.x;
    var dy = toPoint.y - fromPoint.y;
    var distance = Math.max(Math.sqrt(dx * dx + dy * dy), 1);

    if (distance < 10) {
      var loopWidth = 26;
      var loopHeight = 18;
      return (
        "M " + fromPoint.x + " " + fromPoint.y +
        " C " + (fromPoint.x + loopWidth) + " " + (fromPoint.y - loopHeight) +
        " " + (fromPoint.x + loopWidth) + " " + (fromPoint.y + loopHeight) +
        " " + toPoint.x + " " + toPoint.y
      );
    }

    var midX = (fromPoint.x + toPoint.x) / 2;
    var midY = (fromPoint.y + toPoint.y) / 2;
    var normalX = -dy / distance;
    var normalY = dx / distance;
    var curvature = Math.max(26, Math.min(120, distance * 0.22));
    var controlX = midX + normalX * curvature;
    var controlY = midY + normalY * curvature - curvature * 0.1;
    return "M " + fromPoint.x + " " + fromPoint.y + " Q " + controlX + " " + controlY + " " + toPoint.x + " " + toPoint.y;
  }

  function appendTitle(element, text) {
    var title = document.createElementNS("http://www.w3.org/2000/svg", "title");
    title.textContent = text;
    element.appendChild(title);
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function hasActiveFilters() {
    return !!(
      state.selectedProjects.length ||
      state.selectedOriginCities.length ||
      state.selectedDestinationCities.length
    );
  }

  function buildLookup(values) {
    return values.reduce(function (lookup, value) {
      lookup[value] = true;
      return lookup;
    }, {});
  }

  function getFilterValues(filterConfig) {
    return getUniqueMappedValues(filterConfig.fieldName);
  }

  function getUniqueMappedValues(fieldName) {
    if (!state.dataset) {
      return [];
    }

    var valueLookup = {};
    state.dataset.connections.forEach(function (connection) {
      if (connection.is_mappable && connection[fieldName]) {
        valueLookup[connection[fieldName]] = true;
      }
    });

    return Object.keys(valueLookup).sort(function (a, b) {
      return a.localeCompare(b);
    });
  }

  function syncSelectedValues(selectedValues, availableValues) {
    return selectedValues.filter(function (value) {
      return availableValues.indexOf(value) !== -1;
    });
  }

  function createImageMarker(config) {
    var marker = document.createElementNS("http://www.w3.org/2000/svg", "image");
    marker.setAttribute("class", config.className);
    marker.setAttribute("href", config.href);
    marker.setAttribute("x", config.x);
    marker.setAttribute("y", config.y);
    marker.setAttribute("width", config.width);
    marker.setAttribute("height", config.height);
    return marker;
  }
})();
