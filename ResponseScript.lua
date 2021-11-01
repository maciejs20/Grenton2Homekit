--[[
 Endpoint for Homekit integration
 Allows to set/get any Grenton's endpoint (if supported device type)
 Does not check if device actually exists
 Returns current state of target

 expects JSON with following fields:
    "obj": "DOU7390",   Device name
    "cmd": "switch",    Operation
    "pass": "pleaseProcessThis"  just a code that shows this is valid packet, not actual password


  please set:
    Gate_HTTP  to Your gate name as set in OM
    CLU221004970  to Your CLU ID

  Created by Maciej Szulc, 2021. 
--]] 


-- Functions
-- 

function sendCommand (target, command)
  -- Send command to CLU 
    local myCommand = target .. command
    local res
    
    res = CLU221004970:execute(0, myCommand)
    return res
  end
  
  function getDeviceCommands (obj, cmd) 
  -- Check valid commands for device type
    local myOperation
    local myGetStatus
    local isValid = false
    
    local devType=string.sub(obj, 1, 3)
    
  
    if devType == "DOU" then
    -- valid for DOUT device type. This is how we get status
      myGetStatus = ":get(0)"
    -- and this is what we can do for that device type
      if cmd == "switch" then myOperation = ":execute(0, 0)"; isValid=true end
      if cmd == "switchOn" then myOperation = ":execute(1, 0)"; isValid=true end
      if cmd == "switchOff" then myOperation = ":execute(2, 0)"; isValid=true end
      if cmd == "get" then myOperation = myGetStatus; isValid=true end
    end
  
    return isValid, myOperation, myGetStatus
  end
  
  function isEmpty(s)
    return s == nil or s == ''
  end
  
  
  function checkRequest (data) 
  -- check if all parameters are set properly
    local isValid = true
    
    if isEmpty (data) then isValid = false end
    if isEmpty (data.pass) then isValid = false end
    if isEmpty (data.obj) then isValid = false end
    if isEmpty (data.cmd) then isValid = false end
    if isEmpty (data.pass) then isValid = false end
    if data.pass ~= "pleaseProcessThis" then isValid = false end
    return (isValid)
  end
  
  -- Main code
  -- 
  
  local data = Gate_HTTP->NodeRedInterface->QueryStringParams
  
  local obj
  local cmd
  
  local isValid 
  local resp
  
  local myState
  local myStateBool
  local myOperation
  local myGetStatus
  
  
  
  if checkRequest(data) then  
  -- Looks like packet from valid client
  
    obj=data.obj
    cmd=data.cmd
    
    -- check if command is supported for this device type
    isValid, myOperation, myGetStatus = getDeviceCommands (obj, cmd)
  
  
    if isValid == true then
    -- Looks like we know how to deal with this device type
      if myOperation ~= myGetStatus then 
      -- not a get status command
        sendCommand (obj, myOperation)
        -- Wait for command to complete.
        SYSTEM.Wait(700)
      end 
      -- Grenton's LUA does not support pcal command so we can't verify if endpoint is valid
      myState = sendCommand (obj, myGetStatus)
      if myState == 1 then myStateBool = true end
      if myState == 0 then myStateBool = false end
      
      resp = {state = myStateBool}
    else
    -- we don't support this device type
      resp = {error = "unknownType", valid = isValid, get = myGetStatus } 
    end
  else 
    -- Packet not from valid client
    resp = { error = "notValid" }
  end
  
  -- send response
  Gate_HTTP->NodeRedInterface->SetResponseBody(resp)
  Gate_HTTP->NodeRedInterface->SendResponse()