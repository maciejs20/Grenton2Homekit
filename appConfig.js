// moduł zarządza konfiguracją programu
// -------------------------------------

const constants = require('./constants')
const log = require('./appLogger.js')
const process = require('process')

// - get site config {cluIp, gateUrl, cluUsername, cluPassword}
// - get device naming {friendlyName; grentonId}
// - get homekit config {}
// - get parameters {pollFrequency}

class AppConfig {
  get outlets () {
    return (this._outlets)
  }

  set outlets (val) {
    this._outlets = val
  }

  get hapUsername () {
    return (this._hapUsername)
  }

  set hapUsername (val) {
    this._hapUsername = val
  }

  get hapPincode () {
    return (this._hapPincode)
  }

  set hapPincode (val) {
    this._hapPincode = val
  }

  get hapPort () {
    return (this._hapPort)
  }

  set hapPort (val) {
    this._hapPort = val
  }

  get hapName () {
    return (this._hapName)
  }

  set hapName (val) {
    this._hapName = val
  }

  get pollFrequency () {
    return (this._pollFrequency)
  }

  set pollFrequency (val) {
    this._pollFrequency = val
  }

  get cluIp () {
    return (this._cluIp)
  }

  set cluIp (val) {
    this._cluIp = val
  }

  get gateHost () {
    return (this._gateHost)
  }

  set gateHost (val) {
    this._gateHost = val
  }

  get gatePath () {
    return (this._gatePath)
  }

  set gatePath (val) {
    this._gatePath = val
  }

  get gatePass () {
    return (this._gatePass)
  }

  set gatePass (val) {
    this._gatePass = val
  }

  get cluUsername () {
    return this._cluUsername
  }

  set cluUsername (val) {
    this._cluUsername = val
  }

  get cluPassword () {
    return this._cluPassword
  }

  set cluPassword (val) {
    this._cluPassword = val
  }

  get VERSION () {
    return this._VERSION
  }

  set VERSION (val) {
    this._VERSION = val
  }

  constructor () {
    this.VERSION = constants._VERSION
    this.cluIp = constants._CLUIP
    this.gateHost = constants._GATEHOST
    this.gatePath = constants._GATEPATH
    this.gatePass = constants._GATEPASS
    this.cluUsername = constants._CLUUSERNAME
    this.cluPassword = constants._CLUPASSWORD
    this.pollFrequency = constants._POLLFREQUENCY
    this.hapUsername = constants._HAPUSERNAME
    this.hapPincode = constants._HAPPINCODE
    this.hapPort = constants._HAPPORT
    this.hapName = constants._HAPNAME
    this.outlets = constants._OUTLETS
  }
}

const appConfig = new AppConfig(process.env)
log.info('App config is: ', appConfig)

module.exports = {
  appConfig,
  constants
}
