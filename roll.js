const mexp = require("math-expression-evaluator");

// Shamelessly stolen
let getRandomInt = function (min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
};

// Got some math with rolls?
let roll = (r) => {

    // Lets track what we roll
    let rollLog = [];
    // You wouldn't trick me into just doing math would you?
    let gotToRoll = false;
    while (match = /(\d*)d(\d+)/.exec(r)) {
        // I'm glad I can trust you
        gotToRoll = true;

        let n; // How many rolls today?
        if (match[1] !== '') {
            n = parseInt(match[1]);
        } else {
            n = 1
        }
        // What kind of dice is this?
        let s = parseInt(match[2]);

        // Do rolls, very fun
        let rolls = Array.from({ length: n }, (v, i) => getRandomInt(1, s));
        // Sum up the rolls, less fun
        let total = rolls.reduce((acc, v) => acc + v, 0);

        // Lets write that down
        rollLog.push(`${match[0]}: ${rolls.join(' + ')} = ${total}`);

        // Better put the rolls back into the math
        // Can't roll all day...
        r = r.replace(match[0], total);
    }

    if (!gotToRoll) {
        // How could you? You tricked me!
        console.log("Aww, I thought we were going to roll dice. :(")
    }

    // Talk about what we did
    let message = rollLog.join("\n");
    message += `\nMath: ${r}`;
    try {
        let result = mexp.eval(r);
        message += `\nTotal: ${result}`;
    } catch {
        message += `\nTotal: I can't do that math!`
    }

    console.log(message);
}

roll(process.argv[2]);
