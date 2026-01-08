import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../data/repositories/pedidos_repository.dart';
import '../../../domain/entities/pedido_detalle.dart';

final pedidoDetalleProvider =
    FutureProvider.family<PedidoDetalle, String>((ref, id) async {
  return ref.watch(pedidosRepositoryProvider).obtenerDetalle(id);
});

