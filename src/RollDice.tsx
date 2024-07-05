export const rollDice = (sides: number, amount = 1) => {
    let outcome = 0;
    for (let i = 0; i < amount; i++) {
      outcome += Math.floor(Math.random() * sides) + 1;
    }
    return outcome;
  };