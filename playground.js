const { PKMN_TRAINER } = require('./trainer');
const { POKEMON } = require('./pokemon');
const { BATTLE } = require('./battle');
const { ACTION } = require('./action');
const { weathers } = require('./weather');
const { overgrow } = require('./ability');
const { expGraphs } = require('./expGraphs');
const { rareCandy } = require('./items');

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

console.log(charizard.giveExp());
console.log("CHARIZARD'S LEVEL:: ", charizard.level);
console.log("CHARIZARD'S EXP:: ", charizard.exp);
console.log("TO NEXT LEVEL:: ", charizard.expGrowth[charizard.level].toNext);
console.log(charizard.gainExp(6000));
console.log("CHARIZARD'S LEVEL:: ", charizard.level);
console.log(rareCandy.use(charizard));
console.log("RARE CANDY LEVEL:: ", charizard.level)
console.log("CHARIZARD'S EXP:: ", charizard.exp);



const permaWeathers = Object.values(weathers).splice(0, 6);
