class PKMN_TRAINER {
  constructor(name, gender) {
    this.tid = Math.floor(10000 + Math.random() * 65535);
    this.sid = Math.floor(10000 + Math.random() * 65535);
    this.name = name;
    this.gender = gender;
    this.began_journey = new Date(Date.now());
    this.money = 1000;
    this.badge_case = {
      b_1: null,
      b_2: null,
      b_3: null,
      b_4: null,
      b_5: null,
      b_6: null,
      b_7: null,
      b_8: null
    };
    this.team = {
      s_1: null,
      s_2: null,
      s_3: null,
      s_4: null,
      s_5: null,
      s_6: null
    };
    this.bag = {
      "general": {},
      "medicine": {},
      "tms": {},
      "berries": {},
      "ball": {}
    };
  };

  new_greeting(greeting) {
    this.trainer_card.greeting = greeting;
  };

  // Front-End Validation: Make sure both slots are occupied
  pokemon_switch(p_x, p_y) {
    this.team[p_x.slot] = p_y.pokemon;
    this.team[p_y.slot] = p_x.pokemon;
  };

  // Front-End Validation: Make sure there is room in the box for a deposit.
  pokemon_deposit(p, box, slot) {
    this.team[p.slot] = null;
    box.pokemon[slot] = p.pokemon;
  };

  // Front-End Validation: Make sure there is room on the team for a withdrawal
  pokemon_withdraw(p, box, slot) {
    box.pokemon[slot] = null;
    this.team[p.slot] = p.pokemon;
  };

  // Front-End Validation: Make sure there is a pokemon in the release slot
  pokemon_release(box, slot) {
    box[slot] = null;
  };

  item_add(item, quantity) {
    if (!this.inventory[item.type][item.shorthand]) {
      this.inventory[item.type][item.shorthand] = item;
    };
    this.inventory[item.type][item.shorthand].quantity += quantity;
  };

  item_buy(item, quantity) {
    if (!this.inventory[item.type][item.shorthand]) {
      this.inventory[item.type][item.shorthand] = item;
    };
    if (item.price * quantity > this.money) {
      return "Cannot purchase! You don't have enough money!"
    };
    this.inventory[item.type][item.shorthand].quantity += quantity;
    this.money -= item.price * quantity;
  };

  item_use(slot, item) {
    item.effect(this.team[slot]);
    this.inventory[item.type][item.shorthand].quantity--;
  };

  // Front-End Validation: Make sure the Pokemon is not holding an item already
  item_give(slot, item) {
    this.team[slot].held_item = item;
    this.inventory[item.type][item.shorthand].quantity--;
  };

  // Front-End Validation: Make sure the Pokemon is holding an item
  item_take(slot, item) {
    this.team[slot].held_item = null;
    this.inventory[item.type][item.shorthand].quantity++;
  };

  // Front-End Validation: Make sure the quantity limit only reaches the quantity of the item to be deleted
  item_delete(item, quantity) {
    this.inventory[item.type][item.shorthand].quantity -= quantity;
  };

  // Front-End Validation: Make sure the move is found in the Pokemon's learnset.
  new_move(new_move, p_slot, m_slot) {
    this.team[p_slot].moves[m_slot] = new_move;
  };

  check_summary(pokemon) {
    return pokemon;
  };

  // Throwing a Poke ball at a Pokemon
  throwBall(ball, pokemon) {
    // Result to return
    const result = {
      "outcome": false,
      "message": "Aww! It broke free!"
    };

    // Pokemon's Catch Rate
    const C = pokemon.catchRate;
    // Pokemon's HP Stat
    const HPMAX = pokemon.stats.hp;
    // Pokemon's current Hit Point value
    const HPCURR = pokemon.battleStats.hitPoints;
    // The Poke Ball's capture multiplier
    const BALL = ball.multiplier;
    // The Pokemon's status multiplier
    const STATUS = pokemon.status.multiplier;

    // The final capture rate formula | RATE = ((3 * HPMAX - 2 * HPCURR) * (C * BALL) / 3 * HPMAX) * STATUS
    const X = ((3 * HPMAX - 2 * HPCURR) * (C * BALL) / 3 * HPMAX) * STATUS;
    // A Random catch chance to compare
    const chance = Math.floor(((65535 / Math.sqrt(Math.sqrt(255 / X))) / 8));

    // Calling the capture function
    const caught = this.capture(0, chance);

    // If the Pokemon is caught
    if (caught) {
      // Assign the Pokemon to the trainer
      pokemon.ot = this.info();
      // Tweak results outcome
      result.outcome = true;
      result.message = "Pokemon captured!";
      // Exit
      return result;
    };

    return result;
  };

  // Generates a random int for comparing when capturing
  randomCatchInt() {
    const max = 65536;
    return Math.floor(Math.random() * max);
  };

  // Capture functio to determine the capture of a Pokemon
  capture(wobbles = 0, catchChance) {
    // Catch chance fed in battle
    // Random Catch Int called
    let ranNum = this.randomCatchInt();
    // Declare return value
    let caught = false;
    // If the random num is greater than the catch chance
    if (ranNum >= catchChance) {
      // Exit with false
      return caught;
    };
    // If the wobble count reaches 4
    if (wobbles === 4) {
      // Toggle caught to true
      caught = true;
      // Exit
      return caught;
    };
    // Generate a new Random Number
    ranNum = this.randomCatchInt();
    // Recursively call the function, increasing the wobble count
    return this.capture(wobbles += 1, catchChance)
  };

  trainerCard() {
    return {
      name: this.name,
      gender: this.gender,
      tid: this.tid,
      began_journey: this.began_journey,
      money: this.money,
      badges: this.badge_case,
      greeting: null,
    }
  }
};

module.exports.PKMN_TRAINER = PKMN_TRAINER;
