//%color=#5e41f0 icon="\uf1eb"

namespace SGBotic {


    class wifi_serial_class {
        sending_data: boolean
        mqtt_busy: boolean

        constructor() {
            this.sending_data = false
            this.mqtt_busy = false
        }
    }

    export class mqttSubPacket {
        public variableID: string;
        public value: string;

        constructor() {
            this.variableID = ""
            this.value = ""
        }
    }

    let uartHandlerStarted: boolean = false;

    let mqttSubMessage: mqttSubPacket[] = []
    let mqttSubVarRcv: string = ""
    let mqttSubValue: string = ""

    let wifi_connected: boolean = false
    let resp_str: string = ""
    let led_Feedback: boolean = true
    let rcvString: string = ""
    //let ubidot_server: string = "industrial.api.ubidots.com"
    //let ubidotsToken: string = ""
    //let ubidot_server_port: number = 1883
    //let ubi_connected: string = ""
    //let http_status: string = ""

    let ubidotsAPIToken: string = ""
    let ubidotsClientID: string = ""
    let wifi_serial_obj = new wifi_serial_class()

    let mqttSubCounter: number = 0
    let ipaddress: string = ""

    // write AT command with CR+LF ending
    function sendAT(command: string, wait: number = 100) {
        wifi_serial_obj.sending_data = true
        serial.writeString(command + "\u000D\u000A")
        //basic.pause(wait)
        wifi_serial_obj.sending_data = false
    }

    function cmdResponse(resp_code: string): boolean {
        let response_str: string = ""
        let time: number = input.runningTime()
        if (!uartHandlerStarted) {
            while (true) {
                response_str += serial.readString()
                if (response_str.includes(resp_code)) {
                    resp_str = response_str;
                    return true;
                }
                if (input.runningTime() - time > 30000) {
                    return false;
                }
            }
        } else {
            basic.pause(1000);
            return true;
        }
    }

    // wait for certain response from ESP8266
    function waitResponse(): boolean {
        let serial_str: string = ""
        let result: boolean = false
        let time: number = input.runningTime()
        if (!uartHandlerStarted) {
            while (true) {
                serial_str += serial.readString()
                //serial_str += serial.readUntil(serial.delimiters(Delimiters.NewLine))
                //if (serial_str.length >100) serial_str = serial_str.substr(serial_str.length - 100)
                if (serial_str.includes("OK") && serial_str.includes("CONNECTED")) {
                    result = true
                    break
                } else if (serial_str.includes("ERROR") || serial_str.includes("SEND FAIL")) {
                    break
                }
                if (input.runningTime() - time > 10000) break
            }
            return result
        } else {
            basic.pause(1000);
            return true;
        }
    }

    function cipStatusResponse(): boolean {
        let serial_str: string = ""
        let result: boolean = false
        let time: number = input.runningTime()
        while (true) {
            serial_str += serial.readString()
            if (serial_str.includes("OK") && serial_str.includes("STATUS:4")) {
                result = true
                break
            } else if (serial_str.includes("OK") || serial_str.includes("STATUS:3")) {
                break
            }
            if (input.runningTime() - time > 10000) break
        }
        return result
    }

    function getIP(): string {

        let serial_str: string = ""
        let strData: string = ""
        let count: number = 0
        let str_completed: boolean = false;

        let time: number = input.runningTime()

        if (wifi_connected) {
            sendAT("AT+CIFSR");
            if (cmdResponse("OK")) {
                serial_str = resp_str;
                count = serial_str.indexOf("\"") + 1  //to remove \"
                strData = serial_str.substr(count, 16)
                count = strData.indexOf("\"")
                strData = strData.substr(0, count)
                return strData;
            } else {
                return "ERR"
            }
        } else {
            return "wifi not connected"
        }
    }

    /**
    * dummy
    */
    //% subcategory=myIoT-MQTT2
    //% weight=200 color=#FCCE9D
    //% block="dummy_13Sept"
    export function dummy_1(): string {
        return ipaddress;
    }


