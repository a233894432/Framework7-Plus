//比较一个字符串版本号
//a > b === 1
//a = b === 0
//a < b === -1
app.compareVersion = function(a, b) {
  if(a === b) return 0;
  var as = a.splite('.');
  var bs = b.splite('.');
  for(var i=0;i<as.length;i++) {
    var x = parseInt(as[i]);
    if(!bs[i]) return 1;
    var y = parseInt(bs[i]);
    if(x<y) return -1;
  }
  return 1;
}

//自定义的滚动条
//
var Scroller = function(pageContent) {
  var $pageContent = this.$pageContent = $(pageContent);
  if(app.device.android && app.compareVersion('4.4.0', myApp.device.osVersion)) {
    var ptr = $(pageContent).find('.pull-to-refresh-content')[0];
    var options = {
      probeType: 1,
      mouseWheel: true,
    };
    if(ptr) {
      options.ptr = true;
      options.ptrOffset = 44;
    }
    this.scroller = new IScroll(pageContent, options);
  } else {
    $pageContent.addClass("native-scroll");
  }
}

//如果没有传入参数，则返回当前滚动距离
Scroller.prototype.scrollTop = function(top, dur) {
  if(this.scroller) {
    if(top) {
      this.scroller.scrollTo(0, -1 * top, dur);
    } else {
      return this.scroller.getComputedPosition().y * -1;
    }
  } else {
    return this.$pageContent.scrollTop(top, dur);
  }
}
//scroll, scrollEnd, scrollStart
Scroller.prototype.on = function(event, callback) {
  if(this.scroller) {
    this.scroller.on(event, callback);
  } else {
    this.$pageContent.on(event, callback);
  }
}
//刷新滚动条
Scroller.prototype.refresh = function() {
  this.scroller && this.scroller.refresh();
}

app.initScroller = function(pageContent) {
    var $pageContent = $(pageContent);
    var $pageContentInner = $pageContent.find('.page-content-inner');
    if(!$pageContentInner[0]) {
      $pageContent.html('<div class="page-content-inner">'+ $pageContent.html() + '</div>');
    }
    
    var scroller = new Scroller(pageContent);
    pageContent.scroller = scroller;
};
app.refreshScroller = function(content) { //如果未传入container，则取当前显示的page
    var $content = $(content || $(myApp.mainView.activePage.container).find('.page-content')[0]);
    if($content[0] && $content[0].scroller) {
        $content[0].scroller.refresh();
    }
};
app.getScroller = function(content) {
  if(content) {
    return $(content)[0].scroller;
  } else {
    return myApp.mainView.activePage.container.children[0].scroller;
  }
};
