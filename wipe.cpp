#include "sled.h"

struct CRGB {
  uint8_t r;
  uint8_t g;
  uint8_t b;

  inline CRGB(uint32_t colorcode) __attribute__((always_inline)) : r((colorcode >> 16) & 0xFF), g((colorcode >> 8) & 0xFF), b((colorcode >> 0) & 0xFF) {}

  typedef enum { Black = 0, White = 0xFFFFFF } HTMLColor;
};

void setup() {}

void loop() {
  for (int i = 0; i < ctx->ledCount; ++i)
    ctx->leds[i] = CRGB::Black;

  static int index = 0;
  ctx->leds[index++] = CRGB::White;
  if (index >= ctx->ledCount)
    index = 0;
}

void recvmsg(uint8_t *data, int length) {}

void dispose() {}
