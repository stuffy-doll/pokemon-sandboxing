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
    this.learnset = null; // Learnset to pull moves from with method to change moves
    this.moves = moves;
    this.stats = {
      // HP Calc = ((2 * BASE * Level) / 100) + Level + 10
      // Stat Calc = ((2 * BASE * Level) / 100) + 5 * Nature
      hp: ((2 * this.baseStats["hp"] * this.level) / 100) + this.level + 10,
      atk: ((2 * this.baseStats["atk"] * this.level) / 100) + 5,
      def: ((2 * this.baseStats["dev"] * this.level) / 100) + 5,
      spe: ((2 * this.baseStats["spe"] * this.level) / 100) + 5,
      spa: ((2 * this.baseStats["spa"] * this.level) / 100) + 5,
      spd: ((2 * this.baseStats["spd"] * this.level) / 100) + 5,
    };
    this.hitPoints = this.stats.hp;
    this.ability = ability;
    this.ot = null; // Method will assign trainer when caught
    this.exp = null; // TODO: Figure out calculation based on level
    this.toNext = null; // TODO: Figure out calculation to handle Exp
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

// NATURES

class Nature {
  constructor(name, buff, nerf, favors, dislikes) {
    this.name = name;
    this.buff = buff;
    this.nerf = nerf;
    this.favorite = favors;
    this.dislike = dislikes;
  };

  info() {
    return {
      name: this.name,
      buff: this.buff,
      nerf: this.nerf,
      favorite: this.favorite,
      dislikes: this.dislike
    }
  }
}

const hardy = new Nature("Hardy", null, null, null, null);
const lonely = new Nature("Lonely", "atk", "def", "Spicy", "Sour");
const brave = new Nature("Brave", "atk", "spe", "Spicy", "Sweet");
const adamant = new Nature("Adamant", "atk", "spa", "Spicy", "Dry");
const naughty = new Nature("Naughty", "atk", "spd", "Spicy", "Bitter");
const bold = new Nature("Bold", "def", "atk", "Sour", "Spicy");
const docile = new Nature("Docile", null, null, null, null);
const relaxed = new Nature("Relaxed", "def", "spe", "Sour", "Sweet");
const impish = new Nature("Impish", "def", "spa", "Sour", "Dry");
const lax = new Nature("Lax", "def", "spd", "Sour", "Bitter");
const timid = new Nature("Timid", "spe", "atk", "Sweet", "Spicy");
const hasty = new Nature("Hasty", "spe", "def", "Sweet", "Sour");
const serious = new Nature("Serious", null, null, null, null);
const jolly = new Nature("Jolly", "spe", "spa", "Sweet", "Dry");
const naive = new Nature("Naive", "spe", "spd", "Sweet", "Bitter");
const modest = new Nature("Modest", "spa", "atk", "Dry", "Spicy");
const mild = new Nature("Mild", "spa", "def", "Dry", "Sour");
const quiet = new Nature("Quiet", "spa", "spe", "Dry", "Sweet");
const bashful = new Nature("Bashful", null, null, null, null);
const rash = new Nature("Rash", "spa", "spd", "Dry", "Bitter");
const calm = new Nature("Calm", "spd", "atk", "Bitter", "Spicy");
const gentle = new Nature("Gentle", "spd", "def", "Bitter", "Sour");
const sassy = new Nature("Sassy", "spd", "spe", "Bitter", "Sweet");
const careful = new Nature("Careful", "spd", "spa", "Bitter", "Dry");
const quirky = new Nature("Quirky", null, null, null, null);

const natures = [
  hardy, lonely, brave, adamant, naughty,
  bold, docile, relaxed, impish, lax,
  timid, hasty, serious, jolly, naive,
  modest, mild, quiet, bashful, rash,
  calm, gentle, sassy, careful, quirky,
];

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
    this.field = this.field;
    this.turnCount = 0;
    this.log = [];
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
  }
}
