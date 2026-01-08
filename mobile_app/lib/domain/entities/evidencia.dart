enum TipoEvidencia {
  corte,
  soldadura,
  armado,
  pintura,
  instalacion,
}

class Evidencia {
  const Evidencia({
    required this.tipo,
    required this.pathLocal,
    this.comentario,
  });

  final TipoEvidencia tipo;
  final String pathLocal;
  final String? comentario;

  Map<String, dynamic> toJson() => {
        'tipo': tipo.name,
        'pathLocal': pathLocal,
        'comentario': comentario,
      };
}

