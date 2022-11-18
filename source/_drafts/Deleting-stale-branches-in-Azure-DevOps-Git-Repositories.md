---
title: Deleting stale branches in Azure DevOps Git Repositories with Power Automate and Approvals
tags:
  - Azure
  - DevOps
  - Stale
  - Branches
  - Power Automate
  - Flow
categories:
  - Azure
  - DevOps
description: Deleting stale branches in Azure DevOps Git Repositories with Power Automate and Approvals
excerpt: Deleting stale branches in Azure DevOps Git Repositories with Power Automate and Approvals
---

# Stale Branch... Huh?

Azure DevOps, GitHub, etc. refer a branch as "stale" when it has no new commits within a certain number of days. I believe Azure uses 90 days as it's reference. Pretty simple really!

# Why delete your stale branches?

Again, it's pretty simple really. Having multiple branches of the same code base at different states or moments in time will cause confusion (and potentially problems!). If a branch has been released it should be merged to the master branch, if it's unreleased it "could" be discarded. If you want the ability to restore the branch at any point you can simply tag it's most recent commit! Git's garbage collector prunes "unreachable" commits (essentially those not part of a branch or tags "tree").

# My Solution

So, I wanted to automate the process of deleting stale branches and make it a team activity. To achieve this I wanted the following key points in the process:

- To check all repositories within the project
- To ignore the `master` branch
- An approval process

As with most challenges I opened up google and had a look what I could see... mmmm plenty of options... but being a dev at heart and wanting to know how it works, so I set about crafting my own solution.

I started to look at what I could do with Azure Pipelines and the Azure CLI, but decided against that as I felt the approval process would be a little clunky. Next port of call was Power Automate, and this is where I stayed.

Fortunately Power Automate has a [connector](https://learn.microsoft.com/en-us/connectors/visualstudioteamservices/) that provides an [action](https://learn.microsoft.com/en-us/connectors/visualstudioteamservices/#list-git-repositories) to list all repositories within an Azure DevOps project, unfortunately that is where the specific actions stop and you have to use the [HTTP request](https://learn.microsoft.com/en-us/connectors/visualstudioteamservices/#send-an-http-request-to-azure-devops) action to query the api from then on to get the branch information.
