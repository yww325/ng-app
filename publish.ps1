# https://ss64.com/ps/call.html  
# .{} is optional, one line of ps command is enough.
$psblock = ".{Set-Location -Path $PSScriptRoot; ng build --base-href '/ng-app2/' --configuration=production2 ; pause}"
Start-Process powershell -Verb runas $psblock
