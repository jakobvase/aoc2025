import {
  isPointWithinLineBounds,
  isPointWithinPolygon,
  linesIntersect,
  makeEdge,
  nonEmpty,
} from "./utils.js";

const run = () => {
  isPointWithinLineBoundsTest();
  linesIntersectTest();
  isPointWithinPolygonTest();
};

const linesIntersectTest = () => {
  const e1 = makeEdge(1, 1, 3, 1);
  const intersecting = makeEdge(2, 0, 2, 2);
  const nonIntersecting = [
    makeEdge(0, 0, 5, 0),
    makeEdge(0, 0, 0, 3),
    makeEdge(0, 3, 5, 3),
    makeEdge(5, 3, 5, 0),
    makeEdge(2, 2, 2, 3),
  ];
  const easyResults = [linesIntersect(e1, intersecting)].concat(
    nonIntersecting.map((e) => !linesIntersect(e1, e))
  );
  if (easyResults.includes(false)) {
    console.dir(easyResults);
    throw new Error("linesIntersect easy failed");
  }

  const maybeIntersecting = [
    makeEdge(1, 0, 1, 2),
    makeEdge(2, 0, 2, 1),
    makeEdge(1, 1, 1, 2),
    makeEdge(2, 1, 2, 2),
    makeEdge(0, 1, 2, 1),
  ];

  // The problem is that they are not lines in the mathematical sense. They have area.
  // They are actually little individual squares. So I need to trace the left edge of the polygon instead.
  // Otherwise, it's really hard to actually determine whether something is inside or not.
  // The other option is to have the 'hangs down and to the right' interpretation.
  // That's probably easier to implement.
  // In that interpretation... God I hate this problem.
  // So if they intersect or not is dependent

  const hardResults = maybeIntersecting.map((e) => linesIntersect(e, e1));
  console.dir(hardResults);
  //   throw new Error("linesIntersect hard failed");
};

const isPointWithinPolygonTest = () => {
  const exampleInput = `1,2
2,2
2,1
9,1
9,2
10,2
10,6
9,6
9,7
2,7
2,6
1,6
1,5
8,5
8,3
1,3
`;

  const expectedOutput = `............
..xxxxxxxx..
.xxxxxxxxxx.
.xxxxxxxxxx.
........xxx.
.xxxxxxxxxx.
.xxxxxxxxxx.
..xxxxxxxx..
............
`;

  const parsed = exampleInput
    .split("\n")
    .filter(nonEmpty)
    .map((l) => l.split(",").map((n) => Number.parseInt(n)));

  const polygon = parsed.reduce(
    (acc, cur, i) => [...acc, [cur, parsed[(i + 1) % parsed.length]]],
    []
  );

  let s = "";

  for (let y = 0; y < 9; y++) {
    for (let x = 0; x < 12; x++) {
      const p = [x, y];
      const res = isPointWithinPolygon(polygon, p);
      s += res ? "x" : ".";
    }
    s += "\n";
  }
  if (s !== expectedOutput) {
    console.log("Failed");
    console.log(s);
  }
};

const isPointWithinLineBoundsTest = () => {
  const positiveResults = [
    isPointWithinLineBounds(
      [1, 1],
      [
        [1, 1],
        [2, 1],
      ]
    ),
    isPointWithinLineBounds(
      [1, 1],
      [
        [0, 1],
        [2, 1],
      ]
    ),
    isPointWithinLineBounds(
      [1, 1],
      [
        [0, 1],
        [1, 1],
      ]
    ),
    isPointWithinLineBounds(
      [1, 1],
      [
        [1, 0],
        [1, 1],
      ]
    ),
    isPointWithinLineBounds(
      [1, 1],
      [
        [1, 0],
        [1, 2],
      ]
    ),
    isPointWithinLineBounds(
      [1, 1],
      [
        [1, 1],
        [1, 2],
      ]
    ),
  ];

  if (positiveResults.includes(false)) {
    throw "isPointWithinLineBounds positive test failed";
  }

  const negXEdge = [
    [1, 1],
    [3, 1],
  ];

  const negYEdge = [
    [1, 1],
    [1, 3],
  ];

  const negPoints = [
    [0, 0],
    [1, 0],
    [0, 1],
    [2, 2],
    [1, 4],
    [4, 1],
  ];

  const negResults = negPoints
    .map((p) => isPointWithinLineBounds(p, negXEdge))
    .concat(negPoints.map((p) => isPointWithinLineBounds(p, negYEdge)));

  if (negResults.includes(true)) {
    throw "isPOintWithinLineBounds neg test failed";
  }
};

run();
