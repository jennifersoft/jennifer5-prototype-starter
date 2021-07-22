import _ from 'lodash';

(function() {
    _.templateSettings = {
        interpolate: /\<\!\=(.+?)\!\>/gim,
        evaluate: /\<\!([\s\S]+?)\!\>/gim,
        escape: /\<\!\-(.+?)\!\>/gim
    };
})();

export default _;