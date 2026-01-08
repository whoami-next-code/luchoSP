import 'dart:convert';

class AvanceHistorial {
  const AvanceHistorial({
    required this.fecha,
    required this.mensaje,
    required this.estado,
    this.tecnico,
  });

  final String fecha;
  final String mensaje;
  final String estado;
  final String? tecnico;

  factory AvanceHistorial.fromJson(Map<String, dynamic> json) => AvanceHistorial(
        fecha: json['fecha']?.toString() ?? '',
        mensaje: json['mensaje']?.toString() ?? json['message']?.toString() ?? '',
        estado: json['estado']?.toString() ?? json['status']?.toString() ?? '',
        tecnico: json['tecnico']?.toString(),
      );
}

class PedidoDetalle {
  const PedidoDetalle({
    required this.id,
    required this.codigo,
    required this.especificaciones,
    required this.medidas,
    required this.materiales,
    required this.observaciones,
    required this.referencias,
    this.avances = const [],
  });

  final String id;
  final String codigo;
  final String especificaciones;
  final String medidas;
  final List<String> materiales;
  final String observaciones;
  final List<String> referencias;
  final List<AvanceHistorial> avances;

  factory PedidoDetalle.fromJson(Map<String, dynamic> json) {
    // Parsear avances desde notes si está disponible
    List<AvanceHistorial> avancesList = [];
    try {
      final notes = json['notes'];
      if (notes != null) {
        final notesData = notes is String ? jsonDecode(notes) : notes;
        if (notesData is Map && notesData['avances'] != null) {
          final avancesJson = notesData['avances'] as List?;
          if (avancesJson != null) {
            avancesList = avancesJson
                .map((a) => AvanceHistorial.fromJson(a as Map<String, dynamic>))
                .toList();
          }
        }
      }
    } catch (e) {
      // Si hay error parseando, continuar sin avances
    }

    // Compatibilidad con orderNumber y codigo
    final codigo = json['codigo'] ?? json['orderNumber'] ?? '';

    // Extraer especificaciones desde items o campos directos
    String especificaciones = json['especificaciones'] ?? '';
    String medidas = json['medidas'] ?? '';
    List<String> materiales = [];

    if (especificaciones.isEmpty && json['items'] != null) {
      try {
        final items = json['items'] is String 
            ? jsonDecode(json['items']) 
            : json['items'];
        if (items is List && items.isNotEmpty) {
          final firstItem = items[0];
          if (firstItem is Map) {
            especificaciones = firstItem['specs']?.toString() ?? 
                              firstItem['especificaciones']?.toString() ?? '';
            medidas = firstItem['medidas']?.toString() ?? '';
            if (firstItem['materiales'] != null) {
              materiales = (firstItem['materiales'] as List?)
                  ?.map((e) => e.toString())
                  .toList() ?? [];
            }
          }
        }
      } catch (e) {
        // Continuar con valores por defecto
      }
    }

    return PedidoDetalle(
      id: json['id']?.toString() ?? '',
      codigo: codigo,
      especificaciones: especificaciones.isEmpty ? 'No especificado' : especificaciones,
      medidas: medidas.isEmpty ? 'No especificado' : medidas,
      materiales: materiales.isEmpty 
          ? ((json['materiales'] as List?)
                  ?.map((e) => e.toString())
                  .toList() ?? 
              const [])
          : materiales,
      observaciones: json['observaciones']?.toString() ?? 
                    json['notes']?.toString() ?? 
                    '',
      referencias: (json['referencias'] as List?)
              ?.map((e) => e.toString())
              .toList() ??
          const [],
      avances: avancesList,
    );
  }
}
