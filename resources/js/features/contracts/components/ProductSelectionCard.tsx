import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';
import { formatearMoneda, calculateProductSubtotal } from '@/features/contracts/functions';
import type { Product, ProductItem } from '@/features/contracts/types';

interface ProductSelectionCardProps {
  products: Product[];
  selectedProduct: number | null;
  productQuantity: number;
  contractProducts: ProductItem[];
  onProductSelect: (productId: number | null) => void;
  onQuantityChange: (quantity: number) => void;
  onAddProduct: () => void;
  onRemoveProduct: (productId: number) => void;
  errors?: {
    products?: string;
  };
}

export default function ProductSelectionCard({
  products,
  selectedProduct,
  productQuantity,
  contractProducts,
  onProductSelect,
  onQuantityChange,
  onAddProduct,
  onRemoveProduct,
  errors,
}: ProductSelectionCardProps) {
  const { t } = useTranslation();

  const getProductDetails = (productId: number) => {
    return products.find(p => p.id === productId);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Products</CardTitle>
        <CardDescription>Select coffins, urns, flowers, and memorial items</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add Product */}
        <div className="flex gap-4">
          <div className="flex-1 space-y-2">
            <Label htmlFor="product">Product</Label>
            <Select
              value={selectedProduct?.toString()}
              onValueChange={(value) => onProductSelect(parseInt(value))}
            >
              <SelectTrigger id="product">
                <SelectValue placeholder="Select a product" />
              </SelectTrigger>
              <SelectContent position="popper">
                {products.map((product) => {
                  const isLowStock = product.stock <= product.min_stock;
                  const isOutOfStock = product.stock <= 0;

                  return (
                    <SelectItem
                      key={product.id}
                      value={product.id.toString()}
                      disabled={isOutOfStock}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span>{product.name} - {formatearMoneda(product.price)}</span>
                        {isOutOfStock ? (
                          <span className="ml-2 text-xs text-red-600 font-semibold">Out of Stock</span>
                        ) : isLowStock ? (
                          <span className="ml-2 text-xs text-yellow-600 font-semibold">Low Stock ({product.stock})</span>
                        ) : (
                          <span className="ml-2 text-xs text-gray-500">Stock: {product.stock}</span>
                        )}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="w-32 space-y-2">
            <Label htmlFor="product_quantity">Quantity</Label>
            <Input
              id="product_quantity"
              type="number"
              min="1"
              value={productQuantity}
              onChange={(e) => onQuantityChange(parseInt(e.target.value) || 1)}
            />
          </div>

          <div className="flex items-end">
            <Button
              type="button"
              onClick={onAddProduct}
              disabled={!selectedProduct}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              {t('common.add')}
            </Button>
          </div>
        </div>

        {/* Products List */}
        {contractProducts.length > 0 && (
          <div className="mt-4 space-y-2">
            <div className="rounded-lg border">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium">Product</th>
                    <th className="px-4 py-2 text-right text-sm font-medium">{t('common.quantity')}</th>
                    <th className="px-4 py-2 text-right text-sm font-medium">{t('contracts.unitPrice')}</th>
                    <th className="px-4 py-2 text-right text-sm font-medium">{t('contracts.subtotal')}</th>
                    <th className="px-4 py-2 text-right text-sm font-medium">{t('common.action')}</th>
                  </tr>
                </thead>
                <tbody>
                  {contractProducts.map((item) => {
                    const product = getProductDetails(item.product_id);
                    const subtotal = calculateProductSubtotal(item);

                    return (
                      <tr key={item.product_id} className="border-t">
                        <td className="px-4 py-2 text-sm">
                          {product?.name}
                          <span className="ml-2 text-xs text-gray-500">({product?.category})</span>
                        </td>
                        <td className="px-4 py-2 text-right text-sm">{item.quantity}</td>
                        <td className="px-4 py-2 text-right text-sm">
                          {formatearMoneda(item.unit_price)}
                        </td>
                        <td className="px-4 py-2 text-right text-sm font-medium">
                          {formatearMoneda(subtotal)}
                        </td>
                        <td className="px-4 py-2 text-right">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => onRemoveProduct(item.product_id)}
                            className="h-8 w-8 text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {errors?.products && <p className="text-sm text-destructive">{errors.products}</p>}
      </CardContent>
    </Card>
  );
}
