
## Organization API:  
1. Get all organizations that the current user is in:  
* Usage:
```bash
GET /api/organizations
```  
* Sample output:
```bash
[{"id":1,"title":"Dataset"}]
``` 
2. Create a new organization, also the current user will be admin and member of the new organization:
* Usage: 
```bash
POST /api/organizations
```  
body of the POST request must include title of the new organization:
```javascript
{title: 'TEST ORG 001'}
```
* Sample output:  
```bash
{id: 27, title: "TEST ORG 001"}
``` 

