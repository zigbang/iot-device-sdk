import * as TuyaNative from "@zigbang/react-native-tuya"
import { EmitterSubscription, Platform } from "react-native"
import { registerSubDeviceResponse } from "@types"
import { V1AdminTuya } from "@zigbang/iot-sdk"

// ToDo Use elements
export type RegisterGwParam = {
	gw_id: string
	product_id: string
	timeout: number
}

// const debugCode = {
// 	INF_NO_SESSION: { code: 100, message: "로그인 세션이 없습니다" },
// 	INF_EXIST_SESSION: { code: 100, message: "이미 로그인 세션이 존재합니다" },
// 	INF_CREATE_ANONYACCOUNT: { code: 100, message: "익명 계정을 생성했습니다" },
// 	INF_SUCCESS: { code: 200, message: "성공" },
// 	ERR_INIT_FIRST: { code: 400, message: "TuyaSdkBridge.Init()이 호출되지 않았습니다" },
// 	ERR_PNU_LONG: { code: 400, message: "pnu가 너무 깁니다" },
// 	ERR_LOGIN: { code: 500, message: "투야 로그인에 실패했습니다" },
// 	ERR_HOMEDETAIL: { code: 500, message: "홈 정보를 불러오는데 실패했습니다" },
// }

// const enum debugCode {
// 	INF_NO_SESSION, 		 // 0, 로그인 세션이 없습니다
// 	INF_EXIST_SESSION,  	 // 1, 이미 로그인 세션이 존재합니다
// 	INF_CREATE_ANONYACCOUNT, // 2, 익명 계정을 생성했습니다
// 	INF_SUCCESS, 			 // 3, 성공
// 	ERR_INIT_FIRST, 		 // 4, TuyaSdkBridge.Init()이 호출되지 않았습니다
// 	ERR_PNU_LONG, 			 // 5, pnu가 너무 깁니다
// 	ERR_LOGIN, 				 // 6, 투야 로그인에 실패했습니다
// 	ERR_HOMEDETAIL, 		 // 7, 홈 정보를 불러오는데 실패했습니다
// }

export class TuyaSdkBridge {
	public static readonly noValueYet: string = "0"
	private static readonly TuyaNameElimentsCount: number = 5
	private static readonly PnuMaxLength: number = 19
	private static readonly DongMaxLength: number = 10
	private static readonly HoMaxLength: number = 10
	private static readonly UserMaxLength: number = 4
	private static readonly CombinationNameMaxLength: number = 50

	private static readonly DefaultCountryCode: string = "82"
	private static readonly DefaultAnonymousName: string = "anonymousUser"

	// for pass meta information to activator
	private static targetPnu: string = "temp-pnu"
	private static targetDong: string = "temp-dong"
	private static targetHo: string = "temp-ho"
	private static zigbangUserName: string = "temp-name"

	// for using access iot sdk
	private static homeId: number = 0
	private static basePath: string = ""
	private static accessToken: string = ""

	// Event Name which is shared with Native Module
	private static readonly searchingGwDeviceEventName = "kNotificationFindGatewayDevice"
	private static readonly searchingSubDeviceEventName = "kNotificationResultSubDevice"

	private static isShowDebugLog: boolean = false

	// Event Emitter to get from Tuya SDK
	private static subscriptionForGw: EmitterSubscription | null
	private static subscriptionForSubDevice: EmitterSubscription | null

	// Function variable to callback
	private static wiredGwSearchingEventFunctionPointer: (gw_id: string, product_id: string) => void
	private static subDeviceRegisterEventFunctionPointer: (result: any) => void
	// private static debugLogEventFunctionPointer: (code: any, message: any) => void

	private static initialized: boolean = false

	private static log(params: any) {
		if (TuyaSdkBridge.isShowDebugLog) {
			console.log(params)
		}
	}

