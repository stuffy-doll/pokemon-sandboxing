const pokemonName = (pokemon) => {
  return pokemon.nickname ? pokemon.nickname : pokemon.name;
}

// Check what Stage the Pokémon's stat is currently on
const checkStage = (pokemon, stat) => {
  // To store the stage value
  let stage;
  // Sample of the original stat (Base stat calculation)
  statSample = Math.floor(((2 * pokemon.baseStats[stat] + pokemon.ivs[stat]) * pokemon.level / 100) + 5 * (pokemon.nature.bonus === stat ? 1.1 : 1) * (pokemon.nature.penalty === stat ? 0.9 : 1))
  // An object who's keys are stages and values are what the stat would look like at each stage
  const stageObj = {
    "-6": Math.floor(statSample * 0.25),
    "-5": Math.floor(statSample * 0.28),
    "-4": Math.floor(statSample * 0.33),
    "-3": Math.floor(statSample * 0.40),
    "-2": Math.floor(statSample * 0.50),
    "-1": Math.floor(statSample * 0.66),
    "0": statSample,
    "1": Math.floor(statSample * 1.5),
    "2": statSample * 2,
    "3": Math.floor(statSample * 2.5),
    "4": statSample * 3,
    "5": Math.floor(statSample * 3.5),
    "6": statSample * 4
  };
  // Create arrays from keys and values of the stage object
  const stages = Object.keys(stageObj);
  const values = Object.values(stageObj);
  // Iterate through the values
  values.forEach((value, i) => {
    // If the pokemon's stat is equal to the value at the current index
    if (pokemon.stats[stat] === value) {
      // Capture that stage
      stage = stages[i];
    }
  });
  // Return the stage
  return {
    "statSample": statSample,
    "stage": stage,
  };
}

const calcStage = (pokemon, stat, stage) => {
  let diff;
  // Capture the stat's current stage and turn it into a number
  const currentStage = +checkStage(pokemon, stat).stage;
  const statSample = checkStage(pokemon, stat).statSample;
  // Stat stages for calculation
  const stages = {
    "-6": Math.floor(statSample * 0.25),
    "-5": Math.floor(statSample * 0.28),
    "-4": Math.floor(statSample * 0.33),
    "-3": Math.floor(statSample * 0.40),
    "-2": Math.floor(statSample * 0.50),
    "-1": Math.floor(statSample * 0.66),
    "0": statSample,
    "1": Math.floor(statSample * 1.5),
    "2": statSample * 2,
    "3": Math.floor(statSample * 2.5),
    "4": statSample * 3,
    "5": Math.floor(statSample * 3.5),
    "6": statSample * 4
  };
  // Calculate the new stage
  const newStage = +stage + currentStage;
  // If the stat is capped (either max or min), then the stat change fails
  if ((currentStage === 6 && +stage > 0) || (currentStage === -6 && +stage < 0)) {
    return `${pokemonName(pokemon)}'s stat couldn't change!`
  }
  // Handling cases in which stats could increase, but overflow
  if (newStage > 6) {
    diff = newStage - 6
    newStage = 6;
    pokemon.stats[stat] = stages[`${newStage}`];
  } else if (newStage < -6) {
    diff = newStage + -6
    newStage = -6;
    pokemon.stats[stat] = stages[`${newStage}`];
  } else {
    pokemon.stats[stat] = stages[`${newStage}`];
  }
  // Return a brief message
  return `${pokemon.stats[stat] > statSample ? `${pokemonName(pokemon)}'s ${stat.toUpperCase()} went up!` : `${pokemonName(pokemon)}'s ${stat.toUpperCase()} went down!`}`;
};


module.exports.utils = {
  pokemonName,
  checkStage,
  calcStage,
}
