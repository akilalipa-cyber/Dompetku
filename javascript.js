/* =====================================================
   DOMPETKUU - JAVASCRIPT
   Versi perbaikan
===================================================== */


/* =====================================================
   ELEMENT HTML
===================================================== */

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


/* =====================================================
   DATABASE LOCAL STORAGE
===================================================== */

let transactions = [];

function loadTransactions() {

    try {

        const saved =
            localStorage.getItem("emoney_transactions");

        if (saved) {

            const parsed = JSON.parse(saved);

            if (Array.isArray(parsed)) {

                transactions = parsed;

            } else {

                transactions = [];

            }

        } else {

            transactions = [];

        }

    } catch (error) {

        console.error(
            "Gagal membaca data:",
            error
        );

        transactions = [];

    }

}


function saveTransactions() {

    try {

        localStorage.setItem(
            "emoney_transactions",
            JSON.stringify(transactions)
        );

        return true;

    } catch (error) {

        console.error(
            "Gagal menyimpan data:",
            error
        );

        alert(
            "Data tidak dapat disimpan di perangkat ini."
        );

        return false;

    }

}


/* =====================================================
   FORMAT RUPIAH
===================================================== */

function formatRupiah(number) {

    number = Number(number) || 0;

    return "Rp" +
        new Intl.NumberFormat(
            "id-ID"
        ).format(number);

}


/* =====================================================
   TANGGAL DEFAULT
===================================================== */

function setDefaultDate() {

    if (!dateInput) return;

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
   PILIHAN UANG MASUK / UANG KELUAR
===================================================== */

const typeButtons =
    document.querySelectorAll(
        ".type-btn"
    );


typeButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            function () {

                const type =
                    this.dataset.type;

                transactionTypeInput.value =
                    type;

                typeButtons.forEach(
                    btn => {

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

                    reasonInput.value = "";

                }

            }
        );

    }
);


/* =====================================================
   KATEGORI PENGELUARAN
===================================================== */

if (categoryInput) {

    categoryInput.addEventListener(
        "change",
        function () {

            if (
                transactionTypeInput.value ===
                "expense" &&
                this.value === "Lainnya"
            ) {

                reasonGroup.classList.remove(
                    "hidden"
                );

                reasonInput.required = true;

            } else {

                reasonGroup.classList.add(
                    "hidden"
                );

                reasonInput.required = false;

                reasonInput.value = "";

            }

        }
    );

}


/* =====================================================
   SIMPAN TRANSAKSI
===================================================== */

if (form) {

    form.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            /* -----------------------------
               AMBIL NOMINAL
            ----------------------------- */

            const rawAmount =
                amountInput.value.trim();


            if (rawAmount === "") {

                alert(
                    "Silakan masukkan nominal."
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
                    "Nominal harus lebih dari Rp0."
                );

                amountInput.focus();

                return;

            }


            /* -----------------------------
               AMBIL DATA LAINNYA
            ----------------------------- */

            const type =
                transactionTypeInput.value;

            const date =
                dateInput.value;

            const description =
                descriptionInput.value.trim();


            if (!date) {

                alert(
                    "Silakan pilih tanggal."
                );

                dateInput.focus();

                return;

            }


            if (!description) {

                alert(
                    "Silakan isi keterangan."
                );

                descriptionInput.focus();

                return;

            }


            /* -----------------------------
               DATA PENGELUARAN
            ----------------------------- */

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
                            "Alasan pembelian wajib diisi."
                        );

                        reasonInput.focus();

                        return;

                    }

                }

            }


            /* -----------------------------
               BUAT TRANSAKSI
            ----------------------------- */

            const transaction = {

                id:
                    Date.now().toString() +
                    Math.random()
                        .toString(36)
                        .substring(2),

                type: type,

                amount: amount,

                date: date,

                description:
                    description,

                category:
                    category,

                reason:
                    reason

            };


            /* -----------------------------
               TAMBAHKAN DATA
            ----------------------------- */

            transactions.unshift(
                transaction
            );


            /* -----------------------------
               SIMPAN
            ----------------------------- */

            const saved =
                saveTransactions();


            if (!saved) {

                transactions.shift();

                return;

            }


            /* -----------------------------
               PERBARUI TAMPILAN
            ----------------------------- */

            updateDashboard();

            renderTransactions();


            /* -----------------------------
               RESET FORM
            ----------------------------- */

            form.reset();

            transactionTypeInput.value =
                "income";


            typeButtons.forEach(
                btn => {

                    btn.classList.remove(
                        "active"
                    );

                }
            );


            const incomeButton =
                document.querySelector(
                    '.type-btn[data-type="income"]'
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


            /* -----------------------------
               PESAN BERHASIL
            ----------------------------- */

            alert(
                "Transaksi berhasil disimpan!"
            );

        }
    );

}


/* =====================================================
   HITUNG DASHBOARD
===================================================== */

