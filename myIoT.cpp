#include <stdlib.h>
#include "pxt.h"

using namespace std;

namespace serialBuffer {

    //%
    void setSerialBuffer(int size) {
        uBit.serial.setRxBufferSize(size);
        uBit.serial.setTxBufferSize(size);
    }
    //%
    void clearRxBuffer(){
        uBit.serial.clearRxBuffer();
    }
} 