    /**
    * myIoT connect to wifi
    * @param Configure pin for serial communication
    */
    //% subcategory=myIoT-MQTT2
    //% weight=100 color=#CA85F1
    //% group="Wifi"
    //% pinRX.fieldEditor="gridpicker" pinRX.fieldOptions.columns=3
    //% pinTX.fieldEditor="gridpicker" pinTX.fieldOptions.columns=3
    //% blockId="myIoT Init" block="Connect myIoT module | Serial setup: |RX pin connect to %pinTX|TX pin connect to %pinRX | Wifi setup:| SSID %ssid|Password: %pwd | led matrix feedback %fb"
    //% pinTX.defl=SerialPin.P0 
    //% pinRX.defl=SerialPin.P1
    //% ssid.defl=wifi_SSID
    //% pwd.defl=wifi_password
    //% fb.defl=true
    export function myIoT_module_init(pinTX: SerialPin, pinRX: SerialPin, ssid: string, pwd: string, fb: boolean): void {
        wifi_connected = false
        let resp_ok: boolean = false;
        led_Feedback = fb

        serial.setTxBufferSize(200)
        serial.setRxBufferSize(200)

        serial.redirect(
            pinTX,
            pinRX,
            BaudRate.BaudRate115200
        )
        sendAT("AT+RESTORE") // restore to factory settings
        resp_ok = cmdResponse("ready");

        sendAT("AT+CWMODE=1") // set to STA (station or client) mode
        resp_ok = cmdResponse("OK");

        sendAT("AT+CWQAP")
        resp_ok = cmdResponse("OK");

        //sendAT("AT+RST", 1000) // reset
        sendAT("AT+CWJAP=\"" + ssid + "\",\"" + pwd + "\"", 0) // connect to Wifi router
        wifi_connected = waitResponse()
        ipaddress = getIP()

        if (led_Feedback) {
            if (wifi_connected) {
                basic.showLeds(`
                . . . . #
                . . . # .
                # . # . .
                . # . . .
                . . . . .
                `)
            } else {
                basic.showLeds(`
                # . . . #
                . # . # .
                . . # . .
                . # . # .
                # . . . #
                `)
            }

        }
        mqttSubCounter = 0;
        //sendAT("AT+CWJAP?")
        //basic.pause(1000)
    }

    /**
    * Get Wifi Connection Status
    */
    //% subcategory=myIoT-MQTT2
    //% weight=90 color=#CA85F1
    //% group="Wifi"
    //% block="wifi connected?"
    export function getWifiConectionStatus(): boolean {
        if (wifi_connected)
            return true
        else
            return false
    }

    /**
    * Get IP Address
    */
    //% subcategory=myIoT-MQTT2
    //% weight=80 color=#CA85F1
    //% group="Wifi"
    //% block="IP address"
    export function ipAddr(): string {
        return ipaddress;
    }


    /**
    * Connect to Ubidots IoT platform Token
    */
    //% subcategory=myIoT-MQTT2
    //% weight=90 color=#5dd475
    //% group="Ubidots"
    //% blockId="connectUbidots" 
    //% block="connect to Ubidots| using token %TKN| client ID %clientid"
    //% TKN.defl=your_ubidots_token
    //% clientid.defl=unique_client_name
    export function connectUbidots(TKN: string, clientid: string): void {
        ubidotsAPIToken = TKN
        ubidotsClientID = clientid

        //let userCfg: string = "AT+MQTTUSERCFG=0,1,\"microbit\",\"bbbbbbbbbbbb\",\"ubidots_user_name\",0,0,\"\"";
        //let userCfg: string = "AT+MQTTUSERCFG=0,1,\"microbit\",\"" + TKN + "\",\"ubidots_user_name\",0,0,\"\"";
        //let userCfg: string = "AT+MQTTUSERCFG=0,1,\"microbit\",\"" + TKN + "\",\"" + ubidotsClientID + "\",0,0,\"\"";
        let userCfg: string = "AT+MQTTUSERCFG=0,1,\"" + clientid + "\",\"" + TKN + "\",\"microbit\",0,0,\"\"";

        sendAT(userCfg)
        basic.pause(1000)
        //cmdResponse("OK")

        let conn: string = "AT+MQTTCONN=0,\"industrial.api.ubidots.com\",1883,0";
        sendAT(conn)
        basic.pause(1000)
        //cmdResponse("OK")
    }


