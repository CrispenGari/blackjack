export const shuffle = <T>(values: Array<T>): Array<T> => {
  return values.sort((_) => Math.random() - 0.5);
};

export const shareCards = <T>(array: Array<T>, parts: number) => {
  let result = [];
  for (let i = parts; i > 0; i--) {
    result.push(array.splice(0, Math.ceil(array.length / i)));
  }
  return result;
};
