import 'package:flutter/foundation.dart'
    show TargetPlatform, defaultTargetPlatform, kIsWeb, kReleaseMode;

class AppConfig {
  static const _prodFallbackBaseUrl = 'https://api.tu-dominio.com/api';

  static String _normalizeApiBaseUrl(String url) {
    final raw = url.trim();
    if (raw.isEmpty) return raw;

    try {
      var uri = Uri.parse(raw);

      if (!kReleaseMode) {
        final isLocalhost =
            uri.host == 'localhost' || uri.host == '127.0.0.1';
        if (isLocalhost && uri.hasPort && uri.port == 3000) {
          uri = uri.replace(port: 3001);
        }
      }

      var path = uri.path;
      if (!path.contains('/api')) {
        if (path.isEmpty || path == '/') {
          path = '/api';
        } else {
          final normalized = path.endsWith('/') ? path.substring(0, path.length - 1) : path;
          path = '$normalized/api';
        }
      }
      // Asegurar que el path no termine con barra (los paths siempre empezarán con /)
      if (path.endsWith('/') && path.length > 1) {
        path = path.substring(0, path.length - 1);
      }

      return uri.replace(path: path).toString();
    } catch (_) {
      return raw;
    }
  }

  /// Obtiene el baseUrl respetando overrides por entorno.
  /// - Dev: HTTP (localhost / 10.0.2.2) con prefijo /api.
  /// - Prod: HTTPS; usar --dart-define=API_BASE_URL=https://api.tu-dominio.com/api
  /// - Flutter Web: http://localhost:3001/api (dev)
  /// - Android emulador: http://10.0.2.2:3001/api (dev)
  /// - Otros: http://localhost:3001/api (dev)
  /// - Override: --dart-define=API_BASE_URL=http(s)://host:port/api
  static String get apiBaseUrl {
    const override = String.fromEnvironment('API_BASE_URL');
    if (override.isNotEmpty) return _normalizeApiBaseUrl(override);

    if (kReleaseMode) return _prodFallbackBaseUrl;

    if (kIsWeb) return _normalizeApiBaseUrl('http://localhost:3001/api');
    if (defaultTargetPlatform == TargetPlatform.android) {
      return _normalizeApiBaseUrl('http://10.0.2.2:3001/api');
    }
    return _normalizeApiBaseUrl('http://localhost:3001/api');
  }
}

