const assert = require("assert");
const { Match } = require("./match.js");
const match = new Match("player 1", "player 2");

describe("Scoring tests", () => {
  it("15-15", (done) => {
    try {
      match.pointWonBy("player 1");
      match.pointWonBy("player 2");
      assert(match.score() === "0-0, 15-15");
      done();
    } catch (e) {
      done(e);
    }
  });

  it("40-15", (done) => {
    try {
      match.pointWonBy("player 1");
      match.pointWonBy("player 1");
      assert(match.score() === "0-0, 40-15");
      done();
    } catch (e) {
      done(e);
    }
  });

  it("Deuce", (done) => {
    try {
      match.pointWonBy("player 2");
      match.pointWonBy("player 2");
      assert(match.score() === "0-0, Deuce");
      done();
    } catch (e) {
      done(e);
    }
  });

  it("Advantage player 1", (done) => {
    try {
      match.pointWonBy("player 1");
      assert(match.score() === "0-0, Advantage player 1");
      done();
    } catch (e) {
      done(e);
    }
  });

  it("Game won by player 1", (done) => {
    try {
      match.pointWonBy("player 1");
      assert(match.score() === "1-0");
      done();
    } catch (e) {
      done(e);
    }
  });

  it("Enter tie break", (done) => {
    try {
      for (let i = 0; i < 20; i++) {
        match.pointWonBy("player 1");
      }
      for (let i = 0; i < 20; i++) {
        match.pointWonBy("player 2");
      }
      assert(match.isTieBreak());
      done();
    } catch (e) {
      done(e);
    }
  });

  it("Tie break scoring", (done) => {
    try {
      match.pointWonBy("player 1");
      match.pointWonBy("player 1");
      match.pointWonBy("player 2");
      match.pointWonBy("player 1");
      match.pointWonBy("player 2");
      match.pointWonBy("player 2");
      match.pointWonBy("player 2");
      match.pointWonBy("player 1");
      match.pointWonBy("player 1");
      match.pointWonBy("player 1");
      assert(match.score() === "6-5, 6-4");
      done();
    } catch (e) {
      done(e);
    }
  });

  it("Tie break win", (done) => {
    try {
      match.pointWonBy("player 1");
      assert(match.score() === "7-5");
      done();
    } catch (e) {
      done(e);
    }
  });
});
