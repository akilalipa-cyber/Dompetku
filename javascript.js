/* =========================================
   E-MONEY
   Personal Finance Dashboard
========================================= */

const form = document.getElementById("transactionForm");

const amountInput = document.getElementById("amount");
const dateInput = document.getElementById("date");
const descriptionInput = document.getElementById("description");

const categoryInput = document.getElementById("category");
const reasonInput = document.getElementById("reason");

const transactionTypeInput =
    document.getElementById("transactionType");

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

const statusDescription =
    document.getElementById("statusDescription");

const statusIcon =
    document.getElementById("statusIcon");

const progressBar =
    document.getElementById("progressBar");

const analysisContent =
    document.getElementById("analysisContent");

const clearTransactions =
    document.getElementById("clearTransactions");

const themeToggle =
    document.getElementById("themeToggle");


/* =========================================
   DATA
========================================= */

let transactions =
    JSON.parse(
        localStorage.getItem("emoney_transactions")
    ) || [];


/* =========================================
   DATE DEFAULT
========================================= */

dateInput.value =
    new Date().toISOString().split("T")[0];


/* =========================================
   FORMAT RUPIAH
========================================= */

function formatRupiah(number) {

    return new Intl.NumberFormat(
        "id-ID",
        {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0
        }
    ).format(number);

}


/* =========================================
   FORMAT DATE
========================================= */

function formatDate(date) {

    return new Date(date).toLocaleDateString(
        "id-ID",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


/* =========================================
   TRANSACTION TYPE
========================================= */

document.querySelectorAll(".type-btn")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(".type-btn")
                    .forEach(btn =>
                        btn.classList.remove("active")
                    );

                button.classList.add("active");

                const type =
                    button.dataset.type;

                transactionTypeInput.value = type;

                if (type === "expense") {

                    expenseFields
                        .classList
                        .remove("hidden");

                } else {

                    expenseFields
                        .classList
                        .add("hidden");

                }

            }
        );

    });


/* =========================================
   CATEGORY
========================================= */

categoryInput.addEventListener(
    "change",
    () => {

        if (categoryInput.value === "Lainnya") {

            reasonGroup
                .classList
                .remove("hidden");

            reasonInput.required = true;

        } else {

            reasonGroup
                .classList
                .add("hidden");

            reasonInput.required = false;

            reasonInput.value = "";

        }

    }
);


/* =========================================
   SUBMIT
========================================= */

form.addEventListener(
    "submit",
    event => {

        event.preventDefault();

        const amount =
            Number(amountInput.value);

        if (!amount || amount <= 0) {

            alert("Masukkan nominal yang valid.");

            return;

        }


        const type =
            transactionTypeInput.value;


        let category = "";
        let reason = "";


        if (type === "expense") {

            category =
                categoryInput.value;

            if (category === "Lainnya") {

                reason =
                    reasonInput.value.trim();

                if (!reason) {

                    alert(
                        "Masukkan alasan pembelian."
                    );

                    return;

                }

            }

        }


        const transaction = {

            id:
                Date.now(),

            type:

                type,

            amount:

                amount,

            date:

                dateInput.value,

            category:

                category,

            reason:

                reason,

            description:

                descriptionInput
                    .value
                    .trim()

        };


        transactions.unshift(transaction);

        saveData();

        form.reset();

        dateInput.value =
            new Date()
                .toISOString()
                .split("T")[0];


        transactionTypeInput.value =
            "income";

        document
            .querySelectorAll(".type-btn")
            .forEach(btn =>
                btn.classList.remove("active")
            );

        document
            .querySelector(
                '[data-type="income"]'
            )
            .classList.add("active");

        expenseFields
            .classList
            .add("hidden");

        reasonGroup
            .classList
            .add("hidden");

        render();

    }
);


/* =========================================
   SAVE
========================================= */

function saveData() {

    localStorage.setItem(
        "emoney_transactions",
        JSON.stringify(transactions)
    );

}


/* =========================================
   CALCULATE
========================================= */

function calculate() {

    let income = 0;
    let expense = 0;

    transactions.forEach(transaction => {

        if (transaction.type === "income") {

            income += transaction.amount;

        } else {

            expense += transaction.amount;

        }

    });


    const balance =
        income - expense;


    const ratio =
        income > 0
            ? (expense / income) * 100
            : 0;


    return {
        income,
        expense,
        balance,
        ratio
    };

}


