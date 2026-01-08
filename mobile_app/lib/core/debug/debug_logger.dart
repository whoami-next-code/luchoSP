import 'debug_logger_stub.dart'
    if (dart.library.html) 'debug_logger_web.dart'
    if (dart.library.io) 'debug_logger_io.dart' as impl;

/// Dispatch a la implementación de plataforma.
void debugLog({
  required String location,
  required String message,
  Map<String, dynamic>? data,
  String runId = 'run1',
  String hypothesisId = 'H-unknown',
}) {
  impl.debugLog(
    location: location,
    message: message,
    data: data,
    runId: runId,
    hypothesisId: hypothesisId,
  );
}

