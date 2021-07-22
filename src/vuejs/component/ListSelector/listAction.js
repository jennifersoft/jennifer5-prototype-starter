export function selectedTailStyle(array) {
  return array.map((r, i) => {
    if (i === array.length - 1) {
      return {
        ...r,
        tailStyle: true,
      }
    }

    if (r.check === 'on' && array[i + 1].check !== 'on') {
      return {
        ...r,
        tailStyle: true,
      }
    }

    return {
      ...r,
      tailStyle: false,
    }
  })
}
