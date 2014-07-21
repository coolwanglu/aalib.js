var LibraryAAWeb = {
  $aaweb: {
    canvas_node: null,
    ctx: null,
    cols: 80,
    rows: 25,
    x: 0,
    y: 0,
  },
  aaweb_init: function() {
    var font_test_node = vimjs.font_test_node;
    font_test_node.innerHTML = 'm';

    var devicePixelRatio = window.devicePixelRatio;
    aaweb.char_height = Math.max(1, font_test_node.clientHeight * devicePixelRatio);
    aaweb.char_width = Math.max(1, font_test_node.clientWidth * devicePixelRatio);

    var canvas_node = aaweb.canvas_node = document.getElementById('aa-canvas');
    canvas_node.width = aaweb.cols * aaweb.char_width;
    canvas_node.height = aaweb.rows * aaweb.char_height;
    canvas_node.style.width = canvas_node.width / devicePixelRatio + canvas_node.offsetWidth - canvas_node.clientWidth + 'px';
    canvas_node.style.height = canvas_node.height / devicePixelRatio + canvas_node.offsetHeight - canvas_node.clientHeight + 'px';

    var ctx = aaweb.ctx = canvas_node.getContext('2d');
    ctx.fillStyle = 'white';
  },
  aaweb_get_width: function() {
    return aaweb.cols;
  },
  aaweb_get_height: function() {
    return aaweb.rows;
  },
  aaweb_setattr: function(attr) {
  },
  aaweb_print: function(p) {
    p = Pointer_stringify(p);
    aaweb.ctx.fillText(p, aaweb.x * aaweb.char_width, (aaweb.y + 1) * aaweb.char_height);
  },
  aaweb_gotoxy: function(x,y) {
    aaweb.x = x;
    aaweb.y = y;
  }
};
autoAddDeps(LibraryAAWeb, '$aaweb');
mergeInto(LibraryManager.library, LibraryAAWeb);
