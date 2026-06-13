import React from "react";
import {
  Plus,
  Search,
  Filter,
  Package,
  AlertTriangle,
  TrendingUp,
  Edit2,
  Trash2,
  PlusCircle,
  MinusCircle,
  Download,
} from "lucide-react";
import { cn } from "../utils/cn";
import { formatCurrency } from "../utils/helpers";

interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  reorderLevel: number;
  costPrice: number;
  sellingPrice: number;
  stockValue: number;
  status: "in_stock" | "low_stock" | "out_of_stock";
}

const mockProducts: Product[] = [
  {
    id: "1",
    name: "Wireless Mouse",
    sku: "WM-001",
    category: "Electronics",
    quantity: 45,
    reorderLevel: 10,
    costPrice: 2500,
    sellingPrice: 4500,
    stockValue: 112500,
    status: "in_stock",
  },
  {
    id: "2",
    name: "USB-C Cable",
    sku: "UC-002",
    category: "Electronics",
    quantity: 8,
    reorderLevel: 15,
    costPrice: 500,
    sellingPrice: 1200,
    stockValue: 4000,
    status: "low_stock",
  },
  {
    id: "3",
    name: "Laptop Stand",
    sku: "LS-003",
    category: "Accessories",
    quantity: 0,
    reorderLevel: 5,
    costPrice: 3500,
    sellingPrice: 6500,
    stockValue: 0,
    status: "out_of_stock",
  },
  {
    id: "4",
    name: "Mechanical Keyboard",
    sku: "MK-004",
    category: "Electronics",
    quantity: 23,
    reorderLevel: 8,
    costPrice: 8000,
    sellingPrice: 15000,
    stockValue: 184000,
    status: "in_stock",
  },
  {
    id: "5",
    name: 'Monitor 24"',
    sku: "MN-005",
    category: "Electronics",
    quantity: 12,
    reorderLevel: 5,
    costPrice: 25000,
    sellingPrice: 45000,
    stockValue: 300000,
    status: "in_stock",
  },
  {
    id: "6",
    name: "Webcam HD",
    sku: "WC-006",
    category: "Electronics",
    quantity: 6,
    reorderLevel: 10,
    costPrice: 4000,
    sellingPrice: 8000,
    stockValue: 24000,
    status: "low_stock",
  },
  {
    id: "7",
    name: "Desk Lamp",
    sku: "DL-007",
    category: "Office",
    quantity: 34,
    reorderLevel: 10,
    costPrice: 2000,
    sellingPrice: 4000,
    stockValue: 68000,
    status: "in_stock",
  },
  {
    id: "8",
    name: "Office Chair",
    sku: "OC-008",
    category: "Furniture",
    quantity: 5,
    reorderLevel: 3,
    costPrice: 15000,
    sellingPrice: 28000,
    stockValue: 75000,
    status: "in_stock",
  },
];

const statusColors: Record<string, string> = {
  in_stock: "bg-green-100 text-green-700",
  low_stock: "bg-yellow-100 text-yellow-700",
  out_of_stock: "bg-red-100 text-red-700",
};

export const Inventory: React.FC = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState<string>("all");
  const [stockFilter, setStockFilter] = React.useState<string>("all");
  const [showAddProductModal, setShowAddProductModal] = React.useState(false);

  const categories = Array.from(new Set(mockProducts.map((p) => p.category)));

  const filteredProducts = mockProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || product.category === categoryFilter;
    const matchesStock =
      stockFilter === "all" || product.status === stockFilter;
    return matchesSearch && matchesCategory && matchesStock;
  });

  const totalValue = filteredProducts.reduce((sum, p) => sum + p.stockValue, 0);
  const lowStockCount = filteredProducts.filter(
    (p) => p.status === "low_stock" || p.status === "out_of_stock",
  ).length;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Inventory</h1>
          <p className="text-slate-500 mt-1">
            Manage your products and stock levels
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={() => setShowAddProductModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-lg text-sm font-medium hover:from-emerald-600 hover:to-cyan-600 transition-all shadow-lg shadow-emerald-500/25"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Products</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">
                {filteredProducts.length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Stock Value</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">
                {formatCurrency(totalValue)}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Low Stock</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">
                {lowStockCount}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Categories</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">
                {categories.length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
              <Filter className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="all">All Stock</option>
              <option value="in_stock">In Stock</option>
              <option value="low_stock">Low Stock</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Stock Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                        <Package className="w-5 h-5 text-slate-400" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">
                          {product.name}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-slate-600 font-mono text-sm">
                      {product.sku}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-slate-600">{product.category}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button className="p-1 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors">
                        <MinusCircle className="w-4 h-4" />
                      </button>
                      <span
                        className={cn(
                          "font-medium w-12 text-center",
                          product.quantity <= product.reorderLevel
                            ? "text-red-600"
                            : "text-slate-800",
                        )}
                      >
                        {product.quantity}
                      </span>
                      <button className="p-1 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors">
                        <PlusCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="font-medium text-slate-800">
                        {formatCurrency(product.sellingPrice)}
                      </p>
                      <p className="text-xs text-slate-500">
                        Cost: {formatCurrency(product.costPrice)}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-medium text-slate-800">
                      {formatCurrency(product.stockValue)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={cn(
                        "px-2.5 py-1 text-xs font-medium rounded-full",
                        statusColors[product.status],
                      )}
                    >
                      {product.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">No products found</p>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {showAddProductModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-800">Add Product</h2>
              <p className="text-sm text-slate-500 mt-1">
                Add a new product to your inventory
              </p>
            </div>
            <div className="p-6 space-y-4">
              <div className="text-center py-8">
                <Package className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-800">
                  Product Management
                </h3>
                <p className="text-slate-500 mt-2">
                  Add products with details like name, SKU, category, pricing,
                  and stock levels.
                </p>
                <button
                  onClick={() => setShowAddProductModal(false)}
                  className="mt-6 px-6 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-lg"
                >
                  Get Started
                </button>
              </div>
            </div>
            <div className="p-6 border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={() => setShowAddProductModal(false)}
                className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-lg font-medium hover:from-emerald-600 hover:to-cyan-600 transition-all">
                Save Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
