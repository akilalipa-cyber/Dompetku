/* =====================================================
   E-MONEY JAVASCRIPT
===================================================== */


/* ELEMENT */

const form =
    document.getElementById("transactionForm");

const amountInput =
    document.getElementById("amount");

const dateInput =
    document.getElementById("date");

const descriptionInput =
    document.getElementById("description");

const categoryInput =
    document.getElementById("category");

const reasonInput =
    document.getElementById("reason");

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


/* DATABASE */

let transactions = [];

try {

    transactions =
        JSON.parse(
            localStorage.getItem(
                "emoney_transactions"
            )
        ) || [];

} catch (error) {

    console.error(error);

    transactions = [];

}


/* DEFAULT DATE */

dateInput.value =
    new Date()
        .toISOString()
        .split("T")[0];


/* FORMAT RUPIAH */

function formatRupiah(value) {

    return new Intl.NumberFormat(
        "id-ID",
        {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0
        }
    ).format(value);

}


/* FORMAT TANGGAL */

function formatDate(date) {

    if (!date) return "-";

    return new Date(date)
        .toLocaleDateString(
            "id-ID",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );

}


/* SAVE DATA */

function saveData() {

    localStorage.setItem(
        "emoney_transactions",
        JSON.stringify(
            transactions
        )
    );

}


/* =====================================================
   PILIH UANG MASUK / KELUAR
===================================================== */

document
    .querySelectorAll(".type-btn")
    .forEach(button => {

        button.addEventListener(
            "click",
            function () {

                document
                    .querySelectorAll(
                        ".type-btn"
                    )
                    .forEach(btn => {

                        btn.classList.remove(
                            "active"
                        );

                    });


                this.classList.add(
                    "active"
                );


                const type =
                    this.dataset.type;


                transactionTypeInput.value =
                    type;


                if (
                    type === "expense"
                ) {

                    expenseFields
                        .classList
                        .remove(
                            "hidden"
                        );

                } else {

                    expenseFields
                        .classList
                        .add(
                            "hidden"
                        );

                    reasonGroup
                        .classList
                        .add(
                            "hidden"
                        );

                    reasonInput.required =
                        false;

                }

            }
        );

    });


/* =====================================================
   KATEGORI
===================================================== */

categoryInput.addEventListener(
    "change",
    function () {

        if (
            this.value ===
            "Lainnya"
        ) {

            reasonGroup
                .classList
                .remove(
                    "hidden"
                );

            reasonInput.required =
                true;

        } else {

            reasonGroup
                .classList
                .add(
                    "hidden"
                );

            reasonInput.required =
                false;

            reasonInput.value = "";

        }

    }
);


/* =====================================================
   SIMPAN TRANSAKSI
===================================================== */

form.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const type =
            transactionTypeInput.value;


        const amount =
            Number(
                amountInput.value
            );


        const date =
            dateInput.value;


        const description =
            descriptionInput
                .value
                .trim();


        /* VALIDASI NOMINAL */

        if (
            !Number.isFinite(amount) ||
            amount <= 0
        ) {

            alert(
                "Masukkan nominal uang yang benar."
            );

            amountInput.focus();

            return;

        }


        /* VALIDASI TANGGAL */

        if (!date) {

            alert(
                "Pilih tanggal transaksi."
            );

            dateInput.focus();

            return;

        }


        /* VALIDASI KETERANGAN */

        if (!description) {

            alert(
                "Masukkan keterangan transaksi."
            );

            descriptionInput.focus();

            return;

        }


        let category = "";
        let reason = "";


        /* KHUSUS PENGELUARAN */

        if (
            type === "expense"
        ) {

            category =
                categoryInput.value;


            if (
                category ===
                "Lainnya"
            ) {

                reason =
                    reasonInput
                        .value
                        .trim();


                if (!reason) {

                    alert(
                        "Masukkan alasan pembelian."
                    );

                    reasonInput.focus();

                    return;

                }

            }

        }


        /* BUAT TRANSAKSI */

        const newTransaction = {

            id: Date.now(),

            type: type,

            amount: amount,

            date: date,

            category: category,

            reason: reason,

            description: description

        };


        /* TAMBAHKAN */

        transactions.unshift(
            newTransaction
        );


        /* SIMPAN */

        saveData();


        /* RESET */

        resetForm();


        /* UPDATE */

        render();


        /* NOTIFIKASI */

        alert(
            type === "income"
                ? "Uang masuk berhasil disimpan!"
                : "Pengeluaran berhasil disimpan!"
        );

    }
);


