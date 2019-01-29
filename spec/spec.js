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
            distance: { x: 40, y: 0 }
          },
          rightAABB: {
            distance: { x: -40, y: 0 }
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

  describe(".boolCircleToAABB", function () {
    it("exists", function () {
      chai.expect(collisionManager.boolCircleToAABB).to.be.a("function");
    });

    it("should return true when circle and AABB are overlapping", function () {

      // assemble
      const circle = {
        position: { x: 40, y: 30 },
        radius: 40
      };
      const aabb = [
        { x: 25, y: 10 },
        { x: 50, y: 10 },
        { x: 50, y: 30 },
        { x: 25, y: 30 }
      ];

      // act
      const result = collisionManager.boolCircleToAABB(circle, aabb);

      // assert
      chai.expect(result).to.be.a("boolean");
      chai.expect(result).to.be.equal(true);
    });

    it("should return false when circle and AABB aren't overlapping", function () {

      // assemble
      const circle = {
        position: { x: 100, y: 20 },
        radius: 20
      };
      const aabb = [
        { x: 25, y: 10 },
        { x: 50, y: 10 },
        { x: 50, y: 30 },
        { x: 25, y: 30 }
      ];

      // act
      const result = collisionManager.boolCircleToAABB(circle, aabb);

      // assert
      chai.expect(result).to.be.a("boolean");
      chai.expect(result).to.equal(false);
    });

    it("should throw exception when incorrect parameters are passed", function () {
      
      // assemble
      const circle = {};
      const aabb = [{}];
      const expectedErrorMessage = "Exception in function 'boolCircleToAABB' - Invalid parameter";

      // act
      const functionToThrow = collisionManager.boolCircleToAABB.bind(collisionManager, circle, aabb);

      // assert
      chai.expect(functionToThrow).to.throw(expectedErrorMessage);
    });

    it("should throw exception when no parameters are passed", function () {
      
      // assemble
      const expectedErrorMessage = "Exception in function 'boolCircleToAABB' - Invalid parameter";

      // act
      const functionToThrow = collisionManager.boolCircleToAABB.bind(collisionManager);

      // assert
      chai.expect(functionToThrow).to.throw(expectedErrorMessage);
    });
  });

  describe(".maniCircleToAABB", function () {
    it("exists", function () {
      chai.expect(collisionManager.maniCircleToAABB).to.be.a("function");
    });

    it("should return 'collision: true' and correct manifest when circle and AABB are overlapping", function () {
      
      // assemble
      const circle = {
        position: { x: 40, y: 20 },
        radius: 20
      };
      const aabb = [
        { x: 25, y: 10 },
        { x: 50, y: 10 },
        { x: 50, y: 30 },
        { x: 25, y: 30 }
      ];
      const expectedResult = {
        collision: true,
        manifest: {
          circle: {
            distance: { x: 30, y: 0 }
          },
          aabb: {
            distance: { x: -30, y: 0 }
          }
        }
      };

      // act
      const result = collisionManager.maniCircleToAABB(circle, aabb);

      // assert
      chai.expect(result).to.be.a("object");
      chai.expect(result.collision)
        .to.be.a("boolean")
        .to.equal(expectedResult.collision);
      chai.expect(result.manifest).to.be.a("object");
      chai.expect(result.manifest).to.have.property("circle");
      chai.expect(result.manifest.circle).to.have.property("distance");
      chai.expect(result.manifest.circle.distance).to.have.property("x",
        expectedResult.manifest.circle.distance.x);
      chai.expect(result.manifest.circle.distance).to.have.property("y",
        expectedResult.manifest.circle.distance.y);
      chai.expect(result.manifest).to.have.property("aabb");
      chai.expect(result.manifest.aabb).to.have.property("distance");
      chai.expect(result.manifest.aabb.distance).to.have.property("x",
        expectedResult.manifest.aabb.distance.x);
      chai.expect(result.manifest.aabb.distance).to.have.property("y",
        expectedResult.manifest.aabb.distance.y);
    });

    it("should return 'collision: false' and empty manifest when circle and AABB aren't overlapping", function () {
      
      // assemble
      const circle = {
        position: { x: 100, y: 20 },
        radius: 20
      };
      const aabb = [
        { x: 25, y: 10 },
        { x: 50, y: 10 },
        { x: 50, y: 30 },
        { x: 25, y: 30 }
      ];
      const expectedResult = {
        collision: false,
        manifest: {}
      };

      // act
      const result = collisionManager.maniCircleToAABB(circle, aabb);

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
      const circle = {};
      const aabb = [{}];
      const expectedErrorMessage = "Exception in function 'maniCircleToAABB' - Invalid parameter";

      // act
      const functionToThrow = collisionManager.maniCircleToAABB.bind(collisionManager, circle, aabb);

      // assert
      chai.expect(functionToThrow).to.throw(expectedErrorMessage);
    });

    it("should throw exception when no parameters are passed", function () {
      
      // assemble
      const expectedErrorMessage = "Exception in function 'maniCircleToAABB' - Invalid parameter";

      // act
      const functionToThrow = collisionManager.maniCircleToAABB.bind(collisionManager);

      // assert
      chai.expect(functionToThrow).to.throw(expectedErrorMessage);
    });
  });

  describe(".boolCapsuleToCapsule", function () {
      it("exists", function () {
          chai.expect(collisionManager.boolCapsuleToCapsule).to.be.a("function");
      });

      it("should return true when capsules overlapping", function () {

        // assemble
        const capsule1 = {
          points: [
            { x: 2, y: -2 },
            { x: 2, y: 2 }
          ],
          radius: 3
        };
        const capsule2 = {
          points: [
            { x: 4, y: -2 },
            { x: 4, y: 2 }
          ],
          radius: 2
        };

        // act
        const result = collisionManager.boolCapsuleToCapsule(capsule1, capsule2);

        // assert
        chai.expect(result).to.be.a("boolean");
        chai.expect(result).to.equal(true);
      });

      it("should return false when capsules are not overlapping", function () {

        // assemble
        const capsule1 = {
          points: [
            { x: 5, y: -2 },
            { x: 5, y: 2 }
          ],
          radius: 2
        };
        const capsule2 = {
          points: [
            { x: 0, y: -2 },
            { x: 0, y: 2 }
          ],
          radius: 2
        };

        // act
        const result = collisionManager.boolCapsuleToCapsule(capsule1, capsule2);

        // assert
        chai.expect(result).to.be.a("boolean");
        chai.expect(result).to.equal(false);
      });

      it("should throw exception when incorrect parameters are passed", function () {

        // assemble
        const capsule1 = {};
        const capsule2 = {};
        const expectedErrorMessage = "Exception in function 'boolCapsuleToCapsule' - Invalid parameter";

        // act
        const functionToThrow = collisionManager.boolCapsuleToCapsule.bind(collisionManager, capsule1, capsule2);

        // assert
        chai.expect(functionToThrow).to.throw(expectedErrorMessage);
      });

      it("should throw exception when no parameters are passed", function () {

        // assemble
        const expectedErrorMessage = "Exception in function 'boolCapsuleToCapsule' - Invalid parameter";

        // act
        const functionToThrow = collisionManager.boolCapsuleToCapsule.bind(collisionManager);

        // assert
        chai.expect(functionToThrow).to.throw(expectedErrorMessage);
      });
  });

  /*
  describe(".boolCapsuleToCircle", function () {
    it("exists", function () {
      chai.expect(collisionManager.boolCapsuleToCircle).to.be.a("function");
    });

    it("should return true when capsule and circle are overlapping", function () {

      // assemble
      const capsule = {
        points: [
          { x: 2, y: -2 },
          { x: 2, y: 2 }
        ],
        radius: 5
      };
      const circle = {
        position: { x: 5, y: 2 },
        radius: 5
      };

      // act
      const result = collisionManager.boolCapsuleToCircle(capsule, circle);

      // assert
      chai.expect(result).to.be.a("boolean");
      chai.expect(result).to.equal(true);
    });

    it("should return false when capsule and circle are not overlapping", function () {

      // assemble
      const capsule = {
        points: [
          { x: 2, y: -2 },
          { x: 2, y: 2 }
        ],
        radius: 5
      };
      const circle = {
        position: { x: 10, y: 2 },
        radius: 2
      };

      // act
      const result = collisionManager.boolCapsuleToCircle(capsule, circle);

      // assert
      chai.expect(result).to.be.a("boolean");
      chai.expect(result).to.equal(false);
    });

    it("should throw exception when incorrect parameters are passed", function () {

      // assemble
      const capsule = {};
      const circle = {};
      const expectedErrorMessage = "Exception in function 'boolCapsuleToCircle' - Invalid parameter";

      // act
      const functionToThrow = collisionManager.boolCapsuleToCircle.bind(collisionManager, capsule, circle);

      // assert
      chai.expect(functionToThrow).to.throw(expectedErrorMessage);
    });

    it("should throw exception when no parameters are passed", function () {

      // assemble
      const expectedErrorMessage = "Exception in function 'boolCapsuleToCircle' - Invalid parameter";

      // act
      const functionToThrow = collisionManager.boolCapsuleToCircle.bind(collisionManager);

      // assert
      chai.expect(functionToThrow).to.throw(expectedErrorMessage);
    });
  });
  /**/
});