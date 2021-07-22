import { createTreeIndexes } from '@entry/popup/xviewAnalysis/utility';

export const createFullName = (index = '', names = [], map = {}) => {
    const tokens = index.split('.');
    tokens.pop();

    const newIndex = tokens.join('.');
    const parentName = map[newIndex];

    if (parentName !== undefined) names.push(parentName);
    if (newIndex === '') return names.reverse().join(' > ');

    return createFullName(newIndex, names, map);
};

export const createNameMap = domainTree => {
    const treeMap = {};
    domainTree.forEach(item => {
        treeMap[item.index] = item.title;
    });
    return treeMap;
};

export const createDomainListWithTreeIndex = (
    useDomainGroup,
    domainGroupTree,
    domainList
) => {
    const domainIdMap = {};

    domainGroupTree
        .filter(item => item.sid !== -1)
        .forEach(item => {
            domainIdMap[item.sid] = item.index;
        });

    return domainList.map(item => {
        const treeIndex = domainIdMap[item.sid];
        if (treeIndex && useDomainGroup) {
            const tokens = treeIndex.split('.');
            tokens.pop();
            return {
                parentIndex: tokens.join('.'),
                ...item,
            };
        } else {
            return {
                parentIndex: null,
                ...item,
            };
        }
    });
};

export const createDomainListInGroup = (
    useDomainGroup,
    domainGroupTree,
    domainList
) => {
    const domainListWithTreeIndex = createDomainListWithTreeIndex(
        useDomainGroup,
        domainGroupTree,
        domainList
    );

    return [
        ...domainGroupTree
            .filter(item => item.sid === -1)
            .map(item => {
                const domainList = domainListWithTreeIndex.filter(
                    domain => domain.parentIndex === item.index
                );

                const nameMap = createNameMap(domainGroupTree);
                const name = nameMap[item.index];
                const tokens = item.index.split('.');
                tokens.pop();

                return {
                    fullName: createFullName(item.index, [name], nameMap),
                    simpleName: name,
                    parent: tokens.length === 0 ? null : tokens.join('.'),
                    key: item.index,
                    domainList,
                };
            }),
        {
            isUnknown: true,
            domainList: domainListWithTreeIndex.filter(
                domain => domain.parentIndex === null
            ),
        },
    ];
};

export const initializeTreeNodes = domainGroupTree => {
    return domainGroupTree.map(node => {
        const tokens = node.index.split('.');
        tokens.pop();

        return {
            key: node.index,
            label: node.title,
            parent: tokens.length === 0 ? null : tokens.join('.'),
            sid: node.sid,
        };
    });
};

export const reloadTreeNodes = nodes => {
    const nodeMap = {};
    const newNodes = [];
    let rootSeq = 0;

    nodes.forEach(data => {
        let index = null;

        // 루트 노드일 경우에만 처리
        if (data.parent === null) {
            index = `${rootSeq}`;
            rootSeq += 1;
        }

        const newNode = {
            parent: data.parent,
            sid: data.sid,
            label: data.label,
            key: data.key,
            index,
            children: [],
        };

        newNodes.push(newNode);
        nodeMap[data.key] = newNode;
    });

    newNodes.forEach(row => {
        const parent = nodeMap[row.parent];
        if (parent) parent.children.push(row);
    });

    const rootNodes = newNodes.filter(data => data.index !== null);
    rootNodes.forEach(node => {
        createTreeIndexes(node, node.index);
    });

    return newNodes;
};

export const parentDepth = node => {
    return node.index.split('.').length - 1;
};

export const childrenDepth = (node, depth = 0) => {
    const children = node.children;
    if (children.length > 0) {
        for (let i = 0; i < children.length; i++) {
            return childrenDepth(children[i], depth + 1);
        }
    }
    return depth;
};
