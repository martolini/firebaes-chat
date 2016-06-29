# firebase-chat
Sample repo for a chat built with react, redux and firebase

## firebase-structure

- users/
  - displayName

- friends/
  - userId
    - friendUserId
      - id
      - displayName
      - pending
      - chatroom

- friend-requests/
  - toId/
    - fromId/
      - id
      - displayName
      - timestamp
      - chatroom

- friend-messages/
  - chatroom/
    - messageId
      - author
        - id
        - name
      - createdAt
      - text
