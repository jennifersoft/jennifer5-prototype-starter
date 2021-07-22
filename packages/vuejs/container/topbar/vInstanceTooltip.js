import $ from '@library/jquery';

const tooltips = [];
const styles = [
    'position: absolute',
    'z-index: 6000',
    'font-size: 11px',
    'padding: 4px 8px',
    'border-radius: 3px',
    'visibility: visible',
    'transform: translate(-50%, 0)',
];

function createTooltipElement(
    position,
    bgColor = 'rgba(0, 0, 0, 0.75)',
    color = '#fff',
    text
) {
    const elem = document.createElement('div');
    elem.setAttribute('class', 'vue-tooltip-theme');
    elem.setAttribute('role', 'tooltip');
    elem.setAttribute('aria-hidden', 'false');
    elem.innerHTML = `  <div class="tooltip-inner">${text}</div>`;

    const stylesProps = [
        'will-change: transform',
        'width:max-content',
        `background: ${bgColor}`,
        `color: ${color}`,
        `top: ${position.top}px`,
        `left: ${position.left}px`,
    ];

    elem.setAttribute(
        'style',
        styles.join(';') + ';' + stylesProps.join(';') + ';'
    );

    elem.innerHTML = ` <div class="tooltip-arrow" style="top: 6px;"></div> <div class="tooltip-inner">${text}</div>`;

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
    if (
        binding.value.content === undefined ||
        binding.value.content?.trim() === 'Supported' ||
        binding.value.content?.trim() === ''
    ) {
        updateTooltipEvents(el, false);
        return;
    }

    el.onActiveTooltipEvent = function() {
        const width = $(vnode.elm).outerWidth();
        const height = $(vnode.elm).outerHeight();
        const tooltipHeight = 24;
        const offset = $(vnode.elm).offset();

        const position = {
            left: offset.left + width * 0.5,
        };

        const positionProps = binding.value.position || 'top-center';
        const offsetProps = binding.value.offset || 6;
        if (positionProps.split('-')[0] === 'top')
            position.top = offset.top - (tooltipHeight + offsetProps);
        if (positionProps.split('-')[0] === 'bottom')
            position.top = offset.top + (height + offsetProps);

        const tooltip = createTooltipElement(
            position,
            binding.value.bgColor,
            binding.value.color,
            binding.value.content
        );

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
    //http://issue.jennifersoft.com/browse/ARIES-10098 update 발생시 중복발생.
    // update: bind,
    unbind: function(el) {
        updateTooltipEvents(el, false);
    },
};
