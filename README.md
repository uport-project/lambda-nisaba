# lambda-nisaba
Lambda functions for verifying phone numbers

![Nisaba](https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/VAM_Nisaba_Lagasch.jpg/220px-VAM_Nisaba_Lagasch.jpg "Nisaba")

[Diagrams](./diagrams/README.md)

# Description
Nisaba provides user verification for the uPort ecosystem.

# API

## Request Fuel Token for New Device Key

A verified user can request a new fuel token for a new deviceKey.

### Endpoint

`POST /newDeviceKey`

### Headers
```
Authorization: Bearer <nisaba token/fuel token>
```
### Body
```
{
  requestToken: <jwt signed by deviceKey>
}
```
The payload of the requestToken should be:
```
{
  newDeviceKey: <address of the new device key>
}
```

### Response

| Status |     Message    |                               |
|:------:|----------------|-------------------------------|
| 200    | Ok             | Fuel Token                    |
| 403    | Forbidden      | JWT token missing or invalid  |
| 500    | Internal Error | Internal error                |

Token stored in `code` is deleted after JWT expiration date

```
{
  'status':  'success',
  'data': <fuel token for new deviceKey>
}
```

### Sequence Diagram

![newDeviceKey Seq](./diagrams/img/newDeviceKey.seq.png)

## Request phone verification

### Start Verification

Starts a verification for a `deviceKey` and a `phoneNumber`. Sends a code thru SMS or Call

### Endpoint

`POST /verify`

### Body

```
{
  deviceKey: <device key>,
  phoneNumber: <phone number>
}
```

### Response

| Status |     Message    |                                            |
|:------:|----------------|--------------------------------------------|
| 200    | Ok.            | Verificaition started                      |
| 400    | Bad request    | Bad or missing parameter                   |
| 500    | Internal Error | Internal Error                             |

## Continue verification

Process continues by passing the `deviceKey` to the verification service.

### Endpoint

`GET /next/{device_key}`


### Response

| Status |     Message    |                                            |
|:------:|----------------|--------------------------------------------|
| 200    | Ok.            | Verificaition started                      |
| 400    | Bad request    | Bad or missing parameter                   |
| 500    | Internal Error | Internal Error                             |



##  Verify and Request Token

With the code (which was sent thru SMS) the app can verify it and request the pseudo-attestation token

### Endpoint

`POST /check`

### Body

```
{
  deviceKey: <device key>,
  code: <code>
}
```

### Response

| Status |     Message    |                                       |
|:------:|----------------|---------------------------------------|
| 201    | Ok             | JWT token                             |
| 404    | Not found      | Bad `code`                            |
| 500    | Internal Error | Internal Error                        |


```
{
  'status':  'success',
  'data': <jwt>
}
```
This is not a proper uPort Attestation because the `sub` is not a `uportId` is just the `deviceKey`

### Token payload

```
{
  iss: "api.uport.me/nisaba",
  exp: <token expiration date>,
  iat: <token issued date>,
  sub: <device key>,
  aud: [
    "api.uport.me/nisaba",
    "api.uport.me/unnu",
    "api.uport.me/sensui"
  ],
  phoneNumber: <phone number>
}
```
