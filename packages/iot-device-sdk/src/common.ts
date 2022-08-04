import * as TuyaNative from '@seojw/react-native-tuya';
import { EmitterSubscription, Platform } from 'react-native';

/** @hidden */
export type RegisterGwParam = {
    gw_id: string;
    product_id: string;
    timeout: number;
};

export type RemoveDeviceParams = {
    devId: string;
};

/** @hidden */
export type HgwBean = {
    ip: string;
    gwId: string;
    active: number;
    ability: number;
    lastSeenTime: number;
    mode: number;
    encrypt: boolean;
    productKey: string;
    version: string;
    token: boolean;
    wf_cfg: boolean;
};

/**
 * Debug code enum values from iot-device-sdk's callback.
 * @enum
 */
export enum debugCode {
    /**
     * Not exist login session
     */
    INF_NO_SESSION, // 0, 로그인 세션이 없습니다
    /**
     * Already exist login session
     */
    INF_EXIST_SESSION, // 1, 이미 로그인 세션이 존재합니다
    /**
     * Created anonymous account
     */
    INF_CREATE_ANONYMOUS_ACCOUNT, // 2, 익명 계정을 생성했습니다
    /**
     * Successfully logged in
     */
    INF_LOGIN, // 3, 로그인에 성공했습니다
    /**
     * Successfully logged out
     */
    INF_LOGOUT, // 4, 로그아웃에 성공했습니다
    /**
     * Successfully get home information
     */
    INF_HOMEDETAIL, // 5, 홈 정보를 불러오는데에 성공했습니다
    /**
     * Successfully rename of gateway
     */
    INF_RENAME_GW, // 6, 게이트웨이 이름 변경에 성공했습니다
    /**
     * Successfully reset device
     */
    INF_RESET_DEVICE, // 7, 기기 공장초기화에 성공했습니다
    /**
     * Successfully delete device
     */
    INF_REMOVE_DEVICE, // 8, 기기 삭제에 성공했습니다
    /**
     * startSearchWiredGw has not been called
     */
    WARN_START_SEARCH_WIREDGW_FIRST, // 9, TuyaSdkBridge.startSearchWiredGw()가 호출되지 않았습니다
    /**
     * {@link startRegisterZigbeeSubDevice} has not been called
     */
    WARN_START_REGISTER_ZIGBEE_SUBDEVICE_FIRST, // 10, TuyaSdkBridge.startRegisterZigbeeSubDevice()가 호출되지 않았습니다
    /**
     * User name make shorter
     */
    WARN_CUT_USERNAME, // 11, 사용자 이름을 축약합니다
    /**
     * {@link init} has not been called
     */
    ERR_INIT_FIRST, // 12, TuyaSdkBridge.Init()이 호출되지 않았습니다
    /**
     * Failed to login Tuya account
     */
    ERR_LOGIN, // 13, 투야 로그인에 실패했습니다
    /**
     * Failed to synchronize with tuya account
     */
    ERR_SYNC, // 14, 투야 계정을 Cloud에 Sync하는데에 실패했습니다
    /**
     * Failed to get User information
     */
    ERR_GET_CURRENT_USER, // 15, 유저를 조회하는데 실패했습니다
    /**
     * Failed to create anonymous account
     */
    ERR_CREATE_ANONYMOUS_ACCOUNT, // 16, 익명 계정 생성에 실패했습니다
    /**
     * Failed to get home information
     */
    ERR_HOMEDETAIL, // 17, 홈 정보를 불러오는데 실패했습니다
    /**
     * {@link registerWiredGW} has been already called and not yet finished
     */
    ERR_REGISTER_WIREDGW_ALREADY, // 18, TuyaSdkBridge.registerWiredGW()가 이미 호출되었습니다.
    /**
     * {@link startRegisterZigbeeSubDevice} has been already called and not yet finished
     */
    ERR_START_REGISTER_ZIGBEE_SUBDEVICE_ALREAY, // 19, TuyaSdkBridge.startRegisterZigbeeSubDevice()가 이미 호출되었습니다.
    /**
     * Failed to rename device name of gateway
     */
    ERR_RENAME_GW, // 20, 게이트웨이 이름 변경에 실패했습니다
    /**
     * Failed to reset device
     */
    ERR_RESET_DEVICE, // 21, 기기 공장초기화에 실패했습니다
    /**
     * Failed to delete device
     */
    ERR_REMOVE_DEVICE, // 22, 기기 삭제에 실패했습니다
    /**
     * pnu is too long
     */
    ERR_PNU_TOO_LONG, // 23, pnu가 너무 깁니다
    /**
     * dong is too long
     */
    ERR_DONG_TOO_LONG, // 24, 동의 글자수가 너무 깁니다
    /**
     * ho is too long
     */
    ERR_HO_TOO_LONG, // 25, 호의 글자수가 너무 깁니다
}

