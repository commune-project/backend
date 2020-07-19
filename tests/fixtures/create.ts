import { USERS } from './user'

export const createExampleCorrect = {
    "@context": "https://www.w3.org/ns/activitystreams",
    "type": "Create",
    "id": `${USERS.misaka4e21.id}/87375`,
    "actor": USERS.misaka4e21.id,
    "object": {
      "id": `${USERS.misaka4e21.id}/note/73`,
      "type": "Note",
      "attributedTo": USERS.misaka4e21.id,
      "content": "This is a note",
      "published": "2015-02-10T15:04:55Z",
      "to": ["https://example.org/~john/"],
      "cc": ["https://example.com/~erik/followers",
             "https://www.w3.org/ns/activitystreams#Public"]
    },
    "published": "2015-02-10T15:04:55Z",
    "to": ["https://example.org/~john/"],
    "cc": ["https://example.com/~erik/followers",
           "https://www.w3.org/ns/activitystreams#Public"]
}