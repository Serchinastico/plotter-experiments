import { writeFileSync } from "fs";
import makerjs from "makerjs";

const CANVAS_SIZE = { height: 100, width: 100 };
const CANVAS_MIDPOINT = { x: CANVAS_SIZE.width / 2, y: CANVAS_SIZE.height / 2 };

const circle = new makerjs.paths.Circle(
  [CANVAS_MIDPOINT.x, CANVAS_MIDPOINT.y],
  CANVAS_SIZE.width / 2
);
const diagonal1 = new makerjs.paths.Line(
  [0, 0],
  [CANVAS_SIZE.width, CANVAS_SIZE.height]
);
const diagonal2 = new makerjs.paths.Line(
  [0, CANVAS_SIZE.height],
  [CANVAS_SIZE.width, 0]
);
const horizontal = new makerjs.paths.Line(
  [0, CANVAS_MIDPOINT.y],
  [CANVAS_SIZE.width, CANVAS_MIDPOINT.y]
);
const vertical = new makerjs.paths.Line(
  [CANVAS_MIDPOINT.x, 0],
  [CANVAS_MIDPOINT.y, CANVAS_SIZE.height]
);

const doc = {
  paths: { circle, diagonal1, diagonal2, horizontal, vertical },
};

const svg = makerjs.exporter.toSVG(doc, { stroke: "#FFF" });

writeFileSync("output.svg", svg, "utf-8");
