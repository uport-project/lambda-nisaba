## Nisaba endpoint (serverless)

https://nrtlidv3of.execute-api.us-west-2.amazonaws.com/develop/v2/phone

## Nisaba workflow

1) Get an activation code
```
curl --data '{"deviceKey": "0x123456", "phoneNumber": "5688425841"}' https://nisaba.uport.me/api/v1/mobile
```

2) Retrieve token via the activation code
```
curl https://nisaba.uport.me/api/v1/jwt/764667
{"status":"success","data":"eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJpc3MiOiJuaXNhYmEudXBvcnQubWUiLCJpYXQiOjE1MDczMTY5NjksImV4cCI6MTUwNzMxNzI2OSwic3ViIjoiMHgxMjM0NTYiLCJhdWQiOlsibmlzYWJhLnVwb3J0Lm1lIiwidW5udS51cG9ydC5tZSIsInNlbnN1aS51cG9ydC5tZSJdLCJwaG9uZU51bWJlciI6IjU2OTkwMTM3NDgzIn0.wO2142r9bOdFt--XEWKmKz_bTaDFVutBeCDc7GpurS97w0sXA6GaHdan8-lJu4h1tNn5_SiQ-8JL5Ayqnnxkxw"}
```


Commands to test it:
```
serverless invoke local -f phone --data '{"token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJjbGFpbSI6eyJAY29udGV4dCI6Imh0dHA6Ly9zY2hlbWEub3JnLyIsIkB0eXBlIjoiQ3JlYXRpdmVXb3JrIiwibmFtZSI6IkJhbGxvb24gRG9nIiwiY3JlYXRvciI6W3siQHR5cGUiOiJQZXJzb24iLCJAaWQiOiJ0aGVyZWFsamVmZmtvb25zLmlkIiwibmFtZSI6IkplZmYgS29vbnMifV0sImRhdGVDcmVhdGVkIjoiMTk5NC0wNS0wOVQwMDowMDowMC0wNDAwIiwiZGF0ZVB1Ymxpc2hlZCI6IjIwMTUtMTItMTBUMTQ6NDQ6MjYtMDUwMCJ9LCJzdWJqZWN0Ijp7InB1YmxpY0tleSI6IjAzYTU5ZGJmZDk2MTJlNDA4ODgxOGM5MGUxOWFmY2Y4ZDE3OTNiMzhhNWMwNDBjMzhkN2QwN2JiN2QzOWQ4NmQ3MiJ9LCJpc3N1ZWRBdCI6IjIwMTYtMDMtMTBUMTc6MDE6MzIuODc5WiIsImV4cGlyZXNBdCI6IjIwMTctMDMtMTBUMTc6MDE6MzIuODc5WiJ9.vEUJzl713FApgDNYzbUue5SDOdeElxEaAnMbmT-A6ihfrnzhOd5WvzlGJwTiz1LbeTruhQgbh_XyCJ6aLxfu6A"}'
```
