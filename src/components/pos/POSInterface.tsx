"use client";

import { useState, useEffect } from "react";
import { Search, ShoppingCart, Trash2, Plus, Minus, CreditCard, Banknote, User } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Product {
  id: string;
  nombre: string;
  precio_venta: number;
  stock_actual: number;
  categoria: string;
}

interface CartItem extends Product {
  quantity: number;
}

export function POSInterface() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .order('nombre');
    
    if (data) setProducts(data);
    setLoading(false);
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        const newQuantity = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const total = cart.reduce((sum, item) => sum + (item.precio_venta * item.quantity), 0);

  const filteredProducts = products.filter(p => 
    (selectedCategory === "Todos" || p.categoria === selectedCategory) &&
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = ["Todos", ...Array.from(new Set(products.map(p => p.categoria)))];

  return (
    <div className="flex h-[calc(100vh-100px)] gap-6">
      {/* Product Grid */}
      <div className="flex-1 flex flex-col gap-6">
        {/* Search & Filter */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-200/50" />
            <input
              type="text"
              placeholder="Buscar productos..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-indigo-200/50 focus:outline-none focus:border-indigo-500/50 transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 max-w-md">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? "bg-indigo-500 text-white"
                    : "bg-white/5 text-indigo-200/60 hover:bg-white/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-3 gap-4 overflow-y-auto pr-2">
          {filteredProducts.map(product => (
            <button
              key={product.id}
              onClick={() => addToCart(product)}
              className="bg-white/5 border border-white/10 rounded-xl p-4 text-left hover:border-indigo-500/50 hover:bg-white/10 transition-all group"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-medium px-2 py-1 rounded-md bg-indigo-500/10 text-indigo-400">
                  {product.categoria}
                </span>
                <span className="text-xs text-indigo-200/40">Stock: {product.stock_actual}</span>
              </div>
              <h3 className="text-white font-medium truncate mb-1 group-hover:text-indigo-300 transition-colors">
                {product.nombre}
              </h3>
              <p className="text-lg font-bold text-white">
                ${product.precio_venta.toFixed(2)}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Cart Sidebar */}
      <div className="w-96 bg-white/5 border border-white/10 rounded-2xl flex flex-col">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-indigo-400" />
              Carrito
            </h2>
            <span className="text-sm text-indigo-200/60">{cart.length} items</span>
          </div>
          
          {/* Customer Selector Mock */}
          <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-left">
            <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center">
              <User className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Cliente General</p>
              <p className="text-xs text-indigo-200/40">Consumidor Final</p>
            </div>
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.map(item => (
            <div key={item.id} className="flex gap-3 p-3 rounded-xl bg-black/20">
              <div className="flex-1">
                <h4 className="text-sm font-medium text-white truncate">{item.nombre}</h4>
                <p className="text-xs text-indigo-200/60">${item.precio_venta.toFixed(2)} c/u</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-2 bg-white/5 rounded-lg p-1">
                  <button 
                    onClick={() => updateQuantity(item.id, -1)}
                    className="p-1 hover:text-white text-indigo-200/40 transition-colors"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-sm font-medium text-white w-4 text-center">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, 1)}
                    className="p-1 hover:text-white text-indigo-200/40 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" /> Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Totals & Actions */}
        <div className="p-6 bg-black/20 border-t border-white/10 mt-auto">
          <div className="space-y-2 mb-6">
            <div className="flex justify-between text-sm text-indigo-200/60">
              <span>Subtotal</span>
              <span>${(total / 1.18).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-indigo-200/60">
              <span>Impuestos (18%)</span>
              <span>${(total - (total / 1.18)).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xl font-bold text-white pt-2 border-t border-white/10">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white transition-colors">
              <CreditCard className="w-5 h-5" />
              <span className="text-sm font-medium">Tarjeta</span>
            </button>
            <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white transition-colors">
              <Banknote className="w-5 h-5" />
              <span className="text-sm font-medium">Efectivo</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
