// #region agent log helper (IO)
import 'dart:convert';
import 'dart:io';

/// Escribe una línea NDJSON en el log de debug mode (entornos IO).
/// No registrar secretos (contraseñas/tokens).
void debugLog({
  required String location,
  required String message,
  Map<String, dynamic>? data,
  String runId = 'run1',
  String hypothesisId = 'H-unknown',
}) {
  const logPath = r'c:\Users\USUARIO\Desktop\insdustriaSP\.cursor\debug.log';
  final payload = {
    'sessionId': 'debug-session',
    'runId': runId,
    'hypothesisId': hypothesisId,
    'location': location,
    'message': message,
    'data': data ?? <String, dynamic>{},
    'timestamp': DateTime.now().millisecondsSinceEpoch,
  };
  try {
    final file = File(logPath);
    file.parent.createSync(recursive: true);
    file.writeAsStringSync(
      '${jsonEncode(payload)}\n',
      mode: FileMode.append,
      flush: true,
    );
  } catch (_) {
    // No-op
  }
}
// #endregion

