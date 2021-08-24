import $ from "jquery"

var Exporter = {


    /**
     * // 게시판 내보내기
     *
     * Exporter.board({
     *      title : '',
     *      description : ''
     * }, callback); 
     *
     * @param obj
     * @param callback
     */
    board: function (obj, callback) {
        var param = {
            title : obj.title || "",
            key : obj.key || "",
            description : obj.description || "",
            writeTime: obj.writeTime || 0,
            files : JSON.stringify(obj.files || [])
        };

        $.post('/report/board/save', param, function (data) {
            if (typeof callback == 'function') {
                callback(data.article);
            }
        });
    },

    // 캔버스 이미지를 게시판에 내보내기 (레티나디스플레이 적용)
    canvas : function (dataURL, obj, callback) {
        var file = this.convertDataURLToBlob(dataURL, "image/png");

        // 파일 이름 지정

        file.fileName = obj.fileName;
        Exporter.upload(file, function (fileData) {

            fileData.width = obj.width;
            fileData.height = obj.height;

            obj.files = [fileData];
            Exporter.board(obj, callback);
        });
    },

    convertDataURLToBlob : function (dataurl, mimetype) {
        var png = dataurl.split(',')[1];

        var binary = window.atob(png);
        var byteStringLength = binary.length,
            arrayBuffer = new ArrayBuffer(byteStringLength),
            intArray = new Uint8Array(arrayBuffer);

        for (var i = 0; i < byteStringLength; i++) {
            intArray[i] = binary.charCodeAt(i);
        }

        return new Blob([intArray],  {type: mimetype || 'image/png', encoding: 'utf-8'});
    },

    // 작은 텍스트 보내기
    text : function (title, description, callback) {
      Exporter.board({
          title: title,
          description: description
      }, callback);
    },

    // blob 파일 만들기
    toBlob: function (data, type) {
        return new Blob([data], { type : type || 'text/plain' });
    },

    toHTML : function (data) {
        return Exporter.toBlob(data, 'text/html');
    },

    // 들어온 파일을 업로드한다.
    upload : function (file, callback, file_progress) {
        var formData = new FormData();
        formData.append("file", file, file.fileName);

        $.ajax({
            url: "/report/board/upload",
            type: "POST",
            data: formData,
            processData: false,
            contentType: false,
            dataType:"JSON",
            xhr: function() {
                var myXhr = $.ajaxSettings.xhr();
                if (file_progress) {
                    if(myXhr.upload){
                        myXhr.upload.addEventListener('progress',function (event) {
                            file_progress(event.loaded/event.total);
                        }, false);
                    }
                }

                return myXhr;
            },
            success: function (data) {
                if (typeof callback == 'function') {
                    callback(data);
                }
            },
            resetForm: true
        });
    }

}

export {Exporter};