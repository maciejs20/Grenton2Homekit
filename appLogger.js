'use strict'

const mlog = require('loglevel')
// const { appConfig } = require('./appConfig.js')
const prefix = require('loglevel-plugin-prefix')
const chalk = require('chalk')

const myModName = 'dev-logger'

const log = mlog
let colors

function parseMsg (msg) {
  // znajdz nazwe modulu ktory wyslal wiadomosc
  const rx = /^(.{5,12}?):(.*)/
  const arr = rx.exec(msg)
  let isOK = true

  if (arr !== null) {
    if (arr.length !== 3) {
      isOK = false
    }
  } else {
    isOK = false
  }

  const ret = {}
  if (isOK) {
    ret.module = arr[1]
    ret.msg = arr[2]
  } else {
    ret.msg = msg
    ret.module = ''
  }

  const msize = ret.module.length
  let missing
  if (msize < 13) {
    missing = 13 - msize
    ret.module = ret.module + new Array(missing).join(' ')
  }

  ret.full = ret.module + '  ' + ret.msg

  return ret
}

function info (msg) {
  const mparsed = parseMsg(msg)
  mlog.info(mparsed.full)
}

function error (msg) {
  const mparsed = parseMsg(msg)
  mlog.error(mparsed.full)
}

function debug (msg) {
  const mparsed = parseMsg(msg)
  mlog.debug(mparsed.full)
}
function setLevel (level) {
  mlog.setLevel(level)
}

function getLevel () {
  return mlog.getLevel()
}
function setup () {
  colors = {
    TRACE: chalk.magenta,
    DEBUG: chalk.cyan,
    INFO: chalk.blue,
    WARN: chalk.yellow,
    ERROR: chalk.red
  }
  prefix.reg(mlog)
  mlog.enableAll()

  prefix.apply(mlog, {
    format (level, name, timestamp) {
      let tlevel = level
      if (tlevel.length < 6) {
        tlevel = (tlevel + new Array(6 - tlevel.length).join(' ')).toString()
      }
      // console.log('level is:', level)
      return `[${chalk.gray(`${timestamp}`)} ${colors[level.toUpperCase()](tlevel)}] `
    }
  })

  prefix.apply(mlog.getLogger('critical'), {
    format (level, name, timestamp) {
      return chalk.red.bold(`[${timestamp}] ${level} ${name}:`)
    }
  })
  mlog.setDefaultLevel('info')
  log.info(`${myModName}: setup.`)
}

exports.setup = setup
exports.info = info
exports.error = error
exports.debug = debug
exports.setLevel = setLevel
exports.getLevel = getLevel
exports.log = log
