;(function(window,undefined){
    window.App = {};
    /**
     * 常量定义
     */
    var ua = navigator.userAgent.toUpperCase(),callindex=0;
    // 当前环境是否为Android平台
    App.IS_ANDROID = ua.indexOf('ANDROID') != -1;
    // 当前环境是否为IOS平台
    App.IS_IOS = ua.indexOf('IPHONE OS') != -1;
    App.call = function(name) {
        // 获取传递给Native方法的参数
        var args = Array.prototype.slice.call(arguments, 1);
        var callback = '', item = null;
        // 遍历参数
        for(var i = 0, len = args.length; i < len; i++) {
            item = args[i];
            if(item === "undefined") {
                item = '';
            }
            // 如果参数是一个Function类型, 则将Function存储到window对象, 并将函数名传递给Native
            if(typeof (item) == 'function') {
                callback = name + 'Callback' + i;
                window[callback] = item;
                item = callback;
            }
            args[i] = item;
        }
        if(App.IS_ANDROID) {
            try {
                for(var i = 0, len = args.length; i < len; i++) {
                    args[i] = '\'' + args[i] + '\'';
                }
                eval('window.android.' + name + '(' + args.join(',') + ')');
            } catch(e) {
                console.log(e);
            }
        } else if(App.IS_IOS) {
            if(args.length) {
                args = '|' + args.join('|');
            }
            callindex++;
            location.href = '#ios:' + name + args + '|' + callindex;
        }
    };
}(window));
;(function(window,undefined){
    window.App = {};
    App.pageEvents = new Object();
    App.pageEvents.bindEvent = function(e){
        var node = $(e.target), evt;
        e.preventDefault();
        evt = node.attr("event");
        if(!evt){
            node = $(node.parent());
            evt = node.attr("event");
            if(!evt) return;
        }
        e.stopPropagation();
        if(evt.indexOf(e.type) === 0){
            var evtName = evt.split(":")[1];
            if(typeof App.pageEvents[evtName] === "function"){
                App.pageEvents[evt.split(":")[1]](node);
            }
        }
    }
    $(document).on("click input", App.pageEvents.bindEvent);
}(window));
