class MaterialUso {
  const MaterialUso({
    required this.material,
    required this.cantidad,
    required this.unidad,
    this.observaciones,
  });

  final String material;
  final double cantidad;
  final String unidad;
  final String? observaciones;

  Map<String, dynamic> toJson() => {
        'material': material,
        'cantidad': cantidad,
        'unidad': unidad,
        'observaciones': observaciones,
      };
}

