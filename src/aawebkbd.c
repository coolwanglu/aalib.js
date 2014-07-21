#include <setjmp.h>
#include <signal.h>
#include <stdio.h>
#include "config.h"
#include "aalib.h"
#include "aaint.h"
static int aaweb_init(struct aa_context *context, int mode)
{
    return 1;
}
static void aaweb_uninit(aa_context * c)
{
}
static int aaweb_getchar(aa_context * c1, int wait)
{
    return AA_NONE;
}


__AA_CONST struct aa_kbddriver kbd_web_d =
{
    "web", "Curses keyboard driver 1.0",
    0,
    aaweb_init,
    aaweb_uninit,
    aaweb_getchar,
};
