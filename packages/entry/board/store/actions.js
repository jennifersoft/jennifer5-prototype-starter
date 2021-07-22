import $ from "@library/jquery";

export const actions = {
    loadFirstArticle({ commit }) {
        return new Promise((resolve, reject) => {
            $.ajax({
                method: "GET",
                url: "/report/board/first",
                success: (data) => {
                    resolve(data);
                },
                error: () => {
                    reject();
                }
            });
        });
    },
    loadArticles({ commit }, payload) {
        return new Promise((resolve, reject) => {
            $.ajax({
                method: "GET",
                url: `/report/board/${payload.page}/${payload.key}`,
                success: (data) => {
                    commit("updateArticles", { search: "", data: data });
                    if (data.article && data.files && data.comments)
                        commit("updateArticle", data);
                    resolve(data);
                },
                error: () => {
                    reject();
                }
            });
        });
    },
    deleteArticle({}, key) {
        return new Promise((resolve, reject) => {
            $.ajax({
                method: "POST",
                url: "/report/board/delete",
                data: {
                    key: key
                },
                success: (res) => {
                    resolve(res);
                },
                error: () => {
                    reject();
                }
            });
        });
    },
    saveArticle({ commit }, payload) {
        return new Promise((resolve, reject) => {
            const res = $.ajax({
                method: "POST",
                url: "/report/board/save",
                data: payload,
                success: (data) => {
                    if (data.article && data.files && data.comments)
                        commit("updateArticle", data);
                    resolve(data);
                },
                error: () => {
                    reject();
                }
            });

            if (res.statusText === 'canceled')
                reject('xss');
        });
    },
    searchArticles({ commit }, payload) {
        return new Promise((resolve, reject) => {
            $.ajax({
                method: "GET",
                url: `/report/board/search/${payload.page}/${payload.key}`,
                data: {
                    search: payload.search
                },
                success: (data) => {
                    commit("updateArticles", { search: payload.search, data: data });
                    if (data.article && data.files)
                        commit("updateArticle", data);
                    resolve(data);
                },
                error: () => {
                    reject();
                }
            });
        });
    },
    saveComment({ commit }, payload) {
        return new Promise((resolve, reject) => {
            $.ajax({
                method: "POST",
                url: `/report/comment/save`,
                data: {
                    location: payload.articleKey,
                    content: payload.content
                },
                success: (data) => {
                    commit("updateComments", data);
                    resolve();
                },
                error: () => {
                    reject();
                }
            });
        });
    },
    deleteComment({ commit }, payload) {
        return new Promise((resolve, reject) => {
            $.ajax({
                method: "POST",
                url: `/report/comment/delete`,
                data: {
                    location: payload.articleKey,
                    key: payload.key
                },
                success: (data) => {
                    commit("updateComments", data);
                    resolve();
                },
                error: () => {
                    reject();
                }
            });
        });
    },
    uploadFile({ commit }, file) {
        const formData = new FormData();
        formData.append("file", file);

        return new Promise((resolve, reject) => {
            // 파일 고유키가 타임스탬프라 딜레이를 안 주면 겹칠 수 있음.
            setTimeout(() => {
                $.ajax({
                    url: "/report/board/upload",
                    type: "POST",
                    data: formData,
                    processData: false,
                    contentType: false,
                    dataType: "JSON",
                    success: function(key) {
                        resolve(key);
                    },
                    error: function() {
                        reject();
                    },
                    resetForm: true
                });
            }, 500);
        });
    },
    deleteFiles({ commit }, fileKeys) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: "/report/board/delete_file",
                type: "POST",
                data: {
                    file_list: fileKeys.join(",")
                },
                success: function(res) {
                    resolve(res.result == "true");
                },
                error: function() {
                    reject();
                }
            });
        });
    },
    changeFavorite({ commit }, isActive) {
        return new Promise((resolve, reject) => {
            if (isActive) {
                $.get("/user/bookmark/remove", {
                    uri: location.pathname
                }, function(res) {
                    resolve(res);
                });
            } else {
                $.get("/user/bookmark/add", {
                    uri: location.pathname
                }, function(res) {
                    resolve(res);
                });
            }
        });
    }
}