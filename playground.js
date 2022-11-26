const { PKMN_TRAINER } = require('./trainer');
const { POKEMON } = require('./pokemon');
const { BATTLE } = require('./battle');
const { ACTION } = require('./action');
const { weathers } = require('./weather');
const { overgrow } = require('./ability');

const lars = new PKMN_TRAINER(
  "Lars",
  "Male"
);

const bulbasaur = new POKEMON(
  1,
  "Bulbasaur",
  false,
  "Seed",
  { "hp": 45, "atk": 49, "def": 49, "spa": 65, "spd": 65, "spe": 45 },
  ["Grass", "Poison"],
  5,
  null,
  overgrow,
  1,
  null,
  null,
)

console.log(lars);
console.log(bulbasaur);
console.log(bulbasaur.levelUp());
console.log(bulbasaur);

const permaWeathers = Object.values(weathers).splice(0, 6);
