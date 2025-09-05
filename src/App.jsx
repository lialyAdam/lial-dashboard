
import React, { useMemo, useState, useEffect } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { Package, TrendingUp, Target, Edit2, Upload } from "lucide-react";

// ✅ مكونات بديلة للـ shadcn/ui
const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-2xl border border-gray-200 shadow-sm p-6 ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children }) => <div className="mb-4">{children}</div>;

const CardTitle = ({ children }) => <h2 className="text-lg font-semibold">{children}</h2>;

const CardContent = ({ children }) => <div>{children}</div>;

const Button = ({ children, className = "", ...props }) => (
  <button
    {...props}
    className={`px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition ${className}`}
  >
    {children}
  </button>
);

// ---------------------- Mock Data ----------------------
const PRODUCTS = [
  { id: "P-1001", name: "12mm Hex Bolt", sku: "HEX-12-100", warehouse: "BLR-A", stock: 180, demand: 120 },
  { id: "P-1002", name: "Steel Washer", sku: "WSR-08-500", warehouse: "BLR-A", stock: 50, demand: 80 },
  { id: "P-1003", name: "M8 Nut", sku: "NUT-08-200", warehouse: "PNQ-C", stock: 80, demand: 80 },
  { id: "P-1004", name: "Bearing 608ZZ", sku: "BRG-608-50", warehouse: "DEL-B", stock: 24, demand: 120 },
];

// ---------------------- Helpers ----------------------
const getStatus = (product) => {
  if (product.stock > product.demand) return "Healthy";
  if (product.stock === product.demand) return "Low";
  return "Critical";
};

const statusStyle = (status) => {
  switch (status) {
    case "Healthy":
      return "bg-green-100 text-green-700 border-green-200";
    case "Low":
      return "bg-amber-100 text-amber-700 border-amber-200";
    default:
      return "bg-red-100 text-red-700 border-red-200";
  }
};

