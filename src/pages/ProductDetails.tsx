import React, { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '@/hooks/useProducts';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ArrowLeft, Star, Truck, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading } = useProducts(productId || '');
  const { data: allProducts = [] } = useProducts();

  const recommended = useMemo(() => {
    if (!product) return [];
    return allProducts
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, 4);
  }, [allProducts, product]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-500 font-semibold">Product not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        cartItems={0}
        onCartClick={() => { }}
        searchQuery=""
        onSearchChange={() => { }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" className="mr-3" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <span className="text-gray-500">Back to products</span>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-6">
            {/* Image */}
            <div className="relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-96 object-cover rounded-lg"
              />
              {product.discount && (
                <Badge className="absolute top-4 left-4 bg-red-500 hover:bg-red-500">
                  {product.discount}% OFF
                </Badge>
              )}
              {product.deliveryTime && (
                <div className="absolute top-4 right-4 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                  {product.deliveryTime}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
              <p className="text-gray-600">{product.weight}</p>

              <div className="flex items-center space-x-2 mt-2">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${star <= Math.round(product.rating || 4) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">({product.reviews || 120} reviews)</span>
              </div>

              <div className="flex items-center space-x-4">
                <span className="text-3xl font-bold text-gray-900">₹{product.price}</span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-400 line-through">
                    ₹{product.originalPrice}
                  </span>
                )}
              </div>

              <p className="text-gray-600 leading-relaxed">{product.description}</p>

              {product.benefits?.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Benefits</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.benefits.map((benefit, index) => (
                      <Badge key={index} variant="secondary" className="bg-green-100 text-green-700">
                        {benefit}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Truck className="h-4 w-4" />
                  <span>Fast delivery</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Shield className="h-4 w-4" />
                  <span>Fresh guarantee</span>
                </div>
              </div>

              {/* Quantity & Add to Cart */}
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <span className="font-medium">Quantity:</span>
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      variant="outline"
                      size="sm"
                      className="w-8 h-8 p-0"
                    >
                      -
                    </Button>
                    <span className="font-semibold mx-3">{quantity}</span>
                    <Button
                      onClick={() => setQuantity(quantity + 1)}
                      variant="outline"
                      size="sm"
                      className="w-8 h-8 p-0"
                    >
                      +
                    </Button>
                  </div>
                </div>

                <Button
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3"
                  size="lg"
                >
                  Add {quantity} to Cart – ₹{product.price * quantity}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Recommended */}
        {recommended.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">You may also like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {recommended.map(item => (
                <div
                  key={item.id}
                  onClick={() => navigate(`/product/${item.id}`)}
                  className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-md transition"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-48 object-cover rounded"
                  />
                  <h3 className="mt-2 font-medium text-gray-800">{item.name}</h3>
                  <p className="text-sm text-gray-500">₹{item.price}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetails;
