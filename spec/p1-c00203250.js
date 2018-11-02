var path = require("path");
var chai = require("chai");

const collisionManager = require(path.join(__dirname, "..", "./p1-c00203250.js"));

describe("collisionManager", function () {
  "use strict";

  it("exists", function () {
    chai.expect(collisionManager).to.be.a("object");
  });

  it("circle to circle boolean collision detection", function () {
    // assemble
    const circle1 = {
      position: { x: -9, y: 0 },
      radius: 10
    };
    const circle2 = {
      position: { x: 10, y: 0 },
      radius: 10
    };

    // act
    const result = collisionManager.boolCircleToCircle(circle1, circle2);

    // assert
    chai.expect(result).to.be.a("boolean");
    chai.expect(result).to.equal(true);
  });

  it("circle to circle manifest collision detection", function () {
    // assemble
    const circle1 = {
      position: { x: -9, y: 0 },
      radius: 10
    };
    const circle2 = {
      position: { x: 10, y: 0 },
      radius: 10
    };
    const expectedResult = {
      collision: true,
      manifest: { distance: { x: 1, y: 0 } }
    };

    // act
    const result = collisionManager.maniCircleToCircle(circle1, circle2);

    // assert
    chai.expect(result).to.be.a("object");
    chai.expect(result).to.eql(expectedResult);
  });
});