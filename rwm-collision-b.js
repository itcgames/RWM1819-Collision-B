/*! rwm-collision-b v0.1.0 - MIT license */
"use strict";

const collisionManager = (function () {

  /**
   * Type check that the passed in parameter is a object and 
   * contains the necessary properties to be considered a vector.
   * @param {{ x: number, y: number}} vector
   *  2 dimensional vector.
   */
  function isVector(vector) {
    return typeof vector === "object" &&
      typeof vector.x === "number" && typeof vector.y === "number";
  };

  /**
   * Type check that the passed in parameter is a object and
   * contains the necessary properties to be considered a circle.
   * @param {{ position: {x: number, y: number}, radius: number}} circle
   *  circle represented by a position and a radius
   */
  function isCircle(circle) {
    return typeof circle === "object" && isVector(circle.position) &&
      typeof circle.radius === "number";
  };

  /**
   * calculate the length of the vector squared,
   * used to avoid the lengthly operation of square rooting.
   * @param {{ x: number, y: number }} vector
   *  2 dimensional vector
   */
  function lengthSquared(vector) {
    return (vector.x * vector.x) + (vector.y * vector.y);
  };

  /**
   * calculate the length of the vector.
   * @param {{ x: number, y: number }} vector 
   *  2 dimensional vector
   */
  function length(vector) {
    return Math.sqrt(lengthSquared(vector));
  };

  /**
   * calculate the unit vector.
   * @param {{ x: number, y: number }} vector 
   *  2 dimensional vector
   */
  function unit(vector) {
    const magnitude = length(vector);
    if (magnitude === 0) {
      return { x: 0, y: 0 };
    }
    return { x: vector.x / magnitude, y: vector.y / magnitude };
  };


  /**
   * @param {{ position: {x: number, y: number}, radius: number }} leftCircle
   *  left circle.
   * @param {{ position: {x: number, y: number}, radius: number }} rightCircle
   *  right circle.
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
   * @param {{ position: {x: number, y: number}, radius: number }} leftCircle
   *  left circle.
   * @param {{ position: {x: number, y: number}, radius: number }} rightCircle
   *  right circle.
   * @returns {{ collision: boolean, manifest: { leftCircleDistance: {x: number, y: number}, rightCircleDistance: {x: number, y: number} } }}
   *  object containing the property 'manifest' and 'collision',
   *  the latter containing whether a collision occurred,
   *  the first one containing the property 'leftCircleDistance' and
   *  'rightCircleDistance' each containing the amount you can push each
   *  circle away from each other.
   */
  function maniCircleToCircle(leftCircle, rightCircle) {
    if (!isCircle(leftCircle) || !isCircle(rightCircle)) {
      throw "Invalid parameter";
    }

    const distanceBetween = {
      x: rightCircle.position.x - leftCircle.position.x,
      y: rightCircle.position.y - leftCircle.position.y
    };

    if (Math.pow(leftCircle.radius + rightCircle.radius, 2) <= lengthSquared(distanceBetween)) {
      return { collision: false, manifest: {} };
    }
    
    // collision occurred generate manifest
    const result = length(distanceBetween) -
        (leftCircle.radius + rightCircle.radius);
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