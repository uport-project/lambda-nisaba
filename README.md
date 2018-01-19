# lambda-nisaba
Lambda functions for verifying phone numbers

![Nisaba](https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/VAM_Nisaba_Lagasch.jpg/220px-VAM_Nisaba_Lagasch.jpg "Nisaba")

[Diagrams](./diagrams/README.md)

## Description
Nisaba provides user verification for the uPort ecosystem.

## API

### Request Fuel Token for New Device Key

A verified user can request a new fuel token for a new deviceKey 

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

#### Response

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