/* =====================================================
   RESET FORM
===================================================== */

function resetForm() {

    form.reset();


    dateInput.value =
        new Date()
            .toISOString()
            .split("T")[0];


    transactionTypeInput.value =
        "income";


    document
        .querySelectorAll(
            ".type-btn"
        )
        .forEach(btn =>
            btn.classList.remove(
                "active"
            )
        );


    document
        .querySelector(
            '[data-type="income"]'
        )
        .classList.add(
            "active"
        );


    expenseFields
        .classList
        .add("hidden");


    reasonGroup
        .classList
        .add("hidden");


    reasonInput.required =
        false;

}


/* =====================================================
   HITUNG KEUANGAN
===================================================== */

function calculate() {

    let income = 0;

    let expense = 0;


    transactions.forEach(
        transaction => {

            const amount =
                Number(
                    transaction.amount
                ) || 0;


            if (
                transaction.type ===
                "income"
            ) {

                income += amount;

            } else {

                expense += amount;

            }

        }
    );


    const balance =
        income - expense;


    const ratio =
        income > 0
            ? (
                expense /
                income
            ) * 100
            : 0;


    return {
        income,
        expense,
        balance,
        ratio
    };

}


/* =====================================================
   STATUS KEUANGAN
===================================================== */

function updateStatus() {

    const {
        income,
        ratio
    } = calculate();


    if (income <= 0) {

        financialStatus.textContent =
            "Belum Ada Data";

        statusIcon.textContent =
            "—";

        statusDescription.textContent =
            "Tambahkan pemasukan terlebih dahulu.";

        progressBar.style.width =
            "0%";

        progressBar.style.background =
            "#94a3b8";

        return;

    }


    let status;
    let icon;
    let description;
    let color;


    if (ratio <= 30) {

        status = "Cerdas";
        icon = "★";
        color = "#16a34a";

        description =
            "Pengeluaran sangat terkendali. Kamu mampu menyimpan sebagian besar pemasukan.";

    }

    else if (ratio <= 50) {

        status = "Hemat";
        icon = "✓";
        color = "#2563eb";

        description =
            "Pengeluaran cukup hemat dan masih berada pada kondisi keuangan yang baik.";

    }

    else if (ratio <= 75) {

        status = "Normal";
        icon = "●";
        color = "#f59e0b";

        description =
            "Pengeluaran masih normal. Tetap perhatikan pembelian yang tidak terlalu penting.";

    }

    else {

        status = "Boros";
        icon = "!";
        color = "#dc2626";

        description =
            "Pengeluaran cukup tinggi dibanding pemasukan. Kurangi pengeluaran non-prioritas.";

    }


    financialStatus.textContent =
        status;

    statusIcon.textContent =
        icon;

    statusDescription.textContent =
        description;

    progressBar.style.width =
        Math.min(
            ratio,
            100
        ) + "%";

    progressBar.style.background =
        color;

}


/* =====================================================
   ANALISIS
===================================================== */

