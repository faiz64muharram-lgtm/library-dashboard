// ============================================
// DASHBOARD KANTIN HSI-BS
// ============================================

document.addEventListener("DOMContentLoaded", function () {
    // ============================================
    // 1. DATA PRODUK
    // ============================================

    const products = [
        {
            id: 1,
            produk: "Nasi Goreng",
            kategori: "Makanan",
            terjual: 38,
            omzet: 380000,
            tanggal: "2026-10-17"
        },
        {
            id: 2,
            produk: "Mie Ayam",
            kategori: "Makanan",
            terjual: 23,
            omzet: 184000,
            tanggal: "2026-10-18"
        },
        {
            id: 3,
            produk: "Nasi Uduk",
            kategori: "Makanan",
            terjual: 23,
            omzet: 161000,
            tanggal: "2026-10-19"
        },
        {
            id: 4,
            produk: "Air Mineral",
            kategori: "Minuman",
            terjual: 34,
            omzet: 136000,
            tanggal: "2026-10-20"
        },
        {
            id: 5,
            produk: "Es Teh Manis",
            kategori: "Minuman",
            terjual: 42,
            omzet: 126000,
            tanggal: "2026-10-21"
        },
        {
            id: 6,
            produk: "Roti Coklat",
            kategori: "Snack",
            terjual: 28,
            omzet: 140000,
            tanggal: "2026-10-22"
        },
        {
            id: 7,
            produk: "Gorengan",
            kategori: "Snack",
            terjual: 31,
            omzet: 62000,
            tanggal: "2026-10-23"
        },
        {
            id: 8,
            produk: "Jus Jeruk",
            kategori: "Minuman",
            terjual: 18,
            omzet: 126000,
            tanggal: "2026-10-23"
        },
        {
            id: 9,
            produk: "Keripik",
            kategori: "Snack",
            terjual: 16,
            omzet: 48000,
            tanggal: "2026-10-23"
        },
        {
            id: 10,
            produk: "Susu Kotak",
            kategori: "Minuman",
            terjual: 8,
            omzet: 47000,
            tanggal: "2026-10-23"
        }
    ];

    // ============================================
    // 2. DATA PROMO
    // ============================================

    const promotions = [
        {
            id: 1,
            emoji: "🍲",
            nama: "Senin Hemat",
            deskripsi: "Mie Ayam cuma Rp7.000",
            label: "SENIN",
            warna: "blue"
        },
        {
            id: 2,
            emoji: "🥣",
            nama: "Paket Sarapan",
            deskripsi: "Nasi Uduk + Es Teh Rp9.000",
            label: "SETIAP HARI",
            warna: "yellow"
        },
        {
            id: 3,
            emoji: "🍌",
            nama: "Menu Baru",
            deskripsi: "Pisang Goreng Coklat",
            label: "MINGGU INI",
            warna: "teal"
        },
        {
            id: 4,
            emoji: "💧",
            nama: "Jumat Berkah",
            deskripsi: "Air mineral gratis tiap beli makanan",
            label: "JUMAT",
            warna: "red"
        }
    ];

    // ============================================
    // 3. AMBIL ELEMEN HTML
    // ============================================

    const dateInput = document.querySelector("#fDate");
    const categorySelect = document.querySelector("#fkat");

    const dateRangeText = document.querySelector("#dRange");

    const omzetElement = document.querySelector("#kOmzet");
    const itemElement = document.querySelector("#kItem");
    const transactionElement = document.querySelector("#kTrx");

    const omzetCaption = document.querySelector("#cOmzet");
    const itemCaption = document.querySelector("#cItem");
    const transactionCaption = document.querySelector("#cTrx");

    const productCount = document.querySelector("#tCount");
    const promoCount = document.querySelector("#pCount");
    const promoContainer = document.querySelector("#promo");

    const themeButton = document.querySelector("#btnTheme");

    // ============================================
    // 4. FORMAT RUPIAH
    // ============================================

    function formatRupiah(number) {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0
        }).format(number);
    }

    function formatNumber(number) {
        return new Intl.NumberFormat("id-ID").format(number);
    }

    function formatShortRupiah(number) {
        return number / 1000 + "rb";
    }

    // ============================================
    // 5. FLATPICKR
    // ============================================

    let selectedDates = [
        new Date(2026, 9, 17),
        new Date(2026, 9, 23)
    ];

    const datePicker = flatpickr(dateInput, {
        mode: "range",
        dateFormat: "d M Y",
        defaultDate: selectedDates,
        locale: flatpickr.l10ns.id,
        allowInput: false,

        onChange: function (dates) {
            if (dates.length === 2) {
                selectedDates = dates;
                updateDashboard();
            }
        }
    });

    function formatDate(date) {
        return new Intl.DateTimeFormat("id-ID", {
            day: "numeric",
            month: "short"
        }).format(date);
    }

    function updateDateText(filteredProducts) {
        if (selectedDates.length !== 2) {
            dateRangeText.textContent = "Pilih rentang tanggal";
            return;
        }

        const startDate = formatDate(selectedDates[0]);
        const endDate = formatDate(selectedDates[1]);

        const selectedCategories = categorySelect.tomselect
            ? categorySelect.tomselect.getValue()
            : [];

        const categoryCount = selectedCategories.length;

        dateRangeText.textContent =
            `${startDate} – ${endDate} · ` +
            `${categoryCount} kategori · ` +
            `${filteredProducts.length} produk`;
    }

    // ============================================
    // 6. TOM SELECT
    // ============================================

    const categoryChoices = new TomSelect("#fkat", {
        plugins: ["remove_button"],
        maxItems: 3,
        closeAfterSelect: false,
        hideSelected: true,
        placeholder: "Pilih kategori",
        onChange: function () {
            updateDashboard();
        }
    });

    // ============================================
    // 7. CHART.JS
    // ============================================

    const barCanvas = document.querySelector("#cBar");
    const donutCanvas = document.querySelector("#cDn");

    const barChart = new Chart(barCanvas, {
        type: "bar",

        data: {
            labels: [],

            datasets: [
                {
                    label: "Omzet",
                    data: [],

                    backgroundColor: "#3578e5",
                    hoverBackgroundColor: "#1558bc",

                    borderRadius: 4,
                    borderSkipped: false,

                    barPercentage: 0.58,
                    categoryPercentage: 0.8
                }
            ]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,

            interaction: {
                intersect: false,
                mode: "index"
            },

            plugins: {
                legend: {
                    display: false
                },

                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return "Omzet: " +
                                formatRupiah(context.raw);
                        }
                    }
                }
            },

            scales: {
                x: {
                    grid: {
                        display: false
                    },

                    border: {
                        display: false
                    },

                    ticks: {
                        color: "#6b6e76",
                        maxRotation: 0
                    }
                },

                y: {
                    beginAtZero: true,

                    border: {
                        display: false,
                        dash: [4, 4]
                    },

                    grid: {
                        color: "rgba(128, 128, 128, 0.2)"
                    },

                    ticks: {
                        stepSize: 50000,
                        color: "#6b6e76",

                        callback: function (value) {
                            return formatShortRupiah(value);
                        }
                    }
                }
            }
        }
    });

    const donutChart = new Chart(donutCanvas, {
        type: "doughnut",

        data: {
            labels: [
                "Makanan",
                "Minuman",
                "Snack"
            ],

            datasets: [
                {
                    data: [0, 0, 0],

                    backgroundColor: [
                        "#3578e5",
                        "#82b536",
                        "#bf63f3"
                    ],

                    hoverOffset: 6,
                    borderColor: "#ffffff",
                    borderWidth: 2
                }
            ]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,

            cutout: "65%",

            plugins: {
                legend: {
                    position: "bottom",

                    labels: {
                        usePointStyle: true,
                        pointStyle: "circle",
                        padding: 12,

                        color: "#6b6e76",

                        font: {
                            size: 11
                        }
                    }
                },

                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return `${context.label}: ` +
                                `${formatNumber(context.raw)} item`;
                        }
                    }
                }
            }
        }
    });

    // ============================================
    // 8. TABULATOR
    // ============================================

    const productTable = new Tabulator("#tProd", {
        data: products,

        layout: "fitColumns",

        responsiveLayout: "hide",

        pagination: "local",
        paginationSize: 7,

        paginationSizeSelector: [7, 10],

        placeholder: "Tidak ada produk yang ditemukan.",

        initialSort: [
            {
                column: "terjual",
                dir: "desc"
            }
        ],

        columns: [
            {
                title: "Produk",
                field: "produk",
                headerFilter: "input",
                headerFilterPlaceholder: "Cari produk...",
                minWidth: 115,
                widthGrow: 2
            },

            {
                title: "Kategori",
                field: "kategori",
                minWidth: 90,

                formatter: function (cell) {
                    const kategori = cell.getValue();

                    const warna = {
                        Makanan: "blue",
                        Minuman: "green",
                        Snack: "purple"
                    };

                    return `
                        <span class="lozenge ${warna[kategori]}">
                            ${kategori}
                        </span>
                    `;
                }
            },

            {
                title: "Terjual",
                field: "terjual",
                hozAlign: "right",
                sorter: "number",
                width: 85
            },

            {
                title: "Omzet",
                field: "omzet",
                hozAlign: "right",
                sorter: "number",
                minWidth: 100,

                formatter: function (cell) {
                    return formatRupiah(cell.getValue());
                }
            },

            {
                title: "",
                field: "hapus",
                width: 45,
                hozAlign: "center",
                headerSort: false,

                formatter: function () {
                    return `
                        <button
                            class="icon-btn del"
                            type="button"
                            aria-label="Hapus produk"
                            title="Hapus produk"
                        >
                            <svg
                                class="ic"
                                viewBox="0 0 24 24"
                            >
                                <path d="M3 6h18"></path>
                                <path d="M8 6V4h8v2"></path>
                                <path d="M19 6l-1 14H6L5 6"></path>
                                <path d="M10 10v6M14 10v6"></path>
                            </svg>
                        </button>
                    `;
                },

                cellClick: async function (event, cell) {
                    const product = cell.getRow().getData();

                    const result = await Swal.fire({
                        title: "Hapus produk?",
                        text: `Produk "${product.produk}" akan dihapus dari tabel.`,
                        icon: "warning",

                        showCancelButton: true,

                        confirmButtonText: "Ya, hapus",
                        cancelButtonText: "Batal",

                        reverseButtons: true,

                        customClass: {
                            popup: "ads-modal",
                            confirmButton: "btn danger",
                            cancelButton: "btn"
                        },

                        buttonsStyling: false
                    });

                    if (result.isConfirmed) {
                        cell.getRow().delete();

                        updateDashboard();

                        Swal.fire({
                            toast: true,
                            position: "top-end",

                            icon: "success",
                            title: "Produk berhasil dihapus",

                            showConfirmButton: false,
                            timer: 2500,
                            timerProgressBar: true,

                            customClass: {
                                popup: "ads-flag"
                            }
                        });
                    }
                }
            }
        ]
    });

    // ============================================
    // 9. TAMPILKAN PROMO
    // ============================================

    function renderPromotions() {
        promoContainer.innerHTML = "";

        promotions.forEach(function (promo) {
            const item = document.createElement("li");

            item.innerHTML = `
                <span
                    class="p-emoji"
                    style="background: var(--ds-background-accent-${promo.warna}-subtler)"
                >
                    ${promo.emoji}
                </span>

                <div class="p-body">
                    <b>${promo.nama}</b>
                    <small>${promo.deskripsi}</small>
                </div>

                <span class="lozenge ${promo.warna}">
                    ${promo.label}
                </span>
            `;

            promoContainer.appendChild(item);
        });

        promoCount.textContent = `${promotions.length} aktif`;
    }

    renderPromotions();

    // ============================================
    // 10. FILTER PRODUK
    // ============================================

    function getFilteredProducts() {
        const categories = categoryChoices.getValue();

        return productTable.getData().filter(function (product) {
            const productDate = new Date(
                product.tanggal + "T00:00:00"
            );

            const startDate = selectedDates[0];
            const endDate = selectedDates[1];

            const matchesDate =
                selectedDates.length !== 2 ||
                (
                    productDate >= new Date(
                        startDate.getFullYear(),
                        startDate.getMonth(),
                        startDate.getDate()
                    ) &&
                    productDate <= new Date(
                        endDate.getFullYear(),
                        endDate.getMonth(),
                        endDate.getDate()
                    )
                );

            const matchesCategory =
                categories.length === 0 ||
                categories.includes(product.kategori);

            return matchesDate && matchesCategory;
        });
    }

    // ============================================
    // 11. UPDATE DASHBOARD
    // ============================================

    function updateDashboard() {
        const filteredProducts = getFilteredProducts();

        // Hitung omzet
        const totalOmzet = filteredProducts.reduce(
            function (total, product) {
                return total + product.omzet;
            },
            0
        );

        // Hitung jumlah item
        const totalItems = filteredProducts.reduce(
            function (total, product) {
                return total + product.terjual;
            },
            0
        );

        // Hitung transaksi
        // Data contoh: 21 transaksi untuk seluruh produk.
        const totalTransactions = filteredProducts.length > 0
            ? Math.min(
                21,
                Math.max(
                    1,
                    Math.round(
                        21 * filteredProducts.length / products.length
                    )
                )
            )
            : 0;

        // Update kartu ringkasan
        omzetElement.textContent = formatRupiah(totalOmzet);
        itemElement.textContent = formatNumber(totalItems);
        transactionElement.textContent = formatNumber(totalTransactions);

        omzetCaption.textContent = filteredProducts.length
            ? `Rata-rata ${formatRupiah(
                totalOmzet / Math.max(1, 7)
            )} per hari`
            : "Tidak ada omzet";

        itemCaption.textContent =
            `Dari ${filteredProducts.length} produk yang laku`;

        transactionCaption.textContent = "Dalam 7 hari";

        // Update jumlah produk
        productCount.textContent =
            `${filteredProducts.length} produk`;

        // Update keterangan tanggal
        updateDateText(filteredProducts);

        // Update tabel mengikuti filter
        productTable.setFilter(function (row) {
            return filteredProducts.some(function (product) {
                return product.id === row.id;
            });
        });

        // Update grafik omzet harian
        const dailyRevenue = {};

        filteredProducts.forEach(function (product) {
            if (!dailyRevenue[product.tanggal]) {
                dailyRevenue[product.tanggal] = 0;
            }

            dailyRevenue[product.tanggal] += product.omzet;
        });

        const chartDates = Object.keys(dailyRevenue).sort();

        const dayNames = [
            "Min",
            "Sen",
            "Sel",
            "Rab",
            "Kam",
            "Jum",
            "Sab"
        ];

        barChart.data.labels = chartDates.map(function (dateString) {
            const date = new Date(dateString + "T00:00:00");

            return `${dayNames[date.getDay()]}, ${date.getDate()}`;
        });

        barChart.data.datasets[0].data = chartDates.map(
            function (dateString) {
                return dailyRevenue[dateString];
            }
        );

        barChart.update();

        // Update grafik kategori
        const categoryTotals = {
            Makanan: 0,
            Minuman: 0,
            Snack: 0
        };

        filteredProducts.forEach(function (product) {
            categoryTotals[product.kategori] += product.terjual;
        });

        donutChart.data.datasets[0].data = [
            categoryTotals.Makanan,
            categoryTotals.Minuman,
            categoryTotals.Snack
        ];

        donutChart.update();
    }

    // ============================================
    // 12. FLOATING UI TOOLTIP
    // ============================================

    const tooltip = document.querySelector("#tooltip");

    const floatingUI = window.FloatingUIDOM;

    if (floatingUI) {
        const {
            computePosition,
            autoUpdate,
            offset,
            flip,
            shift
        } = floatingUI;

        let cleanupAutoUpdate = null;

        function showTooltip(button) {
            tooltip.textContent = button.dataset.tip;

            tooltip.style.opacity = "1";

            if (cleanupAutoUpdate) {
                cleanupAutoUpdate();
            }

            cleanupAutoUpdate = autoUpdate(button, tooltip, function () {
                computePosition(button, tooltip, {
                    placement: "top",

                    middleware: [
                        offset(8),
                        flip(),
                        shift({
                            padding: 8
                        })
                    ]
                }).then(function (position) {
                    Object.assign(tooltip.style, {
                        left: `${position.x}px`,
                        top: `${position.y}px`
                    });
                });
            });
        }

        function hideTooltip() {
            tooltip.style.opacity = "0";

            if (cleanupAutoUpdate) {
                cleanupAutoUpdate();
                cleanupAutoUpdate = null;
            }
        }

        document.querySelectorAll("[data-tip]").forEach(function (button) {
            button.addEventListener("mouseenter", function () {
                showTooltip(button);
            });

            button.addEventListener("mouseleave", hideTooltip);

            button.addEventListener("focus", function () {
                showTooltip(button);
            });

            button.addEventListener("blur", hideTooltip);
        });
    }

    // ============================================
    // 13. DARK MODE
    // ============================================

    function applyTheme(mode) {
        document.documentElement.setAttribute(
            "data-color-mode",
            mode
        );

        const themeText = themeButton.querySelector("span");

        if (themeText) {
            themeText.textContent =
                mode === "dark" ? "Mode terang" : "Mode gelap";
        }

        try {
            localStorage.setItem("kantin-color-mode", mode);
        } catch (error) {
            console.warn("Tema tidak dapat disimpan.", error);
        }

        barChart.update();
        donutChart.update();
    }

    themeButton.addEventListener("click", function () {
        const currentTheme = document.documentElement.getAttribute(
            "data-color-mode"
        );

        const newTheme = currentTheme === "dark"
            ? "light"
            : "dark";

        applyTheme(newTheme);
    });

    // ============================================
    // 14. NAVIGASI SIDEBAR
    // ============================================

    const navigationLinks = document.querySelectorAll(".nav a");

    navigationLinks.forEach(function (link) {
        link.addEventListener("click", function (event) {
            event.preventDefault();

            navigationLinks.forEach(function (navLink) {
                navLink.removeAttribute("aria-current");
            });

            link.setAttribute("aria-current", "page");

            const menuName = link.textContent.trim();

            if (menuName !== "Dashboard") {
                Swal.fire({
                    title: menuName,
                    text: `Menu ${menuName} dipilih. Halaman ini belum dibuat.`,
                    icon: "info",

                    confirmButtonText: "Mengerti",

                    customClass: {
                        popup: "ads-modal",
                        confirmButton: "btn primary"
                    },

                    buttonsStyling: false
                });

                navigationLinks.forEach(function (navLink) {
                    navLink.removeAttribute("aria-current");
                });

                document.querySelector(".nav a").setAttribute(
                    "aria-current",
                    "page"
                );
            }
        });
    });

    // ============================================
    // 15. JALANKAN DASHBOARD
    // ============================================

    updateDashboard();

    console.log("Dashboard Kantin HSI berhasil dijalankan!");
});