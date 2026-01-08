import { render, screen } from "@testing-library/react";
import ProductDetailClient from "@/app/catalogo/[id]/ProductDetailClient";

const product = {
  id: 1,
  name: "Compresor Industrial",
  description: "Equipo para plantas industriales.",
  price: 1500,
  category: "Compresores",
  imageUrl: "/uploads/compresor.png",
  related: [],
  recommended: [],
};

describe("ProductDetailClient", () => {
  it("muestra el nombre, precio y acciones principales", () => {
    render(<ProductDetailClient product={product as any} />);

    expect(screen.getByText("Compresor Industrial")).toBeInTheDocument();
    expect(screen.getByText("$1500")).toBeInTheDocument();
    expect(screen.getByText(/Comprar ahora/i)).toBeInTheDocument();
    expect(screen.getByText(/Cotizar/i)).toBeInTheDocument();
  });
});

