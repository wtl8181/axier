function renderHtml(id,data,insertEl){          //公共渲染模版函数
  $(template(id,data)).appendTo(insertEl)
  $('template[id='+id).remove()
}

function pageName(){
  var strUrl = location.href
      arrUrl = strUrl.split(','),
      strPage = arrUrl[arrUrl.length - 1];
  return strPage;
}