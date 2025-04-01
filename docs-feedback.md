# Endaoment DaF integration docs feedback

The docs were detailed and quite explanatory with regards of how we should be handling api's on frontend as well as backend. Although handler functions were referenced in docs it would also be better to detail the api request and response structures because its not necessary that client will be using js for integration (they might use python). Some additional feedbacks -

1. Login flow -

- There should be examples of how response body looks like incase of errors so we can handle them
- It would be great to automate the process of whitelisting of client side redirect URLs after auth

2. Daf Creation flow -

- Need to know what fields are required for creating new DAF, how body should look like, what fields are required, what all are optional, rather than simply displaying input react form JSX
- Should mention in the docs that country should be valid ISO31661 Alpha3 code

3. Donation + Grant flow

- It would be great to have some sandbox for testing out wire transfer and granting the DAF to Orgs without actually performing wire transfer
