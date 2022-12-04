// Experience Growth Rate Graphs

/*
Medium-Fast Exp Growth Formula = EXP = level^3 (level x level x level)
*/
const mediumFastGen = () => {
  // Object to return
  const mediumFast = {};
  // Store the ToNext value, which is the TOTAL EXP needed to reach the next level
  let toNext = 8
  // Loop through levels up to 100
  for (let level = 1; level <= 100; level++) {
    // If the level is 100, toNext should be null, then break.
    if (level === 100) {
      mediumFast[level] = { toNext: null };
      break;
    };
    // Store the level as key, toNext as the value
    mediumFast[level] = { toNext: toNext };
    // The Math. Reassign toNext to level + 2 cubed
    toNext = Math.pow(level + 2, 3);
  }
  // Return the Exp Growth for Pokémon to use.
  return mediumFast;
};

const mediumFast = mediumFastGen();
console.log(mediumFast);

const erratic = {
  1: { toNext: 15 },
  2: { toNext: 52 },
  3: { toNext: 122 },
  4: { toNext: 237 },
  5: { toNext: 406 },
  6: { toNext: 637 },
  7: { toNext: 942 },
  8: { toNext: 1326 },
  9: { toNext: 1800 },
  10: { toNext: 2369 },
  11: { toNext: 3041 },
  12: { toNext: 3822 },
  13: { toNext: 4719 },
  14: { toNext: 5737 },
  15: { toNext: 6881 },
  16: { toNext: 8155 },
  17: { toNext: 9564 },
  18: { toNext: 11111 },
  19: { toNext: 12800 },
  20: { toNext: 14632 },
  21: { toNext: 16610 },
  22: { toNext: 18737 },
  23: { toNext: 21012 },
  24: { toNext: 23437 },
  25: { toNext: 26012 },
  26: { toNext: 28737 },
  27: { toNext: 31610 },
  28: { toNext: 34632 },
  29: { toNext: 37800 },
  30: { toNext: 41111 },
  31: { toNext: 44564 },
  32: { toNext: 48155 },
  33: { toNext: 51881 },
  34: { toNext: 55738 },
  35: { toNext: 59719 },
  36: { toNext: 63822 },
  37: { toNext: 68041 },
  38: { toNext: 72369 },
  39: { toNext: 76800 },
  40: { toNext: 81326 },
  41: { toNext: 85942 },
  42: { toNext: 90637 },
  43: { toNext: 95406 },
  44: { toNext: 100237 },
  45: { toNext: 105122 },
  46: { toNext: 110052 },
  47: { toNext: 115015 },
  48: { toNext: 120001 },
  49: { toNext: 125000 },
  50: { toNext: 131324 },
  51: { toNext: 137795 },
  52: { toNext: 144410 },
  53: { toNext: 151165 },
  54: { toNext: 158056 },
  55: { toNext: 165079 },
  56: { toNext: 169422 },
  57: { toNext: 172229 },
  58: { toNext: 179503 },
  59: { toNext: 186894 },
  60: { toNext: 194400 },
  61: { toNext: 202013 },
  62: { toNext: 209728 },
  63: { toNext: 217540 },
  64: { toNext: 225443 },
  65: { toNext: 233431 },
  66: { toNext: 241496 },
  67: { toNext: 257834 },
  68: { toNext: 267406 },
  69: { toNext: 276458 },
  70: { toNext: 286328 },
  71: { toNext: 296358 },
  72: { toNext: 305767 },
  73: { toNext: 316074 },
  74: { toNext: 326531 },
  75: { toNext: 336255 },
  76: { toNext: 346965 },
  77: { toNext: 357812 },
  78: { toNext: 367807 },
  79: { toNext: 378880 },
  80: { toNext: 390077 },
  81: { toNext: 400293 },
  82: { toNext: 411686 },
  83: { toNext: 423190 },
  84: { toNext: 433572 },
  85: { toNext: 445239 },
  86: { toNext: 457001 },
  87: { toNext: 467489 },
  88: { toNext: 479378 },
  89: { toNext: 491346 },
  90: { toNext: 501934 },
  91: { toNext: 513934 },
  92: { toNext: 526049 },
  93: { toNext: 536557 },
  94: { toNext: 548720 },
  95: { toNext: 560922 },
  96: { toNext: 571333 },
  97: { toNext: 583539 },
  98: { toNext: 591882 },
  99: { toNext: 600000 },
  100: { toNext: null },
}

module.exports.expGraphs = {
  erratic
};