    /**
    * Send numerical data to Ubidots. Maximum three devices for free STEM account.
    */
    //% subcategory=myIoT-MQTT2
    //% weight=80 color=#5dd475
    //% group="Ubidots"
    //% blockId="ubidotsPub" block="send numerical value %ubidotsValue to |device %ubidotsDevice|variable %ubidotsVariable"
    //% ubidotsDevice.defl=dev1
    //% ubidotsVariable.defl=var1
    //% ubidotsValue.defl=0.0
    export function ubidotsPub(ubidotsValue: number, ubidotsDevice: string, ubidotsVariable: string): void {
        let pubResp_str: string = ""
        let time: number = input.runningTime()

        while (wifi_serial_obj.sending_data) {
            basic.pause(100)
        }

        wifi_serial_obj.sending_data = true;

        let ubidots_device_prefix: string = "/v1.6/devices/"
        let ubidots_pub_str: string = ubidots_device_prefix + ubidotsDevice + "/" + ubidotsVariable;

        sendAT("AT+MQTTPUB=0," + "\"" + ubidots_pub_str + "\"" + "," + "\"" + ubidotsValue + "\"" + ",1,0");
        //sendAT("AT+MQTTPUB=0,\"/v1.6/devices/deviceID/variableID\",\"19.9\",1,0");
        //cmdResponse("OK");


        while (true) {
            pubResp_str = serial.readLine()
            if (pubResp_str.includes("OK")) {
                break
            }
            if (input.runningTime() - time > 1000) {
                break
            }
        }

        basic.pause(500)
        wifi_serial_obj.sending_data = false
    }

    /**
    * Subscribe to MQTT topic
    */
    //% subcategory=myIoT-MQTT2
    //% weight=70 color=#5dd475
    //% group="Ubidots"
    //% blockId="ubidotsSubscribe" block="subscribe to device iotNode variable %ubidotsSubVariable"
    //% ubidotsSubVariable.defl=var1
    export function ubidotsSubscribe(ubidotsSubVariable: string): void {

        //while (wifi_serial_obj.sending_data || wifi_serial_obj.mqtt_busy) {
        //    basic.pause(100)
        // }
        while (wifi_serial_obj.sending_data) {
            basic.pause(100)
        }

        mqttSubMessage[mqttSubCounter] = new mqttSubPacket();

        wifi_serial_obj.sending_data = true;

        let ubidots_device_prefix: string = "/v1.6/devices/iotNode"
        let ubidots_sub_str: string = ubidots_device_prefix + "/" + ubidotsSubVariable;

        mqttSubMessage[mqttSubCounter].variableID = ubidotsSubVariable.toLowerCase()


        sendAT("AT+MQTTSUB=0," + "\"" + ubidots_sub_str + "\",0");
        //cmdResponse("MQTT_EVENT_SUBSCRIBED");
        basic.pause(500)
        wifi_serial_obj.sending_data = false

        mqttSubCounter += 1;
    }


    /**
    * Ubidots variable received
    */
    //% subcategory=myIoT-MQTT2
    //% weight=60 color=#5dd475
    //% group="Ubidots"
    //% blockId="ubidotsSubVarRcv" block="Ubidots Varaible received"
    export function ubidotsSubVarRcv(): string {

        return mqttSubVarRcv
    }

    /**
    * Value of the variable in numerical.
    */
    //% subcategory=myIoT-MQTT2
    //% weight=50 color=#5dd475
    //% group="Ubidots"
    //% blockId="ubidotsSubRcvValue" block="value of iotNode's Variable %subVariable"
    //% subVariable.defl="var1"
    export function ubidotsSubRcvValue(subVariable: string): number {
        let val: number = 0

        let i: number = 0
        for (i = 0; i < mqttSubCounter; i++) {
            if (mqttSubMessage[i].variableID == subVariable.toLowerCase()) {
                val = parseInt(mqttSubMessage[i].value)
            }
        }
        return val
    }

