(function () {
  var dashboard = document.querySelector("[data-map-dashboard]");
  if (!dashboard || typeof L === "undefined") {
    return;
  }

  var dataUrl = dashboard.getAttribute("data-map-data-url");

  var mapContainer = dashboard.querySelector("#landscape-map");
  var statsVisibleArcs = dashboard.querySelector("[data-stat-visible-arcs]");
  var statsVisibleProjects = dashboard.querySelector("[data-stat-visible-projects]");
  var statsVisibleCities = dashboard.querySelector("[data-stat-visible-cities]");
  var statsUnmapped = dashboard.querySelector("[data-stat-unmapped]");
  var selectedConnectionEl = dashboard.querySelector("[data-selected-connection]");
  var missingSummaryEl = dashboard.querySelector("[data-missing-summary]");
  var tableBody = dashboard.querySelector("[data-connection-table]");
  var errorEl = dashboard.querySelector("[data-map-error]");
  var projectFilter = dashboard.querySelector("[data-filter-project]");
  var activityLocationFilter = dashboard.querySelector("[data-filter-activity-location]");
  var relationshipFilter = dashboard.querySelector("[data-filter-relationship]");
  var mappedOnlyFilter = dashboard.querySelector("[data-filter-mapped-only]");
  var resetButton = dashboard.querySelector("[data-filter-reset]");

  var state = {
    dataset: null,
    filteredConnections: [],
    selectedId: null,
    svg: null,
    map: null,
  };

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function setError(message) {
    errorEl.hidden = !message;
    errorEl.textContent = message || "";
  }

  function initialiseMap() {
    state.map = L.map(mapContainer, {
      minZoom: 1,
      maxZoom: 6,
      worldCopyJump: false,
      zoomControl: true,
    }).setView([24, 5], 2);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      noWrap: true,
    }).addTo(state.map);

    L.svg({ clickable: true }).addTo(state.map);
    state.svg = state.map.getPanes().overlayPane.querySelector("svg");

    state.map.on("zoomend moveend resize", renderMap);
  }

  function populateSelect(select, values, placeholder) {
    select.innerHTML = "";
    var defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = placeholder;
    select.appendChild(defaultOption);

    values.forEach(function (value) {
      var option = document.createElement("option");
      option.value = value;
      option.textContent = value;
      select.appendChild(option);
    });
  }

  function loadFilters(dataset) {
    populateSelect(
      projectFilter,
      dataset.projects.map(function (project) {
        return project.name;
      }),
      "All projects"
    );

    populateSelect(
      activityLocationFilter,
      Array.from(
        new Set(
          dataset.connections
            .map(function (connection) {
              return connection.activity_location;
            })
            .filter(Boolean)
        )
      ).sort(),
      "All activity locations"
    );

    populateSelect(
      relationshipFilter,
      Object.keys(dataset.relationship_counts || {}),
      "All relationships"
    );
  }

  function getFilteredConnections() {
    var dataset = state.dataset;
    var selectedProject = projectFilter.value;
    var selectedLocation = activityLocationFilter.value;
    var selectedRelationship = relationshipFilter.value;
    var mappedOnly = mappedOnlyFilter.checked;

    return dataset.connections.filter(function (connection) {
      if (selectedProject && connection.project_name !== selectedProject) {
        return false;
      }
      if (selectedLocation && connection.activity_location !== selectedLocation) {
        return false;
      }
      if (selectedRelationship && connection.relationship !== selectedRelationship) {
        return false;
      }
      if (mappedOnly && !connection.is_mappable) {
        return false;
      }
      return true;
    });
  }

  function renderStats(connections) {
    var mapped = connections.filter(function (connection) {
      return connection.is_mappable;
    });
    var projects = new Set();
    var cities = new Set();

    mapped.forEach(function (connection) {
      projects.add(connection.project_name);
      if (connection.project_coordinates) {
        cities.add(connection.project_coordinates.city);
      }
      if (connection.activity_coordinates) {
        cities.add(connection.activity_coordinates.city);
      }
    });

    statsVisibleArcs.textContent = String(mapped.length);
    statsVisibleProjects.textContent = String(projects.size);
    statsVisibleCities.textContent = String(cities.size);
    statsUnmapped.textContent = String(connections.length - mapped.length);
  }

  function renderSelectedConnection(connection) {
    if (!connection) {
      selectedConnectionEl.innerHTML = "<p>Select an arc or marker to inspect one project-to-activity link.</p>";
      return;
    }

    var missing = connection.missing_reasons.length
      ? "<p><strong>Missing data:</strong> " + escapeHtml(connection.missing_reasons.join(", ")) + "</p>"
      : "";

    selectedConnectionEl.innerHTML =
      "<p><strong>Project:</strong> " + escapeHtml(connection.project_name) + "</p>" +
      "<p><strong>Project city:</strong> " + escapeHtml(connection.project_city || "Not supplied") + "</p>" +
      "<p><strong>Activity:</strong> " + escapeHtml(connection.activity_name || "Untitled activity") + "</p>" +
      "<p><strong>Activity location:</strong> " + escapeHtml(connection.activity_location || "Not supplied") + "</p>" +
      "<p><strong>Relationship:</strong> " + escapeHtml(connection.relationship) + "</p>" +
      (connection.activity_focus ? "<p><strong>Focus:</strong> " + escapeHtml(connection.activity_focus) + "</p>" : "") +
      (connection.activity_audience ? "<p><strong>Audience:</strong> " + escapeHtml(connection.activity_audience) + "</p>" : "") +
      missing;
  }

  function renderMissingSummary(dataset) {
    function renderIssueList(title, issues) {
      if (!issues || !issues.length) {
        return "";
      }

      var items = issues
        .slice(0, 6)
        .map(function (issue) {
          var examples = issue.examples && issue.examples.length ? " (" + issue.examples.join(", ") + ")" : "";
          return "<li><strong>" + escapeHtml(issue.label) + "</strong> x " + issue.count + escapeHtml(examples) + "</li>";
        })
        .join("");

      return "<h3>" + escapeHtml(title) + "</h3><ul>" + items + "</ul>";
    }

    missingSummaryEl.innerHTML =
      renderIssueList("Projects missing a city", dataset.issues.projects_missing_location_or_city) +
      renderIssueList("Activity locations missing coordinates", dataset.issues.activity_locations_missing_coordinates) +
      renderIssueList("Non-geographic activity locations", dataset.issues.non_geographic_activity_locations);
  }

  function selectConnection(connectionId) {
    state.selectedId = connectionId;
    var connection = state.dataset.connections.find(function (item) {
      return item.id === connectionId;
    });
    renderSelectedConnection(connection);
    renderTable(state.filteredConnections);
    renderMap();
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
    var midX = (fromPoint.x + toPoint.x) / 2;
    var midY = (fromPoint.y + toPoint.y) / 2;
    var normalX = -dy / distance;
    var normalY = dx / distance;
    var curvature = Math.max(26, Math.min(120, distance * 0.22));
    var controlX = midX + normalX * curvature;
    var controlY = midY + normalY * curvature - curvature * 0.1;
    return "M " + fromPoint.x + " " + fromPoint.y + " Q " + controlX + " " + controlY + " " + toPoint.x + " " + toPoint.y;
  }

  function renderMap() {
    if (!state.svg || !state.map) {
      return;
    }

    var existingGroup = state.svg.querySelector("[data-map-overlay]");
    if (existingGroup) {
      existingGroup.remove();
    }

    var group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    group.setAttribute("data-map-overlay", "true");
    state.svg.appendChild(group);

    state.filteredConnections.forEach(function (connection) {
      if (!connection.is_mappable) {
        return;
      }

      var fromPoint = state.map.latLngToLayerPoint([connection.project_coordinates.lat, connection.project_coordinates.lon]);
      var toPoint = state.map.latLngToLayerPoint([connection.activity_coordinates.lat, connection.activity_coordinates.lon]);
      var isActive = state.selectedId === connection.id;

      var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("class", "landscape-map-arc" + (isActive ? " is-active" : ""));
      path.setAttribute("d", buildCurvePath(fromPoint, toPoint));
      path.setAttribute("data-connection-id", connection.id);
      path.addEventListener("click", function () {
        selectConnection(connection.id);
      });
      group.appendChild(path);

      [
        {
          coords: connection.project_coordinates,
          className: "landscape-map-point landscape-map-point--project" + (isActive ? " is-active" : ""),
          title: connection.project_name + " (" + connection.project_city + ")",
        },
        {
          coords: connection.activity_coordinates,
          className: "landscape-map-point landscape-map-point--activity" + (isActive ? " is-active" : ""),
          title: connection.activity_name + " (" + connection.activity_location + ")",
        },
      ].forEach(function (pointDef) {
        var layerPoint = state.map.latLngToLayerPoint([pointDef.coords.lat, pointDef.coords.lon]);
        var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("class", pointDef.className);
        circle.setAttribute("cx", layerPoint.x);
        circle.setAttribute("cy", layerPoint.y);
        circle.setAttribute("r", 5.2);
        circle.setAttribute("data-connection-id", connection.id);
        circle.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "title")).textContent = pointDef.title;
        circle.addEventListener("click", function () {
          selectConnection(connection.id);
        });
        group.appendChild(circle);
      });
    });
  }

  function renderTable(connections) {
    if (!connections.length) {
      tableBody.innerHTML = "<tr><td colspan='5'>No connections match the current filters.</td></tr>";
      return;
    }

    tableBody.innerHTML = connections
      .slice(0, 150)
      .map(function (connection) {
        var statusClass = connection.is_mappable ? "mapped" : "unmapped";
        var statusText = connection.is_mappable ? "Mapped" : "Waiting on coordinates";
        return (
          "<tr data-row-id='" +
          escapeHtml(connection.id) +
          "'" +
          (state.selectedId === connection.id ? " class='is-selected'" : "") +
          ">" +
          "<td>" + escapeHtml(connection.project_name) + "</td>" +
          "<td>" + escapeHtml(connection.project_city || "Not supplied") + "</td>" +
          "<td>" + escapeHtml(connection.activity_name || "Untitled activity") + "</td>" +
          "<td>" + escapeHtml(connection.activity_location || "Not supplied") + "</td>" +
          "<td><span class='landscape-map-status landscape-map-status--" + statusClass + "'>" + escapeHtml(statusText) + "</span></td>" +
          "</tr>"
        );
      })
      .join("");

    Array.prototype.forEach.call(tableBody.querySelectorAll("tr[data-row-id]"), function (row) {
      row.addEventListener("click", function () {
        selectConnection(row.getAttribute("data-row-id"));
      });
    });
  }

  function applyFilters(options) {
    state.filteredConnections = getFilteredConnections();
    renderStats(state.filteredConnections);
    renderTable(state.filteredConnections);

    if (!state.filteredConnections.some(function (connection) { return connection.id === state.selectedId; })) {
      state.selectedId = state.filteredConnections.length ? state.filteredConnections[0].id : null;
      renderSelectedConnection(
        state.filteredConnections.find(function (connection) {
          return connection.id === state.selectedId;
        }) || null
      );
    }

    if (options && options.fitBounds) {
      var bounds = getConnectionBounds(state.filteredConnections.filter(function (connection) {
        return connection.is_mappable;
      }));
      if (bounds) {
        state.map.fitBounds(bounds.pad(0.3));
      }
    }

    renderMap();
  }

  function bindControls() {
    [projectFilter, activityLocationFilter, relationshipFilter, mappedOnlyFilter].forEach(function (control) {
      control.addEventListener("change", function () {
        applyFilters({ fitBounds: true });
      });
    });

    resetButton.addEventListener("click", function () {
      projectFilter.value = "";
      activityLocationFilter.value = "";
      relationshipFilter.value = "";
      mappedOnlyFilter.checked = true;
      applyFilters({ fitBounds: true });
    });
  }

  initialiseMap();

  fetch(dataUrl)
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Unable to load landscape map data.");
      }
      return response.json();
    })
    .then(function (dataset) {
      state.dataset = dataset;
      loadFilters(dataset);
      bindControls();
      renderMissingSummary(dataset);
      applyFilters({ fitBounds: true });
      setError("");
    })
    .catch(function (error) {
      setError(error.message || "Unable to load landscape map data.");
      tableBody.innerHTML = "<tr><td colspan='5'>Map data could not be loaded.</td></tr>";
    });
})();
