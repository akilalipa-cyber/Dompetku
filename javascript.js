/* =====================================================
   DOMPETKUU - JAVASCRIPT
===================================================== */

"use strict";


/* =====================================================
   ELEMENT
===================================================== */

const form = document.getElementById("transactionForm");

const amountInput = document.getElementById("amount");
const dateInput = document.getElementById("date");
const descriptionInput =
    document.getElementById("description");

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

const typeButtons =
    document.querySelectorAll(".type-btn");


/* =====================================================
   DATABASE
===================================================== */

const STORAGE_KEY =
    "dompetkuu_transactions";

let transactions = [];


/* =====================================================
   LOAD DATA
===================================================== */

function loadTransactions() {

    try {

        const data =
            localStorage.getItem(STORAGE_KEY);

        if (!data) {

            transactions = [];

            return;

        }

        const parsed =
            JSON.parse(data);

        if (Array.isArray(parsed)) {

            transactions = parsed;

        } else {

            transactions = [];

        }

    } catch (error) {

        console.error(
            "Gagal memuat transaksi:",
            error
        );

        transactions = [];

    }

}


/* =====================================================
   SAVE DATA
===================================================== */

function saveTransactions() {

    try {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(transactions)
        );

        return true;

    } catch (error) {

        console.error(
            "Gagal menyimpan transaksi:",
            error
        );

        alert(
            "Transaksi gagal disimpan."
        );

        return false;

    }

}


/* =====================================================
   FORMAT RUPIAH
===================================================== */

function formatRupiah(value) {

    const number =
        Number(value) || 0;

    return (
        "Rp" +
        new Intl.NumberFormat("id-ID")
            .format(number)
    );

}


/* =====================================================
   DEFAULT DATE
===================================================== */

function setDefaultDate() {

    if (!dateInput) {
        return;
    }

    const today =
        new Date();

    const year =
        today.getFullYear();

    const month =
        String(
            today.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            today.getDate()
        ).padStart(2, "0");

    dateInput.value =
        `${year}-${month}-${day}`;

}


/* =====================================================
   PILIH JENIS TRANSAKSI
===================================================== */

typeButtons.forEach(
    function(button) {

        button.addEventListener(
            "click",
            function() {

                const type =
                    this.dataset.type;

                transactionTypeInput.value =
                    type;


                typeButtons.forEach(
                    function(btn) {

                        btn.classList.remove(
                            "active"
                        );

                    }
                );


                this.classList.add(
                    "active"
                );


                if (type === "expense") {

                    expenseFields.classList.remove(
                        "hidden"
                    );

                } else {

                    expenseFields.classList.add(
                        "hidden"
                    );

                    reasonGroup.classList.add(
                        "hidden"
                    );

                    reasonInput.required =
                        false;

                    reasonInput.value =
                        "";

                }

            }
        );

    }
);


/* =====================================================
   KATEGORI
===================================================== */

categoryInput.addEventListener(
    "change",
    function() {

        if (
            transactionTypeInput.value ===
            "expense" &&
            categoryInput.value ===
            "Lainnya"
        ) {

            reasonGroup.classList.remove(
                "hidden"
            );

            reasonInput.required =
                true;

        } else {

            reasonGroup.classList.add(
                "hidden"
            );

            reasonInput.required =
                false;

            reasonInput.value =
                "";

        }

    }
);


/* =====================================================
   SIMPAN TRANSAKSI
===================================================== */

