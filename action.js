class ACTION {
  constructor(type, move, ball, item, swap) {
    this.type = type;
    this.move = move;
    this.ball = ball;
    this.item = item;
    this.swap = swap;
  };

  toSafeObject() {
    return {
      "type": this.type,
      "move": this.move,
      "ball": this.ball,
      "item": this.item,
      "swap": this.swap
    };
  };
};

module.exports.ACTION = ACTION;
