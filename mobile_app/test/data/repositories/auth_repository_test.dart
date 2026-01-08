import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mobile_app/data/repositories/auth_repository.dart';
import 'package:mobile_app/data/services/api_service.dart';
import 'package:mobile_app/domain/entities/user.dart';
import 'package:mocktail/mocktail.dart';

class MockApiService extends Mock implements ApiService {}

class MockFlutterSecureStorage extends Mock implements FlutterSecureStorage {}

void main() {
  late AuthRepository repository;
  late MockApiService mockApi;
  late MockFlutterSecureStorage mockStorage;

  setUp(() {
    mockApi = MockApiService();
    mockStorage = MockFlutterSecureStorage();
    repository = AuthRepository(mockApi, mockStorage);
  });

  group('AuthRepository', () {
    const email = 'test@test.com';
    const password = 'password';
    final userJson = {
      'id': '1',
      'name': 'User 1',
      'role': 'admin',
      'email': email,
    };
    final successResponse = {
      'access_token': 'token123',
      'refresh_token': 'refresh123',
      'user': userJson,
    };

    test('login returns user and tokens on success', () async {
      // Arrange
      when(() => mockApi.post('auth/login', data: any(named: 'data')))
          .thenAnswer(
        (_) async => Response(
          requestOptions: RequestOptions(path: 'auth/login'),
          data: successResponse,
          statusCode: 200,
        ),
      );
      when(() => mockStorage.write(key: any(named: 'key'), value: any(named: 'value')))
          .thenAnswer((_) async {});

      // Act
      final result = await repository.login(username: email, password: password);

      // Assert
      expect(result.$1, isA<User>());
      expect(result.$1.email, email);
      expect(result.$2, 'token123');
      expect(result.$3, 'refresh123');
      verify(() => mockApi.post('auth/login', data: {'email': email, 'password': password})).called(1);
      verify(() => mockStorage.write(key: 'token', value: 'token123')).called(1);
      verify(() => mockStorage.write(key: 'refresh_token', value: 'refresh123')).called(1);
    });

    test('login throws exception on 401', () async {
      // Arrange
      when(() => mockApi.post('auth/login', data: any(named: 'data')))
          .thenThrow(
        DioException(
          requestOptions: RequestOptions(path: 'auth/login'),
          response: Response(
            requestOptions: RequestOptions(path: 'auth/login'),
            statusCode: 401,
          ),
        ),
      );

      // Act & Assert
      expect(
        () => repository.login(username: email, password: password),
        throwsA(isA<Exception>()),
      );
    });

    test('loadToken reads from storage', () async {
      // Arrange
      when(() => mockStorage.read(key: 'token')).thenAnswer((_) async => 'token123');

      // Act
      final token = await repository.loadToken();

      // Assert
      expect(token, 'token123');
      verify(() => mockStorage.read(key: 'token')).called(1);
    });

    test('logout deletes tokens', () async {
      // Arrange
      when(() => mockStorage.delete(key: any(named: 'key'))).thenAnswer((_) async {});

      // Act
      await repository.logout();

      // Assert
      verify(() => mockStorage.delete(key: 'token')).called(1);
      verify(() => mockStorage.delete(key: 'refresh_token')).called(1);
    });
  });
}
