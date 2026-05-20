(function () {
  var dashboard = document.querySelector("[data-map-dashboard]");
  if (!dashboard || typeof L === "undefined") {
    return;
  }

  var dataUrl = dashboard.getAttribute("data-map-data-url");
  var mapContainer = dashboard.querySelector("#landscape-map");
  var popupEl = dashboard.querySelector("[data-map-popup]");
  var errorEl = dashboard.querySelector("[data-map-error]");
  var projectFilter = dashboard.querySelector("[data-filter-project]");
  var activityLocationFilter = dashboard.querySelector("[data-filter-activity-location]");
  var relationshipFilter = dashboard.querySelector("[data-filter-relationship]");
  var mappedOnlyFilter = dashboard.querySelector("[data-filter-mapped-only]");
  var resetButton = dashboard.querySelector("[data-filter-reset]");

  var state = {
    dataset: null,
    filteredConnections: [],
    selectedProjectKey: null,
    selectedConnectionId: null,
    svg: null,
    map: null,
  };

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
    var selectedProject = projectFilter.value;
    var selectedLocation = activityLocationFilter.value;
    var selectedRelationship = relationshipFilter.value;
    var mappedOnly = mappedOnlyFilter.checked;

    return state.dataset.connections.filter(function (connection) {
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

  function appendTitle(element, text) {
    var title = document.createElementNS("http://www.w3.org/2000/svg", "title");
    title.textContent = text;
    element.appendChild(title);
  }

  function normaliseKey(value) {
    return String(value || "").trim().toLowerCase();
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function buildProjectPopupHtml(projectName, connectionId) {
    var projectConnections = state.filteredConnections.filter(function (connection) {
      return connection.project_name === projectName;
    });

    if (!projectConnections.length) {
      return "<strong>" + escapeHtml(projectName) + "</strong>";
    }

    var uniqueLocations = Array.from(
      new Set(
        projectConnections.map(function (connection) {
          return connection.activity_location;
        }).filter(Boolean)
      )
    ).sort();

    return (
      "<div class='landscape-map-popup'>" +
      "<strong>Project " + escapeHtml(projectName) + "</strong>" +
      "<div>'s activities: " + escapeHtml(uniqueLocations.join(", ")) + ".</div>" +
      "</div>"
    );
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function hideProjectPopup() {
    popupEl.hidden = true;
  }

  function openProjectPopup(projectName, connectionId, latlng) {
    if (!latlng || !popupEl) {
      return;
    }

    popupEl.innerHTML = buildProjectPopupHtml(projectName, connectionId);
    popupEl.hidden = false;

    var point = state.map.latLngToContainerPoint(latlng);
    var mapWidth = mapContainer.clientWidth;
    var mapHeight = mapContainer.clientHeight;
    var popupWidth = popupEl.offsetWidth || 260;
    var popupHeight = popupEl.offsetHeight || 90;

    var left = clamp(point.x + 14, 10, Math.max(10, mapWidth - popupWidth - 10));
    var top = clamp(point.y - popupHeight - 14, 10, Math.max(10, mapHeight - popupHeight - 10));

    popupEl.style.left = left + "px";
    popupEl.style.top = top + "px";
  }

  function selectProject(projectName, connectionId, latlng) {
    state.selectedProjectKey = normaliseKey(projectName);
    state.selectedConnectionId = connectionId || null;
    renderMap();
    openProjectPopup(projectName, connectionId, latlng);
  }

  function renderMap() {
    if (!state.svg || !state.map) {
      return;
    }

    var existingGroup = state.svg.querySelector("[data-map-overlay]");
    if (existingGroup) {
      existingGroup.remove();
    }

    if (!state.filteredConnections.length) {
      setError("No mapped connections match the current filters.");
      hideProjectPopup();
      return;
    }

    setError("");

    var group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    group.setAttribute("data-map-overlay", "true");
    state.svg.appendChild(group);

    var defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    var marker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
    marker.setAttribute("id", "landscape-map-arrow");
    marker.setAttribute("markerWidth", "5");
    marker.setAttribute("markerHeight", "5");
    marker.setAttribute("refX", "6");
    marker.setAttribute("refY", "3.5");
    marker.setAttribute("orient", "auto");
    marker.setAttribute("markerUnits", "strokeWidth");

    var markerPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    markerPath.setAttribute("class", "landscape-map-arrowhead");
    markerPath.setAttribute("d", "M 1 1 L 8 3.5 L 1 6");
    marker.appendChild(markerPath);
    defs.appendChild(marker);
    group.appendChild(defs);

    state.filteredConnections.forEach(function (connection) {
      if (!connection.is_mappable) {
        return;
      }

      var fromPoint = state.map.latLngToLayerPoint([connection.project_coordinates.lat, connection.project_coordinates.lon]);
      var toPoint = state.map.latLngToLayerPoint([connection.activity_coordinates.lat, connection.activity_coordinates.lon]);
      var isProjectActive = normaliseKey(connection.project_name) === state.selectedProjectKey;
      var isConnectionActive = connection.id === state.selectedConnectionId;

      var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("class", "landscape-map-arc" + ((isProjectActive || isConnectionActive) ? " is-active" : ""));
      path.setAttribute("d", buildCurvePath(fromPoint, toPoint));
      appendTitle(
        path,
        connection.project_name + " (" + connection.project_city + ") -> " +
          connection.activity_name + " (" + connection.activity_location + ")"
      );
      path.addEventListener("click", function () {
        selectProject(
          connection.project_name,
          connection.id,
          L.latLng(
            (connection.project_coordinates.lat + connection.activity_coordinates.lat) / 2,
            (connection.project_coordinates.lon + connection.activity_coordinates.lon) / 2
          )
        );
      });
      group.appendChild(path);
    });

    var projectPoints = {};
    state.filteredConnections.forEach(function (connection) {
      if (!connection.is_mappable) {
        return;
      }

      var key = [
        connection.project_name,
        connection.project_coordinates.lat,
        connection.project_coordinates.lon,
      ].join("|");

      if (!projectPoints[key]) {
        projectPoints[key] = {
          coords: connection.project_coordinates,
          projectName: connection.project_name,
          title: connection.project_name + " (" + connection.project_city + ")",
          count: 0,
        };
      }

      projectPoints[key].count += 1;
    });

    Object.keys(projectPoints).forEach(function (key) {
      var point = projectPoints[key];
      var layerPoint = state.map.latLngToLayerPoint([point.coords.lat, point.coords.lon]);
      var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      var isActive = normaliseKey(point.projectName) === state.selectedProjectKey;
      circle.setAttribute("class", "landscape-map-point landscape-map-point--project" + (isActive ? " is-active" : ""));
      circle.setAttribute("cx", layerPoint.x);
      circle.setAttribute("cy", layerPoint.y);
      circle.setAttribute("r", 5.8);
      appendTitle(circle, point.title + " | " + point.count + " mapped activities");
      circle.addEventListener("click", function () {
        selectProject(
          point.projectName,
          null,
          L.latLng(point.coords.lat, point.coords.lon)
        );
      });
      group.appendChild(circle);
    });
  }

  function applyFilters(options) {
    state.filteredConnections = getFilteredConnections().filter(function (connection) {
      return connection.is_mappable;
    });

    if (
      state.selectedProjectKey &&
      !state.filteredConnections.some(function (connection) {
        return normaliseKey(connection.project_name) === state.selectedProjectKey;
      })
    ) {
      state.selectedProjectKey = null;
      state.selectedConnectionId = null;
      hideProjectPopup();
    } else if (
      state.selectedConnectionId &&
      !state.filteredConnections.some(function (connection) {
        return connection.id === state.selectedConnectionId;
      })
    ) {
      state.selectedConnectionId = null;
    }

    if (options && options.fitBounds) {
      var bounds = getConnectionBounds(state.filteredConnections);
      if (bounds) {
        state.map.fitBounds(bounds.pad(0.3));
      }
    }

    renderMap();

    if (state.selectedProjectKey) {
      var selectedConnection = state.filteredConnections.find(function (connection) {
        return connection.id === state.selectedConnectionId;
      }) || state.filteredConnections.find(function (connection) {
        return normaliseKey(connection.project_name) === state.selectedProjectKey;
      });

      if (selectedConnection) {
        openProjectPopup(
          selectedConnection.project_name,
          state.selectedConnectionId,
          L.latLng(selectedConnection.project_coordinates.lat, selectedConnection.project_coordinates.lon)
        );
      }
    } else {
      hideProjectPopup();
    }
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
      applyFilters({ fitBounds: true });
      setError("");
    })
    .catch(function (error) {
      setError(error.message || "Unable to load landscape map data.");
    });
})();
