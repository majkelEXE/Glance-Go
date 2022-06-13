class CardSetter {
  constructor() {
    this.allSymbols = [
      "apricot",
      "asparagus",
      "avocado",
      "baguette",
      "banana",
      "blueberry",
      "broccoli",
      "carrot",
      "cauliflower",
      "celery",
      "cherry-cheesecake",
      "cherry",
      "citrus",
      "coconut",
      "cookies",
      "corn",
      "croissant",
      "date-fruit",
      "doughnut",
      "dragon-fruit",
      "durian",
      "eggplant",
      "ginger",
      "grapes",
      "gummy-bear",
      "ice-cream-cone",
      "jackfruit",
      "kiwi",
      "lettuce",
      "lime",
      "lychee",
      "mango",
      "olive",
      "orange",
      "papaya",
      "paprika",
      "peach",
      "pear",
      "pie",
      "pineapple",
      "pomegranate",
      "pretzel",
      "pumpkin",
      "radish",
      "raspberry",
      "soy",
      "spinach",
      "steak",
      "strawberry",
      "sweet-potato",
      "sweets",
      "thanksgiving",
      "tomato",
      "watermelon",
      "whole-apple",
      "whole-melon",
      "zucchini",
    ];
  }

  renderCardSet(symbolsNumber) {
    //This has to be a prime + 1

    let numberOfSymbolsOnCard = symbolsNumber;

    let shuffleSymbolsOnCard = true;
    let shuffleCards = true;

    let cards = [];

    //Initial prime number
    let n = numberOfSymbolsOnCard - 1;

    //Total cards number (from algo)
    let numberOfCards = n ** 2 + n + 1;

    this.symbols = [];

    if (symbolsNumber != 8) {
      this.indexes = [];
      while (this.indexes.length != numberOfCards) {
        let randomNumber = Math.floor(Math.random() * (56 - 0) + 0);
        if (!this.indexes.includes(randomNumber)) {
          this.indexes.push(randomNumber);
        }
      }
      this.indexes.forEach((index) => {
        this.symbols.push(this.allSymbols[index]);
      });
    } else {
      this.symbols = this.allSymbols;
    }

    console.log("tu sa wylosowane");
    console.log(this.symbols);

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

    if (shuffleCards) {
      shuffle(cards);
    }

    console.log("karty");
    console.log(cards);

    // console.log(cards.map((card) => card.map((num) => this.symbols[num - 1])));
    cards = cards.map((card) => {
      return card.map((num) => this.symbols[num - 1]);
    });
    return cards;
  }
}

module.exports = CardSetter;
