import 'package:dio/dio.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mobile_app/core/storage/cache_service.dart';
import 'package:mobile_app/data/repositories/cotizaciones_repository.dart';
import 'package:mobile_app/data/services/api_service.dart';
import 'package:mobile_app/domain/entities/cotizacion_detalle.dart';
import 'package:mocktail/mocktail.dart';

class MockApiService extends Mock implements ApiService {}

class MockCacheService extends Mock implements CacheService {}

void main() {
  late CotizacionesRepository repository;
  late MockApiService mockApi;
  late MockCacheService mockCache;

  setUp(() {
    mockApi = MockApiService();
    mockCache = MockCacheService();
    repository = CotizacionesRepository(mockApi, mockCache);
  });

  group('CotizacionesRepository', () {
    const listCacheKey = 'cotizaciones_list';
    final testData = [
      {
        'id': '1',
        'code': 'COT-001',
        'customerName': 'Cliente 1',
        'status': 'PENDING',
        'createdAt': '2024-01-01T10:00:00Z',
        'estimatedDeliveryDate': '2024-01-10T10:00:00Z',
        'progressPercent': 0,
        'items': [],
        'progressUpdates': [],
      }
    ];

    test('obtenerTodas returns cached data if available', () async {
      // Arrange
      when(() => mockCache.get(listCacheKey)).thenReturn(testData);

      // Act
      final result = await repository.obtenerTodas();

      // Assert
      expect(result, isA<List<CotizacionDetalle>>());
      expect(result.length, 1);
      expect(result.first.code, 'COT-001');
      verify(() => mockCache.get(listCacheKey)).called(1);
      verifyZeroInteractions(mockApi);
    });

    test('obtenerTodas calls API and caches data if cache is empty', () async {
      // Arrange
      when(() => mockCache.get(listCacheKey)).thenReturn(null);
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
      final result = await repository.obtenerTodas();

      // Assert
      expect(result, isA<List<CotizacionDetalle>>());
      expect(result.length, 1);
      verify(() => mockCache.get(listCacheKey)).called(1);
      verify(() => mockApi.get('cotizaciones')).called(1);
      verify(() => mockCache.save(listCacheKey, testData, expiration: any(named: 'expiration'))).called(1);
    });

    test('obtenerTodas forces refresh calls API even if cache exists', () async {
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
      final result = await repository.obtenerTodas(forceRefresh: true);

      // Assert
      expect(result, isA<List<CotizacionDetalle>>());
      verifyNever(() => mockCache.get(any()));
      verify(() => mockApi.get('cotizaciones')).called(1);
      verify(() => mockCache.save(listCacheKey, testData, expiration: any(named: 'expiration'))).called(1);
    });
  });
}
