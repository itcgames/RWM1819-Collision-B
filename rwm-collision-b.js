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
   * Type check that the passed in parameter is a object and
   * contains the necessary properties to be considered a aabb.
   * @param {{ position: {x: number, y: number}, size: {x: number, y: number}}} aabb 
   *  axis aligned bounding box represented by a position and a size
   */
  function isAABB(aabb) {
    return typeof aabb === "object" && isVector(aabb.position) &&
        typeof isVector(aabb.size);
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
   * @returns {{ collision: boolean, distance: {x: number, y: number} }}
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

  /**
   * @param {{ position: { x: number, y: number }, size: { x: number, y: number }}} leftAABB 
   *  left Axis aligned bounding box.
   * @param {{ position: { x: number, y: number }, size: { x: number, y: number }}} rightAABB 
   *  right axis aligned bounding box.
   * @returns {boolean} whether the left axis aligned bounding box is
   *  overlapping with the right axis aligned bounding box
   */
  function boolAABBToAABB(leftAABB, rightAABB) {
    if (!isAABB(leftAABB) || !isAABB(rightAABB)) {
      throw "Exception in 'boolAABBToAABB' - Invalid parameter";
    }

    return true;
  };

  /**
   * @param {{ position: { x: number, y: number }, size: { x: number, y: number }}} leftAABB 
   *  left axis aligned bounding box.
   * @param {{ position: { x: number, y: number }, size: { x: number, y: number }}} rightAABB 
   *  right axis aligned bounding box.
   * @returns {{ collision: boolean, manifest: { leftAABB: { distance: {x: number, y: number} }, rightAABB: { distance: {x: number, y: number} } }}}
   *  object containing the property 'manifest' and 'collision',
   *  the latter containing whether a collision occurred,
   *  the first one containing the properties 'leftAABB' and
   *  'rightAABB' each containing the property 'distance' containing the amount
   *  you can add to the position of the corresponding AABB to push them away
   *  from each other to no longer be colliding.
   */
  function maniAABBToAABB(leftAABB, rightAABB) {
    if (!isAABB(leftAABB) || !isAABB(rightAABB)) {
      throw "Exception in 'maniAABBToAABB' - Invalid parameter";
    }
    const lAABB = {
      topLeft: {
        x: leftAABB.position.x,
        y: leftAABB.position.y
      },
      topRight: {
        x: leftAABB.position.x + leftAABB.size.x,
        y: leftAABB.position.y
      },
      botLeft: {
        x: leftAABB.position.x,
        y: leftAABB.position.y + leftAABB.size.y
      },
      botRight: {
        x: leftAABB.position.x + leftAABB.size.x,
        y: leftAABB.position.y + leftAABB.size.y
      }
    };

    const rAABB = {
      topLeft: {
        x: rightAABB.position.x,
        y: rightAABB.position.y
      },
      topRight: {
        x: rightAABB.position.x + rightAABB.size.x,
        y: rightAABB.position.y
      },
      botLeft: {
        x: rightAABB.position.x,
        y: rightAABB.position.y + rightAABB.size.y
      },
      botRight: {
        x: rightAABB.position.x + rightAABB.size.x,
        y: rightAABB.position.y + rightAABB.size.y
      }
    };
    
    return {
      collision: true,
      manifest: {
        leftAABB: {
          distance: { x: 0, y: 0 }
        },
        rightAABB: {
          distance: { x: 0, y: 0 }
        }
      }
    }
  };

  return {
    boolCircleToCircle: boolCircleToCircle,
    maniCircleToCircle: maniCircleToCircle,
    boolAABBToAABB: boolAABBToAABB,
    maniAABBToAABB: maniAABBToAABB
  };
})();

if (typeof module !== "undefined") {
  module.exports = collisionManager;
}