import * as TuyaNative from "@zigbang/react-native-tuya"
import { EmitterSubscription, Platform } from "react-native"
import axios from "axios"
import { RegisterTuyaGWResponse, registerSubDeviceResponse } from "@types"

type TuyaSdkAccountInfo = {
	countryCode: string
	username: string
	email: string
	password: string
	homeid: number
}

// ToDo Use elements
export type RegisterGwParam = {
	gw_id: string
	product_id: string
	timeout: number
}

type TuyaDeviceEntry = {
	name: string
	devId: string
	deviceType: number
	productId: string
	iconUrl: string
	isOnline: boolean
	isNewFirmware: boolean
	verSw: string
	zigBeeWifi: boolean // 추가 점검 필요
	categoryCode: string // 추가 점검 필요
	uuid: string // 추가 점검 필요
}

export class TuyaSdkBridge {
	public static readonly noValueYet: string = "0"

	// for pass meta information to activator
	private static targetPnu: string = "temp-pnu"
	private static targetDongho: string = "temp-dongho"
	private static zigbangUserName: string = "temp-name"
	private static host: string = ""

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

	private static tuyaInfo: TuyaSdkAccountInfo = {
		countryCode: "82",
		username: "zigbang@yopmail.com",
		email: "zigbang@yopmail.com",
		password: "zigbang",
		homeid: 51757763,
	}

	private static initialized: boolean = false

	private static log(params: any) {
		if (TuyaSdkBridge.isShowDebugLog) {
			console.log(params)
		}
	}

	// Change Information pnu, dongho
	private static setInformation(pnu: string, donho: string, username: string) {
		TuyaSdkBridge.targetPnu = pnu
		TuyaSdkBridge.targetDongho = donho
		TuyaSdkBridge.zigbangUserName = username
	}

