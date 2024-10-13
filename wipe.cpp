#include "sled.h"

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
