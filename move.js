const { utils } = require('./utilities');
const {
  burn,
  paralysis,
  sleep,
  poison,
  toxic
} = require('./status');

// MOVES

/*
Moves can perform a variety of actions. They can do damage to the opponenet to reduce their hit point total, apply status effects, boost and lower stats, force
swaps and more.
*/

class MOVE {
  constructor(name, description, type, cata, acc, pow, pp, ppCap, contact, effects, priority, target) {
    this.name = name;
    this.description = description;
    this.type = type;
    this.cata = cata;
    this.acc = acc;
    this.pow = pow;
    this.pp = pp;
    this.ppCap = ppCap;
    this.contact = contact;
    // Effect checked in battle and applied
    this.effects = effects;
    this.priority = priority;
    this.target = target
  };


  // Determine whether an attack will hit (MOD is always 1 unless fed a different value)
  determine_hit(attacker, defender, MOD = 1) {
    // Default hit value to return
    let hit = false;
    // Calculate whether the move will hit (Formula: Hit = Move's Accuracy * (Attacker Accuracy Stat - Defender Evasion Stat) * MOD)
    const A = this.acc * (attacker.battle_stats.acc - defender.battle_stats.eva) * MOD
    // A random number between 0 - 100
    const R = Math.floor(Math.random() * 100);
    // If the hit chance is greater than or equal to the random number
    if (A >= R) {
      // The move hits
      hit = true;
      // Exit
      return hit;
    }
    return hit;
  }
};

// Moves

const accupressure = new MOVE(
  "Accupressure",
  "The user applies pressure to stress points on their body, sharply boosting one of it's stats.",
  "Normal",
  "Status",
  null,
  null,
  30,
  48,
  false,
  {
    "hasEffect": true,
    "effect": ((user) => {
      const stats = ["atk", "def", "spe", "spa", "spd"];
      const chosen = Math.floor(Math.random() * stats.length);
      const message = utils.calcStage(user, chosen, "+2");
      return message;
    })
  },
  1,
  "self"
);

const bellyDrum = new MOVE(
  "Belly Drum",
  "The user maximizes its Attack stat in exchange for half of its HP.",
  "Normal",
  "Status",
  null,
  null,
  10,
  16,
  false,
  {
    "hasEffect": true,
    "effect": ((user) => {
      const diff = user.battleStats.hitPoints - Math.floor(user.battleStats.hitPoints / 2);
      user.battleStats.hitPoints -= diff;
      utils.calcStage(user, "atk", "+6");
      return `${utils.pokemonName(user)} maximized its Attack stat!`
    })
  },
  1,
  "self"
);

const bodySlam = new MOVE(
  "Body Slam",
  "The user drops onto the target with its full body weight. This may also cause paralysis.",
  "Normal",
  "Physical",
  100,
  85,
  15,
  24,
  true,
  {
    "hasEffect": true,
    "effect": ((target) => {
      const num = Math.floor(Math.random() * 3);
      if (num === 3) {
        target.status = paralysis;
      }
    })
  },
  1,
  null
);

const cut = new MOVE(
  "Cut",
  "The target is cut with a scythe or claw.",
  "Normal",
  "Physical",
  95,
  50,
  30,
  48,
  true,
  {
    "hasEffect": false,
  },
  1,
  null
)

module.exports.normal = {
  accupressure,
  bellyDrum,
  bodySlam,
  cut
}
