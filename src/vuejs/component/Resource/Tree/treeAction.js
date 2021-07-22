export function getRow(rowId, array) {
  const rowIndex = array.findIndex(r => r.rowId === rowId)
  const row = array[rowIndex]
  return {
    rowIndex,
    row,
  }
}

export function isUnder(selfTreeIndex, parentTreeIndex) {
  if (parentTreeIndex === '') {
    return false
  }
  return selfTreeIndex.indexOf(parentTreeIndex + '.') === 0
}

export function hasChildren(rowTreeIndex, array) {
  return !!array.find(a => isUnder(a.treeIndex, rowTreeIndex))
}

export function getAllChildren(rowTreeIndex, array) {
  return array.filter(a => isUnder(a.treeIndex, rowTreeIndex))
}

export function getAllParents(rowTreeIndex, array) {
  return array.filter(a => isUnder(rowTreeIndex, a.treeIndex))
}

export function getAllSiblings(rowTreeIndex, array) {
  return array.filter(a =>
    isUnder(a.treeIndex, getParentTreeIndex(rowTreeIndex)),
  )
}

export function getDepth(treeIndex) {
  return treeIndex.split('.').length - 1
}

export function getParentTreeIndex(rowTreeIndex) {
  if (rowTreeIndex.indexOf('.') === -1) {
    return ''
  }
  return rowTreeIndex
    .split('.')
    .slice(0, -1)
    .join('.')
}

export function normalizeFold(array) {
  return array.map(a => {
    return {
      ...a,
      fold: hasChildren(a.treeIndex, array) ? 'open' : 'no-fold',
    }
  })
}

export function normalizeOidConfigResponse(
  array,
  resourceType,
  allCheck = true,
) {
  /**
   * oid가 -1: domain, 그외: business
   *
   */
  const m = array.map((a, i) => {
    return {
      rowId: `row-key-${i}`,
      indent: a.treeIndex.split('.').length - 1,
      label: a.shortName,
      resourceType: a.oid === -1 ? 'domain' : resourceType,
      check: allCheck ? 'on' : 'off',
      disabled: !a.existData,
      showWarningIcon: false,
      treeIndex: a.treeIndex,
      data: a,
    }
  })

  return normalizeFold(m)
}

export function _parentCheck(array, { treeIndex, check }) {
  return array.map(r => {
    if (r.treeIndex === treeIndex || isUnder(r.treeIndex, treeIndex)) {
      return {
        ...r,
        check,
      }
    }
    return r
  })
}

export function _childCheck(array, { treeIndex, check }) {
  const selfCheckedArray = array.map(r => {
    if (r.treeIndex === treeIndex) {
      return {
        ...r,
        check,
      }
    }
    return r
  })

  if (check === 'off') {
    return selfCheckedArray.map(r => {
      if (isUnder(treeIndex, r.treeIndex)) {
        return {
          ...r,
          check,
        }
      }
      return r
    })
  } else if (check === 'on') {
    const parentTreeIndex = getParentTreeIndex(treeIndex)
    if (parentTreeIndex === '') {
      return selfCheckedArray
    }

    for (const r of selfCheckedArray) {
      if (isUnder(r.treeIndex, parentTreeIndex)) {
        if (r.check !== 'on') {
          return selfCheckedArray
        }
      }
    }
    return _childCheck(selfCheckedArray, { treeIndex: parentTreeIndex, check })
  }
  throw new Error('you should not be here')
}

export function cleanCheck(array, dispatch) {
  return _childCheck(_parentCheck(array, dispatch), dispatch)
}

export function checkAll(array) {
  return array.map(a => {
    return {
      ...a,
      check: 'on',
    }
  })
}

export function uncheckAll(array) {
  return array.map(a => {
    return {
      ...a,
      check: 'off',
    }
  })
}
