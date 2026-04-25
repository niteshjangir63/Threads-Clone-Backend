const User = require("../models/User");

async function generateUsernameSuggestions(name){

    const cleanName = name.toLowerCase().trim();

    const parts = cleanName.split(" ");

    const first = parts[0];
    const last = parts[1] || "";

    const suggestions = [
        first,
        `${first}${last}`,
        `${first}_${last}`,
        `${first}.${last}`,
        `its_${first}`,
        `the${first}`
    ];

    const availableUsernames = [];

    for (let username of suggestions) {

        if(username.length > 15) continue;

        const exists = await User.findOne({ username });

        if (!exists) {
            availableUsernames.push(username);
        }

        if (availableUsernames.length === 3) break;
    }

    
    while (availableUsernames.length < 3) {

        const random = Math.floor(10 + Math.random()*90);

        const username = `${first}${random}`;

        const exists = await User.findOne({ username });

        if (!exists) {
            availableUsernames.push(username);
        }
    }

    return availableUsernames;
}

module.exports = generateUsernameSuggestions;