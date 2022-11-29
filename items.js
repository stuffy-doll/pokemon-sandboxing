// MEDICINE

class MEDICINE {
  constructor(name, shorthand, description, effect, price) {
    this.name = name;
    this.shorthand = shorthand;
    this.description = description;
    this.effect = effect;
    this.price = price;
    this.success = null;
    this.failure = null;
  };

  use(pokemon) {
    const final = this.effect(pokemon);
    if (!final) {
      return this.failure;
    };
    return this.success;
  };
};

const potion = new MEDICINE(
  "Potion",
  "potion",
  "Basic Medicine that restores a small amount of a Pokemon's HP.",
  ((pokemon) => {
    if (pokemon.hitPoints === pokemon.stats.hp) {
      this.failure = `${pokemon.nickname ? pokemon.nickname : pokemon.name}'s HP is full!`;
      return false;
    };
    pokemon.hitPoints += 20;
    if (pokemon.hitPoints > pokemon.stats.hp) {
      pokemon.hitPoints = pokemon.stats.hp;
    };
    this.success = `Some of ${pokemon.nickname ? pokemon.nickname : pokemon.name}'s HP was restored!`;
    return true;
  }),
  200,
);

const superPotion = new MEDICINE(
  "Super Potion",
  "spotion",
  "Medicine that restores a decent amount of a Pokemon's HP.",
  ((pokemon) => {
    if (pokemon.battleStats.hitPoints === pokemon.stats.hp) {
      return false;
    };
    pokemon.battleStats.hitPoints += 50;
    if (pokemon.battleStats.hitPoints > pokemon.stats.hp) {
      pokemon.battleStats.hitPoints = pokemon.stats.hp;
    };
    return true;
  }),
  500,
  {
    "failure": "The Pokemon's HP is full!",
    "success": "The Pokemon restored 20 HP!"
  }
);

const rareCandy = new MEDICINE(
  "Rare Candy",
  "rarecandy",
  "A rare sweet with strengthening properties. Raises a Pokemon's level by 1.",
  ((pokemon) => {
    // If the Pokemon's level is 100
    if (pokemon.level === 100) {
      // Return false (Item fails)
      return false;
    }
    // Calculate the exp difference needed to level up with no overflow to the exp bar
    const diff = pokemon.expGrowth[pokemon.level].toNext - pokemon.exp;
    // Call gainExp on Pokemon with diff fed into it
    pokemon.gainExp(diff);
    // Return true (Item succeeds)
    return true;
  }),
  null,
  {
    "failure": "It had no effect!",
    "success": "The Rare Candy made the Pokemon level up!"
  }
)

module.exports.potion = potion;