/** @hidden */
export class TuyaSdkBridge {
    public static readonly noValueYet: string = '0';
    private static readonly TuyaNameElimentsCount: number = 5;
    private static readonly PnuMaxLength: number = 19;
    private static readonly DongMaxLength: number = 10;
    private static readonly HoMaxLength: number = 10;
    private static readonly UserMaxLength: number = 4;
    private static readonly CombinationNameMaxLength: number = 50;

    private static readonly DefaultCountryCode: string = '82';
    private static readonly DefaultAnonymousName: string = 'anonymousUser';

    // for pass meta information to activator
    private static targetPnu = 'temp-pnu';
    private static targetDong = 'temp-dong';
    private static targetHo = 'temp-ho';
    private static zigbangUserName = 'temp-name';

    // for using access iot sdk
    private static homeId = 0;
    private static basePath = '';
    private static accessToken = '';

    // Event Name which is shared with Native Module
    private static readonly searchingGwDeviceEventName = 'kNotificationFindGatewayDevice';
    private static readonly searchingSubDeviceEventName = 'kNotificationResultSubDevice';

    private static isShowDebugLog = false;

    // Event Emitter to get from Tuya SDK
    private static subscriptionForGw: EmitterSubscription | null;
    private static subscriptionForSubDevice: EmitterSubscription | null;

    // Function variable to callback
    private static wiredGwSearchingEventFunctionPointer: (gw_id: string, product_id: string) => void;
    private static subDeviceRegisterEventFunctionPointer: (result: any) => void;
    private static debugLogEventFunctionPointer: (code: any) => void;
    private static userLoginFunction: (code: any) => Promise<boolean>;

    private static initialized = false;
    private static inProcessRegisterGw = false;
    private static targetGwIdForSubDevice = '';

    private static log(params: any) {
        if (TuyaSdkBridge.isShowDebugLog) {
            console.log(params);
        }
    }

    // Change Information pnu, dongho
    private static setInformation(pnu: string, dong: string, ho: string, username: string) {
        if (pnu.length > TuyaSdkBridge.PnuMaxLength) {
            pnu = pnu.substring(0, TuyaSdkBridge.PnuMaxLength);
            TuyaSdkBridge.debugLogEventFunctionPointer(debugCode.ERR_PNU_TOO_LONG);
            console.error('pnu is too long');
        }

        if (dong.length > TuyaSdkBridge.DongMaxLength) {
            dong = dong.substring(0, TuyaSdkBridge.PnuMaxLength);
            TuyaSdkBridge.debugLogEventFunctionPointer(debugCode.ERR_DONG_TOO_LONG);
            console.error('dong is too long');
        }

        if (ho.length > TuyaSdkBridge.HoMaxLength) {
            ho = ho.substring(0, TuyaSdkBridge.HoMaxLength);
            TuyaSdkBridge.debugLogEventFunctionPointer(debugCode.ERR_HO_TOO_LONG);
            console.error('ho is too long');
        }

        if (username.length > TuyaSdkBridge.UserMaxLength) {
            username = username.substring(0, TuyaSdkBridge.UserMaxLength);
            TuyaSdkBridge.debugLogEventFunctionPointer(debugCode.WARN_CUT_USERNAME);
            console.warn('User name will be shortened');
        }

        TuyaSdkBridge.targetPnu = pnu;
        TuyaSdkBridge.targetDong = dong;
        TuyaSdkBridge.targetHo = ho;
        TuyaSdkBridge.zigbangUserName = username;

        TuyaSdkBridge.log(
            'Set Info: ' +
                TuyaSdkBridge.targetPnu +
                ' ' +
                TuyaSdkBridge.targetDong +
                ' ' +
                TuyaSdkBridge.targetHo +
                ' ' +
                TuyaSdkBridge.zigbangUserName
        );
    }

