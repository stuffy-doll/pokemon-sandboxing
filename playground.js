const { PKMN_TRAINER } = require('./trainer');
const { POKEMON } = require('./pokemon');
const { BATTLE } = require('./battle');
const { ACTION } = require('./action');
const { weathers } = require('./weather');
const { overgrow } = require('./ability');
const { expGraphs } = require('./expGraphs');
const { moves } = require('./move');
const { utils } = require('./utilities');
const { duskBall } = require('./items');


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
  45,
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
  45,
  null,
  null,
)


const permaWeathers = Object.values(weathers).splice(0, 6);
