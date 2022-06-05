class CardSetter {
  constructor() {
    this.symbols = [
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

    // console.log(cards.map((card) => card.map((num) => this.symbols[num - 1])));
    cards = cards.map((card) => {
      return {
        state: "not used",
        elements: card.map((num) => this.symbols[num - 1]),
      };
    });
    return cards;
  };
}

module.exports = CardSetter;
