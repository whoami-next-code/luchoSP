import 'dart:convert';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

/// Service to handle local caching using Hive.
class CacheService {
  static const String _boxName = 'app_cache';
  late Box _box;

  Future<void> init() async {
    await Hive.initFlutter();
    _box = await Hive.openBox(_boxName);
  }

  /// Saves data to cache with an optional expiration time.
  Future<void> save(String key, dynamic data, {Duration? expiration}) async {
    final entry = {
      'data': data,
      'timestamp': DateTime.now().toIso8601String(),
      'expiration': expiration?.inMilliseconds,
    };
    await _box.put(key, jsonEncode(entry));
  }

  /// Retrieves data from cache. Returns null if not found or expired.
  dynamic get(String key) {
    final String? jsonStr = _box.get(key);
    if (jsonStr == null) return null;

    try {
      final Map<String, dynamic> entry = jsonDecode(jsonStr);
      final DateTime timestamp = DateTime.parse(entry['timestamp']);
      final int? expirationMs = entry['expiration'];

      if (expirationMs != null) {
        final DateTime expirationTime =
            timestamp.add(Duration(milliseconds: expirationMs));
        if (DateTime.now().isAfter(expirationTime)) {
          _box.delete(key);
          return null;
        }
      }

      return entry['data'];
    } catch (e) {
      _box.delete(key);
      return null;
    }
  }

  Future<void> clear() async {
    await _box.clear();
  }
}

final cacheServiceProvider = Provider<CacheService>((ref) {
  throw UnimplementedError('CacheService must be initialized in main');
});
