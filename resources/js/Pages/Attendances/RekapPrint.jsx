import React, { useEffect } from "react";
import { Head } from "@inertiajs/react";

export default function RekapPrint({ rekapMonth, rekapData, excluded_dates }) {
    useEffect(() => {
        // trigger print when the page loads
        setTimeout(() => {
            window.print();
        }, 200);
    }, []);

    return (
        <div className="p-6 text-gray-900">
            <Head title={`Rekapan ${rekapMonth} - Print`} />

            <div className="text-center mb-6">
                <h1 className="text-2xl font-bold">Rekapan Absensi Bulanan</h1>
                <div className="text-sm text-gray-600">Bulan: {rekapMonth}</div>
                {excluded_dates && excluded_dates.length > 0 && (
                    <div className="text-xs text-gray-500 mt-2">
                        Hari Minggu tidak dihitung: {excluded_dates.join(", ")}
                    </div>
                )}
            </div>

            <table
                style={{ width: "100%", borderCollapse: "collapse" }}
                border="1"
            >
                <thead>
                    <tr>
                        <th>NIS</th>
                        <th>Nama</th>
                        <th>Kelas</th>
                        <th>Hadir</th>
                        <th>Izin</th>
                        <th>Sakit</th>
                        <th>Alfa</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {rekapData.map((s) => (
                        <tr key={s.id}>
                            <td>{s.nis}</td>
                            <td>{s.name}</td>
                            <td>{s.class}</td>
                            <td style={{ textAlign: "right" }}>{s.present}</td>
                            <td style={{ textAlign: "right" }}>{s.permit}</td>
                            <td style={{ textAlign: "right" }}>{s.sick}</td>
                            <td style={{ textAlign: "right" }}>{s.absent}</td>
                            <td style={{ textAlign: "right" }}>{s.total}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
