class STATUS {
  constructor(name, shorthand, duration, penalty, effect) {
    this.name = name;
    this.shorthand = shorthand;
    this.duration = duration;
    this.penalty = penalty;
    this.effect = effect;
    this.sleepCount = 0;
    this.toxBuild = 1.5;
  }

  applyEffect(pokemon) {
    this.effect(pokemon);
  };
};

const burn = new STATUS(
  "Burn",
  "BRN",
  Infinity,
  0.5,
  ((pokemon) => {
    pokemon.battleStats.hitPoints -= pokemon.stats.hp / 12;
  })
);

const paralysis = new STATUS(
  "Paralysis",
  "PRLZ",
  Infinity,
  0.5,
  ((action, pokemon) => {
    const num = Math.floor(Math.random() * 3);
    if (num === 3) {
      action.message = `${pokemon.nickname ? pokemon.nickname : pokemon.name} couldn't move!`;
    };
    return;
  })
);

const sleep = new STATUS(
  "Sleep",
  "SLP",
  Infinity,
  0.5,
  ((action, pokemon) => {
    const num = Math.floor(Math.random() * 8);
    if (this.sleepCount + num < 8) {
      action.message = `${pokemon.nickname ? pokemon.nickname : pokemon.name} is fast asleep!`;
    } else {
      pokemon.status = null;
    }
    return;
  })
);

const poison = new STATUS(
  "Poison",
  "PSN",
  Infinity,
  null,
  ((pokemon) => {
    pokemon.battleStats.hitPoints -= pokemon.stats.hp / 16
  })
)

const toxic = new STATUS(
  "Toxic",
  "TOX",
  Infinity,
  null,
  ((pokemon) => {
    toxAccum = (pokemon.stats.hp / 16) * this.toxBuild;
    pokemon.battleStats.hitPoints -= toxAccum;
    this.toxBuild += 0.5;
    return toxAccum;
  })
)