/* =========================================
   FINANCIAL STATUS
========================================= */

function updateFinancialStatus() {

    const {
        income,
        expense,
        ratio
    } = calculate();


    if (income === 0) {

        financialStatus.textContent =
            "Belum Ada Data";

        statusIcon.textContent = "—";

        statusDescription.textContent =
            "Tambahkan pemasukan dan pengeluaran untuk mendapatkan analisis.";

        progressBar.style.width = "0%";

        progressBar.style.background =
            "#94a3b8";

        return;

    }


    let status;
    let description;
    let icon;


    /*
       LOGIKA:

       0 - 30%
       = Cerdas

       >30 - 50%
       = Hemat

       >50 - 75%
       = Normal

       >75%
       = Boros
    */


    if (ratio <= 30) {

        status = "Cerdas";
        icon = "★";

        description =
            "Pengeluaran sangat terkendali. Kamu mampu menjaga sebagian besar pemasukan.";

    }

    else if (ratio <= 50) {

        status = "Hemat";
        icon = "✓";

        description =
            "Keuangan cukup sehat. Pengeluaran masih berada pada tingkat yang hemat.";

    }

    else if (ratio <= 75) {

        status = "Normal";
        icon = "●";

        description =
            "Pengeluaran masih dalam batas normal, tetapi tetap perhatikan kebutuhan non-prioritas.";

    }

    else {

        status = "Boros";
        icon = "!";

        description =
            "Pengeluaran cukup tinggi dibanding pemasukan. Pertimbangkan mengurangi pembelian yang tidak terlalu penting.";

    }


    financialStatus.textContent =
        status;

    statusIcon.textContent =
        icon;

    statusDescription.textContent =
        description;


    progressBar.style.width =
        Math.min(ratio, 100) + "%";


    if (status === "Cerdas") {

        progressBar.style.background =
            "#16a34a";

        statusIcon.style.background =
            "#dcfce7";

    }

    else if (status === "Hemat") {

        progressBar.style.background =
            "#2563eb";

        statusIcon.style.background =
            "#dbeafe";

    }

    else if (status === "Normal") {

        progressBar.style.background =
            "#f59e0b";

        statusIcon.style.background =
            "#fef3c7";

    }

    else {

        progressBar.style.background =
            "#dc2626";

        statusIcon.style.background =
            "#fee2e2";

    }

}


/* =========================================
   ANALYSIS
========================================= */

function updateAnalysis() {

    const {
        income,
        expense,
        balance,
        ratio
    } = calculate();


    if (transactions.length === 0) {

        analysisContent.innerHTML =
            "<p>Belum ada data yang dapat dianalisis.</p>";

        return;

    }


    const expenseTransactions =
        transactions.filter(
            transaction =>
                transaction.type === "expense"
        );


    const needs =
        expenseTransactions
            .filter(
                transaction =>
                    transaction.category === "Kebutuhan"
            )
            .reduce(
                (sum, transaction) =>
                    sum + transaction.amount,
                0
            );


    const others =
        expenseTransactions
            .filter(
                transaction =>
                    transaction.category === "Lainnya"
            )
            .reduce(
                (sum, transaction) =>
                    sum + transaction.amount,
                0
            );


    let advice = "";


    if (ratio > 75) {

        advice =
            "Pengeluaran sudah tinggi. Prioritaskan kebutuhan utama dan kurangi pembelian yang bisa ditunda.";

    }

    else if (ratio > 50) {

        advice =
            "Pengeluaran masih normal. Tetap sisihkan sebagian pemasukan untuk tabungan.";

    }

    else {

        advice =
            "Pengelolaan keuangan cukup baik. Pertahankan kebiasaan mengontrol pengeluaran.";

    }


    analysisContent.innerHTML = `

        <div class="analysis-item">
            <strong>Rasio:</strong>
            <span>
                ${ratio.toFixed(1)}% pemasukan digunakan.
            </span>
        </div>

        <div class="analysis-item">
            <strong>Kebutuhan:</strong>
            <span>
                ${formatRupiah(needs)}
            </span>
        </div>

        <div class="analysis-item">
            <strong>Lainnya:</strong>
            <span>
                ${formatRupiah(others)}
            </span>
        </div>

        <div class="analysis-item">
            <strong>Sisa:</strong>
            <span>
                ${formatRupiah(balance)}
            </span>
        </div>

        <div class="analysis-item">
            <strong>Saran:</strong>
            <span>
                ${advice}
            </span>
        </div>

    `;

}