form.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        /* ---------------------------------------------
           NOMINAL
        --------------------------------------------- */

        const rawAmount =
            amountInput.value.trim();


        if (rawAmount === "") {

            alert(
                "Nominal belum diisi."
            );

            amountInput.focus();

            return;

        }


        const amount =
            Number(rawAmount);


        if (
            !Number.isFinite(amount) ||
            amount <= 0
        ) {

            alert(
                "Nominal harus lebih besar dari Rp0."
            );

            amountInput.focus();

            return;

        }


        /* ---------------------------------------------
           DATA DASAR
        --------------------------------------------- */

        const type =
            transactionTypeInput.value;

        const date =
            dateInput.value;

        const description =
            descriptionInput.value.trim();


        if (!date) {

            alert(
                "Tanggal belum dipilih."
            );

            dateInput.focus();

            return;

        }


        if (!description) {

            alert(
                "Keterangan belum diisi."
            );

            descriptionInput.focus();

            return;

        }


        /* ---------------------------------------------
           DATA PENGELUARAN
        --------------------------------------------- */

        let category = "";
        let reason = "";


        if (type === "expense") {

            category =
                categoryInput.value;


            if (!category) {

                alert(
                    "Pilih kategori pengeluaran."
                );

                categoryInput.focus();

                return;

            }


            if (category === "Lainnya") {

                reason =
                    reasonInput.value.trim();


                if (!reason) {

                    alert(
                        "Alasan pembelian wajib diisi."
                    );

                    reasonInput.focus();

                    return;

                }

            }

        }


        /* ---------------------------------------------
           BUAT TRANSAKSI
        --------------------------------------------- */

        const transaction = {

            id:
                Date.now() +
                "-" +
                Math.random()
                    .toString(36)
                    .substring(2, 9),

            type: type,

            amount: amount,

            date: date,

            description:
                description,

            category:
                category,

            reason:
                reason,

            createdAt:
                new Date().toISOString()

        };


        /* ---------------------------------------------
           MASUKKAN KE ARRAY
        --------------------------------------------- */

        transactions.unshift(
            transaction
        );


        /* ---------------------------------------------
           SIMPAN KE LOCAL STORAGE
        --------------------------------------------- */

        const saved =
            saveTransactions();


        if (!saved) {

            transactions.shift();

            return;

        }


        /* ---------------------------------------------
           UPDATE
        --------------------------------------------- */

        updateDashboard();

        renderTransactions();


        /* ---------------------------------------------
           RESET FORM
        --------------------------------------------- */

        form.reset();


        transactionTypeInput.value =
            "income";


        typeButtons.forEach(
            function(btn) {

                btn.classList.remove(
                    "active"
                );

            }
        );


        const incomeButton =
            document.querySelector(
                '[data-type="income"]'
            );


        if (incomeButton) {

            incomeButton.classList.add(
                "active"
            );

        }


        expenseFields.classList.add(
            "hidden"
        );


        reasonGroup.classList.add(
            "hidden"
        );


        reasonInput.required =
            false;


        setDefaultDate();


        alert(
            type === "income"
                ? "Uang masuk berhasil disimpan!"
                : "Uang keluar berhasil disimpan!"
        );

    }
);


/* =====================================================
   UPDATE DASHBOARD
===================================================== */

function updateDashboard() {

    let totalIncome = 0;
    let totalExpense = 0;


    transactions.forEach(
        function(transaction) {

            const amount =
                Number(transaction.amount) || 0;


            if (
                transaction.type ===
                "income"
            ) {

                totalIncome += amount;

            }


            if (
                transaction.type ===
                "expense"
            ) {

                totalExpense += amount;

            }

        }
    );


    const saldo =
        totalIncome -
        totalExpense;


    /* ---------------------------------------------
       TAMPILKAN
    --------------------------------------------- */

    saldoElement.textContent =
        formatRupiah(saldo);


    totalIncomeElement.textContent =
        formatRupiah(totalIncome);


    totalExpenseElement.textContent =
        formatRupiah(totalExpense);


    transactionCountElement.textContent =
        transactions.length;


    /* ---------------------------------------------
       RASIO
    --------------------------------------------- */

    let ratio = 0;


    if (totalIncome > 0) {

        ratio =
            (totalExpense /
            totalIncome) *
            100;

    }


    expenseRatioElement.textContent =
        `${ratio.toFixed(1)}%`;


    updateFinancialStatus(
        ratio,
        totalIncome,
        totalExpense,
        saldo
    );

}


/* =====================================================
   STATUS KEUANGAN
===================================================== */

