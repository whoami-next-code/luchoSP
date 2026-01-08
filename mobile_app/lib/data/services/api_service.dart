import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/network/dio_client.dart';

class ApiService {
  ApiService(this._dio);

  final Dio _dio;

  Future<Response<dynamic>> post(
    String path, {
    dynamic data,
    Options? options,
  }) {
    final normalizedPath = path.startsWith('/') ? path : '/$path';
    return _dio.post(normalizedPath, data: data, options: options);
  }

  Future<Response<dynamic>> get(
    String path, {
    Map<String, dynamic>? queryParameters,
    Options? options,
  }) {
    final normalizedPath = path.startsWith('/') ? path : '/$path';
    return _dio.get(normalizedPath,
        queryParameters: queryParameters, options: options);
  }
}

final apiServiceProvider = Provider<ApiService>(
  (ref) => ApiService(ref.watch(dioProvider)),
);

