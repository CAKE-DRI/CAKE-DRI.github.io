(function () {
  var dashboard = document.querySelector("[data-map-dashboard]");
  if (!dashboard || typeof L === "undefined") {
    return;
  }

  var dataUrl = dashboard.getAttribute("data-map-data-url");
  var mapContainer = dashboard.querySelector("#landscape-map");
  var popupEl = dashboard.querySelector("[data-map-popup]");
  var errorEl = dashboard.querySelector("[data-map-error]");

  var state = {
    dataset: null,
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
      minZoom: 4,
      maxZoom: 7,
      worldCopyJump: false,
      zoomControl: false,
    }).setView([24, 5], 2);

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
      //renderInfoBox();
    });
  }

  function getConnections() {
    if (!state.dataset) {
      return [];
    }

    return state.dataset.connections.filter(function (connection) {
      return connection.is_mappable;
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

  function getSelectedConnection() {
    if (!state.selectedConnectionId) {
      return null;
    }

    return getConnections().find(function (connection) {
      return connection.id === state.selectedConnectionId;
    }) || null;
  }

  function hideInfoBox() {
    popupEl.hidden = true;
  }

  function renderInfoBox() {
    var connection = getSelectedConnection();
    if (!connection || !popupEl) {
      hideInfoBox();
      return;
    }

    popupEl.innerHTML =
      "<div class='landscape-map-popup'>" +
      "<button type='button' class='landscape-map-popup__close' data-popup-close aria-label='Close'>x</button>" +
      "<strong>" + escapeHtml(connection.project_name) + "</strong>" +
      "<div>" + escapeHtml(connection.activity_name) + "</div>" +
      "</div>";
    popupEl.hidden = false;

    var point = state.map.latLngToContainerPoint([
      connection.activity_coordinates.lat,
      connection.activity_coordinates.lon,
    ]);
    var mapWidth = mapContainer.clientWidth;
    var mapHeight = mapContainer.clientHeight;
    var popupWidth = popupEl.offsetWidth || 260;
    var popupHeight = popupEl.offsetHeight || 90;
    var mapLeft = mapContainer.offsetLeft;
    var mapTop = mapContainer.offsetTop;
    var left = clamp(mapLeft + 0.02*mapWidth, 10, Math.max(10, mapLeft + mapWidth));
    var top = clamp(mapTop + 0.2*mapHeight, 10, Math.max(10, mapTop + mapHeight));

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

  function showInfoBox(connection) {
    console.log("get click, run showInfoBox");
    state.selectedConnectionId = connection.id;
    renderMap();
    renderInfoBox();
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
      setError("No mapped connections are available.");
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

    connections.forEach(function (connection) {
      if (!connection.is_mappable) {
        return;
      }

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
      stop1.setAttribute("stop-color", "#f7efe7");

      var stop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
      stop2.setAttribute("offset", "100%");
      stop2.setAttribute("stop-color", "#7b3f26");

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
    connections.forEach(function (connection) {
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
      circle.setAttribute("class", "landscape-map-point landscape-map-point--project");
      circle.setAttribute("cx", layerPoint.x);
      circle.setAttribute("cy", layerPoint.y);
      circle.setAttribute("r", 1.8);
      appendTitle(circle, point.title + " | " + point.count + " mapped activities");
      group.appendChild(circle);
    });

    console.log("arc count", group.querySelectorAll(".landscape-map-arc").length);
  }

  function renderDashboard() {
    var connections = getConnections();

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
      renderDashboard();
      setError("");
    })
    .catch(function (error) {
      setError(error.message || "Unable to load landscape map data.");
      hideInfoBox();
    });
})();
