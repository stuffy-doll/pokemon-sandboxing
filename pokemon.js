const { natures } = require('./natures');
const { hpTypes } = require('./hpTypes');

// POKEMON

class Pokemon {

  constructor(dexNo, name, sexless, species, baseStats, types, level, learnset, ability, catchRate, evolvesFrom, evolvesTo) {
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
    // Battle Stats (hitPoints represents the real value that will change during battle, abm represents any ability multipliers, acc represents the hidden accuracty stat, and eva the hidden evasion stat)
    this.battleStats = {
      hitPoints: this.stats.hp,
      abm: 1,
      acc: 100,
      eva: 100
    };
    this.hiddenPowerType = hpTypes[this.hiddenPowerCalc()]; // Calls the method to determine hidden power type based on IV spread
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

  // Method to calculate the hidden power type of the Pokemon
  hiddenPowerCalc() {
    // Extract the IV values for each stat
    const values = Object.values(this.ivs);
    // Declare an empty list to store binary values
    const binaries = []
    // Iterate through the values
    values.forEach(value => {
      // If the value is odd, then push 0 for the value, else push 1
      value % 2 === 0 ? binaries.push(0) : binaries.push(1);
    });
    // Deconstruct to make code more succinct
    const [hp, atk, def, spe, spa, spd] = binaries;
    // Calcluate (formula: Floor(1hp + 2atk + 4def + 8spe + 16spa + 32spd) * 15 / 63)
    const sum = Math.floor((1 * hp + 2 * atk + 4 * def + 8 * spe + 16 * spa + 32 * spd) * 15 / 63);
    // Return the sum to use as type list index (Always 0-15 in value)
    return sum;
  }

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
