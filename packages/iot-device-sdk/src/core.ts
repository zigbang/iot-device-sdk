import { TuyaSdkBridge, RemoveDeviceParams } from './common';

/**
 * iot-device-sdk has to be initialized with this API <br/>
 * logCallback is called with await
 * this is replaced version 2 {@link init_v2} API  <br/>
 *
 * @param isShowDebugLog - More debugging message (true - console logs are increased)
 * @param pnu - Buildings information for device registration
 * @param dong - A Building information for device registration
 * @param ho - Home information for device registration
 * @param user - User information for device registration
 * @param homeID - Home ID information
 * @param logCallback - iot-device-sdk's log function
 * @param loginCallback - User can handling login process as user own
 *
 * @returns Function's result
 *
 * @example
 * ```ts
 * iot-device-sdk.init(false, "1929129192919", "101dong", "301ho", "Johnny", "10.200.18.212", 5555555, "adfjekcjvlkekmdfkjen ...", (code) => {addDevDebugMessage(logTable[code]), UserLogin)
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
 * this is version 2 of {@link init} API  <br/>
 * getDetailInfo is added
 *
 * @param isShowDebugLog - More debugging message (true - console logs are increased)
 * @param pnu - Buildings information for device registration
 * @param dong - A Building information for device registration
 * @param ho - Home information for device registration
 * @param user - User information for device registration
 * @param homeID - Home ID information
 * @param logCallback - iot-device-sdk's log function
 * @param loginCallback - User can handling login process as user own
 * @param getDetailInfo - This is a option for Getting more information internal
 *
 * @returns Function's result
 *
 * @example
 * ```ts
 * iot-device-sdk.init_v2(false, "1929129192919", "101dong", "301ho", "Johnny", "10.200.18.212", 5555555, "adfjekcjvlkekmdfkjen ...", (code) => {addDevDebugMessage(logTable[code]), UserLogin, false)
 * ```
 */
 export async function init_v2(
    isShowDebugLog: boolean,
    pnu: string,
    dong: string,
    ho: string,
    user: string,
    homeID: number, // avoid duplicate name in home
    logCallback: (code: any) => void,
    loginCallback: (code: any) => Promise<boolean>,
    getDetailInfo: boolean

): Promise<string> {
    return TuyaSdkBridge.init_v2(isShowDebugLog, pnu, dong, ho, user, homeID, logCallback, loginCallback, getDetailInfo);
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
 * const res = await iot-device-sdk.removeDevice({ devId: "ebc2e6912054fa2a03ws5h" }, true)
 * console.log(res)
 * ```
 */
export async function removeDevice(devId: RemoveDeviceParams, reset: boolean): Promise<boolean> {
    return TuyaSdkBridge.removeDevice(devId, reset);
}
