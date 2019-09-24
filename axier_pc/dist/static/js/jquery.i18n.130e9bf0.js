/*!
 * jQuery i18n Plugin v1.0.0
 * https://github.com/ZOMAKE/jquery.i18n
 *
 * Copyright 2017 ZOMAKE,Inc.
 * Released under the Apache Licence 2.0
 */

(function($) {
    $.fn.extend({
        i18n: function(options) {
            var defaults = {
                lang: "",
                defaultLang: "",
                filePath: "/i18n/",
                filePrefix: "i18n_",
                fileSuffix: "",
                forever: true,
                callback: function() {}
            };

            function getCookie(name) {
                var arr = document.cookie.split('; ');
                for (var i = 0; i < arr.length; i++) {
                    var arr1 = arr[i].split('=');
                    if (arr1[0] == name) {
                        return arr1[1];
                    }
                }
                return '';
            };

            function setCookie(name, value, myDay) {
                var oDate = new Date();
                oDate.setDate(oDate.getDate() + myDay);
                document.cookie = name + '=' + value + '; expires=' + oDate;
            };

            var options = $.extend(defaults, options);

            if (getCookie('i18n_lang') != "" && getCookie('i18n_lang') != "undefined" && getCookie('i18n_lang') != null) {
                defaults.defaultLang = getCookie('i18n_lang');
            } else if (options.lang == "" && defaults.defaultLang == "") {
                throw "defaultLang must not be null !";
            };

            if (options.lang != null && options.lang != "") {
                if (options.forever) {
                    setCookie('i18n_lang', options.lang);
                } else {
                    $.removeCookie("i18n_lang");
                }
            } else {
                options.lang = defaults.defaultLang;
            };

            var i = this;
            $.getJSON(options.filePath + options.filePrefix + options.fileSuffix + ".json", function(data) {
              // console.log(eval('i18nLang.'+$(this).attr("data-i18n")))
                var i18nLang = {};
                if (data != null) {
                    i18nLang = data;
                }
                $(i).each(function(i) {
                    var i18nOnly = $(this).attr("data-i18n-only");
                      // if ($(this).val() != null && $(this).val() != "") {
                        if (i18nOnly == null || i18nOnly == undefined || i18nOnly == "" || i18nOnly == "value") {
                          $(this).val(eval('i18nLang.'+$(this).attr("data-i18n")))
                        }
                      // }
                      // if ($(this).html() != null && $(this).html() != "") {
                        if (i18nOnly == null || i18nOnly == undefined || i18nOnly == "" || i18nOnly == "html") {
                          if($(this)[0].tagName=='IMG'){
                            $(this).attr('src',eval('i18nLang.'+$(this).attr("data-i18n")))
                          }else if($(this)[0].tagName=='VIDEO'){
                            $(this).attr('src',eval('i18nLang.'+$(this).attr("data-i18n"))+'.mp4')
                          }else{
                            $(this).html(eval('i18nLang.'+$(this).attr("data-i18n")))
                          }
                        }
                      // }
                      // if ($(this).attr('placeholder') != null && $(this).attr('placeholder') != "") {
                        // if (i18nOnly == null || i18nOnly == undefined || i18nOnly == "" || i18nOnly == "placeholder") {
                        //     $(this).attr('placeholder', eval('i18nLang.'+$(this).attr("data-i18n")))
                        // }
                      // }
                });
                options.callback();
            });
        }
    });
})(jQuery);