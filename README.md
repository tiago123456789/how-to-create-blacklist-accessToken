About the project:
==================

This is poc(PROOF OF CONCEPT) use to explain about how to blacklist the accessToken in your api.


Technologies used:
==================

- Node.js
- Javascript
- Redis(used how the blacklist) I'm selected Redis to blacklist because is fast to check if accessToken is blacklist and I can be using TTL to remove accessToken the redis when expiration time the accessToken is end.