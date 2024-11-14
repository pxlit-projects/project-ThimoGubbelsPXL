# Architecture

:heavy_check_mark:_

![Architecture drawio](https://github.com/pxlit-projects/project-ThimoGubbelsPXL/blob/main/architecture/Architecture.drawio.png)

The Post,Comment and Review services will communicate using Open-Feign SYNC communication to retreive the linked Reviews and Comments of a post when a get request for a post is done.
So when a get post request is done, the id of the linked review or comment is used to send a related get request, to get the relevant object and after getting a response, the post with related reviews and or comments is sent back to the API gateway.

When a new comment or review is added to an existing post, a rabbitMQ message is sent to the queue that is being listened to by the PostService, upon receiving the message the id of the created post or review is added to the relevant post in the database.




Original image source:
[Source](https://docs.microsoft.com/en-us/dotnet/architecture/cloud-native/introduce-eshoponcontainers-reference-app)
