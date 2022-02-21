# **User Registration, Validation And Authentication System**  
A system registing fidia user, validate their email and authenticate users at login.

## **Features**

- Register User  
- Validate User OTP.  
- Regenerate User OTP.  
- Login User.  
- Get all user details. 

### **Authorization Feature**  
- User can create account.  
- A user can login.  
- A user can validate email.  
- A user can regenerate otp for validation.  


## **Endpoints**

> Base URL: `https://fidia-user-app.herokuapp.com/api/v1`  

### **Notes**  
```
 Stars on Endpoints  
       -- Can be accessed by guest.                 > No star
 *     -- Can be accessed by authenticated user.    > 1 star

 Sending JWT - Can be sent through Request Header, Body or Query
    authorization: JWT
``` 

### + POST `/users/login`  
This logs a user into the platform and return a `JWT` that can be used to access the platform.     
```
Request:  
{  
    "email": "oluwasegunayobami7@gmail.com",
    "password": "123456"
}  
```

A response object with the user details and a `JWT` as `token` is returned.
```
Response:  
{
    "status": 200,
    "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "user": {
            "_id": "62135ddb7c6f77a6637f9a95",
            "firstname": "segun",
            "lastname": "ayo",
            "email": "oluwasegunayobami7@gmail.com",
            "isValidatedUser": true,
            "createdAt": "2022-02-21T09:39:39.624Z",
            "updatedAt": "2022-02-21T09:40:11.541Z",
            "__v": 0
        }
    }
}
```

### + POST `/users/signup ***`  
This allows all aspiring users to register to the platform.
```
Request:  
{
    "firstname": "segun", 
    "lastname": "ayo", 
    "email": "oluwasegunayobami7@gmail.com", 
    "password": "123456"
}
```

A response object with a successful message is returned.
```
Response:  
{
    "status": 201,
    "data": {
        "message": "The user account has been created successfully and user notified."
    }
}
```

### + POST `/users/validateOTP`  
This requests for otp to be used for validation.
Passing query string `otp={otp}` 
```
```

A response object with a successful message and specified email is returned.
```
{
    "status": 200,
    "data": "Successfully validated Email"
}
```

### + POST `/users/regenerateOTP`  
This requests for regeneration of otp.
Passing query string `email={email}` 
```
```

A response object with a successful message and specified email is returned.
```
{
    "status": 200,
    "data": "Successfully generated Email"
}
```

### + GET `/users/ *`

This returns terminal statistics  
```
Response:  
{
    "status": 200,
    "data": [
        {
            "_id": "6212480573c32df011b47c02",
            "firstname": "segun",
            "lastname": "ayo",
            "email": "oluwasegunayobami7@gmail.com",
            "isValidatedUser": true,
            "createdAt": "2022-02-20T13:54:13.488Z",
            "updatedAt": "2022-02-20T14:00:37.641Z",
            "__v": 0
        }
    ]
}
```
