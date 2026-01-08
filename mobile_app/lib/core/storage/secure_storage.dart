import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

const _storage = FlutterSecureStorage();

final secureStorageProvider = Provider<FlutterSecureStorage>(
  (_) => _storage,
);

