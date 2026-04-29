# Data Model

## Overview

This project uses PostgreSQL with Prisma ORM.

## Core Entities

## User

- `id` (string)
- `email` (unique)
- `password` (hashed)
- `firstName`
- `lastName`
- `role` (`ADMIN | MANAGER | SALES_REP`)
- `isActive`
- timestamps

## Contact

- `id`
- `firstName`
- `lastName`
- `company`
- `email`
- `phone`
- `address`
- `notes`
- `tags[]`
- `createdById` (User)
- `assignedToId` (User, optional)

## Opportunity

- `id`
- `title`
- `description`
- `value` (decimal)
- `currency`
- `stage` (`PROSPECT | QUALIFIED | PROPOSAL | NEGOTIATION | CLOSED_WON | CLOSED_LOST`)
- `probability`
- `closeDate`
- `contactId` (Contact)
- `createdById` (User)
- `assignedToId` (User, optional)

## OpportunityHistory

- `id`
- `opportunityId`
- `previousStage`
- `newStage`
- `changedById`
- `changeReason`
- `changedAt`
