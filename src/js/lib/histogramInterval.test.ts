

import brim from "../brim";
import histogramInterval from "./histogramInterval";

const start = new Date();

test("returns the proper format", () => {
  const end = brim.time(start).add(5, "minutes").toDate();
  const timeWindow = [start, end];

  expect(histogramInterval(timeWindow)).toEqual({
    number: 1,
    unit: "second",
    roundingUnit: "second"
  });
});