//이곳에 custom-directive 를 등록하고 각각의 컴포넌트에서 import 해서 사용한다.
//sample : https://alligator.io/vuejs/custom-directives/

/**
 * @author david
 * outside dom을 클릭했을대 레이어를 닫기위한 목적으로 생성함.
 * https://stackoverflow.com/questions/36170425/detect-click-outside-element
 * @type {{bind: clickOutside.bind, unbind: clickOutside.unbind}}
 */
export default {
    bind: function (el, binding, vnode) {
        el.clickOutsideEvent = function (event) {
            // here I check that click was outside the el and his childrens
            if (!(el === event.target || el.contains(event.target))) {
                // and if it did, call method provided in attribute value
                vnode.context[binding.expression](event);
            }
        };
        document.body.addEventListener('click', el.clickOutsideEvent)
    },
    unbind: function (el) {
        document.body.removeEventListener('click', el.clickOutsideEvent)
    }
}