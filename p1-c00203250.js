/*! p1-c00203250 v0.0.0 - MIT license */
"use strict";

const collisionManager = (function () {
  function isVector(vector) {
    return typeof vector === "object" &&
      typeof vector.x === "number" && typeof vector.y === "number";
  };
  function isCircle(circle) {
    return typeof circle === "object" && isVector(circle.position) &&
      typeof circle.radius === "number";
  };
  function lengthSquared(vector) {
    return (vector.x * vector.x) + (vector.y * vector.y);
  };
  function length(vector) {
    return Math.sqrt(lengthSquared(vector));
  };
  function unit(vector) {
    const magnitude = length(vector);
    if (magnitude === 0) {
      return { x: 0, y: 0 };
    }
    return { x: vector.x / magnitude, y: vector.y / magnitude };
  };

  /**
   * 
   * @param {{ position: {x: number, y: number}, radius: number }} leftCircle left circle.
   * @param {{ position: {x: number, y: number}, radius: number }} rightCircle right circle.
   * @returns {boolean} true if circle has collided.
   */
  function boolCircleToCircle(leftCircle, rightCircle) {
    if (!isCircle(leftCircle) || !isCircle(rightCircle)) {
      throw "Invalid parameter";
    }

    const distanceBetween = {
      x: leftCircle.position.x - rightCircle.position.x,
      y: leftCircle.position.y - rightCircle.position.y
    };

    return (Math.pow(leftCircle.radius + rightCircle.radius, 2) > lengthSquared(distanceBetween));
  };

  /**
   * 
   * @param {{ position: {x: number, y: number}, radius: number }} leftCircle left circle.
   * @param {{ position: {x: number, y: number}, radius: number }} rightCircle right circle.
   * @returns {{ collision: boolean, distance: {x: number, y: number} }} object 
   * containing the property 'distance' and 'collision', the latter containing whether a collision occurred.
   */
  function maniCircleToCircle(leftCircle, rightCircle) {
    if (!isCircle(leftCircle) || !isCircle(rightCircle)) {
      throw "Invalid parameter";
    }

    const distanceBetween = {
      x: rightCircle.position.x - leftCircle.position.x,
      y: rightCircle.position.y - leftCircle.position.y
    };

    const result = lengthSquared(distanceBetween) - Math.pow(leftCircle.radius + rightCircle.radius, 2);
    if (0 > result) {
      return { collision: false, distance: { x: 0, y: 0 } };
    }

    // collision occurred generate manifest
    const direction = unit(distanceBetween);

    return {
      collision: true,
      manifest: {
        leftCircleDistance: { x: direction.x * result, y: direction.y * result },
        rightCircleDistance: { x: (-direction.x) * result, y: (-direction.y) * result }
      }
    };
  };

  return {
    boolCircleToCircle: boolCircleToCircle,
    maniCircleToCircle: maniCircleToCircle
  };
})();

if (typeof module !== "undefined") {
  module.exports = collisionManager;
}