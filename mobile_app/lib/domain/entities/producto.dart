class Producto {
  const Producto({
    required this.id,
    required this.nombre,
    this.precio,
    this.descripcion,
    this.imagen,
    this.stock,
  });

  final int id;
  final String nombre;
  final double? precio;
  final String? descripcion;
  final String? imagen;
  final int? stock;

  factory Producto.fromJson(Map<String, dynamic> json) => Producto(
        id: (json['id'] as num).toInt(),
        nombre: json['nombre']?.toString() ?? json['name']?.toString() ?? '',
        precio: json['precio'] != null
            ? (json['precio'] as num).toDouble()
            : json['price'] != null
                ? (json['price'] as num).toDouble()
                : null,
        descripcion: json['descripcion']?.toString() ??
            json['description']?.toString(),
        imagen: json['imagen']?.toString() ?? json['image']?.toString(),
        stock: json['stock'] != null
            ? (json['stock'] as num).toInt()
            : json['quantity'] != null
                ? (json['quantity'] as num).toInt()
                : null,
      );
}

