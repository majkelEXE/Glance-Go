class CardSetter {
  constructor() {
    this.symbols = [
      "Anchor",
      "Apple",
      "Bomb",
      "Cactus",
      "Candle",
      "Carrot",
      "Cheese",
      "Chess knight",
      "Clock",
      "Clown",
      "Diasy flower",
      "Dinosaur",
      "Dolphin",
      "Dragon",
      "Exclamation mark",
      "Eye",
      "Fire",
      "Four leaf clover",
      "Ghost",
      "Green splats",
      "Hammer",
      "Heart",
      "Ice cube",
      "Igloo",
      "Key",
      "Ladybird",
      "Light bulb",
      "Lightning bolt",
      "Lock",
      "Maple leaf",
      "Milk bottle",
      "Moon",
      "No Entry sign",
      "Orange scarecrow man",
      "Pencil",
      "Purple bird",
      "Purple cat",
      "Purple dobble sign",
      "Question Mark",
      "Red lips",
      "Scissors",
      "Skull and crossbones",
      "Snowflake",
      "Snowman",
      "Spider",
      "Spider’s web",
      "Sun",
      "Sunglasses",
      "Target",
      "Taxi",
      "Tortoise",
      "Treble clef",
      "Tree",
      "Water drop",
      "Dog",
      "Yin and Yang",
      "Zebra",
    ];
  }

  renderCardSet = () => {
    //This has to be a prime + 1
    let numberOfSymbolsOnCard = 8;

    let shuffleSymbolsOnCard = true;

    let cards = [];

    //Initial prime number
    let n = numberOfSymbolsOnCard - 1;

    //Total cards number (from algo)
    let numberOfCards = n ** 2 + n + 1;

    //First set of cards
    for (let i = 0; i < n + 1; i++) {
      cards.push([1]);

      for (let j = 0; j < n; j++) {
        cards[i].push(j + 1 + i * n + 1);
      }
    }

    //Left sets
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        cards.push([i + 2]);

        for (let k = 0; k < n; k++) {
          let num = n + 1 + n * k + ((i * k + j) % n) + 1;
          cards[cards.length - 1].push(num);
        }
      }
    }

    function shuffle(array) {
      let currentIndex = array.length,
        randomIndex;

      // While there remain elements to shuffle.
      while (currentIndex != 0) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
          array[randomIndex],
          array[currentIndex],
        ];
      }

      return array;
    }

    if (shuffleSymbolsOnCard) {
      cards.forEach((card) => {
        shuffle(card);
      });
    }

    console.log(cards.map((card) => card.map((num) => this.symbols[num - 1])));
    cards = cards.map((card) => card.map((num) => this.symbols[num - 1]));
    return cards;
  };
}

module.exports = CardSetter;
