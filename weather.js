// WEATHER
/*
Weather applies various changes to a battle environment, including stat boosts/penalties and hazards.
*/

class Weather {
  constructor(name, shorthand, duration, message, persists) {
    this.name = name;
    this.shorthand = shorthand;
    this.duration = this.persists === true ? Infinity : duration;
    this.message = message;
    this.persists = persists;
  };
};
