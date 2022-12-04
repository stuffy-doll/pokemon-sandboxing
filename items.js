const { pokemonName } = require('./utilities');

// ITEMS

class ITEM {
  constructor(name, shorthand, description, sell) {
    this.name = name;
    this.shorthand = shorthand;
    this.description = description;
    this.sell = sell;
  };
}

// BATTLE ITEM

class BATTLE_ITEM extends ITEM {
  constructor(name, shorthand, description, effect, sell, price) {
    super(name, shorthand, description, sell);
    this.effect = effect;
    this.price = price;
    this.sell = sell;
    this.message = null;
  };

  use(pokemon) {
    const final = this.effect(pokemon);
    if (!final) {
      return "The stat can't go up any higher!";
    } else {
      this.message = final;
      return this.message
    }
  }
}

// MEDICINE

class MEDICINE extends ITEM {
  constructor(name, shorthand, description, effect, price, sell) {
    super(name, shorthand, description, sell)
    this.effect = effect;
    this.price = price;
    this.message = null;
  };

  use(pokemon) {
    const final = this.effect(pokemon);
    if (!final) {
      return "It had no effect!"
    } else {
      this.message = final;
      return this.message;
    }
  };
};

const potion = new MEDICINE(
  "Potion",
  "potion",
  "Basic Medicine that restores a small amount of a Pokemon's HP.",
  ((pokemon) => {
    let message = null;
    if (pokemon.battleStats.hitPoints === pokemon.stats.hp) {
      return message;
    };
    pokemon.battleStats.hitPoints += 20;
    if (pokemon.battleStats.hitPoints > pokemon.stats.hp) {
      const diff = pokemon.battleStats.hitPoints - pokemon.stats.hp;
      pokemon.battleStats.hitPoints = pokemon.stats.hp;
      message = `${pokemonName(pokemon)} restored ${diff} HP!`
      return message;
    };
    message = `${pokemonName(pokemon)} restored 20 HP!`
    return message;
  }),
  200,
  50
);

const superPotion = new MEDICINE(
  "Super Potion",
  "spotion",
  "Medicine that restores a decent amount of a Pokemon's HP.",
  ((pokemon) => {
    let message = null;
    if (pokemon.battleStats.hitPoints === pokemon.stats.hp) {
      return message;
    };
    pokemon.battleStats.hitPoints += 50;
    if (pokemon.battleStats.hitPoints > pokemon.stats.hp) {
      const diff = pokemon.battleStats.hitPoints - pokemon.stats.hp;
      pokemon.battleStats.hitPoints = pokemon.stats.hp;
      message = `${pokemonName(pokemon)} restored ${diff} HP!`
      return message;
    };
    message = `${pokemonName(pokemon)} restored 20 HP!`
    return message;
  }),
  500,
  100
);

const xAtk = new BATTLE_ITEM(
  "X Attack",
  "xatk",
  "A supplement that temporarily increases a Pokémon's ATK stat in battle.",
  ((pokemon) => {
    const capped = pokemon.checkStatCap("atk");
    if (capped) {
      return `${pokemonName(pokemon)}'s ATK stat can't go up any higher!`
    }
    pokemon.stats.atk = Math.floor(pokemon.stats.atk * 1.4);
    return `${pokemonName(pokemon)}'s ATK stat went up by 1 stage!`
  }),
  700,
  100
)

const rareCandy = new MEDICINE(
  "Rare Candy",
  "rarecandy",
  "A rare sweet with strengthening properties. Raises a Pokemon's level by 1.",
  ((pokemon) => {
    let message = null;
    // If the Pokemon's level is 100
    if (pokemon.level === 100) {
      // Return false (Item fails)
      return message;
    }
    // Calculate the exp difference needed to level up with no overflow to the exp bar
    const diff = pokemon.expGrowth[pokemon.level].toNext - pokemon.exp;
    // Call gainExp on Pokemon with diff fed into it
    pokemon.gainExp(diff);
    message = `${pokemonName(pokemon)} gained ${diff} EXP and leveled up!`
    // Return true (Item succeeds)
    return message;
  }),
  null,
  1000
)

module.exports.potion = potion;
module.exports.rareCandy = rareCandy;
module.exports.xAtk = xAtk;