function updateFinancialStatus(
    ratio,
    income,
    expense,
    saldo
) {

    let status;
    let icon;
    let description;


    if (transactions.length === 0) {

        status =
            "Belum Ada Data";

        icon =
            "—";

        description =
            "Tambahkan transaksi untuk melihat analisis keuangan.";

    }

    else if (income <= 0) {

        status =
            "Belum Ada Pemasukan";

        icon =
            "—";

        description =
            "Tambahkan pemasukan sebelum melakukan analisis keuangan.";

    }

    else if (ratio <= 30) {

        status =
            "Cerdas";

        icon =
            "★";

        description =
            "Pengeluaran sangat terkendali. Pertahankan pengelolaan keuanganmu.";

    }

    else if (ratio <= 50) {

        status =
            "Hemat";

        icon =
            "✓";

        description =
            "Pengeluaran cukup terkendali. Kondisi keuangan tergolong baik.";

    }

    else if (ratio <= 75) {

        status =
            "Normal";

        icon =
            "●";

        description =
            "Pengeluaran masih dalam batas normal. Tetap prioritaskan kebutuhan.";

    }

    else {

        status =
            "Boros";

        icon =
            "!";

        description =
            "Pengeluaran cukup tinggi dibandingkan pemasukan. Kurangi pengeluaran yang kurang penting.";

    }


    financialStatus.textContent =
        status;

    statusIcon.textContent =
        icon;

    statusDescription.textContent =
        description;


    /* ---------------------------------------------
       PROGRESS
    --------------------------------------------- */

    const progress =
        Math.min(
            Math.max(ratio, 0),
            100
        );


    progressBar.style.width =
        `${progress}%`;


    generateAnalysis(
        ratio,
        income,
        expense,
        saldo
    );

}


/* =====================================================
   ANALISIS
===================================================== */

function generateAnalysis(
    ratio,
    income,
    expense,
    saldo
) {

    if (transactions.length === 0) {

        analysisContent.innerHTML = `
            <p class="muted">
                Belum ada data.
            </p>
        `;

        return;

    }


    let message = "";


    if (income <= 0) {

        message = `
            <p>
                Saat ini belum ada pemasukan.
                Tambahkan pemasukan untuk mengetahui
                kondisi keuangan secara lengkap.
            </p>
        `;

    }

    else if (ratio <= 30) {

        message = `
            <p>
                Sangat baik. Pengeluaranmu hanya
                ${ratio.toFixed(1)}%
                dari total pemasukan.
            </p>
        `;

    }

    else if (ratio <= 50) {

        message = `
            <p>
                Kondisi cukup hemat.
                Pengeluaran berada pada
                ${ratio.toFixed(1)}%
                dari pemasukan.
            </p>
        `;

    }

    else if (ratio <= 75) {

        message = `
            <p>
                Pengeluaran masih normal,
                tetapi sebaiknya mulai memperhatikan
                pembelian yang tidak terlalu penting.
            </p>
        `;

    }

    else {

        message = `
            <p>
                Pengeluaran mencapai
                ${ratio.toFixed(1)}%
                dari pemasukan.
                Prioritaskan kebutuhan utama.
            </p>
        `;

    }


    analysisContent.innerHTML = `

        ${message}

        <div class="analysis-summary">

            <p>
                <strong>Saldo:</strong>
                ${formatRupiah(saldo)}
            </p>

            <p>
                <strong>Total pemasukan:</strong>
                ${formatRupiah(income)}
            </p>

            <p>
                <strong>Total pengeluaran:</strong>
                ${formatRupiah(expense)}
            </p>

        </div>

    `;

}


/* =====================================================
   RENDER RIWAYAT
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
        transactions.map(
            function(transaction) {

                const isIncome =
                    transaction.type ===
                    "income";


                const sign =
                    isIncome
                        ? "+"
                        : "-";


                const typeText =
                    isIncome
                        ? "Uang Masuk"
                        : "Uang Keluar";


                let extra =
                    "";


                if (!isIncome) {

                    extra = `

                        <small>
                            Kategori:
                            ${escapeHTML(
                                transaction.category
                            )}
                        </small>

                        ${
                            transaction.reason
                                ? `
                                    <small>
                                        Alasan:
                                        ${escapeHTML(
                                            transaction.reason
                                        )}
                                    </small>
                                  `
                                : ""
                        }

                    `;

                }


                return `

                    <div class="transaction-item
                        ${isIncome
                            ? "income"
                            : "expense"}">

                        <div class="transaction-info">

                            <strong>
                                ${escapeHTML(
                                    transaction.description
                                )}
                            </strong>

                            <span>
                                ${formatDate(
                                    transaction.date
                                )}
                            </span>

                            <small>
                                ${typeText}
                            </small>

                            ${extra}

                        </div>


                        <div class="transaction-right">

                            <strong>
                                ${sign}${formatRupiah(
                                    transaction.amount
                                )}
                            </strong>

                            <button
                                type="button"
                                class="delete-btn"
                                data-id="${transaction.id}"
       
