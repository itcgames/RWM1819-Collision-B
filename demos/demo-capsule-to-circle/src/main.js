(function () {
  const redCapsule ={
    points:  [
      { x: 60, y: 20 },
      { x: 60, y: 80 }
    ],
    radius: 20,
    fill: "red"
  };
  const greenCircle = {
    position: { x: 40, y: 80},
    radius: 20,
    fill: "green"
  };
  const blueCapsule = {
    points:  [
      { x: 220, y: 40 },
      { x: 220, y: 80 }
    ],
    radius: 40,
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
  /**
   * @param {CanvasRenderingContext2D} context 
   * @param {{ points: Array<{x: number, y: number}>, radius: number}} capsule 
   */
  function drawCapsule(context, capsule) {
    capsule.points.forEach(p => drawCircle(context, { position: p, radius: capsule.radius, fill: capsule.fill }));
    const rect = {
      points: [
        {x: capsule.points[0].x - capsule.radius, y: capsule.points[0].y },
        {x: capsule.points[0].x + capsule.radius, y: capsule.points[0].y },
        {x: capsule.points[1].x + capsule.radius, y: capsule.points[1].y },
        {x: capsule.points[1].x - capsule.radius, y: capsule.points[1].y}
      ],
      fill: capsule.fill
    };
    drawAABB(context, rect);
  };

  const textBool = [
    document.getElementById("booleanCC1"),
    document.getElementById("booleanCC2")
  ];

  /** @type {HTMLCanvasElement} */
  const canvas1 = document.getElementById("canvas1");
  const context2d = canvas1.getContext("2d");
  context2d.fillStyle = "rgba(0,0,0,255)";
  context2d.clearRect(0, 0, canvas1.width, canvas1.height);
  drawCapsule(context2d, redCapsule);
  drawCircle(context2d, greenCircle);
  drawCapsule(context2d, blueCapsule);

  textBool[0].innerText = "Red Capsule to Green Circle: " + collisionManager.boolCapsuleToCircle(redCapsule, greenCircle);
  textBool[1].innerText = "Green Circle to Blue Capsule: " + collisionManager.boolCapsuleToCircle(blueCapsule, greenCircle);

})();