import * as TuyaNative from "@zigbang/react-native-tuya"
import { EmitterSubscription, Platform } from "react-native"
import axios from "axios"

type TuyaSdkAccountInfo = {
	countryCode: string
	email: string
	password: string
	homeid: number
}

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
	public static readonly NoValueYet: string = "0"

	// for pass meta information to activator
	private static TargetPnu: string = "temp-pnu"
	private static TargetDongho: string = "temp-dongho"
	private static ZigbangUserName: string = "temp-name"
	private static host: string = ""

	// Event Name which is shared with Native Module
	private static readonly SearchingGwDeviceEventName = "kNotificationFindGatewayDevice"
	private static readonly SearchingSubDeviceEventName = "kNotificationResultSubDevice"

	private static isShowDebugLog: boolean = false

	// Event Emitter to get from Tuya SDK
	private static subscriptionForGw: EmitterSubscription | null
	private static subscriptionForSubDevice: EmitterSubscription | null

	// Function variable to callback
	private static SearchingCallbackFunction: (gw_id: string, product_id: string) => void
	private static SubDeviceEventFunction: (result: any) => void

	private static TuyaInfo: TuyaSdkAccountInfo = {
		countryCode: "82",
		email: "zigbang@yopmail.com",
		password: "zigbang",
		homeid: 51757763,
	}

	private static Initialized: boolean = false

	// Change Information pnu, dongho
	public static SetInformation(pnu: string, donho: string, username: string) {
		TuyaSdkBridge.TargetPnu = pnu
		TuyaSdkBridge.TargetDongho = donho
		TuyaSdkBridge.ZigbangUserName = username
	}

	private static log(params: any) {
		if (TuyaSdkBridge.isShowDebugLog) {
			console.log(params)
		}
	}

	// initilize Tuya Sdk Bridge
	public static async Init(
		isShowDebugLog: boolean,
		pnu: string,
		dongho: string,
		user: string,
		host: string
	): Promise<string> {
		// Set Debugging config
		TuyaSdkBridge.isShowDebugLog = isShowDebugLog

		TuyaSdkBridge.SetInformation(pnu, dongho, user)

		let ErrorOccur = false
		let ReturnValue: string = ""

		// Login Tuya Handling
		await TuyaSdkBridge.TuyaLogin(false).then(
			(OkRes: any) => {
				TuyaNative.getHomeDetail({ homeId: TuyaSdkBridge.TuyaInfo.homeid }).then(
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
				ReturnValue = "Tuya Login Error: " + NgRes
			}
		)

		return new Promise(function (resolve, reject) {
			if (ErrorOccur) {
				reject(ReturnValue)
			} else {
				TuyaSdkBridge.Initialized = true
				resolve("OK")
			}
		})
	}

	public static StartSearchWiredGW(callback: (gw_id: string, product_id: string) => void): boolean {
		let ReturnValue: boolean = false

		if (TuyaSdkBridge.Initialized == false) {
			console.error("Call TuyaSdkBridge.Init() first")
		} else if (!TuyaSdkBridge.subscriptionForGw) {
			TuyaNative.StartSearcingGwDevice()
			TuyaSdkBridge.SearchingCallbackFunction = callback
			if (Platform.OS === "ios") {
				TuyaSdkBridge.subscriptionForGw = TuyaNative.addEvent(
					TuyaSdkBridge.SearchingGwDeviceEventName,
					TuyaSdkBridge.SearchingInternalFunction
				)
			} else {
				TuyaSdkBridge.subscriptionForGw = TuyaNative.addEvent(
					TuyaSdkBridge.SearchingGwDeviceEventName,
					TuyaSdkBridge.SearchingInternalFunctionForAndroid
				)
			}
			ReturnValue = true
		}

		return ReturnValue
	}

	public static StopSearchWiredGW() {
		let ReturnValue: boolean = false

		if (TuyaSdkBridge.subscriptionForGw != null) {
			//TuyaNative.removeSubscribtion(TuyaSdkBridge.subscriptionForGw)
			TuyaNative.removeEvent(TuyaSdkBridge.SearchingGwDeviceEventName)

			TuyaSdkBridge.subscriptionForGw = null
			ReturnValue = true
		} else {
			console.error("StartSearchWiredGW is not called")
		}

		return ReturnValue
	}

	private static inProcessRegisterGw = false
	public static async RegisterWiredGW(params: RegisterGwParam) {
		let ReturnValue: any
		let ErrorOccur: boolean = false

		if (TuyaSdkBridge.Initialized == false) {
			ErrorOccur = true
			ReturnValue = "Call TuyaSdkBridge.Init() first"
		} else if (TuyaSdkBridge.inProcessRegisterGw) {
			ErrorOccur = true
			ReturnValue = "RegisterWiredGW is started already"
		} else {
			TuyaSdkBridge.inProcessRegisterGw = true

			let passParam: any
			if (Platform.OS === "ios") {
				passParam = {
					homeId: TuyaSdkBridge.TuyaInfo.homeid,
					time: params.timeout,
					gwId: params.gw_id,
					productId: params.product_id,
				}
			} else {
				passParam = {
					homeId: TuyaSdkBridge.TuyaInfo.homeid,
					time: params.timeout,
					devId: params.gw_id,
					productId: params.product_id, // Ignored
				}
			}

			await TuyaNative.InitSearchedGwDevice(passParam).then(
				(OkRes: any) => {
					ReturnValue = OkRes
					let CombinationName: string = TuyaSdkBridge.GetCombinationTuyaName(OkRes, OkRes.name)
					TuyaNative.renameDevice({ devId: OkRes.devId, name: CombinationName }).then(
						(RenameOkRes: string) => {
							TuyaSdkBridge.log("OK to rename GW")
						},
						(RenameNgRes: string) => {
							TuyaSdkBridge.log("NG to rename GW")
							ReturnValue = RenameNgRes
							ErrorOccur = true
						}
					)
				},
				(NgRes: any) => {
					ReturnValue = NgRes
					ErrorOccur = true
				}
			)

			TuyaSdkBridge.inProcessRegisterGw = false
		}

		return new Promise((resolve, reject) => {
			if (ErrorOccur) {
				console.error(ReturnValue)
				reject(ReturnValue)
			} else {
				resolve(ReturnValue)
			}
		})
	}

	private static TargetGwIdForSubDevice: string = ""
	// 이벤트 리스너 등록 및 등록 시작
	public static async StartRegisterZigbeeSubDevice(
		gw_id: string,
		timeout: number,
		callback: (result: any) => void
	): Promise<boolean> {
		let ErrorOccur = false
		let ReturnValue: any

		if (TuyaSdkBridge.Initialized == false) {
			ErrorOccur = true
			ReturnValue = "Call TuyaSdkBridge.Init() first"
		} else if (TuyaSdkBridge.subscriptionForSubDevice) {
			ErrorOccur = true
			ReturnValue = "StartRegisterZigbeeSubDevice is started already"
		} else {
			TuyaSdkBridge.subscriptionForSubDevice = TuyaNative.addEvent(
				TuyaSdkBridge.SearchingSubDeviceEventName,
				TuyaSdkBridge.SubDeviceEventInternalFunction
			)
			TuyaSdkBridge.TargetGwIdForSubDevice = gw_id
			TuyaSdkBridge.SubDeviceEventFunction = callback
			let passParam: TuyaNative.RegistSubForGwParams
			passParam = {
				devId: gw_id, // devId
				time: timeout,
			}

			TuyaNative.StartGwSubDevActivator(passParam).then(
				(OkRes: any) => {
					ReturnValue = OkRes
				},
				(NgRes: any) => {
					ErrorOccur = true
					ReturnValue = NgRes
				}
			)

			ReturnValue = true
		}

		return new Promise((resolve, reject) => {
			if (ErrorOccur) {
				console.error(ReturnValue)
				reject(ReturnValue)
			} else {
				resolve(ReturnValue)
			}
		})
	}

	// 이벤트 리스너 해제
	public static async StopRegisterZigbeeSubDevice() {
		let ReturnValue: boolean = false

		if (TuyaSdkBridge.subscriptionForSubDevice) {
			if (Platform.OS === "ios") {
				await TuyaNative.stopNewGwSubDevActivatorConfig({ devId: TuyaSdkBridge.TargetGwIdForSubDevice }) // Todo : make this for android
			}
			TuyaNative.removeSubscribtion(TuyaSdkBridge.subscriptionForSubDevice)
			TuyaNative.removeEvent(TuyaSdkBridge.SearchingSubDeviceEventName)
			TuyaSdkBridge.subscriptionForSubDevice = null
			ReturnValue = true
		} else {
			console.error("StartRegisterZigbeeSubDevice is not called")
		}

		return ReturnValue
	}

	// 콜백함수 : 기기 이름 변경 수행
	private static async SubDeviceEventInternalFunction(result: any) {
		TuyaSdkBridge.log("SubDeviceEventInternalFunction is called")
		TuyaSdkBridge.log(result)
		if (result.result == "onError") {
			TuyaSdkBridge.log("onError")
			TuyaSdkBridge.StopRegisterZigbeeSubDevice()
		} else if (result.result == "onActiveSuccess") {
			TuyaSdkBridge.log("onActiveSuccess")
			let CombinationName: string = TuyaSdkBridge.GetCombinationTuyaName(result.var1, result.var1.name)
			await TuyaNative.renameDevice({ devId: result.var1.devId, name: CombinationName }).then(
				(RenameOkRes: string) => {
					console.log("OK to rename GW")
					TuyaSdkBridge.log("OK to rename GW")
				},
				(RenameNgRes: string) => {
					TuyaSdkBridge.log("NG to rename GW")
				}
			)
			TuyaSdkBridge.SubDeviceEventFunction(result)
		} else {
			TuyaSdkBridge.log("Others")
		}
	}

	private static readonly Delimiter: string = "_"
	private static GetCombinationTuyaName(TuyaDevice: TuyaDeviceEntry, DeviceName: string): string {
		let Tokens: string[] = DeviceName.split(TuyaSdkBridge.Delimiter)

		if (Tokens.length > 3) {
			// This make bug if user set name with 3 times of '_'
			DeviceName = TuyaSdkBridge.GetNameFromCombinationTuya(DeviceName)
		}

		const elements: string[] = [
			DeviceName,
			TuyaSdkBridge.TargetPnu,
			TuyaSdkBridge.TargetDongho,
			TuyaSdkBridge.ZigbangUserName,
		]

		let ReturnValue = elements.join(TuyaSdkBridge.Delimiter)

		return ReturnValue
	}

	private static GetNameFromCombinationTuya(CombinationName: string): string {
		let Tokens: string[] = CombinationName.split(TuyaSdkBridge.Delimiter)

		if (Tokens.length > 3) {
			Tokens.pop() // remove "NoInfo"
			Tokens.pop() // remove Dongho
			Tokens.pop() // remove PNU
		}

		return Tokens.join(TuyaSdkBridge.Delimiter)
	}

	private static async SearchingInternalFunction(gw_id: string, product_id: string) {
		if (TuyaSdkBridge.subscriptionForGw != null) {
			if (Platform.OS === "android") {
				TuyaNative.StartSearcingGwDevice() // Call again continuously called events
			}
			TuyaSdkBridge.SearchingCallbackFunction(gw_id, product_id)
		} else {
			TuyaSdkBridge.StopSearchWiredGW() // adjust sync problem
		}
	}

	private static async SearchingInternalFunctionForAndroid(GwInfo: TuyaNative.HgwBean) {
		// Android has more information, pick some to fit common interface
		TuyaSdkBridge.SearchingInternalFunction(GwInfo.gwId, GwInfo.productKey)
	}

	private static async GetUsersByPaaS(): Promise<string> {
		return await axios.get(`http://${TuyaSdkBridge.host}/users?page_no=1&page_size=100`)
	}

	private static async SyncUsersByPaaS(username: string): Promise<string> {
		return await axios.get(`http://${TuyaSdkBridge.host}/sync_user?username=${username}`)
	}

	private static async AddHomeMemberByPaaS(username: string): Promise<string> {
		let timestamp = new Date().getTime()

		return await axios.get(
			`http://${TuyaSdkBridge.host}/add_home_member/51757763?member_account=${username}&name=synced_user_${timestamp}`
		)
	}

	private static async GetUserInfoByPaaS(uid: string): Promise<string> {
		return await axios.get(`http://${TuyaSdkBridge.host}/get_user_info/${uid}`)
	}

	private static async TuyaLogin(isAnonymous: boolean): Promise<boolean> {
		let ReturnValue: boolean = false

		let UserInfo
		let NeedLogin: boolean = false

		if (isAnonymous == false) {
			TuyaSdkBridge.log("Option - Common User Account(With Email)")
			await TuyaNative.getCurrentUser().then(
				async (OkRes: TuyaNative.User) => {
					TuyaSdkBridge.log("getCurrentUser - OK")
					UserInfo = OkRes
					if (UserInfo.username != TuyaSdkBridge.TuyaInfo.email) {
						TuyaSdkBridge.log("logout")
						await TuyaNative.logout()
						NeedLogin = true
					} else {
						TuyaSdkBridge.log("Already Logged in")
						ReturnValue = true
					}
				},
				async (NgReg: any) => {
					TuyaSdkBridge.log("getCurrentUser - NG")
					NeedLogin = true
				}
			)

			if (NeedLogin) {
				TuyaSdkBridge.log("login with Email")
				await TuyaNative.loginWithEmail({
					countryCode: TuyaSdkBridge.TuyaInfo.countryCode,
					email: TuyaSdkBridge.TuyaInfo.email,
					password: TuyaSdkBridge.TuyaInfo.password,
				}).then((OkRes: TuyaNative.User) => {
					UserInfo = OkRes
					TuyaSdkBridge.log(OkRes)
					ReturnValue = true
				})
			}

			TuyaSdkBridge.log("User Info:")
			TuyaSdkBridge.log(UserInfo)
		} else {
			TuyaSdkBridge.log("Option - Anonymous Account")
			await TuyaNative.getCurrentUser().then(
				async (OkRes: TuyaNative.User) => {
					UserInfo = OkRes

					TuyaSdkBridge.log(UserInfo)

					if (UserInfo.email === "") {
						TuyaSdkBridge.log("No logged info.")
						NeedLogin = true
					} else if (UserInfo.email != TuyaSdkBridge.TuyaInfo.email) {
						// Todo: Change it for iOS
						TuyaSdkBridge.log("Remained Account Session")
						TuyaSdkBridge.log("Maybe Remained Anonymous Account session")
						ReturnValue = true
						NeedLogin = false
					} else {
						// Todo: Change it for iOS
						TuyaSdkBridge.log("Remained Account Session")
						TuyaSdkBridge.log("Remained Common Account session")
						await TuyaNative.logout()
						NeedLogin = true
					}
				},
				async (NgRes: any) => {
					TuyaSdkBridge.log("No logged info.")
					NeedLogin = true
				}
			)

			// Test Code in case session is expired
			// if (ReturnValue) {
			// 	TuyaSdkBridge.log("Forced Loggout")
			// 	await logout()
			// 	ReturnValue = false
			// 	NeedLogin = true
			// }

			if (NeedLogin) {
				TuyaSdkBridge.log("Create New Anonymous Account")
				await TuyaNative.touristRegisterAndLogin({
					countryCode: "82",
					username: "anonymousUser",
				}).then(
					async (OkRes: TuyaNative.User) => {
						TuyaSdkBridge.log("Anonymous Account OK")
						await TuyaNative.getCurrentUser().then(async (OkRes: TuyaNative.User) => {
							TuyaSdkBridge.log("getCurrentUser OK: ")
							const uid = OkRes.uid
							let username: string

							await TuyaSdkBridge.GetUserInfoByPaaS(uid).then(async (result) => {
								var msg = JSON.parse(JSON.stringify(result))
								var response = JSON.parse(msg.request._response)

								username = response.result.username
								TuyaSdkBridge.log(username)

								await TuyaSdkBridge.SyncUsersByPaaS(username).then(async (OkRes) => {
									await TuyaSdkBridge.AddHomeMemberByPaaS(username).then(async (result) => {
										var msg = JSON.parse(JSON.stringify(result))
										var response = JSON.parse(msg.request._response)

										TuyaSdkBridge.log(response)
										ReturnValue = true
									})
								})
							})
						})
					},
					async (ngRes: any) => {
						TuyaSdkBridge.log("Anonymous Account NG")
					}
				)
			}
		}

		return new Promise(function (resolve, reject) {
			if (ReturnValue) {
				TuyaSdkBridge.log("Return OK")
				resolve(ReturnValue)
			} else {
				TuyaSdkBridge.log("Return Fail")
				reject(ReturnValue)
			}
		})
	}
}
