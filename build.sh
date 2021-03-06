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
  --with-curses-driver=no \
  --without-x \
  --without-sunos-curses \
  --without-osf1-curses \

}

do_make() {
$EM_DIR/emmake make -j8
}

do_link() {
pushd web
cp ../src/$1 $1.bc 
$EM_DIR/emcc \
    $1.bc \
    -o $1.js\
    -Oz \
    -s ASYNCIFY=1 \
    --memory-init-file 1 \
    --js-library aaweb.js \
    --preload-file pdcfont.bmp \

popd
}

#do_config
do_make
do_link aafire
