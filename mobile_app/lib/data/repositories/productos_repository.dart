import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/storage/cache_service.dart';
import '../../domain/entities/producto.dart';
import '../services/api_service.dart';

class ProductosRepository {
  ProductosRepository(this._api, this._cache);

  final ApiService _api;
  final CacheService _cache;
  static const String _cacheKey = 'productos_list';
  static const Duration _cacheDuration = Duration(minutes: 30);

  Future<List<Producto>> obtenerProductos({bool forceRefresh = false}) async {
    if (!forceRefresh) {
      final cachedData = _cache.get(_cacheKey);
      if (cachedData != null) {
        final List<dynamic> jsonList = cachedData;
        return jsonList
            .map((json) => Producto.fromJson(json as Map<String, dynamic>))
            .toList();
      }
    }

    final response = await _api.get('productos');
    final data = response.data as List<dynamic>? ?? [];
    
    // Save to cache (store as simple list of maps)
    await _cache.save(_cacheKey, data, expiration: _cacheDuration);

    return data
        .map(
          (json) => Producto.fromJson(json as Map<String, dynamic>),
        )
        .toList();
  }
}

final productosRepositoryProvider = Provider<ProductosRepository>(
  (ref) => ProductosRepository(
    ref.watch(apiServiceProvider),
    ref.watch(cacheServiceProvider),
  ),
);

