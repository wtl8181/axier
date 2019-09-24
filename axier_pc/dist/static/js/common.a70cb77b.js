var page = $("#app").attr('data-page-name'),
    lang = window.localStorage.getItem("lang")
$(function(){
  $(".inner_nav > li").on("click",function(){
    $(this).addClass("on").siblings().removeClass("on")
  })

  $(".first_nav > li > span").on('click',function(){
    var inner_nav = $(this).parent().find('.inner_nav');
        inner_nav.toggleClass("hide")
  })

  $(document).on("click",".language a",function(){
      lang = $(this).attr('data-lang');
      $(this).addClass('on').siblings().removeClass('on');
      translation(lang)
      window.localStorage.setItem("lang",lang)
      window.location.reload();
  })
  
  // $('body').hide()
  $("html").hide()
  renderHtml('header',{},"#app")
  renderHtml('page',{},"#app")
  if(page !== 'index'){
    renderHtml('footer',{},"#app")
  }else{
    renderHtml('footer',{},".four .fp-tableCell")
  }
  lang = lang || 'cn'
  window.localStorage.setItem("lang",lang)
  setTimeout(function(){
    translation(lang)
  },50)
  $('a[data-lang="'+lang+'"]').addClass('on');

  $(window).resize(function(){
    
  })
  setTimeout(() => {
    $('.jqzoom').jqzoom({
      zoomType: 'standard',
      lens:true,
      preloadImages: false,
      alwaysOn:true
    },4000);
  })
})

// window.onload = function(){
//   translation(lang)
// }

function translation(lang){
  language(lang,"header")
  language(lang,page)
  language(lang,"footer")
}

function language(lang,page){
  var resources = {};
  // $.getJSON("static/lang/"+lang+"/"+page+".json",function(data){
  //   resources[lang] = {translation:data}
  //   i18next.init({
  //     lng:lang, 
  //     resources:resources
  //   },function(err, t) {
  //     jqueryI18next.init(i18next, $);
  //     $('.'+page).localize().show();
  //   });
  // })
  console.log('翻译')
    /*默认语言*/
    $("."+page).find("[data-i18n]").i18n({
        defaultLang: lang,
        filePath:"/static/lang/"+lang+"/",
        filePrefix:page,
        fileSuffix: "",
        forever: true,
        callback: function() {
          $("html").show()
          if(lang == 'cn'){
            $('title').text('埃西尔')
            $('.page > .title').css('letter-spacing',12)
          }else{
            $('title').text('Ishare')
            $('.page > .title').css('letter-spacing',2)
          }
        }
    });

// })

    // var abc = {
    //   ab:'haha'
    // }
    // var str = 'abc.ab'
    // console.log(eval(str))
}