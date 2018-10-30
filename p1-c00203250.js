/*! p1-c00203250 v0.0.0 - MIT license */
"use strict";

var collisionManager = (function() {
    var isVector = function (vector) {
        return typeof vector === "object" &&
            typeof vector.x === "number" && typeof vector.y === "number";
    };
    var isCircle = function (circle) {
        return typeof circle === "object" && isVector(circle.position) &&
            typeof circle.radius === "number";
    };
    var lengthSquared = function (vector) {
        return (vector.x * vector.x) + (vector.y * vector.y);
    };
    var length = function (vector) {
        return Math.sqrt(lengthSquared(vector));
    };
    var unit = function (vector) {
        var magnitude = length(vector);
        if (magnitude === 0) { return { x: 0, y: 0 }; }
        return { x: vector.x / magnitude, y: vector.y / magnitude };
    };

    /**
     * 
     * @param {{ position: {x: number, y: number}, radius: number }} leftCircle left circle.
     * @param {{ position: {x: number, y: number}, radius: number }} rightCircle right circle.
     * @returns {boolean} true if circle has collided.
     */
    var boolCircleToCircle = function (leftCircle, rightCircle) {
        if (!isCircle(leftCircle) || !isCircle(rightCircle)) { throw "Invalid parameter"; }

       var distanceBetween = {
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
    var maniCircleToCircle = function (leftCircle, rightCircle) {
        if (!isCircle(leftCircle) || !isCircle(rightCircle)) { throw "Invalid parameter"; }
        
        var distanceBetween = {
            x: rightCircle.position.x - leftCircle.position.x,
            y: rightCircle.position.y - leftCircle.position.y
        };

        var result = lengthSquared(distanceBetween) - Math.pow(leftCircle.radius + rightCircle.radius, 2);
        if (0 > result) { return { collision: false, distance: {x: 0, y: 0} }; }

        // collision occurred generate manifest
        var direction = unit(distanceBetween);

        return {
            collision: true,
            distance: { x: direction.x * result, y: direction.y * result }
        };
    };

    return {
        boolCircleToCircle: boolCircleToCircle,
        maniCircleToCircle: maniCircleToCircle
    };
})();

if (typeof module !== "undefined")
{
    module.exports = collisionManager;
}