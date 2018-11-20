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

  describe(".boolAABBToAABB", function () {
    it("exists", function () {
      chai.expect(collisionManager.boolAABBToAABB).to.be.a("function");
    });

    it("should return true when AABBs overlapping", function () {

      // assemble
      const aabb1 = [
        { x: 10, y: 10 },
        { x: 30, y: 12 },
        { x: 30, y: 32 },
        { x: 10, y: 30 }
      ];
      const aabb2 = [
        { x: 25, y: 10 },
        { x: 50, y: 10 },
        { x: 50, y: 30 },
        { x: 25, y: 30 }
      ];
      
      // act
      const result = collisionManager.boolAABBToAABB(aabb1, aabb2);
      
      // assert
      chai.expect(result).to.be.a("boolean");
      chai.expect(result).to.be.equal(true);
    });

    it("should return false when AABBs not overlapping", function () {

      // assemble
      const aabb1 = [
        { x: 50, y: 40 },
        { x: 100, y: 45 },
        { x: 100, y: 95 },
        { x: 50, y: 90 }
      ];
      const aabb2 = [
        { x: 200, y: 40 },
        { x: 250, y: 35 },
        { x: 250, y: 80 },
        { x: 200, y: 85 }
      ];

      // act
      const result = collisionManager.boolAABBToAABB(aabb1, aabb2);

      // assert
      chai.expect(result).to.be.a("boolean");
      chai.expect(result).to.equal(false);
    });

    it("should throw exception when incorrect parameters are passed", function () {
      // assemble
      const aabb1 = [];
      const aabb2 = [{}];
      const expectedErrorMessage = "Exception in function 'maniAABBToAABB' - Invalid parameter";

      // act
      const functionToThrow = collisionManager.maniAABBToAABB.bind(collisionManager, aabb1, aabb2);

      // assert
      chai.expect(functionToThrow).to.throw(expectedErrorMessage);
    });

    it("should throw exception when no parameters are passed", function () {

      // assemble
      const expectedErrorMessage = "Exception in function 'boolAABBToAABB' - Invalid parameter";

      // act
      const functionToThrow = collisionManager.boolAABBToAABB.bind(collisionManager);

      chai.expect(functionToThrow).to.throw(expectedErrorMessage);
    });
  });

  describe(".maniAABBToAABB", function () {
    it("exists", function () {
      chai.expect(collisionManager.maniAABBToAABB).to.be.a("function");
    });

    it("should return 'collision: true' and correct manifest on AABBs that are overlapping", function () {
      
      // assemble
      const aabb1 = [
        { x: 60, y: 20 },
        { x: 130, y: 20 },
        { x: 130, y: 80 },
        { x: 60, y: 80 }
      ];
      const aabb2 = [
        { x: 90, y: 40 },
        { x: 140, y: 45 },
        { x: 140, y: 95 },
        { x: 90, y: 90 }
      ];
      const expectedResult = {
        collision: true,
        manifest: {
          leftAABB: {
            distance: { x: -40, y: 0 }
          },
          rightAABB: {
            distance: { x: 40, y: 0 }
          }
        }
      };

      // act
      const result = collisionManager.maniAABBToAABB(aabb1, aabb2);

      // assert
      chai.expect(result).to.be.a("object");
      chai.expect(result.collision)
        .to.be.a("boolean")
        .to.equal(expectedResult.collision);
      chai.expect(result.manifest).to.be.a("object");
      chai.expect(result.manifest).to.have.property("leftAABB");
      chai.expect(result.manifest.leftAABB).to.have.property("distance");
      chai.expect(result.manifest.leftAABB.distance).to.have.property("x",
        expectedResult.manifest.leftAABB.distance.x);
      chai.expect(result.manifest.leftAABB.distance).to.have.property("y",
        expectedResult.manifest.leftAABB.distance.y);
      chai.expect(result.manifest).to.have.property("rightAABB");
      chai.expect(result.manifest.rightAABB).to.have.property("distance");
      chai.expect(result.manifest.rightAABB.distance).to.have.property("x",
        expectedResult.manifest.rightAABB.distance.x);
      chai.expect(result.manifest.rightAABB.distance).to.have.property("y",
        expectedResult.manifest.rightAABB.distance.y);
    });

    it("should return 'collision: false' and empty manifest on AABBs that are not overlapping", function () {

      // assemble
      const aabb1 = [
        { x: 50, y: 40 },
        { x: 100, y: 45 },
        { x: 100, y: 95 },
        { x: 50, y: 90 }
      ];
      const aabb2 = [
        { x: 200, y: 40 },
        { x: 250, y: 35 },
        { x: 250, y: 80 },
        { x: 200, y: 85 }
      ];
      const expectedResult = {
        collision: false,
        manifest: {}
      };

      // act
      const result = collisionManager.maniAABBToAABB(aabb1, aabb2);

      // assert
      chai.expect(result).to.be.a("object");
      chai.expect(result.collision)
        .to.be.a("boolean")
        .to.equal(expectedResult.collision);
      chai.expect(result.manifest).to.be.a("object");
      chai.expect(result.manifest).to.be.deep.equal(expectedResult.manifest);
    });

    it("should throw exception when incorrect parameters are passed", function () {

      // assemble
      const aabb1 = [];
      const aabb2 = [{}];
      const expectedErrorMessage = "Exception in function 'maniAABBToAABB' - Invalid parameter";

      // act
      const functionToThrow = collisionManager.maniAABBToAABB.bind(collisionManager, aabb1, aabb2);

      // assert
      chai.expect(functionToThrow).to.throw(expectedErrorMessage);
    });

    it("should throw exception when no parameters are passed", function () {
      
      // assemble
      const expectedErrorMessage = "Exception in function 'maniAABBToAABB' - Invalid parameter";

      // act
      const functionToThrow = collisionManager.maniAABBToAABB.bind(collisionManager);

      chai.expect(functionToThrow).to.throw(expectedErrorMessage);
    });
  });
});