
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

## OrganizationMember API:  
1. Get all OrganizationMember(s) of an organization (by organization id- <:pk> ):
* Usage:  
```bash
GET /api/organizations/<:pk>/members
```
For example:
```bash
GET /api/organizations/1/members
```  
Sample output:
```bash
[{"id":1,"created_at":"2021-05-11T08:03:50.005867Z","updated_at":"2021-05-11T08:03:50.005890Z","user":1,"organization":1},{"id":2,"created_at":"2021-05-11T11:37:19.590564Z","updated_at":"2021-05-11T11:37:19.590581Z","user":2,"organization":1},{"id":3,"created_at":"2021-05-11T13:48:35.415258Z","updated_at":"2021-05-11T13:48:35.415273Z","user":3,"organization":1},{"id":6,"created_at":"2021-05-17T09:51:46.584233Z","updated_at":"2021-05-17T09:51:46.584250Z","user":4,"organization":1},{"id":8,"created_at":"2021-05-17T10:00:54.038384Z","updated_at":"2021-05-17T10:00:54.038402Z","user":5,"organization":1}]
```  
2. Create a new OrganizationMember of an organization:
* Usage: 
- <:pk> is the ID of the organization
```bash
POST /api/organizations/<:pk>/members
```
With body:  
```javascript
{user_pk: <ID of the user about to added to organization>}
```  
Sample output:
```bash
{"id":9,"created_at":"2021-05-17T10:00:54.038384Z","updated_at":"2021-05-17T10:00:54.038402Z","user":7,"organization":1}
```  
So far, only user in organization can add new member for that organization.