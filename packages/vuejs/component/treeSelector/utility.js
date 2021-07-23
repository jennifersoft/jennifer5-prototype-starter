function getDepth(cache, key, depth = 0) {
    const parent = cache[key]?.parent;

    if (parent !== null) return getDepth(cache, parent, depth + 1);
    return depth;
}

function isFold(cache, key) {
    const parent = cache[key].parent;
    if (parent !== null) {
        return cache[parent].data.fold || isFold(cache, parent);
    }
    return false;
}

// NOTICE: 최상위 parent가 존재하지 않을 시 무한재귀에 빠짐. 예외처리 필요하다
function isParent(cache, node, parentKey) {
    if (node.parent !== null) {
        if (node.parent == parentKey) return true;
        else return isParent(cache, cache[node.parent], parentKey);
    }
    return false;
}

function wrapRenderingData(data) {
    return {
        key: data.key,
        label: data.label,
        fold: data.fold,
        check: data.check,
        disable: data.disable,
        icon: data.icon,
        depth: 0,
        leaf: true,
    };
}

function reloadTreeData(cache, newData) {
    let rootData = newData.filter(data => !cache[data.key].parent);
    let childData = newData.filter(data => cache[data.key].parent);

    while (childData.length > 0) {
        const data = childData.pop();
        const parent = cache[data.key].parent;
        const index = rootData.findIndex(data => data.key === parent);

        if (index !== -1) {
            rootData = [
                ...rootData.slice(0, index + 1),
                data,
                ...rootData.slice(index + 1, rootData.length),
            ];
        } else {
            childData = [data, ...childData];
        }
    }

    return rootData;
}

export const convertRenderingData = originData => {
    const cache = {};
    const parentSet = new Set();

    // 1. 새로운 데이터 타입 생성 및 캐시에 추가
    const newData = originData.map(data => {
        const json = wrapRenderingData(data);

        // 1-1. 데이터 캐시하기
        cache[data.key] = {
            parent: data.parent,
            data: json,
        };

        // 1-2. 부모가 있는 데이터 캐시하기
        if (data.parent !== null) {
            parentSet.add(data.parent);
        }

        return json;
    });

    // 2. 부모/자식 순서로 배열 순서 변경하기
    let rootData = reloadTreeData(cache, newData);

    // 3. depth 및 leaf 프로퍼티 변경하기
    const result = rootData.map(data => {
        return {
            ...data,
            depth: getDepth(cache, data.key),
            leaf: !parentSet.has(data.key),
        };
    });

    // 4. 부모 노드 중 하나라도 접혀있으면 처리하기
    return result.filter(data => !isFold(cache, data.key));
};

export const getChildKeys = (parentKey, data) => {
    const cache = {};
    data.forEach(node => {
        cache[node.key] = node;
    });

    return data
        .filter(node => isParent(cache, node, parentKey) === true)
        .map(node => node.key);
};
