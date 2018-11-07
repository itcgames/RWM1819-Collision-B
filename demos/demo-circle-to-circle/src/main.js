(function () {
  const greenCircle = {
    position: { x: 150, y: 200 },
    radius: 100,
    fill: "green"
  };
  const redCircle = {
    position: { x: 400, y: 200 },
    radius: 100,
    fill: "red"
  };
  const blueCircle = {
    position: { x: 500, y: 200 },
    radius: 100,
    fill: "blue"
  };

  /**
   * 
   * @param {CanvasRenderingContext2D} context 
   * @param {{ position: {x: number, y: number }, radius: number }} circle 
   */
  function drawCircle(context, circle) {
    context.beginPath();
    context.arc(circle.position.x, circle.position.y, circle.radius, 0, 2 * Math.PI, false);
    context.fillStyle = circle.fill;
    context.fill();
  };

  const textBool1 = document.getElementById("booleanCC1");
  const textBool2 = document.getElementById("booleanCC2");
  const textMani1 = document.getElementById("manifestCC1");
  const textMani2 = document.getElementById("manifestCC2");

  const canvas = document.createElement("canvas");
  canvas.width = 800;
  canvas.height = 400;
  document.body.appendChild(canvas);

  const context2d = canvas.getContext("2d");
  context2d.fillStyle = "rgba(0,0,0,255)";
  context2d.clearRect(0, 0, canvas.width, canvas.height);
  drawCircle(context2d, greenCircle);
  drawCircle(context2d, redCircle);
  drawCircle(context2d, blueCircle);

  textBool1.innerText = "Green circle to Red Circle: " + collisionManager.boolCircleToCircle(greenCircle, redCircle);
  textBool2.innerText = "Red circle to Blue circle: " + collisionManager.boolCircleToCircle(redCircle, blueCircle);

  /** @type {{ collision: boolean, manifest: { leftCircleDistance: {x: number, y: number}, rightCircleDistance: {x: number, y: number} } }} */
  const mani1 = collisionManager.maniCircleToCircle(greenCircle, redCircle);
  /** @type {{ collision: boolean, manifest: { leftCircleDistance: {x: number, y: number}, rightCircleDistance: {x: number, y: number} } }} */
  const mani2 = collisionManager.maniCircleToCircle(redCircle, blueCircle);

  textMani1.innerHTML = "Green circle to Red Circle:<br />  " + JSON.stringify(mani1, undefined, "&nbsp;");
  textMani2.innerHTML = "Red circle to Blue circle:  {<br/>&nbsp;&nbsp;&nbsp; \"collision\": " + mani2.collision + ",<br/>" +
      "&nbsp;&nbsp;&nbsp; \"manifest\": {<br/>" +
      "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; \"leftCircleDistance\": { \"x\": " + mani2.manifest.leftCircleDistance.x + ", \"y\": " + mani2.manifest.leftCircleDistance.y + " },<br/>" +
      "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; \"rightCircleDistance\": { \"x\": " + mani2.manifest.rightCircleDistance.x + ", \"y\": " + mani2.manifest.rightCircleDistance.y + " }<br/>" +
      "&nbsp;&nbsp;&nbsp; }<br/>}";
})()
