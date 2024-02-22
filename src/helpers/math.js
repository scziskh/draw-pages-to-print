export const getSumArraysObj = (objectArrays) => {
  const objectKeys = Object.keys(objectArrays);
  const temp = objectArrays;
  objectKeys.map(
    (key) => (temp[key] = temp[key].reduce((accum, curr) => accum + curr, 0))
  );
  return temp;
};
