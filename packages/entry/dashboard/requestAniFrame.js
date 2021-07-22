// TODO: 좋은 방법은 아닌듯 한데, 차후에 개선하자.
import {
    cancelAniFrame,
    globalRequestAniFrameStatus,
    requestAniFrame,
} from '@module/common/RequestAniFrame';

window.requestAniFrame = requestAniFrame;
window.cancelAniFrame = cancelAniFrame;
window.globalRequestAniFrameStatus = globalRequestAniFrameStatus;
