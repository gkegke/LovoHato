import { describe, it, expect } from 'vitest'
import { randomChoice, nextN, nextNFromIndex } from '../common/utils.js'

const baseItems = [
  { fpath: 'file0', basename: 'File 0', selected: false, locked: false, ext: 'jpg' },
  { fpath: 'file1', basename: 'File 1', selected: false, locked: false, ext: 'jpg' },
  { fpath: 'file2', basename: 'File 2', selected: false, locked: false, ext: 'jpg' },
  { fpath: 'file3', basename: 'File 3', selected: false, locked: false, ext: 'jpg' },
  { fpath: 'file4', basename: 'File 4', selected: false, locked: false, ext: 'jpg' },
  { fpath: 'file5', basename: 'File 5', selected: false, locked: false, ext: 'jpg' },
  { fpath: 'file6', basename: 'File 6', selected: false, locked: false, ext: 'jpg' },
  { fpath: 'file7', basename: 'File 7', selected: false, locked: false, ext: 'jpg' },
  { fpath: 'file8', basename: 'File 8', selected: false, locked: false, ext: 'jpg' },
  { fpath: 'file9', basename: 'File 9', selected: false, locked: false, ext: 'jpg' },
  { fpath: 'file10', basename: 'File 10', selected: false, locked: false, ext: 'jpg' },
  { fpath: 'file11', basename: 'File 11', selected: false, locked: false, ext: 'jpg' },
  { fpath: 'file12', basename: 'File 12', selected: false, locked: false, ext: 'jpg' },
  { fpath: 'file13', basename: 'File 13', selected: false, locked: false, ext: 'jpg' }
]

describe('nextN function', () => {
  it('should return next N items', () => {
    const tempItems = baseItems.map((item) => ({ ...item }))

    const chosenItems = [
      { fpath: 'file1', basename: 'File 1', selected: false, locked: false, ext: 'jpg' },
      { fpath: 'file2', basename: 'File 2', selected: false, locked: false, ext: 'jpg' },
      { fpath: 'file3', basename: 'File 3', selected: false, locked: false, ext: 'jpg' }
    ]

    const result = nextN(tempItems, chosenItems, 3)

    expect(result).toHaveLength(3)
    expect(result).toEqual([
      { fpath: 'file4', basename: 'File 4', selected: false, locked: false, ext: 'jpg' },
      { fpath: 'file5', basename: 'File 5', selected: false, locked: false, ext: 'jpg' },
      { fpath: 'file6', basename: 'File 6', selected: false, locked: false, ext: 'jpg' }
    ])
  })

  it('should return next N items including and after last locked item', () => {
    const tempItems = baseItems.map((item) => ({ ...item }))

    tempItems[3].locked = true

    const chosenItems = [
      { fpath: 'file1', basename: 'File 1', selected: false, locked: false, ext: 'jpg' },
      { fpath: 'file2', basename: 'File 2', selected: false, locked: false, ext: 'jpg' },
      { fpath: 'file3', basename: 'File 3', selected: false, locked: true, ext: 'jpg' } // locked
    ]

    const result = nextN(tempItems, chosenItems, 3)

    expect(result).toHaveLength(3)
    expect(result).toEqual([
      { fpath: 'file4', basename: 'File 4', selected: false, locked: false, ext: 'jpg' },
      { fpath: 'file5', basename: 'File 5', selected: false, locked: false, ext: 'jpg' },
      { fpath: 'file6', basename: 'File 6', selected: false, locked: false, ext: 'jpg' }
    ])
  })

  it('should return next N items including and after last locked item #2', () => {
    const tempItems = baseItems.map((item) => ({ ...item }))

    tempItems[1].locked = true
    tempItems[3].locked = true

    const chosenItems = [
      { fpath: 'file1', basename: 'File 1', selected: false, locked: true, ext: 'jpg' }, // locked
      { fpath: 'file2', basename: 'File 2', selected: false, locked: false, ext: 'jpg' },
      { fpath: 'file3', basename: 'File 3', selected: false, locked: true, ext: 'jpg' } // locked
    ]

    //console.log('TEST #2');

    const result = nextN(tempItems, chosenItems, 3)

    //console.log('TEST #2 RESULT', result);

    expect(result).toHaveLength(3)
    expect(result).toEqual([
      { fpath: 'file4', basename: 'File 4', selected: false, locked: false, ext: 'jpg' },
      { fpath: 'file5', basename: 'File 5', selected: false, locked: false, ext: 'jpg' },
      { fpath: 'file6', basename: 'File 6', selected: false, locked: false, ext: 'jpg' }
    ])
  })

  it('should return empty result since all chosenItems are locked', () => {
    const tempItems = baseItems.map((item) => ({ ...item }))

    tempItems[1].locked = true
    tempItems[2].locked = true
    tempItems[3].locked = true

    const chosenItems = [
      { fpath: 'file1', basename: 'File 1', selected: false, locked: true, ext: 'jpg' }, // locked
      { fpath: 'file2', basename: 'File 2', selected: false, locked: true, ext: 'jpg' },
      { fpath: 'file3', basename: 'File 3', selected: false, locked: true, ext: 'jpg' } // locked
    ]

    const result = nextN(tempItems, chosenItems, 3)

    expect(result).toHaveLength(0)
    expect(result).toEqual([])
  })

  it('should handle when there are not enough items', () => {
    const smallItemList = [
      { fpath: 'file1', basename: 'File 1', selected: false, locked: false, ext: 'jpg' }
    ]
    const chosenItems = [
      { fpath: 'file1', basename: 'File 1', selected: false, locked: false, ext: 'jpg' }
    ]

    const result = nextN(smallItemList, chosenItems, 3)
    expect(result).toHaveLength(1)
    expect(result).toEqual([
      { fpath: 'file1', basename: 'File 1', selected: false, locked: false, ext: 'jpg' }
    ])
  })
})

