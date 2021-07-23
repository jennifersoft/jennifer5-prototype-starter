import $ from '@library/jquery';

const tooltips = [];

function createTooltipElement(position, text) {
    const elem = document.createElement('div');
    elem.setAttribute('class', 'tooltip vue-tooltip-theme');
    elem.setAttribute('role', 'tooltip');
    elem.setAttribute('aria-hidden', 'false');
    elem.innerHTML = `<div class="tooltip-inner">${text}</div>`;

    if (position.left !== undefined) {
        elem.setAttribute('x-placement', 'right');
        elem.setAttribute(
            'style',
            `position: absolute; will-change: transform; top: ${position.top}px; left: ${position.left}px;`
        );
    } else {
        elem.setAttribute('x-placement', 'left');
        elem.setAttribute(
            'style',
            `position: absolute; will-change: transform; top: ${position.top}px; right: ${position.right}px;`
        );
    }

    elem.innerHTML = `<div class="tooltip-inner">${text}</div>`;

    return elem;
}

function updateTooltipEvents(el, isBind) {
    el.removeEventListener('mouseover', el.onActiveTooltipEvent);
    el.removeEventListener('mouseout', el.onClearTooltipEvent);

    if (isBind) {
        el.addEventListener('mouseover', el.onActiveTooltipEvent);
        el.addEventListener('mouseout', el.onClearTooltipEvent);
    }
}

function bind(el, binding, vnode) {
    if (!binding.value.content) return;

    el.onActiveTooltipEvent = function() {
        const width = $(vnode.elm).outerWidth();
        const offset = $(vnode.elm).offset();

        const position = binding.value.tooltipOnLeft
            ? {
                  top: offset.top,
                  right: document.body.clientWidth - offset.left + 8,
              }
            : { top: offset.top, left: offset.left + width };
        const tooltip = createTooltipElement(position, binding.value.content);

        tooltips.push(tooltip);
        document.body.appendChild(tooltip);
    };

    el.onClearTooltipEvent = function() {
        while (tooltips.length > 0) {
            document.body.removeChild(tooltips.pop());
        }
    };

    if (binding.value.isScrolling) {
        for (const elm of tooltips) {
            elm.setAttribute('aria-hidden', 'true');
        }
    }

    updateTooltipEvents(el, true);
}

export default {
    bind: bind,
    update: bind,
    unbind: function(el) {
        updateTooltipEvents(el, false);
    },
};
