import { TuyaSdkBridge } from './common';

/**
 * Start searching wired gateway <br/>
 * Both information gw_id and product_id can be collected by callback
 *
 * @param callback - Callback function for offer gateway information(gw_id, product_id)
 *
 * @returns Function's result. It returns false if startSearchWiredGW is called already before done
 *
 * @example
 * ```ts
 * let tempScannedData = []
 *
 * function filterNotification(gwId: string, productId: string) {
 *   const result = tempScannedData.filter((tempScannedData) => {
 *     if (tempScannedData.productId == productId) {
 *       return true
 *     }
 *   })
 *   if (result.length == 0) {
 *     tempScannedData.push({ gwId: gwId, productId: productId })
 *   }
 * }
 * ```
 */
export function startSearchWiredGW(callback: (gw_id: string, product_id: string) => void): boolean {
    return TuyaSdkBridge.startSearchWiredGW(callback);
}

/**
 * Stop searching wired gateway
 *
 * @returns true - ok. false - startSearchWiredGW was not called or already done
 *
 * @example
 * ```ts
 *  setTimeout(() => {
 *   iot-device-sdk.stopSearchWiredGW()
 * }, 100000)
 * ```
 */
export function stopSearchWiredGW() {
    return TuyaSdkBridge.stopSearchWiredGW();
}

/**
 * Register wired gateway <br/>
 * In case success registration, Thing name is made by combination(building/dong/ho/user (zGuard meta info.)
 *
 * @param gw_id - gateway id for registration
 * @param product_id - product id for registration
 * @param timeout - maximum timeout for registration
 *
 * @returns Success and failure details as a result
 *  - in case OK: [ref](https://github.com/iot-device-sdk/blob/main/packages/iot-device-sdk/sample-gw.md)
 *  - in case Processing: registerWiredGW is started
 *  - in case Occur Timeout: Timeout
 * @example
 * ```ts
 * iot-device-sdk.registerWiredGw({
 *   "eb9a55f0d10d1c9a11luux",
 *   "keyyj3fy8x98arty",
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
export async function registerWiredGW(gw_id: string, product_id: string, timeout: number): Promise<any> {
    return TuyaSdkBridge.registerWiredGW(gw_id, product_id, timeout);
}
