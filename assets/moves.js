class Move {
    moveData = {

        "Hold Together": {
            "moveSource": "Core Rulebook",
            "pageReference": 27,
            "moveName": "Hold Together",
            "moveType": "Basic",
            "movePlaybook": "Family",
            "moveText": "When your Family must resist hardship, temptation or infighting, roll +Mood.",
            "keysOffStat": ["Mood"],
            "results": [
                {
                    "text": "You lose people to harm and/or desertion",
                    "result": (family) => { family.needs.push( 'recruits') }
                },
                {
                    "text": "Another Family or Faction came through to help you out.",
                    "result": (family1, family2) => { family.giveTreatyTo(family2) }
                },
                {
                    "text": "The danger hasn’t passed so much as shifted into a different, more manageable problem. Say what it is.",
                    "result": (family) => { family.needs.push( 'recruits') }
                }
            ],
            "pick": {
                "Setback": 0,
                "Mixed Success": 1,
                "Full Success": 0
            }
        }
    }
}

module.export = Move;

