/**
 * pagination.js 1.5.1
 * A jQuery plugin to provide simple yet fully customisable pagination.
 * @version 1.5.1
 * @author mss
 * @url https://github.com/Maxiaoxiang/jQuery-plugins
 *
 * @璋冪敤鏂规硶
 * $(selector).pagination(option, callback);
 * -姝ゅcallback鏄垵濮嬪寲璋冪敤锛宱ption閲岀殑callback鏄偣鍑婚〉鐮佸悗璋冪敤
 * 
 * -- example --
 * $(selector).pagination({
 *     ... // 閰嶇疆鍙傛暟
 *     callback: function(api) {
 *         console.log('鐐瑰嚮椤电爜璋冪敤璇ュ洖璋�'); //鍒囨崲椤电爜鏃舵墽琛屼竴娆″洖璋�
 *     }
 * }, function(){
 *     console.log('鍒濆鍖�'); //鎻掍欢鍒濆鍖栨椂璋冪敤璇ユ柟娉曪紝姣斿璇锋眰绗竴娆℃帴鍙ｆ潵鍒濆鍖栧垎椤甸厤缃�
 * });
 */
;
(function (factory) {
    if (typeof define === "function" && (define.amd || define.cmd) && !jQuery) {
        // AMD鎴朇MD
        define(["jquery"], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node/CommonJS
        module.exports = function (root, jQuery) {
            if (jQuery === undefined) {
                if (typeof window !== 'undefined') {
                    jQuery = require('jquery');
                } else {
                    jQuery = require('jquery')(root);
                }
            }
            factory(jQuery);
            return jQuery;
        };
    } else {
        //Browser globals
        factory(jQuery);
    }
}(function ($) {

    //閰嶇疆鍙傛暟
    var defaults = {
        totalData: 0, //鏁版嵁鎬绘潯鏁�
        showData: 0, //姣忛〉鏄剧ず鐨勬潯鏁�
        pageCount: 9, //鎬婚〉鏁�,榛樿涓�9
        current: 1, //褰撳墠绗嚑椤�
        prevCls: 'prev', //涓婁竴椤礳lass
        nextCls: 'next', //涓嬩竴椤礳lass
        prevContent: '<', //涓婁竴椤靛唴瀹�
        nextContent: '>', //涓嬩竴椤靛唴瀹�
        activeCls: 'active', //褰撳墠椤甸€変腑鐘舵€�
        coping: false, //棣栭〉鍜屽熬椤�
        isHide: false, //褰撳墠椤垫暟涓�0椤垫垨鑰�1椤垫椂涓嶆樉绀哄垎椤�
        homePage: '', //棣栭〉鑺傜偣鍐呭
        endPage: '', //灏鹃〉鑺傜偣鍐呭
        keepShowPN: false, //鏄惁涓€鐩存樉绀轰笂涓€椤典笅涓€椤�
        mode: 'unfixed', //鍒嗛〉妯″紡锛寀nfixed锛氫笉鍥哄畾椤电爜鏁伴噺锛宖ixed锛氬浐瀹氶〉鐮佹暟閲�
        count: 4, //mode涓簎nfixed鏃舵樉绀哄綋鍓嶉€変腑椤靛墠鍚庨〉鏁帮紝mode涓篺ixed鏄剧ず椤电爜鎬绘暟
        jump: false, //璺宠浆鍒版寚瀹氶〉鏁�
        jumpIptCls: 'jump-ipt', //鏂囨湰妗嗗唴瀹�
        jumpBtnCls: 'jump-btn', //璺宠浆鎸夐挳
        jumpBtn: '跳转', //璺宠浆鎸夐挳鏂囨湰
        callback: function () {} //鍥炶皟
    };

    var Pagination = function (element, options) {
        //鍏ㄥ眬鍙橀噺
        var opts = options, //閰嶇疆
            current, //褰撳墠椤�
            $document = $(document),
            $obj = $(element); //瀹瑰櫒

        /**
         * 璁剧疆鎬婚〉鏁�
         * @param {int} page 椤电爜
         * @return opts.pageCount 鎬婚〉鏁伴厤缃�
         */
        this.setPageCount = function (page) {
            return opts.pageCount = page;
        };

        /**
         * 鑾峰彇鎬婚〉鏁�
         * 濡傛灉閰嶇疆浜嗘€绘潯鏁板拰姣忛〉鏄剧ず鏉℃暟锛屽皢浼氳嚜鍔ㄨ绠楁€婚〉鏁板苟鐣ヨ繃鎬婚〉鏁伴厤缃紝鍙嶄箣
         * @return {int} 鎬婚〉鏁�
         */
        this.getPageCount = function () {
            return opts.totalData && opts.showData ? Math.ceil(parseInt(opts.totalData) / opts.showData) : opts.pageCount;
        };

        /**
         * 鑾峰彇褰撳墠椤�
         * @return {int} 褰撳墠椤电爜
         */
        this.getCurrent = function () {
            return current;
        };

        /**
         * 濉厖鏁版嵁
         * @param {int} 椤电爜
         */
        this.filling = function (index) {
            var html = '';
            current = parseInt(index) || parseInt(opts.current); //褰撳墠椤电爜
            var pageCount = this.getPageCount(); //鑾峰彇鐨勬€婚〉鏁�
            switch (opts.mode) { //閰嶇疆妯″紡
                case 'fixed': //鍥哄畾鎸夐挳妯″紡
                    html += '<a href="javascript:;" class="' + opts.prevCls + '">' + opts.prevContent + '</a>';
                    if (opts.coping) {
                        var home = opts.coping && opts.homePage ? opts.homePage : '1';
                        html += '<a href="javascript:;" data-page="1">' + home + '</a>';
                    }
                    var start = current > opts.count - 1 ? current + opts.count - 1 > pageCount ? current - (opts.count - (pageCount - current)) : current - 2 : 1;
                    var end = current + opts.count - 1 > pageCount ? pageCount : start + opts.count;
                    for (; start <= end; start++) {
                        if (start != current) {
                            html += '<a href="javascript:;" data-page="' + start + '">' + start + '</a>';
                        } else {
                            html += '<span class="' + opts.activeCls + '">' + start + '</span>';
                        }
                    }
                    if (opts.coping) {
                        var _end = opts.coping && opts.endPage ? opts.endPage : pageCount;
                        html += '<a href="javascript:;" data-page="' + pageCount + '">' + _end + '</a>';
                    }
                    html += '<a href="javascript:;" class="' + opts.nextCls + '">' + opts.nextContent + '</a>';
                    break;
                case 'unfixed': //涓嶅浐瀹氭寜閽ā寮�
                    if (opts.keepShowPN || current > 1) { //涓婁竴椤�
                        html += '<a href="javascript:;" class="' + opts.prevCls + '">' + opts.prevContent + '</a>';
                    } else {
                        if (opts.keepShowPN == false) {
                            $obj.find('.' + opts.prevCls) && $obj.find('.' + opts.prevCls).remove();
                        }
                    }
                    if (current >= opts.count + 2 && current != 1 && pageCount != opts.count) {
                        var home = opts.coping && opts.homePage ? opts.homePage : '1';
                        html += opts.coping ? '<a href="javascript:;" data-page="1">' + home + '</a><span>...</span>' : '';
                    }
                    var start = (current - opts.count) <= 1 ? 1 : (current - opts.count);
                    var end = (current + opts.count) >= pageCount ? pageCount : (current + opts.count);
                    for (; start <= end; start++) {
                        if (start <= pageCount && start >= 1) {
                            if (start != current) {
                                html += '<a href="javascript:;" data-page="' + start + '">' + start + '</a>';
                            } else {
                                html += '<span class="' + opts.activeCls + '">' + start + '</span>';
                            }
                        }
                    }
                    if (current + opts.count < pageCount && current >= 1 && pageCount > opts.count) {
                        var end = opts.coping && opts.endPage ? opts.endPage : pageCount;
                        html += opts.coping ? '<span>...</span><a href="javascript:;" data-page="' + pageCount + '">' + end + '</a>' : '';
                    }
                    if (opts.keepShowPN || current < pageCount) { //涓嬩竴椤�
                        html += '<a href="javascript:;" class="' + opts.nextCls + '">' + opts.nextContent + '</a>';
                    } else {
                        if (opts.keepShowPN == false) {
                            $obj.find('.' + opts.nextCls) && $obj.find('.' + opts.nextCls).remove();
                        }
                    }
                    break;
                case 'easy': //绠€鍗曟ā寮�
                    break;
                default:
            }
            html += opts.jump ? '<input type="text" class="' + opts.jumpIptCls + '"><a href="javascript:;" class="' + opts.jumpBtnCls + '">' + opts.jumpBtn + '</a>' : '';
            $obj.empty().html(html);
        };

        //缁戝畾浜嬩欢
        this.eventBind = function () {
            var that = this;
            var pageCount = that.getPageCount(); //鎬婚〉鏁�
            var index = 1;
            $obj.off().on('click', 'a', function () {
                if ($(this).hasClass(opts.nextCls)) {
                    if ($obj.find('.' + opts.activeCls).text() >= pageCount) {
                        $(this).addClass('disabled');
                        return false;
                    } else {
                        index = parseInt($obj.find('.' + opts.activeCls).text()) + 1;
                    }
                } else if ($(this).hasClass(opts.prevCls)) {
                    if ($obj.find('.' + opts.activeCls).text() <= 1) {
                        $(this).addClass('disabled');
                        return false;
                    } else {
                        index = parseInt($obj.find('.' + opts.activeCls).text()) - 1;
                    }
                } else if ($(this).hasClass(opts.jumpBtnCls)) {
                    if ($obj.find('.' + opts.jumpIptCls).val() !== '') {
                        index = parseInt($obj.find('.' + opts.jumpIptCls).val());
                    } else {
                        return;
                    }
                } else {
                    index = parseInt($(this).data('page'));
                }
                that.filling(index);
                typeof opts.callback === 'function' && opts.callback(that);
            });
            //杈撳叆璺宠浆鐨勯〉鐮�
            $obj.on('input propertychange', '.' + opts.jumpIptCls, function () {
                var $this = $(this);
                var val = $this.val();
                var reg = /[^\d]/g;
                if (reg.test(val)) $this.val(val.replace(reg, ''));
                (parseInt(val) > pageCount) && $this.val(pageCount);
                if (parseInt(val) === 0) $this.val(1); //鏈€灏忓€间负1
            });
            //鍥炶溅璺宠浆鎸囧畾椤电爜
            $document.keydown(function (e) {
                if (e.keyCode == 13 && $obj.find('.' + opts.jumpIptCls).val()) {
                    var index = parseInt($obj.find('.' + opts.jumpIptCls).val());
                    that.filling(index);
                    typeof opts.callback === 'function' && opts.callback(that);
                }
            });
        };

        //鍒濆鍖�
        this.init = function () {
            this.filling(opts.current);
            this.eventBind();
            if (opts.isHide && this.getPageCount() == '1' || this.getPageCount() == '0') {
                $obj.hide();
            } else {
                $obj.show();
            }
        };
        this.init();
    };

    $.fn.pagination = function (parameter, callback) {
        if (typeof parameter == 'function') { //閲嶈浇
            callback = parameter;
            parameter = {};
        } else {
            parameter = parameter || {};
            callback = callback || function () {};
        }
        var options = $.extend({}, defaults, parameter);
        return this.each(function () {
            var pagination = new Pagination(this, options);
            callback(pagination);
        });
    };

}));