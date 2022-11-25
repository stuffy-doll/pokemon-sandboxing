// POKEMON

class Pokemon {

  constructor(dexNo, name, sexless, species, baseStats, types, level, moves, ability, catchRate, evolvesFrom, evolvesTo) {
    this.dexNo = dexNo;
    this.name = name;
    this.sexless = sexless;
    this.gender = this.sexless === true ? null : ["Male", "Female"][Math.floor(Math.random() * ["Male", "Female"].length)]
    this.nickname = null;
    this.species = species;
    this.baseStats = baseStats;
    this.nature = natures[Math.floor(Math.random() * natures.length)].info();
    this.types = types;
    this.level = level;
    this.learnset = learnset; // Learnset to pull moves from with method to change moves
    this.moves = {
      1: null,
      2: null,
      3: null,
      4: null
    };
    this.ivs = {
      // IVs valued randomly between 0-31 for each stat
      hp: Math.floor(Math.random() * 31),
      atk: Math.floor(Math.random() * 31),
      def: Math.floor(Math.random() * 31),
      spe: Math.floor(Math.random() * 31),
      spa: Math.floor(Math.random() * 31),
      spd: Math.floor(Math.random() * 31),
    };
    this.stats = {
      // HP Calc = Floor((2 * BASE + IV * Level) / 100) + Level + 10
      // Stat Calc = Floor((2 * BASE + IV * Level) / 100) + 5 * Nature
      hp: Math.floor(((2 * this.baseStats["hp"] + this.ivs["hp"] * this.level) / 100) + this.level + 10),
      atk: Math.floor(((2 * this.baseStats["atk"] + this.ivs["atk"] * this.level) / 100) + 5 * (this.nature.buff === "atk" ? 1.1 : 1 || this.nature.nerf === "atk" ? 0.9 : 1)),
      def: Math.floor(((2 * this.baseStats["def"] + this.ivs["def"] * this.level) / 100) + 5 * (this.nature.buff === "def" ? 1.1 : 1 || this.nature.nerf === "def" ? 0.9 : 1)),
      spe: Math.floor(((2 * this.baseStats["spe"] + this.ivs["spe"] * this.level) / 100) + 5 * (this.nature.buff === "spe" ? 1.1 : 1 || this.nature.nerf === "spe" ? 0.9 : 1)),
      spa: Math.floor(((2 * this.baseStats["spa"] + this.ivs["spa"] * this.level) / 100) + 5 * (this.nature.buff === "spa" ? 1.1 : 1 || this.nature.nerf === "spa" ? 0.9 : 1)),
      spd: Math.floor(((2 * this.baseStats["spd"] + this.ivs["spd"] * this.level) / 100) + 5 * (this.nature.buff === "spd" ? 1.1 : 1 || this.nature.nerf === "spd" ? 0.9 : 1)),
    };
    // Battle Stats (hitPoints represents the real value that will change during battle, acc represents the hidden accuracty stat, and eva the hidden evasion stat)
    this.battleStats = {
      hitPoints: this.stats.hp,
      acc: 100,
      eva: 100
    };
    this.ability = ability;
    this.ot = null; // Method will assign trainer when caught
    this.exp = null; // TODO: Figure out calculation based on level
    this.toNext = null; // TODO: Figure out calculation to handle Exp
    // Status effect for use in battle.
    this.status = { "current": null, multiplier: 1 };
    this.heldItem = null;
    this.ribbons = [];
    this.friendship = 0;
    this.catchRate = catchRate;
    this.stockpile = 0;
    this.evolvesFrom = evolvesFrom;
    this.evolvesTo = evolvesTo;
  };

  applyNature() {
    if (this.nature.buff === null) {
      return;
    };
    this.stats[this.nature.buff] = Math.floor(this.stats[this.nature.buff] * 1.1);
    this.stats[this.nature.nerf] = Math.floor(this.stats[this.nature.nerf] * 0.9);
    return;
  };

  applyNickname(value) {
    this.nickname = value;
    return;
  };
};

// EGG

