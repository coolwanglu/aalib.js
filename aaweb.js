var LibraryAAWeb = {
  $aaweb: {
    canvas_node: null,
    ctx: null,
    ctx_buffer: null,
    cols: 160,
    rows: 50,
    x: 0,
    y: 0,
    attr: 0,
    font: 'Source Code Pro',
    font_size: 8, 
    font_str: '',

    normal_font_cache: null,
    bold_font_cache: null,
    dim_font_cache: null,
    reverse_font_cache: null,
    special_font_cache: null,
    cur_font_cache: null,

    bg_color: '#000',
    dim_color: '#777',
    fg_color: '#fff',
    special_color: '#f00',

    AA_NORMAL: 0,
    AA_DIM: 1,
    AA_BOLD: 2,
    AA_BOLDFONT: 3,
    AA_REVERSE: 4,
    AA_SPECIAL: 5,
  },
  aaweb_init: function() {
    var font_test_node = document.getElementById('aa-font-test');
    font_test_node.style.font = aaweb.font_size + 'px "' + aaweb.font + '"';
    font_test_node.innerHTML = 'm';

    var devicePixelRatio = window.devicePixelRatio;
    var char_height = aaweb.char_height = Math.max(1, font_test_node.clientHeight * devicePixelRatio);
    var char_width = aaweb.char_width = Math.max(1, font_test_node.clientWidth * devicePixelRatio);

    var canvas_node = aaweb.canvas_node = document.getElementById('aa-canvas');
    canvas_node.width = aaweb.cols * aaweb.char_width;
    canvas_node.height = aaweb.rows * aaweb.char_height;
    canvas_node.style.width = canvas_node.width / devicePixelRatio + canvas_node.offsetWidth - canvas_node.clientWidth + 'px';
    canvas_node.style.height = canvas_node.height / devicePixelRatio + canvas_node.offsetHeight - canvas_node.clientHeight + 'px';
    aaweb.ctx = canvas_node.getContext('2d');
    aaweb.ctx_buffer = aaweb.ctx.getImageData(0, 0, canvas_node.width, canvas_node.height);

    // build font caches
    var cache_canvas = document.createElement('canvas');
    var canvas_height = 256 * char_height;
    cache_canvas.width = char_width;
    cache_canvas.height = canvas_height;
    var ctx = cache_canvas.getContext('2d');
    var font_str = aaweb.font_str = aaweb.font_size * devicePixelRatio + 'px "' + aaweb.font + '"';
    
    // normal text
    ctx.fillStyle = aaweb.bg_color;
    ctx.fillRect(0, 0, char_width, canvas_height);
    ctx.fillStyle = aaweb.fg_color;
    ctx.font = font_str;
    ctx.textBaseline = 'bottom';
    for(var i = 0; i < 256; ++i) {
      ctx.fillText(String.fromCharCode(i), 0, (i+1)*char_height, char_width);
    }
    aaweb.normal_font_cache = ctx.getImageData(0, 0, char_width, canvas_height).data;

    // dim text
    ctx.fillStyle = aaweb.bg_color;
    ctx.fillRect(0, 0, char_width, canvas_height);
    ctx.fillStyle = aaweb.dim_color;
    for(var i = 0; i < 256; ++i) {
      ctx.fillText(String.fromCharCode(i), 0, (i+1)*char_height, char_width);
    }
    aaweb.dim_font_cache = ctx.getImageData(0, 0, char_width, canvas_height).data;
    
    // special
    ctx.fillStyle = aaweb.bg_color;
    ctx.fillRect(0, 0, char_width, canvas_height);
    ctx.fillStyle = aaweb.special_color;
    for(var i = 0; i < 256; ++i) {
      ctx.fillText(String.fromCharCode(i), 0, (i+1)*char_height, char_width);
    }
    aaweb.special_font_cache = ctx.getImageData(0, 0, char_width, canvas_height).data;

    // reverse
    ctx.fillStyle = aaweb.fg_color;
    ctx.fillRect(0, 0, char_width, canvas_height);
    ctx.fillStyle = aaweb.bg_color;
    for(var i = 0; i < 256; ++i) {
      ctx.fillText(String.fromCharCode(i), 0, (i+1)*char_height, char_width);
    }
    aaweb.reverse_font_cache = ctx.getImageData(0, 0, char_width, canvas_height).data;

    // bold text
    ctx.fillStyle = aaweb.bg_color;
    ctx.fillRect(0, 0, char_width, canvas_height);
    ctx.fillStyle = aaweb.fg_color;
    ctx.font = 'bold ' + font_str;
    for(var i = 0; i < 256; ++i) {
      ctx.fillText(String.fromCharCode(i), 0, (i+1)*char_height, char_width);
    }
    aaweb.bold_font_cache = ctx.getImageData(0, 0, char_width, canvas_height).data;

    aaweb.cur_font_cache = aaweb.normal_font_cache;
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
    switch(attr) {
      case aaweb.AA_NORMAL:
      default:
        aaweb.cur_font_cache = aaweb.normal_font_cache;
        break;
      case aaweb.AA_DIM:
        aaweb.cur_font_cache = aaweb.dim_font_cache;
        break;
      case aaweb.AA_BOLD:
      case aaweb.AA_BOLDFONT:
        aaweb.cur_font_cache = aaweb.bold_font_cache;
        break;
      case aaweb.AA_REVERSE:
        aaweb.cur_font_cache = aaweb.reverse_font_cache;
        break;
      case aaweb.AA_SPECIAL:
        aaweb.cur_font_cache = aaweb.special_font_cache;
        break;
    }  
  },
  aaweb_print: function(p) {
    if(!p) return;
    p = Pointer_stringify(p);
    var char_width  = aaweb.char_width;
    var char_height = aaweb.char_height;
    var x = aaweb.x * char_width;
    var y = aaweb.y * char_height;
    var ctx_buffer_data = aaweb.ctx_buffer.data;
    var cur_font_cache = aaweb.cur_font_cache;
    var src_off = 0;
    var dest_off = 0;
    var canvas_width = aaweb.canvas_node.width;
    for(var i = 0, l = p.length; i < l; ++i) {
      var c = p.charCodeAt(i);
      src_off = char_height * char_width * c * 4;
      for(var cy = 0; cy < char_height; ++cy) {
        dest_off = ((y + cy) * canvas_width + x) * 4;
        for(var cx = 0; cx < char_width * 4; ++cx) {
          ctx_buffer_data[dest_off++] = cur_font_cache[src_off++];
        } 
      }
      x += char_width;
    }
    aaweb.x += p.length;
  },
  aaweb_flush: function() {
    aaweb.ctx.putImageData(aaweb.ctx_buffer, 0, 0);
  },
  aaweb_gotoxy: function(x,y) {
    aaweb.x = x;
    aaweb.y = y;
  }
};
autoAddDeps(LibraryAAWeb, '$aaweb');
mergeInto(LibraryManager.library, LibraryAAWeb);
