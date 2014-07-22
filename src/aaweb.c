#include <setjmp.h>
#include <signal.h>
#include <stdio.h>
#include "config.h"
#include "aalib.h"
#include "aaint.h"
__AA_CONST struct aa_driver web_d;
int __resized_web;
aa_font font;

void aaweb_init(void);
const char * aaweb_build_font_data(void);
int aaweb_get_char_height(void);
int aaweb_get_width(void);
int aaweb_get_height(void);
void aaweb_setattr(int);
void aaweb_print(const char*);
void aaweb_flush(void);
void aaweb_gotoxy(int,int);

static int web_init(__AA_CONST struct aa_hardware_params *p, __AA_CONST void *none, struct aa_hardware_params *dest, void **param)
{
    aaweb_init();
    
    font.name = "web";
    font.shortname = "web";
    font.height = aaweb_get_char_height();
    font.data = aaweb_build_font_data();
    aa_registerfont(&font);

    dest->font=&font;
    dest->supported = AA_NORMAL_MASK | AA_DIM_MASK | AA_BOLD_MASK | AA_BOLDFONT_MASK | AA_REVERSE_MASK;
    aa_recommendlowkbd("web");
    return 1;
}
static void web_uninit(aa_context * c)
{
}
static void web_getsize(aa_context * c, int *width, int *height)
{
    *width = aaweb_get_width();
    *height = aaweb_get_height();
}
static void web_setattr(aa_context * c, int attr)
{
    aaweb_setattr(attr);
    /*
    switch (attr) {
    case AA_NORMAL:
	attrset(A_NORMAL);
	break;
    case AA_DIM:
	attrset(A_DIM);
	break;
    case AA_BOLD:
	attrset(A_BOLD);
	break;
    case AA_BOLDFONT:
	attrset(A_BOLD);
	break;
    case AA_REVERSE:
	attrset(A_REVERSE);
	break;
    case AA_SPECIAL:
	attrset(A_REVERSE);
	break;
    }
    */
}
static void web_print(aa_context * c, __AA_CONST char *text)
{
    aaweb_print(text);
}
static void web_flush(aa_context * c)
{
    aaweb_flush();
}
static void web_gotoxy(aa_context * c, int x, int y)
{
    aaweb_gotoxy(x,y);
}
static void web_cursor(aa_context * c, int mode)
{
}

__AA_CONST struct aa_driver web_d =
{
    "web", "Web driver 1.0",
    web_init,
    web_uninit,
    web_getsize,
    web_setattr,
    web_print,
    web_gotoxy,
    /*web_getchar,
       NULL, */
    web_flush,
    web_cursor,
};
