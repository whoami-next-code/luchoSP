import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../domain/entities/evidencia.dart';
import '../../domain/entities/pedido_detalle.dart';
import '../services/api_service.dart';

class PedidosRepository {
  PedidosRepository(this._api);

  final ApiService _api;

  Future<List<PedidoDetalle>> obtenerMisPedidos() async {
    final response = await _api.get('pedidos/mios');
    final data = response.data as List<dynamic>;
    return data.map((json) => PedidoDetalle.fromJson(json)).toList();
  }

  Future<PedidoDetalle> obtenerDetalle(String id) async {
    final response = await _api.get('pedidos/$id');
    final data = response.data as Map<String, dynamic>;
    return PedidoDetalle.fromJson(data);
  }

  Future<void> enviarAvance(String idPedido, Map<String, dynamic> avanceData) async {
    await _api.post(
      'pedidos/$idPedido/avances',
      data: avanceData,
    );
  }

  Future<void> enviarEvidencias(
    String idPedido,
    List<Evidencia> evidencias,
  ) async {
    if (evidencias.isEmpty) return;

    final formData = FormData();
    final tipos = <String>[];
    final comentarios = <String>[];

    for (final evidencia in evidencias) {
      formData.files.add(
        MapEntry(
          'files',
          await MultipartFile.fromFile(
            evidencia.pathLocal,
            filename: evidencia.pathLocal.split(RegExp(r'[\\\\/]')).last,
          ),
        ),
      );
      tipos.add(evidencia.tipo.name);
      comentarios.add(evidencia.comentario ?? '');
    }

    // Agregar arrays de tipos y comentarios
    formData.fields.addAll([
      MapEntry('tipos', tipos.join(',')),
      MapEntry('comentarios', comentarios.join('|||')), // Separador para múltiples comentarios
    ]);

    await _api.post(
      'pedidos/$idPedido/evidencias',
      data: formData,
      options: Options(
        contentType: 'multipart/form-data',
      ),
    );
  }
}

final pedidosRepositoryProvider = Provider<PedidosRepository>(
  (ref) => PedidosRepository(ref.watch(apiServiceProvider)),
);

