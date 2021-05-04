const mexp = require("math-expression-evaluator");

// Shamelessly stolen
let getRandomInt = function (min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
};

// Got some math with rolls?
let roll = (r, logging = false) => {

    // Lets track what we roll
    let rollLog = [];
    let message = '';

    // You wouldn't trick me into just doing math would you?
    let gotToRoll = false;

    let match;
    while (match = /([adbw]?)(\d*)d(\d+)/.exec(r)) {
        // I'm glad I can trust you
        gotToRoll = true;

        let special = match[1];

        let n; // How many rolls today?
        if (match[2] !== '') {
            n = parseInt(match[2]);
        } else {
            if (special == '') {
                n = 1
            } else {
                n = 2
            }
        }
        // What kind of dice is this?
        let s = parseInt(match[3]);

        // Do rolls, very fun
        let rolls = Array.from({ length: n }, (v, i) => getRandomInt(1, s));
        // Sum up the rolls, less fun

        let total = 0;
        if (rolls.length <= 1) {
            if (rolls.length == 1) {
                total = rolls[0];
            }
            rollLog.push(`${match[0]}: ${total}`);
        } else {
            switch (special) {
                case "a":
                case "b":
                    total = Math.max(...rolls);
                    // Lets write that down
                    rollLog.push(`${match[0]}: ${rolls.join(' , ')} Best: ${total}`);
                    break;
                case "d":
                case "w":
                    total = Math.min(...rolls);
                    // Lets write that down
                    rollLog.push(`${match[0]}: ${rolls.join(' , ')} Worst: ${total}`);
                    break;
                default:
                    total = rolls.reduce((acc, v) => acc + v, 0);
                    // Lets write that down
                    rollLog.push(`${match[0]}: ${rolls.join(' + ')} = ${total}`);
                    break;
            }
        }

        // Better put the rolls back into the math
        // Can't roll all day...
        r = r.replace(match[0], total);
    }

    if (!gotToRoll) {
        // How could you? You tricked me!
        message += "Aww, I thought we were going to roll dice. :(\n";
    }

    // Talk about what we did
    message += rollLog.join("\n");
    message += `\nMath: ${r}`;
    try {
        let result = mexp.eval(r);
        message += `\nTotal: ${result}`;
    } catch {
        message += `\nTotal: I can't do that math!`
    }

    if (logging) {
        console.log(message);
    }
    return message;
}

roll(process.argv[2], true);