	// Change Information pnu, dongho
	private static setInformation(pnu: string, dong: string, ho: string, username: string) {
		if (pnu.length > TuyaSdkBridge.PnuMaxLength) {
			pnu = pnu.substring(0, TuyaSdkBridge.PnuMaxLength)
			console.error("pnu is too long")
		}

		if (dong.length > TuyaSdkBridge.DongMaxLength) {
			dong = dong.substring(0, TuyaSdkBridge.PnuMaxLength)
			console.error("dong is too long")
		}

		if (ho.length > TuyaSdkBridge.HoMaxLength) {
			ho = ho.substring(0, TuyaSdkBridge.HoMaxLength)
			console.error("ho is too long")
		}

		if (username.length > TuyaSdkBridge.UserMaxLength) {
			username = username.substring(0, TuyaSdkBridge.UserMaxLength)
			console.warn("User name will be shortened")
		}

		TuyaSdkBridge.targetPnu = pnu
		TuyaSdkBridge.targetDong = dong
		TuyaSdkBridge.targetHo = ho
		TuyaSdkBridge.zigbangUserName = username

		TuyaSdkBridge.log(
			"Set Info: " +
				TuyaSdkBridge.targetPnu +
				" " +
				TuyaSdkBridge.targetDong +
				" " +
				TuyaSdkBridge.targetHo +
				" " +
				TuyaSdkBridge.zigbangUserName
		)
	}

	// initilize Tuya Sdk Bridge
	public static async init(
		isShowDebugLog: boolean,
		pnu: string,
		dong: string,
		ho: string,
		user: string,
		host: string,
		homeID: number, // avoid duplicate name in home
		token: string
		// logCallback: (code: any, message: any) => void
	): Promise<string> {
		// Set Debugging config
		TuyaSdkBridge.isShowDebugLog = isShowDebugLog
		TuyaSdkBridge.setInformation(pnu, dong, ho, user)
		TuyaSdkBridge.basePath = host
		TuyaSdkBridge.accessToken = token
		TuyaSdkBridge.homeId = homeID
		// TuyaSdkBridge.debugLogEventFunctionPointer = logCallback

		console.log(host, homeID, token)

		let ErrorOccur = false
		let ReturnValue: string = ""

		const result = await TuyaSdkBridge.tuyaLogin()
		if (result) {
			console.log("[Tuya Login] 성공")
			await TuyaNative.getHomeDetail({ homeId: homeID })
				.then(() => {
					console.log("[getHomeDetail] 성공")
					// TuyaSdkBridge.debugLogEventInternalFunction(debugCode.INF_SUCCESS.code, debugCode.INF_SUCCESS.message)
				})
				.catch(async (NgRes: any) => {
					await this.logout()
					ErrorOccur = true
					ReturnValue = "[getHomeDetail] " + NgRes
				})
		} else {
			ErrorOccur = true
			ReturnValue = "[Tuya Login] 실패"
		}

		return new Promise((resolve, reject) => {
			if (ErrorOccur) {
				reject(ReturnValue)
			} else {
				TuyaSdkBridge.initialized = true
				resolve("성공")
			}
		})
	}

	public static startSearchWiredGW(callback: (gw_id: string, product_id: string) => void): boolean {
		let returnValue: boolean = false

		if (TuyaSdkBridge.initialized == false) {
			console.error("Call TuyaSdkBridge.Init() first")
		} else if (!TuyaSdkBridge.subscriptionForGw) {
			TuyaNative.startSearcingGwDevice()
			TuyaSdkBridge.wiredGwSearchingEventFunctionPointer = callback
			if (Platform.OS === "ios") {
				TuyaSdkBridge.subscriptionForGw = TuyaNative.addEvent(
					TuyaSdkBridge.searchingGwDeviceEventName,
					TuyaSdkBridge.searchingInternalFunctionForIos
				)
			} else {
				TuyaSdkBridge.subscriptionForGw = TuyaNative.addEvent(
					TuyaSdkBridge.searchingGwDeviceEventName,
					TuyaSdkBridge.searchingInternalFunctionForAndroid
				)
			}
			returnValue = true
		}

		return returnValue
	}

