Account Manager — Transaction Processing Algorithm

 Algorithm: Transaction Decision Engine

 Purpose

Process deposits, withdrawals, and transfers while checking the transaction against the account balance and suspicious-activity rules before changing any account balance.

Steps

1. Start.

2. Receive the transaction request, including:

     User account
     Transaction type
     Transaction amount
     Recipient account, if the transaction is a transfer

3. Validate the transaction request.

4. Check that the required account exists.

5. Check that the transaction amount is valid.

6. If the transaction is a withdrawal:

     Check the number of withdrawals made by the user within the last 10 seconds.
     If the user has made more than 3 withdrawals within that period, reject and block the transaction.

7. If the transaction is a withdrawal or transfer:

    Check the user's available balance.
    If the requested amount is greater than the available balance, reject the transaction.

8. Calculate the user's average transaction amount using their previous transaction history.

9. Compare the requested transaction amount with the user's average transaction amount.

10. If the transaction amount reaches the defined suspicious-spending threshold, flag the transaction as suspicious and reject and block it.

11. If all required checks pass, approve the transaction.

12. Execute the approved transaction:

  Deposit: Add the amount to the user's balance.
  Withdrawal: Subtract the amount from the user's balance.
  Transfer: Subtract the amount from the sender's balance and add the amount to the recipient's balance.

13. Record the successful transaction so that it becomes part of the user's future transaction history.

14. End.


13. Record the successful transaction.
14. End.
