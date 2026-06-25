# BreakPing Rest Bank Sync API Draft

This is the first cloud-sync contract for the desktop app and website.

## Goals

- Sync state-level wellness data from the Windows desktop app to the cloud.
- Render Rest Bank, Passbook, Cheques, reports, and billing status on the website.
- Preserve the privacy position: no screenshots, no keystroke content, no app names, no website URLs.

## Auth

```http
Authorization: Bearer <desktop-app-token>
```

A production desktop app should receive this token after the user signs in on the website and pairs the device.

## Sync endpoint

```http
POST /api/v1/sync/segments
Content-Type: application/json
```

### Request

```json
{
  "device_id": "win-device-001",
  "date": "2026-06-25",
  "timezone": "Asia/Taipei",
  "rest_credits": 32,
  "segments": [
    {
      "type": "active_use",
      "start": "2026-06-25T07:18:00+08:00",
      "end": "2026-06-25T08:04:00+08:00"
    },
    {
      "type": "verified_rest",
      "start": "2026-06-25T08:04:00+08:00",
      "end": "2026-06-25T08:12:00+08:00"
    },
    {
      "type": "rest_override",
      "start": "2026-06-25T09:40:00+08:00",
      "end": "2026-06-25T09:52:00+08:00"
    }
  ],
  "events": [
    {
      "type": "reminder",
      "at": "2026-06-25T08:04:00+08:00"
    },
    {
      "type": "cheque_issued",
      "at": "2026-06-25T14:38:00+08:00",
      "cheque_code": "BP-RB-20260625-001"
    }
  ]
}
```

### Response

```json
{
  "ok": true,
  "sync_id": "sync_01J...",
  "rest_balance": 325,
  "cheques_issued": 1,
  "subscription_status": "free"
}
```

## Data model

### users

- id
- email
- display_name
- created_at

### devices

- id
- user_id
- platform
- device_name
- last_sync_at

### segments

- id
- user_id
- device_id
- type: active_use | verified_rest | rest_override
- start_at
- end_at
- duration_minutes

### rest_passbook_entries

- id
- user_id
- date
- rest_credits
- active_use_minutes
- rest_override_minutes

### rest_cheques

- id
- user_id
- code
- issued_at
- credits_required
- status: available | redeemed | expired
- benefit_type: annual_pass | lifetime_discount | pro_trial

### subscriptions

- id
- user_id
- provider: ecpay | newebpay | tappay | paddle | lemon_squeezy | stripe
- plan
- status
- current_period_end

## Payment integration note

For Taiwan-first launch, the practical payment providers are ECPay, NewebPay, or TapPay. The static GitHub Pages demo only includes checkout placeholders and does not process payments.