	public static stopSearchWiredGW() {
		let ReturnValue: boolean = false

		if (TuyaSdkBridge.subscriptionForGw != null) {
			TuyaNative.removeEvent(TuyaSdkBridge.searchingGwDeviceEventName)

			TuyaSdkBridge.subscriptionForGw = null
			ReturnValue = true
		} else {
			console.warn("startSearchWiredGW is not called")
		}

		return ReturnValue
	}

	private static inProcessRegisterGw = false
	public static async registerWiredGW(gw_id: string, product_id: string, timeout: number): Promise<any> {
		let returnValue: any
		let errorOccur: boolean = false

		if (TuyaSdkBridge.initialized == false) {
			errorOccur = true
			returnValue = "Call TuyaSdkBridge.init() first"
		} else if (TuyaSdkBridge.inProcessRegisterGw) {
			errorOccur = true
			returnValue = "registerWiredGW is started already"
		} else {
			TuyaSdkBridge.inProcessRegisterGw = true

			let passParam: any
			if (Platform.OS === "ios") {
				passParam = {
					homeId: TuyaSdkBridge.homeId,
					time: timeout,
					gwId: gw_id,
					productId: product_id,
				}
			} else {
				passParam = {
					homeId: TuyaSdkBridge.homeId,
					time: timeout,
					devId: gw_id,
					productId: product_id, // Ignored
				}
			}

			await TuyaNative.initSearchedGwDevice(passParam).then(
				(okRes: any) => {
					returnValue = okRes
					let CombinationName: string = TuyaSdkBridge.getCombinationTuyaName(okRes.name)
					TuyaNative.renameDevice({ devId: okRes.devId, name: CombinationName }).then(
						(RenameOkRes: string) => {
							TuyaSdkBridge.log("OK to rename GW")
							RenameOkRes += "" // avoid unused variable warning
						},
						(RenameNgRes: string) => {
							TuyaSdkBridge.log("NG to rename GW")
							returnValue = RenameNgRes
							errorOccur = true
						}
					)
				},
				(errRes: any) => {
					returnValue = errRes
					errorOccur = true
				}
			)

			TuyaSdkBridge.inProcessRegisterGw = false
		}

		return new Promise((resolve, reject) => {
			if (errorOccur) {
				console.error(returnValue)
				reject(returnValue)
			} else {
				resolve(returnValue)
			}
		})
	}

	private static targetGwIdForSubDevice: string = ""
	// 이벤트 리스너 등록 및 등록 시작
	public static async startRegisterZigbeeSubDevice(
		gw_id: string,
		timeout: number,
		callback: (result: registerSubDeviceResponse) => void
	): Promise<boolean> {
		let errorOccur = false
		let returnValue: any

		if (TuyaSdkBridge.initialized == false) {
			errorOccur = true
			returnValue = "Call TuyaSdkBridge.Init() first"
		} else if (TuyaSdkBridge.subscriptionForSubDevice) {
			errorOccur = true
			returnValue = "StartRegisterZigbeeSubDevice is started already"
		} else {
			TuyaSdkBridge.subscriptionForSubDevice = TuyaNative.addEvent(
				TuyaSdkBridge.searchingSubDeviceEventName,
				TuyaSdkBridge.subDeviceEventInternalFunction
			)
			TuyaSdkBridge.targetGwIdForSubDevice = gw_id
			TuyaSdkBridge.subDeviceRegisterEventFunctionPointer = callback
			let passParam: TuyaNative.RegistSubForGwParams
			passParam = {
				devId: gw_id, // devId
				time: timeout,
			}

			TuyaNative.startGwSubDevActivator(passParam).then(
				(okRes: any) => {
					returnValue = okRes
				},
				(errRes: any) => {
					errorOccur = true
					returnValue = errRes
				}
			)

			returnValue = true
		}

		return new Promise((resolve, reject) => {
			if (errorOccur) {
				console.error(returnValue)
				reject(returnValue)
			} else {
				resolve(returnValue)
			}
		})
	}

