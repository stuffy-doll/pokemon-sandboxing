const { utils } = require('./utilities')

// ITEMS

class ITEM {
  constructor(name, shorthand, description, price, sell) {
    this.name = name;
    this.shorthand = shorthand;
    this.description = description;
    this.price = price;
    this.sell = sell;
  };
}

// BATTLE ITEM

class BATTLE_ITEM extends ITEM {
  constructor(name, shorthand, description, effect, sell, price) {
    super(name, shorthand, description, price, sell);
    this.effect = effect;
    this.message = null;
  };

  use(pokemon) {
    const final = this.effect(pokemon);
    this.message = final;
    return final;
  }
}

// MEDICINE

class MEDICINE extends ITEM {
  constructor(name, shorthand, description, effect, price, sell) {
    super(name, shorthand, description, price, sell)
    this.effect = effect;
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

// BALL

class BALL extends ITEM {
  constructor(name, shorthand, description, price, sell, multiplier, modded, mod) {
    super(name, shorthand, description, price, sell);
    this.multiplier = multiplier;
    this.modded = modded;
    this.mod = mod;
  };

  checkMod(data) {
    if (this.modded) {
      return this.mod(data);
    }
    return;
  }
};

const pokeball = new BALL(
  "Poké Ball",
  "pokeball",
  "A regular poké ball used to catch wild Pokémon.",
  200,
  20,
  1,
  null,
  null
);

const premierBall = new BALL(
  "Premier Ball",
  "premball",
  "A promotional poké ball. No more powerful than a regular poké ball, but it is very stylish.",
  null,
  10,
  1,
  null,
  null
);

const greatBall = new BALL(
  "Great Ball",
  "greatball",
  "A slightly stronger ball used to catch wild Pokémon.",
  500,
  50,
  1.5,
  null,
  null
);

const ultraBall = new BALL(
  "Ultra Ball",
  "ultraball",
  "A very strong ball used to catch wild Pokémon.",
  2000,
  100,
  2,
  null,
  null
);

const healBall = new BALL(
  "Heal Ball",
  "healball",
  "A soothing poké ball that is more successful when a wild pokemon is weakened.",
  1000,
  50,
  1,
  1.5,
  ((data) => {
    if (data.pokemon.battleStats.hitPoints <= data.pokemon.stats.hp) {
      return true;
    }
    return false;
  })
)

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
      message = `${utils.pokemonName(pokemon)} restored ${diff} HP!`
      return message;
    };
    message = `${utils.pokemonName(pokemon)} restored 20 HP!`
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
      message = `${utils.pokemonName(pokemon)} restored ${diff} HP!`
      return message;
    };
    message = `${utils.pokemonName(pokemon)} restored 20 HP!`
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
    const message = utils.calcStage(pokemon, "atk", "+2");
    return message;
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
    message = `${utils.pokemonName(pokemon)} gained ${diff} EXP and leveled up!`
    // Return true (Item succeeds)
    return message;
  }),
  null,
  1000
)

module.exports.potion = potion;
module.exports.rareCandy = rareCandy;
module.exports.xAtk = xAtk;
module.exports.healBall = healBall;
