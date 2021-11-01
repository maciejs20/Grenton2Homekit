'use strict'

const log = require('./appLogger.js')
const { appConfig } = require('./appConfig.js')
const got = require('got')

const myModName = 'gateTalker'

function commandsDou (operation) {
  // commands supported for digital out and their mapping into GATE api
  let command
  switch (operation) {
    case 'get':
      command = 'get'
      break
    case 'switch':
      command = 'switch'
      break
    case 'switchOn':
      command = 'switchOn'
      break
    case 'switchOff':
      command = 'switchOff'
      break
  }
  return command
}

function constructCommand (grentonId, operation) {
  // search for proper command based on device type, embedded into grentonId
  // currently we support only DigitalOut
  // and commands: get, switch, switchOn, switchOff
  // this is not really needed at this moment, but when we will add additional devices it may be usefull

  const devType = grentonId.substring(0, 3)
  let command

  switch (devType) {
    case 'DOU':
      // digital out
      command = commandsDou(operation)
      break
    default:
      log.info(`${myModName}:constructCommand unsupported device type: ${devType}`)
  }
  log.info(`${myModName}:constructCommand command: ${command}`)
  return (command)
}

function constructUrl (grentonId, operation) {
  // create proper url for gate listener
  // working example url is:
  // http://10.10.1.71/set?cmd=<operation>&obj=DOU7390&pass=pleaseProcessThis

  const url = appConfig.gateHost + appConfig.gatePath + '?cmd=' + constructCommand(grentonId, operation) + '&obj=' + grentonId + '&pass=' + appConfig.gatePass
  return url
}

async function talkWithGate (url, callback) {
  // perform device communication using url given
  try {
    const response = await got(url)
    log.debug(`${myModName}:talkWithGate response: ${response.body}`)
    callback(response.body, null)
  } catch (error) {
    log.error(`${myModName}:talkWithGate response error: ${error}`)
    callback(null, error)
  }
}

async function getDeviceState (grentonId, callback) {
  // get current state for device grentonID (i.e. DOUXXXX)

  talkWithGate(constructUrl(grentonId, 'get'), function (response, error) {
    callback(response, error)
  })
}

async function toggleDeviceState (grentonId, callback) {
  // toggle (switch) device for device grentonID (i.e. DOUXXXX)

  talkWithGate(constructUrl(grentonId, 'switch'), function (response, error) {
    callback(response, error)
  })
}

async function switchOnDeviceState (grentonId, callback) {
  // switchOn  device for device grentonID (i.e. DOUXXXX)
  talkWithGate(constructUrl(grentonId, 'switchOn'), function (response, error) {
    callback(response, error)
  })
}

async function switchOffDeviceState (grentonId, callback) {
  // switchOff  device for device grentonID (i.e. DOUXXXX)
  talkWithGate(constructUrl(grentonId, 'switchOff'), function (response, error) {
    callback(response, error)
  })
}

function setup () {

}

exports.setup = setup
exports.getDeviceState = getDeviceState
exports.toggleDeviceState = toggleDeviceState
exports.switchOnDeviceState = switchOnDeviceState
exports.switchOffDeviceState = switchOffDeviceState
