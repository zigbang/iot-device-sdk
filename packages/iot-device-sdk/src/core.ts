import { TuyaSdkBridge, RemoveDeviceParams } from './common';

/**
 * iot-device-sdk-react has to be initialized with this API <br/>
 * logCallback is called with await
 *
 * @param isShowDebugLog - More debugging message (true - console logs are increased)
 * @param pnu - Buildings information for device registration
 * @param dong - A Building information for device registration
 * @param ho - Home information for device registration
 * @param user - User information for device registration
 * @param host - this is for Tuya only. "Anonymous Login" server address </br> about "Anaymous Login" [ref](https://developer.tuya.com/en/docs/app-development/usertourist?id=Ka6a99lylyces)
 * @param homeID - Home ID information
 * @param token - this is for Zigbang. Access token
 * @param logCallback - iot-device-sdk-react's log function
 *
 * @returns Function's result
 *
 * @example
 * ```ts
 * iot-device-sdk-react.init(false, "1929129192919", "101dong", "301ho", "Johnny", "10.200.18.212", 5555555, "adfjekcjvlkekmdfkjen ...", (code) => {addDevDebugMessage(logTable[code])})
 * ```
 */
export async function init(
    isShowDebugLog: boolean,
    pnu: string,
    dong: string,
    ho: string,
    user: string,
    homeID: number, // avoid duplicate name in home
    logCallback: (code: any) => void,
    loginCallback: (code: any) => Promise<boolean>
): Promise<string> {
    return TuyaSdkBridge.init(isShowDebugLog, pnu, dong, ho, user, homeID, logCallback, loginCallback);
}

/**
 * Remove either a gateway or a sub device
 *
 * @param devId - device id to remove
 * @param reset - need to factory reset
 *
 * @returns Function's result
 *
 * @example
 * ```ts
 * const res = await iot-device-sdk-react.removeDevice({ devId: "ebc2e6912054fa2a03ws5h" }, true)
 * console.log(res)
 * ```
 */
export async function removeDevice(devId: RemoveDeviceParams, reset: boolean): Promise<boolean> {
    return TuyaSdkBridge.removeDevice(devId, reset);
}
