let reference = new Array();
let newOverlays = new Array();
let teste = false;
function initDrawing(map) {
  let DrawingManager = new google.maps.drawing.DrawingManager({
    map,
    drawingControlOptions: {
      drawingModes: ["circle"],
      position: google.maps.ControlPosition.TOP_START,
    },
    circleOptions: {
      fillColor: "#99FF99",
      editable: true,
      dragabble: true,
      strokeColor: "#44933b",
    },
    polygonOptions: {
      fillColor: "#99FF99",
      editable: false,
      dragabble: false,
      strokeColor: "#44933b",
    },
  });

  google.maps.event.addListener(DrawingManager, "overlaycomplete", (event) => {
    reference.push(event.overlay);
    const hand = document.querySelector(
      'button[aria-label="Parar de desenhar"]'
    );

    hand.click();
  });
  document.querySelector(".delete").addEventListener("click", () => {
    const deleteButton = document.querySelector(".delete");

    if (reference.length >= 1) {
      reference.pop().setMap(null);
    } else if (newOverlays.length >= 1) {
      deleteButton.disabled = true;
      fetch("http://127.0.0.1:8000/api/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then(() => {
          let actualNewOverlaysReference = newOverlays.pop();
          actualNewOverlaysReference.setMap(null);
        })
        .catch((error) => {
          alert("Ocorreu o seguinte erro " + error);
        })
        .finally(() => {
          deleteButton.disabled = false;
        });
    }
  });

  document.querySelector(".save").addEventListener("click", () => {
    const shapes = [];

    reference.forEach((refs) => {
      const parameters = refs.getCenter();
      const center = {
        lat: parameters.lat(),
        lng: parameters.lng(),
      };
      const radius = refs.getRadius();
      let obj = {
        center,
        radius,
      };
      shapes.push(obj);
    });
    fetch("http://127.0.0.1:8000/api/shapes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(shapes),
    }).catch((error) => {
      alert("Ocorreu o seguinte erro " + error);
    });
    reference = [];
    alert("Todas as rotas foram salvas com sucesso!");
    location.reload();
  });
}

function showShapes(map) {
  fetch("http://127.0.0.1:8000/api/show")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((shape) => {
        const center = {
          lat: shape.center_lat,
          lng: shape.center_lng,
        };
        let Circle = new google.maps.Circle({
          map,
          radius: shape.radius,
          center: center,
          fillColor: "#99FF99",
          editable: false,
          dragabble: false,
          strokeColor: "#44933b",
        });
        newOverlays.push(Circle);
      });
    })
    .catch((error) => console.error(error));
}

function initMap() {
  const mapOptions = {
    center: { lat: -12.2570527, lng: -38.957772 },
    zoom: 14,
  };
  let map = new google.maps.Map(document.getElementById("map"), mapOptions);
  document.querySelector(".areaDrawing").addEventListener("click", (map) => {
    const drawingCircle = document.querySelector(
      'button[aria-label="Desenhar círculo"]'
    );

    drawingCircle.click();
  });

  initDrawing(map);
  showShapes(map);
}