    // initilize Tuya Sdk Bridge
    public static async init(
        isShowDebugLog: boolean,
        pnu: string,
        dong: string,
        ho: string,
        user: string,
        homeID: number, // avoid duplicate name in home
        logCallback: (code: any) => void,
        loginCallback: (code: any) => Promise<boolean>
    ): Promise<string> {
        // Set Debugging config
        this.debugLogEventFunctionPointer = logCallback;
        this.userLoginFunction = loginCallback;
        TuyaSdkBridge.isShowDebugLog = isShowDebugLog;
        TuyaSdkBridge.setInformation(pnu, dong, ho, user);
        TuyaSdkBridge.homeId = homeID;

        let ErrorOccur = false;
        let ReturnValue = '';

        const result = await TuyaSdkBridge.tuyaLogin();
        if (result) {
            TuyaSdkBridge.debugLogEventFunctionPointer(debugCode.INF_LOGIN);
        } else {
            ErrorOccur = true;
            ReturnValue = '[Tuya Login] 실패';
            TuyaSdkBridge.debugLogEventFunctionPointer(debugCode.ERR_LOGIN);
        }

        return new Promise((resolve, reject) => {
            if (ErrorOccur) {
                reject(ReturnValue);
            } else {
                TuyaSdkBridge.initialized = true;
                resolve('성공');
            }
        });
    }

    public static startSearchWiredGW(callback: (gw_id: string, product_id: string) => void): boolean {
        let returnValue = false;

        if (TuyaSdkBridge.initialized == false) {
            TuyaSdkBridge.debugLogEventFunctionPointer(debugCode.ERR_INIT_FIRST);
            console.error('Call TuyaSdkBridge.Init() first');
        } else if (!TuyaSdkBridge.subscriptionForGw) {
            TuyaNative.startSearcingGwDevice();
            TuyaSdkBridge.wiredGwSearchingEventFunctionPointer = callback;
            if (Platform.OS === 'ios') {
                TuyaSdkBridge.subscriptionForGw = TuyaNative.addEvent(
                    TuyaSdkBridge.searchingGwDeviceEventName,
                    TuyaSdkBridge.searchingInternalFunctionForIos
                );
            } else {
                TuyaSdkBridge.subscriptionForGw = TuyaNative.addEvent(
                    TuyaSdkBridge.searchingGwDeviceEventName,
                    TuyaSdkBridge.searchingInternalFunctionForAndroid
                );
            }
            returnValue = true;
        }

        return returnValue;
    }

    public static stopSearchWiredGW() {
        let ReturnValue = false;

        if (TuyaSdkBridge.subscriptionForGw != null) {
            TuyaNative.removeEvent(TuyaSdkBridge.searchingGwDeviceEventName);

            TuyaSdkBridge.subscriptionForGw = null;
            ReturnValue = true;
        } else {
            TuyaSdkBridge.debugLogEventFunctionPointer(debugCode.WARN_START_SEARCH_WIREDGW_FIRST);
            console.warn('startSearchWiredGW is not called');
        }

        return ReturnValue;
    }

