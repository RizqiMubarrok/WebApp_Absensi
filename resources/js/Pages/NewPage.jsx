import React, { useEffect, useState, useRef } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

export default function NewPage({ auth, classes = [] }) {
    const [month, setMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
    const [classFilter, setClassFilter] = useState("");
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const debounceRef = useRef(null);

    // Fetch recap and return the data so callers (export/print) can await latest results
    // Accept overrides so callers can request using the latest input values immediately
    const fetchRecap = async ({ month: m = month, classFilter: c = classFilter } = {}) => {
        setLoading(true);
        const params = new URLSearchParams();
        if (m) params.append("month", m);
        if (c) params.append("class", c);
        try {
            const r = await fetch(`/attendances/recap?${params.toString()}`, { credentials: "same-origin" });
            const json = await r.json();
            const d = json.data || [];
            setData(d);
            return d;
        } catch (e) {
            setData([]);
            return [];
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecap();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Schedule a debounced fetch using provided next values
    const scheduleFetch = (nextMonth, nextClass) => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            fetchRecap({ month: nextMonth, classFilter: nextClass });
            debounceRef.current = null;
        }, 350);
    };

    // cleanup debounce on unmount
    useEffect(() => {
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, []);

    // Helpers for export and print
    const escapeHtml = (str) => String(str ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    const exportCSV = async () => {
        const rows = (data && data.length) ? data : await fetchRecap();
        if (!rows || !rows.length) {
            alert("Tidak ada data untuk diekspor.");
            return;
        }

        const headers = ["NIS", "Nama", "Kelas", "Hadir", "Izin", "Alfa", "Sakit", "Total"];
        const csvRows = [headers.join(",")];

        for (const r of rows) {
            const values = [r.nis, r.name, r.class, r.hadir, r.izin, r.alfa, r.sakit, r.total];
            const escaped = values.map((v) => {
                const s = v === null || v === undefined ? "" : String(v);
                if (s.includes('"') || s.includes(',') || s.includes('\n')) {
                    return '"' + s.replace(/"/g, '""') + '"';
                }
                return s;
            });
            csvRows.push(escaped.join(","));
        }

        const csv = csvRows.join('\r\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const filename = `rekap-${month}${classFilter ? '-' + classFilter : ''}.csv`;

        if (navigator.msSaveBlob) {
            navigator.msSaveBlob(blob, filename);
        } else {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const handlePrint = async () => {
        const rows = (data && data.length) ? data : await fetchRecap();
        if (!rows || !rows.length) return;

        const title = `Rekapan Absensi - ${month}${classFilter ? ' (' + classFilter + ')' : ''}`;
        const style = `
            <style>
                body { font-family: Inter, Arial, Helvetica, sans-serif; padding: 20px; color: #111827 }
                .title { font-size: 20px; font-weight: 600; margin-bottom: 8px }
                table { border-collapse: collapse; width: 100%; margin-top: 12px }
                th, td { border: 1px solid #e5e7eb; padding: 8px; text-align: left }
                th { background: #f3f4f6; font-weight: 600 }
                @media print { button { display: none } }
            </style>
        `;

        const rowsHtml = rows
            .map(
                (r) =>
                    `<tr><td>${escapeHtml(r.nis)}</td><td>${escapeHtml(r.name)}</td><td>${escapeHtml(r.class)}</td><td>${r.hadir}</td><td>${r.izin}</td><td>${r.alfa}</td><td>${r.sakit}</td><td>${r.total}</td></tr>`
            )
            .join("");

        const html = `<!doctype html><html><head><meta charset="utf-8" /><title>${title}</title>${style}</head><body><div class="title">${title}</div><div>Tanggal cetak: ${new Date().toLocaleString('id-ID')}</div><table><thead><tr><th>NIS</th><th>Nama</th><th>Kelas</th><th>Hadir</th><th>Izin</th><th>Alfa</th><th>Sakit</th><th>Total</th></tr></thead><tbody>${rowsHtml}</tbody></table></body></html>`;

        const win = window.open('', '_blank', 'noopener,noreferrer');
        if (win) {
            win.document.open();
            win.document.write(html);
            win.document.close();
            win.focus();
            setTimeout(() => win.print(), 300);
        } else {
            alert('Tidak dapat membuka jendela cetak. Periksa pengaturan popup browser Anda.');
        }
    };

    return (
        <AuthenticatedLayout
            user={auth?.user}
            header={<h2 className="font-semibold text-xl truncate">Rekapan Absensi Bulanan</h2>}
        >
            <Head title="Rekapan Absensi Bulanan" />

            <div className="py-3 w-full px-3 sm:px-4 lg:px-6">
                <div className="bg-white shadow sm:rounded-lg p-6">
                    <div className="flex flex-col md:flex-row md:items-end gap-4 mb-4">
                        <div>
                            <label className="block text-sm text-gray-600">Bulan</label>
                            <input
                                type="month"
                                value={month}
                                onChange={(e) => {
                                    const next = e.target.value;
                                    setMonth(next);
                                    scheduleFetch(next, classFilter);
                                }}
                                className="mt-1 block w-44 border-gray-200 rounded-md"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-600">Kelas</label>
                            <select
                                value={classFilter}
                                onChange={(e) => {
                                    const next = e.target.value;
                                    setClassFilter(next);
                                    scheduleFetch(month, next);
                                }}
                                className="mt-1 block w-48 border-gray-200 rounded-md"
                            >
                                <option value="">Semua Kelas</option>
                                {classes.map((c) => (
                                    <option key={c} value={c}>
                                        {c}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="text-sm text-gray-500 mr-2">Auto-refresh aktif</div>
                            <button
                                onClick={exportCSV}
                                disabled={loading || data.length === 0}
                                className={`bg-white text-[#2F59C8] border border-[#2F59C8] px-3 py-2 rounded-md ${loading || data.length === 0 ? 'opacity-60 cursor-not-allowed' : ''}`}
                                title="Export CSV"
                            >
                                Export CSV
                            </button>

                            <button
                                onClick={handlePrint}
                                disabled={loading || data.length === 0}
                                className={`bg-gray-100 text-gray-700 px-3 py-2 rounded-md ${loading || data.length === 0 ? 'opacity-60 cursor-not-allowed' : ''}`}
                                title="Cetak"
                            >
                                Cetak
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr className="text-left text-xs text-gray-500 uppercase">
                                    <th className="px-3 py-2">NIS</th>
                                    <th className="px-3 py-2">Nama</th>
                                    <th className="px-3 py-2">Kelas</th>
                                    <th className="px-3 py-2">Hadir</th>
                                    <th className="px-3 py-2">Izin</th>
                                    <th className="px-3 py-2">Alfa</th>
                                    <th className="px-3 py-2">Sakit</th>
                                    <th className="px-3 py-2">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="8" className="px-3 py-4 text-center text-sm text-gray-500">
                                            Memuat...
                                        </td>
                                    </tr>
                                ) : data.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="px-3 py-4 text-center text-sm text-gray-500">
                                            Tidak ada data untuk bulan ini.
                                        </td>
                                    </tr>
                                ) : (
                                    data.map((row) => (
                                        <tr key={row.student_id} className="border-t">
                                            <td className="px-3 py-2 text-sm">{row.nis}</td>
                                            <td className="px-3 py-2 text-sm">{row.name}</td>
                                            <td className="px-3 py-2 text-sm">{row.class}</td>
                                            <td className="px-3 py-2 text-sm">{row.hadir}</td>
                                            <td className="px-3 py-2 text-sm">{row.izin}</td>
                                            <td className="px-3 py-2 text-sm">{row.alfa}</td>
                                            <td className="px-3 py-2 text-sm">{row.sakit}</td>
                                            <td className="px-3 py-2 text-sm font-semibold">{row.total}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}