import 'package:dio/dio.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mobile_app/core/storage/cache_service.dart';
import 'package:mobile_app/data/repositories/trabajos_repository.dart';
import 'package:mobile_app/data/services/api_service.dart';
import 'package:mobile_app/domain/entities/trabajo.dart';
import 'package:mocktail/mocktail.dart';

class MockApiService extends Mock implements ApiService {}

class MockCacheService extends Mock implements CacheService {}

void main() {
  late TrabajosRepository repository;
  late MockApiService mockApi;
  late MockCacheService mockCache;

  setUp(() {
    mockApi = MockApiService();
    mockCache = MockCacheService();
    repository = TrabajosRepository(mockApi, mockCache);
  });

  group('TrabajosRepository', () {
    const cacheKey = 'trabajos_asignados';
    final testData = [
      {
        'id': '1',
        'code': 'COT-001',
        'customerName': 'Cliente 1',
        'items': [{'productName': 'Equipo 1'}],
        'status': 'PENDING',
        'progressPercent': 10,
        'estimatedDeliveryDate': '2024-01-01T00:00:00Z',
      }
    ];

    test('obtenerAsignados returns cached data if available', () async {
      // Arrange
      when(() => mockCache.get(cacheKey)).thenReturn(testData);

      // Act
      final result = await repository.obtenerAsignados();

      // Assert
      expect(result, isA<List<Trabajo>>());
      expect(result.length, 1);
      expect(result.first.codigo, 'COT-001');
      verify(() => mockCache.get(cacheKey)).called(1);
      verifyZeroInteractions(mockApi);
    });

    test('obtenerAsignados calls API and caches data if cache is empty', () async {
      // Arrange
      when(() => mockCache.get(cacheKey)).thenReturn(null);
      when(() => mockApi.get('cotizaciones')).thenAnswer(
        (_) async => Response(
          requestOptions: RequestOptions(path: 'cotizaciones'),
          data: testData,
          statusCode: 200,
        ),
      );
      when(() => mockCache.save(any(), any(), expiration: any(named: 'expiration')))
          .thenAnswer((_) async {});

      // Act
      final result = await repository.obtenerAsignados();

      // Assert
      expect(result, isA<List<Trabajo>>());
      expect(result.length, 1);
      verify(() => mockCache.get(cacheKey)).called(1);
      verify(() => mockApi.get('cotizaciones')).called(1);
      verify(() => mockCache.save(cacheKey, testData, expiration: any(named: 'expiration'))).called(1);
    });

    test('obtenerAsignados forces refresh calls API even if cache exists', () async {
      // Arrange
      when(() => mockApi.get('cotizaciones')).thenAnswer(
        (_) async => Response(
          requestOptions: RequestOptions(path: 'cotizaciones'),
          data: testData,
          statusCode: 200,
        ),
      );
      when(() => mockCache.save(any(), any(), expiration: any(named: 'expiration')))
          .thenAnswer((_) async {});

      // Act
      final result = await repository.obtenerAsignados(forceRefresh: true);

      // Assert
      expect(result, isA<List<Trabajo>>());
      verifyNever(() => mockCache.get(any()));
      verify(() => mockApi.get('cotizaciones')).called(1);
      verify(() => mockCache.save(cacheKey, testData, expiration: any(named: 'expiration'))).called(1);
    });
  });
}
