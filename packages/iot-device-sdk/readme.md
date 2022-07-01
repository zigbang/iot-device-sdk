# Iot Device SDK for Provisioning
(This is not working yet!!!)

iot-device-sdk-react is for device's provisioning 


it has dependency on following packages:
- react-native-tuya 


---
APIs Description:

## `init`

`init(isShowDebugLog: boolean, pnu: string, dong: string, ho: string, user: string, host: string, homeID: number, token: string, logCallback: (code: any) => void): Promise<string>`<br><br>
iot-device-sdk-react has to be initialized with this API.<br>
logCallback is called with await<br><br>

- **Parameters**

| property       | type                | description                                                   |
| -------------- | ------------------- | ------------------------------------------------------ |
| isShowDebugLog | boolean             | More debugging message (true - console logs are increaed) |
| pnu            | string              | Buildings information for device registration               |
| dong           | string              | A Building information for device registration            |
| ho             | string              | Home information for device registration       |
| user           | string              | User information for device registration              |
| host           | string              | this is for Tuya only. "Anonymous Login" server address         |
| homeID         | number              | Home ID information                                 |
| token          | string              | this is for Zigbang. Access token                       |
| logCallback    | (code: any) => void | iot-device-sdk-react's log function               |

about "Anaymous Login" [ref](https://developer.tuya.com/en/docs/app-development/usertourist?id=Ka6a99lylyces)

- **Return**

| type              | description                       |
| ----------------- | -------------------------- |
| Promise< string > | Function's result if ok |

- **Sample**

```
	iot-device-sdk-react.init(false, "1929129192919", "101dong", "301ho", "Johnny", "10.200.18.212", 5555555, "adfjekcjvlkekmdfkjen ...", (code) => {addDevDebugMessage(logTable[code])})
```

## `startSearchWiredGW`

`startSearchWiredGW(callback: (gw_id: string, product_id: string) => void): boolean`<br><br>
Start searching wired gateway<br>
Both information gw_id and product_id can be collected by callback<br><br>

- **Parameters**

| property | type     | description                                                                    |
| -------- | -------- | ----------------------------------------------------------------------- |
| callback | function | Callback function for offer gateway information(gw_id, product_id) |

- **Return**

| type    | description                                                                       |
| ------- | -------------------------------------------------------------------------- |
| boolean | Function's result if ok. It returns false if startSearchWiredGW is called already before done |

- **Sample**

```
let tempScannedData = []

function filterNotification(gwId: string, productId: string) {
  const result = tempScannedData.filter((tempScannedData) => {
    if (tempScannedData.productId == productId) {
      return true
    }
  })
  if (result.length == 0) {
    tempScannedData.push({ gwId: gwId, productId: productId })
  }
}

iot-device-sdk-react.startSearchWiredGW(filterNotification)
```

## `stopSearchWiredGW`

`stopSearchWiredGW(): boolean`<br><br>
stop searching wired gateway <br><br>

- **Parameters**

| property | type | description |
| -------- | ---- | ---- |
|          |      |      |

- **Return**

| property    | type    | description                                                          |
| ----------- | ------- | ---------------------------------------------------------------------|
| ReturnValue | boolean | true - ok. false - startSearchWiredGW was not called or already done |

- **Sample**

```
setTimeout(() => {
  iot-device-sdk-react.stopSearchWiredGW()
}, (100000))

```

## `registerWiredGW`

`registerWiredGW(gw_id: string, product_id: string, timeout: number): Promise<string>`<br><br>
Register wired gateway<br>
In case success registration, Thing name is made by combination(building/dong/ho/user (zGuard meta info.)<br><br>

- **Parameters**

| property   | type   | description                              |
| ---------- | ------ | ---------------------------------------- |
| gw_id      | string | gateway id for registration              |
| product_id | string | product id for registration              |
| timeout    | number | maximum timeout for registration         |

- **Return**

| property | type   | description                                                              |
| -------- | ------ | ------------------------------------------------------------------------ |
| Promise  | string | Success and failure details as a result  |

- **Return examples**

| type     | 값                                                                       |
| ---------------------- | --------------------------------------------------------- |
| in case OK           | [ref](sample-gw.md) |
| in case Processing | registerWiredGW is started                                     |
| in case Occur Timeout    | Timeout                                                  |

- **Sample**

```
iot-device-sdk-react.registerWiredGw({
  "eb9a55f0d10d1c9a11luux",
  "keyyj3fy8x98arty",
  90
}).then(
  (okRes: any) => {
    debugText("Ok Res")
    assignedGwId = okRes.devId
    console.log(assignedGwId)
    console.log(okRes)
  },
  (errRes) => {
    debugText("Ng Res")
    console.log(errRes)
  }
)
```

## `startRegisterZigbeeSubDevice`

`startRegisterZigbeeSubDevice(gw_id: string, timeout: number, callback: (result: any) => void): Promise<boolean>`<br><br>
Start registration zigbee devices under gateway<br>
It registers automatically if devices are found. Callback function offer sub device detail information.<br><br>

- **Parameters**

| property | type     | description                                                |
| -------- | -------- | ----------------------------------------------------------- |
| gw_id    | string   | gateway id that zigbee device is connected to              |
| timeout  | number   | maximum timeout for sub devices registration                |
| callback | function | Callback function for get information about registration    |

- **Return**

| property | type    | description                |
| -------- | ------- | ------------------- |
| Promise  | boolean | Function's result if ok |

- **Sample**

```
const registerNotificationForSubDevice = async (result: any) => {
  console.log(result)
}

iot-device-sdk-react.startRegisterZigbeeSubDevice(
  "eb9a55f0d10d1c9a11luux",
  100,
  registerNotificationForSubDevice
).then(
  (okRes: boolean) => {
    debugText("Ok Res")
  },
  (errRes) => {
    debugText("Ng Res")
  }
)
```

## `stopRegisterZigbeeSubDevice`

`stopRegisterZigbeeSubDevice(): boolean`<br><br>
Stop registration zigbee devices<br><br>

- **Parameters**

| property | type | description |
| -------- | ---- | ---- |
|          |      |      |

- **Return**

| type    | description                                                                    |
| ------- | -----------------------------------------------------------------------        |
| boolean | true - ok. false - startRegisterZigbeeSubDevice was not called or already done |

- **Sample**

```
setTimeout(() => {
  iot-device-sdk-react.stopRegisterZigbeeSubDevice()
}, 100000)
```

## `removeDevice`

`removeDevice(devId: TuyaNative.RemoveDeviceParams, reset: boolean): Promise<boolean>`<br><br>
Remove either a gateway or a sub device<br><br>

- **Parameters**

| property | type    | description                            |
| -------- | ------- | -------------------------------------- |
| devId    | string  | device id to remove                    |
| reset    | boolean | need to factory reset                  |

- **Return**

| property | type    | description                |
| -------- | ------- | ------------------- |
| Promise  | boolean | Function's result  |

- **Sample**

```
const res = await iot-device-sdk-react.removeDevice({ devId: "ebc2e6912054fa2a03ws5h" }, true)
console.log(res)
```

### `Log Table`

Debug code enum values from iot-device-sdk-react's callback<br><br>

```
export const enum debugCode {
	INF_NO_SESSION, // 0, No exist login session
	INF_EXIST_SESSION, // 1, already exist login session
	INF_CREATE_ANONYMOUS_ACCOUNT, // 2, anonymous account is created
	INF_LOGIN, // 3, success login
	INF_LOGOUT, // 4, success logout
	INF_HOMEDETAIL, // 5, success accessing home information
	INF_RENAME_GW, // 6, success changing gateway name
	INF_RESET_DEVICE, // 7, success factory reset device
	INF_REMOVE_DEVICE, // 8, success remove device
	WARN_START_SEARCH_WIREDGW_FIRST, // 9, startSearchWiredGw() is not called
	WARN_START_REGISTER_ZIGBEE_SUBDEVICE_FIRST, // 10, startRegisterZigbeeSubDevice() is not called
	WARN_CUT_USERNAME, // 11, user name made short forced
	ERR_INIT_FIRST, // 12, init() is not called
	ERR_LOGIN, // 13, failed to login
	ERR_SYNC, // 14, failed sync with Tuya cloud account
	ERR_GET_CURRENT_USER, // 15, failed to get user information
	ERR_CREATE_ANONYMOUS_ACCOUNT, // 16, failed to create anonymous account
	ERR_HOMEDETAIL, // 17, failed to get home information
	ERR_REGISTER_WIREDGW_ALREADY, // 18, registerWiredGW() has been already called
	ERR_START_REGISTER_ZIGBEE_SUBDEVICE_ALREAY, // 19, startRegisterZigbeeSubDevice() has been already called
	ERR_RENAME_GW, // 20, failed to change name of gateway
	ERR_RESET_DEVICE, // 21, failed to factory reset
	ERR_REMOVE_DEVICE, // 22, failed to rename of device
	ERR_PNU_TOO_LONG, // 23, error caused pnu string is too long
	ERR_DONG_TOO_LONG, // 24, error caused dong string is too long
	ERR_HO_TOO_LONG, // 25, error caused ho string is too long
}