	// 이벤트 리스너 해제
	public static async stopRegisterZigbeeSubDevice() {
		let returnValue: boolean = false

		if (TuyaSdkBridge.subscriptionForSubDevice) {
			if (Platform.OS === "ios") {
				TuyaNative.stopNewGwSubDevActivatorConfig({ devId: TuyaSdkBridge.targetGwIdForSubDevice })
			} else {
				TuyaNative.stopConfig()
			}
			TuyaNative.removeSubscribtion(TuyaSdkBridge.subscriptionForSubDevice)
			TuyaNative.removeEvent(TuyaSdkBridge.searchingSubDeviceEventName)
			TuyaSdkBridge.subscriptionForSubDevice = null
			returnValue = true
		} else {
			console.warn("StartRegisterZigbeeSubDevice is not called")
		}

		return returnValue
	}

	// 디바이스 삭제
	public static async removeDevice(devId: TuyaNative.RemoveDeviceParams, reset: boolean): Promise<boolean> {
		let returnValue: any = false
		if (reset) {
			await TuyaNative.resetDevice(devId)
				.then((result) => {
					console.log(result, "Success!")
					returnValue = true
				})
				.catch((e) => {
					console.log(e, "Error!")
				})
		} else {
			await TuyaNative.removeDevice(devId)
				.then((result) => {
					console.log(result, "Success!")
					returnValue = true
				})
				.catch((e) => {
					console.log(e, "Error!")
				})
		}
		return returnValue
	}

	// 투야 계정 로그아웃
	private static async logout(): Promise<boolean> {
		let returnValue: boolean = false
		await TuyaNative.getCurrentUser()
			.then(async (result) => {
				if (Platform.OS === "ios" && result?.username === "") {
					console.log("Login First!")
					return
				}

				await TuyaNative.logout()
				// <iOS> 성공 - success 리턴, 실패 - (세션이 없는 경우) success 리턴, (세션이 만료된 경우) 체크 필요
				// <android> 성공 - success 리턴, 실패 - (세션이 없는 경우) [Error: Session is not exist and need login again] 리턴, (세션이 만료된 경우) 체크 필요

				console.log("Logout Success!")
				returnValue = true
			})
			.catch((e) => {
				console.log(e, "Login First!")
			})
		return returnValue
	}

	// private static debugLogEventInternalFunction(log: any) {
	// }

	// 콜백함수 : 기기 이름 변경 수행
	private static async subDeviceEventInternalFunction(result: any) {
		TuyaSdkBridge.log("subDeviceEventInternalFunction is called")
		TuyaSdkBridge.log(result)
		if (result.result == "onError") {
			TuyaSdkBridge.log("onError")
			TuyaSdkBridge.stopRegisterZigbeeSubDevice()
		} else if (result.result == "onActiveSuccess") {
			TuyaSdkBridge.log("onActiveSuccess")
			const combinationName: string = TuyaSdkBridge.getCombinationTuyaName(result.var1.name)
			try {
				await TuyaNative.renameDevice({ devId: result.var1.devId, name: combinationName })
				result.var1.name = combinationName
				TuyaSdkBridge.log("OK to rename GW")
			} catch (e) {
				TuyaSdkBridge.log("NG to rename GW")
			}
			TuyaSdkBridge.subDeviceRegisterEventFunctionPointer(result)
		} else {
			TuyaSdkBridge.log("Others")
		}
	}

