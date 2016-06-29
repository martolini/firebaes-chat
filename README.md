# firebase-chat
Sample repo for a chat built with react, redux and firebase

## firebase-structure
- users/
  - displayName
- chatroom-metadata
  - chatroom-id
    - createdAt
    - createdBy
    - id
    - name
- chatroom-members/
  - chatroom-id
    - userId: displayName
- user-chatrooms/
  - userId
    - chatroom-id: true
- chatroom-messages/
  - chatroom-id
- chatroom-invites/
  - toUserId/
    - chatroom1: true
    - chatroom2: true


# firebase-friends-chat

## firebase-structure

- users/
  - displayName

- friends/
  - userId
    - friendUserId
      - id
      - displayName
      - pending

- friend-requests/
  - toId/
    - fromId/
      - id
      - displayName
      - timestamp