// class Egg {
//   constructor(baseHatch, hatchesInto) {
//     this.baseHatch = baseHatch;
//     this.hatch = Math.floor(baseHatch * hatchesInto.dexNo);
//     this.hatchesInto = hatchesInto;
//   };
// };

// MOVES

class Move {
  constructor(name, cat, type, acc, pow, pp, ppMax, contact, effects, priority) {
    this.name = name;
    this.cat = cat;
    this.type = type;
    this.acc = acc;
    this.pow = pow;
    this.pp = pp,
      this.ppMax = ppMax;
    this.contact = contact;
    this.effects = effects;
    this.priority = priority;
  };

  applyStatus(pokemon) {
    const result = {
      "messages": []
    };
    this.effects.effect.forEach(effect => {
      if (effect === "buff") {
        this.effects.stat.buff.forEach(stat => {
          result.messages.push(`${pokemon.name}'s ${stat} stat was raised!`);
          pokemon.stats[stat] = Math.floor(pokemon.stats[stat] * this.effects.multipliers.buff);
        });
      };
      if (effect === "nerf") {
        this.effects.stat.nerf.forEach(stat => {
          result.messages.push(`${pokemon.name}'s ${stat} stat was lowered!`);
          pokemon.stats[stat] = Math.floor(pokemon.stats[stat] * this.effects.multipliers.nerf);
        });
      };
      if (effect === "stockpile") {
        pokemon.stockpile++;
      };
    });
  };
};

// BATTLE

class Battle {
  constructor(activeTrainer, activeTeam, activeOpponent, field) {
    this.activeTrainer = activeTrainer;
    this.activeTeam = activeTeam;
    this.activeOpponent = activeOpponent;
    this.field = field;
    this.turnCount = 0;
    this.log = [];
    this.fleeAttempts = 0
  };

  checkField() {
    if (!this.field) return;
    if (this.field.persists) return;
    if (this.field.duration === 0) {
      this.field = null;
      return;
    };
    this.field.duration--;
  };

  determineTypeMultiplier(attack, target) {
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

    const result = {
      message: null,
      multiplier: 1
    };
    const moveType = attack.type;
    const targetTypes = target.types;

    if (targetTypes.length === 1) {
      if (superEffective[moveType].includes(targetTypes[0])) {
        result.message = "It's super effective!";
        result.multiplier = 2;
      } else if (notEffective[moveType].includes(targetTypes[0])) {
        result.message = "It's not very effective...";
        result.multiplier = 0.5;
      } else if (noEffect[moveType].includes(targetTypes[0])) {
        return result;
      };
    } else {
      if (noEffect[moveType].includes(targetTypes[0]) || noEffect[moveType].includes(targetTypes[1])) {
        result.message = "It had no effect..."
        return result;
      } else if (superEffective[moveType].includes(targetTypes[0]) && superEffective[moveType].includes(targetTypes[1])) {
        result.message = "It's critically effective!";
        result.multiplier = 4;
      } else if (superEffective[moveType].includes(targetTypes[0] && notEffective[moveType].includes(targetTypes[1]))) {
        return result;
      } else if (notEffective[moveType].includes(targetTypes[0] || notEffective[moveType].includes(targetTypes[1]))) {
        result.message = "It's not very effective...";
        result.multiplier = 0.5
      } else if (notEffective[moveType].includes(targetTypes[0]) && notEffective[moveType].includes(targetTypes[1])) {
        result.message = "It barely had an effect...";
        result.multiplier = 0.25
      };
    };
    return result;
  };

