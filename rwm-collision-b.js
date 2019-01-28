/*! rwm-collision-b v0.1.0 - MIT license */
"use strict";

/**
 * Collision manager object available in the global scope.
 * @type {{ boolCircleToCircle: (left: { position: {x: number, y: number}, radius: number }, right: { position: {x: number, y: number}, radius: number }) => boolean, maniCircleToCircle: (left: { position: {x: number, y: number}, radius: number }, right: { position: {x: number, y: number}, radius: number }) => { collision: boolean, manifest: { leftCircleDistance: {x: number, y: number}, rightCircleDistance: {x: number, y: number} } }, boolAABBToAABB: (left: Array<{ x: number, y: number }>, right: Array<{ x: number, y: number }>) => boolean, maniAABBToAABB: (left: Array<{ x: number, y: number }>, right: Array<{ x: number, y: number }>) => { collision: boolean, manifest: { leftAABB: { distance: {x: number, y: number} }, rightAABB: { distance: {x: number, y: number} } }}, boolCircleToAABB: (circle: { position: {x: number, y: number }, radius: number }, aabb: Array<{ x: number, y: number }>) => boolean, maniCircleToAABB: (circle: { position: {x: number, y: number }, radius: number }, aabb: Array<{ x: number, y: number }>) => { collision: boolean, manifest: { circle: { distance: { x: number, y: number }}, aabb: { distance: { x: number, y: number }}} } }}
 */
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
   * @param {Array<{ x: number, y: number }>} aabb 
   *  axis aligned bounding box represented by four points
   */
  function isAABB(aabb) {
    return typeof aabb === "object" && aabb.length === 4
      && aabb.every(function (ele) { return isVector(ele); });
  };

  /**
   * Type check that the passed in parameter is a object and
   * contains the necessary properties to be considered a capsule.
   * @param {{points: Array<{ x: number, y: number }>, radius: number}} capsule 
   *  capsule that is represented by one radius with two points.
   */
  function isCapsule(capsule) {
    return typeof capsule === "object" && typeof capsule.radius === "number"
      && capsule.points !== "undefined" && capsule.points.length === 2
      && capsule.points.every(function (p) { return isVector(p); });
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
   * calculate dot project between 2 vectors via mathematical formula:
   *  dot product = left.x * right.x + left.y * right.y
   * @param {{ x: number, y: number}} left 
   *  left side vector.
   * @param {{ x: number, y: number }} right 
   *  right side vector.
   */
  function dotProduct(left, right) {
    return (left.x * right.x) + (left.y * right.y);
  };

  /**
   * projects all the corners of the axis aligned bounding box onto the axis,
   * returning the two outermost points of this projection.
   * @param {{ x: number, y: number}} axis 
   *  2 dimensional vector used as axis
   * @param {Array<{ x: number, y: number }>} aabb 
   *  The four corners of the axis aligned bounding box.
   * @returns {{ min: number, max: number }}
   *  the two outermost points
   */
  function projectAABBOnto(axis, aabb) {
    const result = { min: 0, max: 0 };

    aabb.forEach(function (element, index) {
      const projection = dotProduct(element, axis);
      if (index === 0) {
        result.min = projection;
        result.max = projection;
      } else {
        if (projection < result.min) {
          result.min = projection;
        }
        if (projection > result.max) {
          result.max = projection;
        }
      }
    });

    return result;
  };

  /**
   * @param {{ x: number, y: number }} axis 
   *  2 dimensional vector as axis.
   * @param {{ position: {x: number, y: number}, radius: number }} circle 
   * @returns {{ min: number, max: number }}
   *  the two outermost points
   */
  function projectCircleOnto(axis, circle) {
    const result = { min: 0, max: 0 };

    [
      { x: circle.position.x - circle.radius, y: circle.position.y - circle.radius },
      { x: circle.position.x + circle.radius, y: circle.position.y + circle.radius }
    ].forEach(function (element, index) {
      const projection = dotProduct(element, axis);
      if (index === 0) {
        result.min = projection;
        result.max = projection;
      } else {
        if (projection < result.min) {
          result.min = projection;
        }
        if (projection > result.max) {
          result.max = projection;
        }
      }
    });

    return result;
  };

  /**
   * Gets the smallest overlap between the two projections.
   * @param {{ min: number, max: number }} leftProjection
   *  
   * @param {{ min: number, max: number }} rightProjection 
   */
  function getSmallestOverlap(leftProjection, rightProjection) {
    const rMinTolMax = Math.abs(rightProjection.min - leftProjection.max);
    const rMaxTolMin = Math.abs(rightProjection.max - leftProjection.min);
    if (rMinTolMax < rMaxTolMin) {
      return rMinTolMax;
    } else {
      return rMaxTolMin;
    }
  };

  /**
   * @param {{ x: number, y: number }} point 
   *  point in space
   * @param {{ start: { x: number, y: number }, end: { x: number, y: number }}} line 
   *  line segment
   */
  function getMinimumDistanceBetween(point, line) {
    const lineSection = {
      x: line.end.x - line.start.x,
      y: line.end.y - line.start.y
    };
    const magnitudeSquared = lengthSquared(lineSection);
    if (magnitudeSquared === 0) {
      const betweenPointAndStart = {
        x: point.x - line.start.x,
        y: point.y - line.start.y
      };
      return length(betweenPointAndStart);
    } else {
      const pointMinusStart = { x: point.x - line.start.x, y: point.y - line.start.y };
      const endMinusStart = { x: line.end.x - line.start.x, y: line.end.y - line.start.y };
      const t = Math.max(0, Math.min(1, dotProduct(pointMinusStart, endMinusStart) / magnitudeSquared))
      const projection = {
        x: line.start.x + t * (line.end.x - line.start.x),
        y: line.start.y + t * (line.end.y - line.start.y)
      };
      return length({
        x: point.x - projection.x,
        y: point.y - projection.y
      });
    }
  }

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

  /**
   * @param {Array<{ x: number, y: number }>} leftAABB 
   *  left Axis aligned bounding box.
   * @param {Array<{ x: number, y: number }>} rightAABB 
   *  right axis aligned bounding box.
   * @returns {boolean} whether the left axis aligned bounding box is
   *  overlapping with the right axis aligned bounding box
   */
  function boolAABBToAABB(leftAABB, rightAABB) {
    if (!isAABB(leftAABB) || !isAABB(rightAABB)) {
      throw "Exception in function 'boolAABBToAABB' - Invalid parameter";
    }

    /**
     * Define our 4 separate axis
     * @type {Array<{ x: number, y: number }>}
     */
    const axes = [
      { x: leftAABB[1].x - leftAABB[0].x, y: leftAABB[1].y - leftAABB[1].y },
      { x: leftAABB[1].x - leftAABB[2].x, y: leftAABB[1].y - leftAABB[2].y },
      { x: rightAABB[0].x - rightAABB[3].x, y: rightAABB[0].y - rightAABB[3].y },
      { x: rightAABB[0].x - rightAABB[1].x, y: rightAABB[0].y - rightAABB[1].y }
    ];
    axes.forEach(function (ele, index, array) {
      array[index] = unit(ele);
    });

    const result = axes.every(function (element) {
      const leftProjection = projectAABBOnto(element, leftAABB);
      const rightProjection = projectAABBOnto(element, rightAABB);

      if (!((rightProjection.min <= leftProjection.max) && (rightProjection.max >= leftProjection.min))) {
        return false; // terminates loop
      }
      return true; // continues loop
    });

    return result;
  };

  /**
   * @param {Array<{ x: number, y: number }>} leftAABB 
   *  left axis aligned bounding box.
   * @param {Array<{ x: number, y: number }>} rightAABB 
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
      throw "Exception in function 'maniAABBToAABB' - Invalid parameter";
    }

    /**
     * Define our 4 separate axis.
     * @type {Array<{ x: number, y: number }>}
     */
    const axes = [
      { x: leftAABB[1].x - leftAABB[0].x, y: leftAABB[1].y - leftAABB[1].y },
      { x: leftAABB[1].x - leftAABB[2].x, y: leftAABB[1].y - leftAABB[2].y },
      { x: rightAABB[0].x - rightAABB[3].x, y: rightAABB[0].y - rightAABB[3].y },
      { x: rightAABB[0].x - rightAABB[1].x, y: rightAABB[0].y - rightAABB[1].y }
    ];
    axes.forEach(function (ele, index, array) {
      array[index] = unit(ele);
    });

    const mtv = {
      overlap: Number.MAX_VALUE,
      axis: { x: 0, y: 0 }
    };
    const collision = axes.every(function (element) {
      const leftProjection = projectAABBOnto(element, leftAABB);
      const rightProjection = projectAABBOnto(element, rightAABB);

      if (!((rightProjection.min < leftProjection.max) && (rightProjection.max > leftProjection.min))) {
        return false; // terminates loop
      }
      const overlap = getSmallestOverlap(leftProjection, rightProjection);
      if (overlap < mtv.overlap) {
        mtv.overlap = overlap;
        mtv.axis = element;
      }

      return true; // continues loop
    });

    if (!collision) {
      return {
        collision: collision,
        manifest: {}
      };
    }

    const unitAxis = unit(mtv.axis);
    return {
      collision: collision,
      manifest: {
        leftAABB: {
          distance: {
            x: unitAxis.x * mtv.overlap,
            y: unitAxis.y * mtv.overlap
          }
        },
        rightAABB: {
          distance: {
            x: unitAxis.x * -mtv.overlap,
            y: unitAxis.y * -mtv.overlap
          }
        }
      }
    };
  };

  /**
   * @param {{ position: {x: number, y: number }, radius: number }} circle 
   *  circle
   * @param {Array<{ x: number, y: number }>} aabb 
   *  axis aligned bounding box
   * @returns {boolean} whether the circle is overlapping
   *  with the axis aligned bounding box.
   */
  function boolCircleToAABB(circle, aabb) {
    if (!isCircle(circle) || !isAABB(aabb)) {
      throw "Exception in function 'boolCircleToAABB' - Invalid parameter";
    }

    const aabbCenter = { x: aabb[2].x - aabb[0].x, y: aabb[2].y - aabb[0].y };
    /**
     * Define our separate axis
     * @type {Array<{ x: number, y: number }>}
     */
    const axes = [
      { x: aabb[1].x - aabb[0].x, y: aabb[1].y - aabb[1].y },
      { x: aabb[1].x - aabb[2].x, y: aabb[1].y - aabb[2].y },
      { x: aabbCenter.x - circle.position.x, y: aabbCenter.y - circle.position.y }
    ];
    axes.forEach(function (ele, index, array) {
      array[index] = unit(ele);
    });

    const result = axes.every(function (element) {
      const aabbProjection = projectAABBOnto(element, aabb);
      const circleProjection = projectCircleOnto(element, circle);

      // if false it terminates the loop, if true the loop continues.
      if (!((circleProjection.min <= aabbProjection.max) && (circleProjection.max >= aabbProjection.min))) {
        return false;
      }
      return true;
    });

    return result;
  };

  /**
   * @param {{ position: {x: number, y: number }, radius: number }} circle 
   *  circle
   * @param {Array<{ x: number, y: number }>} aabb 
   *  axis aligned bounding box
   * @returns {{ collision: boolean, manifest: { circle: { distance: { x: number, y: number }}, aabb: { distance: { x: number, y: number }}} }} whether the circle is overlapping
   *  with the axis aligned bounding box.
   */
  function maniCircleToAABB(circle, aabb) {
    if (!isCircle(circle) || !isAABB(aabb)) {
      throw "Exception in function 'maniCircleToAABB' - Invalid parameter";
    }

    const aabbCenter = { x: aabb[2].x - aabb[0].x, y: aabb[2].y - aabb[0].y };
    /**
     * Define our separate axis
     * @type {Array<{ x: number, y: number}>}
     */
    const axes = [
      { x: aabb[1].x - aabb[0].x, y: aabb[1].y - aabb[1].y },
      { x: aabb[1].x - aabb[2].x, y: aabb[1].y - aabb[2].y },
      { x: aabbCenter.x - circle.position.x, y: aabbCenter.y - circle.position.y }
    ];
    axes.forEach(function (ele, index, array) {
      array[index] = unit(ele);
    });

    const mtv = {
      overlap: Number.MAX_VALUE,
      axis: { x: 0, y: 0 }
    };
    const collision = axes.every(function (element) {
      const aabbProjection = projectAABBOnto(element, aabb);
      const circleProjection = projectCircleOnto(element, circle);

      // if false it terminates the loop, if true the loop continues.
      if (!((circleProjection.min <= aabbProjection.max) && (circleProjection.max >= aabbProjection.min))) {
        return false; // terminates loop
      }
      const overlap = getSmallestOverlap(aabbProjection, circleProjection);
      if (overlap < mtv.overlap) {
        mtv.overlap = overlap;
        mtv.axis = element;
      }

      return true;
    });

    if (!collision) {
      return {
        collision: collision,
        manifest: {}
      };
    }

    return {
      collision: collision,
      manifest: {
        circle: {
          distance: {
            x: mtv.axis.x * mtv.overlap,
            y: mtv.axis.y * -mtv.overlap
          }
        },
        aabb: {
          distance: {
            x: mtv.axis.x * -mtv.overlap,
            y: mtv.axis.y * mtv.overlap
          }
        }
      }
    };
  };

  /**
   * @param {{ points: Array<{ x: number, y: number }>, radius: number }} left 
   *  capsule that is represented by one radius with two points.
   * @param {{ points: Array<{ x: number, y: number }>, radius: number }} right 
   *  capsule that is represented by one radius with two points.
   * @returns {boolean} whether any of the capsules are overlapping.
   */
  function boolCapsuleToCapsule(left, right) {
    if (!isCapsule(left) || !isCapsule(right)) {
      throw "Exception in function 'boolCapsuleToCapsule' - Invalid parameter";
    }

    const magnitude = left.radius + right.radius;
    const rightLine = { start: right.points[0], end: right.points[1] };
    const leftLine = { start: left.points[0], end: left.points[1] };
    const result = !left.points.every(function (p) {
      const distance = getMinimumDistanceBetween(p, rightLine);
      return magnitude < distance;
    }) || !right.points.every(function (p) {
      const distance = getMinimumDistanceBetween(p, leftLine);
      return magnitude < distance;
    });
    return result;
  };

  /**
   * @param {{ points: Array<{ x: number, y: number }>, radius: number }} capsule 
   *  capsule that is represented by one radius with two points.
   * @param {{ position: { x: number, y: number }, radius: number }} circle 
   *  circle represented by one radius and a position.
   * @returns {boolean} whether the capsule is overlapping with the circle.
   */
  function boolCapsuleToCircle(capsule, circle) {
  };

  return {
    boolCircleToCircle: boolCircleToCircle,
    boolAABBToAABB: boolAABBToAABB,
    boolCircleToAABB: boolCircleToAABB,
    boolCapsuleToCapsule: boolCapsuleToCapsule,
    boolCapsuleToCircle: boolCapsuleToCircle,
    maniCircleToCircle: maniCircleToCircle,
    maniAABBToAABB: maniAABBToAABB,
    maniCircleToAABB: maniCircleToAABB
  };
})();

if (typeof module !== "undefined") {
  module.exports = collisionManager;
}