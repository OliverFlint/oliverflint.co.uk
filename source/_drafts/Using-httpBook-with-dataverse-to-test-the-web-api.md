---
title: Using httpBook with Dataverse to test the web api
tags:
  - D365
  - Dataverse
  - WebApi
categories:
description: Testing the Dataverse WebApi can sometime be a little tedious...
excerpt: Testing the Dataverse WebApi can sometime be a little tedious...
---

## Problem

We all test our code and usage of api's, that's a given. But when writing code to consume the Dataverse WebApi and Custom Dataverse Api's, being able to run quick tests to validate our syntax and usage can sometimes be a little painful and time consuming. There are plenty of options to overcome this and help us, here I am going to talk about one that is becoming my preferred solution to this problem.

## Solution (well, my solution)

Over the years I've used Postman, SoupUI, Insomnia, plus many different VSCode extensions to test api's but the one tool that is ticking most boxes for me at the moment is [httpBook](https://marketplace.visualstudio.com/items?itemName=anweber.httpbook). httpBook is a VSCode extension built on [httpYac](https://httpyac.github.io/) and provides a [Notebook](https://code.visualstudio.com/api/extension-guides/notebook) interface for us to create, execute, test and document code snippets.

So, lets get started!

### First you'll need to install the VSCode extension

You'll find the extension [here](https://marketplace.visualstudio.com/items?itemName=anweber.httpbook) or by searching for "httpBook" in the VSCode Extension Marketplace (in VSCode or on the web).

### A basic api call

Let's start with something basic to prove the extension works...

Create a new `.http` file in VSCode and enter the below GET request in a new Code cell.

```http
GET https://httpbin.org/get
```

Execute the request by pressing the Play button adjacent to the Code cell or at the top of the file tab. You should be presented with a response from the api that will look something similar to:

```
GET https://httpbin.org/get
user-agent: httpyac
accept: */*
accept-encoding: gzip, deflate, br

HTTP/1.1 200 OK
date: Tue, 11 Jan 2022 20:54:23 GMT
content-type: application/json
content-length: 297
connection: close
server: gunicorn/19.9.0
access-control-allow-origin: *
access-control-allow-credentials: true

{
  "args": {},
  "headers": {
    "Accept": "*/*",
    "Accept-Encoding": "gzip, deflate, br",
    "Host": "httpbin.org",
    "User-Agent": "httpyac",
    "X-Amzn-Trace-Id": "Root=1-61ddee7f-279ada9f0f046f7d18cb5665"
  },
  "origin": "xxx.xxx.xxx.xxx",
  "url": "https://httpbin.org/get"
}
```

### Adding documentation

You may have already noticed that apart from adding Code cells to your notebook you can add Markdown cells. in my opinion Markdown is by far the best tool for documenting as a developer. In fact I'd happily do all my writing in Markdown.

I'll let you play with that. Let get back to some api requests!

### CRM WebApi

#### Authentication
