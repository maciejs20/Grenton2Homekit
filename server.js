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

  log.info(`${myModName}:setup main ends.`)
}

main()
