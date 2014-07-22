var LibraryAAWeb = {
  $aaweb: {
    canvas_node: null,
    ctx: null,
    cols: 80,
    rows: 25,
    x: 0,
    y: 0,
    attr: 0,
    font: 'Source Code Pro',
    font_size: 12, 
    font_str: '',
    bg_color: '#000',
    dim_color: '#777',
    fg_color: '#fff',

    AA_NORMAL: 0,
    AA_DIM: 1,
    AA_BOLD: 2,
    AA_BOLDFONT: 3,
    AA_REVERSE: 4,
    AA_SPECIAL: 5
  },
  aaweb_init: function() {
    var font_test_node = document.getElementById('aa-font-test');
    font_test_node.style.font = aaweb.font_size + 'px "' + aaweb.font + '"';
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
    ctx.font = aaweb.font_str = aaweb.font_size * devicePixelRatio + 'px "' + aaweb.font + '"';
    ctx.textBaseline = 'bottom';
  },
  aaweb_build_font_data: function() {
    var char_width = aaweb.char_width;
    var char_height = aaweb.char_height;
    var canvas_height = 256 * char_height;
    var data = _malloc(canvas_height);

    var canvas = document.createElement('canvas');
    canvas.width = char_width;
    canvas.height = canvas_height;
    var ctx = canvas.getContext('2d');
    ctx.font = aaweb.font_str;
    ctx.textBaseline = 'bottom';
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, char_width, canvas_height);
    ctx.fillStyle = 'white';
    for(var i = 0; i < 256; ++i) {
      ctx.fillText(String.fromCharCode(i), 0, (i+1)*char_height, char_width);
    }
    var canvas2 = document.createElement('canvas');
    canvas2.width = 8;
    canvas2.height = canvas_height;
    var ctx2 = canvas2.getContext('2d');
    ctx2.drawImage(canvas, 0, 0, char_width, canvas_height, 0, 0, 8, canvas_height);
    var img_data = ctx2.getImageData(0, 0, 8, canvas_height).data;
    var off = 0;
    var ptr = data;
    for(var y = 0; y < canvas_height; ++y) {
      var v = 0;
      for(var x = 0; x < 8; ++x) {
        var l = (0.2126 * img_data[off++]
          + 0.7152 * img_data[off++]
          + 0.0722 * img_data[off++]);
        ++off;

        v <<= 1;
        if(l > 127) v |= 1;
      }
      HEAP8[ptr++] = v & 255;
    }
    return data;
  },
  aaweb_get_char_height: function() {
    return aaweb.char_height;
  },
  aaweb_get_width: function() {
    return aaweb.cols;
  },
  aaweb_get_height: function() {
    return aaweb.rows;
  },
  aaweb_setattr: function(attr) {
    aaweb.attr = attr;
  },
  aaweb_print: function(p) {
    p = Pointer_stringify(p);
    var x = aaweb.x * aaweb.char_width;
    var y = aaweb.y * aaweb.char_height;
    var w = p.length * aaweb.char_width;
    var ctx = aaweb.ctx;
    var bg_style = aaweb.bg_color;
    var fg_style = aaweb.fg_color;
    ctx.font = aaweb.font_str;
    switch(aaweb.attr) {
      case aaweb.AA_NORMAL:
      case aaweb.AA_SPECIAL:
      default:
        break;
      case aaweb.AA_DIM:
        fg_style = aaweb.dim_color;
        break;
      case aaweb.AA_BOLD:
      case aaweb.AA_BOLDFONT:
        ctx.font = 'bold ' + aaweb.font_str;
        break;
      case aaweb.AA_REVERSE:
        var tmp = fg_style;
        fg_style = bg_style;
        bg_style = tmp;
        break;
    }
        
    ctx.fillStyle = bg_style;
    ctx.fillRect(x, y, w, aaweb.char_height);
    ctx.fillStyle = fg_style;
    ctx.fillText(p, x, y + aaweb.char_height, w);
    aaweb.x += p.length;
  },
  aaweb_gotoxy: function(x,y) {
    aaweb.x = x;
    aaweb.y = y;
  }
};
autoAddDeps(LibraryAAWeb, '$aaweb');
mergeInto(LibraryManager.library, LibraryAAWeb);
