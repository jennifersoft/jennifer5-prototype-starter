const PADDING_IN_COMPONENT = 4;

//제공되는 대시보드는 모두 origin, extend값이 있다. 사용자 정의 대시보드는 바로 바로 데이터를 꺼내온다.
export const positionAndSizeStyle = option => {
    return option
        ? {
              'z-index': option.zIndex ?? 'auto',
              left: `calc(${option.startx}% + ${PADDING_IN_COMPONENT}px)`,
              top: `calc(${option.starty}% + ${PADDING_IN_COMPONENT}px)`,
              width: `calc(${option.endx -
                  option.startx}% - ${PADDING_IN_COMPONENT * 2}px)`,
              height: `calc(${option.endy -
                  option.starty}% - ${PADDING_IN_COMPONENT * 2}px)`,
          }
        : {
              display: 'none',
          };
};

export const positionWithLeftNTop = (rawPosition, widthNHeight) => {
    const leftOrRight =
        rawPosition.x + widthNHeight.width > window.innerWidth
            ? {
                  right:
                      window.innerWidth -
                      rawPosition.x +
                      widthNHeight.width +
                      'px',
              }
            : { left: rawPosition.x + 'px' };
    const topOrBottom =
        rawPosition.y + widthNHeight.height > window.innerHeight
            ? {
                  bottom:
                      window.innerHeight -
                      rawPosition.y +
                      widthNHeight.height +
                      'px',
              }
            : { top: rawPosition.y + 'px' };

    return Object.assign({}, leftOrRight, topOrBottom);
};
