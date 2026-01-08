import 'material_uso.dart';
import 'parte_tiempo.dart';

class Avance {
  const Avance({
    required this.estado,
    required this.porcentaje,
    required this.materiales,
    required this.tiempos,
    this.observaciones,
  });

  final String estado;
  final int porcentaje;
  final List<MaterialUso> materiales;
  final List<ParteTiempo> tiempos;
  final String? observaciones;

  Map<String, dynamic> toJson() => {
        'estado': estado,
        'porcentaje': porcentaje,
        'materiales': materiales.map((m) => m.toJson()).toList(),
        'tiempos': tiempos.map((t) => t.toJson()).toList(),
        'observaciones': observaciones,
      };
}

