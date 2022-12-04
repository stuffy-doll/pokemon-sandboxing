// BATTLE

/*
Battles intake several pieces of data to create an environment for which two Pokemon can compete with their data.
*/

class BATTLE {
  constructor(activeTrainer, activeTeam, activeOpponent, field) {
    this.activeTrainer = activeTrainer;
    this.activeTeam = activeTeam;
    this.activeOpponent = activeOpponent;
    this.field = field;
    this.turnCount = 0;
    this.log = [];
    this.fleeAttempts = 0
  };

  commitAction(action) {
    const type = action.type;
    const act = action.act;

    const actionLog = [];

    if (type === "flee") {
      const fled = this.determineFlee();
      if (fled.outcome) {
        actionLog.push(fled.message);
        this.terminateBattle();
        return actionLog;
      } else {
        actionLog.push(fled.message);
        return actionLog;
      }
    } else if (type === "ball") {
      const caught = this.activeTrainer.throwBall(act, this.activeOpponent);
      if (caught.outcome) {
        actionLog.push(caught.message);
        this.terminateBattle();
        return actionLog;
      } else {
        actionLog.push(caught.message);
        return actionLog;
      }
    } else if (type === "item") {

    }
  };

  calcDamage(attacker, target, action) {
    // Weather
    const W = this.determineWeatherMultipliers(action.type)
    // STAB (Same Type Attack Bonus)
    const STAB = attacker.types.includes(action.type) ? 1.5 : 1;
    // Move's Power
    const Power = action.pow;
    // BURN
    const BURN = (attacker.status && attacker.status.shorthand === "BRN") ? 0.5 : 1;
    // Critical Hit Chance
    const CRIT = Math.floor(Math.random() * 255) > Math.floor(Math.random() * 255) ? 2 : 1;
    // Type Effectiveness
    const TYPE = this.determineTypeMultiplier(action, target).multiplier;
    // Attacker's Attack Value
    const A = action.cata === "Physical" ? attacker.stats.atk : attacker.stats.spa;
    // Defender's Defense Value
    const D = action.cata === "Physical" ? target.stats.def : target.stats.spd;
    console.log(`LEVEL: ${attacker.level}, W: ${W}, STAB: ${STAB}, Power: ${Power}, BURN: ${BURN}, CRIT: ${CRIT}, TYPE: ${TYPE}, A: ${A}, D: ${D}`)
    const damage = Math.floor(((2 * attacker.level / 5 + 2) * Power * A / D / 50) * BURN * W + 2) * CRIT * STAB * TYPE;
    return damage;
  }

  checkPriority(xAction, yAction) {
    let allyGoesFirst = false;
    if (this.activeTeam.stats.spe > this.activeOpponent.stats.spe || xAction.act.priority > yAction.act.priority) {
      allyGoesFirst = true;
      return allyGoesFirst;
    };
    return allyGoesFirst;
  }

  // The field is checked. Some fields will persist, such as fields where the overworld applies a persistant weather to the battle
  checkField() {
    // If no field, then return
    if (!this.field) return;
    // If the field persists, return
    if (this.field.persists) return;
    // If the field's duration reaches 0
    if (this.field.duration === 0) {
      // Remove the field
      this.field = null;
      return;
    };
    // Tick down the field
    this.field.duration--;
  };