function updateAnalysis() {

    const {
        balance,
        ratio
    } = calculate();


    if (
        transactions.length === 0
    ) {

        analysisContent.innerHTML =
            `
                <p class="muted">
                    Belum ada data.
                </p>
            `;

        return;

    }


    let needs = 0;
    let others = 0;


    transactions.forEach(
        transaction => {

            if (
                transaction.type !==
                "expense"
            ) return;


            const amount =
                Number(
                    transaction.amount
                ) || 0;


            if (
                transaction.category ===
                "Kebutuhan"
            ) {

                needs += amount;

            }


            if (
                transaction.category ===
                "Lainnya"
            ) {

                others += amount;

            }

        }
    );


    let advice;


    if (ratio > 75) {

        advice =
            "Pengeluaran tinggi. Kurangi pembelian non-prioritas.";

    }

    else if (ratio > 50) {

        advice =
            "Pengeluaran normal. Tetap sisihkan uang untuk tabungan.";

    }

    else {

        advice =
            "Keuangan cukup baik. Pertahankan kebiasaan hemat.";

    }


    analysisContent.innerHTML = `

        <div class="analysis-item">
            <strong>Rasio:</strong>

            <span>
                ${ratio.toFixed(1)}%
                dari pemasukan digunakan.
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


/* =====================================================
   DASHBOARD
===================================================== */

function updateDashboard() {

    const {
        income,
        expense,
        balance,
        ratio
    } = calculate();


    saldoElement.textContent =
        formatRupiah(
            balance
        );


    totalIncomeElement.textContent =
        formatRupiah(
            income
        );


    totalExpenseElement.textContent =
        formatRupiah(
            expense
        );


    transactionCountElement.textContent =
        transactions.length;


    expenseRatioElement.textContent =
        ratio.toFixed(1) + "%";


    updateStatus();

    updateAnalysis();

}


/* =====================================================
   RIWAYAT
===================================================== */

function renderTransactions() {

    if (
        transactions.length === 0
    ) {

        transactionList.innerHTML = `

            <div class="empty-state">

                <div>📊</div>

                <h3>
                    Belum ada transaksi
                </h3>

                <p>
                    Tambahkan transaksi pertama.
                </p>

            </div>

        `;

        return;

    }


    transactionList.innerHTML =
        transactions
        .map(
            transaction => {

                const isIncome =
                    transaction.type ===
                    "income";


                let meta =
                    formatDate(
                        transaction.date
                    );


                if (!isIncome) {

                    meta +=
                        " • " +
                        transaction.category;


                    if (
                        transaction.category ===
                        "Lainnya"
                    ) {

                        meta +=
                            " • " +
                            transaction.reason;

                    }

                }


                return `

                    <div
                        class="transaction-item"
                    >

                        <div
                            class="transaction-left"
                        >

                            <div
                                class="transaction-icon"
                            >
                                ${
                                    isIncome
                                        ? "↓"
                                        : "↑"
                                }
                            </div>


                            <div>

                                <div
                                    class="transaction-description"
                                >
                                    ${
                                        escapeHTML(
                                            transaction.description
                                        )
                                    }
                                </div>


                                <div
                                    class="transaction-meta"
                                >
                                    ${
                                        escapeHTML(
                                            meta
                                        )
                                    }
                                </div>

                            </div>

                        </div>


                        <div>

                            <div
                                class="
                                    transaction-amount
                                    ${
                                        isIncome
                                            ? "income"
                                            : "expense"
                                    }
                                "
                            >

                                ${
                                    isIncome
                                        ? "+"
                                        : "-"
                                }

                                ${
                                    formatRupiah(
                                        transaction.amount
                                    )
                                }

                            </div>


                            <button
                                class="delete-btn"
                                onclick="
                                    deleteTransaction(
                                        ${transaction.id}
                                    )
                                "
                            >
                                Hapus
                            </button>

                        </div>

                    </div>

                `;

            }
        )
        .join("");

}


/* =====================================================
   HAPUS SATU TRANSAKSI
===================================================== */

function deleteTransaction(id) {

    if (
        !confirm(
            "Hapus transaksi ini?"
        )
    ) return;


    transactions =
        transactions.filter(
            transaction =>
                transaction.id !== id
        );


    saveData();

    render();

}


/* =====================================================
   HAPUS SEMUA
===================================================== */

clearTransactions.addEventListener(
    "click",
    function () {

        if (
            transactions.length === 0
        ) {

            alert(
                "Belum ada transaksi."
            );

            return;

        }


        if (
            !confirm(
                "Hapus semua transaksi?"
            )
        ) return;


        transactions = [];

        saveData();

        render();

    }
);


/* =====================================================
   SECURITY
===================================================== */

function escapeHTML(value) {

    const div =
        document.createElement(
            "div"
        );

    div.textContent =
        value || "";

    return div.innerHTML;

}


/* =====================================================
   DARK MODE
===================================================== */

if (
    localS
