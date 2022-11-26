// WEATHER
/*
Weather applies various changes to a battle environment, including stat boosts/penalties and hazards.
*/

class WEATHER {
  constructor(name, shorthand, duration, message, persists) {
    this.name = name;
    this.shorthand = shorthand;
    this.duration = this.persists === true ? Infinity : duration;
    this.message = message;
    this.persists = persists;
  };
};

const sunlight = new WEATHER("Harsh Sunlight", "sunlight", null, "The sunlight beats down harshly...", true);
const moonlight = new WEATHER("Eerie Moonlight", "moonlight", null, "The moon glows eerily...", true);
const rain = new WEATHER("Rain", "rain", null, "The rain continues to fall...", true);
const hail = new WEATHER("Hail", "hail", null, "Hail rains from the sky...", true);
const sandstorm = new WEATHER("Sandstorm", "sandstorm", null, "The sandstorm blows wildly...", true);
const fog = new WEATHER("Heavy Fog", "fog", null, "Heavy fog obscures the battlefield...", true);
const grassyTerrain = new WEATHER("Grassy Terrain", "grassy", 3, "The grassy terrain blows gently...", false);
const weirdTerrain = new WEATHER("Weird Terrain", "weird", 3, "The battlefield is still weird!", false);
const tempSun = new WEATHER("Harsh Sunlight", "sunlight", 3, "The sunlight beats down harshly...", false);
const tempRain = new WEATHER("Rain", "rain", 3, "The rain continues to fall...", false);
const tempSand = new WEATHER("Sandstorm", "sandstorm", 3, "The sandstorm blows wildly...", false);

module.exports.weathers = {
  sunlight,
  moonlight,
  rain,
  hail,
  sandstorm,
  fog,
  grassyTerrain,
  weirdTerrain,
  tempSun,
  tempRain,
  tempSand
};
