import 'dart:convert';

class Trabajo {
  const Trabajo({
    required this.id,
    required this.codigo,
    required this.cliente,
    required this.equipo,
    required this.estado,
    required this.progreso,
    this.fechaLimite,
  });

  final String id;
  final String codigo;
  final String cliente;
  final String equipo;
  final String estado;
  final int progreso;
  final DateTime? fechaLimite;

  factory Trabajo.fromJson(Map<String, dynamic> json) {
    // Helper: normaliza items (pedidos o cotizaciones) a un string legible.
    String getEquipo(dynamic items) {
      if (items == null) return '';

      var list = items;
      if (items is String) {
        try {
          if (items.trim().startsWith('[')) {
            list = jsonDecode(items);
          } else {
            return items;
          }
        } catch (_) {
          return items;
        }
      }

      if (list is List) {
        return list.map((e) {
          if (e is Map) {
            return e['productName'] ??
                e['name'] ??
                e['producto'] ??
                e['title'] ??
                '';
          }
          return e.toString();
        }).join(', ');
      }

      return items.toString();
    }

    // Helper: calcula progreso según estado (pedidos o cotizaciones)
    int getProgreso(String? status, int? progressPercent) {
      if (progressPercent != null) return progressPercent.clamp(0, 100);
      switch ((status ?? '').toUpperCase()) {
        case 'FINALIZADA':
        case 'COMPLETADA':
        case 'DELIVERED':
        case 'ENTREGADA':
        case 'COMPLETED':
          return 100;
        case 'INSTALACION':
        case 'SHIPPED':
        case 'ENVIADO':
          return 80;
        case 'PRODUCCION':
        case 'EN_PRODUCCION':
        case 'PROCESSING':
        case 'EN_PROCESO':
        case 'CONFIRMED':
          return 50;
        case 'APROBADA':
        case 'PENDING':
        case 'PENDIENTE':
        case 'NUEVA':
          return 10;
        default:
          return 0;
      }
    }

    final status = json['status'] ?? json['orderStatus'] ?? json['estado'];

    return Trabajo(
      id: json['id']?.toString() ?? '',
      // Para cotizaciones, usar code o generar fallback
      codigo: json['orderNumber'] ??
          json['code'] ??
          json['codigo'] ??
          'COT-${json['id'] ?? ''}',
      cliente: json['customerName'] ?? json['cliente'] ?? '',
      equipo: getEquipo(json['items'] ?? json['equipo']),
      estado: status?.toString() ?? 'PENDIENTE',
      progreso: getProgreso(
        status?.toString(),
        (json['progressPercent'] ?? json['progreso']) as int?,
      ),
      fechaLimite: json['fechaLimite'] != null
          ? DateTime.tryParse(json['fechaLimite'].toString())
          : (json['estimatedDeliveryDate'] != null
              ? DateTime.tryParse(json['estimatedDeliveryDate'].toString())
              : null),
    );
  }

}
