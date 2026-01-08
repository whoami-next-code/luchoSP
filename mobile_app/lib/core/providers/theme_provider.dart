import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../theme/app_theme.dart';

class ThemeState {
  final ThemeMode themeMode;
  final Color seedColor;

  const ThemeState({
    this.themeMode = ThemeMode.system,
    this.seedColor = AppTheme.defaultSeedColor,
  });

  ThemeState copyWith({
    ThemeMode? themeMode,
    Color? seedColor,
  }) {
    return ThemeState(
      themeMode: themeMode ?? this.themeMode,
      seedColor: seedColor ?? this.seedColor,
    );
  }
}

class ThemeNotifier extends Notifier<ThemeState> {
  @override
  ThemeState build() {
    return const ThemeState();
  }

  void setThemeMode(ThemeMode mode) {
    state = state.copyWith(themeMode: mode);
  }

  void toggleTheme() {
    final newMode = state.themeMode == ThemeMode.light
        ? ThemeMode.dark
        : ThemeMode.light;
    state = state.copyWith(themeMode: newMode);
  }

  void setSeedColor(Color color) {
    state = state.copyWith(seedColor: color);
  }
}

final themeProvider = NotifierProvider<ThemeNotifier, ThemeState>(ThemeNotifier.new);
