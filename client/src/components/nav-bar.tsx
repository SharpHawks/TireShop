import { Link } from "wouter";
import { ShoppingCart } from "lucide-react";

export function NavBar() {
  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/">
          <a className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            TireShop
          </a>
        </Link>
        
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-accent rounded-full">
            <ShoppingCart className="h-6 w-6" />
          </button>
        </div>
      </div>
    </nav>
  );
}