    public static async registerWiredGW(gw_id: string, product_id: string, timeout: number): Promise<any> {
        let returnValue: any;
        let errorOccur = false;

        if (TuyaSdkBridge.initialized == false) {
            errorOccur = true;
            returnValue = 'Call TuyaSdkBridge.init() first';
            TuyaSdkBridge.debugLogEventFunctionPointer(debugCode.ERR_INIT_FIRST);
        } else if (TuyaSdkBridge.inProcessRegisterGw) {
            errorOccur = true;
            returnValue = 'registerWiredGW is started already';
            TuyaSdkBridge.debugLogEventFunctionPointer(debugCode.ERR_REGISTER_WIREDGW_ALREADY);
        } else {
            TuyaSdkBridge.inProcessRegisterGw = true;

            let passParam: any;
            if (Platform.OS === 'ios') {
                passParam = {
                    homeId: TuyaSdkBridge.homeId,
                    time: timeout,
                    gwId: gw_id,
                    productId: product_id,
                };
            } else {
                passParam = {
                    homeId: TuyaSdkBridge.homeId,
                    time: timeout,
                    devId: gw_id,
                    productId: product_id, // Ignored
                };
            }

            await TuyaNative.initSearchedGwDevice(passParam).then(
                (okRes: any) => {
                    returnValue = okRes;
                    const CombinationName: string = TuyaSdkBridge.getCombinationTuyaName(okRes.name);
                    TuyaNative.renameDevice({ devId: okRes.devId, name: CombinationName }).then(
                        (RenameOkRes: string) => {
                            TuyaSdkBridge.debugLogEventFunctionPointer(debugCode.INF_RENAME_GW);
                            RenameOkRes += ''; // avoid unused variable warning
                        },
                        (RenameNgRes: string) => {
                            TuyaSdkBridge.debugLogEventFunctionPointer(debugCode.ERR_RENAME_GW);
                            returnValue = RenameNgRes;
                            errorOccur = true;
                        }
                    );
                },
                (errRes: any) => {
                    returnValue = errRes;
                    errorOccur = true;
                }
            );

            TuyaSdkBridge.inProcessRegisterGw = false;
        }

        return new Promise((resolve, reject) => {
            if (errorOccur) {
                console.error(returnValue);
                reject(returnValue);
            } else {
                resolve(returnValue);
            }
        });
    }

    // 이벤트 리스너 등록 및 등록 시작
    public static async startRegisterZigbeeSubDevice(
        gw_id: string,
        timeout: number,
        callback: (result: any) => void
    ): Promise<boolean> {
        let errorOccur = false;
        let returnValue: any;

        if (TuyaSdkBridge.initialized == false) {
            errorOccur = true;
            returnValue = 'Call TuyaSdkBridge.Init() first';
            TuyaSdkBridge.debugLogEventFunctionPointer(debugCode.ERR_INIT_FIRST);
        } else if (TuyaSdkBridge.subscriptionForSubDevice) {
            errorOccur = true;
            returnValue = 'StartRegisterZigbeeSubDevice is started already';
            TuyaSdkBridge.debugLogEventFunctionPointer(debugCode.ERR_START_REGISTER_ZIGBEE_SUBDEVICE_ALREAY);
        } else {
            TuyaSdkBridge.subscriptionForSubDevice = TuyaNative.addEvent(
                TuyaSdkBridge.searchingSubDeviceEventName,
                TuyaSdkBridge.subDeviceEventInternalFunction
            );
            TuyaSdkBridge.targetGwIdForSubDevice = gw_id;
            TuyaSdkBridge.subDeviceRegisterEventFunctionPointer = callback;

            const passParam: TuyaNative.RegistSubForGwParams = {
                devId: gw_id, // devId
                time: timeout,
            };

            TuyaNative.startGwSubDevActivator(passParam).then(
                (okRes: any) => {
                    returnValue = okRes;
                },
                (errRes: any) => {
                    errorOccur = true;
                    returnValue = errRes;
                }
            );

            returnValue = true;
        }

        return new Promise((resolve, reject) => {
            if (errorOccur) {
                console.error(returnValue);
                reject(returnValue);
            } else {
                resolve(returnValue);
            }
        });
    }

    // 이벤트 리스너 해제
    public static async stopRegisterZigbeeSubDevice() {
        let returnValue = false;

        if (TuyaSdkBridge.subscriptionForSubDevice) {
            if (Platform.OS === 'ios') {
                TuyaNative.stopNewGwSubDevActivatorConfig({ devId: TuyaSdkBridge.targetGwIdForSubDevice });
            } else {
                TuyaNative.stopConfig();
            }
            TuyaNative.removeSubscribtion(TuyaSdkBridge.subscriptionForSubDevice);
            TuyaNative.removeEvent(TuyaSdkBridge.searchingSubDeviceEventName);
            TuyaSdkBridge.subscriptionForSubDevice = null;
            returnValue = true;
        } else {
            console.warn('StartRegisterZigbeeSubDevice is not called');
            TuyaSdkBridge.debugLogEventFunctionPointer(debugCode.WARN_START_REGISTER_ZIGBEE_SUBDEVICE_FIRST);
        }

        return returnValue;
    }

