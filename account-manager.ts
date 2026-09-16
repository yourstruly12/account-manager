// Account Manager - Transaction Processing System

// These are the transaction types allowed.
type TransactionType = "DEPOSIT" | "WITHDRAWAL" | "TRANSFER";

// This stores information about a transaction.
interface Transaction {
    account: string;
    type: TransactionType;
    amount: number;
    time: number;
}

// This describes an account.
interface Account {
    balance: number;
    transactions: Transaction[];
}

// Create the accounts.
const accounts: Record<string, Account> = {
    Alice: {
        balance: 1000,
        transactions: []
    },

    Bob: {
        balance: 1000,
        transactions: []
    }
};

// Process a transaction.
function processTransaction(
    accountName: string,
    transactionType: TransactionType,
    amount: number,
    recipientName: string | null = null
): string {

    // Check if the account exists.
    if (!accounts[accountName]) {
        return "REJECTED: Account does not exist";
    }

    // Check that the amount is valid.
    if (amount <= 0 || isNaN(amount)) {
        return "REJECTED: Invalid transaction amount";
    }

    const account: Account = accounts[accountName];

    // Check the recipient when making a transfer.
    if (transactionType === "TRANSFER") {

        if (!recipientName || !accounts[recipientName]) {
            return "REJECTED: Recipient account does not exist";
        }

        // Prevent transferring money to the same account.
        if (accountName === recipientName) {
            return "REJECTED: Cannot transfer to the same account";
        }
    }

    // Check for too many withdrawals.
    if (transactionType === "WITHDRAWAL") {

        const currentTime: number = Date.now();

        const recentWithdrawals: Transaction[] =
            account.transactions.filter(
                (transaction: Transaction) =>
                    transaction.type === "WITHDRAWAL" &&
                    currentTime - transaction.time <= 10000
            );

        // Block the fourth withdrawal within ten seconds.
        if (recentWithdrawals.length >= 3) {
            return "BLOCKED: Too many withdrawals within 10 seconds";
        }
    }

    // Check if the account has enough money.
    if (
        transactionType === "WITHDRAWAL" ||
        transactionType === "TRANSFER"
    ) {

        if (amount > account.balance) {
            return "REJECTED: Insufficient funds";
        }
    }

    // Calculate the average transaction amount.
    let totalAmount: number = 0;
    let transactionCount: number = 0;

    for (const transaction of account.transactions) {
        totalAmount += transaction.amount;
        transactionCount++;
    }

    let averageTransactionAmount: number = 0;

    if (transactionCount > 0) {
        averageTransactionAmount =
            totalAmount / transactionCount;
    }

    // Block transactions that are five times the average.
    if (averageTransactionAmount > 0) {

        const suspiciousThreshold: number =
            averageTransactionAmount * 5;

        if (amount >= suspiciousThreshold) {
            return "BLOCKED: Transaction amount is suspicious";
        }
    }

    // Update the account after all checks pass.
    if (transactionType === "DEPOSIT") {

        account.balance += amount;

    } else if (transactionType === "WITHDRAWAL") {

        account.balance -= amount;

    } else if (transactionType === "TRANSFER") {

        account.balance -= amount;

        if (recipientName) {
            accounts[recipientName].balance += amount;
        }
    }

    // Save the successful transaction.
    const transaction: Transaction = {
        account: accountName,
        type: transactionType,
        amount: amount,
        time: Date.now()
    };

    account.transactions.push(transaction);

    return "APPROVED: Transaction completed";
}

// Display the account balance.
function displayAccount(accountName: string): void {

    if (!accounts[accountName]) {
        console.log("Account does not exist");
        return;
    }

    console.log(
        `${accountName} balance: R${accounts[accountName].balance}`
    );
}

// Export these so the test file can use them.
export {
    accounts,
    processTransaction,
    displayAccount
};