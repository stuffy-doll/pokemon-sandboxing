// ABILITIES
/*
Abilities...
- Are procced when certain conditions are met

Feed data about the turn to the abilty's check? Return a boolean determining whether
the ability has been procced or not?
*/

class ABILITY {
  constructor(
    name, description, check
  ) {
    this.name = name;
    this.description = description;
    this.check = check; // Run a check to determine the ability's activation
  };

  determine_proc(data) {
    return this.check(data)
  };
};

// const flame_body = new ABILITY(
//   "Flame Body",
//   "If the user is hit with a contact move, there is a chance to burn the attacker.",
//   ((data) => {
//     let proc = {
//       "procced": false,
//       "effect": ((pokemon) => {
//         pokemon.status = burn;
//       }),
//       "message": null
//     }
//     if (data.foe.action.move.contact === true) {
//       const base = 255;
//       const chance = Math.floor(Math.random() * Math.sqrt(base));
//       if (chance > base) {
//         proc.procced = true;
//         proc.effect(data.foe);
//         proc.message = `The foe was burned by ${data.ally.nickname ? data.ally.nickname : data.ally.name}'s Flame Body!`
//         return proc;
//       }
//     }
//     return proc;
//   }),
// );

const overgrow = new ABILITY(
  "Overgrow",
  "When the user's HP is at or below half, they gain a boost to their Grass type moves.",
  // Ability's Check (Fed data about the battle)
  ((data) => {
    // Instantiate the proc, holding data about whether the check passes, and the effect that takes place within.
    let proc = {
      "procced": false,
      "effect": ((pokemon) => {
        // In Overgrow's case, we want to increase the value of the Pokemon's ability multiplier;
        pokemon.battleStats.abm = 1.5;
      }),
      "message": null,
    }
    // If the move type is Grass and the attacking pokemon's HP is less than half
    if (data.ally.action.move.type === "Grass" && (data.ally.battleStats.hitPoints <= data.ally.battleStats.hitPoints / 2)) {
      // Proc the ability
      proc.procced = true;
      // Trigger the ability's effect
      proc.effect(data.ally)
      return proc;
    }
    // If conditions change, reassign the ABM to 1
    data.ally.battleStats.abm = 1;
    return proc;
  })
);

module.exports.overgrow = overgrow
