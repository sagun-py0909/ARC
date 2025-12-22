'use client';

import { StoreProvider, useStore } from '@/store/StoreContext';
import { NavBar } from '@/components/ui/NavBar';
import { CartDrawer } from '@/components/drawers/CartDrawer';
import "./globals.css";

function App({ children }: { children: React.ReactNode }) {
  const { cart, isCartOpen, isMenuOpen, setIsCartOpen, setIsMenuOpen, removeFromCart } = useStore();

  return (
    <>
      <NavBar 
        cartCount={cart.reduce((a, b) => a + b.qty, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenMenu={() => setIsMenuOpen(true)}
      />
      <main>{children}</main>
      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        removeFromCart={removeFromCart}
      />
    </>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-black text-white antialiased m-0 min-h-screen">
        <StoreProvider>
          <App>{children}</App>
        </StoreProvider>
      </body>
    </html>
  );
}