	// initilize Tuya Sdk Bridge
	public static async init(
		isShowDebugLog: boolean,
		pnu: string,
		dongho: string,
		user: string,
		host: string
	): Promise<string> {
		// Set Debugging config
		TuyaSdkBridge.isShowDebugLog = isShowDebugLog

		TuyaSdkBridge.setInformation(pnu, dongho, user)
		TuyaSdkBridge.host = host

		let ErrorOccur = false
		let ReturnValue: string = ""

		// Login Tuya Handling, true - target, false - test
		try {
			const loginres = await TuyaSdkBridge.tuyaLogin(true)
			try {
				const getHomeDetailRes = await TuyaNative.getHomeDetail({ homeId: TuyaSdkBridge.tuyaInfo.homeid })
				TuyaSdkBridge.log(getHomeDetailRes)
			} catch (e) {
				TuyaSdkBridge.log(e)
				ErrorOccur = true
				ReturnValue = "getHomeDetail Error" + e
			}
		} catch (e) {
			ErrorOccur = true
			ReturnValue = "Tuya Login Error: " + e
		}

		return new Promise((resolve, reject) => {
			if (ErrorOccur) {
				reject(ReturnValue)
			} else {
				TuyaSdkBridge.initialized = true
				resolve("OK")
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
			//TuyaNative.removeSubscribtion(TuyaSdkBridge.subscriptionForGw)
			TuyaNative.removeEvent(TuyaSdkBridge.searchingGwDeviceEventName)

			TuyaSdkBridge.subscriptionForGw = null
			ReturnValue = true
		} else {
			console.error("startSearchWiredGW is not called")
		}

		return ReturnValue
	}

	private static inProcessRegisterGw = false
	public static async registerWiredGW(gw_id: string, product_id: string, timeout: number): RegisterTuyaGWResponse {
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
					homeId: TuyaSdkBridge.tuyaInfo.homeid,
					time: timeout,
					gwId: gw_id,
					productId: product_id,
				}
			} else {
				passParam = {
					homeId: TuyaSdkBridge.tuyaInfo.homeid,
					time: timeout,
					devId: gw_id,
					productId: product_id, // Ignored
				}
			}

			await TuyaNative.initSearchedGwDevice(passParam).then(
				(okRes: any) => {
					returnValue = okRes
					const CombinationName: string = TuyaSdkBridge.getCombinationTuyaName(okRes, okRes.name)
					TuyaNative.renameDevice({ devId: okRes.devId, name: CombinationName }).then(
						(RenameOkRes: string) => {
							TuyaSdkBridge.log("OK to rename GW")
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
				await TuyaNative.stopNewGwSubDevActivatorConfig({ devId: TuyaSdkBridge.targetGwIdForSubDevice })
			} else {
				TuyaNative.stopConfig()
			}
			TuyaNative.removeSubscribtion(TuyaSdkBridge.subscriptionForSubDevice)
			TuyaNative.removeEvent(TuyaSdkBridge.searchingSubDeviceEventName)
			TuyaSdkBridge.subscriptionForSubDevice = null
			returnValue = true
		} else {
			console.error("StartRegisterZigbeeSubDevice is not called")
		}

		return returnValue
	}

	// 콜백함수 : 기기 이름 변경 수행
	private static async subDeviceEventInternalFunction(result: any) {
		console.log(result)
		TuyaSdkBridge.log("subDeviceEventInternalFunction is called")
		TuyaSdkBridge.log(result)
		if (result.result == "onError") {
			TuyaSdkBridge.log("onError")
			TuyaSdkBridge.stopRegisterZigbeeSubDevice()
		} else if (result.result == "onActiveSuccess") {
			TuyaSdkBridge.log("onActiveSuccess")
			const combinationName: string = TuyaSdkBridge.getCombinationTuyaName(result.var1, result.var1.name)
			await TuyaNative.renameDevice({ devId: result.var1.devId, name: combinationName }).then(
				(okRes: string) => {
					TuyaSdkBridge.log("OK to rename GW")
				},
				(errRes: string) => {
					TuyaSdkBridge.log("NG to rename GW")
				}
			)
			TuyaSdkBridge.subDeviceRegisterEventFunctionPointer(result)
		} else {
			TuyaSdkBridge.log("Others")
		}
	}

	private static readonly delimiter: string = "_"
	private static getCombinationTuyaName(tuyaDevice: TuyaDeviceEntry, deviceName: string): string {
		const tokens: string[] = deviceName.split(TuyaSdkBridge.delimiter)

		if (tokens.length > 3) {
			// This make bug if user set name with 3 times of '_'
			deviceName = TuyaSdkBridge.getNameFromCombinationTuya(deviceName)
		}

		const elements: string[] = [
			deviceName,
			TuyaSdkBridge.targetPnu,
			TuyaSdkBridge.targetDongho,
			TuyaSdkBridge.zigbangUserName,
		]

		const returnValue = elements.join(TuyaSdkBridge.delimiter)

		return returnValue
	}

	private static getNameFromCombinationTuya(combinationName: string): string {
		const tokens: string[] = combinationName.split(TuyaSdkBridge.delimiter)

		if (tokens.length > 3) {
			tokens.pop() // remove "NoInfo"
			tokens.pop() // remove Dongho
			tokens.pop() // remove PNU
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

	private static async syncUsersByPaaS(userName: string): Promise<string> {
		return await axios.get(`http://${TuyaSdkBridge.host}/sync_user?username=${userName}`)
	}

	private static async addHomeMemberByPaaS(userName: string): Promise<string> {
		const timeStamp = new Date().getTime()

		return await axios.get(
			`http://${TuyaSdkBridge.host}/add_home_member/51757763?member_account=${userName}&name=synced_user_${timeStamp}`
		)
	}

	private static async getUserInfoByPaaS(uid: string): Promise<string> {
		return await axios.get(`http://${TuyaSdkBridge.host}/get_user_info/${uid}`)
	}

	private static async tuyaLogin(isAnonymous: boolean): Promise<boolean> {
		let returnValue: boolean = false

		let userInfo
		let needLogin: boolean = false

		if (isAnonymous == false) {
			TuyaSdkBridge.log("Option - Common User Account(With Email)")
			await TuyaNative.getCurrentUser().then(
				async (okRes: TuyaNative.User) => {
					TuyaSdkBridge.log("getCurrentUser - OK")
					userInfo = okRes
					if (userInfo.username != TuyaSdkBridge.tuyaInfo.email) {
						TuyaSdkBridge.log("logout")
						await TuyaNative.logout()
						needLogin = true
					} else {
						TuyaSdkBridge.log("Already Logged in")
						returnValue = true
					}
				},
				async (errReg: any) => {
					TuyaSdkBridge.log("getCurrentUser - NG")
					TuyaSdkBridge.log(errReg)
					needLogin = true
				}
			)

			if (needLogin) {
				TuyaSdkBridge.log("login with Email")
				await TuyaNative.loginWithEmail({
					countryCode: TuyaSdkBridge.tuyaInfo.countryCode,
					email: TuyaSdkBridge.tuyaInfo.email,
					password: TuyaSdkBridge.tuyaInfo.password,
				}).then(
					(okRes: TuyaNative.User) => {
						userInfo = okRes
						TuyaSdkBridge.log(okRes)
						returnValue = true
					},
					(errRes: any) => {
						TuyaSdkBridge.log(errRes) // TODO: Risk there is no handleing about error
					}
				)
			}

			TuyaSdkBridge.log("User Info:")
			TuyaSdkBridge.log(userInfo)
		} else {
			TuyaSdkBridge.log("Option - Anonymous Account")
			await TuyaNative.getCurrentUser().then(
				async (OkRes: TuyaNative.User) => {
					userInfo = OkRes

					TuyaSdkBridge.log(userInfo)

					if (userInfo.username === "") {
						TuyaSdkBridge.log("No logged info.")
						needLogin = true
					} else if (userInfo.username != TuyaSdkBridge.tuyaInfo.username) {
						// Todo: Change it for iOS
						TuyaSdkBridge.log("Remained Account Session")
						TuyaSdkBridge.log("Maybe Remained Anonymous Account session")
						returnValue = true
						needLogin = false
					} else {
						// TODO: Change it for iOS
						TuyaSdkBridge.log("Remained Account Session")
						TuyaSdkBridge.log("Remained Common Account session")
						await TuyaNative.logout()
						needLogin = true
					}
				},
				async (NgRes: any) => {
					TuyaSdkBridge.log("No logged info.")
					needLogin = true
				}
			)

			// Test Code in case session is expired
			// if (ReturnValue) {
			// 	TuyaSdkBridge.log("Forced Loggout")
			// 	await logout()
			// 	ReturnValue = false
			// 	NeedLogin = true
			// }

			if (needLogin) {
				TuyaSdkBridge.log("Create New Anonymous Account")
				await TuyaNative.touristRegisterAndLogin({
					countryCode: "82",
					username: "anonymousUser",
				}).then(
					async (loginOkRes: TuyaNative.User) => {
						try {
							TuyaSdkBridge.log("Anonymous Account OK")
							TuyaSdkBridge.log(loginOkRes)
							await TuyaNative.getCurrentUser().then(async (appUserOkRes: TuyaNative.User) => {
								TuyaSdkBridge.log("getCurrentUser OK: ")
								const { uid } = appUserOkRes
								let username: string

								await TuyaSdkBridge.getUserInfoByPaaS(uid).then(async (paasUserOkRes) => {
									const msg = JSON.parse(JSON.stringify(paasUserOkRes))
									const response = JSON.parse(msg.request._response)

									username = response.result.username
									TuyaSdkBridge.log(username)

									await TuyaSdkBridge.syncUsersByPaaS(username).then(async (syncOkRes) => {
										await TuyaSdkBridge.addHomeMemberByPaaS(username).then(async (memberOkRes) => {
											const msg = JSON.parse(JSON.stringify(memberOkRes))
											const response = JSON.parse(msg.request._response)
											TuyaSdkBridge.log(response)
											returnValue = true
										})
									})
								})
							})
						} catch (err) {
							console.error(err) // TODO: handling error
						}
					},
					async (loginErrRes: any) => {
						TuyaSdkBridge.log("Anonymous Account NG")
						TuyaSdkBridge.log(loginErrRes)
					}
				)
			}
		}

		return new Promise((resolve, reject) => {
			if (returnValue) {
				TuyaSdkBridge.log("Return OK")
				resolve(returnValue)
			} else {
				TuyaSdkBridge.log("Return Fail")
				reject(returnValue)
			}
		})
	}
}
