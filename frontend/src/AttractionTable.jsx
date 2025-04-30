import { useEffect, useState } from "react";
import axios from "axios";
import "./AttractionTable.css";
import DataTable from "react-data-table-component";

export default function AttractionTable() {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [perPage, setPerPage] = useState(10);

  const fetchData = async (customPage = page, customPerPage = perPage) => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/attractions", {
        params: {
          page: customPage,
          per_page: customPerPage,
          search,
        },
      });
      console.log(res);
      setData(res.data.results);
      setTotal(res.data.total);
      setPage(customPage);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, search]);

  const columns = [
    {
      name: "ID",
      selector: (row) => row.id,
    },
    {
      name: "Image",
      cell: (row) => (
        <img src={row.coverimage} alt={row.name} className="attraction-image" />
      ),
    },
    {
      name: "Name",
      selector: (row) => row.name,
    },
    {
      name: "Detail",
      selector: (row) => <div className="detail">{row.detail}</div>,
      wrap: true,
    },
    {
      name: "Latitude",
      selector: (row) => row.latitude,
    },
    {
      name: "Longitude",
      selector: (row) => row.longitude,
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h2>Attraction</h2>
      <div className="search-bar">
        <input
          type="text"
          placeholder="ค้นหาสถานที่..."
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          className="search-input"
        />
      </div>
      <DataTable
        columns={columns}
        data={data}
        pagination
        paginationServer
        paginationTotalRows={total}
        paginationPerPage={perPage}
        onChangePage={(newPage) => {
          setPage(newPage);
          fetchData(newPage, perPage);
        }}
        onChangeRowsPerPage={(newPerPage) => {
          setPerPage(newPerPage);
          setPage(1);
          fetchData(1, newPerPage); // โหลดข้อมูลใหม่ตาม perPage โดยกลับไปหน้าแรก
        }}
        progressPending={loading}
      />
    </div>
  );
}
