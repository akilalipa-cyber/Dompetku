/* =====================================================
   E-MONEY - JAVASCRIPT
===================================================== */


/* ================================
   AMBIL ELEMENT
================================ */

const form = document.getElementById("transactionForm");

const amountInput = document.getElementById("amount");
const dateInput = document.getElementById("date");
const descriptionInput = document.getElementById("description");

const transactionTypeInput =
    document.getElementById("transactionType");

const categoryInput =
    document.getElementById("category");

const reasonInput =
    document.getElementById("reason");

const expenseFields =
    document.getElementById("expenseFields");

const reasonGroup =
    document.getElementById("reasonGroup");

const transactionList =
    document.getElementById("transactionList");

const saldoElement =
    document.getElementById("saldo");

const totalIncomeElement =
    document.getElementById("totalIncome");

const totalExpenseElement =
    document.getElementById("totalExpense");

const transactionCountElement =
    document.getElementById("transactionCount");

const expenseRatioElement =
    document.getElementById("expenseRatio");

const financialStatus =
    document.getElementById("financialStatus");

const statusIcon =
    document.getElementById("statusIcon");

const statusDescription =
    document.getElementById("statusDescription");

const progressBar =
    document.getElementById("progressBar");

const analysisContent =
    document.getElementById("analysisContent");

const clearTransactions =
    document.getElementById("clearTransactions");

const themeToggle =
    document.getElementById("themeToggle");


/* ================================
   DATABASE
================================ */

let transactions = [];

try {

    const saved =
        localStorage.getItem(
            "emoney_transactions"
        );

    if (saved) {

        transactions =
            JSON.parse(saved);

    }

} catch (error) {

    console.error(
        "Gagal membaca data:",
        error
    );

    transactions = [];

}


/* ================================
   TANGGAL DEFAULT
================================ */

if (
