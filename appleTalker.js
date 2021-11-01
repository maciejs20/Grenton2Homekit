'use strict'
// this is based on https://github.com/homebridge/HAP-NodeJS/wiki/Using-HAP-NodeJS-as-a-library

// state: działa wysyłanie danych
//        działa auto update stanu jeśli się zmieni ale kapryśnie. prawidlowo pokazuje na starcie tylko
//        trzeba coś wymyślić
//        ale trzeba poczyścić kod bo brzydki

const log = require('./appLogger.js')
const { appConfig } = require('./appConfig.js')
const hap = require('hap-nodejs')
const gate = require('./gateTalker.js')
const { promisify } = require('util')

const myModName = 'appleTalker'

const Accessory = hap.Accessory
const Characteristic = hap.Characteristic
const CharacteristicEventTypes = hap.CharacteristicEventTypes
const Service = hap.Service

let bridge
const accessoryOutlets = []

async function createOutlet (config, done) {
  // create accessory for grenton outlet
  log.info(`${myModName}:createOutlet ${JSON.stringify(config)}`)
  const uuid = 'grenton.gate.dout.' + config.id
  const name = config.name

  const accessoryUuid = hap.uuid.generate(uuid)
  const accessory = new Accessory(name, accessoryUuid)

  const lightService = new Service.Lightbulb(name)

  gate.getDeviceState(config.id, function (res, err) {
    // get initial state of outlet
    if (err) {
      // TODO error handling
      log.error(`${myModName}:createOutlet initial get error`)
      return done('initialDeviceGet', null)
    } else {
      const respData = JSON.parse(res)
      let currState = respData.state
      log.debug(`${myModName}:createOutlet initial state ${currState} from ${JSON.stringify(respData)} from ${res} `)

      let currentLightState = currState // on or off

      const onCharacteristic = lightService.getCharacteristic(Characteristic.On)

      onCharacteristic.on(CharacteristicEventTypes.GET, callback => {
        gate.getDeviceState(config.id, function (res, err) {
          if (err) {
            callback('error', null)
          } else {
            const respData = JSON.parse(res)
            currState = respData.state
            log.info(`${myModName}:getEvent ${name} ${uuid} Queried current light state: ${currentLightState}`)
            callback(undefined, currState)
          }
        })
      })
      onCharacteristic.on(CharacteristicEventTypes.SET, (value, callback) => {
        log.info(`${myModName}:setEvent ${name} ${uuid} Setting light state to:${value}`)
        if (value === true) {
          gate.switchOnDeviceState(config.id, function (res, err) {
            if (err) {
              // TODO error handling
            } else {
              currentLightState = value
              callback()
            }
          })
        } else {
          gate.switchOffDeviceState(config.id, function (res, err) {
            if (err) {
              // TODO error handling
            } else {
              currentLightState = value
              callback()
            }
          })
        }
        // currentLightState = value
        // callback()
      })

      accessory.addService(lightService) // adding the service to the accessory
    }
    // call back caller
    return done(null, accessory)
  })
}

async function setup () {
// create accessories and bridge, expose on the network

  const bridgeUuid = hap.uuid.generate('grenton.gate')

  for (const index in appConfig.outlets) {
    const acc = await promisify(createOutlet)(appConfig.outlets[index])
    log.info(`${myModName}:setup have acc ${index}`)
    accessoryOutlets.push(acc)
  }

  bridge = new hap.Bridge(appConfig.hapName, bridgeUuid)

  bridge.on('identify', (paired, callback) => {
    log.info(`${myModName}:bridgeIdentify `)
    callback()
  })

  bridge.getService(hap.Service.AccessoryInformation)
    .setCharacteristic(hap.Characteristic.Manufacturer, 'MDS')
    .setCharacteristic(hap.Characteristic.Model, 'Grenton Bridge')
    .setCharacteristic(hap.Characteristic.SerialNumber, '1234')
    .setCharacteristic(hap.Characteristic.FirmwareRevision, appConfig.VERSION)

  // add all outlets
  for (const index in accessoryOutlets) {
    // log.info(`${myModName}:setup attach accessory ${index}: ${JSON.stringify(accessoryOutlets[index])}`)
    bridge.addBridgedAccessory(accessoryOutlets[index])
  }

  // once everything is set up, we publish the accessory. Publish should always be the last step!
  bridge.publish({
    username: appConfig.hapUsername,
    pincode: appConfig.hapPincode,
    port: appConfig.hapPort,
    category: hap.Accessory.Categories.OTHER
  }, true)

  log.info(`${myModName}:setup published bridge (${bridge.bridgedAccessories.length} Accessories) ${appConfig.hapName} ${appConfig._hapUsername} on port ${appConfig.hapPort}`)

  log.info(`${myModName}:setup Accessory setup finished!`)
}

exports.setup = setup