	private static readonly delimiter: string = "/"
	private static getCombinationTuyaName(deviceName: string): string {
		let tokens: string[] = deviceName.split(TuyaSdkBridge.delimiter)

		if (tokens.length >= TuyaSdkBridge.TuyaNameElimentsCount) {
			deviceName = TuyaSdkBridge.getNameFromCombinationTuya(deviceName)
		} else {
			deviceName = tokens[0]
		}

		const elements: string[] = [
			TuyaSdkBridge.targetPnu,
			TuyaSdkBridge.targetDong,
			TuyaSdkBridge.targetHo,
			TuyaSdkBridge.zigbangUserName,
		]

		let postNameValue = elements.join(TuyaSdkBridge.delimiter)

		if (postNameValue.length + deviceName.length + 1 > TuyaSdkBridge.CombinationNameMaxLength) {
			deviceName = deviceName.substring(0, TuyaSdkBridge.CombinationNameMaxLength - postNameValue.length - 1)
		}

		return deviceName + "/" + postNameValue
	}

	private static getNameFromCombinationTuya(combinationName: string): string {
		const tokens: string[] = combinationName.split(TuyaSdkBridge.delimiter)

		if (tokens.length >= TuyaSdkBridge.TuyaNameElimentsCount) {
			tokens.pop() // remove Ho
			tokens.pop() // remove Dong
			tokens.pop() // remove PNU
			tokens.pop() // remove userName
		}

		return tokens.join(TuyaSdkBridge.delimiter)
	}

	private static async searchingInternalFunction(gwId: string, productId: string) {
		if (TuyaSdkBridge.subscriptionForGw != null) {
			if (Platform.OS === "android") {
				TuyaNative.startSearcingGwDevice() // Call again continuously called events
			}
			TuyaSdkBridge.wiredGwSearchingEventFunctionPointer(gwId, productId)
		} else {
			TuyaSdkBridge.stopSearchWiredGW() // adjust sync problem
		}
	}

	private static async searchingInternalFunctionForAndroid(gwInfo: TuyaNative.HgwBean) {
		// Android has more information, pick some to fit common interface
		TuyaSdkBridge.searchingInternalFunction(gwInfo.gwId, gwInfo.productKey)
	}

	private static async searchingInternalFunctionForIos(gwInfo: { gwId: string; productId: string }) {
		// Android has more information, pick some to fit common interface
		TuyaSdkBridge.searchingInternalFunction(gwInfo.gwId, gwInfo.productId)
	}

	public static async tuyaLogin(): Promise<boolean> {
		let returnValue: boolean = false

		await TuyaNative.getCurrentUser()
			.then((result) => {
				if (Platform.OS === "ios" && result?.username === "") {
					console.log("세션 부재", result)
					throw new Error("Session does not exist")
				}
				console.log("세션 존재", result)
				returnValue = true
			})
			.catch(async (error) => {
				console.log("세션 부재", error)
				await TuyaNative.touristRegisterAndLogin({
					countryCode: TuyaSdkBridge.DefaultCountryCode,
					username: TuyaSdkBridge.DefaultAnonymousName,
				})
					.then(async () => {
						console.log("익명 계정 생성 완료")
						await TuyaNative.getCurrentUser()
							.then(async (result: TuyaNative.User | null) => {
								const uid = result!.uid
								const v1AdminTuya = new V1AdminTuya({
									basePath: TuyaSdkBridge.basePath,
									accessToken: TuyaSdkBridge.accessToken,
								})
								await v1AdminTuya
									.sync({ tuyaId: uid })
									.then(async (paasUserOkRes) => {
										console.log(paasUserOkRes)
										returnValue = true
									})
									.catch(async (paasUserNgRes) => {
										console.log("V1AdminTuya 오류", paasUserNgRes)
										await this.logout()
									})
							})
							.catch((error) => {
								console.log("내부 유저 조회 오류", error)
							})
					})
					.catch((error) => {
						console.log("내부 익명 계정 생성 오류", error)
					})
			})

		return returnValue
	}
}
