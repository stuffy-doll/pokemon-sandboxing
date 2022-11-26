const { natures } = require('./natures');
const { hpTypes } = require('./hpTypes');

// POKEMON

class POKEMON {
  constructor(dexNo, name, sexless, species, baseStats, types, level, learnset, ability, catchRate, evolvesFrom, evolvesTo) {
    this.dexNo = dexNo;
    this.name = name;
    this.sexless = sexless;
    this.gender = this.sexless === true ? null : ["Male", "Female"][Math.floor(Math.random() * 2)]
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

module.exports.POKEMON = POKEMON;