    // 기기 삭제
    public static async removeDevice(devId: RemoveDeviceParams, reset: boolean): Promise<boolean> {
        let returnValue: any = false;
        if (reset) {
            await TuyaNative.resetDevice(devId)
                .then((result) => {
                    console.log(result, 'Success!');
                    TuyaSdkBridge.debugLogEventFunctionPointer(debugCode.INF_RESET_DEVICE);
                    returnValue = true;
                })
                .catch((e) => {
                    console.log(e, 'Error!');
                    TuyaSdkBridge.debugLogEventFunctionPointer(debugCode.ERR_RESET_DEVICE);
                });
        } else {
            await TuyaNative.removeDevice(devId)
                .then((result) => {
                    console.log(result, 'Success!');
                    TuyaSdkBridge.debugLogEventFunctionPointer(debugCode.INF_REMOVE_DEVICE);
                    returnValue = true;
                })
                .catch((e) => {
                    console.log(e, 'Error!');
                    TuyaSdkBridge.debugLogEventFunctionPointer(debugCode.ERR_REMOVE_DEVICE);
                });
        }
        return returnValue;
    }

    // 투야 계정 로그아웃
    private static async logout(): Promise<boolean> {
        let returnValue = false;
        await TuyaNative.getCurrentUser()
            .then(async (result) => {
                if (Platform.OS === 'ios' && result?.username === '') {
                    TuyaSdkBridge.debugLogEventFunctionPointer(debugCode.INF_NO_SESSION);
                    return;
                }

                await TuyaNative.logout();
                // <iOS> 성공 - success 리턴, 실패 - (세션이 없는 경우) success 리턴, (세션이 만료된 경우) 체크 필요
                // <android> 성공 - success 리턴, 실패 - (세션이 없는 경우) [Error: Session is not exist and need login again] 리턴, (세션이 만료된 경우) 체크 필요

                TuyaSdkBridge.debugLogEventFunctionPointer(debugCode.INF_LOGOUT);
                returnValue = true;
            })
            .catch((e) => {
                console.log(e, 'Login First!');
                TuyaSdkBridge.debugLogEventFunctionPointer(debugCode.INF_NO_SESSION);
            });
        return returnValue;
    }

    // private static debugLogEventInternalFunction(log: any) {
    // }

    // 콜백함수 : 기기 이름 변경 수행
    private static async subDeviceEventInternalFunction(result: any) {
        TuyaSdkBridge.log(result);
        if (result.result == 'onError') {
            TuyaSdkBridge.log('onError');
            TuyaSdkBridge.stopRegisterZigbeeSubDevice();
        } else if (result.result == 'onActiveSuccess') {
            TuyaSdkBridge.log('onActiveSuccess');
            const combinationName: string = TuyaSdkBridge.getCombinationTuyaName(result.var1.name);
            try {
                await TuyaNative.renameDevice({ devId: result.var1.devId, name: combinationName });
                result.var1.name = combinationName;
                TuyaSdkBridge.debugLogEventFunctionPointer(debugCode.INF_RENAME_GW);
            } catch (e) {
                TuyaSdkBridge.debugLogEventFunctionPointer(debugCode.ERR_RENAME_GW);
            }
            TuyaSdkBridge.subDeviceRegisterEventFunctionPointer(result);
        } else {
            TuyaSdkBridge.log('Others');
        }
    }

