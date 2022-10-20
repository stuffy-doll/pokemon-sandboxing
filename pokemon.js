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
