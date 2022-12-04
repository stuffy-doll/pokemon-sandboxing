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

const growl = new MOVE(
  "Growl",
  "The user growls in an endearing way, making opposing Pokemon less wary. This lowers their Attack stats.",
  "Normal",
  "Status",
  100,
  null,
  40,
  56,
  false,
  {
    // hasEffect is checked
    "hasEffect": true,
    // If hasEffect, then the effect is applied
    "effect": ((pokemon) => {
      pokemon.stats.atk = pokemon.stats.atk * 0.9;
      return `${pokemon.nickname ? pokemon.nickname : pokemon.name}'s `
    })
  },
  1,
  "foe"
);

const scratch = new MOVE(
  "Scratch",
  "The user scratches with sharp claws.",
  "Normal",
  "Physical",
  100,
  35,
  40,
  56,
  true,
  {
    "hasEffect": false,
  },
  1,
  null
);

const flameThrower = new MOVE(
  "Flamethrower",
  "The user blows intense flames at the opponent. It may cause a burn",
  "Fire",
  "Special",
  90,
  90,
  10,
  15,
  false,
  {
    "hasEffect": true,
    "effect": ((pokemon) => {
      const message = null
      const threshold = 12;
      const chance = Math.floor(Math.random() * 12);
      if (chance == threshold) {
        message = `${pokemon.nickname ? pokemon.nickname : pokemon.name} was burned by the attack!`
        pokemon.status = burn;
      }
      return message;
    })
  },
  1,
  null
)

module.exports.moves = {
  scratch, flameThrower
}