    /**
    * The function is a callback function. It executes block inside the function whenever message from subscribed topic is received
    */
    //% subcategory=myIoT-MQTT2
    //% weight=18 color=#5dd475
    //% group="Ubidots"
    //% block="Ubidots on message received"
    export function onMessageReceived(handler: () => void) {

        let strTemp: string = ""
        let strInter: string = ""
        let strCount1: number = 0
        let strCount2: number = 0
        let strVariable: string = ""
        let strValue: string = ""

        uartHandlerStarted = true;

        while (wifi_serial_obj.sending_data) {
            basic.pause(100)
        }

        serial.onDataReceived("\n", function () {
            //while (wifi_serial_obj.sending_data) {
            //    basic.pause(100)
            //}

            //wifi_serial_obj.mqtt_busy = true;
            //rcvString = serial.readUntil(serial.delimiters(Delimiters.NewLine))
            rcvString = serial.readLine()
            //rcvString += serial.readString()
            //if (rcvString.includes("iotnode")) {
            if (rcvString.includes("+MQTTSUBRECV")) {
                strTemp = rcvString
                strCount1 = strTemp.indexOf("iotnode") + 8
                //strInter = strTemp.substr(strCount1, strCount2)
                strCount2 = strTemp.indexOf("timestamp")
                //get variable
                strInter = strTemp.substr(strCount1, strCount2 - strCount1)
                strCount1 = strInter.indexOf("\"")
                strVariable = strInter.substr(0, strCount1)

                //get value
                strCount1 = strInter.indexOf("value") + 8
                strValue = strInter.substr(strCount1, strInter.length - strCount1 - 3)

                let i: number = 0
                for (i = 0; i < mqttSubCounter; i++) {
                    if (mqttSubMessage[i].variableID == strVariable) {
                        mqttSubMessage[i].value = strValue
                    }
                }

                mqttSubVarRcv = strVariable
                //mqttSubValue = mqttSubMessage[0].value
                handler()
                // basic.showString(strValue)

            } else if (rcvString.includes("OK") || rcvString.includes("") || rcvString.includes("AT+MQTTPUB") || rcvString.includes("MQTT_EVENT_PUBLISHED")) {
                clearRxBuffer()
            }
            //wifi_serial_obj.mqtt_busy = false
            //basic.showString("#")
            //basic.showString(serial_res)
        })
    }

    /**
    * Send value to IFTTT
    */
    //% subcategory=myIoT-MQTT2
    //% weight=40 color=#33AFFF
    //% expandableArgumentMode"toggle" inlineInputMode=inline
    //% group="IFTTT"
    //% blockId="IFTTT_set" 
    //% block="IFTTT Set| Event Name = %event_name| Write API key = %ifttt_key| Value 1 = %value1|| Value 2 = %value2| Value 3 = %value3"
    //% event_name.defl=button_pressed
    //% ifttt_key.defl=your_IFTTT_key
    export function IFTTT_set(event_name: string, ifttt_key: string, value1: string, value2?: string, value3?: string): void {
        let packetLength: number = 0
        let uri: string = ""
        let httpPacket: string = ""
        let host: string = "maker.ifttt.com";
        let httpPort: number = 80
        let resp_ok: boolean = false;
        let cmdString: string = ""

        uri = "/trigger/" + event_name + "/with/key/" + ifttt_key + "?value1=" + value1 + "&value2=" + value2 + "&value3=" + value3;
        //uri = "/trigger/button_pressed/with/key/d7K_mOfwxZjJFSUCkWyvF38?value1=1&value2=2&value3=3";

        httpPacket = "GET " + uri + " HTTP/1.1\r\nHost: " + host + "\r\n\r\n";

        control.runInParallel(() => {
            if (wifi_connected) {
                sendAT("AT+CIPSTART=\"TCP\",\"maker.ifttt.com\",80");
                basic.pause(1000);
                //resp_ok = cmdResponse("OK");

                packetLength = httpPacket.length + 4;

                sendAT("AT+CIPSEND=" + packetLength.toString());
                basic.pause(1000);
                //resp_ok = cmdResponse("OK");
                //resp_ok = cmdResponse(">");
                serial.writeString(httpPacket + "\u000D\u000A\u000D\u000A");

                basic.pause(2000);

                sendAT("AT+CIPCLOSE");
                basic.pause(1000);
                //resp_ok = cmdResponse("OK");
                //require 2nd CIPCLOSE to properly close the connection
                //sendAT("AT+CIPCLOSE");
                //basic.pause(1000);
                //resp_ok = cmdResponse("OK");
            }
        });
    }


    //% shim=serialBuffer::setSerialBuffer
    function setSerialBuffer(size: number): void {
        return null;
    }

    //% shim=serialBuffer::clearRxBuffer
    function clearRxBuffer(): void {
        return null;
    }
}