  determineTypeMultiplier(attack, target) {
    // Supereffective Typing Graph (Key = Type / Value = Strong Against)
    const superEffective = {
      "Normal": [null],
      "Fire": ["Grass", "Ice", "Bug", "Steel"],
      "Water": ["Fire", "Ground", "Rock"],
      "Electric": ["Water", "Flying"],
      "Grass": ["Water", "Ground", "Rock"],
      "Ice": ["Grass", "Ground", "Flying", "Dragon"],
      "Fighting": ["Normal", "Ice", "Rock", "Dark", "Steel"],
      "Poison": ["Grass", "Fairy"],
      "Ground": ["Fire", "Electric", "Poison", "Rock", "Steel"],
      "Flying": ["Grass", "Fighting", "Bug"],
      "Psychic": ["Fighting", "Poison"],
      "Bug": ["Grass", "Psychic", "Dark"],
      "Rock": ["Fire", "Ice", "Flying", "Bug"],
      "Ghost": ["Psychic", "Ghost"],
      "Dragon": ["Dragon"],
      "Dark": ["Psychic", "Ghost"],
      "Steel": ["Ice", "Rock", "Fairy"],
      "Fairy": ["Fighting", "Dragon", "Dark"]
    };

    // Not Effective Typing Graph (Key = Type / Value = Weak Against)
    const notEffective = {
      "Normal": ["Rock", "Steel"],
      "Fire": ["Fire", "Water", "Rock", "Dragon"],
      "Water": ["Water", "Grass", "Dragon"],
      "Electric": ["Electric", "Grass", "Dragon"],
      "Grass": ["Electric", "Grass", "Dragon"],
      "Ice": ["Fire", "Water", "Ice", "Steel"],
      "Fighting": ["Poison", "Flying", "Psychic", "Bug", "Fairy"],
      "Poison": ["Poison", "Ground", "Rock", "Ghost"],
      "Ground": ["Grass", "Bug"],
      "Flying": ["Electric", "Rock", "Steel"],
      "Psychic": ["Psychic", "Steel"],
      "Bug": ["Water", "Fighting", "Poison", "Ghost", "Steel", "Fairy"],
      "Rock": ["Fighting", "Ground", "Steel"],
      "Ghost": ["Dark"],
      "Dragon": ["Steel"],
      "Dark": ["Fighting", "Dark", "Fairy"],
      "Steel": ["Fire", "Water", "Electric", "Steel"],
      "Fairy": ["Fire", "Poison", "Steel"]
    };

    // No Effect Type Graph (Key = Type / Value = Unaffected)
    const noEffect = {
      "Normal": ["Ghost"],
      "Fire": [null],
      "Water": [null],
      "Electric": ["Ground"],
      "Grass": [null],
      "Ice": [null],
      "Fighting": ["Ghost"],
      "Poison": ["Steel"],
      "Ground": ["Flying"],
      "Flying": [null],
      "Psychic": ["Dark"],
      "Bug": [null],
      "Rock": [null],
      "Ghost": ["Normal"],
      "Dragon": ["Fairy"],
      "Dark": [null],
      "Steel": [null],
      "Fairy": [null]
    };

    // Result to return, storing a message, and a multipler for battle and a flag for when the move has no effect
    const result = {
      message: null,
      multiplier: 1,
      noEffect: false
    };

    // Storing types
    const moveType = attack.type;
    const targetTypes = target.types;
    console.log(superEffective[moveType])
    console.log(targetTypes)

    // If the target only has one type
    if (targetTypes.length === 1) {
      // If the target's type is found in the super effective graph (by move type)
      if (superEffective[moveType].includes(targetTypes[0])) {
        // Return the following...
        result.message = "It's super effective!";
        result.multiplier = 2;
        return result;
        // If the target's type is found in the not effective graph (by move type)
      } else if (notEffective[moveType].includes(targetTypes[0])) {
        // Return the following...
        result.message = "It's not very effective...";
        result.multiplier = 0.5;
        return result;
        // If the target's type is found in the no effect graph (by move type)
      } else if (noEffect[moveType].includes(targetTypes[0])) {
        result.message = "It had no effect..."
        result.noEffect = true;
        return result;
      };
      // If the target has two types...
    } else if (targetTypes.length > 1) {
      console.log("HIT")
      // If either of the target's types are found in the noEffect graph (by move type)
      if (noEffect[moveType].includes(targetTypes[0]) || noEffect[moveType].includes(targetTypes[1])) {
        // Return the following
        console.log("HIT!")
        result.message = "It had no effect..."
        result.noEffect = true;
        return result;
        // If both of the target's types are found in the super effective graph (by move type)
      } else if (superEffective[moveType].includes(targetTypes[0]) && superEffective[moveType].includes(targetTypes[1])) {
        // Return the following
        result.message = "It's critically effective!";
        result.multiplier = 4;
        return result;
        // If either of the target's types are found in the not effective graph (by move type)
      } else if (superEffective[moveType].includes(targetTypes[0]) || superEffective[moveType].includes(targetTypes[1])) {
        result.message = "It's super effective!";
        result.multiplier = 2;
        return result;
      } else if (notEffective[moveType].includes(targetTypes[0] || notEffective[moveType].includes(targetTypes[1]))) {
        // Return the following
        result.message = "It's not very effective...";
        result.multiplier = 0.5;
        return result;
        // If both of the target's types are found in the not effective graph (by move type)
      } else if (notEffective[moveType].includes(targetTypes[0]) && notEffective[moveType].includes(targetTypes[1])) {
        result.message = "It barely had an effect...";
        result.multiplier = 0.25;
        return result;
      };
    };
    return result;
  };

  determineWeatherMultipliers = (moveType) => {
    // Weather Boost Graph
    const weatherBoost = {
      "sunlight": ["Fire", "Grass"],
      "moonlight": ["Fairy", "Dark"],
      "rain": ["Water", "Grass"],
      "fog": [null],
      "hail": ["Ice"],
      "sandstorm": ["Ground", "Rock"]
    };

    // Weather Penalty Graph
    const weatherPenalty = {
      "sunlight": ["Water", "Ice"],
      "moonlight": [null],
      "rain": ["Fire"],
      "fog": [null],
      "hail": ["Fire"],
      "sandstorm": ["Fire", "Flying"]
    };

    let result = 1;
    if (this.field === null) {
      return result;
    };
    if (weatherBoost[this.field.shorthand].includes(moveType)) {
      result = 1.5;
      return result;
    };
    if (weatherPenalty[this.field.shorthand].includes(moveType)) {
      result = 0.5;
      return result;
    };
    return result;
  };

  determineFlee() {
    // Declare a result for the calculation and initialize it as false
    const result = {
      "outcome": false,
      "message": "You couldn't get away!"
    }
    // If the opponent has an OT (Meaning the battle is a trainer battle).
    if (this.activeOpponent.ot) {
      // Return a false result with a message explaining.
      result.message = "No! There's no running from a trainer battle!"
      return result;
    };
    // If the active team partner's speed is greater than that of the opponent's OR the active team partner is holding the Smoke Ball
    if (this.activeTeam.stats.spe >= this.activeOpponent.stats.spe || this.activeTeam.heldItem.name === "Smoke Ball") {
      // NOTE: Seperate the Smoke Ball to provide a unique message to an escape.
      result.outcome = true;
      result.message = "You got away safely!"
      return result;
    };
    // Calculate the odds of escaping: Escape = Math.sqrt(TEAMSPEED * 32 / Math.sqrt(WILDSPEED / 4) MOD 256) + 30 * ATTEMPTS
    const escape = Math.sqrt(this.activeTeam.stats.spe * 32 / Math.sqrt(this.activeOpponent.stats.spe / 4) % 256) + 30 * this.fleeAttempts;
    // If the escape odds are greater than the flat escape rate
    if (escape > 255) {
      result.outcome = true;
      result.message = "You got away safely!"
      return result;
    };
    return result;
  };

  battleLog() {
    return this.log;
  };

  terminateBattle() {
    return this.log;
  }
};

module.exports.BATTLE = BATTLE;
