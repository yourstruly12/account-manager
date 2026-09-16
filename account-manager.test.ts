import {
    accounts,
    processTransaction,
     getAccount
} from "./account-manager";

// Reset the accounts before each test.
function resetAccounts(): void {

    accounts.Alice.balance = 1000;
    accounts.Alice.transactions = [];

    accounts.Bob.balance = 1000;
    accounts.Bob.transactions = [];
}


// Test 1: Deposit
resetAccounts();

console.log("\nTest 1: Deposit");

let result: string =
    processTransaction("Alice", "DEPOSIT", 500);

console.log(result);

if (result === "APPROVED: Transaction completed") {
    console.log("PASS");
} else {
    console.log("FAIL");
}


// Test 2: Withdrawal
resetAccounts();

console.log("\nTest 2: Withdrawal");

result = processTransaction(
    "Alice",
    "WITHDRAWAL",
    100
);

console.log(result);

if (result === "APPROVED: Transaction completed") {
    console.log("PASS");
} else {
    console.log("FAIL");
}


// Test 3: Transfer
resetAccounts();

console.log("\nTest 3: Transfer");

result = processTransaction(
    "Alice",
    "TRANSFER",
    200,
    "Bob"
);

console.log(result);

if (
    result === "APPROVED: Transaction completed" &&
    accounts.Alice.balance === 800 &&
    accounts.Bob.balance === 1200
) {
    console.log("PASS");
} else {
    console.log("FAIL");
}


// Test 4: Insufficient funds
resetAccounts();

console.log("\nTest 4: Insufficient funds");

result = processTransaction(
    "Alice",
    "WITHDRAWAL",
    5000
);

console.log(result);

if (result === "REJECTED: Insufficient funds") {
    console.log("PASS");
} else {
    console.log("FAIL");
}


// Test 5: Invalid account
resetAccounts();

console.log("\nTest 5: Invalid account");

result = processTransaction(
    "Charlie",
    "DEPOSIT",
    100
);

console.log(result);

if (result === "REJECTED: Account does not exist") {
    console.log("PASS");
} else {
    console.log("FAIL");
}


// Test 6: Invalid amount
resetAccounts();

console.log("\nTest 6: Invalid amount");

result = processTransaction(
    "Alice",
    "DEPOSIT",
    -50
);

console.log(result);

if (result === "REJECTED: Invalid transaction amount") {
    console.log("PASS");
} else {
    console.log("FAIL");
}


// Test 7: Transfer to yourself
resetAccounts();

console.log("\nTest 7: Transfer to yourself");

result = processTransaction(
    "Alice",
    "TRANSFER",
    100,
    "Alice"
);

console.log(result);

if (result === "REJECTED: Cannot transfer to the same account") {
    console.log("PASS");
} else {
    console.log("FAIL");
}


// Test 8: Four withdrawals within ten seconds
resetAccounts();

console.log("\nTest 8: Four withdrawals within ten seconds");

// Make three withdrawals first.
processTransaction("Alice", "WITHDRAWAL", 50);
processTransaction("Alice", "WITHDRAWAL", 50);
processTransaction("Alice", "WITHDRAWAL", 50);

result = processTransaction(
    "Alice",
    "WITHDRAWAL",
    50
);

console.log(result);

if (
    result ===
    "BLOCKED: Too many withdrawals within 10 seconds"
) {
    console.log("PASS");
} else {
    console.log("FAIL");
}


// Test 9: Suspicious transaction
resetAccounts();

console.log("\nTest 9: Suspicious transaction");

processTransaction(
    "Alice",
    "WITHDRAWAL",
    100
);

result = processTransaction(
    "Alice",
    "WITHDRAWAL",
    500
);

console.log(result);

if (
    result ===
    "BLOCKED: Transaction amount is suspicious"
) {
    console.log("PASS");
} else {
    console.log("FAIL");
}


// Test 10: Invalid transaction type
resetAccounts();

console.log("\nTest 10: Invalid transaction type");

result = processTransaction(
    "Alice",
    "INVALID" as any,
    100
);

console.log(result);

if (result === "REJECTED: Invalid transaction type") {
    console.log("PASS");
} else {
    console.log("FAIL");
}

// Test 11: Get account
resetAccounts();

console.log("\nTest 11: Get account");

const account = getAccount("Alice");

if (account !== null && account.balance === 1000) {
    console.log("PASS");
} else {
    console.log("FAIL");
}

console.log("\nAll tests completed.");