function updateDashboard() {

    let totalIncome = 0;

    let totalExpense = 0;


    transactions.forEach(
        transaction => {

            const amount =
                Number(transaction.amount) || 0;


            if (
                transaction.type ===
                "income"
            ) {

                totalIncome += amount;

            } else if (
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


    /* -----------------------------
       DASHBOARD
    ----------------------------- */

    saldoElement.textContent =
        formatRupiah(saldo);


    totalIncomeElement.textContent =
        formatRupiah(totalIncome);


    totalExpenseElement.textContent =
        formatRupiah(totalExpense);


    transactionCountElement.textContent =
        transactions.length;


    /* -----------------------------
       RASIO PENGELUARAN
    ----------------------------- */

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
    totalIncome,
    totalExpense,
    saldo
) {

    let status =
        "Belum Ada Data";

    let icon =
        "—";

    let description =
        "Tambahkan transaksi untuk melihat analisis keuangan.";


    if (totalIncome <= 0) {

        status =
            "Belum Ada Data";

        icon =
            "—";

        description =
            "Tambahkan pemasukan untuk mulai melihat kondisi keuangan.";

    }

    else if (ratio <= 30) {

        status =
            "Cerdas";

        icon =
            "★";

        description =
            "Pengeluaranmu sangat terkendali. Pertahankan kebiasaan mengelola uang dengan baik.";

    }

    else if (ratio <= 50) {

        status =
            "Hemat";

        icon =
            "✓";

        description =
            "Kondisi keuangan cukup sehat. Tetap kendalikan pengeluaran.";

    }

    else if (ratio <= 75) {

        status =
            "Normal";

        icon =
            "●";

        description =
            "Pengeluaran masih dalam batas normal, tetapi sebaiknya mulai memperhatikan prioritas.";

    }

    else {

        status =
            "Boros";

        icon =
            "!";

        description =
            "Pengeluaran cukup tinggi dibandingkan pemasukan. Kurangi pengeluaran yang tidak penting.";

    }


    financialStatus.textContent =
        status;


    statusIcon.textContent =
        icon;


    statusDescription.textContent =
        description;


    /* -----------------------------
       PROGRESS BAR
    ----------------------------- */

    let progress =
        ratio;


    if (progress > 100) {

        progress = 100;

    }


    progressBar.style.width =
        `${progress}%`;


    /* -----------------------------
       ANALISIS
    ----------------------------- */

    generateAnalysis(
        ratio,
        totalIncome,
        totalExpense,
        saldo
    );

}


/* =====================================================
   ANALISIS KEUANGAN
===================================================== */

function generateAnalysis(
    ratio,
    income,
    expense,
    balance
) {

    if (transactions.length === 0) {

        analysisContent.innerHTML = `
            <p class="muted">
                Belum ada data.
            </p>
        `;

        return;

    }


    let advice = "";


    if (income <= 0) {

        advice = `
            <p>
                Belum terdapat pemasukan.
                Tambahkan pemasukan agar analisis
                keuangan dapat dilakukan.
            </p>
        `;

    }

    else if (ratio <= 30) {

        advice = `
            <p>
                Kondisi keuangan sangat baik.
                Pengeluaran hanya
                ${ratio.toFixed(1)}%
                dari total pemasukan.
            </p>
        `;

    }

    else if (ratio <= 50) {

        advice = `
            <p>
                Kamu cukup hemat.
                Pengeluaran berada di angka
                ${ratio.toFixed(1)}%
                dari pemasukan.
            </p>
        `;

    }

    else if (ratio <= 75) {

        advice = `
            <p>
                Pengeluaran masih normal,
                tetapi sebaiknya mulai
                mengurangi pembelian yang
                kurang penting.
            </p>
        `;

    }

    else {

        advice = `
            <p>
                Pengeluaran cukup tinggi,
                yaitu
                ${ratio.toFixed(1)}%
                dari pemasukan.
                Coba prioritaskan kebutuhan utama.
            </p>
        `;

    }


    analysisContent.innerHTML = `

        ${advice}

        <div class="analysis-summary">

            <p>
                <strong>Saldo:</strong>
                ${formatRupiah(balance)}
            </p>

            <p>
                <strong>Pemasukan:</strong>
                ${formatRupiah(income)}
            </p>

            <p>
                <strong>Pengeluaran:</strong>
                ${formatRupiah(expense)}
            </p>

        </div>

    `;

}


/* =====================================================
   RIWAYAT TRANSAKSI
===================================================== */

function renderTransactions() {

    if (
        !transactionList
    ) return;


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
            transaction => {

                const isIncome =
                    transaction.type ===
                    "income";


                const amountText =
                    formatRupiah(
                        transaction.amount
                    );


                const sign =
                    isIncome
                        ? "+"
                        : "-";


                const typeText =
                    isIncome
                        ? "Uang Masuk"
                        : "Uang Keluar";


                let extraInfo = "";


                if (!isIncome) {

                    extraInfo =
                        `<small>
                            ${escapeHTML(
                                transaction.category || ""
                            )}
                            ${
                                transaction.reason
                                    ? " — " +
                                      escapeHTML(
                                          transaction.reason
                                      )
                                    : ""
                            }
                        </small>`;

                }


                return `

                    <div
                        class="transaction-item
                        ${isIncome ? "income" : "expense"}"
                    >

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

                            ${extraInfo}

                        </div>


                        <div class="transaction-right">

                            <strong>
                                ${sign}${amountText}
                            </strong>

                            <button
                                type="button"
                                class="delete-btn"
                                data-id="${transaction.id}"
                            >
                                Hapus
                            </button>

                        </div>

                    </div>

                `;

            }
        ).join("");


    /* -----------------------------
       TOMBOL HAPUS
    ----------------------------- */

    const deleteButtons =
        transactionList.querySelectorAll(
