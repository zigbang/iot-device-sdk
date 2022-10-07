import { TuyaSdkBridge } from './common';

/**
 * Register wifi device by EZ Mode <br/>
 * In case success registration, Thing name is made by combination(building/dong/ho/user (zGuard meta info.)
 *
 * @param ssid - The name of the Wi-Fi network to which a paired device is connected
 * @param password - The password of the Wi-Fi network to which a paired device is connected
 * @param timeout - maximum timeout for wifi devices registration, unit is seconds
 *
 * @returns Success and failure details as a result
 *  - in case OK: [ref](https://github.com/iot-device-sdk/blob/main/packages/iot-device-sdk/sample-gw.md)
 *  - in case Processing: registerWifiEzDevice is started
 *  - in case Occur Timeout: Timeout
 * @example
 * ```ts
 * iot-device-sdk.registerWifiEzDevice({
 *   "ssid",
 *   "password",
 *   90
 * }).then(
 *   (okRes: any) => {
 *     debugText("Ok Res")
 *     assignedGwId = okRes.devId
 *     console.log(assignedGwId)
 *     console.log(okRes)
 *   },
 *   (errRes) => {
 *     debugText("Ng Res")
 *     console.log(errRes)
 *   }
 * )
 * ```
 */
 export async function registerWifiEzDevice(ssid: string, password: string, timeout: number): Promise<any> {
    return TuyaSdkBridge.registerWifiEzDevice(ssid, password, timeout);
}
