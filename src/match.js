const TENNIS_SCORES = [0, 15, 30, 40];
const [ADVANTAGE, DEUCE] = ["Advantage", "Deuce"];

class Player {
    constructor(name) {
        this.name = name;
    }
};

const isOver3 = (p1, p2) => p1 >= 3 && p2 >=3;  
const isAdv = (p1, p2) => isOver3(p1,p2) && ((p1 === p2+1) || (p1 === p2-1));
const isDuece = (p1, p2) => isOver3(p1,p2) && (p1 === p2);
const isGameWon = (p1, p2) => (p1 >= 4) && (p2 <= p1 - 2);
const isSetWon = (m1, m2) => (m1 >= 6) && (m2 <= m1 - 2);
const isTieBreak = (m1, m2) => (m1 >= 6) && (m2 === m1 - 1);
const isTieBreakWon = (p1, p2) => (p1 >= 7) && (p2 <= p1 - 2);

class Game {
    constructor(parent, isTieBreak = false) {
        this.match = parent;
        this.players = parent.map(p => Object.assign(Object.create(Object.getPrototypeOf(p)),p));
        this.players.map(p => p.score = 0);
        this.isTieBreak = isTieBreak;
    }

    pointWon(playerIdx) {
        this.players[playerIdx].score++;
    }

    isGameOver() {
        const [p1, p2] = [this.players[0], this.players[1]];
        if (!this.isTieBreak)
            return isGameWon(p1.score, p2.score) || isGameWon(p2.score, p1.score);
        else
            return isTieBreakWon(p1.score, p2.score) || isTieBreakWon(p2.score, p1.score);
    }

    gameScore() { 
        const [p1, p2] = [this.players[0], this.players[1]];

        if (this.isTieBreak)
            return `${p1.score}-${p2.score}`;

        if (isAdv(p1.score, p2.score))
            return `${ADVANTAGE} ${p1.name}`;
        else if (isAdv(p2.score, p1.score))
            return `${ADVANTAGE} ${p2.name}`;
            
        if (isDuece(p1.score, p2.score))
            return DEUCE;
        

        return `${TENNIS_SCORES[p1.score]}-${TENNIS_SCORES[p2.score]}`;   
    }
};

class Match {
    constructor(player1, player2) {
        this.sets = [];
        this.players = [new Player(player1), new Player(player2)];
        this.newGame();
    }

    currentGame() { 
        return this.sets[this.sets.length - 1];
    }

    newGame() {
        this.sets.push(new Game(this.players, this.isTieBreak()));
    }

    getPlayerIdx(name) {
        return this.players.findIndex(p => p.name === name);
    };

    pointWonBy(playerName) {
        if (this.currentGame().isGameOver())
            this.newGame();

        this.currentGame().pointWon(this.getPlayerIdx(playerName));
    }

    matchScore() { 
        return this.sets.reduce((prev, curr) => {
            const [p1, p2] = curr.players;
            if (  (!curr.isTieBreak && isGameWon(p1.score, p2.score))
                || (curr.isTieBreak && isTieBreakWon(p1.score, p2.score)))
                prev[0]++;
            else if (  (!curr.isTieBreak && isGameWon(p2.score, p1.score))
                    || (curr.isTieBreak && isTieBreakWon(p2.score, p1.score)))
                prev[1]++;
            return prev;
        }, [0,0]);
    }

    isTieBreak() {
        const scores = this.matchScore();
        return (isTieBreak(scores[0], scores[1]) || isTieBreak(scores[1], scores[0]));
    }

    winner() {
        const scores = this.matchScore();
        if (isSetWon(scores[0], scores[1]))
            return this.players[0].name;
        else if (isSetWon(scores[1], scores[0]))
            return this.players[1].name;
        else
            return "";
    }

    score() {
        return `${this.matchScore().join("-")}${(!this.currentGame().isGameOver()) ? ", " + this.currentGame().gameScore() : ""}`;
    }

};

module.exports = { Match };
