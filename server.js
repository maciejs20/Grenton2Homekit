'use strict'

const log = require('./appLogger.js')
const { appConfig } = require('./appConfig.js')
const gate = require('./gateTalker.js')
const apple = require('./appleTalker.js')

const myModName = 'server.js'

const main = function () {
  log.setup()
  log.setLevel('DEBUG')

  log.info(`${myModName}:setup Grenton2Apple v${appConfig.VERSION}`)
  gate.setup()
  apple.setup()

  // test device response
  gate.getDeviceState('DOU7390', function (response, error) {
    if (error) {
      log.error(`${myModName}:main device response error: ${error}`)
    } else {
      log.debug(`${myModName}:main device response: ${response}`)
    }
  })

  // test device switch
  gate.toggleDeviceState('DOU7390', function (response, error) {
    if (error) {
      log.error(`${myModName}:main device response error: ${error}`)
    } else {
      log.debug(`${myModName}:main device response: ${response}`)
    }
  })

  log.info(`${myModName}:setup main ends.`)
}

main()
