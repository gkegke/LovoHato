

import { File } from '../types';


// reservoir sampling
export function randomChoice(items: Array<File>, _: Array<File>, numToChoose: number): Array<File> {
  const availableItems = items.filter((item) => !item.locked)

  if (items.length < numToChoose || availableItems.length < numToChoose) {
    return availableItems.sort(() => Math.random() - 0.5)
  }

  const resultItems: Array<File> = []

  for (let i = 0; i < numToChoose; i++) {
    resultItems[i] = availableItems[i]
  }

  for (let i = numToChoose; i < availableItems.length; i++) {
    const randomIndex = Math.floor(Math.random() * (i + 1))
    if (randomIndex < numToChoose) {
      resultItems[randomIndex] = availableItems[i]
    }
  }

  return resultItems
}

export function nextN(items: Array<File>, chosenItems: Array<File>, numToChoose: number): Array<File> {
  // item musn't be locked to be considered available
  const availableItems = items.filter((f) => !f.locked)

  if (items.length < numToChoose || availableItems.length < numToChoose) {
    return availableItems
  }

  const UnlockedChosenItems = chosenItems.filter((file) => !file.locked)
  const UnlockedChosenCount = UnlockedChosenItems.length

  // given chosenItems

  // if all chosenItems are locked return empty result since
  // no items will be added anyway when next is called
  if (UnlockedChosenCount === 0) {
    return []
  }

  // otherwise find the index of the last unlocked chosen item
  const lastUnlockedChosenIndex = chosenItems.indexOf(UnlockedChosenItems[UnlockedChosenCount - 1])

  // then find the associated index of the lastUnlockedChosenItem
  // in the availableItems list
  let currentIndex = availableItems.findIndex(
    (file) => file.fpath === chosenItems[lastUnlockedChosenIndex].fpath
  )

  // then iterate through available items, and add the next N - 1 items
  // having started from currentIndex

  const result: Array<File> = [];

  for (let i = 0; i < numToChoose; i++) {
    currentIndex = (currentIndex + 1) % availableItems.length
    result.push(availableItems[currentIndex])
  }

  return result
}

export function nextNFromIndex(items: Array<File>, _: Array<File>, numToChoose: number, fpath: string): Array<File> {

  const availableItems = items.filter((f) => !f.locked)

  if (items.length < numToChoose || availableItems.length < numToChoose) {
    return availableItems
  }

  const fileIndex = items.findIndex((file) => file.fpath === fpath)

  let nextIndex = fileIndex

  // find next unlocked index given clicked file index
  // can be fileIndex itself, but sometimes the fileIndex will be locked
  // when that happens, you'll want to iterate until we find the next unlocked
  for (let i = 0; i < items.length; i++) {
    if (!items[nextIndex].locked) {
      break
    }

    nextIndex = (nextIndex + 1) % availableItems.length
  }

  // get index of first available item
  let currentIndex = availableItems.findIndex((f) => f.fpath === items[nextIndex].fpath)

  const result = [availableItems[currentIndex]]

  // find the N-1 available items after the first, looping if necessary
  for (let i = 0; i < numToChoose - 1; i++) {
    currentIndex = (currentIndex + 1) % availableItems.length
    result.push(availableItems[currentIndex])
  }

  return result
}
