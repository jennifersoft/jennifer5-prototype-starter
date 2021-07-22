const UNIT_STRING = ['', 'K', 'M', 'G'];

String.prototype.toLocaleForAries = function() {
    return Number(this).toLocaleForAries();
};

Number.prototype.format = function() {
    if (this == 0) return 0;

    var reg = /(^[+-]?\d+)(\d{3})/;
    var n = this + '';

    while (reg.test(n)) n = n.replace(reg, '$1' + ',' + '$2');

    return n;
};

Number.prototype.toLocaleForAries = function() {
    return this.toShortForAries().toLocaleString();
};

Number.prototype.toShortForAries = function() {
    if (isNaN(this)) {
        return 0;
    }

    if (this < 100) {
        var value = parseInt(this * 100) / 100;
        return value;
    } else {
        return parseInt(this);
    }
};

Number.prototype.fillZero = function(val) {
    return this.toString().fillZero(val);
};

Number.prototype.toUnitString = function(base) {
    base = base || 1000;

    var originValue = this;
    var value = this;
    var len = base.toLocaleForAries().length;

    // 기본 숫자 가 base 보다 작으면 기존 로직 그대로 출력
    if (value < base) {
        return (Math.round(value * 100) / 100).toLocaleForAries();
    }

    originValue = value;
    value = Math.round(originValue) / base;

    // base 로 나눈 몫이 base 보다 작을 때
    if (value < base) {
        // base 랑 같은 등급이면 그대로 살려주자.
        if (originValue.toLocaleForAries().length == len) {
            return (Math.round(originValue * 100) / 100).toLocaleForAries();
        }

        return Math.round(value * 100) / 100 + UNIT_STRING[1];
    }

    originValue = value;
    value = Math.round(originValue) / base;

    // base 로 나눈 몫이 base 보다 작을 때
    if (value < base) {
        // base 랑 같은 등급이면 그대로 살려주자.
        if (originValue.toLocaleForAries().length == len) {
            return (
                (Math.round(originValue * 100) / 100).toLocaleForAries() +
                UNIT_STRING[1]
            );
        }

        return Math.round(value * 100) / 100 + UNIT_STRING[2];
    }

    originValue = value;
    value = Math.round(originValue) / base;

    // base 로 나눈 몫이 base 보다 작을 때
    if (value < base) {
        // base 랑 같은 등급이면 그대로 살려주자.
        if (originValue.toLocaleForAries().length == len) {
            return (
                (Math.round(originValue * 100) / 100).toLocaleForAries() +
                UNIT_STRING[2]
            );
        }

        return Math.round(value * 100) / 100 + UNIT_STRING[3];
    }

    return originValue.toLocaleForAries();
};

if (typeof TextDecoder === 'undefined') {
    DataView.prototype.getString = function(byteOffset, length) {
        var strView = new Uint8Array(this.buffer, byteOffset, length);
        var encodedString = String.fromCharCode.apply(null, strView); //FIXME: 문자열변환 메모리 릭 발생, 일단은 다른 문자열로 대체함.
        return encodedString;
    };
} else {
    const td = new TextDecoder('utf-8');
    DataView.prototype.getString = function(byteOffset, length) {
        var strView = new Uint8Array(this.buffer, byteOffset, length);
        return td.decode(strView);
    };
}
