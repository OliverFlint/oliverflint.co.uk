---
title: D365 TypeScript Web Resources - Part 6 - Application Insights
date: 2021-04-30 22:00:00
tags:
  - D365
  - Web Resources
  - TypeScript
  - JavaScript
categories:
  - D365 TypeScript
description: Application Insights, a feature of Azure Monitor, is an extensible Application Performance Management (APM) service for developers and DevOps professionals. Use it to monitor your live applications. In this post I'll go though the steps required to set it up in your TypeScript Webresources project.
excerpt: Application Insights, a feature of Azure Monitor, is an extensible Application Performance Management (APM) service for developers and DevOps professionals. Use it to monitor your live applications. In this post I'll go though the steps required to set it up in your TypeScript Webresources project.
---

Before you get stuck into this make sure you've checked out any previous parts to the [series](/categories/D365-TypeScript/). Each part in this series follows on from the previous, so you may need to grab the code from the previous part if you haven't been following.

# Application Insights

## What is Application Insights?

> Application Insights, a feature of Azure Monitor, is an extensible Application Performance Management (APM) service for developers and DevOps professionals. Use it to monitor your live applications. It will automatically detect performance anomalies, and includes powerful analytics tools to help you diagnose issues and to understand what users actually do with your app. It's designed to help you continuously improve performance and usability. It works for apps on a wide variety of platforms including .NET, Node.js, Java, and Python hosted on-premises, hybrid, or any public cloud. It integrates with your DevOps process, and has connection points to a variety of development tools. It can monitor and analyze telemetry from mobile apps by integrating with Visual Studio App Center.

[https://docs.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview](https://docs.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview)

## Setup

First lets install the npm package(s):

```
npm install @microsoft/applicationinsights-web
```

Next we need to setup Application Insights in Azure. If you don't have an azure subscription you can signup for a free trial [here](https://azure.microsoft.com/en-gb/free/).

Create an Application Insights Resource in Azure by following the steps [here](https://docs.microsoft.com/en-us/azure/azure-monitor/app/create-new-resource) (you can stop at the bit where you copy the instrumentation key)

Now you have an app insights resource and the instrumentation key we are ready to go!

## The Code

First we'll put together a little module that encapsulates a minimal setup of Application Insights API

```typescript
import { ApplicationInsights } from "@microsoft/applicationinsights-web";

const init = () => {
  const appins = new ApplicationInsights({
    config: {
      instrumentationKey: "YOUR_KEY",
    },
  });
  appins.loadAppInsights();
  (window as any).d365ts_appinsights = appins;
  return appins;
};

export const appInsights = (window as any).d365ts_appinsights
  ? ((window as any).d365ts_appinsights as ApplicationInsights)
  : init();
```

Now, we can simply import our module

```typescript
import { appInsights } from "./appinsights";
```

And start tracking page views

```typescript
appInsights.trackPageView();
```

Or track exceptions

```typescript
appInsights.trackException({
  exception: { message: "This is an error", name: "Onload Error" },
});
```

There are also other tracking functions `trackMetric`, `trackEvent`, `trackTrace`, etc.

## Telemetry Initializer

One of the great things about the telemetry initializer is that it allow you to define some custom data/properties to include when tracking

```typescript
appins.addTelemetryInitializer((item) => {
  const globalCtx = Xrm.Utility.getGlobalContext();
  item.data.Username = globalCtx.userSettings?.userName;
  item.data.UserId = globalCtx.userSettings?.userId;
  item.data.SecurityRoles = (globalCtx.userSettings?.roles as any)
    ?.getAll()
    ?.map((item) => item.name)
    ?.join("|");
  item.data.OrgUniqueName = globalCtx.organizationSettings?.uniqueName;
  item.data.Client = globalCtx.client?.getClient();
  item.data.ClientState = globalCtx.client?.getClientState();
});
```

To have this included in all tracking we can add it with the module...

```typescript
const init = () => {
  const appins = new ApplicationInsights({
    config: {
      instrumentationKey: "d5656791-01e1-4d2e-9172-08fd79545a97",
    },
  });
  appins.loadAppInsights();
  appins.addTelemetryInitializer((item) => {
    const globalCtx = Xrm.Utility.getGlobalContext();
    item.data.Username = globalCtx.userSettings?.userName;
    item.data.UserId = globalCtx.userSettings?.userId;
    item.data.SecurityRoles = (globalCtx.userSettings?.roles as any)
      ?.getAll()
      ?.map((item) => item.name)
      ?.join("|");
    item.data.OrgUniqueName = globalCtx.organizationSettings?.uniqueName;
    item.data.Client = globalCtx.client?.getClient();
    item.data.ClientState = globalCtx.client?.getClientState();
  });
  (window as any).d365ts_appinsights = appins;
  return appins;
};
```

You may even want to add a second telemetry initializer for adding some data from the form context

```typescript
export const addFormContextTelemetryInitializer = (
  formContext: Xrm.BasicPage
) => {
  appInsights.addTelemetryInitializer((item) => {
    item.data.EntityName = formContext.data?.entity?.getEntityName();
    item.data.EntityId = formContext.data?.entity?.getId();
    item.data.FormName = formContext.ui?.formSelector
      ?.getCurrentItem()
      ?.getLabel();
    item.data.FormType = formContext.ui?.getFormType();
  });
};
```

Now when the form loads we can add the form context initializer

```typescript
addFormContextTelemetryInitializer((formContext as unknown) as Xrm.BasicPage);
```

## What's it look like!?

Ok ok! Here is what all that lovely data will look like in Azure Application Insights...

First we have the results in the transaction search:
![transaction search](log.png)

Then after selecting a result we can see the detail:
![End-to-end transaction details](detail.png)

And there we have it!

## That's all folks!

I hope that has been useful!

You can download a copy of the source code for this blog post [here](d365ts-pt6.zip)

Thanks for reading.
Ollie
