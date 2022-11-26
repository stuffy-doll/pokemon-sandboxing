// MEDICINE

class MEDICINE {
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

const potion = new MEDICINE(
  "Potion",
  "Basic Medicine that restores a small amount of a Pokemon's HP.",
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

const superPotion = new MEDICINE(
  "Super Potion",
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
