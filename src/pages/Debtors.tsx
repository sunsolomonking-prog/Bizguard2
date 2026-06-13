import React from 'react';
import {
  Plus,
  Search,
  Filter,
  Users,
  DollarSign,
  AlertCircle,
  Clock,
  Edit2,
  Trash2,
  Download,
  Phone,
  Mail,
  TrendingUp,
} from 'lucide-react';
import { cn } from '../utils/cn';
import { formatCurrency, formatDate, getInitials } from '../utils/helpers';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  creditLimit: number;
  currentBalance: number;
  totalPurchases: number;
  lastPurchaseDate: string;
  status: 'active' | 'inactive' | 'overdue';
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  customer: string;
  amount: number;
  paid: number;
  balance: number;
  dueDate: string;
  status: 'paid' | 'partial' | 'overdue';
}

const mockCustomers: Customer[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', phone: '+234 801 234 5678', address: '123 Lagos Street, Lagos', creditLimit: 100000, currentBalance: 45000, totalPurchases: 250000, lastPurchaseDate: '2024-01-15', status: 'active' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', phone: '+234 802 345 6789', address: '456 Abuja Road, Abuja', creditLimit: 150000, currentBalance: 0, totalPurchases: 380000, lastPurchaseDate: '2024-01-14', status: 'active' },
  { id: '3', name: 'Mike Johnson', email: 'mike@example.com', phone: '+234 803 456 7890', address: '789 Port Harcourt Ave, PH', creditLimit: 80000, currentBalance: 95000, totalPurchases: 180000, lastPurchaseDate: '2024-01-10', status: 'overdue' },
  { id: '4', name: 'Sarah Wilson', email: 'sarah@example.com', phone: '+234 804 567 8901', address: '321 Kano Street, Kano', creditLimit: 120000, currentBalance: 25000, totalPurchases: 290000, lastPurchaseDate: '2024-01-13', status: 'active' },
  { id: '5', name: 'David Brown', email: 'david@example.com', phone: '+234 805 678 9012', address: '654 Ibadan Road, Ibadan', creditLimit: 50000, currentBalance: 0, totalPurchases: 120000, lastPurchaseDate: '2024-01-08', status: 'inactive' },
];

const mockInvoices: Invoice[] = [
  { id: '1', invoiceNumber: 'INV-2401-001', customer: 'John Doe', amount: 50000, paid: 5000, balance: 45000, dueDate: '2024-01-20', status: 'partial' },
  { id: '2', invoiceNumber: 'INV-2401-002', customer: 'Mike Johnson', amount: 95000, paid: 0, balance: 95000, dueDate: '2024-01-10', status: 'overdue' },
  { id: '3', invoiceNumber: 'INV-2401-003', customer: 'Sarah Wilson', amount: 30000, paid: 5000, balance: 25000, dueDate: '2024-01-25', status: 'partial' },
  { id: '4', invoiceNumber: 'INV-2401-004', customer: 'Jane Smith', amount: 75000, paid: 75000, balance: 0, dueDate: '2024-01-15', status: 'paid' },
];

const statusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  inactive: 'bg-gray-100 text-gray-700',
  overdue: 'bg-red-100 text-red-700',
  paid: 'bg-green-100 text-green-700',
  partial: 'bg-yellow-100 text-yellow-700',
};

export const Debtors: React.FC = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [activeTab, setActiveTab] = React.useState<'customers' | 'invoices'>('customers');
  const [showAddCustomerModal, setShowAddCustomerModal] = React.useState(false);

  const filteredCustomers = mockCustomers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredInvoices = mockInvoices.filter((invoice) => {
    const matchesSearch =
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalOutstanding = mockCustomers.reduce((sum, c) => sum + c.currentBalance, 0);
  const overdueCount = mockCustomers.filter((c) => c.status === 'overdue').length;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Debtors</h1>
          <p className="text-slate-500 mt-1">Manage customers and track outstanding payments</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={() => setShowAddCustomerModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-lg text-sm font-medium hover:from-emerald-600 hover:to-cyan-600 transition-all shadow-lg shadow-emerald-500/25"
          >
            <Plus className="w-4 h-4" />
            Add Customer
          </button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Customers</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">{mockCustomers.length}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Outstanding</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">{formatCurrency(totalOutstanding)}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Overdue Accounts</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">{overdueCount}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Sales</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">{formatCurrency(mockCustomers.reduce((sum, c) => sum + c.totalPurchases, 0))}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab('customers')}
            className={cn(
              'flex-1 px-4 py-3 text-sm font-medium transition-colors',
              activeTab === 'customers'
                ? 'text-emerald-600 border-b-2 border-emerald-600'
                : 'text-slate-600 hover:text-slate-800'
            )}
          >
            Customers
          </button>
          <button
            onClick={() => setActiveTab('invoices')}
            className={cn(
              'flex-1 px-4 py-3 text-sm font-medium transition-colors',
              activeTab === 'invoices'
                ? 'text-emerald-600 border-b-2 border-emerald-600'
                : 'text-slate-600 hover:text-slate-800'
            )}
          >
            Invoices
          </button>
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-slate-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder={activeTab === 'customers' ? 'Search customers...' : 'Search invoices...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                {activeTab === 'customers' ? (
                  <>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="overdue">Overdue</option>
                  </>
                ) : (
                  <>
                    <option value="paid">Paid</option>
                    <option value="partial">Partial</option>
                    <option value="overdue">Overdue</option>
                  </>
                )}
              </select>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-x-auto">
          {activeTab === 'customers' ? (
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Credit Limit</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Balance</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Total Purchases</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">{getInitials(customer.name)}</span>
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">{customer.name}</p>
                          <p className="text-xs text-slate-500">{customer.address}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Phone className="w-3 h-3" />
                          {customer.phone}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Mail className="w-3 h-3" />
                          {customer.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-slate-800">{formatCurrency(customer.creditLimit)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        'font-semibold',
                        customer.currentBalance > 0 ? 'text-red-600' : 'text-green-600'
                      )}>
                        {formatCurrency(customer.currentBalance)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-600">{formatCurrency(customer.totalPurchases)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn('px-2.5 py-1 text-xs font-medium rounded-full', statusColors[customer.status])}>
                        {customer.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
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
          ) : (
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Invoice</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Paid</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Balance</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Due Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <span className="font-medium text-slate-800">{invoice.invoiceNumber}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-600">{invoice.customer}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-slate-800">{formatCurrency(invoice.amount)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-green-600">{formatCurrency(invoice.paid)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn('font-semibold', invoice.balance > 0 ? 'text-red-600' : 'text-green-600')}>
                        {formatCurrency(invoice.balance)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-600">{formatDate(invoice.dueDate)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn('px-2.5 py-1 text-xs font-medium rounded-full', statusColors[invoice.status])}>
                        {invoice.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add Customer Modal */}
      {showAddCustomerModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-800">Add Customer</h2>
              <p className="text-sm text-slate-500 mt-1">Add a new customer to your database</p>
            </div>
            <div className="p-6">
              <div className="text-center py-8">
                <Users className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-800">Customer Management</h3>
                <p className="text-slate-500 mt-2">
                  Add customers with contact details, credit limits, and track their purchase history.
                </p>
              </div>
            </div>
            <div className="p-6 border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={() => setShowAddCustomerModal(false)}
                className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-lg font-medium hover:from-emerald-600 hover:to-cyan-600 transition-all">
                Save Customer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Debtors;
