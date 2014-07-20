#!/bin/bash
set -e
[ -z $EM_DIR] && EM_DIR=~/src/emscripten
[ -z $PDCurses_DIR] && PDCurses_DIR=~/src/PDCurses.js

do_config() {
    echo config
# something wrong with emcc + cproto, use gcc as CPP instead
CPPFLAGS="-Os -I$PDCurses_DIR" \
$EM_DIR/emconfigure ./configure \
  --disable-shared \
  --enable-static \
  --with-x11-driver=no \
  --with-slang-driver=no \
  --with-curses-driver=yes \
  --without-x \
  --without-sunos-curses \
  --without-osf1-curses \
  --with-ncurses=~/src/PDCurses.js \

}

do_make() {
$EM_DIR/emmake make -j8
}

do_link() {
pushd web
cp ../src/$1 $1.bc 
#cp vim_lib.js usr/local/share/vim/example.js

# Use vim.js as filename to generate vim.js.mem
$EM_DIR/emcc \
    $1.bc \
    $PDCurses_DIR/sdl1/libpdcurses.a \
    -o $1.html\
    -Oz \
    --memory-init-file 1 \
    -s ASYNCIFY=1 \
    --preload-file pdcfont.bmp \

popd
}

#do_config
do_make
for f in aainfo aatest aafire aasavefont; do
    do_link $f
done
