---
title: Create user accounts for Dataset
type: guide
order: 103
meta_title: User Access
meta_description: Dataset Documentation for signing up, inviting users, and managing access to your data labeling, machine learning, and data science projects.
---

Sign up and create an account for Dataset to start labeling data and setting up projects. 

Everyone with an account in Dataset has access to the same functionality. 

## Create an account

When you first [start Dataset](start.html), you see the sign up screen. 

1. Create an account with your email address and a password. 
2. Log in to Dataset.

Accounts that you create are stored locally on the Dataset server, and allow multiple annotators to collaborate on a specific data labeling project.

If you want, you can create an account from the command line when you start Dataset.
```bash
label-studio start --username <username> --password <password>
```

To restrict who has access to your Dataset instance, you can invite collaborators directly. 

## Invite collaborators to a project

After you [set up a labeling project](setup.html), invite annotators to the project to start collaborating on labeling tasks. 

1. In the Dataset UI, click the hamburger icon and click **People**.
2. Click **+ Add People**.
3. Copy the invitation link and share it with those that you want to invite to Dataset. If you need to update the link and deactivate the old one, return to this page and click **Reset Link**. 

If you want to deactivate the signup page and use only the invitation link, set the following environment variable when you start Dataset:
```
LABEL_STUDIO_DISABLE_SIGNUP_WITHOUT_LINK=true
```

## Manage your account in Dataset
After you create an account in Dataset, you can make changes to it as needed.

1. From the Dataset UI, click the user icon in the upper right.
2. Click **Account & Settings**.
3. Update your display name and add a profile picture no larger than 512 x 512 pixels. 
4. Click **Save**. 

## Review existing accounts in Dataset
You can review the existing accounts in Dataset to see which people created which projects, and to which projects they contributed annotations. 

1. From the Dataset UI, click the hamburger icon and click **People**.
2. Review the list of users by email address and name. You can see the last time a user was active in Dataset.
3. Click a row to see additional detail about a specific user, including the projects that they created or contributed annotations to.

### Reset password
If you forget your password or change passwords regularly for security reasons, you can change it from the command line.

1. On the server running Dataset, run the following command: 
```bash
label-studio reset_password
```
2. When prompted, type the username and the new password. You see `Password successfully changed`.

You can also use optional command line arguments to reset the password for a username.

- Specify the username and type the password when prompted: 
```bash
label-studio reset_password --username <username>
New password:
```
- Specify both the username and the password:
```bash
label-studio reset_password --username <username> --password <password>
```


