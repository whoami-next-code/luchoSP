import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../data/repositories/auth_repository.dart';
import '../../../domain/entities/user.dart';

class AuthState {
  const AuthState({
    this.user,
    this.token,
    this.refreshToken,
    this.isAuthenticated = false,
    this.isLoading = false,
    this.error,
  });

  final User? user;
  final String? token;
  final String? refreshToken;
  final bool isAuthenticated;
  final bool isLoading;
  final String? error;

  AuthState copyWith({
    User? user,
    String? token,
    String? refreshToken,
    bool? isAuthenticated,
    bool? isLoading,
    String? error,
  }) {
    return AuthState(
      user: user ?? this.user,
      token: token ?? this.token,
      refreshToken: refreshToken ?? this.refreshToken,
      isAuthenticated: isAuthenticated ?? this.isAuthenticated,
      isLoading: isLoading ?? this.isLoading,
      error: error,
    );
  }
}

class AuthController extends Notifier<AuthState> {
  late final AuthRepository _repo;

  @override
  AuthState build() {
    _repo = ref.watch(authRepositoryProvider);
    _loadSession();
    return const AuthState();
  }

  Future<void> _loadSession() async {
    final token = await _repo.loadToken();
    final refreshToken = await _repo.loadRefreshToken();
    state = state.copyWith(
      token: token,
      refreshToken: refreshToken,
      isAuthenticated: token != null && token.isNotEmpty,
    );
  }

  Future<void> login(String username, String password) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final (user, token, refreshToken) = await _repo.login(
        username: username,
        password: password,
      );
      state = state.copyWith(
        user: user,
        token: token,
        refreshToken: refreshToken,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      );
    } catch (e) {
      // Extraer solo el mensaje de error, no el stack trace completo
      String errorMessage = 'Error al iniciar sesión';
      if (e is Exception) {
        errorMessage = e.toString().replaceAll('Exception: ', '');
      } else {
        errorMessage = e.toString();
      }
      
      state = state.copyWith(
        isLoading: false,
        isAuthenticated: false,
        error: errorMessage,
      );
    }
  }

  Future<void> logout() async {
    await _repo.logout();
    state = const AuthState();
  }

  /// Permite saltar el login para navegación demo (sin token persistido).
  Future<void> skipLoginDemo() async {
    state = state.copyWith(
      user: const User(
        id: 'demo',
        name: 'Demo Técnico',
        role: 'demo',
        email: 'demo@example.com',
      ),
      token: null,
      refreshToken: null,
      isAuthenticated: true,
      isLoading: false,
      error: null,
    );
  }
}

final authControllerProvider =
    NotifierProvider<AuthController, AuthState>(AuthController.new);

/// Se expone el estado como provider separado para minimizar imports circulares.
final authStateProvider = Provider<AuthState>(
  (ref) => ref.watch(authControllerProvider),
);
