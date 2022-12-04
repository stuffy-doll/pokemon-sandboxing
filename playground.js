const { PKMN_TRAINER } = require('./trainer');
const { POKEMON } = require('./pokemon');
const { BATTLE } = require('./battle');
const { ACTION } = require('./action');
const { weathers } = require('./weather');
const { overgrow } = require('./ability');
const { expGraphs } = require('./expGraphs');
const { potion } = require('./items');
const { moves } = require('./move');
const { rareCandy } = require('./items');
const { xAtk } = require('./items');
const { utils } = require('./utilities');

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

const charizard = new POKEMON(
  6,
  "Charizard",
  false,
  "Flame",
  { "hp": 78, "atk": 84, "def": 78, "spa": 109, "spd": 85, "spe": 100 },
  ["Fire", "Flying"],
  36,
  null,
  null,
  expGraphs.erratic,
  1,
  null,
  null,
)

// console.log(lars);
// console.log(bulbasaur);
// console.log(bulbasaur);

charizard.moves[1] = moves.flameThrower;
charizard.applyNickname("Giganto")

console.log(charizard.stats.atk)

console.log(utils.calcStage(charizard, "atk", "+2"));
console.log(utils.calcStage(charizard, "atk", "-2"));
console.log(utils.calcStage(charizard, "atk", "-2"));
console.log(utils.calcStage(charizard, "atk", "-2"));
console.log(utils.calcStage(charizard, "atk", "-2"));
console.log(utils.calcStage(charizard, "atk", "-2"));


const testBattle = new BATTLE(lars, bulbasaur, charizard, weathers.rain);
// console.log(testBattle.calcDamage(charizard, bulbasaur, charizard.moves[1]))

const permaWeathers = Object.values(weathers).splice(0, 6);
