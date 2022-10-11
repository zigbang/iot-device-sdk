# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [0.2.0](https://github.com/zigbang/iot-device-sdk/compare/v0.1.9...v0.2.0) (2022-10-11)


### Features

* change api name & update documents ([a8a2cc4](https://github.com/zigbang/iot-device-sdk/commit/a8a2cc47e3a85fe5ce4802725a2d629ed7fb9e31))

### [0.1.9](https://github.com/zigbang/iot-device-sdk/compare/v0.1.8...v0.1.9) (2022-10-11)


### Features

* add wifi ap mode register ([94f995a](https://github.com/zigbang/iot-device-sdk/commit/94f995a28f5e771a14abacf35af127c5d2260d00))


### Docs

* sample's parameter expression ([133ac57](https://github.com/zigbang/iot-device-sdk/commit/133ac57d3e4d710c8b5861fe1541fd6b3bb807ff))

### [0.1.8](https://github.com/zigbang/iot-device-sdk/compare/v0.1.7...v0.1.8) (2022-10-07)


### Features

* add wifi ez mode register ([2f6ccd4](https://github.com/zigbang/iot-device-sdk/commit/2f6ccd405fc84e9f294b79b680d82b73b35136ff))


### Bug Fixes

* promise return of logout ([767dd7f](https://github.com/zigbang/iot-device-sdk/commit/767dd7f0b9d2b6e7b748e3a9807f175350ec34d2))


### Docs

* timeout unit is added ([193154b](https://github.com/zigbang/iot-device-sdk/commit/193154bd7de7fff9cc4aae2b5eac2f9f08419c23))

### [0.1.7](https://github.com/zigbang/iot-device-sdk/compare/v0.1.6...v0.1.7) (2022-09-15)


### Features

* add param at login callback ([2ddcca4](https://github.com/zigbang/iot-device-sdk/commit/2ddcca44909d8ed3714dcb81773f92782e2a729b))

### 0.1.6 (2022-09-08)


### Features

* 기기 삭제 및 공장 초기화 기능 구현 ([1a92745](https://github.com/zigbang/iot-device-sdk/commit/1a92745f0215d5dce27480e3a729195dd4d7fae4))
* add init_v2 ([45cf88b](https://github.com/zigbang/iot-device-sdk/commit/45cf88b12ccbb088ecc4dbaabdf0fa4377f7852c))
* calling User Login ([8e5d5fe](https://github.com/zigbang/iot-device-sdk/commit/8e5d5fe5eb290433299146e768eed54d782d8287))
* logout 기능 구현 ([182b273](https://github.com/zigbang/iot-device-sdk/commit/182b27371d2819cf4e93148ef92a0d9655e08eab))
* remove using private function ([f65481a](https://github.com/zigbang/iot-device-sdk/commit/f65481ad210c31fd6322934a7bb7bb09ee387530))
* TuyaSdkBridge 디버깅 로그 콜백 이벤트 구현 ([cc80914](https://github.com/zigbang/iot-device-sdk/commit/cc80914344b0505e9c245a35fc6af47f31ba434f))


### Bug Fixes

* 머지 오류 수정 ([8ad1a42](https://github.com/zigbang/iot-device-sdk/commit/8ad1a4227a7994d59cb629f94c414ec9dcb7ad1a))
* 머지 충돌 수정 ([d309305](https://github.com/zigbang/iot-device-sdk/commit/d309305d1f19e29c892e9b943468091d7b8b790e))
* 서브 기기 등록 중지 함수 await 제거 ([d253b68](https://github.com/zigbang/iot-device-sdk/commit/d253b6874ab83bc7abfc46324428ce1e69f11e32))
* 이벤트 stop 오류 수정, 익명 로그인 오류 수정 ([ad714be](https://github.com/zigbang/iot-device-sdk/commit/ad714be701ccdcae05b57fba68c92b951d8c24ca))
* activator에서 기기 타입에따라 다르게 응답하도록 수정 ([ac4681d](https://github.com/zigbang/iot-device-sdk/commit/ac4681d0d95ef76f5a50f63f1cb6b58188ceb6ef))
* debug 콜백 할당 전에 setInformation을 호출하여 init이 안되는 문제 수정 ([ce28f3d](https://github.com/zigbang/iot-device-sdk/commit/ce28f3d786298a57b93030551b28de7d01f31c6a))
* iOS에서 게이트웨이 이벤트 수신 시, 객체 전달이 아닌 String 전달로 수정 ([421cb6a](https://github.com/zigbang/iot-device-sdk/commit/421cb6aa3f9c00842666d6fa9e16693af4e96173))
* iOS에서 기기 삭제 또는 공장 초기화 실패 시, response 안오는 문제 해결 ([07046de](https://github.com/zigbang/iot-device-sdk/commit/07046def820b7adb6d46c3c2eeb22153851ab0d7))
* remove about postinstall about husky ([2f3aa8f](https://github.com/zigbang/iot-device-sdk/commit/2f3aa8f3f4791479124b68c70a7ef35b836d2491))


### Styling

* add commitlint ([929c004](https://github.com/zigbang/iot-device-sdk/commit/929c004a5ffc7ed3127874ae59fe94b3cdcb5b09))
* support typescript (make index.d.ts) ([ddc357e](https://github.com/zigbang/iot-device-sdk/commit/ddc357ed556af250c9625f04351199a069472118))


### CI

* add INPUT_TOKEN ([ea9bf7d](https://github.com/zigbang/iot-device-sdk/commit/ea9bf7da08ac5c76028e0c6a218383b3459119c0))
* add test github action file ([0c837e7](https://github.com/zigbang/iot-device-sdk/commit/0c837e7271d046532b346b29ddc6d7903c2b6d16))
* apply github for github pages ([a9064e0](https://github.com/zigbang/iot-device-sdk/commit/a9064e0e72599507672cf3c04e728765e67091b8))
* apply path to run npm ([9ca8e16](https://github.com/zigbang/iot-device-sdk/commit/9ca8e1685e8dab1732805c5dcc1418641fc6150b))
* chagne ci ([d729aec](https://github.com/zigbang/iot-device-sdk/commit/d729aec2bdbd72667bd355aa8c4f835e28da0f21))
* change again ([85c987f](https://github.com/zigbang/iot-device-sdk/commit/85c987fc63e81cd7cbdfca0c133eb321a6c5f5ec))
* change to yarn ([c974a8c](https://github.com/zigbang/iot-device-sdk/commit/c974a8cecea863552f84b90dcadaae5aa79d7a56))
* fix action script error ([d5fe460](https://github.com/zigbang/iot-device-sdk/commit/d5fe46062fbe295593bf51c45dcf6aac79772f4f))
* fix github action for publish ([02bc71f](https://github.com/zigbang/iot-device-sdk/commit/02bc71ff87cf91ab8fc7942e7213f5a3683f4f7f))
* fix npm remove dist/doc ([5774b12](https://github.com/zigbang/iot-device-sdk/commit/5774b12ed04c000c06e1853363fe3a49c64b1fd9))
* fix npm run build ([d727c95](https://github.com/zigbang/iot-device-sdk/commit/d727c95eaf583f3b1aad9b9fc62350fa97395555))
* fix to order github action ([2df5f2f](https://github.com/zigbang/iot-device-sdk/commit/2df5f2f4fd374e69f09807616fc340ed217f81d7))
* github action make for test ([b03075e](https://github.com/zigbang/iot-device-sdk/commit/b03075e5020e5245e8875aa5a5c1c1497780c34b))
* link change log, change github action name ([061e832](https://github.com/zigbang/iot-device-sdk/commit/061e832a5d373302953bdb2db856df3b9a9080af))
* merge two md files base and change log ([8627844](https://github.com/zigbang/iot-device-sdk/commit/862784487cda46556bb2dd550f319ecda9f4c7ca))
* reame.md file is combinded by github action ([ba69524](https://github.com/zigbang/iot-device-sdk/commit/ba695247d6aa4575b7bc59f1a8e161ee23c48555))
* recovery github script ([240a1b6](https://github.com/zigbang/iot-device-sdk/commit/240a1b6df9889a242522b5c0bf3782aaf885fadd))
* setup node ([4d9d532](https://github.com/zigbang/iot-device-sdk/commit/4d9d5329e33f2bb19aba04e6846b8c7389e25b61))
* test ([d608c6e](https://github.com/zigbang/iot-device-sdk/commit/d608c6ea0ee3fb7a27e43061694307bd37eb506d))
* test again ([4e32314](https://github.com/zigbang/iot-device-sdk/commit/4e323143242fda96f2701d299e719b831f372c73))
* try to fix error again ([7733bbb](https://github.com/zigbang/iot-device-sdk/commit/7733bbbc85413ae1c8d9240e0bf5f1be8e484ff4))
* try to fix github action ([2a8f5e3](https://github.com/zigbang/iot-device-sdk/commit/2a8f5e33f5d77b9a148397d12d8bbbe36b4b9b4a))
* try to fix github action again ([d22b985](https://github.com/zigbang/iot-device-sdk/commit/d22b985c097bd02b5258d6b07e0fe8dc5336a8de))
* using actions ([0342d1e](https://github.com/zigbang/iot-device-sdk/commit/0342d1eec319c3fae6ebd6dad36a039340c2cd80))
* using npm ci ([78d545f](https://github.com/zigbang/iot-device-sdk/commit/78d545fda257673e3031de85a171f2799b87f002))
* version up ([a732673](https://github.com/zigbang/iot-device-sdk/commit/a73267366cc083a1e516077e0a49ed9c81b1f48e))


### Code Refactoring

* 코드 컨벤션 적용 ([8a1f840](https://github.com/zigbang/iot-device-sdk/commit/8a1f8401434dbb2ad6430bb3d37304697c907ec7))
* logout 함수 private으로 변경, init 메소드 구조 변경 ([02224ef](https://github.com/zigbang/iot-device-sdk/commit/02224ef53e7d7e830169b5bb374ae5d1ce40fb0d))
* merge for using module ([1c9a45b](https://github.com/zigbang/iot-device-sdk/commit/1c9a45b14bf8bbd3e60a7cdf0273dadb0cd05bd6))
* removeDevice 및 resetDevice 하나로 합침 ([91d312f](https://github.com/zigbang/iot-device-sdk/commit/91d312f5c4ea3a6c051c4cf8e834b8f262dde400))


### Build System

* a module version make fix ([66f9a4a](https://github.com/zigbang/iot-device-sdk/commit/66f9a4a2b3639383e017fd9a38c469f59d0ea898))
* add dist folder for using npm ([7c63992](https://github.com/zigbang/iot-device-sdk/commit/7c63992b0411def0e44124b56cd55d92334acffb))
* change module version ([37fe387](https://github.com/zigbang/iot-device-sdk/commit/37fe38730b6591a253ee6c64c97377acd97fc555))
* change module version ([fb754ea](https://github.com/zigbang/iot-device-sdk/commit/fb754ead51a4702bf7e20796ee58db218f8f414d))
* changing module name ([e9eb14b](https://github.com/zigbang/iot-device-sdk/commit/e9eb14bae0b4a6fc342040677dec9d14dcda5fbc))
* module change to zigbang/react-native-tuya ([d87b221](https://github.com/zigbang/iot-device-sdk/commit/d87b221bc6a8ff14b009cdc777cd1eedc7cef720))
* module version is up ([4fd8b59](https://github.com/zigbang/iot-device-sdk/commit/4fd8b59cfc25e7914d0fe09251208be430cff3de))
* using seojw's one for pending reg module ([815267e](https://github.com/zigbang/iot-device-sdk/commit/815267e0be1a75e26f14295144173f1beea69273))


### Others

* add & remove as using module ([a2314ee](https://github.com/zigbang/iot-device-sdk/commit/a2314ee437a95c8b6c5edacce44a1038139b465b))
* **release:** 0.0.2 ([160f287](https://github.com/zigbang/iot-device-sdk/commit/160f287e45291d4c7368ffbd0e99e353aecdbb75))
* **release:** 0.0.3 ([2c72129](https://github.com/zigbang/iot-device-sdk/commit/2c721299cf225e53d3381de872f12beacdf7c5be))
* **release:** 0.0.4 ([7b0329b](https://github.com/zigbang/iot-device-sdk/commit/7b0329b5317272476ccb4c4fd7f803cbf374aeb5))
* **release:** 0.0.5 ([3251134](https://github.com/zigbang/iot-device-sdk/commit/3251134243e5c78c6ecfd46087d449d4db869c55))
* **release:** 0.0.6 ([6d8f552](https://github.com/zigbang/iot-device-sdk/commit/6d8f5520c75d9521868d6d1dca569190702d1557))
* **release:** 0.0.7 ([38daae9](https://github.com/zigbang/iot-device-sdk/commit/38daae96127b1e38ff165884138cf7afe609beae))
* **release:** 0.0.8 ([057c11d](https://github.com/zigbang/iot-device-sdk/commit/057c11d3d5bb16d00cca34cf75415b8cb074ea72))
* **release:** 0.0.9 ([f32ec44](https://github.com/zigbang/iot-device-sdk/commit/f32ec44e97888830cc423decdeb6b63715dd2090))
* **release:** 0.1.0 ([b905d97](https://github.com/zigbang/iot-device-sdk/commit/b905d9711b44e6d6f604bc1baa269f6d5a19b75f))
* **release:** 0.1.1 ([6001492](https://github.com/zigbang/iot-device-sdk/commit/6001492e3fb846d22adc603999d840dacd4b6e8a))
* **release:** 0.1.2 ([b71104e](https://github.com/zigbang/iot-device-sdk/commit/b71104e6d01182850fca3c9b16a70664521ecb74))
* **release:** 0.1.3 ([567763b](https://github.com/zigbang/iot-device-sdk/commit/567763ba7817cba471406a3f98ed88eaa8f0359f))
* **release:** 0.1.4 ([ad3c0a7](https://github.com/zigbang/iot-device-sdk/commit/ad3c0a7228a6ce0d1760119f26247e47c1fb0c1a))
* **release:** 0.1.5 ([ac2a151](https://github.com/zigbang/iot-device-sdk/commit/ac2a151ca9dd05dcf55810cb827679c5bd72499a))


### Docs

* add legacy tuya api handling block diagram ([64f972a](https://github.com/zigbang/iot-device-sdk/commit/64f972ae57fdbc1e2376b84c7c4dc40f7425750d))
* add sample of using tuya api ([f71b1ec](https://github.com/zigbang/iot-device-sdk/commit/f71b1eca690cbb5a0eb982f269f3d0873e7bd14f))
* apply typedoc ([52ab797](https://github.com/zigbang/iot-device-sdk/commit/52ab797ac0fc7b7bdc6f360cd775a86c30be8b24))
* apply zigbang account ([562cd4d](https://github.com/zigbang/iot-device-sdk/commit/562cd4d56be9ab3d33cf501e0a23fe600488a7c5))
* change title for github page ([8c35823](https://github.com/zigbang/iot-device-sdk/commit/8c35823f242ef42b60bf0f9db85b1d00fb777d59))
* draw to describe of ci/cd ([b2dc586](https://github.com/zigbang/iot-device-sdk/commit/b2dc5866d1663efa285533f5aba8e9585cc141b7))
* include link change log to readme ([e0902a6](https://github.com/zigbang/iot-device-sdk/commit/e0902a664ea7c37815396b2ea6db217aad665db2))
* init function is changed ([83501b0](https://github.com/zigbang/iot-device-sdk/commit/83501b01e5a6f83daa4cdea00b9b1958865649ac))
* typedoc 초안본 배포 ([99bdff7](https://github.com/zigbang/iot-device-sdk/commit/99bdff7cbaaad7b76dcd915b661ae1f9ddb6c108))
* update github page address ([02e3696](https://github.com/zigbang/iot-device-sdk/commit/02e3696bfd3d14afdfd216cdef0c274297fad90d))
* update to show msg if uploaded gh-p by man ([b9bde2f](https://github.com/zigbang/iot-device-sdk/commit/b9bde2f80ee9c89ebd39775e978ae84c86aa5c70))
* useing github pages ([9a6bfa4](https://github.com/zigbang/iot-device-sdk/commit/9a6bfa4370d975eff4d981481e0ce265da48495e))

### [0.1.5](https://github.com/zigbang/iot-device-sdk/compare/v0.1.4...v0.1.5) (2022-08-26)


### Docs

* apply zigbang account ([562cd4d](https://github.com/zigbang/iot-device-sdk/commit/562cd4d56be9ab3d33cf501e0a23fe600488a7c5))

### [0.1.4](https://github.com/zigbang/iot-device-sdk/compare/v0.1.3...v0.1.4) (2022-08-25)


### Build System

* a module version make fix ([66f9a4a](https://github.com/zigbang/iot-device-sdk/commit/66f9a4a2b3639383e017fd9a38c469f59d0ea898))
* change module version ([fb754ea](https://github.com/zigbang/iot-device-sdk/commit/fb754ead51a4702bf7e20796ee58db218f8f414d))

### [0.1.3](https://github.com/zigbang/iot-device-sdk/compare/v0.1.2...v0.1.3) (2022-08-05)


### Build System

* change module version ([37fe387](https://github.com/zigbang/iot-device-sdk/commit/37fe38730b6591a253ee6c64c97377acd97fc555))

### 0.1.2 (2022-08-05)


### Features

* 기기 삭제 및 공장 초기화 기능 구현 ([1a92745](https://github.com/zigbang/iot-device-sdk/commit/1a92745f0215d5dce27480e3a729195dd4d7fae4))
* calling User Login ([8e5d5fe](https://github.com/zigbang/iot-device-sdk/commit/8e5d5fe5eb290433299146e768eed54d782d8287))
* logout 기능 구현 ([182b273](https://github.com/zigbang/iot-device-sdk/commit/182b27371d2819cf4e93148ef92a0d9655e08eab))
* remove using private function ([f65481a](https://github.com/zigbang/iot-device-sdk/commit/f65481ad210c31fd6322934a7bb7bb09ee387530))
* TuyaSdkBridge 디버깅 로그 콜백 이벤트 구현 ([cc80914](https://github.com/zigbang/iot-device-sdk/commit/cc80914344b0505e9c245a35fc6af47f31ba434f))


### Bug Fixes

* 머지 오류 수정 ([8ad1a42](https://github.com/zigbang/iot-device-sdk/commit/8ad1a4227a7994d59cb629f94c414ec9dcb7ad1a))
* 머지 충돌 수정 ([d309305](https://github.com/zigbang/iot-device-sdk/commit/d309305d1f19e29c892e9b943468091d7b8b790e))
* 서브 기기 등록 중지 함수 await 제거 ([d253b68](https://github.com/zigbang/iot-device-sdk/commit/d253b6874ab83bc7abfc46324428ce1e69f11e32))
* 이벤트 stop 오류 수정, 익명 로그인 오류 수정 ([ad714be](https://github.com/zigbang/iot-device-sdk/commit/ad714be701ccdcae05b57fba68c92b951d8c24ca))
* activator에서 기기 타입에따라 다르게 응답하도록 수정 ([ac4681d](https://github.com/zigbang/iot-device-sdk/commit/ac4681d0d95ef76f5a50f63f1cb6b58188ceb6ef))
* debug 콜백 할당 전에 setInformation을 호출하여 init이 안되는 문제 수정 ([ce28f3d](https://github.com/zigbang/iot-device-sdk/commit/ce28f3d786298a57b93030551b28de7d01f31c6a))
* iOS에서 게이트웨이 이벤트 수신 시, 객체 전달이 아닌 String 전달로 수정 ([421cb6a](https://github.com/zigbang/iot-device-sdk/commit/421cb6aa3f9c00842666d6fa9e16693af4e96173))
* iOS에서 기기 삭제 또는 공장 초기화 실패 시, response 안오는 문제 해결 ([07046de](https://github.com/zigbang/iot-device-sdk/commit/07046def820b7adb6d46c3c2eeb22153851ab0d7))
* remove about postinstall about husky ([2f3aa8f](https://github.com/zigbang/iot-device-sdk/commit/2f3aa8f3f4791479124b68c70a7ef35b836d2491))


### Styling

* add commitlint ([929c004](https://github.com/zigbang/iot-device-sdk/commit/929c004a5ffc7ed3127874ae59fe94b3cdcb5b09))
* support typescript (make index.d.ts) ([ddc357e](https://github.com/zigbang/iot-device-sdk/commit/ddc357ed556af250c9625f04351199a069472118))


### CI

* add INPUT_TOKEN ([ea9bf7d](https://github.com/zigbang/iot-device-sdk/commit/ea9bf7da08ac5c76028e0c6a218383b3459119c0))
* add test github action file ([0c837e7](https://github.com/zigbang/iot-device-sdk/commit/0c837e7271d046532b346b29ddc6d7903c2b6d16))
* apply github for github pages ([a9064e0](https://github.com/zigbang/iot-device-sdk/commit/a9064e0e72599507672cf3c04e728765e67091b8))
* apply path to run npm ([9ca8e16](https://github.com/zigbang/iot-device-sdk/commit/9ca8e1685e8dab1732805c5dcc1418641fc6150b))
* chagne ci ([d729aec](https://github.com/zigbang/iot-device-sdk/commit/d729aec2bdbd72667bd355aa8c4f835e28da0f21))
* change again ([85c987f](https://github.com/zigbang/iot-device-sdk/commit/85c987fc63e81cd7cbdfca0c133eb321a6c5f5ec))
* change to yarn ([c974a8c](https://github.com/zigbang/iot-device-sdk/commit/c974a8cecea863552f84b90dcadaae5aa79d7a56))
* fix action script error ([d5fe460](https://github.com/zigbang/iot-device-sdk/commit/d5fe46062fbe295593bf51c45dcf6aac79772f4f))
* fix github action for publish ([02bc71f](https://github.com/zigbang/iot-device-sdk/commit/02bc71ff87cf91ab8fc7942e7213f5a3683f4f7f))
* fix npm remove dist/doc ([5774b12](https://github.com/zigbang/iot-device-sdk/commit/5774b12ed04c000c06e1853363fe3a49c64b1fd9))
* fix npm run build ([d727c95](https://github.com/zigbang/iot-device-sdk/commit/d727c95eaf583f3b1aad9b9fc62350fa97395555))
* fix to order github action ([2df5f2f](https://github.com/zigbang/iot-device-sdk/commit/2df5f2f4fd374e69f09807616fc340ed217f81d7))
* github action make for test ([b03075e](https://github.com/zigbang/iot-device-sdk/commit/b03075e5020e5245e8875aa5a5c1c1497780c34b))
* link change log, change github action name ([061e832](https://github.com/zigbang/iot-device-sdk/commit/061e832a5d373302953bdb2db856df3b9a9080af))
* merge two md files base and change log ([8627844](https://github.com/zigbang/iot-device-sdk/commit/862784487cda46556bb2dd550f319ecda9f4c7ca))
* reame.md file is combinded by github action ([ba69524](https://github.com/zigbang/iot-device-sdk/commit/ba695247d6aa4575b7bc59f1a8e161ee23c48555))
* recovery github script ([240a1b6](https://github.com/zigbang/iot-device-sdk/commit/240a1b6df9889a242522b5c0bf3782aaf885fadd))
* setup node ([4d9d532](https://github.com/zigbang/iot-device-sdk/commit/4d9d5329e33f2bb19aba04e6846b8c7389e25b61))
* test ([d608c6e](https://github.com/zigbang/iot-device-sdk/commit/d608c6ea0ee3fb7a27e43061694307bd37eb506d))
* test again ([4e32314](https://github.com/zigbang/iot-device-sdk/commit/4e323143242fda96f2701d299e719b831f372c73))
* try to fix error again ([7733bbb](https://github.com/zigbang/iot-device-sdk/commit/7733bbbc85413ae1c8d9240e0bf5f1be8e484ff4))
* try to fix github action ([2a8f5e3](https://github.com/zigbang/iot-device-sdk/commit/2a8f5e33f5d77b9a148397d12d8bbbe36b4b9b4a))
* try to fix github action again ([d22b985](https://github.com/zigbang/iot-device-sdk/commit/d22b985c097bd02b5258d6b07e0fe8dc5336a8de))
* using actions ([0342d1e](https://github.com/zigbang/iot-device-sdk/commit/0342d1eec319c3fae6ebd6dad36a039340c2cd80))
* using npm ci ([78d545f](https://github.com/zigbang/iot-device-sdk/commit/78d545fda257673e3031de85a171f2799b87f002))
* version up ([a732673](https://github.com/zigbang/iot-device-sdk/commit/a73267366cc083a1e516077e0a49ed9c81b1f48e))


### Code Refactoring

* 코드 컨벤션 적용 ([8a1f840](https://github.com/zigbang/iot-device-sdk/commit/8a1f8401434dbb2ad6430bb3d37304697c907ec7))
* logout 함수 private으로 변경, init 메소드 구조 변경 ([02224ef](https://github.com/zigbang/iot-device-sdk/commit/02224ef53e7d7e830169b5bb374ae5d1ce40fb0d))
* merge for using module ([1c9a45b](https://github.com/zigbang/iot-device-sdk/commit/1c9a45b14bf8bbd3e60a7cdf0273dadb0cd05bd6))
* removeDevice 및 resetDevice 하나로 합침 ([91d312f](https://github.com/zigbang/iot-device-sdk/commit/91d312f5c4ea3a6c051c4cf8e834b8f262dde400))


### Others

* add & remove as using module ([a2314ee](https://github.com/zigbang/iot-device-sdk/commit/a2314ee437a95c8b6c5edacce44a1038139b465b))
* **release:** 0.0.2 ([160f287](https://github.com/zigbang/iot-device-sdk/commit/160f287e45291d4c7368ffbd0e99e353aecdbb75))
* **release:** 0.0.3 ([2c72129](https://github.com/zigbang/iot-device-sdk/commit/2c721299cf225e53d3381de872f12beacdf7c5be))
* **release:** 0.0.4 ([7b0329b](https://github.com/zigbang/iot-device-sdk/commit/7b0329b5317272476ccb4c4fd7f803cbf374aeb5))
* **release:** 0.0.5 ([3251134](https://github.com/zigbang/iot-device-sdk/commit/3251134243e5c78c6ecfd46087d449d4db869c55))
* **release:** 0.0.6 ([6d8f552](https://github.com/zigbang/iot-device-sdk/commit/6d8f5520c75d9521868d6d1dca569190702d1557))
* **release:** 0.0.7 ([38daae9](https://github.com/zigbang/iot-device-sdk/commit/38daae96127b1e38ff165884138cf7afe609beae))
* **release:** 0.0.8 ([057c11d](https://github.com/zigbang/iot-device-sdk/commit/057c11d3d5bb16d00cca34cf75415b8cb074ea72))
* **release:** 0.0.9 ([f32ec44](https://github.com/zigbang/iot-device-sdk/commit/f32ec44e97888830cc423decdeb6b63715dd2090))
* **release:** 0.1.0 ([b905d97](https://github.com/zigbang/iot-device-sdk/commit/b905d9711b44e6d6f604bc1baa269f6d5a19b75f))
* **release:** 0.1.1 ([6001492](https://github.com/zigbang/iot-device-sdk/commit/6001492e3fb846d22adc603999d840dacd4b6e8a))


### Docs

* apply typedoc ([52ab797](https://github.com/zigbang/iot-device-sdk/commit/52ab797ac0fc7b7bdc6f360cd775a86c30be8b24))
* change title for github page ([8c35823](https://github.com/zigbang/iot-device-sdk/commit/8c35823f242ef42b60bf0f9db85b1d00fb777d59))
* draw to describe of ci/cd ([b2dc586](https://github.com/zigbang/iot-device-sdk/commit/b2dc5866d1663efa285533f5aba8e9585cc141b7))
* include link change log to readme ([e0902a6](https://github.com/zigbang/iot-device-sdk/commit/e0902a664ea7c37815396b2ea6db217aad665db2))
* init function is changed ([83501b0](https://github.com/zigbang/iot-device-sdk/commit/83501b01e5a6f83daa4cdea00b9b1958865649ac))
* typedoc 초안본 배포 ([99bdff7](https://github.com/zigbang/iot-device-sdk/commit/99bdff7cbaaad7b76dcd915b661ae1f9ddb6c108))
* update github page address ([02e3696](https://github.com/zigbang/iot-device-sdk/commit/02e3696bfd3d14afdfd216cdef0c274297fad90d))
* update to show msg if uploaded gh-p by man ([b9bde2f](https://github.com/zigbang/iot-device-sdk/commit/b9bde2f80ee9c89ebd39775e978ae84c86aa5c70))
* useing github pages ([9a6bfa4](https://github.com/zigbang/iot-device-sdk/commit/9a6bfa4370d975eff4d981481e0ce265da48495e))


### Build System

* add dist folder for using npm ([7c63992](https://github.com/zigbang/iot-device-sdk/commit/7c63992b0411def0e44124b56cd55d92334acffb))
* changing module name ([e9eb14b](https://github.com/zigbang/iot-device-sdk/commit/e9eb14bae0b4a6fc342040677dec9d14dcda5fbc))
* module change to zigbang/react-native-tuya ([d87b221](https://github.com/zigbang/iot-device-sdk/commit/d87b221bc6a8ff14b009cdc777cd1eedc7cef720))
* module version is up ([4fd8b59](https://github.com/zigbang/iot-device-sdk/commit/4fd8b59cfc25e7914d0fe09251208be430cff3de))
* using seojw's one for pending reg module ([815267e](https://github.com/zigbang/iot-device-sdk/commit/815267e0be1a75e26f14295144173f1beea69273))

### 0.1.1 (2022-08-04)


### Features

* 기기 삭제 및 공장 초기화 기능 구현 ([1a92745](https://github.com/zigbang/iot-device-sdk/commit/1a92745f0215d5dce27480e3a729195dd4d7fae4))
* calling User Login ([8e5d5fe](https://github.com/zigbang/iot-device-sdk/commit/8e5d5fe5eb290433299146e768eed54d782d8287))
* logout 기능 구현 ([182b273](https://github.com/zigbang/iot-device-sdk/commit/182b27371d2819cf4e93148ef92a0d9655e08eab))
* remove using private function ([f65481a](https://github.com/zigbang/iot-device-sdk/commit/f65481ad210c31fd6322934a7bb7bb09ee387530))
* TuyaSdkBridge 디버깅 로그 콜백 이벤트 구현 ([cc80914](https://github.com/zigbang/iot-device-sdk/commit/cc80914344b0505e9c245a35fc6af47f31ba434f))


### Bug Fixes

* 머지 오류 수정 ([8ad1a42](https://github.com/zigbang/iot-device-sdk/commit/8ad1a4227a7994d59cb629f94c414ec9dcb7ad1a))
* 머지 충돌 수정 ([d309305](https://github.com/zigbang/iot-device-sdk/commit/d309305d1f19e29c892e9b943468091d7b8b790e))
* 서브 기기 등록 중지 함수 await 제거 ([d253b68](https://github.com/zigbang/iot-device-sdk/commit/d253b6874ab83bc7abfc46324428ce1e69f11e32))
* 이벤트 stop 오류 수정, 익명 로그인 오류 수정 ([ad714be](https://github.com/zigbang/iot-device-sdk/commit/ad714be701ccdcae05b57fba68c92b951d8c24ca))
* activator에서 기기 타입에따라 다르게 응답하도록 수정 ([ac4681d](https://github.com/zigbang/iot-device-sdk/commit/ac4681d0d95ef76f5a50f63f1cb6b58188ceb6ef))
* debug 콜백 할당 전에 setInformation을 호출하여 init이 안되는 문제 수정 ([ce28f3d](https://github.com/zigbang/iot-device-sdk/commit/ce28f3d786298a57b93030551b28de7d01f31c6a))
* iOS에서 게이트웨이 이벤트 수신 시, 객체 전달이 아닌 String 전달로 수정 ([421cb6a](https://github.com/zigbang/iot-device-sdk/commit/421cb6aa3f9c00842666d6fa9e16693af4e96173))
* iOS에서 기기 삭제 또는 공장 초기화 실패 시, response 안오는 문제 해결 ([07046de](https://github.com/zigbang/iot-device-sdk/commit/07046def820b7adb6d46c3c2eeb22153851ab0d7))
* remove about postinstall about husky ([2f3aa8f](https://github.com/zigbang/iot-device-sdk/commit/2f3aa8f3f4791479124b68c70a7ef35b836d2491))


### Styling

* add commitlint ([929c004](https://github.com/zigbang/iot-device-sdk/commit/929c004a5ffc7ed3127874ae59fe94b3cdcb5b09))
* support typescript (make index.d.ts) ([ddc357e](https://github.com/zigbang/iot-device-sdk/commit/ddc357ed556af250c9625f04351199a069472118))


### CI

* add INPUT_TOKEN ([ea9bf7d](https://github.com/zigbang/iot-device-sdk/commit/ea9bf7da08ac5c76028e0c6a218383b3459119c0))
* add test github action file ([0c837e7](https://github.com/zigbang/iot-device-sdk/commit/0c837e7271d046532b346b29ddc6d7903c2b6d16))
* apply github for github pages ([a9064e0](https://github.com/zigbang/iot-device-sdk/commit/a9064e0e72599507672cf3c04e728765e67091b8))
* apply path to run npm ([9ca8e16](https://github.com/zigbang/iot-device-sdk/commit/9ca8e1685e8dab1732805c5dcc1418641fc6150b))
* chagne ci ([d729aec](https://github.com/zigbang/iot-device-sdk/commit/d729aec2bdbd72667bd355aa8c4f835e28da0f21))
* change again ([85c987f](https://github.com/zigbang/iot-device-sdk/commit/85c987fc63e81cd7cbdfca0c133eb321a6c5f5ec))
* change to yarn ([c974a8c](https://github.com/zigbang/iot-device-sdk/commit/c974a8cecea863552f84b90dcadaae5aa79d7a56))
* fix action script error ([d5fe460](https://github.com/zigbang/iot-device-sdk/commit/d5fe46062fbe295593bf51c45dcf6aac79772f4f))
* fix github action for publish ([02bc71f](https://github.com/zigbang/iot-device-sdk/commit/02bc71ff87cf91ab8fc7942e7213f5a3683f4f7f))
* fix npm remove dist/doc ([5774b12](https://github.com/zigbang/iot-device-sdk/commit/5774b12ed04c000c06e1853363fe3a49c64b1fd9))
* fix npm run build ([d727c95](https://github.com/zigbang/iot-device-sdk/commit/d727c95eaf583f3b1aad9b9fc62350fa97395555))
* fix to order github action ([2df5f2f](https://github.com/zigbang/iot-device-sdk/commit/2df5f2f4fd374e69f09807616fc340ed217f81d7))
* github action make for test ([b03075e](https://github.com/zigbang/iot-device-sdk/commit/b03075e5020e5245e8875aa5a5c1c1497780c34b))
* link change log, change github action name ([061e832](https://github.com/zigbang/iot-device-sdk/commit/061e832a5d373302953bdb2db856df3b9a9080af))
* merge two md files base and change log ([8627844](https://github.com/zigbang/iot-device-sdk/commit/862784487cda46556bb2dd550f319ecda9f4c7ca))
* reame.md file is combinded by github action ([ba69524](https://github.com/zigbang/iot-device-sdk/commit/ba695247d6aa4575b7bc59f1a8e161ee23c48555))
* recovery github script ([240a1b6](https://github.com/zigbang/iot-device-sdk/commit/240a1b6df9889a242522b5c0bf3782aaf885fadd))
* setup node ([4d9d532](https://github.com/zigbang/iot-device-sdk/commit/4d9d5329e33f2bb19aba04e6846b8c7389e25b61))
* test ([d608c6e](https://github.com/zigbang/iot-device-sdk/commit/d608c6ea0ee3fb7a27e43061694307bd37eb506d))
* test again ([4e32314](https://github.com/zigbang/iot-device-sdk/commit/4e323143242fda96f2701d299e719b831f372c73))
* try to fix error again ([7733bbb](https://github.com/zigbang/iot-device-sdk/commit/7733bbbc85413ae1c8d9240e0bf5f1be8e484ff4))
* try to fix github action ([2a8f5e3](https://github.com/zigbang/iot-device-sdk/commit/2a8f5e33f5d77b9a148397d12d8bbbe36b4b9b4a))
* try to fix github action again ([d22b985](https://github.com/zigbang/iot-device-sdk/commit/d22b985c097bd02b5258d6b07e0fe8dc5336a8de))
* using actions ([0342d1e](https://github.com/zigbang/iot-device-sdk/commit/0342d1eec319c3fae6ebd6dad36a039340c2cd80))
* using npm ci ([78d545f](https://github.com/zigbang/iot-device-sdk/commit/78d545fda257673e3031de85a171f2799b87f002))
* version up ([a732673](https://github.com/zigbang/iot-device-sdk/commit/a73267366cc083a1e516077e0a49ed9c81b1f48e))


### Others

* add & remove as using module ([a2314ee](https://github.com/zigbang/iot-device-sdk/commit/a2314ee437a95c8b6c5edacce44a1038139b465b))
* **release:** 0.0.2 ([160f287](https://github.com/zigbang/iot-device-sdk/commit/160f287e45291d4c7368ffbd0e99e353aecdbb75))
* **release:** 0.0.3 ([2c72129](https://github.com/zigbang/iot-device-sdk/commit/2c721299cf225e53d3381de872f12beacdf7c5be))
* **release:** 0.0.4 ([7b0329b](https://github.com/zigbang/iot-device-sdk/commit/7b0329b5317272476ccb4c4fd7f803cbf374aeb5))
* **release:** 0.0.5 ([3251134](https://github.com/zigbang/iot-device-sdk/commit/3251134243e5c78c6ecfd46087d449d4db869c55))
* **release:** 0.0.6 ([6d8f552](https://github.com/zigbang/iot-device-sdk/commit/6d8f5520c75d9521868d6d1dca569190702d1557))
* **release:** 0.0.7 ([38daae9](https://github.com/zigbang/iot-device-sdk/commit/38daae96127b1e38ff165884138cf7afe609beae))
* **release:** 0.0.8 ([057c11d](https://github.com/zigbang/iot-device-sdk/commit/057c11d3d5bb16d00cca34cf75415b8cb074ea72))
* **release:** 0.0.9 ([f32ec44](https://github.com/zigbang/iot-device-sdk/commit/f32ec44e97888830cc423decdeb6b63715dd2090))
* **release:** 0.1.0 ([b905d97](https://github.com/zigbang/iot-device-sdk/commit/b905d9711b44e6d6f604bc1baa269f6d5a19b75f))


### Code Refactoring

* 코드 컨벤션 적용 ([8a1f840](https://github.com/zigbang/iot-device-sdk/commit/8a1f8401434dbb2ad6430bb3d37304697c907ec7))
* logout 함수 private으로 변경, init 메소드 구조 변경 ([02224ef](https://github.com/zigbang/iot-device-sdk/commit/02224ef53e7d7e830169b5bb374ae5d1ce40fb0d))
* merge for using module ([1c9a45b](https://github.com/zigbang/iot-device-sdk/commit/1c9a45b14bf8bbd3e60a7cdf0273dadb0cd05bd6))
* removeDevice 및 resetDevice 하나로 합침 ([91d312f](https://github.com/zigbang/iot-device-sdk/commit/91d312f5c4ea3a6c051c4cf8e834b8f262dde400))


### Docs

* apply typedoc ([52ab797](https://github.com/zigbang/iot-device-sdk/commit/52ab797ac0fc7b7bdc6f360cd775a86c30be8b24))
* change title for github page ([8c35823](https://github.com/zigbang/iot-device-sdk/commit/8c35823f242ef42b60bf0f9db85b1d00fb777d59))
* draw to describe of ci/cd ([b2dc586](https://github.com/zigbang/iot-device-sdk/commit/b2dc5866d1663efa285533f5aba8e9585cc141b7))
* include link change log to readme ([e0902a6](https://github.com/zigbang/iot-device-sdk/commit/e0902a664ea7c37815396b2ea6db217aad665db2))
* init function is changed ([83501b0](https://github.com/zigbang/iot-device-sdk/commit/83501b01e5a6f83daa4cdea00b9b1958865649ac))
* typedoc 초안본 배포 ([99bdff7](https://github.com/zigbang/iot-device-sdk/commit/99bdff7cbaaad7b76dcd915b661ae1f9ddb6c108))
* update github page address ([02e3696](https://github.com/zigbang/iot-device-sdk/commit/02e3696bfd3d14afdfd216cdef0c274297fad90d))
* useing github pages ([9a6bfa4](https://github.com/zigbang/iot-device-sdk/commit/9a6bfa4370d975eff4d981481e0ce265da48495e))


### Build System

* add dist folder for using npm ([7c63992](https://github.com/zigbang/iot-device-sdk/commit/7c63992b0411def0e44124b56cd55d92334acffb))
* changing module name ([e9eb14b](https://github.com/zigbang/iot-device-sdk/commit/e9eb14bae0b4a6fc342040677dec9d14dcda5fbc))
* module change to zigbang/react-native-tuya ([d87b221](https://github.com/zigbang/iot-device-sdk/commit/d87b221bc6a8ff14b009cdc777cd1eedc7cef720))
* module version is up ([4fd8b59](https://github.com/zigbang/iot-device-sdk/commit/4fd8b59cfc25e7914d0fe09251208be430cff3de))
