#include "sled.h"

struct CRGB {
  uint8_t r, g, b;
};

void setup() {}

void loop() {
  for (int i = 0; i < ctx->ledCount; ++i)
    ctx->leds[i] = {0, 0, 0};

  static int index = 0;
  ctx->leds[index++] = {255, 255, 255};
  if (index >= ctx->ledCount)
    index = 0;
}

void recvmsg(uint8_t* data, int length) {}

void dispose() {}
