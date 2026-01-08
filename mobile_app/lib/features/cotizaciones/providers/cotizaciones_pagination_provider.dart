import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/network/socket_service.dart';
import '../../auth/providers/auth_providers.dart';
import '../../../core/storage/cache_service.dart';
import '../../../domain/entities/cotizacion_detalle.dart';
import '../../../domain/entities/cotizaciones_filter.dart';
import '../../../data/repositories/cotizaciones_repository.dart';

class CotizacionesState {
  final List<CotizacionDetalle> items;
  final bool isLoading;
  final String? error;
  final int page;
  final bool hasMore;
  final CotizacionesFilter filter;

  const CotizacionesState({
    this.items = const [],
    this.isLoading = false,
    this.error,
    this.page = 1,
    this.hasMore = true,
    required this.filter,
  });

  CotizacionesState copyWith({
    List<CotizacionDetalle>? items,
    bool? isLoading,
    String? error,
    int? page,
    bool? hasMore,
    CotizacionesFilter? filter,
  }) {
    return CotizacionesState(
      items: items ?? this.items,
      isLoading: isLoading ?? this.isLoading,
      error: error ?? this.error,
      page: page ?? this.page,
      hasMore: hasMore ?? this.hasMore,
      filter: filter ?? this.filter,
    );
  }
}

class CotizacionesNotifier extends StateNotifier<CotizacionesState> {
  final CotizacionesRepository _repository;
  final CacheService _cache;
  static const String _filterCacheKey = 'cotizaciones_filter_prefs';

  CotizacionesNotifier(this._repository, this._cache)
      : super(CotizacionesState(filter: CotizacionesFilter())) {
      final data = _cache.get(_filterCacheKey);
      if (data != null) {
          try {
             final filter = CotizacionesFilter.fromJson(Map<String, dynamic>.from(data));
             state = state.copyWith(filter: filter);
          } catch (_) {}
      }
  }

  Future<void> loadNextPage() async {
    if (state.isLoading || !state.hasMore) return;

    state = state.copyWith(isLoading: true, error: null);

    try {
      final newItems = await _repository.obtenerTodas(
        page: state.page,
        limit: 20,
        filter: state.filter,
      );

      if (newItems.isEmpty) {
        state = state.copyWith(isLoading: false, hasMore: false);
      } else {
        state = state.copyWith(
          items: [...state.items, ...newItems],
          isLoading: false,
          page: state.page + 1,
          hasMore: newItems.length >= 20,
        );
      }
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }

  Future<void> refresh() async {
    // Reset state but keep filter
    state = state.copyWith(isLoading: true, page: 1, hasMore: true, error: null);
    
    try {
      final newItems = await _repository.obtenerTodas(
        page: 1,
        limit: 20,
        filter: state.filter,
        forceRefresh: true,
      );

      state = state.copyWith(
        items: newItems,
        isLoading: false,
        page: 2,
        hasMore: newItems.length >= 20,
      );
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }

  void updateFilter(CotizacionesFilter newFilter) {
    state = state.copyWith(filter: newFilter, items: [], page: 1, hasMore: true);
    loadNextPage();
  }

  void removeItem(int id) {
    final updatedItems = state.items.where((item) => item.id != id).toList();
    state = state.copyWith(items: updatedItems);
  }
}

final cotizacionesPaginationProvider =
    StateNotifierProvider<CotizacionesNotifier, CotizacionesState>((ref) {
  final repo = ref.watch(cotizacionesRepositoryProvider);
  final cache = ref.watch(cacheServiceProvider);
  final notifier = CotizacionesNotifier(repo, cache);

  final authState = ref.watch(authStateProvider);
  if (authState.isAuthenticated && authState.token != null && authState.user?.id != 'demo') {
      final socket = ref.watch(socketServiceProvider);
      
      void handler(dynamic data) {
        if (data is Map && data['action'] == 'delete' && data['id'] != null) {
          try {
            final id = int.parse(data['id'].toString());
            notifier.removeItem(id);
          } catch (_) {
            notifier.refresh();
          }
        } else {
          notifier.refresh();
        }
      }

      socket.listen('cotizaciones.updated', handler);
      ref.onDispose(() => socket.off('cotizaciones.updated', handler));
  }

  return notifier;
});
