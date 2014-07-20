#!/bin/bash
set -e
[ -z $EM_DIR] && EM_DIR=~/src/emscripten

do_config() {
    echo config
# something wrong with emcc + cproto, use gcc as CPP instead
CPPFLAGS="-Os" \
$EM_DIR/emconfigure ./configure \
  --disable-shared \
  --enable-static \
  --with-x11-driver=no \
  --with-slang-driver=no \
  --with-curses-driver=yes \
  --without-x \
  --without-sunos-curses \
  --without-osf1-curses \

}

do_make() {
$EM_DIR/emmake make -j8
}

do_link() {
pushd web
cp ../src/vim vim.bc
#cp vim_lib.js usr/local/share/vim/example.js
cat vim_lib.js | sed -e "1 s/\(foldmethod\|foldmarker\)[^ ]\+//g" > usr/local/share/vim/example.js

# Use vim.js as filename to generate vim.js.mem
$EM_DIR/emcc vim.bc \
    -o vim.js \
    -Oz \
    --memory-init-file 1 \
    --js-library vim_lib.js \
    -s ASYNCIFY=1 \
    -s EXPORTED_FUNCTIONS="['_main', '_input_available', '_gui_web_handle_key']" \
    -s ASYNCIFY_FUNCTIONS="['emscripten_sleep', 'vimjs_flash', 'vimjs_browse']" \
    --embed-file usr \

popd
}

do_config
do_make
#do_link
