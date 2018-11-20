(function () {
  const redAABB ={
    points:  [
      { x: 60, y: 20 },
      { x: 130, y: 20 },
      { x: 130, y: 80 },
      { x: 60, y: 80 }
    ],
    fill: "red"
  };
  const greenAABB = {
    points: [
      { x: 90, y: 40 },
      { x: 140, y: 45 },
      { x: 140, y: 95 },
      { x: 90, y: 90 }
    ],
    fill: "green"
  };
  const blueAABB = {
    points: [
      { x: 200, y: 40 },
      { x: 250, y: 35 },
      { x: 250, y: 80 },
      { x: 200, y: 85 }
    ],
    fill: "blue"
  };

  /**
   * 
   * @param {CanvasRenderingContext2D} context 
   * @param {{ points: Array<{ x: number, y: number }>, fill: string }} aabb
   */
  function drawAABB(context, aabb) {
    context.beginPath();
    aabb.points.forEach(function (point, index) {
      if (index === 0) {
        context.moveTo(point.x, point.y);
      } else {
        context.lineTo(point.x, point.y);
      }
    });
    context.fillStyle = aabb.fill;
    context.fill();
  };

  const textBool = [
    document.getElementById("booleanCC1"),
    document.getElementById("booleanCC2")
  ];
  const textMani = [
    document.getElementById("manifestCC1"),
    document.getElementById("manifestCC2")
  ];

  /** @type {HTMLCanvasElement} */
  const canvas1 = document.getElementById("canvas1");
  const context2d = canvas1.getContext("2d");
  context2d.fillStyle = "rgba(0,0,0,255)";
  context2d.clearRect(0, 0, canvas1.width, canvas1.height);
  drawAABB(context2d, redAABB);
  drawAABB(context2d, greenAABB);
  drawAABB(context2d, blueAABB);

  textBool[0].innerText = "Red AABB to Green AABB: " + collisionManager.boolAABBToAABB(redAABB.points, greenAABB.points);
  textBool[1].innerText = "Green AABB to Blue AABB: " + collisionManager.boolAABBToAABB(greenAABB.points, blueAABB.points);

  /**
   * @type {Array<{ collision: boolean, manifest: { leftAABB: { distance: {x: number, y: number} }, rightAABB: { distance: {x: number, y: number} } }}>}
   */
  const manifest = [
    collisionManager.maniAABBToAABB(redAABB.points, greenAABB.points),
    collisionManager.maniAABBToAABB(greenAABB.points, blueAABB.points)
  ];
  textMani[0].innerHTML = "Red AABB to Green:  {<br/>&nbsp;&nbsp;&nbsp; \"collision\": " + manifest[0].collision + ",<br/>" +
      "&nbsp;&nbsp;&nbsp; \"manifest\": {<br/>" +
      "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; \"leftAABB\": {<br/>" +
      "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; \"distance\": { \"x\": " + manifest[0].manifest.leftAABB.distance.x + ", \"y\": " + manifest[0].manifest.leftAABB.distance.y + " },<br/>" +
      "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; },<br/>" +
      "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; \"rightAABB\": {<br/>" +
      "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; \"distance\": { \"x\": " + manifest[0].manifest.rightAABB.distance.x + ", \"y\": " + manifest[0].manifest.rightAABB.distance.y + " }<br/>" +
      "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; }<br/>" +
      "&nbsp;&nbsp;&nbsp; }<br/>" +
      "};";
  textMani[1].innerHTML = "Green AABB to Blue AABB:<br/>  " + JSON.stringify(manifest[1], undefined, "&nbsp;");

  const after = {
    redAABB: {
      points: [
        { x: redAABB.points[0].x + manifest[0].manifest.leftAABB.distance.x, y: redAABB.points[0].y + manifest[0].manifest.leftAABB.distance.y },
        { x: redAABB.points[1].x + manifest[0].manifest.leftAABB.distance.x, y: redAABB.points[1].y + manifest[0].manifest.leftAABB.distance.y },
        { x: redAABB.points[2].x + manifest[0].manifest.leftAABB.distance.x, y: redAABB.points[2].y + manifest[0].manifest.leftAABB.distance.y },
        { x: redAABB.points[3].x + manifest[0].manifest.leftAABB.distance.x, y: redAABB.points[3].y + manifest[0].manifest.leftAABB.distance.y }
      ],
      fill: redAABB.fill
    },
    greenAABB: greenAABB,
    blueAABB: blueAABB
  };

  /** @type {HTMLCanvasElement} */
  const canvas2 = document.getElementById("canvas2");
  const context = canvas2.getContext("2d");
  context.clearRect(0, 0, canvas2.width, canvas2.height);

  drawAABB(context, after.redAABB);
  drawAABB(context, after.greenAABB);
  drawAABB(context, after.blueAABB);
})();