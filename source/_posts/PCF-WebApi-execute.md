---
title: PCF WebApi execute
date: 2020-06-10 23:05:42
tags:
  - D365
  - PCF
  - Power Apps
  - Power Apps Component Framework
categories:
  - Power Apps Component Framework
  - PCF Tips 'n' Tricks
description: Yep, execute is missing from the docs and the type definitions but it's there and it works!
excerpt: Yep, execute is missing from the docs and the type definitions but it's there and it works!
---

## The PCF WebApi execute method is lurking in the background!

Yep, missing from the [docs](https://docs.microsoft.com/en-us/powerapps/developer/component-framework/reference/webapi) and the type definitions but it's there and it works!

![](pcf-webapi.png)

### execute

```TypeScript
(context.webAPI as any).execute(request).then(successCallback, errorCallback);
```

_see the `execute` Client API [docs](https://docs.microsoft.com/en-us/powerapps/developer/model-driven-apps/clientapi/reference/xrm-webapi/online/execute) for more info_

### executeMultiple

```TypeScript
(context.webAPI as any)
  .executeMultiple(requests)
  .then(successCallback, errorCallback);
```

_see the `executeMultiple` Client API [docs](https://docs.microsoft.com/en-us/powerapps/developer/model-driven-apps/clientapi/reference/xrm-webapi/online/executemultiple) for more info_

Enjoy!
Ollie

_Disclaimer!_
_Some of the tips 'n' tricks in the [PCF Tips 'n' Tricks](/categories/Power-Apps-Component-Framework/PCF-Tips-n-Tricks/) category are to be used with caution. Although they may work at the time of writing, they may or may not be officially supported by Microsoft_
