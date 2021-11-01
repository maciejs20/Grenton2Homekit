'use strict'

const constants = {

  // Parametry konfiguracyjne

  _VERSION: '0.5.0',
  _CLUIP: '10.10.1.70',
  _GATEHOST: 'http://10.10.1.71',
  _GATEPATH: '/set',
  _GATEPASS: 'pleaseProcessThis',
  _CLUUSERNAME: 'admin',
  _CLUPASSWORD: 'abrakadabra',
  _POLLFREQUENCY: 30,
  _HAPUSERNAME: '17:51:07:F4:BC:8A',
  _HAPPINCODE: '678-90-876',
  _HAPPORT: 47128,
  _HAPNAME: 'Grenton Home Automation',
  _OUTLETS: [
    { name: 'DOU7390', id: 'DOU7390' },
    { name: 'DOU1181', id: 'DOU1181' },
    { name: 'DOU4403', id: 'DOU4403' }
  ]

}

module.exports = Object.freeze(constants) // freeze prevents changes by users
