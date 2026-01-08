import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import '../debug/debug_logger.dart';

/// AppTheme manages the application's visual style.
/// It supports Material 3, Light/Dark modes, and custom color seeds.
class AppTheme {
  /// The default seed color for the application.
  /// Updated to match the "Smart Construction" Dark Blue brand color.
  static const Color defaultSeedColor = Color(0xFF03053D);

  /// Generates the ThemeData for the application.
  static ThemeData getTheme({
    required Brightness brightness,
    Color seedColor = defaultSeedColor,
  }) {
    // #region agent log
    debugLog(
      location: 'app_theme.dart:getTheme',
      message: 'theme_generated',
      data: {
        'brightness': brightness.toString(),
        'seedColor': seedColor.value.toRadixString(16),
        'font': 'DM Sans',
      },
      hypothesisId: 'H2',
      runId: 'pre-fix-2',
    );
    // #endregion

    final colorScheme = ColorScheme.fromSeed(
      seedColor: seedColor,
      brightness: brightness,
      primary: seedColor, // Ensure primary matches seed exactly
    );

    final baseTheme = ThemeData(
      useMaterial3: true,
      colorScheme: colorScheme,
      scaffoldBackgroundColor:
          brightness == Brightness.light ? const Color(0xFFF3F4F4) : Colors.grey[900], // Match light bg
      appBarTheme: AppBarTheme(
        centerTitle: false,
        elevation: 0,
        backgroundColor:
            brightness == Brightness.light ? Colors.white : Colors.grey[900],
        foregroundColor:
            brightness == Brightness.light ? const Color(0xFF03053D) : Colors.white,
        titleTextStyle: GoogleFonts.dmSans(
          color: brightness == Brightness.light ? const Color(0xFF03053D) : Colors.white,
          fontSize: 20,
          fontWeight: FontWeight.w700,
        ),
      ),
      cardTheme: CardThemeData(
        elevation: 2,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
        color: brightness == Brightness.light ? Colors.white : Colors.grey[850],
      ),
      inputDecorationTheme: InputDecorationTheme(
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
        ),
        filled: true,
        fillColor:
            brightness == Brightness.light ? Colors.white : Colors.grey[800],
        labelStyle: GoogleFonts.dmSans(),
        hintStyle: GoogleFonts.dmSans(),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          elevation: 2,
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          backgroundColor: colorScheme.primary,
          foregroundColor: colorScheme.onPrimary,
          textStyle: GoogleFonts.dmSans(
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
      floatingActionButtonTheme: FloatingActionButtonThemeData(
        backgroundColor: colorScheme.primary,
        foregroundColor: colorScheme.onPrimary,
        elevation: 4,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
      ),
      bottomNavigationBarTheme: BottomNavigationBarThemeData(
        backgroundColor:
            brightness == Brightness.light ? Colors.white : Colors.grey[900],
        selectedItemColor: colorScheme.primary,
        unselectedItemColor: Colors.grey,
        selectedLabelStyle: GoogleFonts.dmSans(fontWeight: FontWeight.w600),
        unselectedLabelStyle: GoogleFonts.dmSans(),
      ),
    );

    // Apply DM Sans font to the entire text theme
    return baseTheme.copyWith(
      textTheme: GoogleFonts.dmSansTextTheme(baseTheme.textTheme),
    );
  }
}
