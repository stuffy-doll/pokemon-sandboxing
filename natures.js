// NATURES
/*
A Pokemon's nature determines bonuses and penalties in specified stats (if applicable)
and also determines a Pokemon's favorite/least favorite berry flavor.
*/

class NATURE {
  constructor(nature, bonus, penalty, favors, dislikes) {
    this.nature = nature;
    this.bonus = bonus;
    this.penalty = penalty;
    this.favorite = favors;
    this.dislikes = dislikes;
  };

  info() {
    return {
      nature: this.nature,
      bonus: this.bonus,
      penalty: this.penalty,
      favorite: this.favorite,
      dislikes: this.dislikes
    }
  }
}

const hardy = new NATURE("Hardy", null, null, null, null);
const lonely = new NATURE("Lonely", "atk", "def", "Spicy", "Sour");
const brave = new NATURE("Brave", "atk", "spe", "Spicy", "Sweet");
const adamant = new NATURE("Adamant", "atk", "spa", "Spicy", "Dry");
const naughty = new NATURE("Naughty", "atk", "spd", "Spicy", "Bitter");
const bold = new NATURE("Bold", "def", "atk", "Sour", "Spicy");
const docile = new NATURE("Docile", null, null, null, null);
const relaxed = new NATURE("Relaxed", "def", "spe", "Sour", "Sweet");
const impish = new NATURE("Impish", "def", "spa", "Sour", "Dry");
const lax = new NATURE("Lax", "def", "spd", "Sour", "Bitter");
const timid = new NATURE("Timid", "spe", "atk", "Sweet", "Spicy");
const hasty = new NATURE("Hasty", "spe", "def", "Sweet", "Sour");
const serious = new NATURE("Serious", null, null, null, null);
const jolly = new NATURE("Jolly", "spe", "spa", "Sweet", "Dry");
const naive = new NATURE("Naive", "spe", "spd", "Sweet", "Bitter");
const modest = new NATURE("Modest", "spa", "atk", "Dry", "Spicy");
const mild = new NATURE("Mild", "spa", "def", "Dry", "Sour");
const quiet = new NATURE("Quiet", "spa", "spe", "Dry", "Sweet");
const bashful = new NATURE("Bashful", null, null, null, null);
const rash = new NATURE("Rash", "spa", "spd", "Dry", "Bitter");
const calm = new NATURE("Calm", "spd", "atk", "Bitter", "Spicy");
const gentle = new NATURE("Gentle", "spd", "def", "Bitter", "Sour");
const sassy = new NATURE("Sassy", "spd", "spe", "Bitter", "Sweet");
const careful = new NATURE("Careful", "spd", "spa", "Bitter", "Dry");
const quirky = new NATURE("Quirky", null, null, null, null);

const natures = [
  hardy, lonely, brave, adamant, naughty,
  bold, docile, relaxed, impish, lax,
  timid, hasty, serious, jolly, naive,
  modest, mild, quiet, bashful, rash,
  calm, gentle, sassy, careful, quirky,
];

module.exports.natures = natures;
