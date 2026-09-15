// Account Manager - Transaction Processing System

const accounts = {
    Alice: {
        balance: 1000,
        transactions: []
    },

    Bob: {
        balance: 1000,
        transactions: []
    }
};


// This function handles all transactions in the system.
function processTransaction(
    accountName,
    transactionType,
    amount,
    recipientName = null
) {

    // First, check if the account exists.
    if (!accounts[accountName]) {
        return "REJECTED: Account does not exist";
    }

    // The amount must be greater than zero.
    if (amount <= 0 || isNaN(amount)) {
        return "REJECTED: Invalid transaction amount";
    }

    const account = accounts[accountName];

    // A transfer needs a valid recipient.
    if (transactionType === "TRANSFER") {

        if (!recipientName || !accounts[recipientName]) {
            return "REJECTED: Recipient account does not exist";
        }

        // An account cannot transfer money to itself.
        if (accountName === recipientName) {
            return "REJECTED: Cannot transfer to the same account";
        }
    }

    // Check how many withdrawals happened recently.
    if (transactionType === "WITHDRAWAL") {

        const currentTime = Date.now();

        const recentWithdrawals = account.transactions.filter(
            transaction =>
                transaction.type === "WITHDRAWAL" &&
                currentTime - transaction.time <= 10000
        );

        // The fourth withdrawal within ten seconds is blocked.
        if (recentWithdrawals.length >= 3) {
            return "BLOCKED: Too many withdrawals within 10 seconds";
        }
    }

    // Withdrawals and transfers cannot use more money than the account has.
    if (
        transactionType === "WITHDRAWAL" ||
        transactionType === "TRANSFER"
    ) {

        if (amount > account.balance) {
            return "REJECTED: Insufficient funds";
        }
    }

    // Work out the user's average transaction amount.
    let totalAmount = 0;
    let transactionCount = 0;

    for (const transaction of account.transactions) {
        totalAmount += transaction.amount;
        transactionCount++;
    }

    let averageTransactionAmount = 0;

    if (transactionCount > 0) {
        averageTransactionAmount =
            totalAmount / transactionCount;
    }

    // A transaction that is five times the normal average is suspicious.
    if (averageTransactionAmount > 0) {

        const suspiciousThreshold =
            averageTransactionAmount * 5;

        if (amount >= suspiciousThreshold) {
            return "BLOCKED: Transaction amount is suspicious";
        }
    }

    // Perform the transaction after all checks pass.
    if (transactionType === "DEPOSIT") {

        account.balance += amount;

    } else if (transactionType === "WITHDRAWAL") {

        account.balance -= amount;

    } else if (transactionType === "TRANSFER") {

        account.balance -= amount;
        accounts[recipientName].balance += amount;

    } else {

        return "REJECTED: Invalid transaction type";
    }

    // Save the successful transaction.
    const transaction = {
        account: accountName,
        type: transactionType,
        amount: amount,
        time: Date.now()
    };

    account.transactions.push(transaction);

    return "APPROVED: Transaction completed";
}


// This function shows the current balance.
function displayAccount(accountName) {

    if (!accounts[accountName]) {
        console.log("Account does not exist");
        return;
    }

    console.log(
        `${accountName} balance: R${accounts[accountName].balance}`
    );
}


// Export the functions and accounts so they can be tested.
module.exports = {
    accounts,
    processTransaction,
    displayAccount
};