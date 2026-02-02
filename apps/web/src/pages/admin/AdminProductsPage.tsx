import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, X } from 'lucide-react';
import { formatPrice } from '@ecommerce/shared';
import { api } from '../../services/api';
import Pagination from '../../components/common/Pagination';
import { toast } from 'sonner';
import type { Product, Category, PaginatedResponse } from '@ecommerce/shared';

export default function AdminProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<number | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    status: 'active',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const queryClient = useQueryClient();
  const page = parseInt(searchParams.get('page') || '1');

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get<{ categories: Category[] }>('/categories'),
  });
  const categoriesList = categoriesData?.categories || [];

  const { data, isLoading } = useQuery({
    queryKey: ['admin-products', page, searchQuery, categoryFilter, statusFilter],
    queryFn: async () => {
      let url = `/products?page=${page}&pageSize=10`;
      if (searchQuery) url += `&search=${searchQuery}`;
      if (categoryFilter) url += `&categoryId=${categoryFilter}`;
      if (statusFilter) url += `&status=${statusFilter}`;
      return api.get<PaginatedResponse<Product>>(url);
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => api.post('/products', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      setShowModal(false);
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => api.put(`/products/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      setShowModal(false);
      resetForm();
      setEditingProduct(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      setShowDeleteModal(false);
      setDeletingProductId(null);
      toast.success('Product deleted successfully');
    },
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: (ids: number[]) => api.post('/products/bulk-delete', { ids }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      setSelectedProducts([]);
      toast.success('Products deleted successfully');
    },
  });

  const bulkUpdateStatusMutation = useMutation({
    mutationFn: ({ ids, status }: { ids: number[]; status: string }) => 
      api.put('/products/bulk-update', { ids, status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      setSelectedProducts([]);
      toast.success('Product status updated successfully');
    },
  });

  const handlePageChange = (newPage: number) => {
    setSearchParams({ page: newPage.toString() });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (categoryFilter) params.set('categoryId', categoryFilter);
    if (statusFilter) params.set('status', statusFilter);
    params.set('page', '1');
    setSearchParams(params);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      stock: '',
      category: '',
      status: 'active',
    });
    setFormErrors({});
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.price || parseFloat(formData.price) <= 0) errors.price = 'Valid price is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const productData = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock) || 0,
      categoryId: formData.category ? parseInt(formData.category) : undefined,
      status: formData.status,
      images: ['https://via.placeholder.com/300'], // Required by API
    };

    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct.id, data: productData });
    } else {
      createMutation.mutate(productData);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      stock: product.stock.toString(),
      category: product.categoryId?.toString() || '',
      status: product.status,
    });
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    setDeletingProductId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (deletingProductId) {
      deleteMutation.mutate(deletingProductId);
    } else if (selectedProducts.length > 0) {
      bulkDeleteMutation.mutate(selectedProducts);
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedProducts(data?.data.map((p) => p.id) || []);
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedProducts([...selectedProducts, id]);
    } else {
      setSelectedProducts(selectedProducts.filter((pid) => pid !== id));
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setCategoryFilter('');
    setStatusFilter('');
    setSearchParams({});
  };

  const handleBulkDelete = () => {
    setDeletingProductId(null);
    setShowDeleteModal(true);
  };

  const handleBulkUpdateStatus = (status: string) => {
    if (!status) return;
    bulkUpdateStatusMutation.mutate({ ids: selectedProducts, status });
  };

  return (
    <div data-testid="admin-products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <button
          data-testid="add-product-button"
          onClick={() => {
            resetForm();
            setEditingProduct(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          <Plus className="h-5 w-5" />
          Add Product
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-lg p-4 shadow-sm mb-6">
        <form onSubmit={handleSearch} className="flex flex-col gap-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                data-testid="search-input"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <select
              data-testid="category-filter"
              data-categories-loaded={categoriesList.length > 0 ? 'true' : 'false'}
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                const params = new URLSearchParams(searchParams);
                if (e.target.value) params.set('categoryId', e.target.value); else params.delete('categoryId');
                params.set('page', '1');
                setSearchParams(params);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Categories</option>
              {categoriesList.map((c) => (
                <option key={c.id} value={c.id.toString()}>
                  {c.name}
                </option>
              ))}
            </select>
            <select
              data-testid="status-filter"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                const params = new URLSearchParams(searchParams);
                if (e.target.value) params.set('status', e.target.value); else params.delete('status');
                params.set('page', '1');
                setSearchParams(params);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
            <button
              type="button"
              data-testid="clear-filters"
              onClick={handleClearFilters}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Clear
            </button>
          </div>
        </form>
      </div>

      {/* Bulk Actions */}
      {selectedProducts.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 flex items-center justify-between">
          <span data-testid="selected-count" className="text-blue-900 font-medium">
            {selectedProducts.length} product(s) selected
          </span>
          <div className="flex gap-2">
            <select
              data-testid="bulk-update-status"
              onChange={(e) => handleBulkUpdateStatus(e.target.value)}
              className="px-3 py-1 border border-blue-300 rounded-lg text-sm"
            >
              <option value="">Update Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <button
              data-testid="bulk-delete"
              onClick={handleBulkDelete}
              className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
            >
              Delete Selected
            </button>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {isLoading ? (
          <div data-testid="table-loading" className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-600 border-t-transparent mx-auto"></div>
          </div>
        ) : (
          <div data-testid="products-table" className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 w-12">
                    <input
                      type="checkbox"
                      data-testid="select-all"
                      checked={selectedProducts.length === data?.data.length && data?.data.length > 0}
                      onChange={handleSelectAll}
                      className="rounded"
                    />
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Product</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Category</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Price</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Stock</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data?.data.map((product) => (
                  <tr key={product.id} data-testid="product-row" className="border-t hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <input
                        type="checkbox"
                        data-testid="select-product"
                        checked={selectedProducts.includes(product.id)}
                        onChange={(e) => handleSelectProduct(product.id, e.target.checked)}
                        className="rounded"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.images?.[0] || '/placeholder.jpg'}
                          alt={product.name}
                          className="w-10 h-10 rounded object-cover"
                        />
                        <div>
                          <Link
                            to={`/admin/products/${product.id}`}
                            data-testid="product-name"
                            className="font-medium text-gray-900 hover:text-primary-600"
                          >
                            {product.name}
                          </Link>
                          <p className="text-sm text-gray-500">ID: {product.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600" data-testid="product-category">
                      {product.category?.name || 'N/A'}
                    </td>
                    <td className="py-3 px-4">
                      <span data-testid="product-price" className="font-medium">{formatPrice(product.price)}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through ml-2">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        data-testid="product-stock"
                        className={`${product.stock > 10 ? 'text-green-600' : product.stock > 0 ? 'text-yellow-600' : 'text-red-600'}`}
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        data-testid="product-status"
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          product.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : product.stock === 0
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {product.stock === 0 ? 'Out of Stock' : product.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          data-testid="edit-product"
                          onClick={() => handleEdit(product)}
                          className="p-1 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          data-testid="delete-product"
                          onClick={() => handleDelete(product.id)}
                          className="p-1 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {data && data.pagination.totalPages > 1 && (
        <div className="mt-6">
          <Pagination
            currentPage={page}
            totalPages={data.pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* Product Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setShowModal(false)}></div>

            <div className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div data-testid="product-form-modal" className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name *</label>
                    <input
                      type="text"
                      data-testid="product-form-name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    />
                    {formErrors.name && (
                      <p data-testid="name-error" className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      data-testid="product-form-description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Price *</label>
                    <input
                      type="number"
                      data-testid="product-form-price"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      step="0.01"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    />
                    {formErrors.price && (
                      <p data-testid="price-error" className="mt-1 text-sm text-red-600">{formErrors.price}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Stock</label>
                    <input
                      type="number"
                      data-testid="product-form-stock"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <select
                      data-testid="product-form-category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    >
                      <option value="">Select Category</option>
                      {categoriesList.map((c) => (
                        <option key={c.id} value={c.id.toString()}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <select
                      data-testid="product-form-status"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      data-testid="product-form-submit"
                      className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                    >
                      {editingProduct ? 'Update Product' : 'Add Product'}
                    </button>
                    <button
                      type="button"
                      data-testid="product-form-cancel"
                      onClick={() => setShowModal(false)}
                      className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setShowDeleteModal(false)}></div>

            <div className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div data-testid="confirm-delete-modal" className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <Trash2 className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {deletingProductId ? 'Delete Product' : 'Delete Multiple Products'}
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        {deletingProductId 
                          ? 'Are you sure you want to delete this product? This action cannot be undone.'
                          : `Are you sure you want to delete ${selectedProducts.length} selected product(s)? This action cannot be undone.`}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-3">
                  <button
                    type="button"
                    data-testid="confirm-delete"
                    onClick={confirmDelete}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    data-testid="cancel-delete"
                    onClick={() => setShowDeleteModal(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
