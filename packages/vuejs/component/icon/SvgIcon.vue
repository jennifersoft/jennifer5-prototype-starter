<template>
    <img
        v-if="iconType === ICON_TYPE.add"
        svg-inline
        class="icon"
        src="./svg/add.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.ajax"
        svg-inline
        class="icon"
        src="./svg/ajax.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.alignCenter"
        svg-inline
        class="icon"
        src="./svg/align-center.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.alignLeft"
        svg-inline
        class="icon"
        src="./svg/align-left.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.alignRight"
        svg-inline
        class="icon"
        src="./svg/align-right.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.arrowDropDown"
        svg-inline
        class="icon"
        src="./svg/arrow-drop-down.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.arrowDropUp"
        svg-inline
        class="icon"
        src="./svg/arrow-drop-up.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.associate"
        svg-inline
        class="icon"
        src="./svg/associate.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.bell"
        svg-inline
        class="icon"
        src="./svg/bell.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.bold"
        svg-inline
        class="icon"
        src="./svg/bold.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.browser"
        svg-inline
        class="icon"
        src="./svg/browser.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.build"
        svg-inline
        class="icon"
        src="./svg/build.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.caution"
        svg-inline
        class="icon"
        src="./svg/caution.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.caution2"
        svg-inline
        class="icon"
        src="./svg/caution-2.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.caution3"
        svg-inline
        class="icon"
        src="./svg/caution-3.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.chart"
        svg-inline
        class="icon"
        src="./svg/chart.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.check"
        svg-inline
        class="icon"
        src="./svg/check.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.chevronLeft"
        svg-inline
        class="icon"
        src="./svg/chevron-left.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.chevronRight"
        svg-inline
        class="icon"
        src="./svg/chevron-right.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.clip"
        svg-inline
        class="icon"
        src="./svg/clip.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.close"
        svg-inline
        class="icon"
        src="./svg/close.svg"
        :width="width"
        :height="height"
    />

    <img
        v-else-if="iconType === ICON_TYPE.dashboard"
        svg-inline
        class="icon"
        src="./svg/dashboard.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.edit"
        svg-inline
        class="icon"
        src="./svg/edit.svg"
        :width="width"
        :height="height"
    />

    <img
        v-else-if="iconType === ICON_TYPE.favoriteFill"
        svg-inline
        class="icon"
        src="./svg/favorite-fill.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.favoriteStroke"
        svg-inline
        class="icon"
        src="./svg/favorite-stroke.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.firstPage"
        svg-inline
        class="icon"
        src="./svg/first-page.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.globe"
        svg-inline
        class="icon"
        src="./svg/globe.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.help"
        svg-inline
        class="icon"
        src="./svg/help.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.help2"
        svg-inline
        class="icon"
        src="./svg/help-2.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.hierarchy"
        svg-inline
        class="icon"
        src="./svg/hierarchy.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.iframe"
        svg-inline
        class="icon"
        src="./svg/iframe.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.info"
        svg-inline
        class="icon"
        src="./svg/info.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.jenniferFront"
        svg-inline
        class="icon"
        src="./svg/jennifer-front.svg"
        :width="width"
        :height="height"
    />

    <img
        v-else-if="iconType === ICON_TYPE.lastPage"
        svg-inline
        class="icon"
        src="./svg/last-page.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.legendAlignBottom"
        svg-inline
        class="icon"
        src="./svg/legend-align-bottom.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.legendAlignLeft"
        svg-inline
        class="icon"
        src="./svg/legend-align-left.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.legendAlignRight"
        svg-inline
        class="icon"
        src="./svg/legend-align-right.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.legendAlignTop"
        svg-inline
        class="icon"
        src="./svg/legend-align-top.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.lineMerge"
        svg-inline
        class="icon"
        src="./svg/line-merge.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.lineSeparate"
        svg-inline
        class="icon"
        src="./svg/line-separate.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.lock"
        svg-inline
        class="icon"
        src="./svg/lock.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.hamburger"
        svg-inline
        class="icon"
        src="./svg/hamburger.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.moreHorizon"
        svg-inline
        class="icon"
        src="./svg/more-horiz.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.grid"
        svg-inline
        class="icon"
        src="./svg/grid.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.newWindow"
        svg-inline
        class="icon"
        src="./svg/new-window.svg"
        :width="width"
        :height="height"
    />

    <img
        v-else-if="iconType === ICON_TYPE.chartPieStroke"
        svg-inline
        class="icon"
        src="./svg/chart-pie-stroke.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.plugin"
        svg-inline
        class="icon"
        src="./svg/plugin.svg"
        :width="width"
        :height="height"
    />

    <img
        v-else-if="iconType === ICON_TYPE.realtime"
        svg-inline
        class="icon"
        src="./svg/realtime.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.refresh"
        svg-inline
        class="icon"
        src="./svg/refresh.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.report"
        svg-inline
        class="icon"
        src="./svg/report.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.report2"
        svg-inline
        class="icon"
        src="./svg/report-2.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.resource"
        svg-inline
        class="icon"
        src="./svg/resource.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.search"
        svg-inline
        class="icon"
        src="./svg/search.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.settings"
        svg-inline
        class="icon"
        src="./svg/settings.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.share2"
        svg-inline
        class="icon"
        src="./svg/share-2.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.ban"
        svg-inline
        class="icon"
        src="./svg/ban.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.text"
        svg-inline
        class="icon"
        src="./svg/text.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.textBox"
        svg-inline
        class="icon"
        src="./svg/textbox.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.textColor"
        svg-inline
        class="icon"
        src="./svg/textcolor.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.underline"
        svg-inline
        class="icon"
        src="./svg/underline.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.unfoldMore"
        svg-inline
        class="icon"
        src="./svg/unfold-more.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.user"
        svg-inline
        class="icon"
        src="./svg/user.svg"
        :width="width"
        :height="height"
    />

    <img
        v-else-if="iconType === ICON_TYPE.verticalAlignBottom"
        svg-inline
        class="icon"
        src="./svg/vertical-align-bottom.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.verticalAlignCenter"
        svg-inline
        class="icon"
        src="./svg/vertical-align-center.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.verticalAlignTop"
        svg-inline
        class="icon"
        src="./svg/vertical-align-top.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.cloud"
        svg-inline
        class="icon"
        src="./svg/cloud.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.layout3"
        svg-inline
        class="icon"
        src="./svg/layout-3.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.lineEach"
        svg-inline
        class="icon"
        src="./svg/line-each.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.script"
        svg-inline
        class="icon"
        src="./svg/script.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.column"
        svg-inline
        class="icon"
        src="./svg/column.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.connection"
        svg-inline
        class="icon"
        src="./svg/connection.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.db"
        svg-inline
        class="icon"
        src="./svg/db.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.filter"
        svg-inline
        class="icon"
        src="./svg/filter.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.happy"
        svg-inline
        class="icon"
        src="./svg/happy.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.happy2"
        svg-inline
        class="icon"
        src="./svg/happy-2.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.layout1"
        svg-inline
        class="icon"
        src="./svg/layout-1.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.layout2"
        svg-inline
        class="icon"
        src="./svg/layout-2.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.link"
        svg-inline
        class="icon"
        src="./svg/link.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.pause"
        svg-inline
        class="icon"
        src="./svg/pause.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.play"
        svg-inline
        class="icon"
        src="./svg/play.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.themes"
        svg-inline
        class="icon"
        src="./svg/themes.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.unhappy"
        svg-inline
        class="icon"
        src="./svg/unhappy.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.unhappy2"
        svg-inline
        class="icon"
        src="./svg/unhappy-2.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.unlink"
        svg-inline
        class="icon"
        src="./svg/unlink.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.calendar"
        svg-inline
        class="icon"
        src="./svg/calendar.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.inbox"
        svg-inline
        class="icon"
        src="./svg/inbox.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.indentDecrease"
        svg-inline
        class="icon"
        src="./svg/indent-decrease.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.indentIncrease"
        svg-inline
        class="icon"
        src="./svg/indent-increase.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.listBulleted"
        svg-inline
        class="icon"
        src="./svg/list-bulleted.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.remove"
        svg-inline
        class="icon"
        src="./svg/remove.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.return"
        svg-inline
        class="icon"
        src="./svg/return.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.screenshot"
        svg-inline
        class="icon"
        src="./svg/screenshot.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.textBox"
        svg-inline
        class="icon"
        src="./svg/textbox.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.textColor"
        svg-inline
        class="icon"
        src="./svg/textcolor.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.thumbUp"
        svg-inline
        class="icon"
        src="./svg/thumb-up.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.remove"
        svg-inline
        class="icon"
        src="./svg/remove.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.topology"
        svg-inline
        class="icon"
        src="./svg/topology.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.network"
        svg-inline
        class="icon"
        src="./svg/network.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.moreVertical"
        svg-inline
        class="icon"
        src="./svg/more-vert.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.mail"
        svg-inline
        class="icon"
        src="./svg/mail.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.allCheck"
        svg-inline
        class="icon"
        src="./svg/all-check.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.arrowDown"
        svg-inline
        class="icon"
        src="./svg/arrow-down.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.arrowLeft"
        svg-inline
        class="icon"
        src="./svg/arrow-left.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.arrowRight"
        svg-inline
        class="icon"
        src="./svg/arrow-right.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.arrowUp"
        svg-inline
        class="icon"
        src="./svg/arrow-up.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.trashcan"
        svg-inline
        class="icon"
        src="./svg/trashcan.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.eraser"
        svg-inline
        class="icon"
        src="./svg/eraser.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.eyeDropper"
        svg-inline
        class="icon"
        src="./svg/eyedropper.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.image"
        svg-inline
        class="icon"
        src="./svg/image.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.italic"
        svg-inline
        class="icon"
        src="./svg/italic.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.lineHeight"
        svg-inline
        class="icon"
        src="./svg/line-height.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.listNumbered"
        svg-inline
        class="icon"
        src="./svg/list-numbered.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.print"
        svg-inline
        class="icon"
        src="./svg/print.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.wireless"
        svg-inline
        class="icon"
        src="./svg/wireless.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.arrowBack"
        svg-inline
        class="icon"
        src="./svg/arrow-back.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.arrowDownward"
        svg-inline
        class="icon"
        src="./svg/arrow-downward.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.arrowForward"
        svg-inline
        class="icon"
        src="./svg/arrow-forward.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.arrowUpward"
        svg-inline
        class="icon"
        src="./svg/arrow-upward.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.cancel"
        svg-inline
        class="icon"
        src="./svg/cancel.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.code"
        svg-inline
        class="icon"
        src="./svg/code.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.feed"
        svg-inline
        class="icon"
        src="./svg/feed.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.fullScreen"
        svg-inline
        class="icon"
        src="./svg/fullscreen.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.fullScreenExit"
        svg-inline
        class="icon"
        src="./svg/fullscreen-exit.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.home"
        svg-inline
        class="icon"
        src="./svg/home.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.infoMessage"
        svg-inline
        class="icon"
        src="./svg/info-message.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.message"
        svg-inline
        class="icon"
        src="./svg/message.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.share"
        svg-inline
        class="icon"
        src="./svg/share.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.stopped"
        svg-inline
        class="icon"
        src="./svg/stopped.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.tool"
        svg-inline
        class="icon"
        src="./svg/tool.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.brush"
        svg-inline
        class="icon"
        src="./svg/brush.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.business"
        svg-inline
        class="icon"
        src="./svg/business.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.palette"
        svg-inline
        class="icon"
        src="./svg/palette.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.desktop"
        svg-inline
        class="icon"
        src="./svg/desktop.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.flow"
        svg-inline
        class="icon"
        src="./svg/flow.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.laptop"
        svg-inline
        class="icon"
        src="./svg/laptop.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.loveIt"
        svg-inline
        class="icon"
        src="./svg/loveit.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.loveItStroke"
        svg-inline
        class="icon"
        src="./svg/loveit-stroke.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.slider"
        svg-inline
        class="icon"
        src="./svg/slider.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.smaller"
        svg-inline
        class="icon"
        src="./svg/smaller.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.smartphone"
        svg-inline
        class="icon"
        src="./svg/smartphone.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.stop"
        svg-inline
        class="icon"
        src="./svg/stop.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.table"
        svg-inline
        class="icon"
        src="./svg/table.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.tableColumn"
        svg-inline
        class="icon"
        src="./svg/table-column.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.tablet"
        svg-inline
        class="icon"
        src="./svg/tablet.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.visibility"
        svg-inline
        class="icon"
        src="./svg/visibility.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.visibilityOff"
        svg-inline
        class="icon"
        src="./svg/visibility-off.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.zip"
        svg-inline
        class="icon"
        src="./svg/zip.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.arrowMore"
        svg-inline
        class="icon"
        src="./svg/arrow-more.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.backspace"
        svg-inline
        class="icon"
        src="./svg/backspace.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.chartArea"
        svg-inline
        class="icon"
        src="./svg/chart-area.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.chartBar"
        svg-inline
        class="icon"
        src="./svg/chart-bar.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.chartCandle"
        svg-inline
        class="icon"
        src="./svg/chart-candle.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.chartColumn"
        svg-inline
        class="icon"
        src="./svg/chart-column.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.chartEqualizer"
        svg-inline
        class="icon"
        src="./svg/chart-equalizer.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.chartGauge"
        svg-inline
        class="icon"
        src="./svg/chart-gauge.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.chartLine"
        svg-inline
        class="icon"
        src="./svg/chart-line.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.chartPie"
        svg-inline
        class="icon"
        src="./svg/chart-pie.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.chartRadar"
        svg-inline
        class="icon"
        src="./svg/chart-radar.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.chartScatter"
        svg-inline
        class="icon"
        src="./svg/chart-scatter.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.cube3d"
        svg-inline
        class="icon"
        src="./svg/cube-3d.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.cursorMove"
        svg-inline
        class="icon"
        src="./svg/cursor-move.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.cursorResize"
        svg-inline
        class="icon"
        src="./svg/cursor-n-resize.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.domainGroup"
        svg-inline
        class="icon"
        src="./svg/domain-group.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.domain"
        svg-inline
        class="icon"
        src="./svg/domain.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.expand"
        svg-inline
        class="icon"
        src="./svg/expand.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.export"
        svg-inline
        class="icon"
        src="./svg/export.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.gripHorizontal"
        svg-inline
        class="icon"
        src="./svg/grip-horizontal.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.gripResize"
        svg-inline
        class="icon"
        src="./svg/grip-resize.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.gripVertical"
        svg-inline
        class="icon"
        src="./svg/grip-vertical.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.hierarchyClose"
        svg-inline
        class="icon"
        src="./svg/hierarchy-close.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.hierarchyOpen"
        svg-inline
        class="icon"
        src="./svg/hierarchy-open.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.idea"
        svg-inline
        class="icon"
        src="./svg/idea.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.label"
        svg-inline
        class="icon"
        src="./svg/label.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.list"
        svg-inline
        class="icon"
        src="./svg/list.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.loading"
        svg-inline
        class="icon"
        src="./svg/loading.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.openNew"
        svg-inline
        class="icon"
        src="./svg/open-new.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.pen"
        svg-inline
        class="icon"
        src="./svg/pen.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.pin"
        svg-inline
        class="icon"
        src="./svg/pin.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.profile"
        svg-inline
        class="icon"
        src="./svg/profile.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.roundSquare"
        svg-inline
        class="icon"
        src="./svg/roundsquare.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.rule"
        svg-inline
        class="icon"
        src="./svg/rule.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.save"
        svg-inline
        class="icon"
        src="./svg/save.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.scissors"
        svg-inline
        class="icon"
        src="./svg/scissors.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.server"
        svg-inline
        class="icon"
        src="./svg/server.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.square"
        svg-inline
        class="icon"
        src="./svg/square.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.storage"
        svg-inline
        class="icon"
        src="./svg/storage.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.tag"
        svg-inline
        class="icon"
        src="./svg/tag.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.template"
        svg-inline
        class="icon"
        src="./svg/template.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.was"
        svg-inline
        class="icon"
        src="./svg/was.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.file"
        svg-inline
        class="icon"
        src="./svg/file.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.moveFiles"
        svg-inline
        class="icon"
        src="./svg/move-files.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.copy"
        svg-inline
        class="icon"
        src="./svg/copy.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.autoScaleUp"
        svg-inline
        class="icon"
        src="./svg/auto-scale-up.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.class"
        svg-inline
        class="icon"
        src="./svg/class.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.fileOpen"
        svg-inline
        class="icon"
        src="./svg/file-open.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.method"
        svg-inline
        class="icon"
        src="./svg/method.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.rollback"
        svg-inline
        class="icon"
        src="./svg/rollback.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.shrink"
        svg-inline
        class="icon"
        src="./svg/shrink.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.time"
        svg-inline
        class="icon"
        src="./svg/time.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.dragArea"
        svg-inline
        class="icon"
        src="./svg/drag-area.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.document"
        svg-inline
        class="icon"
        src="./svg/document.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.expandHorizontal"
        svg-inline
        class="icon"
        src="./svg/expand-horizontal.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.refresh2"
        svg-inline
        class="icon"
        src="./svg/refresh-2.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.chartXview"
        svg-inline
        class="icon"
        src="./svg/chart-xview.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.talk"
        svg-inline
        class="icon"
        src="./svg/talk.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.userDefinedDashboard"
        svg-inline
        class="icon"
        src="./svg/user-defined-dashboard.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.analysis"
        svg-inline
        class="icon"
        src="./svg/analysis.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.userStroke"
        svg-inline
        class="icon"
        src="./svg/user-stroke.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.soundOn"
        svg-inline
        class="icon"
        src="./svg/sound-on.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.soundOff"
        svg-inline
        class="icon"
        src="./svg/sound-off.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.xAxis"
        svg-inline
        class="icon"
        src="./svg/x-axis.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.yAxis"
        svg-inline
        class="icon"
        src="./svg/y-axis.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.gc"
        svg-inline
        class="icon"
        src="./svg/gc.svg"
        :width="width"
        :height="height"
    />
    <img
        v-else-if="iconType === ICON_TYPE.userDefinedDashboard2"
        svg-inline
        class="icon"
        src="./svg/user-defined-dashboard-2.svg"
        :width="width"
        :height="height"
    />
</template>
<script>
//컬러를 custom 하게 변경하기 위해 svg를 inline으로 로드후 css로 색깔일 지정한다.
//webpack.config.js -> vue-svg-inline-loader 참고.

//TODO svg-inline을 사용하기 위해 동적으로 src를 현재 받지 못한다. 이후에 개선 방법을 고민해야함.
import { ICON_TYPE } from '@vuejs/component/icon/iconType';

export default {
    name: 'svg-icon',
    component: {},
    props: {
        iconType: {
            type: String,
            required: true,
            default: '',
        },
        width: {
            type: Number,
            required: false,
            default: 24,
        },
        height: {
            type: Number,
            required: false,
            default: 24,
        },
    },
    data() {
        return {
            ICON_TYPE: ICON_TYPE,
        };
    },
    computed: {},
};
</script>
<style lang="scss" scoped>
svg {
    > path {
        fill: currentColor;
    }
}
</style>