  determineWeatherMultipliers = (moveType) => {
    const weatherBoost = {
      "sunlight": ["Fire", "Grass"],
      "moonlight": ["Fairy", "Dark"],
      "rain": ["Water", "Grass"],
      "fog": [null],
      "hail": ["Ice"],
      "sandstorm": ["Ground", "Rock"]
    };

    const weatherNerf = {
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
    if (weatherNerf[this.field.shorthand].includes(moveType)) {
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
};

// WEATHER

class Weather {
  constructor(name, shorthand, duration, message, persists) {
    this.name = name;
    this.shorthand = shorthand;
    this.duration = this.persists === true ? Infinity : duration;
    this.message = message;
    this.persists = persists;
  };
};

// TRAINER

class Trainer {
  constructor(name) {
    this.name = name;
    this.trainerId = this.randomId();
    this.secretId = this.randomId();
    this.startedJourney = new Date(Date.now());
  };

  randomId() {
    return Math.random().toString().split('.').join('').slice(3, 10);
  };

  throwBall(ball, pokemon) {
    const result = {
      "outcome": false,
      "message": "Aww! It broke free!"
    };

    const C = pokemon.catchRate;
    const HPMAX = pokemon.stats.hp;
    const HPCURR = pokemon.hitPoints;
    const BALL = ball.multipler;
    const STATUS = pokemon.status.multiplier;

    const X = ((3 * HPMAX - 2 * HPCURR) * (C * BALL) / 3 * HPMAX) * STATUS;
    const chance = Math.floor(((65535 / Math.sqrt(Math.sqrt(255 / X))) / 8));

    const caught = this.capture(0, chance);

    if (caught) {
      pokemon.ot = this.info();
      result.outcome = true;
      result.message = "Pokemon captured!";
      return result;
    };

    return result;
  };

  randomCatchInt() {
    const max = 65536;
    return Math.floor(Math.random() * max);
  };

  capture(wobbles = 0, catchChance) {
    // Catch chance fed in battle
    let ranNum = this.randomCatchInt();
    let caught = false;
    if (ranNum >= catchChance) {
      return caught;
    };
    if (wobbles === 4) {
      caught = true;
      return caught;
    };
    ranNum = this.randomCatchInt();
    return this.capture(wobbles += 1, catchChance)
  };

  info() {
    return {
      "name": this.name,
      "trainerId": this.trainerId,
    }
  };
};

// ABILITIES

class Ability {
  constructor(name, description, effect, passiveEffect) {
    this.name = name;
    this.description = description;
    this.effect = effect;
    this.passiveEffect = passiveEffect;
    this.counters = 0;
    this.contactTrigger = false;
    this.weatherTrigger = false;
  };

  trigger(pokemon) {
    this.effect(pokemon);
  };
};

const lightningRod = new Ability(
  "Lightning Rod",
  "If the user is hit with an electric type move, their special attack stat is raised.",
  (pokemon => {
    pokemon.stats.spa = pokemon.stats.spa * 1.5;
  }),
  null
);

const flameBody = new Ability(
  "Flame Body",
  "When the user is hit with a contact move, there is a chance to cause a burn to the attacker.",
  (attacker => {
    const base = 255;
    const num = Math.floor(Math.random() * Math.sqrt(base));
    if (num > base) {
      attacker.status = burn;
    };
  }),
  ((trainer) => {
    if (trainer.party.includes(this)) {
      trainer.party.forEach(slot => {
        if (slot.egg) {
          slot.hatch = slot.hatch / 2;
        };
      });
    };
  })
)

// MEDICINE

class Medicine {
  constructor(name, description, effect, price, messages) {
    this.name = name;
    this.description = description;
    this.effect = effect;
    this.price = price;
    this.messages = messages;
  };

  use(pokemon) {
    const final = this.effect(pokemon);
    if (!final) {
      return this.messages.failure;
    };
    return this.messages.success;
  };
};

const potion = new Medicine(
  "Potion",
  "Restores 20 HP",
  ((pokemon) => {
    if (pokemon.hitPoints === pokemon.stats.hp) {
      return false;
    };
    pokemon.hitPoints += 20;
    if (pokemon.hitPoints > pokemon.stats.hp) {
      pokemon.hitPoints = pokemon.stats.hp;
    };
    return true;
  }),
  200,
  {
    "failure": "The Pokemon's HP is full!",
    "success": "The Pokemon restored 20 HP!"
  }
);

class Action {
  constructor(type, move, ball, item, swap) {
    this.type = type;
    this.move = move;
    this.ball = ball;
    this.item = item;
    this.swap = swap;
  };

  toSafeObject() {
    return {
      "type": this.type,
      "move": this.move,
      "ball": this.ball,
      "item": this.item,
      "swap": this.swap
    };
  };
};

const attack = new Action(
  "move",
  new Move(

  )
);
