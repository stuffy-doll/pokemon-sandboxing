const { natures } = require('./natures');
const { hpTypes } = require('./hpTypes');
const {
  erratic,
  fast,
  slow,
  mediumFast,
  mediumSlow,
  fluctuating
} = require('./expGraphs');

// POKEMON

class POKEMON {
  constructor(dexNo, name, sexless, species, baseStats, types, level, learnset, ability, expGraph, catchRate, evolvesFrom, evolvesTo) {
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
      hp: Math.floor(((2 * this.baseStats["hp"] + this.ivs["hp"]) * this.level / 100) + this.level + 10),
      atk: Math.floor(((2 * this.baseStats["atk"] + this.ivs["atk"]) * this.level / 100) + 5 * (this.nature.bonus === "atk" ? 1.1 : 1) * (this.nature.penalty === "atk" ? 0.9 : 1)),
      def: Math.floor(((2 * this.baseStats["def"] + this.ivs["def"]) * this.level / 100) + 5 * (this.nature.bonus === "def" ? 1.1 : 1) * (this.nature.penalty === "def" ? 0.9 : 1)),
      spe: Math.floor(((2 * this.baseStats["spe"] + this.ivs["spe"]) * this.level / 100) + 5 * (this.nature.bonus === "spe" ? 1.1 : 1) * (this.nature.penalty === "spe" ? 0.9 : 1)),
      spa: Math.floor(((2 * this.baseStats["spa"] + this.ivs["spa"]) * this.level / 100) + 5 * (this.nature.bonus === "spa" ? 1.1 : 1) * (this.nature.penalty === "spa" ? 0.9 : 1)),
      spd: Math.floor(((2 * this.baseStats["spd"] + this.ivs["spd"]) * this.level / 100) + 5 * (this.nature.bonus === "spd" ? 1.1 : 1) * (this.nature.penalty === "spd" ? 0.9 : 1)),
    };
    // Battle Stats (hitPoints represents the real value that will change during battle, abm represents any ability multipliers, acc represents the hidden accuracty stat, and eva the hidden evasion stat)
    this.battleStats = {
      hitPoints: this.stats.hp,
      abm: 1,
      acc: 100,
      eva: 100,
    };
    this.hiddenPowerType = hpTypes[this.hiddenPowerCalc()]; // Calls the method to determine hidden power type based on IV spread
    this.ability = ability;
    this.ot = null; // Method will assign trainer when caught
    this.expGrowth = expGraph;
    this.exp = null; // Super sad about this...
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
  };

  // Method for initializing EXP. Couldn't get it to work in constructor LOL
  giveExp() {
    this.exp = this.expGrowth[this.level - 1].toNext;
    return;
  }

  // Gaining EXP
  gainExp(exp) {
    let statReturn;
    // Track the required amount of exp to the next level
    const toNext = this.expGrowth[this.level].toNext;
    // Track whether the pokemon leveled up or not.
    let didLevel = false;
    // Track current EXP (May not need)
    const currExp = this.exp;
    // Add the gained exp to the Pokemon's total exp
    this.exp += exp;
    // If the exp is greater than or equal to the required toNext value
    if (this.exp >= toNext) {
      // Call Level Up
      didLevel = true;
      statReturn = this.levelUp();
    };
    // Return a brief message (To Place in Battle Log)
    return {
      "message": didLevel ? `${this.nickname ? this.nickname : this.name} gained ${exp} EXP and leveled up!` : `${this.nickname ? this.nickname : this.name} gained ${exp} EXP!`,
      "bonuses": statReturn,
    }
  }

  levelUp() {
    // Increase the Pokemon's Level
    this.level++;
    // Recalculate stats based on new level
    this.reCalcStats();
    // Break down IVs for a succinct formula
    const { hp, atk, def, spe, spa, spd } = this.ivs;
    // Each stat divided by 50 will provide the bonus, stored in an object for ease of use
    const baseBonus = {
      "hp": Math.floor(this.stats.hp / 50),
      "atk": Math.floor(this.stats.atk / 50),
      "def": Math.floor(this.stats.def / 50),
      "spe": Math.floor(this.stats.spe / 50),
      "spa": Math.floor(this.stats.spa / 50),
      "spd": Math.floor(this.stats.spd / 50)
    }
    // Total IV value divided by 100 to provide bonus
    const ivBonus = Math.ceil((hp + atk + def + spe + spa + spd) / 100);
    // Each stat is given the bonus for levelling up (BASE/50 + IVTOTAL/100)
    this.stats.hp += baseBonus["hp"] + ivBonus;
    this.stats.atk += baseBonus["atk"] + ivBonus;
    this.stats.def += baseBonus["def"] + ivBonus;
    this.stats.spe += baseBonus["spe"] + ivBonus;
    this.stats.spa += baseBonus["spa"] + ivBonus;
    this.stats.spa += baseBonus["spd"] + ivBonus;
    return {
      "hp": baseBonus["hp"] + ivBonus,
      "atk": baseBonus["atk"] + ivBonus,
      "def": baseBonus["def"] + ivBonus,
      "spe": baseBonus["spe"] + ivBonus,
      "spa": baseBonus["spa"] + ivBonus,
      "spd": baseBonus["spd"] + ivBonus,
    }
  };

  reCalcStats() {
    this.stats.hp = Math.floor(((2 * this.baseStats["hp"] + this.ivs["hp"]) * this.level / 100) + this.level + 10)
    this.stats.atk = Math.floor(((2 * this.baseStats["atk"] + this.ivs["atk"]) * this.level / 100) + 5 * (this.nature.bonus === "atk" ? 1.1 : 1) * (this.nature.penalty === "atk" ? 0.9 : 1))
    this.stats.def = Math.floor(((2 * this.baseStats["def"] + this.ivs["def"]) * this.level / 100) + 5 * (this.nature.bonus === "def" ? 1.1 : 1) * (this.nature.penalty === "def" ? 0.9 : 1))
    this.stats.spe = Math.floor(((2 * this.baseStats["spe"] + this.ivs["spe"]) * this.level / 100) + 5 * (this.nature.bonus === "spe" ? 1.1 : 1) * (this.nature.penalty === "spe" ? 0.9 : 1))
    this.stats.spa = Math.floor(((2 * this.baseStats["spa"] + this.ivs["spa"]) * this.level / 100) + 5 * (this.nature.bonus === "spa" ? 1.1 : 1) * (this.nature.penalty === "spa" ? 0.9 : 1))
    this.stats.spd = Math.floor(((2 * this.baseStats["spd"] + this.ivs["spd"]) * this.level / 100) + 5 * (this.nature.bonus === "spd" ? 1.1 : 1) * (this.nature.penalty === "spd" ? 0.9 : 1))
  };

  applyNickname(value) {
    this.nickname = value;
    return;
  };

  checkStatCap(stat) {
    let capped = false;
    const statCap = Math.floor((((2 * this.baseStats[stat] + this.ivs[stat]) * this.level / 100) + 5 * (this.nature.bonus === stat ? 1.1 : 1) * (this.nature.penalty === stat ? 0.9 : 1)) * 2.2)
    if (this.stats[stat] === statCap) {
      capped = true;
    };
    return capped;
  };
};

module.exports.POKEMON = POKEMON;
