(self["webpackChunkgraham_scan"] = self["webpackChunkgraham_scan"] || []).push([["main"],{

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ (() => {

const WIDTH = 100;
const HEIGHT = 100;
const CANVAS_WIDTH = 640;
const CANVAS_HEIGHT = 640;
const CANVAS_PADDING = 5;
const CANVAS_COLOR = "rgb(180, 235, 250)";
const grahamScanCanvas = document.getElementById("graham-scan-canvas");
const grahamScanCtx = grahamScanCanvas.getContext("2d");
const resetButton = document.getElementById("reset-button");
const messageLabel = document.getElementById("message-label");
class Coord2D {
    same(other) {
        return this.x === other.x && this.y === other.y;
    }
    toCanvasCoord() {
        const scaleX = (CANVAS_WIDTH - 2 * CANVAS_PADDING) / WIDTH;
        const scaleY = (CANVAS_HEIGHT - 2 * CANVAS_PADDING) / HEIGHT;
        const canvasX = (this.x + 0.5) * scaleX + CANVAS_PADDING;
        const canvasY = (this.y + 0.5) * scaleY + CANVAS_PADDING;
        return new Coord2D(canvasX, canvasY);
    }
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
function resetCanvas() {
    grahamScanCtx.fillStyle = CANVAS_COLOR;
    grahamScanCtx.fillRect(0, 0, CANVAS_HEIGHT, CANVAS_WIDTH);
}
function drawPoint(coord, radius = 5, fillStyle = "black") {
    const canvasCoord = coord.toCanvasCoord();
    grahamScanCtx.fillStyle = fillStyle;
    grahamScanCtx.beginPath();
    grahamScanCtx.arc(canvasCoord.x, canvasCoord.y, radius, 0, 2 * Math.PI);
    grahamScanCtx.fill();
}
function drawPoints(coords, radius = 5, fillStyle = "black") {
    coords.forEach(coord => {
        drawPoint(coord, radius, fillStyle);
    });
}
function drawLine(coord1, coord2) {
    let canvasCoord1 = coord1.toCanvasCoord();
    let canvasCoord2 = coord2.toCanvasCoord();
    grahamScanCtx.strokeStyle = "black";
    grahamScanCtx.beginPath();
    grahamScanCtx.moveTo(canvasCoord1.x, canvasCoord1.y);
    grahamScanCtx.lineTo(canvasCoord2.x, canvasCoord2.y);
    grahamScanCtx.stroke();
}
function compareAngle(base1, coord1, base2, coord2) {
    const REGIONS = [[0, 0], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]];
    const x1 = coord1.x - base1.x;
    const y1 = coord1.y - base1.y;
    const x2 = coord2.x - base2.x;
    const y2 = coord2.y - base2.y;
    let regionIdx1 = REGIONS.findIndex(region => region[0] === Math.sign(x1) && region[1] === Math.sign(y1));
    let regionIdx2 = REGIONS.findIndex(region => region[0] === Math.sign(x2) && region[1] === Math.sign(y2));
    if (regionIdx1 != regionIdx2) {
        return Math.sign(regionIdx1 - regionIdx2);
    }
    return Math.sign(y1 * x2 - y2 * x1);
}
function findConvexHull(coords) {
    if (coords.length === 0) {
        return [];
    }
    const baseCoord = coords.reduce((provBaseCoord, candCoord) => {
        if (candCoord.y < provBaseCoord.y || candCoord.y === provBaseCoord.y && candCoord.x < provBaseCoord.x) {
            return candCoord;
        }
        return provBaseCoord;
    });
    let sortedCoords = [...coords];
    sortedCoords.sort((coord1, coord2) => compareAngle(baseCoord, coord1, baseCoord, coord2));
    let convexHull = Array.from([baseCoord]);
    for (const coord of sortedCoords) {
        if (coord.same(convexHull[convexHull.length - 1])) {
            continue;
        }
        while (convexHull.length >= 2) {
            if (compareAngle(convexHull[convexHull.length - 1], coord, convexHull[convexHull.length - 2], coord) <= 0) {
                convexHull.pop();
            }
            else {
                break;
            }
        }
        convexHull.push(coord);
    }
    return convexHull;
}
function drawConvexHull(coords) {
    let convexHull = findConvexHull(coords);
    resetCanvas();
    drawPoints(coords);
    grahamScanCtx.strokeStyle = "black";
    drawPoints(convexHull, 5, "red");
    for (let i = 0; i < convexHull.length - 1; i++) {
        drawLine(convexHull[i], convexHull[i + 1]);
    }
    if (convexHull.length >= 3) {
        drawLine(convexHull[convexHull.length - 1], convexHull[0]);
    }
    let percentageMessage = "";
    if (coords.length !== 0) {
        let percentage = 100 * convexHull.length / coords.length;
        percentageMessage = " (" + percentage.toPrecision(3) + "%)";
    }
    messageLabel.textContent = "Included in the convex hull: " + convexHull.length + " / " + points.length + percentageMessage;
}
let points = Array();
grahamScanCanvas.addEventListener("click", event => {
    const boundingRect = grahamScanCanvas.getBoundingClientRect();
    const scaleX = grahamScanCanvas.width / boundingRect.width;
    const scaleY = grahamScanCanvas.height / boundingRect.height;
    const canvasX = (event.clientX - boundingRect.left) * scaleX;
    const canvasY = (event.clientY - boundingRect.top) * scaleY;
    if (canvasX < CANVAS_PADDING || canvasX >= CANVAS_PADDING + CANVAS_WIDTH
        || canvasY < CANVAS_PADDING || canvasY >= CANVAS_PADDING + CANVAS_HEIGHT) {
        return;
    }
    const clickedX = Math.min(Math.floor((canvasX - CANVAS_PADDING) / ((CANVAS_WIDTH - 2 * CANVAS_PADDING) / WIDTH)), WIDTH - 1);
    const clickedY = Math.min(Math.floor((canvasY - CANVAS_PADDING) / ((CANVAS_HEIGHT - 2 * CANVAS_PADDING) / HEIGHT)), HEIGHT - 1);
    const clickedCoord = new Coord2D(clickedX, clickedY);
    let idx = points.findIndex(coord => coord.same(clickedCoord));
    if (idx === -1) {
        points.push(new Coord2D(clickedX, clickedY));
    }
    else {
        points.splice(idx, 1);
    }
    drawConvexHull(points);
});
resetButton.addEventListener("click", _event => {
    points = [];
    drawConvexHull(points);
});
grahamScanCanvas.width = CANVAS_WIDTH;
grahamScanCanvas.height = CANVAS_HEIGHT;
drawConvexHull(points);


/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ var __webpack_exports__ = (__webpack_exec__("./src/index.ts"));
/******/ }
]);
//# sourceMappingURL=main.bundle.js.map