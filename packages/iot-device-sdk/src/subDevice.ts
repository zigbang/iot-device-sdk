import { TuyaSdkBridge } from './common';

/**
 * Start registration zigbee devices under gateway <br/>
 * It registers automatically if devices are found.
 * Callback function offer sub device detail information.
 *
 * @param gw_id - gateway id that zigbee device is connected to
 * @param timeout - maximum timeout for sub devices registration, unit is seconds
 * @param callback - Callback function for get information about registration
 *
 * @returns Function's result
 *
 * @example
 * ```ts
 *  const registerNotificationForSubDevice = async (result: any) => {
 *   console.log(result)
 * }
 *
 * iot-device-sdk.startRegisterZigbeeSubDevice(
 *   "eb9a55f0d10d1c9a11luux",
 *   100,
 *   registerNotificationForSubDevice
 * ).then(
 *   (okRes: boolean) => {
 *     debugText("Ok Res")
 *   },
 *   (errRes) => {
 *     debugText("Ng Res")
 *   }
 * )
 * ```
 */
export async function startRegisterZigbeeSubDevice(
    gw_id: string,
    timeout: number,
    callback: (result: any) => void
): Promise<boolean> {
    return TuyaSdkBridge.startRegisterZigbeeSubDevice(gw_id, timeout, callback);
}

/**
 * Stop registration zigbee devices
 *
 * @returns true - ok. false - startRegisterZigbeeSubDevice was not called or already done
 *
 * @example
 * ```ts
 * setTimeout(() => {
 *   iot-device-sdk.stopRegisterZigbeeSubDevice()
 * }, 100000)
 * ```
 */
export async function stopRegisterZigbeeSubDevice(): Promise<boolean> {
    return TuyaSdkBridge.stopRegisterZigbeeSubDevice();
}
