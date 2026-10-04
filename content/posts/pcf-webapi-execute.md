---
summary: "Explore the execute and executeMultiple methods available in the PCF WebApi."
title: PCF WebApi execute
slug: pcf-webapi-execute
published: 2020-06-10T23:05:42.000Z
path: /2020/06/11/pcf-webapi-execute/
description: Yep, execute is missing from the docs and the type definitions but
  it's there and it works!
topics:
  - power-platform
tags:
  - D365
  - PCF
  - Power Apps
  - Power Apps Component Framework
draft: false
legacyPath: /2020/06/11/PCF-WebApi-execute/
rssGuid: http://www.oliverflint.co.uk/2020/06/11/PCF-WebApi-execute/
legacyHeadings:
  - The-PCF-WebApi-execute-method-is-lurking-in-the-background
  - execute
  - executeMultiple
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
