const fillPoints = (points, count) => {
  points.splice(0, points.length);

  for (let i = 0; i < count; i += 1) {
    points.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: 0,
      vy: 0,
    });
  }
};

const getFlowVector = (x, y) => {
  var scale = 0.01;
  return noise.perlin2(x * scale, y * scale) * Math.PI * 2;
};

const main = () => {
  /**
   * @type {HTMLCanvasElement}
   */
  const canvas = document.querySelector("#canvas");
  const context = canvas.getContext("2d");
  const width = (canvas.width = window.innerWidth);
  const height = (canvas.height = window.innerHeight);

  const maxStepsInput = document.querySelector("#max-steps");
  const numPointsInput = document.querySelector("#num-points");
  const forceInput = document.querySelector("#force");
  const forceFrictionInput = document.querySelector("#force-friction");
  const frictionInput = document.querySelector("#friction");
  const penWidthInput = document.querySelector("#pen-width");
  const form = document.querySelector("#form");

  context.strokeStyle = "#000";
  context.lineWidth = penWidthInput.value;

  noise.seed(Math.random());
  let step = 0;
  const maxSteps = Number.parseInt(maxStepsInput.value);
  const gradientFunction = chroma.scale([
    "#000814",
    "#001d3d",
    "#003566",
    "#ffc300",
    "#ffd60a",
  ]);
  const points = [];
  fillPoints(points, numPointsInput.value);
  let force = forceInput.value;
  let forceFriction = forceFrictionInput.value;
  let friction = frictionInput.value;

  document.querySelector("#restart").addEventListener("click", () => {
    fillPoints(points, numPointsInput.value);
    force = forceInput.value;
    friction = frictionInput.value;
    context.lineWidth = penWidthInput.value;

    context.clearRect(0, 0, window.innerWidth, window.innerHeight);
  });

  document.querySelector("#minimize").addEventListener("click", () => {
    form.classList.toggle("dn");
    form.classList.toggle("flex");
  });

  const render = () => {
    points.forEach((point) => {
      /**
       * 1. Update the point velocity according to its position
       *    following the field vectors
       * 2. Move the point according to its velocity and trace a path
       * 3. Reduce the velocity of the point (simulating friction)
       * 4. Update point position if it went out of bounds making
       *    the plane a continuum
       */
      const value = getFlowVector(point.x, point.y);
      point.vx += Math.cos(value) * force;
      point.vy += Math.sin(value) * force;

      context.beginPath();
      context.moveTo(point.x, point.y);

      point.x += point.vx;
      point.y += point.vy;
      context.lineTo(point.x, point.y);
      context.stroke();

      point.vx *= 1 - friction;
      point.vy *= 1 - friction;

      if (point.x > width) point.x = 0;
      if (point.y > height) point.y = 0;
      if (point.x < 0) point.x = width;
      if (point.y < 0) point.y = height;
    });

    step += 1;

    const newColor = gradientFunction(step / maxSteps);
    context.strokeStyle = newColor;

    if (maxSteps === 0 || step < maxSteps) {
      requestAnimationFrame(render);
    }

    if (forceFriction > 0) {
      force *= 1 - forceFriction;
    }
  };

  render();

  //   const count = 20000;

  //   for (let i = 0; i < count; i++) {
  //     var x = Math.random() * width,
  //       y = Math.random() * height;

  //     const value = getFlowVector(x, y);

  //     context.save();
  //     context.translate(x, y);

  //     render(value);

  //     context.restore();
  //   }
};

document.addEventListener("DOMContentLoaded", main);