// ---------------------- App ----------------------
export default function App() {
  const [products, setProducts] = useState(PRODUCTS);
  const [search, setSearch] = useState("");
  const [warehouse, setWarehouse] = useState("All");
  const [status, setStatus] = useState("All");
  const [page, setPage] = useState(1);
  const [active, setActive] = useState(null);
  const [demandInput, setDemandInput] = useState("");
  const [transferInput, setTransferInput] = useState("");

  const rowsPerPage = 10;

  // Reset page when filters change
  useEffect(() => setPage(1), [search, warehouse, status]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q);
      const matchesWarehouse = warehouse === "All" || p.warehouse === warehouse;
      const matchesStatus = status === "All" || getStatus(p) === status;
      return matchesSearch && matchesWarehouse && matchesStatus;
    });
  }, [search, warehouse, status, products]);

  const paginatedProducts = useMemo(() => {
    return filteredProducts.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  }, [filteredProducts, page]);

  const totalStock = filteredProducts.reduce((acc, p) => acc + p.stock, 0);
  const totalDemand = filteredProducts.reduce((acc, p) => acc + p.demand, 0);
  const fillRate =
    totalDemand === 0
      ? 0
      : Math.round(
          (filteredProducts.reduce((acc, p) => acc + Math.min(p.stock, p.demand), 0) / totalDemand) * 100
        );

  const warehouses = ["All", ...new Set(products.map((p) => p.warehouse))];
  const chartData = filteredProducts.map((p) => ({ name: p.name, Stock: p.stock, Demand: p.demand }));

  const updateDemand = (id, newDemand) => {
    const val = Number(newDemand);
    if (Number.isNaN(val)) return;
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, demand: Math.max(0, val) } : p)));
  };

  const transferStock = (id, amount) => {
    const val = Number(amount);
    if (Number.isNaN(val)) return;
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, stock: Math.max(0, p.stock - Math.max(0, val)) } : p))
    );
  };

  const openModal = (product) => {
    setActive(product);
    setDemandInput("");
    setTransferInput("");
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">

      <div className="flex">
        
        <aside className="hidden md:block w-64 bg-white border-r border-gray-200 p-6">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white">SS</span>
            <span>SupplySight</span>
          </h2>
          <nav className="space-y-2 text-sm">
            <button className="w-full text-left px-3 py-2 rounded-lg bg-gray-100 font-medium">Dashboard</button>
            <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50">Reports</button>
            <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50">Settings</button>
          </nav>
        </aside>

       
        <main className="flex-1 p-6">
         
          <div className="bg-white rounded-2xl border border-gray-200 px-6 py-4 mb-6 flex items-center justify-between">
            <h1 className="text-xl font-bold flex items-center gap-4">
              Inventory Dashboard
              <div className="flex gap-2">
                {["7d", "14d", "30d"].map((r) => (
                  <button key={r} className="px-3 py-1 rounded-full border text-sm hover:bg-gray-100">
                    {r}
                  </button>
                ))}
              </div>
            </h1>
            <div className="h-10 w-10 rounded-full bg-blue-600 text-white grid place-items-center font-semibold">L</div>
          </div>

          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {[
              { icon: Package, title: "Total Stock", value: totalStock, colorWrap: "bg-blue-100 text-blue-600" },
              { icon: TrendingUp, title: "Total Demand", value: totalDemand, colorWrap: "bg-amber-100 text-amber-600" },
              { icon: Target, title: "Fill Rate", value: `${fillRate}%`, colorWrap: "bg-green-100 text-green-600" },
            ].map(({ icon: Icon, title, value, colorWrap }) => (
              <motion.div
                key={title}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex items-center gap-4"
              >
                <div className={`h-12 w-12 rounded-full grid place-items-center ${colorWrap}`}>
                  <Icon size={26} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">{title}</p>
                  <p className="text-2xl font-bold">{value}</p>
                </div>
              </motion.div>
            ))}
          </div>

          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Stock vs Demand</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={chartData} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                  <defs>
                    <linearGradient id="fillStock" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="fillDemand" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#d97706" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#d97706" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="Stock" fill="url(#fillStock)" stroke="#2563eb" strokeWidth={3} />
                  <Area type="monotone" dataKey="Demand" fill="url(#fillDemand)" stroke="#d97706" strokeWidth={3} />
                  <Line type="monotone" dataKey="Stock" stroke="#2563eb" strokeWidth={0} dot={false} />
                  <Line type="monotone" dataKey="Demand" stroke="#d97706" strokeWidth={0} dot={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <input
              type="text"
              placeholder="Search by Name / SKU / ID"
              className="p-2.5 border border-gray-300 rounded-lg shadow-sm flex-1 min-w-[220px]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="p-2.5 border border-gray-300 rounded-lg shadow-sm"
            value={warehouse}
            onChange={(e) => setWarehouse(e.target.value)}
          >
            {warehouses.map((w) => (
              <option key={w} value={w}>
                {w === "All" ? "All Warehouses" : w}
              </option>
            ))}
          </select>
          <select
            className="p-2.5 border border-gray-300 rounded-lg shadow-sm"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {["All", "Healthy", "Low", "Critical"].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        
        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left p-3">ID</th>
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">SKU</th>
                <th className="text-left p-3">Warehouse</th>
                <th className="text-right p-3">Stock</th>
                <th className="text-right p-3">Demand</th>
                <th className="text-center p-3">Status</th>
                <th className="text-right p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.map((p) => {
                const status = getStatus(p);
                return (
                  <tr key={p.id} className="border-t hover:bg-gray-50">
                    <td className="p-3">{p.id}</td>
                    <td className="p-3">{p.name}</td>
                    <td className="p-3">{p.sku}</td>
                    <td className="p-3">{p.warehouse}</td>
                    <td className="p-3 text-right">{p.stock}</td>
                    <td className="p-3 text-right">{p.demand}</td>
                    <td className="p-3 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${statusStyle(
                          status
                        )}`}
                      >
                        {status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => openModal(p)}
                        className="p-2 rounded-lg hover:bg-gray-100"
                      >
                        <Edit2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredProducts.length === 0 && (
            <div className="p-6 text-center text-gray-500">No products found</div>
          )}
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-500">
            Showing {(page - 1) * rowsPerPage + 1}–
            {Math.min(page * rowsPerPage, filteredProducts.length)} of{" "}
            {filteredProducts.length}
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setPage((p) => Math.max(1, p - 1))}>
              Prev
            </Button>
            <Button
              onClick={() =>
                setPage((p) =>
                  p * rowsPerPage < filteredProducts.length ? p + 1 : p
                )
              }
            >
              Next
            </Button>
          </div>
        </div>

      
        <AnimatePresence>
          {active && (
            <motion.div
              className="fixed inset-0 bg-black/40 flex justify-end z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="w-full sm:w-[400px] bg-white h-full p-6 shadow-xl flex flex-col"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold">{active.name}</h2>
                  <button
                    onClick={() => setActive(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4 flex-1 overflow-y-auto">
                  <div>
                    <p className="text-sm text-gray-600">ID</p>
                    <p className="font-medium">{active.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">SKU</p>
                    <p className="font-medium">{active.sku}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Warehouse</p>
                    <p className="font-medium">{active.warehouse}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Stock</p>
                    <p className="font-medium">{active.stock}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Demand</p>
                    <p className="font-medium">{active.demand}</p>
                  </div>

                 
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Update Demand</label>
                    <input
                      type="number"
                      value={demandInput}
                      onChange={(e) => setDemandInput(e.target.value)}
                      className="w-full border p-2 rounded-lg"
                    />
                    <Button
                      onClick={() => {
                        updateDemand(active.id, demandInput);
                        setDemandInput("");
                      }}
                      className="w-full"
                    >
                      <Upload size={16} className="mr-2 inline" />
                      Update
                    </Button>
                  </div>

                 
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Transfer Stock</label>
                    <input
                      type="number"
                      value={transferInput}
                      onChange={(e) => setTransferInput(e.target.value)}
                      className="w-full border p-2 rounded-lg"
                    />
                    <Button
                      onClick={() => {
                        transferStock(active.id, transferInput);
                        setTransferInput("");
                      }}
                      className="w-full bg-amber-600 hover:bg-amber-700"
                    >
                      <Upload size={16} className="mr-2 inline" />
                      Transfer
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  </div>
  );
}