    private static readonly delimiter: string = '/';
    private static getCombinationTuyaName(deviceName: string): string {
        const tokens: string[] = deviceName.split(TuyaSdkBridge.delimiter);

        if (tokens.length >= TuyaSdkBridge.TuyaNameElimentsCount) {
            deviceName = TuyaSdkBridge.getNameFromCombinationTuya(deviceName);
        } else {
            deviceName = tokens[0];
        }

        const elements: string[] = [
            TuyaSdkBridge.targetPnu,
            TuyaSdkBridge.targetDong,
            TuyaSdkBridge.targetHo,
            TuyaSdkBridge.zigbangUserName,
        ];

        const postNameValue = elements.join(TuyaSdkBridge.delimiter);

        if (postNameValue.length + deviceName.length + 1 > TuyaSdkBridge.CombinationNameMaxLength) {
            deviceName = deviceName.substring(0, TuyaSdkBridge.CombinationNameMaxLength - postNameValue.length - 1);
        }

        return deviceName + '/' + postNameValue;
    }

    private static getNameFromCombinationTuya(combinationName: string): string {
        const tokens: string[] = combinationName.split(TuyaSdkBridge.delimiter);

        if (tokens.length >= TuyaSdkBridge.TuyaNameElimentsCount) {
            tokens.pop(); // remove Ho
            tokens.pop(); // remove Dong
            tokens.pop(); // remove PNU
            tokens.pop(); // remove userName
        }

        return tokens.join(TuyaSdkBridge.delimiter);
    }

    private static async searchingInternalFunction(gwId: string, productId: string) {
        if (TuyaSdkBridge.subscriptionForGw != null) {
            if (Platform.OS === 'android') {
                TuyaNative.startSearcingGwDevice(); // Call again continuously called events
            }
            TuyaSdkBridge.wiredGwSearchingEventFunctionPointer(gwId, productId);
        } else {
            TuyaSdkBridge.stopSearchWiredGW(); // adjust sync problem
        }
    }

    private static async searchingInternalFunctionForAndroid(gwInfo: HgwBean) {
        // Android has more information, pick some to fit common interface
        TuyaSdkBridge.searchingInternalFunction(gwInfo.gwId, gwInfo.productKey);
    }

    private static async searchingInternalFunctionForIos(gwInfo: { gwId: string; productId: string }) {
        // Android has more information, pick some to fit common interface
        TuyaSdkBridge.searchingInternalFunction(gwInfo.gwId, gwInfo.productId);
    }

    public static async tuyaLogin(): Promise<boolean> {
        let returnValue = false;

        await TuyaNative.getCurrentUser()
            .then((result) => {
                if (Platform.OS === 'ios' && result?.username === '') {
                    console.log('세션 부재', result);
                    TuyaSdkBridge.debugLogEventFunctionPointer(debugCode.INF_NO_SESSION);
                    throw new Error('Session does not exist');
                }
                console.log('세션 존재', result);
                TuyaSdkBridge.debugLogEventFunctionPointer(debugCode.INF_EXIST_SESSION);
                returnValue = true;
            })
            .catch(async (error) => {
                console.log('세션 부재', error);
                TuyaSdkBridge.debugLogEventFunctionPointer(debugCode.INF_NO_SESSION);
                await TuyaNative.touristRegisterAndLogin({
                    countryCode: TuyaSdkBridge.DefaultCountryCode,
                    username: TuyaSdkBridge.DefaultAnonymousName,
                })
                    .then(async () => {
                        TuyaSdkBridge.debugLogEventFunctionPointer(debugCode.INF_CREATE_ANONYMOUS_ACCOUNT);
                        await TuyaNative.getCurrentUser()
                            .then(async (result: TuyaNative.User | null) => {
                                const { uid } = result!;
                                await this.userLoginFunction(uid)
                                    .then(async () => {
                                        returnValue = true;
                                    })
                                    .catch(async () => {
                                        await this.logout();
                                    });
                            })
                            .catch((error) => {
                                console.log('유저 조회 오류', error);
                                TuyaSdkBridge.debugLogEventFunctionPointer(debugCode.ERR_GET_CURRENT_USER);
                            });
                    })
                    .catch((error) => {
                        console.log('익명 계정 생성 오류', error);
                        TuyaSdkBridge.debugLogEventFunctionPointer(debugCode.ERR_CREATE_ANONYMOUS_ACCOUNT);
                    });
            });

        return returnValue;
    }
}
