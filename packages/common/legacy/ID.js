import {OTypeDef} from "@common/definition";

// domain, agent, business 를 관리하기 위한  ID 클래스
class ID {
    constructor(sid, otype, oid) {
        if (arguments.length == 1) {
            this.sid = +(sid || 0);
            this.otype = OTypeDef.SYSTEM;
            this.oid = 0;
        } else if (arguments.length == 3) {
            this.sid = +(sid || 0);
            this.otype = +(otype || 0);
            this.oid = +(oid || 0);
        }

        this.sid = this.sid || 0;
        this.otype = this.otype || 0;
        this.oid = this.oid || 0;
    }

    getSid() {
        return this.sid;
    }

    getOtype() {
        return this.otype;
    }

    getOid () {
        return this.oid;
    }

    toString () {
        return ['', this.sid, this.otype, this.oid ].join('/');
    }

    static domain (sid) {
        return new ID(sid).toString();
    }

    static agent (sid, oid) {
        if (this.hasStringId(oid)) return oid;

        return new ID(sid, OTypeDef.SYSTEM, oid).toString();
    }

    static business (sid, oid) {
        if (this.hasStringId(oid)) return oid;

        return new ID(sid, OTypeDef.BUSINESS, oid).toString();
    }

    static parse (id) {
        var arr = id.split("/");
        return new ID(arr[1], arr[2], arr[3]);
    }

// 도메인 인지 체크하기
    static isDomain (id) {
        var obj = this.parse(id);

        return obj.sid && obj.otype == OTypeDef.SYSTEM && obj.oid == 0;
    }

    static hasStringId (id) {
        return typeof id == 'string' && id.indexOf("/") == 0;
    }
}

export {ID};