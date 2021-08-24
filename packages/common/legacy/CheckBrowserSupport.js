
export function checkTablet () {
    return /iPhone|iPod|iPad|Android/i.test(navigator.userAgent);
}

export function enabledShadow() {
    if (checkTablet()) {
        return false;
    }

    //instance 가 많을 때 shadow 는 canvas 성능저하를 가지고 옴.
    return true;
}


export const BrowserSupport = {
    isEdge : navigator.userAgent.indexOf('Edge/') > 0
}