/* =========================================
   DASHBOARD
========================================= */

function updateDashboard() {

    const {
        income,
        expense,
        balance,
        ratio
    } = calculate();


    saldoElement.textContent =
        formatRupiah(balance);

    totalIncomeElement.textContent =
        formatRupiah(income);

    totalExpenseElement.textContent =
        formatRupiah(expense);

    transactionCountElement.textContent =
        transactions.length;

    expenseRatioElement.textContent =
        ratio.toFixed(1) + "%";


    updateFinancialStatus();

    updateAnalysis();

}


/* =========================================
   RENDER TRANSACTIONS
========================================= */

function renderTransactions() {

    if (transactions.length === 0) {

        transactionList.innerHTML = `

            <div class="empty-state">

                <div>📊</div>

                <h3>Belum ada transaksi</h3>

                <p>
                    Tambahkan transaksi pertamamu.
                </p>

            </div>

        `;

        return;

    }


    transactionList.innerHTML =
        transactions
            .map(transaction => {

                const isIncome =
                    transaction.type === "income";


                let meta =
                    formatDate(transaction.date);


                if (!isIncome) {

                    meta +=
                        ` • ${transaction.category}`;

                    if (
                        transaction.category ===
                        "Lainnya"
                    ) {

                        meta +=
                            ` • ${transaction.reason}`;

                    }

                }


                return `

                    <div class="transaction-item">

                        <div class="transaction-left">

                            <div class="transaction-icon">
                                ${isIncome ? "↓" : "↑"}
                            </div>

                            <div>

                                <div class="transaction-description">
                                    ${escapeHTML(
                                        transaction.description
                                    )}
                                </div>

                                <div class="transaction-meta">
                                    ${meta}
                                </div>

                            </div>

                        </div>

                        <div>

                            <div class="
                                transaction-amount
                                ${isIncome
                                    ? "income"
                                    : "expense"}
                            ">

                                ${isIncome ? "+" : "-"}
                                ${formatRupiah(
                                    transaction.amount
                                )}

                            </div>

                            <button
                                class="delete-btn"
                                onclick="deleteTransaction(${transaction.id})"
                            >
                                Hapus
                            </button>

                        </div>

                    </div>

                `;

            })
            .join("");

}


/* =========================================
   DELETE
========================================= */

function deleteTransaction(id) {

    const confirmed =
        confirm(
            "Hapus transaksi ini?"
        );

    if (!confirmed) return;


    transactions =
        transactions.filter(
            transaction =>
                transaction.id !== id
        );


    saveData();

    render();

}


/* =========================================
   CLEAR ALL
========================================= */

clearTransactions.addEventListener(
    "click",
    () => {

        if (transactions.length === 0) {

            alert(
                "Belum ada transaksi."
            );

            return;

        }


        const confirmed =
            confirm(
                "Hapus SEMUA transaksi?"
            );


        if (!confirmed) return;


        transactions = [];

        saveData();

        render();

    }
);


/* =========================================
   ESCAPE HTML
========================================= */

function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent =
        value || "";

    return div.innerHTML;

}


/* =========================================
   RENDER EVERYTHING
========================================= */

function render() {

    updateDashboard();

    renderTransactions();

}


/* =========================================
   DARK MODE
========================================= */

const savedTheme =
    localStorage.getItem(
        "emoney_theme"
    );


if (savedTheme === "dark") {

    document.body.classList.add("dark");

    themeToggle.textContent = "☀";

}


themeToggle.addEventListener(
    "click",
    () => {

        document.body.classList.toggle(
            "dark"
        );


        const isDark =
            document.body.classList.contains(
                "dark"
            );


        localStorage.setItem(
            "emoney_theme",
            isDark ? "dark" : "light"
        );


        themeToggle.textContent =
            isDark ? "☀" : "☾";

    }
);


/* =========================================
   START APP
========================================= */

render();
