import 'package:dio/dio.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mobile_app/core/storage/cache_service.dart';
import 'package:mobile_app/data/repositories/productos_repository.dart';
import 'package:mobile_app/data/services/api_service.dart';
import 'package:mobile_app/domain/entities/producto.dart';
import 'package:mocktail/mocktail.dart';

class MockApiService extends Mock implements ApiService {}

class MockCacheService extends Mock implements CacheService {}

void main() {
  late ProductosRepository repository;
  late MockApiService mockApi;
  late MockCacheService mockCache;

  setUp(() {
    mockApi = MockApiService();
    mockCache = MockCacheService();
    repository = ProductosRepository(mockApi, mockCache);
  });

  group('ProductosRepository', () {
    const cacheKey = 'productos_list';
    final testData = [
      {
        'id': 1,
        'nombre': 'Producto 1',
        'precio': 100.0,
      }
    ];

    test('obtenerProductos returns cached data if available', () async {
      // Arrange
      when(() => mockCache.get(cacheKey)).thenReturn(testData);

      // Act
      final result = await repository.obtenerProductos();

      // Assert
      expect(result, isA<List<Producto>>());
      expect(result.length, 1);
      expect(result.first.nombre, 'Producto 1');
      verify(() => mockCache.get(cacheKey)).called(1);
      verifyZeroInteractions(mockApi);
    });

    test('obtenerProductos calls API and caches data if cache is empty', () async {
      // Arrange
      when(() => mockCache.get(cacheKey)).thenReturn(null);
      when(() => mockApi.get('productos')).thenAnswer(
        (_) async => Response(
          requestOptions: RequestOptions(path: 'productos'),
          data: testData,
          statusCode: 200,
        ),
      );
      when(() => mockCache.save(any(), any(), expiration: any(named: 'expiration')))
          .thenAnswer((_) async {});

      // Act
      final result = await repository.obtenerProductos();

      // Assert
      expect(result, isA<List<Producto>>());
      expect(result.length, 1);
      verify(() => mockCache.get(cacheKey)).called(1);
      verify(() => mockApi.get('productos')).called(1);
      verify(() => mockCache.save(cacheKey, testData, expiration: any(named: 'expiration'))).called(1);
    });

    test('obtenerProductos forces refresh calls API even if cache exists', () async {
      // Arrange
      when(() => mockApi.get('productos')).thenAnswer(
        (_) async => Response(
          requestOptions: RequestOptions(path: 'productos'),
          data: testData,
          statusCode: 200,
        ),
      );
      when(() => mockCache.save(any(), any(), expiration: any(named: 'expiration')))
          .thenAnswer((_) async {});

      // Act
      final result = await repository.obtenerProductos(forceRefresh: true);

      // Assert
      expect(result, isA<List<Producto>>());
      verifyNever(() => mockCache.get(any()));
      verify(() => mockApi.get('productos')).called(1);
      verify(() => mockCache.save(cacheKey, testData, expiration: any(named: 'expiration'))).called(1);
    });
  });
}
