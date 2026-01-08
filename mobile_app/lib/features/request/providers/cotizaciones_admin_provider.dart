import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../data/repositories/cotizaciones_repository.dart';
import '../../../domain/entities/cotizacion_detalle.dart';
import '../../auth/providers/auth_providers.dart';
import '../../../core/network/socket_service.dart';

/// Lista de cotizaciones visibles en la app móvil (usa el endpoint del admin).
final cotizacionesAdminProvider =
    FutureProvider<List<CotizacionDetalle>>((ref) async {
  _setupRealtimeSync(ref);

  final authState = ref.watch(authStateProvider);
  if (authState.user?.id == 'demo' ||
      authState.token == null ||
      authState.token!.isEmpty) {
    return [];
  }

  return ref.watch(cotizacionesRepositoryProvider).obtenerTodas();
});

void _setupRealtimeSync(Ref ref) {
  final authState = ref.watch(authStateProvider);
  if (authState.user?.id == 'demo' ||
      authState.token == null ||
      authState.token!.isEmpty) {
    return;
  }

  final socket = ref.watch(socketServiceProvider);

  void handler(dynamic _) {
    ref.invalidate(cotizacionesAdminProvider);
  }

  socket.listen('cotizaciones.updated', handler);
  ref.onDispose(() => socket.off('cotizaciones.updated', handler));
}


