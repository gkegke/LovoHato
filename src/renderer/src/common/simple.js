
/*

 Simple functions for which typescript types are too overcomplicated for

*/

const Throttle = (func, delay) => {
  let lastExecutedTime = 0;

  return (...args) => {
    const currentTime = Date.now();

    if (currentTime - lastExecutedTime >= delay) {
      func(...args);
      lastExecutedTime = currentTime;
    }
  };
};

export {
  Throttle
}