describe('nextNFromIndex function', () => {
  const tempItems = baseItems.map((item) => ({ ...item }))

  it('should return next N items after given file', () => {
    const chosenItems = [
      { fpath: 'file1', basename: 'File 1', selected: false, locked: false, ext: 'jpg' },
      { fpath: 'file2', basename: 'File 2', selected: false, locked: false, ext: 'jpg' },
      { fpath: 'file3', basename: 'File 3', selected: false, locked: false, ext: 'jpg' }
    ]

    const result = nextNFromIndex(tempItems, chosenItems, 3, 'file10')

    expect(result).toHaveLength(3)
    expect(result).toEqual([
      { fpath: 'file10', basename: 'File 10', selected: false, locked: false, ext: 'jpg' },
      { fpath: 'file11', basename: 'File 11', selected: false, locked: false, ext: 'jpg' },
      { fpath: 'file12', basename: 'File 12', selected: false, locked: false, ext: 'jpg' }
    ])
  })

  it('should return next N items after given file locked', () => {
    const tempItems = baseItems.map((item) => ({ ...item }))

    tempItems[10].locked = true

    const chosenItems = [
      { fpath: 'file1', basename: 'File 1', selected: false, locked: false, ext: 'jpg' },
      { fpath: 'file2', basename: 'File 2', selected: false, locked: false, ext: 'jpg' },
      { fpath: 'file10', basename: 'File 10', selected: false, locked: true, ext: 'jpg' }
    ]

    const result = nextNFromIndex(tempItems, chosenItems, 3, 'file10')

    console.log('123 result', result)

    expect(result).toHaveLength(3)
    expect(result).toEqual([
      { fpath: 'file11', basename: 'File 11', selected: false, locked: false, ext: 'jpg' },
      { fpath: 'file12', basename: 'File 12', selected: false, locked: false, ext: 'jpg' },
      { fpath: 'file13', basename: 'File 13', selected: false, locked: false, ext: 'jpg' }
    ])
  })

  it('should handle when there are not enough items', () => {
    const smallItemList = [
      { fpath: 'file1', basename: 'File 1', selected: false, locked: false, ext: 'jpg' }
    ]
    const chosenItems = [
      { fpath: 'file1', basename: 'File 1', selected: false, locked: false, ext: 'jpg' }
    ]

    const result = nextNFromIndex(smallItemList, chosenItems, 3, 'file1')
    expect(result).toHaveLength(1)
    expect(result).toEqual([
      { fpath: 'file1', basename: 'File 1', selected: false, locked: false, ext: 'jpg' }
    ])
  })
})

describe('randomChoice function', () => {
  it('should return next N random items', () => {
    const tempItems = baseItems.map((item) => ({ ...item }))

    tempItems[3].locked = true

    const blockedItems = [
      { fpath: 'file3', basename: 'File 3', selected: false, locked: false, ext: 'jpg' }
    ]

    for (let i = 0; i < 1000; i++) {
      const result = randomChoice(tempItems, blockedItems, 3)

      expect(result).toHaveLength(3)
      expect(result).not.toContain(blockedItems)
    }
  })

  it('should return next N random items #2', () => {
    const tempItems = baseItems.map((item) => ({ ...item }))

    tempItems[2].locked = true
    tempItems[3].locked = true

    const blockedItems = [
      { fpath: 'file2', basename: 'File 2', selected: false, locked: true, ext: 'jpg' },
      { fpath: 'file3', basename: 'File 3', selected: false, locked: true, ext: 'jpg' }
    ]

    for (let i = 0; i < 1000; i++) {
      const result = randomChoice(tempItems, blockedItems, 3)

      expect(result).toHaveLength(3)
      expect(result).not.toContain(blockedItems)
    }
  })
})
