const weights = {
  cons : {
    B: 7,
    C: 15,
    D: 20,
    F: 12,
    G: 10,
    H: 25,
    J: 2,
    K: 2,
    L: 20,
    M: 15,
    N: 20,
    P: 8,
    Q: 1,
    R: 25,
    S: 25,
    T: 25,
    V: 3,
    W: 8,
    X: 1,
    Y: 11,
    Z: 1,
  },
  vows: {
    A: 5,
    E: 8,
    I: 4,
    O: 4,
    U: 2,
  },
}

const makePool = weights => {
  const pool = [];
  for (key in weights) {
    for (let i = 0; i < weights[key]; i++) {
      pool.push(key);
    }
  }
  return pool
}

const pools = {
  cons: makePool(weights.cons),
  vows: makePool(weights.vows),
};

module.exports.pools = pools;
module.exports.weights = weights;
