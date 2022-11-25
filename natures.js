// NATURES
/*
A Pokemon's nature determines bonuses and penalties in specified stats (if applicable)
and also determines a Pokemon's favorite/least favorite berry flavor.
*/

class Nature {
  constructor(nature, bonus, penalty, favors, dislikes) {
    this.nature = nature;
    this.bonus = buff;
    this.penalty = nerf;
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

module.exports.natures = natures;
