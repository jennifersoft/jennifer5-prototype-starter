import { getDayjs, serverDateFormat } from "@common/base"
import "@module/util/legacy";

function wrapData(item) {
    return {
        key: item.key,
        writeId: item.writeId,
        writeTime: getDayjs(item.writeTime).format(serverDateFormat.longWithSec)
    }
}

export const mutations = {
    updateArticles: (state, payload) => {
        state.page = payload.data.page;
        state.totalCount = payload.data.totalCount;
        state.list = payload.data.list.map(item => Object.assign(wrapData(item), { title: item.title }));
        state.search = payload.search;
    },
    updateArticle: (state, data) => {
        data.article.writeTime = getDayjs(data.article.writeTime).format(serverDateFormat.longWithSec);
        state.article = data.article;
        state.files = data.files;
        state.comments = data.comments.map(item => Object.assign(wrapData(item), { content: item.content }));
    },
    updateComments: (state, data) => {
        state.comments = data.map(item => Object.assign(wrapData(item), { content: item.content }));
    }
};