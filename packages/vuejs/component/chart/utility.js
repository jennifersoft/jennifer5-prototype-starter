export const createTreeIndexes = (root, index) => {
    root.index = index;

    root.children.forEach((row, seq) => {
        const childIndex = index + '.' + seq;
        row.index = childIndex;

        if (root.children.length > 0) createTreeIndexes(row, childIndex);
    });
};
