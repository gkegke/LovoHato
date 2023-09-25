// reservoir sampling
export function randomChoice(items, chosenItems, numToChoose) {

  if (items.length < numToChoose) {
    console.log(`not enough items. have ${items.length}, expected ${numToChoose}`);
    const result = items.filter((f) => !chosenItems.includes(f));
    console.log('chosenFiles', result.map((f) => f.basename));
    return result;
  }

  const availableItems = items.filter(item => !chosenItems.includes(item));

  //console.log('randomized');
  //console.log('items', items.map((f) => f.basename));
  //console.log('chosenItems', chosenItems.map((f) => f.basename));
  //console.log('availableItems', availableItems.map((f) => f.basename));

  if (availableItems.length < numToChoose) {
    console.log(`not enough available items. have ${availableItems.length}, expected ${numToChoose}`);
    return availableItems;
  }

  const resultItems = [];

  for (let i = 0; i < numToChoose; i++) {
    resultItems[i] = availableItems[i];
  }

  for (let i = numToChoose; i < availableItems.length; i++) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    if (randomIndex < numToChoose) {
      resultItems[randomIndex] = availableItems[i];
    }
  }

  //console.log('resultItems', resultItems.map((f) => f.basename));

  return resultItems;
}

export function nextN(items, chosenItems, numToChoose) {

  const selectedItems = chosenItems.filter((file) => file.selected);
  const nonSelectedItems = chosenItems.filter((file) => !file.selected);
  const nonSelectedCount = nonSelectedItems.length;

  if (items.length < numToChoose) {
    console.log(`not enough items. have ${items.length}, expected ${numToChoose}`);
    const result = items.filter((f) => !chosenItems.includes(f));
    console.log('chosenFiles', result.map((f) => f.basename));
    return result;
  }

  const lastNonSelectedIndex =
    nonSelectedItems.length > 0
      ? chosenItems.indexOf(nonSelectedItems[nonSelectedCount - 1])
      : chosenItems.length - 1;

  let currentIndex = items.findIndex(
    (file) => file === chosenItems[lastNonSelectedIndex]
  );

  //console.log('nextN');
  //console.log(`
  // lastIndex: ${lastNonSelectedIndex}
  //`);

  const result = [];

  for (let i = 0; i < numToChoose; i++) {
    currentIndex = (currentIndex + 1) % items.length;
    //console.log(`
    //index: ${currentIndex} , ${items[currentIndex].basename}
    //`)
    result.push(items[currentIndex]);
  }

  const returnItems = result.filter((item) => !selectedItems.includes(item));

  //console.log('result', result.map((f) => f.basename));
  //console.log('selectedItems', selectedItems.map((f) => f.basename));
  //console.log('filteredResult2', returnItems.map((f) => f.basename));

  return returnItems
}

export function nextNFromIndex(items, chosenFiles, numToChoose, fpath) {

  if (items.length < numToChoose) {
    console.log(`not enough items. have ${items.length}, expected ${numToChoose}`);
    const result = items.filter((f) => !chosenItems.includes(f));
    console.log('chosenFiles', result.map((f) => f.basename));
    return result;
  }

  const availableItems = items.filter((f) => !f.selected);

  let fileIndex = items.findIndex(
    (file) => file.fpath === fpath
  );

  let nextIndex = fileIndex;

  for (let i = 0; i < items.length; i++) {

    if (!items[nextIndex].selected) {
      break;
    }

    nextIndex = (nextIndex + 1) % availableItems.length;

  }

  let currentIndex = availableItems.findIndex(
    (f) => f.fpath === items[nextIndex].fpath
  );

  console.log('nextNFromIndex');
  console.log('fpath', fpath);
  console.log('items', items.map((f) => f.basename));
  console.log('aItems', availableItems.map((f) => f.basename));
  console.log('index', currentIndex);
  console.log('index', availableItems[currentIndex].basename);

  const result = [availableItems[currentIndex]];

  for (let i = 0; i < numToChoose; i++) {
    //currentIndex = (currentIndex + 1) % availableItems.length;
    //console.log(`
    //index: ${currentIndex} , ${availableItems[currentIndex].basename}
    //`)
    currentIndex = (currentIndex + 1) % availableItems.length;
    result.push(availableItems[currentIndex]);
  }

  //console.log('result', result.map((f) => f.basename));

  return result;
}
