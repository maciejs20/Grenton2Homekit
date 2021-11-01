# Grenton2Homekit
This is a project to expose Grenton devices via Apple Homekit.

(c) Maciej Szulc, 2021

It requires to have Grenton HTTPGate installed and accessible to this module.
Also, this requires to setup /set endpoint at the gate using special LUA script. It will be published soon.

This is initial version of code.
Currently it allows to manipulate only DOUT type of devices.
The code is not clean, there are many bugs.

## Configuration
At this time all configuration of Grenton2Homekit is done via constants.js editing.

You have to set:
- _GATEHOST to URL of Your Grenton HTTPGate 
- _OUTLETS - should contain ID for Your ports (get them from ObjectManager -> specific DOUXXXXX ->ID, remove CLU ID from this field). i.e. if there is a CLU244004970->DOU7221, than You have to put only DOU7221. Example:
```
  _OUTLETS: [
    { name: 'DOU7390', id: 'DOU7390' },
    { name: 'DOU1181', id: 'DOU1181' },
    { name: 'DOU4403', id: 'DOU4403' }
  ],
  ```

## Warning
This is work in progress. I don't guarantee anything. No support is provided.
Feel free to modify/add Your modifications.