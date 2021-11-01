# Grenton2Homekit
This is a project to expose Grenton devices via Apple Homekit.

(c) Maciej Szulc, 2021

It requires to have Grenton HTTPGate installed and accessible to this module.
Also, this requires to setup /set endpoint at the gate using special LUA script.

This is initial version of code.
The code is not clean, there are many bugs.

## Configuration
At this time all configuration of Grenton2Homekit is done via constants.js editing.

You have to set:
- _GATEHOST to URL of Your Grenton HTTPGate 
- _OUTLETS - should contain ID and names for Your digital outs (get them from ObjectManager -> specific DOUXXXXX ->ID, remove CLU ID from this field). i.e. if there is a CLU244004970->DOU7221, than You have to put only DOU7221. Name may be set to anything meaningfull. 
Example:
```
  _OUTLETS: [
    { name: 'DOU7390', id: 'DOU7390' },
    { name: 'DOU1181', id: 'DOU1181' },
    { name: 'DOU4403', id: 'DOU4403' }
  ],
  ```
## Current state
Currently it allows to manipulate only DOUT type of devices.
Works in two way mode. Homekit updates are sent directly to gate. Backward updates (from gate to homekit) are synchronized using polling with timeout of 5 seconds.

## Warning
This is work in progress. I don't guarantee anything. No support is provided.
Feel free to modify/add Your modifications.

## Example log from run

```
> grenton2homekit@0.1.0 start
> node server.js

Initializing HAP-NodeJS v0.9.6...
[00:02:42 INFO ]  dev-logger: setup.
[00:02:42 INFO ]  server.js     setup Grenton2Apple v0.1.0
[00:02:42 INFO ]  gateTalker    setup starts
[00:02:42 INFO ]  appleTalker   setup starts
[00:02:42 INFO ]  appleTalker   createOutlet {"name":"DOU7390","id":"DOU7390"}
[00:02:42 INFO ]  server.js     setup main ends.
[00:02:42 DEBUG]  appleTalker   createOutlet initial state false
[00:02:42 INFO ]  appleTalker   createOutlet {"name":"DOU1181","id":"DOU1181"}
[00:02:43 DEBUG]  appleTalker   createOutlet initial state false
[00:02:43 INFO ]  appleTalker   createOutlet {"name":"DOU4403","id":"DOU4403"}
[00:02:44 DEBUG]  appleTalker   createOutlet initial state true
Preparing Advertiser for 'Grenton Home Automation 4921' using bonjour-hap backend!
[00:02:44 INFO ]  appleTalker   setup published bridge (3 Accessories) Grenton Home Automation 17:51:07:F4:BC:8A on port 47128
[00:02:44 INFO ]  appleTalker   setup Accessory setup finished!
Starting to advertise 'Grenton Home Automation 4921' using bonjour-hap backend!
[00:02:50 DEBUG]  appleTalker   updateOutlets new value on Gate, updating DOU4403=true !
[00:02:50 INFO ]  appleTalker   setEvent DOU4403 grenton.gate.dout.DOU4403 Setting light state to:true
[00:02:55 INFO ]  appleTalker   getEvent DOU7390 grenton.gate.dout.DOU7390 state=false
[00:02:56 INFO ]  appleTalker   getEvent DOU1181 grenton.gate.dout.DOU1181 state=false
[00:02:57 INFO ]  appleTalker   getEvent DOU4403 grenton.gate.dout.DOU4403 state=true
[00:03:03 INFO ]  appleTalker   getEvent DOU7390 grenton.gate.dout.DOU7390 state=false
[00:03:04 DEBUG]  appleTalker   updateOutlets new value on Gate, updating DOU7390=true !
[00:03:04 INFO ]  appleTalker   setEvent DOU7390 grenton.gate.dout.DOU7390 Setting light state to:true
[00:03:04 INFO ]  appleTalker   getEvent DOU4403 grenton.gate.dout.DOU4403 state=true
[00:03:05 INFO ]  appleTalker   getEvent DOU1181 grenton.gate.dout.DOU1181 state=false
[00:03:18 INFO ]  appleTalker   getEvent DOU7390 grenton.gate.dout.DOU7390 state=true
[00:03:19 INFO ]  appleTalker   getEvent DOU1181 grenton.gate.dout.DOU1181 state=false
[00:03:20 INFO ]  appleTalker   getEvent DOU4403 grenton.gate.dout.DOU4403 state=true
```