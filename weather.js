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
const grassyTerrain = new WEATHER("Grassy Terrain", "grassy", null, "The grassy terrain blows gently...", true);
const weirdTerrain = new WEATHER("Weird Terrain", "weird", 3, "The battlefield is still weird!", false);
