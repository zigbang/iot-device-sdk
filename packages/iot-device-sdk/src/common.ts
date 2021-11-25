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
	private static readonly TuyaNameElimentsCount: number = 5
	private static readonly PnuMaxLength: number = 19
	private static readonly DongMaxLength: number = 10
	private static readonly HoMaxLength: number = 10
	private static readonly UserMaxLength: number = 4
	private static readonly CombinationNameMaxLength: number = 50

	// for pass meta information to activator
	private static targetPnu: string = "temp-pnu"
	private static targetDong: string = "temp-dong"
	private static targetHo: string = "temp-ho"
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
		host: string
	): Promise<string> {
		// Set Debugging config
		TuyaSdkBridge.isShowDebugLog = isShowDebugLog
		TuyaSdkBridge.setInformation(pnu, dong, ho, user)
		TuyaSdkBridge.host = host

		let ErrorOccur = false
		let ReturnValue: string = ""

		// Login Tuya Handling, true - target, false - test
		await TuyaSdkBridge.tuyaLogin(true).then(
			async (OkRes: any) => {
				await TuyaNative.getHomeDetail({ homeId: TuyaSdkBridge.tuyaInfo.homeid }).then(
					(OkRes: TuyaNative.GetHomeDetailResponse) => {
						TuyaSdkBridge.log(OkRes)
					},
					(NgRes: any) => {
						TuyaSdkBridge.log(NgRes)
						ErrorOccur = true
						ReturnValue = "getHomeDetail Error" + NgRes
					}
				)
			},
			(NgRes: any) => {
				ErrorOccur = true
				ReturnValue = "Tuya Login Error" + NgRes
			}
		)

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
					let CombinationName: string = TuyaSdkBridge.getCombinationTuyaName(okRes.name)
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
				TuyaNative.stopNewGwSubDevActivatorConfig({ devId: TuyaSdkBridge.targetGwIdForSubDevice })
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
		console.log(TuyaSdkBridge.host)
		return await axios.get(`http://${TuyaSdkBridge.host}/get_user_info/${uid}`)
	}

	public static async TestFunctions(): Promise<boolean> {
		let returnValue: boolean = false

		// const testNames: Array<string> = [
		// 	"텐플 도어 센서 3_1129011500102910002_1/101_백광록",
		// 	"gr button_1929129192919_301호_백광록",
		// 	"gr gw_1129011500102910002_101동/101호_백광록",
		// 	"gr gw/1129011500102910002/101동/101호/백광록",
		// 	"gr gw/1129011500102910002//101호/백광록",
		// 	"//1129011500102910002//101호_백광록",
		// ]

		// TuyaSdkBridge.setInformation("pnu", "dong", "ho", "user")
		// for (let i = 0; i < testNames.length; i++) {
		// 	let testName: string = testNames[i]
		// 	console.log("-------------------")
		// 	console.log("test name is :" + testName)
		// 	console.log("parsed name is :" + TuyaSdkBridge.getNameFromCombinationTuya(testName))
		// 	console.log("combination name is :" + TuyaSdkBridge.getCombinationTuyaName(testName))
		// }

		// TuyaSdkBridge.setInformation("154545455454", "202동", "303호", "서진우")
		// for (let i = 0; i < testNames.length; i++) {
		// 	let testName: string = testNames[i]
		// 	console.log("-------------------")
		// 	console.log("test name is :" + testName)
		// 	console.log("parsed name is :" + TuyaSdkBridge.getNameFromCombinationTuya(testName))
		// 	console.log("combination name is :" + TuyaSdkBridge.getCombinationTuyaName(testName))
		// }

		// TuyaSdkBridge.setInformation("8784847887848", "", "101호", "아무개")
		// for (let i = 0; i < testNames.length; i++) {
		// 	let testName: string = testNames[i]
		// 	console.log("-------------------")
		// 	console.log("test name is :" + testName)
		// 	console.log("parsed name is :" + TuyaSdkBridge.getNameFromCombinationTuya(testName))
		// 	console.log("combination name is :" + TuyaSdkBridge.getCombinationTuyaName(testName))
		// }

		//const testNames: Array<string> = ["텐플 도어 센서 1234567890/1129011500102910002/1/101/백광록"]

		const testNames: Array<string> = ["0123456789ABCDEFGHIJKLMNOP"]

		TuyaSdkBridge.setInformation("0123456789012345PNU49", "123456789동", "123456789호", "이창주123456")
		for (let i = 0; i < testNames.length; i++) {
			let testName: string = testNames[i]
			console.log("-------------------")
			console.log("combination name is :" + TuyaSdkBridge.getCombinationTuyaName(testName))
		}

		return new Promise(function (resolve, reject) {
			if (returnValue) {
				TuyaSdkBridge.log("Return OK")
				resolve(returnValue)
			} else {
				TuyaSdkBridge.log("Return Fail")
				reject(returnValue)
			}
		})
	}

	private static async tuyaLogin(isAnonymous: boolean): Promise<boolean> {
		let returnValue: boolean = false

		let userInfo
		let needLogin: boolean = false

		if (isAnonymous == false) {
			TuyaSdkBridge.log("Option - Common User Account(With Email)")
			await TuyaNative.getCurrentUser().then(
				async (okRes: TuyaNative.User) => {
					TuyaSdkBridge.log("getCurrentUser(Email) - OK")
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
					TuyaSdkBridge.log("getCurrentUser(Email) - NG")
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
							await TuyaNative.getCurrentUser().then(
								async (appUserOkRes: TuyaNative.User) => {
									TuyaSdkBridge.log("getCurrentUser(in Creating) OK: ")
									const uid = appUserOkRes.uid
									let username: string

									await TuyaSdkBridge.getUserInfoByPaaS(uid).then(
										async (paasUserOkRes) => {
											var msg = JSON.parse(JSON.stringify(paasUserOkRes))
											var response = JSON.parse(msg.request._response)

											username = response.result.username
											TuyaSdkBridge.log(username)

											await TuyaSdkBridge.syncUsersByPaaS(username).then(async (syncOkRes) => {
												await TuyaSdkBridge.addHomeMemberByPaaS(username).then(
													async (memberOkRes) => {
														var msg = JSON.parse(JSON.stringify(memberOkRes))
														var response = JSON.parse(msg.request._response)

														TuyaSdkBridge.log(response)
														returnValue = true
													}
												)
											})
										},
										async (paasUserNgRes) => {
											TuyaSdkBridge.log("getUserInfoByPaaS(in Creating) NG: ")
											TuyaSdkBridge.log(paasUserNgRes)
										}
									)
								},
								async (appUserErrRes: any) => {
									TuyaSdkBridge.log("getCurrentUser(in Creating) NG")
								}
							)
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
				TuyaSdkBridge.log("tuyaLogin - Return OK")
				resolve(returnValue)
			} else {
				TuyaSdkBridge.log("tuyaLogin - Return Fail")
				reject(returnValue)
			}
		})
	}
}
