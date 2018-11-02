const path = require("path");
const chai = require("chai");

const collisionManager = require(path.join(__dirname, "..", "./rwm-collision-b.js"));

describe("collisionManager", function () {
  "use strict";

  it("exists", function () {
    chai.expect(collisionManager).to.be.a("object");
  });

  describe(".boolCircleToCircle", function () {
    it("exists", function () {
      chai.expect(collisionManager.boolCircleToCircle).to.be.a("function");
    });

    it("should return true when circles overlapping", function () {

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

    it("should return false when circles not overlapping", function () {
      
      // assemble
      const circle1 = {
        position: { x: -10, y: 0 },
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
      chai.expect(result).to.equal(false);
    });

    it("should throw exception when no parameters are passed", function () {

      // assemble
      const expectedErrorMessage = "Invalid parameter";

      // act
      const functionToThrow = collisionManager.boolCircleToCircle.bind(collisionManager);

      chai.expect(functionToThrow).to.throw(expectedErrorMessage);
    });
  });

  describe(".maniCircleToCircle", function () {
    it("exists", function () {
      chai.expect(collisionManager.maniCircleToCircle).to.be.a("function");
    });

    it("should return 'collision true' and correct manifest on circles that are overlapping", function () {

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
        manifest: {
          leftCircleDistance: { x: -1, y: 0 },
          rightCircleDistance: { x: 1, y: 0 }
        }
      };
  
      // act
      const result = collisionManager.maniCircleToCircle(circle1, circle2);
  
      // assert
      chai.expect(result).to.be.a("object");
      chai.expect(result.collision)
        .to.be.a("boolean")
        .to.equal(expectedResult.collision);
      chai.expect(result.manifest).to.be.an("object");
      chai.expect(result.manifest).to.have.property("leftCircleDistance");
      chai.expect(result.manifest.leftCircleDistance).to.have.property("x",
        expectedResult.manifest.leftCircleDistance.x);
      chai.expect(result.manifest.leftCircleDistance).to.have.property("y",
        expectedResult.manifest.leftCircleDistance.y);
      chai.expect(result.manifest).to.have.property("rightCircleDistance");
      chai.expect(result.manifest.rightCircleDistance).to.have.property("x",
        expectedResult.manifest.rightCircleDistance.x);
      chai.expect(result.manifest.rightCircleDistance).to.have.property("y",
        expectedResult.manifest.rightCircleDistance.y);
    });
    
    it("should return 'collision false' and empty manifest on circles that are not overlapping", function () {
      
      // assemble
      const circle1 = {
        position: { x: -10, y: 0 },
        radius: 10
      };
      const circle2 = {
        position: { x: 10, y: 0 },
        radius: 10
      };
      const expectedResult = {
        collision: false,
        manifest: {}
      };
  
      // act
      const result = collisionManager.maniCircleToCircle(circle1, circle2);
  
      // assert
      chai.expect(result).to.be.a("object");
      chai.expect(result.collision)
        .to.be.a("boolean")
        .to.equal(expectedResult.collision);
      chai.expect(result.manifest).to.be.an("object");
      chai.expect(result.manifest).to.be.deep.equal(expectedResult.manifest);
    });

    it("should throw exception when no parameters are passed", function () {

      // assemble
      const expectedErrorMessage = "Invalid parameter";

      // act
      const functionToThrow = collisionManager.maniCircleToCircle.bind(collisionManager);

      // assert
      chai.expect(functionToThrow).to.throw(expectedErrorMessage);
    });
  });
});