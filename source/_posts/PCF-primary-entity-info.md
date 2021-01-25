---
title: PCF primary entity info
date: 2020-06-10 18:59:36
tags:
  - D365
  - PCF
  - Power Apps
  - Power Apps Component Framework
categories:
  - Power Apps Component Framework
  - PCF Tips 'n' Tricks
description: At present the PCF Template provided by the Power Apps Cli gives us lots of opportunity and scope to improve functionality, but the type definitions are missing some objects that are present api. Now this could be for many reasons, one being support. Anyway, I'm a rogue so here is one I've already used a lot!
excerpt: At present the PCF Template provided by the Power Apps Cli gives us lots of opportunity and scope to improve functionality, but the type definitions are missing some objects that are present api. Now this could be for many reasons, one being support. Anyway, I'm a rogue so here is one I've already used a lot!
---

## Getting the primary entity info

At present the PCF Template provided by the Power Apps Cli gives us lots of opportunity and scope to improve functionality, but the type definitions are missing some objects that are present api. Now this could be for many reasons, one being support. Anyway, I'm a rogue so here is one I've already used a lot!

![](pcf-entityinfo.png)

### The entity id (guid)

```typescript
const entityId = (context.mode as any).contextInfo.entityId;
```

This is the equivalent of the following in the Client API

```typescript
const entityId = formContext.data.entity.getId();
```

### The entity type (entity logical name)

```typescript
const entityTypeName = (context.mode as any).contextInfo.entityTypeName;
```

This is the equivalent of the following in the Client API

```typescript
const entityTypeName = formContext.data.entity.getEntityName();
```

### The record name (primary attribute value)

```typescript
const entityTypeName = (context.mode as any).contextInfo.entityRecordName;
```

This is the equivalent of the following in the Client API

```typescript
const entityTypeName = formContext.data.entity.getPrimaryAttributeValue();
```

Hopefully this will be helpful to some of you!

Thanks for reading
Ollie

_Disclaimer!_
_Some of the tips 'n' tricks in the [PCF Tips 'n' Tricks](/categories/Power-Apps-Component-Framework/PCF-Tips-n-Tricks/) category are to be used with caution. Although they may work at the time of writing, they may or may not be officially supported by Microsoft_
