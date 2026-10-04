---
summary: "Find the current entity ID, logical name and record name from a PCF component."
title: PCF primary entity info
slug: pcf-primary-entity-info
published: 2020-06-10T18:59:36.000Z
path: /2020/06/10/pcf-primary-entity-info/
description: At present the PCF Template provided by the Power Apps Cli gives us
  lots of opportunity and scope to improve functionality, but the type
  definitions are missing some objects that are present api. Now this could be
  for many reasons, one being support. Anyway, I'm a rogue so here is one I've
  already used a lot!
topics:
  - power-platform
tags:
  - D365
  - PCF
  - Power Apps
  - Power Apps Component Framework
draft: false
legacyPath: /2020/06/10/PCF-primary-entity-info/
rssGuid: http://www.oliverflint.co.uk/2020/06/10/PCF-primary-entity-info/
legacyHeadings:
  - Getting-the-primary-entity-info
  - The-entity-id-guid
  - The-entity-type-entity-logical-name
  - The-record-name-primary-attribute-value
---

## Getting the primary entity info

At present the PCF Template provided by the Power Apps Cli gives us lots of opportunity and scope to improve functionality, but the type definitions are missing some objects that are present api. Now this could be for many reasons, one being support. Anyway, I'm a rogue so here is one I've already used a lot!

![](pcf-entityinfo.png)

### The entity id (guid)

```TypeScript
const entityId = (context.mode as any).contextInfo.entityId;
```

This is the equivalent of the following in the Client API

```TypeScript
const entityId = formContext.data.entity.getId();
```

### The entity type (entity logical name)

```TypeScript
const entityTypeName = (context.mode as any).contextInfo.entityTypeName;
```

This is the equivalent of the following in the Client API

```TypeScript
const entityTypeName = formContext.data.entity.getEntityName();
```

### The record name (primary attribute value)

```TypeScript
const entityTypeName = (context.mode as any).contextInfo.entityRecordName;
```

This is the equivalent of the following in the Client API

```TypeScript
const entityTypeName = formContext.data.entity.getPrimaryAttributeValue();
```

Hopefully this will be helpful to some of you!

Thanks for reading
Ollie

_Disclaimer!_
_Some of the tips 'n' tricks in the [PCF Tips 'n' Tricks](/categories/Power-Apps-Component-Framework/PCF-Tips-n-Tricks/) category are to be used with caution. Although they may work at the time of writing, they may or may not be officially supported by Microsoft_
