import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../data/repositories/cotizaciones_repository.dart';
import '../../../domain/entities/cotizacion_detalle.dart';
import '../../../domain/entities/cotizaciones_stats.dart';

final homeStatsProvider = FutureProvider<CotizacionesStats>((ref) async {
  final repository = ref.watch(cotizacionesRepositoryProvider);
  return repository.obtenerEstadisticas();
});

final recentCotizacionesProvider = FutureProvider<List<CotizacionDetalle>>((ref) async {
  final repository = ref.watch(cotizacionesRepositoryProvider);
  return repository.obtenerTodas(limit: 3);
});
