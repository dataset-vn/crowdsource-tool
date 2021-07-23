Update active organization of a user:

```bash
PATH /api/current-user/active-organization
```
With body { active_organization: [ID of the new active organization] }  
For example:
```javascript
{ active_organization: 19 }
```  

Sample output:
```bash
{id: 2, first_name: "Chồnnnnn", last_name: "Nguyễn", username: "chon", email: "chon@dataset.vn", …}
```

Cant switch to an organization of which current user is not a member. The response will contain old active organization id.